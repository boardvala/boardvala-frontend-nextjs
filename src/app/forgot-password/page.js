"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { forgotPassword } from "../../services/authService";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await forgotPassword(email.trim().toLowerCase());

      // सुरक्षेसाठी backend नेहमी तोच संदेश देतो (email अस्तित्व लपवायला),
      // म्हणून आपण नेहमी "पाठवलं" असं दाखवतो.
      setSent(true);
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.response?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
  <div
    className="d-flex align-items-center justify-content-center py-5 px-3"
    style={{ minHeight: "100vh", background: "#f5f7fa" }}
  >
    <div
      className="card shadow-lg border-0"
      style={{
        width: "100%",
        maxWidth: "450px",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      {/* Header — common, दोन्ही states ला (gradient) */}
      <div
        className="text-center text-white p-3 p-md-4"
        style={{ background: "linear-gradient(135deg, #1b263b, #243c63)" }}
      >
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
          style={{ width: 60, height: 60, background: "rgba(255,255,255,0.15)" }}
        >
          <FaEnvelope size={22} />
        </div>
        <h3 className="fw-bold mb-1">Forgot Password?</h3>
        <p className="mb-0" style={{ opacity: 0.85, fontSize: "0.9rem" }}>
          Reset your BoardVala account password
        </p>
      </div>

      <div className="card-body p-3 p-sm-4 p-md-5">
        {sent ? (
          // ---- पाठवल्यानंतरचा संदेश ----
          <div className="text-center">
            <div style={{ fontSize: "3rem" }}>📧</div>
            <h4 className="fw-bold mt-2 mb-2">Check your email</h4>
            <p className="text-muted mb-4">
              If an account exists for <strong>{email}</strong>, we've sent a
              link to reset your password. The link is valid for 15 minutes.
            </p>
            <Link
              href="/login"
              className="btn w-100 py-2 text-white"
              style={{ backgroundColor: "#2563eb" }}
            >
              Back to Login
            </Link>
          </div>
        ) : (
          // ---- email टाकायचा form ----
          <>
            <p className="text-muted text-center mb-4">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Email</label>

                <div className="input-group">
                  <span
                    className="input-group-text bg-white"
                    style={{ color: "#2563eb" }}
                  >
                    <FaEnvelope />
                  </span>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                className="btn w-100 py-2 text-white"
                style={{ backgroundColor: "#2563eb" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link
                href="/login"
                className="text-decoration-none fw-semibold"
                style={{ color: "#2563eb" }}
              >
                <FaArrowLeft className="me-2" size={12} />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
}