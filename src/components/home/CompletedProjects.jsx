"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getFeaturedProjects } from "../../services/projectService";
import { getGalleryImage } from "../../utils/imageUtils";
import Image from "next/image";
import "../../styles/completedProject.css";

export default function CompletedProjects() {
  const [projects, setProjects] = useState([]);
  const trackRef = useRef(null);
  const autoRef = useRef(null);
  const dragState = useRef({ down: false, startX: 0, scrollLeft: 0 });

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

  /* ── auto slide ── */
  const startAuto = useCallback(() => {
    stopAuto();
    autoRef.current = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      // smooth scroll by 1px every 20ms = ~50px/sec
      el.scrollLeft += 1;
      // loop back when reached end
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }
    }, 20);
  }, []);

  const stopAuto = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) startAuto();
    return () => stopAuto();
  }, [projects, startAuto, stopAuto]);

  /* ── mouse drag ── */
  function onMouseDown(e) {
    dragState.current = { down: true, startX: e.pageX, scrollLeft: trackRef.current.scrollLeft };
    trackRef.current.style.cursor = "grabbing";
    stopAuto();
  }
  function onMouseMove(e) {
    if (!dragState.current.down) return;
    e.preventDefault();
    const walk = (e.pageX - dragState.current.startX) * 1.5;
    trackRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  }
  function onMouseUp() {
    dragState.current.down = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    startAuto();
  }

  /* ── touch swipe ── */
  function onTouchStart(e) {
    dragState.current = { down: true, startX: e.touches[0].pageX, scrollLeft: trackRef.current.scrollLeft };
    stopAuto();
  }
  function onTouchMove(e) {
    if (!dragState.current.down) return;
    const walk = (e.touches[0].pageX - dragState.current.startX) * 1.5;
    trackRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  }
  function onTouchEnd() {
    dragState.current.down = false;
    startAuto();
  }

  /* ── arrow buttons ── */
  function scrollBy(dir) {
    const el = trackRef.current;
    if (!el) return;
    stopAuto();
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
    setTimeout(startAuto, 2000);
  }

  if (projects.length === 0) return null;

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

      <div
        className="cp-slider"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        {/* Left Arrow */}
        <button className="cp-arrow cp-arrow--left" onClick={() => scrollBy(-1)} aria-label="Previous">
          <i className="bi bi-chevron-left"></i>
        </button>

        <div
          className="cp-track"
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {projects.map((project) => {
            const cover =
              project.coverImage?.url ||
              (project.images?.length > 0
                ? getGalleryImage(project.images[0])
                : null);

            return (
              <Link
                href={`/projects/${project.slug || project._id}`}
                className="cp-card"
                key={project._id}
                draggable={false}
              >
                <div className="cp-card__imgwrap">
                  {cover ? (
                    <Image src={cover} alt={project.title} className="cp-card__img" draggable={false} width={320} height={220} sizes="280px" />
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

        {/* Right Arrow */}
        <button className="cp-arrow cp-arrow--right" onClick={() => scrollBy(1)} aria-label="Next">
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}