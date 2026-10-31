"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProject } from "../../../services/projectService";
import { getGalleryImage } from "../../../utils/imageUtils";
import Image from "next/image";
import "../../../styles/projectDetail.css";

const ADMIN_WHATSAPP = "918788736288";

export default function ProjectDetailClient({ initialProject }) {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(initialProject || null);  // server चा data direct set
  const [loading, setLoading] = useState(!initialProject);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxLoading, setLightboxLoading] = useState(true);

  useEffect(() => {
    if (initialProject) return; // server वरून आलं तर skip
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
  }, [id, initialProject]);

  function handleEnquiry(imageUrl) {
    const message =
      `Hi BoardVala! 👋\n\n` +
      `I saw this design in your "${project.title}" project and I'm interested.\n\n` +
      `📸 Image: ${imageUrl}\n\n` +
      `Can you make something similar for me? Please share details & pricing.`;

    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  if (loading) {
    return (
      <div style={{ background: "#f6f7f9", minHeight: "70vh" }}>
        <div className="container py-4 py-md-5">
          <div style={{ width: "80px", height: "32px", background: "#e0e0e0", borderRadius: "6px", marginBottom: "12px", animation: "pulse 1.5s infinite" }} />
          <div style={{ width: "60%", height: "28px", background: "#e0e0e0", borderRadius: "6px", marginBottom: "16px", animation: "pulse 1.5s infinite" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ aspectRatio: "1", background: "#e0e0e0", borderRadius: "12px", animation: "pulse 1.5s infinite", animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
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
          <div className="project-gallery">
            {(project.images || []).map((img, i) => {
              const imageUrl = getGalleryImage(img);
              return (
                <div className="project-gallery__item" key={i}>
                  <Image
                    src={imageUrl}
                    alt={`${project.title} ${i + 1}`}
                    onClick={() => { setSelectedImage(imageUrl); setLightboxLoading(true); }}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      cursor: "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox — Enquire button added here too */}
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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          {/* Spinner — image load होईपर्यंत दिसतो */}
          {lightboxLoading && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(255,255,255,0.15)",
                borderTop: "3px solid #fff",
                borderRadius: "50%",
                animation: "lbSpin 0.8s linear infinite",
              }} />
            </div>
          )}

          <img
            src={selectedImage}
            alt="Full view"
            onClick={(e) => e.stopPropagation()}
            onLoad={() => setLightboxLoading(false)}
            style={{
              maxWidth: "90vw",
              maxHeight: "75vh",
              objectFit: "contain",
              cursor: "default",
              opacity: lightboxLoading ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          />

          {/* Enquire Button — image load झाल्यावरच दिसतो */}
          {!lightboxLoading && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEnquiry(selectedImage);
              }}
              style={{
                marginTop: "16px",
                padding: "10px 28px",
                background: "#25D366",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enquire on WhatsApp
            </button>
          )}

          {/* Close button */}
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