"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { changePassword } from "../../../services/authService";
import { FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";

export default function ChangePassword() {
  const router = useRouter();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // नवीन password किमान लांबी (backend पण तपासतो)
    if (form.newPassword.length < 6) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "New password must be at least 6 characters",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    // जुना आणि नवीन सारखेच असतील तर अर्थ नाही
    if (form.oldPassword === form.newPassword) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "New password must be different from old password",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Password changed successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // तसाच login ठेवून account कडे परत
      setTimeout(() => {
        router.push("/account");
      }, 1500);
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.response?.data?.message || "Could not change password",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center py-5 px-3"
        style={{ minHeight: "78vh", background: "#f5f7fa" }}
      >
        <div
          className="card shadow-lg border-0"
          style={{ width: "100%", maxWidth: "460px", borderRadius: "18px" , overflow: "hidden"}}
        >
          <div
            className="text-center text-white p-3 p-md-4"
            style={{ background: "linear-gradient(135deg, #1b263b, #243c63)" }}
          >
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 64,
                height: 64,
                background: "rgba(255,255,255,0.15)",
              }}
            >
              <FaKey size={24} />
            </div>
            <h3 className="fw-bold mb-1">Change Password</h3>
            <p className="mb-0" style={{ opacity: 0.85 }}>
              Enter your current and new password.
            </p>
          </div>
          <div className="card-body p-3 p-sm-4 p-md-5">
            <form onSubmit={handleSubmit}>
              {/* Old password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Current Password
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaLock />
                  </span>

                  <input
                    type={showOld ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter current password"
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="mb-4">
                <label className="form-label fw-semibold">New Password</label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaLock />
                  </span>

                  <input
                    type={showNew ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter new password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <small className="text-muted">At least 6 characters.</small>
              </div>

              <button className="btn w-100 py-2 text-white" style={{ backgroundColor: "#2563eb" }} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100 py-2 mt-2"
                onClick={() => router.push("/account")}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
