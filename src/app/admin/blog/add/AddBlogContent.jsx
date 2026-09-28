"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlog } from "../../../../services/blogService";
import Swal from "sweetalert2";

export default function AddBlogContent() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    published: false,
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.excerpt || !form.content) {
      Swal.fire({ icon: "warning", title: "Title, excerpt and content are required." });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("category", form.category);
      formData.append("metaTitle", form.metaTitle);
      formData.append("metaDescription", form.metaDescription);
      formData.append("published", form.published);

      // Tags = comma separated → array
      if (form.tags) {
        formData.append("tags", JSON.stringify(form.tags.split(",").map((t) => t.trim())));
      }

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      await createBlog(formData);

      Swal.fire({
        toast: true, position: "top-end", icon: "success",
        title: "Blog created!", showConfirmButton: false, timer: 2000,
      });
      router.push("/admin/blog");
    } catch (err) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to create blog.", showConfirmButton: false, timer: 2000 });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container py-4 py-md-5">
      <h2 className="fw-bold mb-4">New Blog Post</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left — Main content */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title *</label>
                  <input className="form-control" name="title" value={form.title} onChange={handleChange} placeholder="Blog post title" />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Excerpt * <small className="text-muted">(short description for cards)</small></label>
                  <textarea className="form-control" name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Brief summary..." />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Content * <small className="text-muted">(HTML supported)</small></label>
                  <textarea className="form-control" name="content" value={form.content} onChange={handleChange} rows={15} placeholder="Write your article content here... (HTML tags supported)" style={{ fontFamily: "monospace", fontSize: "0.9rem" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Settings */}
          <div className="col-lg-4">
            {/* Cover Image */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <label className="form-label fw-semibold">Cover Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleCoverChange} />
                {coverPreview && (
                  <img src={coverPreview} alt="Preview" className="mt-2 rounded" style={{ width: "100%", maxHeight: "180px", objectFit: "cover" }} />
                )}
              </div>
            </div>

            {/* Category + Tags */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <input className="form-control" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Material Guide" />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Tags <small className="text-muted">(comma separated)</small></label>
                  <input className="form-control" name="tags" value={form.tags} onChange={handleChange} placeholder="acrylic, printing, UV" />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">SEO Settings</h6>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Meta Title</label>
                  <input className="form-control" name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="SEO title (optional)" />
                </div>
                <div>
                  <label className="form-label fw-semibold">Meta Description</label>
                  <textarea className="form-control" name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={2} placeholder="SEO description (optional)" />
                </div>
              </div>
            </div>

            {/* Publish + Submit */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                  <label className="form-check-label fw-semibold" htmlFor="published">
                    Publish immediately
                  </label>
                </div>

                <button type="submit" className="btn btn-dark w-100" disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
                  ) : (
                    <><i className="bi bi-plus-lg me-2"></i>Create Blog</>
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