"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../../../services/projectService";
import Swal from "sweetalert2";

export default function AddProjectContent() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    featured: false,
    active: true,
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

 function handleFilesChange(e) {
    const selected = Array.from(e.target.files);
    if (selected.length > 10) {
      Swal.fire({ icon: "warning", title: "Maximum 10 images allowed" });
      return;
    }
    const oversized = selected.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      Swal.fire({ icon: "warning", title: "Each image must be under 10 MB" });
      return;
    }
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  }

  function removePreview(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.category) {
      Swal.fire({ icon: "warning", title: "Title and Category are required." });
      return;
    }

    if (files.length === 0) {
      Swal.fire({ icon: "warning", title: "Please add at least 1 image." });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("featured", form.featured);
      formData.append("active", form.active);

      for (const file of files) {
        formData.append("images", file);
      }

      await createProject(formData);

      Swal.fire({
        toast: true, position: "top-end", icon: "success",
        title: "Project created!", showConfirmButton: false, timer: 2000,
      });
      router.push("/admin/projects");
    } catch (err) {
      Swal.fire({
        toast: true, position: "top-end", icon: "error",
        title: "Failed to create project.", showConfirmButton: false, timer: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container py-4 py-md-5">
      <h2 className="fw-bold mb-4">Add New Project</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left — Details */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Project Title *</label>
                  <input
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Shreekrushna Hospital Signage"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Category *</label>
                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Mall">Mall</option>
                    <option value="Shop">Shop</option>
                    <option value="Office">Office</option>
                    <option value="School">School</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Residential">Residential</option>
                    <option value="Other">Commercial</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Location</label>
                  <input
                    className="form-control"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Amravati, Maharashtra"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Project details — what work was done, materials used, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Images + Settings */}
          <div className="col-lg-4">
            {/* Images */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <label className="form-label fw-semibold">
                  Project Images * <small className="text-muted">(max 10)</small>
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                />
                {previews.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {previews.map((src, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img
                          src={src}
                          alt={`Preview ${i + 1}`}
                          className="rounded"
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removePreview(i)}
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            fontSize: "0.7rem",
                            lineHeight: "20px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <small className="text-muted d-block mt-2">
                  First image will be used as cover.
                </small>
              </div>
            </div>

            {/* Settings */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                  />
                  <label className="form-check-label fw-semibold" htmlFor="featured">
                    Show on Home Page
                  </label>
                  <small className="text-muted d-block">
                    Featured projects appear in home page marquee.
                  </small>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="active"
                    checked={form.active}
                    onChange={(e) =>
                      setForm({ ...form, active: e.target.checked })
                    }
                  />
                  <label className="form-check-label fw-semibold" htmlFor="active">
                    Active
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-lg me-2"></i>Create Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}