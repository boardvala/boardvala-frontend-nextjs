"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { syncGuestCart } from "../../services/cartService";
import Swal from "sweetalert2";

import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaTruck,
  FaCheckCircle,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    setLoading(true);

    try {
      const data = await loginUser(form);

      login(data);

      if (data.role === "user") {
        await syncGuestCart();
      }

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirect || "/");
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.response?.data?.message || "Login Failed",
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
          maxWidth: "450px",
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        <div
          className="text-center text-white p-4"
          style={{ background: "linear-gradient(135deg, #1b263b, #243c63)" }}
        >
          <h2 className="fw-bold mb-1">BoardVala</h2>
          <p className="mb-0">Welcome Back 👋</p>
          <small style={{ opacity: 0.8 }}>Login to continue</small>
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

            <div className="mb-2">
              <label className="form-label fw-semibold">Password</label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaLock />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
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

            <div className="text-end mb-4">
              <Link href="/forgot-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>

            <button
              className="btn w-100 py-2 text-white"
              style={{ backgroundColor: "#2563eb" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Logging In...
                </>
              ) : (
                "Login Securely"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account?</span>

            <Link
              href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="ms-2 text-decoration-none fw-semibold"
            >
              Register
            </Link>
          </div>

          <div className="text-center mt-2">
            <Link href="/" className="text-decoration-none text-muted">
              <FaHome className="me-1" /> Go to Home
            </Link>
          </div>

          <hr className="my-4" />

          <div className="small text-muted">
            <div className="mb-2">
              <FaShieldAlt className="me-2" style={{ color: "#2563eb" }} />
              Secure Login
            </div>

            <div className="mb-2">
              <FaTruck className="me-2" style={{ color: "#2563eb" }} />
              Fast Order Tracking
            </div>

            <div>
              <FaCheckCircle className="me-2" style={{ color: "#2563eb" }} />
              Trusted Name Plate Store
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
