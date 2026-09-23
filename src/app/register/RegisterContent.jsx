"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "../../services/authService";
import Swal from "sweetalert2";

import {
  FaPhoneAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaShieldAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "";

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // email आवश्यक + नीट
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please enter a valid email address",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    // mobile ऐच्छिक — पण दिलं असेल तर 10 अंकी हवं
    if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile)) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please enter a valid 10-digit mobile number",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        email: form.email,
        password: form.password,
        mobile: form.mobile, // रिकामं असू शकतं (ऐच्छिक)
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Registration Successful",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setTimeout(() => {
        router.push(
          `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`,
        );
      }, 2000);
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.response?.data?.message || "Registration Failed",
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
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "470px",
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        <div
          className="text-center text-white p-4"
          style={{ background: "linear-gradient(135deg, #1b263b, #243c63)" }}
        >
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: 70,
              height: 70,
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <FaUserPlus size={28} />
          </div>
          <h2 className="fw-bold mb-1">Create Account</h2>
          <p className="mb-0" style={{ opacity: 0.85 }}>
            Join BoardVala and start creating beautiful designs.
          </p>
        </div>
        <div className="card-body p-3 p-sm-4 p-md-5">
          <form onSubmit={handleSubmit}>
            {/* Email */}

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaEnvelope />
                </span>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaLock />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Create password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
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
            </div>

            {/* Mobile (optional) */}

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Mobile Number{" "}
                <span className="text-muted fw-normal">(optional)</span>
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaPhoneAlt />
                </span>

                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter mobile number"
                  name="mobile"
                  value={form.mobile}
                  maxLength={10}
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({
                      ...form,
                      mobile: value,
                    });
                  }}
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <hr className="my-4" />

          <div className="text-center">
            <span className="text-muted">Already have an account?</span>

            <Link
              href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="fw-semibold text-decoration-none ms-2"
            >
              Login
            </Link>
          </div>

          <div className="mt-4 text-center text-muted small">
            <FaShieldAlt className="text-success me-2" />
            Your information is securely protected.
          </div>
        </div>
      </div>
    </div>
  );
}
