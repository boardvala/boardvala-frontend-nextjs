"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getPricingByMaterial,
  getAllPricing,
} from "../../services/pricingService";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DimensionLine from "../../components/preview/DimensionLine";
import Swal from "sweetalert2";
import { checkImageQuality, parseFrameInches } from "../../utils/imageQuality";
import MaterialVideosModal from "../../components/MaterialVideosModal";

// Theme colors
const THEME = {
  dark: "#1b263b",
  primary: "#2563eb",
};

// Banner price calculator
function calcBannerPriceFrontend(pricing, width, length) {
  const w = Number(width);
  const l = Number(length);

  if (!w || !l || w <= 0 || l <= 0) return null;

  const rate = pricing.ratePerSqFt;
  const rolls = Array.isArray(pricing.availableRolls)
    ? [...pricing.availableRolls].sort((a, b) => a - b)
    : [];
  const minOrder = pricing.minOrderValue || 0;
  const maxLen = pricing.maxLength || Infinity;

  if (!rate || rolls.length === 0) return null;

  const shortSide = Math.min(w, l);
  const longSide = Math.max(w, l);

  if (longSide > maxLen) {
    return { error: `Maximum length is ${maxLen} ft.` };
  }

  const selectedRoll = rolls.find((roll) => roll >= shortSide);

  if (!selectedRoll) {
    return { error: `Max roll width is ${rolls[rolls.length - 1]} ft.` };
  }

  const billableSqFt = selectedRoll * longSide;
  const rawPrice = billableSqFt * rate;
  const finalPrice = Math.max(rawPrice, minOrder);

  return {
    finalPrice,
    billableSize: `${selectedRoll} ft x ${longSide} ft`,
    minOrderApplied: rawPrice < minOrder,
  };
}

export default function CustomDesignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef(null);
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const zoomRef = useRef(null); // ← जोडा

  const initialMaterial = searchParams.get("material") || "Vinyl";
  const galleryDesignId = searchParams.get("galleryDesignId") || null;
  const initialFrameSize = searchParams.get("selectedFrameSize") || "";

  const [designFile, setDesignFile] = useState(null);
  const [designUrl, setDesignUrl] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [price, setPrice] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [material, setMaterial] = useState(initialMaterial);
  const [stageWidth, setStageWidth] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [bannerSize, setBannerSize] = useState({ width: "", length: "" });
  const [bannerInfo, setBannerInfo] = useState(null);
  const [imgPixels, setImgPixels] = useState(null);
  const [qualityResult, setQualityResult] = useState(null);
  const [showVideos, setShowVideos] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeProgress, setResizeProgress] = useState(0);
  const [resizeMessage, setResizeMessage] = useState("");

  const [form, setForm] = useState({
    frameSize: "",
    orientation: "Landscape",
    instructions: "",
  });

  const isBanner = pricing?.pricingType === "banner";

  const btnStyle = (active) => ({
    backgroundColor: active ? THEME.primary : "transparent",
    borderColor: active ? THEME.primary : THEME.dark,
    color: active ? "#fff" : THEME.dark,
    fontWeight: active ? "600" : "400",
    transition: "all 0.2s ease",
  });

  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await getAllPricing();
        const materialOrder = {
          Vinyl: 1,
          Sunboard: 2,
          MDF: 3,
          Acrylic: 4,
          Banner: 5,
        };

        const sortedMaterials = [...data].sort(
          (a, b) =>
            (materialOrder[a.material] || 99) -
            (materialOrder[b.material] || 99),
        );

        setMaterials(sortedMaterials);
        if (data.length > 0) {
          setMaterial(initialMaterial || sortedMaterials[0].material);
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadMaterials();
  }, []);

  useEffect(() => {
    async function loadPricing() {
      try {
        if (!material) return;

        const pricingData = await getPricingByMaterial(material);
        setPricing(pricingData);

        if (pricingData.pricingType === "banner") {
          setForm((prev) => ({ ...prev, frameSize: "" }));
          setPrice(0);
          setBannerInfo(null);
        } else {
          const selectedSize = initialFrameSize || pricingData.framePrices[0]?.frameSize;
          const selectedPrice = pricingData.framePrices.find((item) => item.frameSize === selectedSize,)?.price ||
            pricingData.framePrices[0]?.price ||
            0;
          setForm((prev) => ({ ...prev, frameSize: selectedSize }));
          setPrice(selectedPrice);
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadPricing();
  }, [material]);

  useEffect(() => {
    if (!isBanner || !pricing) return;

    const result = calcBannerPriceFrontend(
      pricing,
      bannerSize.width,
      bannerSize.length,
    );

    if (!result) {
      setPrice(0);
      setBannerInfo(null);
      return;
    }

    if (result.error) {
      setPrice(0);
      setBannerInfo({ error: result.error });
      return;
    }

    setPrice(result.finalPrice);
    setBannerInfo({
      billableSize: result.billableSize,
      minOrderApplied: result.minOrderApplied,
    });
  }, [isBanner, pricing, bannerSize.width, bannerSize.length]);

  useEffect(() => {
    if (!designUrl) {
      setImgPixels(null);
      return;
    }
    const img = new Image();
    img.onload = () =>
      setImgPixels({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = designUrl;
  }, [designUrl]);

  useEffect(() => {
    if (!imgPixels) {
      setQualityResult(null);
      return;
    }

    let printW, printH, type;

    if (isBanner) {
      printW = Number(bannerSize.width) * 12;
      printH = Number(bannerSize.length) * 12;
      type = "banner";
    } else {
      const p = parseFrameInches(form.frameSize);
      if (!p) {
        setQualityResult(null);
        return;
      }
      printW = p.w;
      printH = p.h;
      type = "fixed";
    }

    setQualityResult(
      checkImageQuality(imgPixels.w, imgPixels.h, printW, printH, type),
    );
  }, [
    imgPixels,
    isBanner,
    bannerSize.width,
    bannerSize.length,
    form.frameSize,
  ]);

  useEffect(() => {
    if (!designFile) {
      setDesignUrl(null);
      return;
    }

    const reader = new FileReader();

    // Real progress tracking (FileReader)
    reader.onprogress = (e) => {
      if (resizing && e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 50) + 20; // 20-70%
        setResizeProgress(pct);
        setResizeMessage("Reading file...");
      }
    };

    reader.onload = () => {
      if (resizing) {
        setResizeProgress(80);
        setResizeMessage("Preparing preview...");
      }
      setDesignUrl(reader.result);
    };

    reader.onerror = () => {
      setResizing(false);
      setResizeProgress(0);
      setResizeMessage("");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Could not read this file. Please try another image.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      setDesignFile(null);
      setDesignUrl(null);
    };

    reader.readAsDataURL(designFile);
  }, [designFile]);

  useEffect(() => {
    if (resizing && designUrl) {
      setResizeProgress(100);
      setResizeMessage("Done!");
      const timer = setTimeout(() => {
        setResizing(false);
        setResizeProgress(0);
        setResizeMessage("");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [designUrl]);

  useEffect(() => {
    if (!stageRef.current) return;

    const measure = () => {
      const el = stageRef.current;
      if (el) {
        const cs = window.getComputedStyle(el);
        const padL = parseFloat(cs.paddingLeft) || 0;
        const padR = parseFloat(cs.paddingRight) || 0;
        const inner = el.clientWidth - padL - padR;
        setStageWidth(inner > 0 ? inner : 0);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(stageRef.current);

    return () => observer.disconnect();
  }, [designFile]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (name === "frameSize") {
      const selected = pricing?.framePrices.find(
        (item) => item.frameSize === value,
      );
      setPrice(selected?.price || 0);
    }
  }

  function showBannerHelp() {
    Swal.fire({
      title: "How Banner Size Works",
      html: `
      <div style="text-align:left; font-size:0.95rem; line-height:1.6;">
      <p><strong>Enter Width and Length in feet.</strong></p>
      <p>Your banner is printed on a flex roll. The available roll widths are limited, so the <strong>shorter side</strong> is matched to the nearest roll width, and the <strong>longer side</strong> becomes the length.</p>
      <p>The preview shows your banner in the shape you enter — if the length is greater it appears <strong>portrait</strong>, and if the width is greater it appears <strong>landscape</strong>.</p>
      <p style="color:#64748b;">Example: A 3 ft × 5 ft banner is billed as a 3 ft roll × 5 ft length.</p>
      </div>
    `,
      icon: "info",
      confirmButtonColor: THEME.dark,
      confirmButtonText: "Got it",
    });
  }

  function showUploadHelp() {
    Swal.fire({
      title: "Upload a High-Resolution Image",
      html: `
        <div style="text-align:left; font-size:0.95rem; line-height:1.6;">
          <p>For the best print quality, please upload a <strong>high-resolution image</strong>.</p>
          <p>When you <strong>zoom or crop</strong> your image in the workspace, only the visible part is used for printing — this reduces the effective resolution.</p>
          <p>A larger, sharper image gives you more room to zoom and still get a crisp print.</p>
          <p style="color:#64748b;">Tip: Avoid heavily zooming into small or low-quality images.</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#1b263b",
      confirmButtonText: "Got it",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!designFile || !designUrl) {
      Swal.fire({
        icon: "warning",
        title: "Upload Required",
        text: "Please upload your design before continuing.",
        confirmButtonColor: THEME.dark,
      });
      return;
    }

    if (isBanner) {
      if (!bannerSize.width || !bannerSize.length) {
        Swal.fire({
          icon: "warning",
          title: "Size Required",
          text: "Please enter banner width and length (in feet).",
          confirmButtonColor: THEME.dark,
        });
        return;
      }
      if (bannerInfo?.error) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Size",
          text: bannerInfo.error,
          confirmButtonColor: THEME.dark,
        });
        return;
      }
    }

    try {
      setSubmitting(true);
      const previewImage = await generatePreview();
      if (!previewImage) {
        setSubmitting(false);
        return; // toast आधीच दिसलं — navigate नको
      }

      const customData = {
        orderType: "customDesign",
        previewImage,
        material,
        frameSize: isBanner
          ? `${bannerSize.width} ft x ${bannerSize.length} ft`
          : form.frameSize,
        orientation: isBanner ? "" : form.orientation,
        price,
        instructions: form.instructions,
        galleryDesignId: galleryDesignId || null,
        frameWidth: frame.width,
        frameHeight: frame.height,
        bannerWidth: isBanner ? Number(bannerSize.width) : undefined,
        bannerLength: isBanner ? Number(bannerSize.length) : undefined,
      };
      localStorage.setItem("customDesignData", JSON.stringify(customData));
      router.push("/review-custom-design");
    } catch (err) {
      console.error("Preview generation failed:", err);
      setSubmitting(false);
      alert("Could not create the preview. Please try a PNG or JPG image.");
    }
  }

  function getFrameDimensions(size, orientation) {
    const match = size?.match(/(\d+)\s*[xX*]\s*(\d+)/);

    if (!match) {
      return { width: 12, height: 6 };
    }

    const first = Number(match[1]);
    const second = Number(match[2]);

    if (orientation === "Landscape") {
      return {
        width: Math.max(first, second),
        height: Math.min(first, second),
      };
    }

    return {
      width: Math.min(first, second),
      height: Math.max(first, second),
    };
  }

  async function generatePreview() {
    if (!designUrl || !imgPixels) return null;

    const MAX_EXPORT = 3000;
    const JPEG_QUALITY = 0.9;

    const state = zoomRef.current?.state || {};
    const scale = Number(state.scale) || 1;
    const positionX = Number(state.positionX) || 0;
    const positionY = Number(state.positionY) || 0;

    const natW = imgPixels.w;
    const natH = imgPixels.h;
    const frameW = previewWidth;
    const frameH = previewHeight;

    // 1. object-fit: contain dimensions
    const imageAspect = natW / natH;
    const frameAspect = frameW / frameH;

    let baseW, baseH;
    if (imageAspect > frameAspect) {
      baseW = frameW;
      baseH = frameW / imageAspect;
    } else {
      baseH = frameH;
      baseW = frameH * imageAspect;
    }

    const baseX = (frameW - baseW) / 2;
    const baseY = (frameH - baseH) / 2;

    // 2. Transformed image rectangle
    const transformedX = positionX + baseX * scale;
    const transformedY = positionY + baseY * scale;
    const transformedW = baseW * scale;
    const transformedH = baseH * scale;

    // 3. Intersection (visible area)
    const visibleLeft = Math.max(0, transformedX);
    const visibleTop = Math.max(0, transformedY);
    const visibleRight = Math.min(frameW, transformedX + transformedW);
    const visibleBottom = Math.min(frameH, transformedY + transformedH);

    if (visibleRight <= visibleLeft || visibleBottom <= visibleTop) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Image is not visible in the frame. Please reset zoom.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return null;
    }

    // 4. Map to original image pixels
    const srcX = ((visibleLeft - transformedX) / transformedW) * natW;
    const srcY = ((visibleTop - transformedY) / transformedH) * natH;
    const srcW = ((visibleRight - visibleLeft) / transformedW) * natW;
    const srcH = ((visibleBottom - visibleTop) / transformedH) * natH;

    // 5. Safe clamp (prevent black/empty areas)
    const safeSrcX = Math.max(0, Math.min(srcX, natW));
    const safeSrcY = Math.max(0, Math.min(srcY, natH));
    const safeSrcRight = Math.max(safeSrcX, Math.min(srcX + srcW, natW));
    const safeSrcBottom = Math.max(safeSrcY, Math.min(srcY + srcH, natH));
    const safeSrcW = safeSrcRight - safeSrcX;
    const safeSrcH = safeSrcBottom - safeSrcY;

    if (safeSrcW <= 0 || safeSrcH <= 0) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:
          "Could not capture the design. Please adjust zoom and try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return null;
    }

    // 6. Export dimensions (max 3000px, maintain aspect)
    const cropAspect = safeSrcW / safeSrcH;
    let exportW, exportH;

    if (cropAspect >= 1) {
      exportW = Math.min(Math.round(safeSrcW), MAX_EXPORT);
      exportH = Math.round(exportW / cropAspect);
    } else {
      exportH = Math.min(Math.round(safeSrcH), MAX_EXPORT);
      exportW = Math.round(exportH * cropAspect);
    }

    // 7. Canvas draw + export
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = exportW;
          canvas.height = exportH;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }

          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, exportW, exportH);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(
            img,
            safeSrcX,
            safeSrcY,
            safeSrcW,
            safeSrcH,
            0,
            0,
            exportW,
            exportH,
          );

          resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
        } catch {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Could not create preview. Please try a different image.",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          resolve(null);
        }
      };

      img.onerror = () => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Could not load image. Please try uploading again.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        resolve(null);
      };

      img.src = designUrl;
    });
  }

  const frame = isBanner
    ? {
        width: Number(bannerSize.width) || 1,
        height: Number(bannerSize.length) || 1,
      }
    : getFrameDimensions(form.frameSize, form.orientation);

  const V_LINE_SPACE = 40;
  const PREFERRED_MAX = 460;

  const availableForFrame =
    stageWidth > 0 ? stageWidth - V_LINE_SPACE : PREFERRED_MAX;

  const MAX_SIDE = Math.max(160, Math.min(PREFERRED_MAX, availableForFrame));

  let previewWidth;
  let previewHeight;

  if (frame.width >= frame.height) {
    previewWidth = MAX_SIDE;
    previewHeight = (MAX_SIDE * frame.height) / frame.width;
  } else {
    previewHeight = MAX_SIDE;
    previewWidth = (MAX_SIDE * frame.width) / frame.height;

    if (previewWidth > availableForFrame) {
      const shrink = availableForFrame / previewWidth;
      previewWidth *= shrink;
      previewHeight *= shrink;
    }
  }

  function handleDesignFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
    const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".svg"];
    const MAX_SIZE = 100 * 1024 * 1024;
    const MAX_NAME_LENGTH = 100;

    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext),
    );
    const hasValidType = ALLOWED_TYPES.includes(file.type);

    if (!hasValidExt || !hasValidType) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Only PNG, JPG, JPEG and SVG files are allowed.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Max file size is 100 MB.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      e.target.value = "";
      return;
    }

    if (file.name.length > MAX_NAME_LENGTH) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "File name should be under 100 characters.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      e.target.value = "";
      return;
    }

    const isLargeFile = file.size > 1 * 1024 * 1024;

    if (isLargeFile) {
      setResizing(true);
      setResizeProgress(10);
      setResizeMessage("Loading image...");
    }

    // setDesignFile → triggers existing useEffect chain
    setDesignFile(file);
    e.target.value = "";
  }

  return (
    <>
      {resizing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "32px 40px",
              maxWidth: "360px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="bi bi-image"
                style={{ fontSize: "24px", color: "#2563eb" }}
              ></i>
            </div>

            <h5 className="fw-bold mb-2" style={{ color: "#1b263b" }}>
              Optimizing Image
            </h5>

            <p className="text-muted mb-3" style={{ fontSize: "0.85rem" }}>
              {resizeMessage}
            </p>

            <div
              style={{
                width: "100%",
                height: "8px",
                background: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${resizeProgress}%`,
                  background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
                  borderRadius: "999px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            <span
              className="fw-semibold"
              style={{ color: "#2563eb", fontSize: "0.9rem" }}
            >
              {resizeProgress}%
            </span>
          </div>
        </div>
      )}

      <div className="container-fluid py-4 py-md-5 px-3 px-md-4 bg-light">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
              {/* Header */}
              <div
                className="card-header text-white py-3 px-4"
                style={{
                  background: `linear-gradient(135deg, ${THEME.dark}, #243c63)`,
                }}
              >
                <h5 className="mb-0 fs-6 fs-md-4 fw-semibold">
                  Upload Your Design &amp; Select Material - Size
                </h5>
              </div>

              <div className="card-body p-3 p-md-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* ======================================================== */}
                    {/* LEFT COLUMN (Desktop) / FIRST (Mobile) - WORKSPACE STAGE  */}
                    {/* ======================================================== */}
                    <div className="col-12 col-lg-7 col-xl-7 order-1 order-lg-1">
                      <div className="d-flex flex-column h-100">
                        {/* Title & Info */}
                        <div className="mb-3">
                          <label className="form-label fw-bold mb-0 fs-5 d-flex align-items-center gap-2">
                            <i className="bi bi-aspect-ratio text-primary"></i>
                            Design Workspace
                            <i
                              className="bi bi-info-circle-fill fs-6 text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={showUploadHelp}
                              title="Image quality tips"
                            ></i>
                          </label>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".png,.jpg,.jpeg,.svg"
                          style={{ display: "none" }}
                          onChange={handleDesignFile}
                        />

                        {/* Plain Cream Wall Workspace Stage */}
                        <div
                          ref={stageRef}
                          className="border rounded-3 position-relative d-flex justify-content-center align-items-center flex-grow-1"
                          style={{
                            minHeight: "clamp(350px, 50vw, 520px)",
                            padding: "30px 20px 45px 20px",
                            cursor: !designFile ? "pointer" : "default",
                            overflow: "hidden",
                            background:
                              "radial-gradient(circle at 50% 25%, #fbf8f3 0%, #f3ece1 70%, #e8decb 100%)",
                            boxShadow: "inset 0 0 30px rgba(0,0,0,0.06)",
                          }}
                          onClick={() => {
                            if (!designFile) fileInputRef.current.click();
                          }}
                        >
                          {/* Wall Baseboard Trim */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: "20px",
                              background:
                                "linear-gradient(180deg, #d8cbba 0%, #bcae9b 100%)",
                              borderTop: "2px solid #a89a87",
                              boxShadow: "0 -2px 4px rgba(0,0,0,0.08)",
                              zIndex: 2,
                            }}
                          />

                          {!designFile ? (
                            <div
                              className="text-center py-4 px-4 rounded-3 border shadow-sm"
                              style={{
                                background: "rgba(255, 255, 255, 0.88)",
                                backdropFilter: "blur(6px)",
                                maxWidth: "340px",
                                width: "90%",
                                zIndex: 3,
                              }}
                            >
                              <i className="bi bi-cloud-arrow-up display-4 text-primary"></i>
                              <h5
                                className="mt-3 fw-bold"
                                style={{ color: THEME.dark }}
                              >
                                Upload Your Artwork
                              </h5>
                              <p className="text-muted small mb-3">
                                Click anywhere to select PNG, JPG, JPEG, or SVG
                                file
                              </p>
                              <button
                                type="button"
                                className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                                style={{ backgroundColor: THEME.primary }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current.click();
                                }}
                              >
                                <i className="bi bi-folder2-open me-2"></i>
                                Choose File
                              </button>
                            </div>
                          ) : (
                            <div
                              className="d-flex flex-column align-items-center w-100"
                              style={{ zIndex: 3 }}
                            >
                              <TransformWrapper
                                ref={zoomRef}
                                initialScale={1}
                                minScale={0.5}
                                maxScale={4}
                                centerOnInit
                                limitToBounds={false}
                                smooth={true}
                                animationTime={200}
                                wheel={{ step: 0.0001 }}
                                pinch={{ step: 3 }}
                                doubleClick={{ disabled: true }}
                                panning={{ velocityDisabled: true }}
                              >
                                {({ zoomIn, zoomOut, resetTransform }) => (
                                  <>
                                    <div className="d-flex flex-column align-items-center">
                                      <DimensionLine
                                        length={previewWidth}
                                        label={
                                          isBanner
                                            ? `${frame.width} ft`
                                            : frame.width
                                        }
                                      />

                                      <div className="d-flex align-items-center">
                                        <DimensionLine
                                          length={previewHeight}
                                          label={
                                            isBanner
                                              ? `${frame.height} ft`
                                              : frame.height
                                          }
                                          direction="vertical"
                                        />

                                        <div
                                          ref={frameRef}
                                          className="bg-white border"
                                          style={{
                                            width: previewWidth,
                                            height: previewHeight,
                                            maxWidth: "100%",
                                            overflow: "hidden",
                                            borderRadius: "6px",
                                            boxShadow:
                                              "0 15px 35px rgba(0, 0, 0, 0.25), 0 5px 12px rgba(0, 0, 0, 0.15)",
                                          }}
                                        >
                                          <TransformComponent
                                            wrapperStyle={{
                                              width: "100%",
                                              height: "100%",
                                              overflow: "hidden",
                                            }}
                                            contentStyle={{
                                              width: "100%",
                                              height: "100%",
                                            }}
                                          >
                                            <img
                                              src={designUrl}
                                              alt="Custom Design"
                                              draggable={false}
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                display: "block",
                                                userSelect: "none",
                                                pointerEvents: "none",
                                              }}
                                            />
                                          </TransformComponent>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Zoom, 360° & Change Controls */}
                                    <div className="mt-3 d-flex flex-wrap justify-content-center align-items-center gap-2">
                                      <div className="btn-group bg-white rounded shadow-sm">
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-dark"
                                          onClick={() => zoomOut(0.01)}
                                          title="Zoom out"
                                        >
                                          −
                                        </button>

                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-secondary"
                                          onClick={() => resetTransform()}
                                          title="Reset zoom & position"
                                        >
                                          Reset Zoom
                                        </button>

                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-dark"
                                          onClick={() => zoomIn(0.01)}
                                          title="Zoom in"
                                        >
                                          +
                                        </button>
                                      </div>

                                      <button
                                        type="button"
                                        className="btn btn-sm text-white shadow-sm"
                                        style={{ backgroundColor: THEME.dark }}
                                        onClick={() =>
                                          fileInputRef.current.click()
                                        }
                                        title="Upload a different image"
                                      >
                                        <i className="bi bi-arrow-repeat me-1"></i>
                                        Change Image
                                      </button>
                                    </div>

                                    {/* Image Quality Notification */}
                                    {qualityResult && (
                                      <div
                                        className="d-flex align-items-start gap-2 p-2 rounded mt-2 shadow-sm"
                                        style={{
                                          background:
                                            qualityResult.level === "excellent"
                                              ? "#dcfce7"
                                              : qualityResult.level === "good"
                                                ? "#fef9c3"
                                                : "#fee2e2",
                                          color:
                                            qualityResult.level === "excellent"
                                              ? "#166534"
                                              : qualityResult.level === "good"
                                                ? "#854d0e"
                                                : "#991b1b",
                                          fontSize: "0.85rem",
                                        }}
                                      >
                                        <i
                                          className={`bi ${
                                            qualityResult.level === "excellent"
                                              ? "bi-check-circle-fill"
                                              : qualityResult.level === "good"
                                                ? "bi-exclamation-circle-fill"
                                                : "bi-x-circle-fill"
                                          } `}
                                        ></i>
                                        <span>{qualityResult.message}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </TransformWrapper>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* RIGHT COLUMN (Desktop) / SECOND (Mobile) - SIZING & OPTS */}
                    {/* ======================================================== */}
                    <div className="col-12 col-lg-5 col-xl-5 order-2 order-lg-2">
                      <div className="card border shadow-sm p-3 p-md-4 rounded-3 h-100 bg-light-subtle">
                        <h5
                          className="fw-bold mb-3 border-bottom pb-2"
                          style={{ color: THEME.dark }}
                        >
                          <i className="bi bi-sliders me-2 text-primary"></i>
                          Options &amp; Sizing
                        </h5>

                        {/* Material Selection */}
                        <div className="mb-4">
                          <label className="form-label fw-semibold d-flex align-items-center gap-2 flex-wrap">
                            1. Select Material
                            {/* <button
                              type="button"
                              onClick={() => setShowVideos(true)}
                              className="btn btn-sm p-0"
                              style={{
                                color: "#2563eb",
                                background: "none",
                                border: "none",
                                textDecoration: "underline",
                                fontSize: "0.85rem",
                              }}
                            >
                              <i className="bi bi-play-circle me-1"></i>
                              Not sure? Watch videos
                            </button> */}
                          </label>
                          <div className="d-flex flex-wrap gap-2">
                            {materials.map((item) => (
                              <button
                                key={item.material}
                                type="button"
                                className="btn btn-sm px-3 py-2 flex-fill rounded"
                                style={btnStyle(material === item.material)}
                                onClick={() => setMaterial(item.material)}
                              >
                                {item.material}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Orientation Selection (Hidden for Banner) */}
                        {!isBanner && (
                          <div className="mb-4">
                            <label className="form-label fw-semibold">
                              2. Orientation
                            </label>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm px-3 py-2 flex-fill rounded"
                                style={btnStyle(
                                  form.orientation === "Portrait",
                                )}
                                onClick={() =>
                                  setForm({ ...form, orientation: "Portrait" })
                                }
                              >
                                <i className="bi bi-phone me-1"></i> Portrait
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm px-3 py-2 flex-fill rounded"
                                style={btnStyle(
                                  form.orientation === "Landscape",
                                )}
                                onClick={() =>
                                  setForm({ ...form, orientation: "Landscape" })
                                }
                              >
                                <i className="bi bi-aspect-ratio me-1"></i>{" "}
                                Landscape
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Size Selection */}
                        {isBanner ? (
                          <div className="mb-4">
                            <label className="form-label fw-semibold d-flex align-items-center gap-2">
                              2. Banner Size (feet)
                              <i
                                className="bi bi-info-circle-fill text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={showBannerHelp}
                                title="How banner size works"
                              ></i>
                            </label>

                            <div className="row g-2">
                              <div className="col-6">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Width (ft)"
                                  min="0"
                                  value={bannerSize.width}
                                  onChange={(e) =>
                                    setBannerSize({
                                      ...bannerSize,
                                      width: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="col-6">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Length (ft)"
                                  min="0"
                                  value={bannerSize.length}
                                  onChange={(e) =>
                                    setBannerSize({
                                      ...bannerSize,
                                      length: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            {bannerInfo?.billableSize && (
                              <small className="d-block mt-2 text-primary fw-medium">
                                Billed as {bannerInfo.billableSize}
                                {bannerInfo.minOrderApplied
                                  ? " (minimum order applied)"
                                  : ""}
                              </small>
                            )}
                            {bannerInfo?.error && (
                              <small className="text-danger d-block mt-2 fw-medium">
                                {bannerInfo.error}
                              </small>
                            )}
                          </div>
                        ) : (
                          <div className="mb-4">
                            <label className="form-label fw-semibold">
                              3. Select Size
                            </label>
                            <div className="row g-2">
                              {pricing?.framePrices?.map((item) => (
                                <div
                                  key={item.frameSize}
                                  className="col-4 col-sm-4"
                                >
                                  <button
                                    type="button"
                                    className="btn w-100 btn-sm py-2 px-1 rounded text-truncate"
                                    style={btnStyle(
                                      form.frameSize === item.frameSize,
                                    )}
                                    onClick={() => {
                                      setForm({
                                        ...form,
                                        frameSize: item.frameSize,
                                      });
                                      setPrice(item.price);
                                    }}
                                  >
                                    {item.frameSize}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price Card */}
                        <div className="mb-4">
                          <div
                            className="d-flex justify-content-between align-items-center border rounded-3 p-3 shadow-sm"
                            style={{ background: "#ffffff" }}
                          >
                            <div>
                              <h6
                                className="mb-0 fw-bold"
                                style={{ color: THEME.dark }}
                              >
                                Total Price
                              </h6>
                              <small className="text-muted">
                                {isBanner
                                  ? "Based on roll size"
                                  : "Material & size included"}
                              </small>
                            </div>

                            <div className="text-end">
                              <h3
                                className="fw-bold mb-0"
                                style={{ color: THEME.primary }}
                              >
                                ₹ {price}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="mb-4">
                          <label className="form-label fw-semibold">
                            Special Instructions
                          </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="instructions"
                            value={form.instructions}
                            onChange={handleChange}
                            placeholder="Write any additional instructions (optional)"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-auto pt-2">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 py-3 fw-bold text-white shadow-sm"
                            style={{ backgroundColor: THEME.primary }}
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Creating Preview...
                              </>
                            ) : (
                              <>
                                Continue to Review{" "}
                                <i className="bi bi-arrow-right ms-2"></i>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showVideos && (
        <MaterialVideosModal onClose={() => setShowVideos(false)} />
      )}
    </>
  );
}
