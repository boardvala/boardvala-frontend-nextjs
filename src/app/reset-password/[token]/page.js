"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { resetPassword } from "../../../services/authService";
import { FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";


export default function ResetPassword() {

  const { token } = useParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (newPassword.length < 6) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Password must be at least 6 characters",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, newPassword);

      setDone(true);

      // थोड्या वेळाने login कडे
      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:
          err.response?.data?.message ||
          "Reset link is invalid or has expired.",
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
          <FaKey size={22} />
        </div>
        <h3 className="fw-bold mb-1">Set New Password</h3>
        <p className="mb-0" style={{ opacity: 0.85, fontSize: "0.9rem" }}>
          Secure your BoardVala account
        </p>
      </div>

      <div className="card-body p-3 p-sm-4 p-md-5">
        {done ? (
          <div className="text-center">
            <div style={{ fontSize: "3rem" }}>✅</div>
            <h4 className="fw-bold mt-2 mb-2">Password Reset</h4>
            <p className="text-muted mb-4">
              Your password has been changed. Redirecting you to login...
            </p>
            <Link
              href="/login"
              className="btn w-100 py-2 text-white"
              style={{ backgroundColor: "#2563eb" }}
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted text-center mb-4">
              Enter a new password for your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">New Password</label>

                <div className="input-group">
                  <span
                    className="input-group-text bg-white"
                    style={{ color: "#2563eb" }}
                  >
                    <FaLock />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <small className="text-muted">At least 6 characters.</small>
              </div>

              <button
                className="btn w-100 py-2 text-white"
                style={{ backgroundColor: "#2563eb" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link
                href="/login"
                className="text-decoration-none fw-semibold"
                style={{ color: "#2563eb" }}
              >
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