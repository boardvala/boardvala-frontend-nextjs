"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { submitSurvey } from "../services/surveyService";

const SOURCES = [
  { id: "google", label: "Google Search", icon: "🔍" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "youtube", label: "YouTube", icon: "🎬" },
  { id: "facebook", label: "Facebook", icon: "👥" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "friend", label: "Friend / Family", icon: "🤝" },
  { id: "ad", label: "Advertisement", icon: "📢" },
  { id: "other", label: "Other", icon: "🌐" },
];

export default function SurveyPopup() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Already answered — skip
    if (localStorage.getItem("surveyDone")) return;

    // Admin pages — skip
    if (pathname.startsWith("/admin")) return;

    // 5 sec delay
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(sourceId) {
    setSelected(sourceId);
    try {
      await submitSurvey({ source: sourceId, page: pathname });
    } catch {
      // silent fail — survey = non-critical
    }
    localStorage.setItem("surveyDone", "true");
    setSubmitted(true);

    // 2 sec नंतर popup close
    setTimeout(() => setShow(false), 2000);
  }

  function handleClose() {
    localStorage.setItem("surveyDone", "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 9998,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "min(380px, calc(100vw - 32px))",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          zIndex: 9999,
          overflow: "hidden",
          animation: "surveySlideUp 0.4s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1b263b 0%, #243c63 100%)",
            padding: "20px 24px",
            position: "relative",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "12px",
              right: "14px",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.75rem",
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            Quick Survey
          </p>
          <h3
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "1.15rem",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            How did you find BoardVala? 🤔
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🙏</div>
              <h4 style={{ fontWeight: 700, color: "#1b263b", margin: "0 0 4px" }}>
                Thank You!
              </h4>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                Your feedback helps us improve.
              </p>
            </div>
          ) : (
            <>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  margin: "0 0 16px",
                }}
              >
                Help us know where you discovered us:
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {SOURCES.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => handleSubmit(source.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      background: selected === source.id ? "#f0fdf4" : "#fff",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#1b263b",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#2563eb";
                      e.target.style.background = "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.background = "#fff";
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{source.icon}</span>
                    {source.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div
            style={{
              padding: "0 24px 16px",
              textAlign: "center",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.78rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Skip, maybe later
            </button>
          </div>
        )}
      </div>

      {/* Animation */}
      <style>{`
        @keyframes surveySlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}