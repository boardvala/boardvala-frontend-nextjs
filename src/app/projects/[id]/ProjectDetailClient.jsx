"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProject } from "../../../services/projectService";
import { getGalleryImage } from "../../../utils/imageUtils";

export default function ProjectDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProject(id);
        setProject(data.project);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <h2>Project Not Found</h2>
        <button
          className="btn btn-outline-dark mt-3"
          onClick={() => router.back()}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ background: "#f6f7f9", minHeight: "70vh" }}>
        <div className="container py-4 py-md-5">
          {/* Header */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <button
                className="btn btn-sm btn-outline-dark mb-2"
                onClick={() => router.back()}
              >
                ← Back
              </button>
              <h2 className="fw-bold mb-1">{project.title}</h2>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span
                  className="badge"
                  style={{ background: "#1b263b", fontSize: "0.78rem" }}
                >
                  {project.category}
                </span>
                {project.location && (
                  <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                    <i className="bi bi-geo-alt me-1"></i>
                    {project.location}
                  </span>
                )}
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  <i className="bi bi-images me-1"></i>
                  {project.images?.length || 0} photos
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div
              className="p-4 rounded mb-4"
              style={{
                background: "#fff",
                border: "1px solid #ecedef",
                borderRadius: "16px",
              }}
            >
              <div style={{ lineHeight: 1.8 }}>
                {project.description.split("\n").map((para, i) => (
                  <p
                    key={i}
                    className={i > 0 ? "mt-3" : ""}
                    style={{ marginBottom: 0 }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Image Grid */}
          <div className="row g-3">
            {(project.images || []).map((img, i) => (
              <div className="col-6 col-md-4 col-lg-3" key={i}>
                <div
                  onClick={() => setSelectedImage(getGalleryImage(img))}
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid #ecedef",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={getGalleryImage(img)}
                    alt={`${project.title} ${i + 1}`}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          <img
            src={selectedImage}
            alt="Full view"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "8px",
              cursor: "default",
            }}
          />
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}