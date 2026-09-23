import { useState } from "react";

/**
 * Material videos popup — प्रत्येक material चा YouTube video, slide करता येतो.
 * Heading (उदा. "What is MDF?") + video. Prev/Next ने slide.
 *
 * TODO: खालच्या MATERIAL_VIDEOS मध्ये तुमचे YouTube video ID + heading टाका.
 *   video ID = YouTube URL मधला भाग: youtube.com/watch?v=ABC123  → "ABC123"
 *
 * वापर:
 *   const [showVideos, setShowVideos] = useState(false);
 *   <button onClick={() => setShowVideos(true)}>Learn about materials</button>
 *   {showVideos && <MaterialVideosModal onClose={() => setShowVideos(false)} />}
 */

const MATERIAL_VIDEOS = [
  { heading: "What is Vinyl?", videoId: "YOUR_VINYL_VIDEO_ID" },
  { heading: "What is Sunboard?", videoId: "YOUR_SUNBOARD_VIDEO_ID" },
  { heading: "What is MDF?", videoId: "KEyDdZU43Ck" },
  { heading: "What is Acrylic?", videoId: "YOUR_ACRYLIC_VIDEO_ID" },
  { heading: "What is a Banner?", videoId: "YOUR_BANNER_VIDEO_ID" },
];

export default function MaterialVideosModal({ onClose }) {
  const [current, setCurrent] = useState(0);

  const total = MATERIAL_VIDEOS.length;
  const item = MATERIAL_VIDEOS[current];

  function prev() {
    setCurrent((c) => (c - 1 + total) % total);
  }
  function next() {
    setCurrent((c) => (c + 1) % total);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* आतला डबा — बाहेर click ने बंद, आत click ने नको (stopPropagation) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "640px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header — gradient (theme) */}
        <div
          className="d-flex align-items-center justify-content-between text-white px-4 py-3"
          style={{ background: "linear-gradient(135deg, #1b263b, #243c63)" }}
        >
          <h5 className="mb-0 fw-bold">{item.heading}</h5>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              fontSize: "1.4rem",
              lineHeight: 1,
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        {/* Video (YouTube embed, responsive 16:9) */}
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            background: "#000",
          }}
        >
          <iframe
            key={item.videoId}
            src={`https://www.youtube.com/embed/${item.videoId}`}
            title={item.heading}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          ></iframe>
        </div>

        {/* Controls — prev / dots / next */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3">
          <button
            type="button"
            className="btn text-white px-3"
            style={{ backgroundColor: "#2563eb" }}
            onClick={prev}
          >
            &larr; Prev
          </button>

          {/* dots */}
          <div className="d-flex gap-2">
            {MATERIAL_VIDEOS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Video ${i + 1}`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === current ? "#2563eb" : "#cbd5e1",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn text-white px-3"
            style={{ backgroundColor: "#2563eb" }}
            onClick={next}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}