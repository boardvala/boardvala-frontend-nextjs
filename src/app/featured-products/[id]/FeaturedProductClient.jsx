"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ProductCard from "../../../components/product/ProductCard";
import ReviewSection from "../../../components/review/ReviewSection";
import { getGalleryImage } from "../../../utils/imageUtils";
import { checkDeliveryByPincode } from "../../../services/deliveryService";
import { checkImageQuality } from "../../../utils/imageQuality";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import dynamic from "next/dynamic";
const LED3DPreview = dynamic(
  () => import("../../../components/led/LED3DPreview"),
  { ssr: false },
);
import "../../../styles/featured-details.css";

export default function FeaturedProductClient({ product, similar }) {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);

  // LED Frame — studio mode
  const [studioMode, setStudioMode] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);

  // Photo zoom & drag
  // Photo zoom & drag (react-zoom-pan-pinch)
  const zoomRef = useRef(null);
  const [show3D, setShow3D] = useState(false);
  const [croppedFor3D, setCroppedFor3D] = useState(null);
  const [imageQuality, setImageQuality] = useState(null);
  const [photoDimensions, setPhotoDimensions] = useState(null);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(getGalleryImage(product.images[0]));
    }
    // Auto-select first size (LED Frame)
    if (product?.isCustomizable && product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container py-5">
        <h2>Product Not Found</h2>
        <button
          className="btn btn-outline-dark mt-3"
          onClick={() => router.back()}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // ---------- Pricing ----------
  const isBanner = product.category?.toLowerCase() === "banner";
  const isCustomizable = product.isCustomizable && product.sizes?.length > 0;
  const selectedPrice =
    isCustomizable && selectedSize ? selectedSize.price : product.price;

  // Parse size dimensions string "9 × 12 inch" → { w: 9, h: 12 }
  function parseSizeDimensions(dimStr) {
    const match = dimStr?.match(/(\d+(?:\.\d+)?)\s*[xX×*]\s*(\d+(?:\.\d+)?)/);
    if (!match) return null;
    return { w: Number(match[1]), h: Number(match[2]) };
  }

  // ---------- Photo Upload (LED Frame) ----------
  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "warning", title: "Only image files allowed." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({ icon: "warning", title: "File size must be under 10MB." });
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedPhoto(file);
    setPhotoPreview(url);
    if (zoomRef.current) zoomRef.current.resetTransform();

    // Check image quality
    const img = new Image();
    img.onload = () => {
      setPhotoDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      if (selectedSize) {
        const dims = parseSizeDimensions(selectedSize.dimensions);
        console.log("dims", dims);
        if (dims) {
          const quality = checkImageQuality(
            img.naturalWidth,
            img.naturalHeight,
            dims.w,
            dims.h,
            "fixed",
          );
          setImageQuality(quality);
        }
      }
    };
    img.src = url;
  }

  function handleRemovePhoto() {
    setUploadedPhoto(null);
    setPhotoPreview("");
    setImageQuality(null);
    setPhotoDimensions(null);
    if (zoomRef.current) zoomRef.current.resetTransform();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Generate preview — same proven approach as custom design studio
  async function generateLedPreview(
    photoSrc,
    scale,
    positionX,
    positionY,
    frameW,
    frameH,
    isThumbnail = false,
  ) {
    const MAX_EXPORT = isThumbnail ? 300 : 3000;
    const JPEG_QUALITY = isThumbnail ? 0.6 : 0.9;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const natW = img.naturalWidth;
          const natH = img.naturalHeight;

          // 1. object-fit: cover dimensions
          const imageAspect = natW / natH;
          const frameAspect = frameW / frameH;

          let baseW, baseH;
          if (imageAspect > frameAspect) {
            baseH = frameH;
            baseW = frameH * imageAspect;
          } else {
            baseW = frameW;
            baseH = frameW / imageAspect;
          }

          const baseX = (frameW - baseW) / 2;
          const baseY = (frameH - baseH) / 2;

          // 2. Transformed image rectangle
          const transformedX = positionX + baseX * scale;
          const transformedY = positionY + baseY * scale;
          const transformedW = baseW * scale;
          const transformedH = baseH * scale;

          // 3. Visible area (intersection with frame)
          const visibleLeft = Math.max(0, transformedX);
          const visibleTop = Math.max(0, transformedY);
          const visibleRight = Math.min(frameW, transformedX + transformedW);
          const visibleBottom = Math.min(frameH, transformedY + transformedH);

          if (visibleRight <= visibleLeft || visibleBottom <= visibleTop) {
            resolve(null);
            return;
          }

          // 4. Map to original image pixels
          const srcX = ((visibleLeft - transformedX) / transformedW) * natW;
          const srcY = ((visibleTop - transformedY) / transformedH) * natH;
          const srcW = ((visibleRight - visibleLeft) / transformedW) * natW;
          const srcH = ((visibleBottom - visibleTop) / transformedH) * natH;

          // 5. Safe clamp
          const safeSrcX = Math.max(0, Math.min(srcX, natW));
          const safeSrcY = Math.max(0, Math.min(srcY, natH));
          const safeSrcRight = Math.max(safeSrcX, Math.min(srcX + srcW, natW));
          const safeSrcBottom = Math.max(safeSrcY, Math.min(srcY + srcH, natH));
          const safeSrcW = safeSrcRight - safeSrcX;
          const safeSrcH = safeSrcBottom - safeSrcY;

          if (safeSrcW <= 0 || safeSrcH <= 0) {
            resolve(null);
            return;
          }

          // 6. Export dimensions
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
          resolve(null);
        }
      };

      img.onerror = () => resolve(null);
      img.src = photoSrc;
    });
  }

  // ---------- Cart ----------
  async function handleAddToCart() {
    const cart = JSON.parse(localStorage.getItem("customCart")) || [];

    // Customizable — photo required!
    if (isCustomizable && !photoPreview) {
      Swal.fire({
        icon: "warning",
        title: "Photo Required",
        text: "Please upload your photo to order this frame.",
      });
      return;
    }

    // LED Frame — capture cropped/zoomed photo
    let cartThumbnail = null;
    let croppedPhoto = null;

    if (isCustomizable && photoPreview) {
      try {
        const photoEl = document.querySelector(".led-photo-container");
        const frameW = photoEl?.offsetWidth || 300;
        const frameH = photoEl?.offsetHeight || 400;

        // Get zoom state from react-zoom-pan-pinch
        const state = zoomRef.current?.state || {};
        const scale = Number(state.scale) || 1;
        const positionX = Number(state.positionX) || 0;
        const positionY = Number(state.positionY) || 0;

        // Generate preview (same as custom design studio!)
        croppedPhoto = await generateLedPreview(
          photoPreview,
          scale,
          positionX,
          positionY,
          frameW,
          frameH,
        );

        // Thumbnail (small version for cart)
        cartThumbnail = await generateLedPreview(
          photoPreview,
          scale,
          positionX,
          positionY,
          frameW,
          frameH,
          true,
        );

        if (!croppedPhoto) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Could not capture photo. Please adjust zoom and try again.",
            showConfirmButton: false,
            timer: 3000,
          });
          return;
        }
      } catch (err) {
        console.log("Capture error:", err);
        cartThumbnail = photoPreview;
        croppedPhoto = photoPreview;
      }
    }

    // Duplicate check — same product already in cart?
    const existingIndex = cart.findIndex(
      (item) =>
        item.orderType === (isCustomizable ? "ledFrame" : "featuredProduct") &&
        item.featuredProductId === product._id &&
        (!isCustomizable ||
          item.frameSize ===
            `${selectedSize?.name} (${selectedSize?.dimensions})`),
    );

    if (existingIndex >= 0 && !isCustomizable) {
      // Normal product — quantity increase
      cart[existingIndex].quantity += quantity;
    } else {
      // New item (LED frame = always new — each photo different)
      cart.push({
        id: Date.now(),
        orderType: isCustomizable ? "ledFrame" : "featuredProduct",
        featuredProductId: product._id,
        name: product.title,
        previewImage:
          isCustomizable && cartThumbnail
            ? cartThumbnail
            : product.images?.[0]
              ? getGalleryImage(product.images[0])
              : "",
        price: selectedPrice,
        quantity,
        material: product.material || "",
        frameSize:
          isCustomizable && selectedSize
            ? `${selectedSize.name} (${selectedSize.dimensions})`
            : product.size || "",
        isCustomizable: isCustomizable || false,
        customPhoto: isCustomizable ? croppedPhoto : null,
      });
    }

    try {
      localStorage.setItem("customCart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartChanged"));
    } catch (e) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Cart storage full. Please checkout current items first.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    router.push("/cart");
  }

  // ---------- Delivery Check ----------
  async function handleCheckDelivery() {
    setChecking(true);
    try {
      const result = await checkDeliveryByPincode(pincode);
      setDeliveryResult(result);
    } catch (err) {
      console.log(err);
      setDeliveryResult({ available: false });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="fpd-wrap py-4 py-md-5">
      <div className="container">
        <div className="fpd-grid">
          {/* ---- Media (left) ---- */}

          {/* ---- Media (left) ---- */}
          <div className="fpd-media">
            {isCustomizable && studioMode ? (
              /* ---- STUDIO MODE ---- */

              <div className="led-studio">
                {/* Bedroom + Frame + Photo Mockup */}
                <div
                  className="led-mockup-container"
                  style={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  {/* Layer 1: Bedroom Background */}
                  <img
                    src="/studio/Wall-bedroom.png"
                    alt="Bedroom wall background"
                    style={{
                      width: "100%",
                      display: "block",
                    }}
                  />

                  {/* Layer 2: User Photo (inside frame area) */}
                  {photoPreview && (
                    <div
                      className="led-photo-container"
                      style={{
                        position: "absolute",
                        top: "9.5%",
                        left: "34%",
                        width: "36%",
                        height: "49%",
                        overflow: "hidden",
                        zIndex: 4,
                      }}
                    >
                      <TransformWrapper
                        ref={zoomRef}
                        initialScale={1}
                        minScale={0.5}
                        maxScale={3}
                        wheel={{ step: 0.001 }}
                        pinch={{ step: 5 }}
                        doubleClick={{ disabled: true }}
                      >
                        <TransformComponent
                          wrapperStyle={{ width: "100%", height: "100%" }}
                          contentStyle={{ width: "100%", height: "100%" }}
                        >
                          <img
                            src={photoPreview}
                            alt="Your photo inside LED frame"
                            draggable={false}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                  )}

                  {/* Layer 3: LED Frame (on top) */}
                  <img
                    src="/studio/led-frame.jpg"
                    alt="LED Slim Photo Frame"
                    style={{
                      position: "absolute",
                      top: "8%",
                      left: "32%",
                      width: "40%",
                      height: "52%",
                      objectFit: "fill",
                      zIndex: 3,
                    }}
                  />

                  {/* LED Glow Effect */}
                  {photoPreview && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8%",
                        left: "32%",
                        width: "40%",
                        height: "52%",
                        boxShadow:
                          "0 0 40px rgba(255,255,255,0.25), 0 0 80px rgba(255,255,255,0.1)",
                        zIndex: 4,
                        pointerEvents: "none",
                        borderRadius: "2px",
                      }}
                    />
                  )}

                  {/* Upload placeholder (no photo yet) */}
                  {!photoPreview && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: "absolute",
                        top: "10%",
                        left: "34%",
                        width: "36%",
                        height: "48%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        cursor: "pointer",
                        zIndex: 6,
                        background: "transparent",
                        gap: "8px",
                        padding: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          border: "2px dashed #94a3b8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="bi bi-camera"
                          style={{ fontSize: "1.4rem", color: "#64748b" }}
                        ></i>
                      </div>
                      <p
                        style={{
                          color: "#475569",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          margin: 0,
                          textAlign: "center",
                        }}
                      >
                        Tap to upload
                      </p>
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.65rem",
                          margin: 0,
                        }}
                      >
                        your photo here
                      </p>
                    </div>
                  )}

                  {/* Size label */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      padding: "4px 14px",
                      borderRadius: "20px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      zIndex: 5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedSize
                      ? `${selectedSize.name} — ${selectedSize.dimensions}`
                      : "Select size"}
                  </div>
                </div>

                {/* Image Quality Indicator */}
                {photoPreview && imageQuality && (
                  <div
                    className="d-flex align-items-center justify-content-center gap-2 mt-3"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      background:
                        imageQuality.level === "excellent"
                          ? "rgba(22,163,74,0.15)"
                          : imageQuality.level === "good"
                            ? "rgba(217,119,6,0.15)"
                            : "rgba(220,38,38,0.15)",
                      color:
                        imageQuality.level === "excellent"
                          ? "#16a34a"
                          : imageQuality.level === "good"
                            ? "#d97706"
                            : "#dc2626",
                    }}
                  >
                    <i
                      className={`bi ${
                        imageQuality.level === "excellent"
                          ? "bi-check-circle-fill"
                          : imageQuality.level === "good"
                            ? "bi-exclamation-triangle-fill"
                            : "bi-x-circle-fill"
                      }`}
                    ></i>
                    <span>{imageQuality.message}</span>
                    <small style={{ opacity: 0.7 }}>
                      ({imageQuality.dpi} DPI)
                    </small>
                  </div>
                )}

                {/* Studio controls */}
                <div
                  className="d-flex justify-content-center gap-2 mt-3 mb-2"
                  style={{ padding: "12px 0" }}
                >
                  {photoPreview && (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={async () => {
                          // Capture cropped image for 3D preview
                          const photoEl = document.querySelector(
                            ".led-photo-container",
                          );
                          const frameW = photoEl?.offsetWidth || 300;
                          const frameH = photoEl?.offsetHeight || 400;
                          const state = zoomRef.current?.state || {};
                          const scale = Number(state.scale) || 1;
                          const positionX = Number(state.positionX) || 0;
                          const positionY = Number(state.positionY) || 0;

                          const cropped = await generateLedPreview(
                            photoPreview,
                            scale,
                            positionX,
                            positionY,
                            frameW,
                            frameH,
                          );
                          setCroppedFor3D(cropped || photoPreview);
                          setShow3D(true);
                        }}
                        style={{
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, #2563eb, #7c3aed)",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        <i className="bi bi-badge-3d me-1"></i>3D Preview
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => zoomRef.current?.zoomIn(0.1)}
                        style={{ borderRadius: "10px" }}
                      >
                        <i className="bi bi-zoom-in"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => zoomRef.current?.zoomOut(0.1)}
                        style={{ borderRadius: "10px" }}
                      >
                        <i className="bi bi-zoom-out"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => zoomRef.current?.resetTransform()}
                        style={{ borderRadius: "10px" }}
                      >
                        <i className="bi bi-arrows-angle-contract me-1"></i>
                        Reset
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ borderRadius: "10px" }}
                      >
                        <i className="bi bi-arrow-repeat me-1"></i>Change
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleRemovePhoto}
                        style={{ borderRadius: "10px" }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-dark"
                    onClick={() => setStudioMode(false)}
                    style={{ borderRadius: "10px" }}
                  >
                    ← Back to Product
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              /* ---- NORMAL PRODUCT IMAGES ---- */
              <>
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="fpd-main-img"
                  />
                )}
                {product.images.length > 1 && (
                  <div className="fpd-thumbs">
                    {product.images.map((image, index) => {
                      const src = getGalleryImage(image);
                      if (!src) return null;
                      return (
                        <img
                          key={index}
                          src={src}
                          alt={`${product.title} ${index + 1}`}
                          className={`fpd-thumb ${
                            selectedImage === src ? "active" : ""
                          }`}
                          onClick={() => setSelectedImage(src)}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ---- Info (right) ---- */}
          <div className="fpd-info">
            {product.category && (
              <div className="fpd-cat">{product.category}</div>
            )}

            <h1 className="fpd-title">{product.title}</h1>

            <div className="fpd-price">
              {isBanner ? (
                <span style={{ fontSize: "1.1rem" }}>Starting @ ₹ 500</span>
              ) : isCustomizable ? (
                <span>
                  ₹ {selectedPrice}{" "}
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                    ({selectedSize?.name} size)
                  </small>
                </span>
              ) : (
                `₹ ${selectedPrice}`
              )}
            </div>

            {product.inStock ? (
              <span className="fpd-stock-in">In Stock</span>
            ) : (
              <span className="fpd-stock-out">Out of Stock</span>
            )}

            {/* Specifications */}
            <div className="mt-4">
              <p className="fpd-section-head">Product Specifications</p>
              <div
                className="rounded"
                style={{ border: "1px solid #e5e7eb", overflow: "hidden" }}
              >
                <div
                  className="d-flex justify-content-between px-3 py-2"
                  style={{ background: "#f8f9fa" }}
                >
                  <span className="text-muted">Material</span>
                  <span className="fw-semibold">{product.material || "-"}</span>
                </div>
                {!isCustomizable && (
                  <div
                    className="d-flex justify-content-between px-3 py-2"
                    style={{ borderTop: "1px solid #e5e7eb" }}
                  >
                    <span className="text-muted">Size</span>
                    <span className="fw-semibold">{product.size || "-"}</span>
                  </div>
                )}
                <div
                  className="d-flex justify-content-between px-3 py-2"
                  style={{
                    background: "#f8f9fa",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <span className="text-muted">Thickness</span>
                  <span className="fw-semibold">
                    {product.thickness || "-"}
                  </span>
                </div>
                <div
                  className="d-flex justify-content-between px-3 py-2"
                  style={{ borderTop: "1px solid #e5e7eb" }}
                >
                  <span className="text-muted">Waterproof</span>
                  <span className="fw-semibold">
                    {product.waterproof ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Size Selector — LED Frame */}
            {isCustomizable && product.sizes?.length > 0 && (
              <div className="mt-4">
                <p className="fpd-section-head">Choose Size</p>
                <div className="d-flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      className={`btn btn-sm ${
                        selectedSize?.name === s.name
                          ? "btn-dark"
                          : "btn-outline-dark"
                      }`}
                      onClick={() => {
                        setSelectedSize(s);
                        // Re-check quality for new size
                        if (photoDimensions) {
                          const dims = parseSizeDimensions(s.dimensions);
                          if (dims) {
                            const quality = checkImageQuality(
                              photoDimensions.w,
                              photoDimensions.h,
                              dims.w,
                              dims.h,
                              "fixed",
                            );
                            setImageQuality(quality);
                          }
                        }
                      }}
                      style={{ borderRadius: "10px", padding: "8px 16px" }}
                    >
                      <strong>{s.name}</strong>
                      <br />
                      <small>
                        {s.dimensions} — ₹{s.price}
                      </small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Upload — LED Frame */}
            {/* Customize Button — LED Frame */}
            {isCustomizable && !studioMode && (
              <div className="mt-4">
                <button
                  className="btn w-100 text-white fw-bold"
                  onClick={() => setStudioMode(true)}
                  style={{
                    background:
                      "linear-gradient(135deg, #1b263b 0%, #2563eb 100%)",
                    padding: "14px",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    border: "none",
                  }}
                >
                  <i className="bi bi-palette me-2"></i>
                  Customize — Upload Your Photo →
                </button>
                <p
                  className="text-muted text-center mt-2"
                  style={{ fontSize: "0.78rem" }}
                >
                  Upload your photo, see it inside the LED frame, then order!
                </p>
              </div>
            )}

            {/* Studio info — when in studio mode */}
            {isCustomizable && studioMode && (
              <div className="mt-4">
                <div
                  className="p-3 rounded"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                >
                  {photoPreview ? (
                    <div className="d-flex align-items-center gap-2">
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ color: "#16a34a", fontSize: "1.2rem" }}
                      ></i>
                      <div>
                        <p
                          className="fw-bold mb-0"
                          style={{ color: "#16a34a", fontSize: "0.9rem" }}
                        >
                          Photo uploaded!
                        </p>
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: "0.78rem" }}
                        >
                          Your photo will be printed and fitted in the frame.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <i
                        className="bi bi-info-circle"
                        style={{ color: "#2563eb", fontSize: "1.2rem" }}
                      ></i>
                      <p
                        className="mb-0"
                        style={{ fontSize: "0.85rem", color: "#334155" }}
                      >
                        Click on the frame to upload your photo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity + Cart + Delivery */}
            <div
              className="mt-4"
              style={{ borderTop: "1px solid #ecedef", paddingTop: "20px" }}
            >
              {product.inStock && (
                <div className="mb-3">
                  <p className="fpd-section-head">Quantity</p>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span className="px-2 fw-bold">{quantity}</span>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Cart + Delivery row */}
              <div className="d-flex flex-column flex-md-row align-items-md-end gap-3">
                <button
                  className="fpd-cart-btn"
                  onClick={handleAddToCart}
                  disabled={
                    !product.inStock || (isCustomizable && !photoPreview)
                  }
                  style={{ whiteSpace: "nowrap" }}
                >
                  {!product.inStock
                    ? "Out of Stock"
                    : isCustomizable && !photoPreview
                      ? "📷 Upload Photo to Order"
                      : "Add to Cart"}
                </button>

                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ecedef",
                    borderRadius: "12px",
                    boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                    padding: "10px 14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: ".72rem",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      fontWeight: 700,
                      color: "#6b7280",
                      margin: "0 0 8px",
                    }}
                  >
                    <i className="bi bi-geo-alt me-1"></i>Check Delivery
                  </p>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Enter pincode"
                      maxLength={6}
                      value={pincode}
                      inputMode="numeric"
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPincode(val);
                        if (val.length < 6) setDeliveryResult(null);
                      }}
                      style={{ maxWidth: "140px" }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: "#2563eb" }}
                      onClick={handleCheckDelivery}
                      disabled={pincode.length !== 6 || checking}
                    >
                      {checking ? "Checking..." : "Check"}
                    </button>
                    {deliveryResult && (
                      <span
                        className="fw-semibold"
                        style={{
                          fontSize: "0.82rem",
                          color: deliveryResult.available
                            ? "#16a34a"
                            : "#dc2626",
                        }}
                      >
                        <i
                          className={`bi ${
                            deliveryResult.available
                              ? "bi-check-circle-fill"
                              : "bi-x-circle-fill"
                          } me-1`}
                        ></i>
                        {deliveryResult.available
                          ? `Est. ${deliveryResult.estimatedDays}`
                          : "Not available"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Detail Sections (below grid) ---- */}
        <div className="mt-5">
          {/* About This Item */}
          {product.description && (
            <div className="mb-5">
              <h5 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                About This Item
              </h5>
              <div className="fpd-desc" style={{ lineHeight: 1.8 }}>
                {product.description.split("\n").map((para, i) => (
                  <p
                    key={i}
                    className={i > 0 ? "mt-3" : ""}
                    style={{ marginBottom: 0 }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          <div className="mb-5">
            <h5 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
              Key Features
            </h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>
                    Premium UV printing with vibrant, long-lasting colors
                  </span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>Scratch resistant and waterproof surface</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>Suitable for indoor and outdoor use</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>Easy to mount with included adhesive strips</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>Eco-friendly UV ink — safe and non-toxic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box + Shipping + Care — three columns */}
          <div className="row g-4">
            <div className="col-md-4">
              <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                <i
                  className="bi bi-box-seam me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                What&apos;s in the Box
              </h6>
              <div
                className="d-flex flex-column gap-2"
                style={{ fontSize: "0.9rem" }}
              >
                <span>1 × {product.title || "UV Printed Product"}</span>
                <span>Adhesive mounting strips</span>
                <span>Protective packaging</span>
              </div>
            </div>

            <div className="col-md-4">
              <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                <i
                  className="bi bi-truck me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                Shipping
              </h6>
              <div
                className="d-flex flex-column gap-2"
                style={{ fontSize: "0.9rem" }}
              >
                <span>Free shipping across India</span>
                <span>Dispatched within 3-5 business days</span>
              </div>
            </div>

            <div className="col-md-4">
              <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                <i
                  className="bi bi-heart me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                Care Instructions
              </h6>
              <div
                className="d-flex flex-column gap-2"
                style={{ fontSize: "0.9rem" }}
              >
                <span>Wipe clean with a soft, damp cloth</span>
                <span>Avoid prolonged direct sunlight</span>
                <span>Do not use chemical cleaners</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Similar Products ---- */}
      <section className="container pb-5">
        <hr className="mb-4 mb-md-5" />

        <div className="mb-4">
          <h3 className="fw-bold mb-1" style={{ color: "#1b263b" }}>
            Similar Products
          </h3>
          <p className="text-muted mb-0">
            More ready-to-order products you may like.
          </p>
        </div>

        <div className="row">
          {similar.length > 0 ? (
            similar.map((item) => (
              <ProductCard key={`featured-${item.id}`} product={item} />
            ))
          ) : (
            <div className="text-center text-muted">
              No similar products available.
            </div>
          )}
        </div>
      </section>

      {/* ---- Reviews ---- */}
      <ReviewSection featuredProductId={product._id} />
      {/* ---- 3D Preview Modal ---- */}
      {show3D && croppedFor3D && (
        <LED3DPreview
          photoSrc={croppedFor3D}
          onClose={() => {
            setShow3D(false);
            setCroppedFor3D(null);
          }}
        />
      )}
    </div>
  );
}
