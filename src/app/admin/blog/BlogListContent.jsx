"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllBlogs, deleteBlog, toggleBlogPublish } from "../../../services/blogService";
import Swal from "sweetalert2";

export default function BlogListContent() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Delete this blog?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(id);
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Blog deleted!", showConfirmButton: false, timer: 2000 });
      } catch (err) {
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Delete failed.", showConfirmButton: false, timer: 2000 });
      }
    }
  }

  async function handleTogglePublish(id) {
    try {
      const updated = await toggleBlogPublish(id);
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, published: updated.published } : b))
      );
      Swal.fire({
        toast: true, position: "top-end", icon: "success",
        title: updated.published ? "Published!" : "Unpublished!",
        showConfirmButton: false, timer: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) {
    return <div className="container py-5 text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Blog Posts</h2>
        <Link href="/admin/blog/add" className="btn btn-dark">
          <i className="bi bi-plus-lg me-2"></i>New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: "2.5rem" }}>📝</div>
          <h5 className="mt-3">No blog posts yet</h5>
          <Link href="/admin/blog/add" className="btn btn-dark mt-3">
            Write First Blog
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {blogs.map((blog) => (
            <div className="col-12" key={blog._id}>
              <div className="card border-0 shadow-sm">
                <div className="card-body d-flex flex-column flex-md-row align-items-md-center gap-3">
                  {/* Cover image thumbnail */}
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "60px", background: "#f1f5f9", borderRadius: "8px", color: "#94a3b8", fontSize: "1.5rem" }}
                    >
                      <i className="bi bi-image"></i>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{blog.title}</h6>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      {blog.category && (
                        <span className="badge" style={{ background: "#eff6ff", color: "#2563eb", fontSize: "0.7rem" }}>
                          {blog.category}
                        </span>
                      )}
                      <span className={`badge ${blog.published ? "bg-success" : "bg-warning text-dark"}`}>
                        {blog.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                        · {blog.readTime} min read
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm ${blog.published ? "btn-outline-warning" : "btn-outline-success"}`}
                      onClick={() => handleTogglePublish(blog._id)}
                    >
                      {blog.published ? "Unpublish" : "Publish"}
                    </button>
                    <Link href={`/admin/blog/edit/${blog._id}`} className="btn btn-sm btn-outline-dark">
                      Edit
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(blog._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}