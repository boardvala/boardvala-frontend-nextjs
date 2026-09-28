"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBlogById, updateBlog } from "../../../../../services/blogService";
import Swal from "sweetalert2";

export default function EditBlogContent() {
  const { id } = useParams();
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
  const [existingCover, setExistingCover] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const blog = await getBlogById(id);
        setForm({
          title: blog.title || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          category: blog.category || "",
          tags: (blog.tags || []).join(", "),
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          published: blog.published || false,
        });
        setExistingCover(blog.coverImage || "");
      } catch (err) {
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to load blog.", showConfirmButton: false, timer: 2000 });
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

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

      if (form.tags) {
        formData.append("tags", JSON.stringify(form.tags.split(",").map((t) => t.trim())));
      }

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      await updateBlog(id, formData);

      Swal.fire({
        toast: true, position: "top-end", icon: "success",
        title: "Blog updated!", showConfirmButton: false, timer: 2000,
      });
      router.push("/admin/blog");
    } catch (err) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to update.", showConfirmButton: false, timer: 2000 });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="container py-5 text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="container py-4 py-md-5">
      <h2 className="fw-bold mb-4">Edit Blog Post</h2>

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
                  <label className="form-label fw-semibold">Excerpt *</label>
                  <textarea className="form-control" name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Content * <small className="text-muted">(HTML supported)</small></label>
                  <textarea className="form-control" name="content" value={form.content} onChange={handleChange} rows={15} style={{ fontFamily: "monospace", fontSize: "0.9rem" }} />
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
                {(coverPreview || existingCover) && (
                  <img src={coverPreview || existingCover} alt="Cover" className="mb-2 rounded" style={{ width: "100%", maxHeight: "180px", objectFit: "cover" }} />
                )}
                <input type="file" className="form-control" accept="image/*" onChange={handleCoverChange} />
                <small className="text-muted">Leave empty to keep current image</small>
              </div>
            </div>

            {/* Category + Tags */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <input className="form-control" name="category" value={form.category} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label fw-semibold">Tags <small className="text-muted">(comma separated)</small></label>
                  <input className="form-control" name="tags" value={form.tags} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">SEO Settings</h6>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Meta Title</label>
                  <input className="form-control" name="metaTitle" value={form.metaTitle} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label fw-semibold">Meta Description</label>
                  <textarea className="form-control" name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={2} />
                </div>
              </div>
            </div>

            {/* Publish + Submit */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                  <label className="form-check-label fw-semibold" htmlFor="published">Published</label>
                </div>
                <button type="submit" className="btn btn-dark w-100" disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</>
                  ) : (
                    <><i className="bi bi-save me-2"></i>Update Blog</>
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