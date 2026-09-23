"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFeaturedProjects } from "../../services/projectService";
import { getGalleryImage } from "../../utils/imageUtils";
import "../../styles/completedProject.css"

export default function CompletedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getFeaturedProjects();
        setProjects(data.projects || []);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, []);

  if (projects.length === 0) return null; // projects नसतील तर section लपवा

  // seamless marquee loop
  const loop = [...projects, ...projects];

  return (
    <section className="py-5">
      <div className="container">
        <div className="cp-head">
          <h2 className="fw-bold mb-2">Our Completed Projects</h2>
          <p className="text-muted mb-0">
            Trusted by hospitals, malls, shops and businesses across India.
          </p>
        </div>
      </div>

      <div className="cp-marquee">
        <div className="cp-track">
          {loop.map((project, index) => {
            const cover =
              project.coverImage?.url ||
              (project.images?.length > 0
                ? getGalleryImage(project.images[0])
                : null);

            return (
              <Link
                href={`/projects/${project._id}`}
                className="cp-card"
                key={`${project._id}-${index}`}
              >
                <div className="cp-card__imgwrap">
                  {cover ? (
                    <img
                      src={cover}
                      alt={project.title}
                      className="cp-card__img"
                    />
                  ) : (
                    <div
                      className="cp-card__img d-flex align-items-center justify-content-center"
                      style={{ background: "#e5e7eb", color: "#94a3b8" }}
                    >
                      <i className="bi bi-image" style={{ fontSize: "2rem" }}></i>
                    </div>
                  )}
                  <span className="cp-card__badge">{project.category}</span>
                  {project.images?.length > 0 && (
                    <span className="cp-card__count">
                      <i className="bi bi-images me-1"></i>
                      {project.images.length} photos
                    </span>
                  )}
                </div>
                <div className="cp-card__body">
                  <h5 className="cp-card__title">{project.title}</h5>
                  {project.location && (
                    <p className="cp-card__location">
                      <i className="bi bi-geo-alt me-1"></i>
                      {project.location}
                    </p>
                  )}
                  <span className="cp-card__link">View Project →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}