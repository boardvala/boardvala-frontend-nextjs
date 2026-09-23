"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DimensionLine from "../../components/preview/DimensionLine";
import ThreeDPreviewModal from "../../components/preview/ThreeDPreviewModal";
import { notifyCartChanged } from "../../utils/cartEvents";
import { checkDeliveryByPincode } from "../../services/deliveryService";
import Swal from "sweetalert2";

export default function ReviewCustomDesign() {
  const router = useRouter();

  const stageRef = useRef(null);
  const [stageWidth, setStageWidth] = useState(0);
  const [show3DModal, setShow3DModal] = useState(false);

  const [customData, setCustomData] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("customDesignData");
      if (stored) {
        setCustomData(JSON.parse(stored));
      }
    } catch {
      setCustomData(null);
    }
  }, []);

  const price = customData?.price || 0;

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const isBanner =
    customData?.bannerWidth != null && customData?.bannerLength != null;

  function parseSize(size) {
    const match = size?.match(/(\d+)\s*[xX]\s*(\d+)/);
    if (!match) return { w: 12, h: 6 };
    const a = Number(match[1]);
    const b = Number(match[2]);
    return { w: a, h: b };
  }

  const parsed = parseSize(customData?.frameSize);
  const frameWidth = customData?.frameWidth ?? parsed.w;
  const frameHeight = customData?.frameHeight ?? parsed.h;

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
  }, [customData]);

  const V_LINE_SPACE = 40;
  const PREFERRED_MAX = 380;

  const availableForFrame =
    stageWidth > 0 ? stageWidth - V_LINE_SPACE : PREFERRED_MAX;
  const MAX_SIDE = Math.max(140, Math.min(PREFERRED_MAX, availableForFrame));

  let previewW;
  let previewH;
  if (frameWidth >= frameHeight) {
    previewW = MAX_SIDE;
    previewH = (MAX_SIDE * frameHeight) / frameWidth;
  } else {
    previewH = MAX_SIDE;
    previewW = (MAX_SIDE * frameWidth) / frameHeight;

    if (previewW > availableForFrame) {
      const shrink = availableForFrame / previewW;
      previewW *= shrink;
      previewH *= shrink;
    }
  }

  function handleAddToCart() {
  setAdding(true);
  const cart = JSON.parse(localStorage.getItem("customCart")) || [];

  const existingIndex = cart.findIndex(
    (item) =>
      item.material === customData.material &&
      item.frameSize === customData.frameSize &&
      item.orientation === customData.orientation &&
      item.previewImage === customData.previewImage,
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: Date.now(),
      ...customData,        // ← orderType already inside!
      ...(isBanner
        ? {
            width: customData.bannerWidth,
            length: customData.bannerLength,
          }
        : {}),
      quantity,
    });
  }

  try {
    localStorage.setItem("customCart", JSON.stringify(cart));
    localStorage.removeItem("customDesignData");  // ← temporary data clear!
  } catch (e) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: "Cart storage full. Please checkout current items first.",
      showConfirmButton: false,
      timer: 3000,
    });
  }
  notifyCartChanged();
  router.push("/cart");
}

  async function handleCheckDelivery() {
    if (pincode.length !== 6) return;
    setChecking(true);
    setDeliveryResult(null);
    try {
      const res = await checkDeliveryByPincode(pincode);
      setDeliveryResult(res);
    } catch {
      setDeliveryResult({ available: false });
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <style>{`
        .review-wrap { background: #f6f7f9; min-height: 70vh; }
        .review-steps { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; font-size: .8rem; font-weight: 600; letter-spacing: .02em; }
        .review-step { display: inline-flex; align-items: center; gap: .4rem; color: #9aa0a6; }
        .review-step .dot { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: .72rem; background: #e3e6ea; color: #6b7280; }
        .review-step.active { color: #111; }
        .review-step.active .dot { background: #1b263b; color: #fff; }
        .review-step.done .dot { background: #16a34a; color: #fff; }
        .review-sep { color: #cbd0d6; }
        .review-card { background: #fff; border: 1px solid #ecedef; border-radius: 16px; box-shadow: 0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.05); }
        .review-card-title { font-size: .78rem; text-transform: uppercase; letter-spacing: .08em; font-weight: 700; color: #6b7280; margin: 0; }
        .preview-stage {
          position: relative;
          background: radial-gradient(circle at 50% 25%, #fbf8f3 0%, #f3ece1 70%, #e8decb 100%);
          box-shadow: inset 0 0 30px rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 35px 25px 45px 25px;
          display: grid;
          place-items: center;
          min-height: 360px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        @media (max-width: 576px) { .preview-stage { padding: 25px 16px 40px 16px; } }
        .frame-box {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          position: relative;
          display: block;
        }
        .frame-box img { width: 100%; height: 100%; object-fit: contain; display: block; border-radius: 5px; }
        .summary-row { display: flex; justify-content: space-between; align-items: center; padding: .7rem 0; border-bottom: 1px dashed #eceef1; }
        .summary-row:last-child { border-bottom: 0; }
        .summary-row .label { color: #6b7280; font-size: .92rem; }
        .summary-row .value { font-weight: 600; text-align: right; }
        .chip { display: inline-block; padding: .2rem .6rem; border-radius: 999px; background: #f1f3f5; font-size: .82rem; font-weight: 600; }
        .total-card { background: linear-gradient(135deg, #1b263b 0%, #243c63 100%); color: #fff; border-radius: 16px; overflow: hidden; position: relative; }
        .total-card .amount { font-size: 2.4rem; font-weight: 800; letter-spacing: -.02em; }
        .total-card small { color: #b9bdc4; letter-spacing: .06em; }
        .btn-ghost { border: 1px solid #d7dade; background: #fff; color: #111; font-weight: 600; }
        .btn-ghost:hover { background: #f3f4f6; }
        .btn-primary-dark { background: #2563eb; color: #fff; font-weight: 600; border: 1px solid #2563eb; }
        .btn-primary-dark:hover { background: #1d4ed8; color: #fff; }
      `}</style>

      {!customData ? (
        <div className="review-wrap d-flex align-items-center">
          <div className="container py-5">
            <div
              className="review-card mx-auto text-center p-5"
              style={{ maxWidth: 460 }}
            >
              <div style={{ fontSize: "2.5rem" }}>🖼️</div>
              <h4 className="fw-bold mt-2 mb-1">No design found</h4>
              <p className="text-muted mb-4">
                Your session may have expired or the page was refreshed.
              </p>
              <button
                className="btn btn-primary-dark btn-lg px-4"
                onClick={() => router.push("/custom-design")}
              >
                Start a New Design
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="review-wrap">
          <div className="container py-5">
            <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
              <div>
                <h2 className="fw-bold mb-1">Review Your Design</h2>
                <p className="text-muted mb-0">
                  Please confirm the details before checkout.
                </p>
              </div>

              <div className="review-steps">
                <span className="review-step done">
                  <span className="dot">✓</span> Design
                </span>
                <span className="review-sep">—</span>
                <span className="review-step active">
                  <span className="dot">2</span> Review
                </span>
                <span className="review-sep">—</span>
                <span className="review-step">
                  <span className="dot">3</span> Checkout
                </span>
              </div>
            </div>

            <div className="row g-4">
              {/* Preview */}
              <div className="col-lg-7">
                <div className="review-card">
                  <div className="p-4 pb-0 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <p className="review-card-title mb-0">Your Preview</p>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary px-3 shadow-sm font-semibold"
                        onClick={() => setShow3DModal(true)}
                        style={{ fontSize: "0.82rem" }}
                      >
                        <i className="bi bi-box-seam me-1"></i>3D Interactive
                        View
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="preview-stage" ref={stageRef}>
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
                      {customData.previewImage ? (
                        <div
                          className="d-flex flex-column align-items-center"
                          style={{ zIndex: 3 }}
                        >
                          <DimensionLine
                            length={previewW}
                            label={isBanner ? `${frameWidth} ft` : frameWidth}
                          />
                          <div className="d-flex align-items-center">
                            <DimensionLine
                              length={previewH}
                              label={
                                isBanner ? `${frameHeight} ft` : frameHeight
                              }
                              direction="vertical"
                            />
                            <div
                              className="frame-box"
                              style={{
                                width: previewW,
                                height: previewH,
                                transition:
                                  "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                boxShadow:
                                  "0 15px 35px rgba(0,0,0,0.25), 0 5px 12px rgba(0,0,0,0.15)",
                              }}
                            >
                              <img
                                src={customData.previewImage}
                                alt="Your custom design preview"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted mb-0">No preview available.</p>
                      )}
                    </div>
                    <p className="text-muted small text-center mt-3 mb-0">
                      Final print size:{" "}
                      {isBanner ? (
                        <strong>
                          {frameWidth} ft × {frameHeight} ft
                        </strong>
                      ) : (
                        <>
                          <strong>
                            {frameWidth}″ × {frameHeight}″
                          </strong>{" "}
                          ({customData.orientation})
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Special Instructions — Preview खाली */}
                <div className="review-card mt-4 p-4">
                  <p className="review-card-title mb-2">Special Instructions</p>
                  {customData.instructions ? (
                    <p className="mb-0">{customData.instructions}</p>
                  ) : (
                    <p className="text-muted mb-0">
                      No special instructions added.
                    </p>
                  )}
                </div>
              </div>

              {/* Summary + extras */}
              <div className="col-lg-5">
                <div className="review-card">
                  <div className="p-4 pb-2">
                    <p className="review-card-title">Order Summary</p>
                  </div>
                  <div className="px-4 pb-2">
                    <div className="summary-row">
                      <span className="label">Product</span>
                      <span className="value">Custom Design</span>
                    </div>
                    <div className="summary-row">
                      <span className="label">Material</span>
                      <span className="value">
                        <span className="chip">{customData.material}</span>
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="label">
                        {isBanner ? "Banner Size" : "Frame Size"}
                      </span>
                      <span className="value">
                        <span className="chip">{customData.frameSize}</span>
                      </span>
                    </div>
                    {!isBanner && (
                      <div className="summary-row">
                        <span className="label">Orientation</span>
                        <span className="value">
                          <span className="chip">{customData.orientation}</span>
                        </span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span className="label">Quantity</span>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                        >
                          -
                        </button>
                        <span
                          className="fw-bold text-center"
                          style={{ minWidth: "25px" }}
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => setQuantity((prev) => prev + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="summary-row">
                      <span className="label">Price (Each)</span>
                      <span className="value text-success fs-5">₹ {price}</span>
                    </div>
                  </div>
                  <div className="p-4 pt-2">
                    <div className="total-card p-4 d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-uppercase">Total Amount</small>
                        <div className="amount">₹ {price * quantity}</div>
                      </div>
                      <span style={{ fontSize: "1.8rem", opacity: 0.5 }}>
                        🧾
                      </span>
                    </div>
                  </div>
                </div>

                {/* Check Delivery — Summary खाली */}
                <div className="review-card mt-4 p-4">
                  <p className="review-card-title mb-2">
                    <i className="bi bi-geo-alt me-1"></i>Check Delivery
                    Availability
                  </p>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPincode(val);
                        if (val.length < 6) setDeliveryResult(null);
                      }}
                      style={{ maxWidth: "180px" }}
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
                          fontSize: "0.85rem",
                          color: deliveryResult.available
                            ? "#16a34a"
                            : "#dc2626",
                        }}
                      >
                        <i
                          className={`bi ${deliveryResult.available ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}
                        ></i>
                        {deliveryResult.available
                          ? `Delivery available! Estimated ${deliveryResult.estimatedDays}`
                          : "Delivery not available at this pincode."}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="review-card mt-4 p-4">
                  <p className="review-card-title mb-3">
                    <i className="bi bi-truck me-1"></i>Delivery Information
                  </p>
                  <div
                    className="d-flex flex-column gap-2"
                    style={{ fontSize: "0.88rem" }}
                  >
                    <div className="d-flex align-items-start gap-2">
                      <i
                        className="bi bi-clock"
                        style={{ color: "#2563eb", marginTop: "2px" }}
                      ></i>
                      <span>Dispatched within 3-5 business days</span>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                      <i
                        className="bi bi-geo-alt"
                        style={{ color: "#2563eb", marginTop: "2px" }}
                      ></i>
                      <span>Delivered across India</span>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                      <i
                        className="bi bi-box-seam"
                        style={{ color: "#2563eb", marginTop: "2px" }}
                      ></i>
                      <span>Carefully packed to prevent damage</span>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                      <i
                        className="bi bi-arrow-return-left"
                        style={{ color: "#2563eb", marginTop: "2px" }}
                      ></i>
                      <span>Easy returns if product is damaged</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="review-card mt-4 p-4">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <i
                        className="bi bi-shield-lock"
                        style={{ fontSize: "1.3rem", color: "#2563eb" }}
                      ></i>
                      <div>
                        <div
                          className="fw-semibold"
                          style={{ fontSize: "0.88rem" }}
                        >
                          Secure Payment
                        </div>
                        <small className="text-muted">
                          100% secure via Razorpay
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <i
                        className="bi bi-truck"
                        style={{ fontSize: "1.3rem", color: "#2563eb" }}
                      ></i>
                      <div>
                        <div
                          className="fw-semibold"
                          style={{ fontSize: "0.88rem" }}
                        >
                          Free Shipping
                        </div>
                        <small className="text-muted">
                          On all orders across India
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <i
                        className="bi bi-patch-check"
                        style={{ fontSize: "1.3rem", color: "#2563eb" }}
                      ></i>
                      <div>
                        <div
                          className="fw-semibold"
                          style={{ fontSize: "0.88rem" }}
                        >
                          Quality Guarantee
                        </div>
                        <small className="text-muted">
                          Premium UV printing
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <i
                        className="bi bi-headset"
                        style={{ fontSize: "1.3rem", color: "#2563eb" }}
                      ></i>
                      <div>
                        <div
                          className="fw-semibold"
                          style={{ fontSize: "0.88rem" }}
                        >
                          Customer Support
                        </div>
                        <small className="text-muted">
                          WhatsApp support available
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mt-4">
              <button
                className="btn btn-ghost btn-lg px-4"
                onClick={() => router.back()}
              >
                ← Back to Editor
              </button>
              <button
                className="btn btn-primary-dark btn-lg px-4"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? "Add to Cart..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 360° 3D Modal */}
      <ThreeDPreviewModal
        isOpen={show3DModal}
        onClose={() => setShow3DModal(false)}
        previewImage={customData?.previewImage}
        material={customData?.material}
        frameSize={customData?.frameSize}
        frameWidth={frameWidth}
        frameHeight={frameHeight}
      />
    </>
  );
}
