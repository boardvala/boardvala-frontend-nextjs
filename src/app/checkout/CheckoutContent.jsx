"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomDesignOrder } from "../../services/customDesignService";
import { createFeaturedOrder } from "../../services/featuredOrderService";
import { useAuth } from "../../context/AuthContext";
import {
  createPaymentOrder,
  verifyPayment,
} from "../../services/paymentService";
import { notifyCartChanged } from "../../utils/cartEvents";

// Razorpay ची script हवी तेव्हा load करते आणि पूर्ण तयार होण्याची वाट बघते
// (mobile वर पहिल्याच वेळी popup नीट उघडावा म्हणून).
function loadRazorpayScript() {
  return new Promise((resolve) => {
    // आधीच तयार असेल तर लगेच
    if (window.Razorpay) return resolve(true);

    const finish = () => {
      // Razorpay object प्रत्यक्ष तयार झाला का, थोडा वेळ देत तपासतो
      let tries = 0;
      const check = () => {
        if (window.Razorpay) return resolve(true);
        if (tries++ > 20) return resolve(false); // ~2s नंतर सोडून दे
        setTimeout(check, 100);
      };
      check();
    };

    const existing = document.getElementById("razorpay-checkout-js");
    if (existing) {
      if (window.Razorpay) return resolve(true);
      existing.addEventListener("load", finish);
      existing.addEventListener("error", () => resolve(false));
      // script आधीच load झाली असेल पण event miss झाला असेल — तरी check कर
      finish();
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = finish;
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();

  const customData = JSON.parse(localStorage.getItem("customCart")) || [];

  const [processingPayment, setProcessingPayment] = useState(false);
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [agreeInstruction, setAgreeInstruction] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  // --- toast notification state ---
  const [toast, setToast] = useState(null); // { type: "success" | "error" | "info", message }

  function showToast(type, message) {
    setToast({ type, message });
    // 4 सेकंदांनी आपोआप जाते
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 4000);
  }

  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerPhone: user?.mobile || "",
    customerEmail: user?.email || "",
    customerAddress: user?.address || "",
    customerCity: "", // ← नवीन
    customerState: "", // ← नवीन
    customerPincode: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // --- client-side validation (backend still re-validates) ---
  function validate() {
    if (!form.customerName.trim()) {
      showToast("error", "Please enter your full name.");
      return false;
    }

    const phone = form.customerPhone.trim();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      showToast("error", "Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (
      form.customerEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())
    ) {
      showToast("error", "Please enter a valid email address.");
      return false;
    }

    if (!form.customerAddress.trim()) {
      showToast("error", "Please enter your delivery address.");
      return false;
    }

    return true;
  }

  async function startPayment() {
    setShowInstructionModal(false);
    setInitiatingPayment(true);
    const loaded = await loadRazorpayScript();
    console.log(loaded);
    if (!loaded || !window.Razorpay) {
      showToast(
        "error",
        "Payment system could not load. Please check your connection and try again.",
      );
      setInitiatingPayment(false);
      return;
    }

    try {
      // amount पाठवत नाही — backend frameSize वरून database मधून किंमत ठरवतो.
      const paymentPayload = {
        items: customData,
      };

      const payment = await createPaymentOrder(paymentPayload);

      const options = {
        key: payment.key,
        amount: payment.order.amount,
        currency: payment.order.currency,
        name: "BoardVala",
        description: "Custom Order",
        order_id: payment.order.id,
        prefill: {
          name: form.customerName,
          contact: form.customerPhone,
          email: form.customerEmail,
        },
        theme: {
          color: "#212529",
        },
        modal: {
          ondismiss: function () {
            showToast("info", "Payment cancelled.");
          },
        },
        handler: async function (response) {
          setProcessingPayment(true);
          try {
            const paymentResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            for (const item of customData) {
              if (item.orderType === "featuredProduct") {
                // featured order
                await createFeaturedOrder({
                  featuredProductId: item.featuredProductId,
                  quantity: item.quantity,
                  customerName: form.customerName,
                  customerPhone: form.customerPhone,
                  customerEmail: form.customerEmail,
                  customerAddress: form.customerAddress,
                  customerCity: form.customerCity,
                  customerState: form.customerState,
                  customerPincode: form.customerPincode,
                  payment: paymentResponse.paymentId,
                });
              } else {
                // custom design order (आताचं)
                await createCustomDesignOrder({
                  previewImage: item.previewImage,
                  frameSize: item.frameSize,
                  orientation: item.orientation,
                  material: item.material,
                  instructions: item.instructions,
                  frameWidth: item.frameWidth,
                  frameHeight: item.frameHeight,
                  quantity: item.quantity,
                  width: item.width, // ← banner साठी (fixed ला undefined, हरकत नाही)
                  length: item.length,
                  customerName: form.customerName,
                  customerPhone: form.customerPhone,
                  customerEmail: form.customerEmail,
                  customerAddress: form.customerAddress,
                  customerCity: form.customerCity,
                  customerState: form.customerState,
                  customerPincode: form.customerPincode,
                  payment: paymentResponse.paymentId,
                });
              }
            }
            setOrderPlaced(true);

            try {
              localStorage.removeItem("customCart");
              notifyCartChanged();
            } catch (err) {
              console.error(err);
            }
            showToast("success", "Order placed successfully!");
            // थोडा वेळ toast दिसू द्या, मग success पेजवर
            setTimeout(() => {
              localStorage.setItem(
                "orderSuccessData",
                JSON.stringify({
                  shippingAddress: {
                    name: form.customerName,
                    phone: form.customerPhone,
                    email: form.customerEmail,
                    address: form.customerAddress,
                    city: form.customerCity,
                    state: form.customerState,
                    pincode: form.customerPincode,
                  },
                }),
              );
              router.push("/order-success");
            }, 900);
          } catch (err) {
            console.error(err);
            setProcessingPayment(false);
            showToast(
              "error",
              "Payment verification failed. If money was deducted, please contact support.",
            );
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        showToast("error", "Payment failed. Please try again.");
      });
      // mobile वर popup नीट वर येण्यासाठी एक tick थांबतो
      setTimeout(() => {
        razorpay.open();
        setInitiatingPayment(false); // ← popup आला → बंद
      }, 50);
    } catch (err) {
      console.error(err);
      setInitiatingPayment(false);
      showToast("error", "Unable to start payment. Please try again.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (customData.length === 0) {
      showToast("error", "Your cart is empty.");

      setTimeout(() => {
        router.push("/cart");
      }, 1500);

      return;
    }

    if (!validate()) return;

    setShowInstructionModal(true);
  }

  // --- refresh / direct-open guard for custom design ---
  if (customData.length === 0 && !orderPlaced) {
    return (
      <div className="container py-5 text-center">
        <div className="mx-auto" style={{ maxWidth: 460 }}>
          <div style={{ fontSize: "2.5rem" }}>🧾</div>
          <h4 className="fw-bold mt-2 mb-1">Checkout session expired</h4>
          <p className="text-muted mb-4">
            Your design details were lost (the page may have been refreshed).
          </p>
          <button
            className="btn btn-dark btn-lg px-4"
            onClick={() => router.push("/custom-design")}
          >
            Start a New Design
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {initiatingPayment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              border: "4px solid rgba(255,255,255,0.2)",
              borderTop: "4px solid #fff",
              borderRadius: "50%",
              animation: "paymentSpin 0.8s linear infinite",
            }}
          />
          <h4 className="text-white fw-bold mb-1">Initiating Payment...</h4>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.9rem",
              textAlign: "center",
              maxWidth: "320px",
            }}
          >
            Please wait, do not press back or refresh.
            <br />
            This may take a few seconds on slower connections.
          </p>
          <style>{`
      @keyframes paymentSpin {
        to { transform: rotate(360deg); }
      }
    `}</style>
        </div>
      )}
      {/* Toast styles */}
      <style>{`
        .razorpay-container { z-index: 2147483647 !important; }
        .bv-toast-wrap {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 11000;
          max-width: calc(100vw - 40px);
          width: 360px;
          pointer-events: none;
        }
        .bv-toast {
          pointer-events: auto;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          color: #fff;
          box-shadow: 0 10px 30px rgba(0,0,0,.18);
          animation: bvToastIn .25s ease;
          font-size: .95rem;
          line-height: 1.35;
        }
        .bv-toast .bv-close {
          margin-left: auto;
          background: transparent;
          border: none;
          color: rgba(255,255,255,.85);
          font-size: 1.1rem;
          line-height: 1;
          cursor: pointer;
          padding: 0 2px;
        }
        .bv-toast--success { background: #16a34a; }
        .bv-toast--error   { background: #dc2626; }
        .bv-toast--info    { background: #334155; }
        .bv-toast__icon { font-size: 1.05rem; margin-top: 1px; }
        @keyframes bvToastIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 576px) {
          .bv-toast-wrap {
            top: 12px;
            right: 12px;
            left: 12px;
            width: auto;
          }
        }
      `}</style>

      {toast && (
        <div className="bv-toast-wrap">
          <div className={`bv-toast bv-toast--${toast.type}`}>
            <span className="bv-toast__icon">
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                  ? "!"
                  : "i"}
            </span>
            <span>{toast.message}</span>
            <button
              className="bv-close"
              onClick={() => setToast(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* हा फक्त return मधला UI भाग — तुमच्या Checkout मधला जुना container replace करा.
    वरचे states, handleChange, handleSubmit, processingPayment, "session expired" block तसेच ठेवा. */}

      <div className="container py-5">
        <div className="row justify-content-center g-4">
          {/* डावी बाजू — Shipping form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div
                className="card-header text-white d-flex align-items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #1b263b, #243c63)",
                }}
              >
                <i className="bi bi-truck fs-5"></i>
                <div>
                  <h4 className="mb-0">Shipping Details</h4>
                  <small style={{ opacity: 0.8 }}>
                    Where should we deliver your order?
                  </small>
                </div>
              </div>

              <div className="card-body p-4">
                <div
                  className="d-flex align-items-start gap-2 p-3 mb-4 rounded"
                  style={{ background: "#eef2ff", color: "#1b263b" }}
                >
                  <i className="bi bi-info-circle-fill mt-1"></i>
                  <small>
                    We need these details to deliver your order and share
                    updates. Please make sure your address and mobile number are
                    correct.
                  </small>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="customerPhone"
                      value={form.customerPhone}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      required
                    />
                    <small className="text-muted">
                      For delivery updates and order confirmation.
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="customerEmail"
                      value={form.customerEmail}
                      onChange={handleChange}
                      placeholder="you@example.com (optional)"
                    />
                    <small className="text-muted">
                      We'll email your order confirmation here.
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Delivery Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="customerAddress"
                      value={form.customerAddress}
                      onChange={handleChange}
                      placeholder="House / flat no., street, area, city, state, pincode"
                      required
                    />
                    <small className="text-muted">
                      Full address with pincode helps us deliver faster.
                    </small>
                  </div>

                  {/* City + State — एका ओळीत (row) */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        City <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="customerCity"
                        value={form.customerCity}
                        onChange={handleChange}
                        placeholder="City"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        State <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="customerState"
                        value={form.customerState}
                        onChange={handleChange}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  {/* Pincode */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Pincode <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="customerPincode"
                      value={form.customerPincode}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit pincode"
                      required
                    />
                    <small className="text-muted">Needed for delivery.</small>
                  </div>

                  <button
                    className="btn btn-lg w-100 text-white"
                    style={{ backgroundColor: "#2563eb" }}
                    type="submit"
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-2"></i>
                        Place Order &amp; Pay
                      </>
                    )}
                  </button>

                  <p className="text-center text-muted small mt-3 mb-0">
                    <i className="bi bi-shield-check me-1"></i>
                    Secure payment. Your details are safe with us.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* उजवी बाजू — का हवं (विश्वास) */}
          <div className="col-lg-5">
            <div
              className="card border-0 shadow-sm"
              style={{ position: "sticky", top: "90px" }}
            >
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                  Why we need these details
                </h6>

                <div className="d-flex align-items-start gap-3 mb-3">
                  <i
                    className="bi bi-geo-alt-fill fs-5"
                    style={{ color: "#2563eb" }}
                  ></i>
                  <div>
                    <div className="fw-semibold">Delivery Address</div>
                    <small className="text-muted">
                      So your printed order reaches the right place.
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-3">
                  <i
                    className="bi bi-telephone-fill fs-5"
                    style={{ color: "#2563eb" }}
                  ></i>
                  <div>
                    <div className="fw-semibold">Mobile Number</div>
                    <small className="text-muted">
                      Our team may call for delivery coordination.
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <i
                    className="bi bi-envelope-fill fs-5"
                    style={{ color: "#2563eb" }}
                  ></i>
                  <div>
                    <div className="fw-semibold">Email</div>
                    <small className="text-muted">
                      Order confirmation and updates are sent here.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal fade ${showInstructionModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{
          background: "rgba(0,0,0,.6)",
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">⚠ Before Placing Your Order</h5>

              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowInstructionModal(false);
                  setAgreeInstruction(false);
                }}
              />
            </div>

            <div className="modal-body">
              <div className="alert alert-warning">
                <strong>Please read carefully.</strong>
              </div>

              <ul className="mb-4">
                <li>
                  Your uploaded design will be printed exactly as submitted.
                </li>

                <li>
                  Please verify Material, Size and Quantity before placing the
                  order.
                </li>

                <li>Printed colors may vary slightly from your screen.</li>

                <li>Production starts after successful payment.</li>

                <li>
                  Custom design orders cannot be cancelled or refunded once
                  production begins.
                </li>

                <li>
                  If we find any issue in your design, our team may contact you
                  before production.
                </li>
              </ul>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="agreeInstruction"
                  checked={agreeInstruction}
                  onChange={(e) => setAgreeInstruction(e.target.checked)}
                  style={{
                    border: "1px solid rgb(36 35 35)",
                  }}
                />

                <label
                  className="form-check-label"
                  htmlFor="agreeInstruction"
                  style={{
                    color: "red",
                  }}
                >
                  I have reviewed my design and agree to the above instructions.
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowInstructionModal(false);
                  setAgreeInstruction(false);
                }}
              >
                Cancel
              </button>

              <button
                className="btn text-white"
                style={{ backgroundColor: "#2563eb" }}
                disabled={!agreeInstruction}
                onClick={startPayment}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {processingPayment && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(255,255,255,0.95)",
            zIndex: 9999,
          }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-dark"
              style={{ width: "4rem", height: "4rem" }}
            />
            <h4 className="mt-4">Processing Your Order...</h4>
            <p className="text-muted mb-0">
              Please do not refresh the page or press the Back button.
            </p>
            <p className="text-muted">This may take a few seconds.</p>
          </div>
        </div>
      )}
    </>
  );
}
