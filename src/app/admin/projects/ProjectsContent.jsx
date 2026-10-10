"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProjects, deleteProject } from "../../../services/projectService";
import { getGalleryImage } from "../../../utils/imageUtils";
import Swal from "sweetalert2";

export default function ProjectsContent() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getAllProjects();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, title) {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: `"${title}" permanently delete होईल.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProject(id);
      Swal.fire({
        toast: true, position: "top-end", icon: "success",
        title: "Project deleted!", showConfirmButton: false, timer: 2000,
      });
      loadProjects();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Delete failed" });
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Projects</h2>
        <Link href="/admin/projects/add" className="btn btn-dark">
          <i className="bi bi-plus-lg me-2"></i>Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No projects yet. Add your first project!
        </div>
      ) : (
        <div className="row g-3">
          {projects.map((project) => {
            const cover =
              project.coverImage?.url ||
              (project.images?.length > 0
                ? getGalleryImage(project.images[0])
                : null);

            return (
              <div className="col-12 col-md-6 col-lg-4" key={project._id}>
                <div className="card border-0 shadow-sm h-100">
                  {cover ? (
                    <img
                      src={cover}
                      alt={project.title}
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        height: "180px",
                        background: "#f1f5f9",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      <i className="bi bi-image text-muted" style={{ fontSize: "2rem" }}></i>
                    </div>
                  )}
                  <div className="card-body">
                    <h6 className="fw-bold mb-1">{project.title}</h6>
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      <span className="badge" style={{ background: "#1b263b", fontSize: "0.72rem" }}>
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="badge bg-success" style={{ fontSize: "0.72rem" }}>Featured</span>
                      )}
                      {!project.active && (
                        <span className="badge bg-danger" style={{ fontSize: "0.72rem" }}>Inactive</span>
                      )}
                    </div>
                    {project.location && (
                      <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>
                        <i className="bi bi-geo-alt me-1"></i>{project.location}
                      </p>
                    )}
                    <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                      <i className="bi bi-images me-1"></i>{project.images?.length || 0} photos
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0 d-flex gap-2 pb-3 px-3">
                    <Link
                      href={`/admin/projects/edit/${project._id}`}
                      className="btn btn-sm btn-outline-dark flex-fill"
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger flex-fill"
                      onClick={() => handleDelete(project._id, project.title)}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}