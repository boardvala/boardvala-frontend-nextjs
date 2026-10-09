"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { submitSurvey } from "../services/surveyService";

export default function SurveyPopup() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (localStorage.getItem("surveyDone")) return;
    if (pathname.startsWith("/admin")) return;

    const showTimer = setTimeout(() => {
      setShow(true);
      try {
        submitSurvey({ type: "impression", page: pathname });
      } catch {}
      localStorage.setItem("surveyDone", "true");
    }, 5000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const hideTimer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(hideTimer);
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          background: "linear-gradient(119deg, rgb(6 23 95) 0%, rgb(5 130 150 / 99%)",
          color: "#fff",
          padding: "14px 22px",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(25, 26, 25, 0.3)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          animation: "toastSlideIn 0.4s ease",
          maxWidth: "calc(100vw - 48px)",
        }}
      >
        <span style={{ fontSize: "1.4rem" }}>👋</span>
        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
          Welcome to BoardVala!
        </span>
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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