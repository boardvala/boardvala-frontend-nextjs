"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject, updateProject } from "../../../../../services/projectService";
import Swal from "sweetalert2";

const CATEGORIES = [
  "Hospital", "Mall", "Shop", "Office", "School",
  "Hotel", "Restaurant", "Residential", "Commercial",
];

export default function EditProjectContent() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    featured: false,
    active: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  /* ── Load project ── */
  useEffect(() => {
    async function load() {
      try {
        const data = await getProject(id);
        const p = data.project || data;
        setForm({
          title: p.title || "",
          category: p.category || "",
          location: p.location || "",
          description: p.description || "",
          featured: p.featured || false,
          active: p.active !== undefined ? p.active : true,
        });
        setExistingImages(p.images || []);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Project load failed" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /* ── Existing image remove toggle ── */
  function toggleRemoveImage(img) {
    const imgId = typeof img === "string" ? img : img.publicId || img.url;
    if (removeImages.includes(imgId)) {
      setRemoveImages(removeImages.filter((i) => i !== imgId));
    } else {
      setRemoveImages([...removeImages, imgId]);
    }
  }

  function getImageUrl(img) {
    if (typeof img === "string") return img;
    return img.url || img;
  }

  function getImageId(img) {
    if (typeof img === "string") return img;
    return img.publicId || img.url;
  }

  /* ── New images ── */
function handleNewImages(e) {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      Swal.fire({ icon: "warning", title: "You can select only 5 images" });
      e.target.value = "";
      return;
    }
    if (newFiles.length > 0) {
      Swal.fire({ icon: "warning", title: "You can not select more than 5 images" });
      e.target.value = "";
      return;
    }
    const oversized = files.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      Swal.fire({ icon: "warning", title: "Each image must be under 10 MB" });
      e.target.value = "";
      return;
    }
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewFiles(files);
    setNewPreviews(previews);
  }

  function removeNewImage(index) {
    setNewFiles(newFiles.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title) {
      Swal.fire({ icon: "warning", title: "Title is required." });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("featured", form.featured);
      formData.append("active", form.active);

      if (removeImages.length > 0) {
        formData.append("removeImages", JSON.stringify(removeImages));
      }

      newFiles.forEach((file) => {
        formData.append("images", file);
      });

      await updateProject(id, formData);

      Swal.fire({
        toast: true, position: "top-end", icon: "success",
        title: "Project updated!", showConfirmButton: false, timer: 2000,
      });
      router.push("/admin/projects");
    } catch (err) {
    console.log(err)
      Swal.fire({
        toast: true, position: "top-end", icon: "error",
        title: "Failed to update project.", showConfirmButton: false, timer: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
        <p className="mt-2 text-muted">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary btn-sm me-3" onClick={() => router.push("/admin/projects")}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </button>
        <h2 className="fw-bold mb-0">Edit Project</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left — Main content */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title *</label>
                  <input className="form-control" name="title" value={form.title} onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Location</label>
                  <input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Amravati, Maharashtra" />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={5} />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Images & Settings */}
          <div className="col-lg-4">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <label className="form-label fw-semibold">Current Images</label>
                  <small className="text-muted d-block mb-2">Click image to mark for removal</small>
                  <div className="row g-2">
                    {existingImages.map((img, i) => {
                      const imgId = getImageId(img);
                      const marked = removeImages.includes(imgId);
                      return (
                        <div className="col-4" key={i}>
                          <div
                            onClick={() => toggleRemoveImage(img)}
                            style={{
                              position: "relative",
                              cursor: "pointer",
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: marked ? "3px solid #ef4444" : "3px solid transparent",
                              opacity: marked ? 0.4 : 1,
                              transition: "all 0.2s",
                            }}
                          >
                            <img
                              src={getImageUrl(img)}
                              alt={`Photo ${i + 1}`}
                              style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                            />
                            {marked && (
                              <div style={{
                                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: "rgba(239,68,68,0.3)",
                              }}>
                                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "1.5rem" }}></i>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {removeImages.length > 0 && (
                    <p className="text-danger mt-2 mb-0" style={{ fontSize: "0.8rem" }}>
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      {removeImages.length} image(s) will be removed on save
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <label className="form-label fw-semibold">Add New Images</label>
                <input type="file" className="form-control" accept="image/*" multiple onChange={handleNewImages} />
                {newPreviews.length > 0 && (
                  <div className="row g-2 mt-2">
                    {newPreviews.map((src, i) => (
                      <div className="col-4" key={i}>
                        <div style={{ position: "relative" }}>
                          <img src={src} alt={`New ${i + 1}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "8px" }} />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            style={{
                              position: "absolute", top: "-6px", right: "-6px",
                              background: "#ef4444", color: "#fff", border: "none",
                              borderRadius: "50%", width: "22px", height: "22px",
                              fontSize: "0.7rem", display: "flex", alignItems: "center",
                              justifyContent: "center", cursor: "pointer",
                            }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="form-check mb-2">
                  <input type="checkbox" className="form-check-input" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  <label className="form-check-label fw-semibold" htmlFor="featured">
                    <i className="bi bi-star me-1"></i>Show on Home Page
                  </label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                  <label className="form-check-label fw-semibold" htmlFor="active">
                    <i className="bi bi-eye me-1"></i>Active (visible to public)
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-dark w-100" disabled={submitting}>
              {submitting ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
              ) : (
                <><i className="bi bi-check-lg me-2"></i>Save Changes</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}