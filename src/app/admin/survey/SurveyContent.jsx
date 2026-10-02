"use client";

import { useEffect, useState } from "react";
import { getSurveyStats } from "../../../services/surveyService";

const SOURCE_ICONS = {
  google: "🔍",
  instagram: "📸",
  youtube: "🎬",
  facebook: "👥",
  whatsapp: "💬",
  friend: "🤝",
  ad: "📢",
  other: "🌐",
};

export default function SurveyContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const stats = await getSurveyStats();
      setData(stats);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-5 text-center text-muted">
        Unable to load survey data.
      </div>
    );
  }

  const responseRate =
    data.impressions > 0
      ? ((data.answers / data.impressions) * 100).toFixed(1)
      : 0;

  const maxCount =
    data.sources?.length > 0
      ? Math.max(...data.sources.map((s) => s.count))
      : 1;

  return (
    <div className="container py-4 py-md-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-bar-chart me-2"></i>Survey Analytics
      </h2>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #2563eb" }}
          >
            <div className="card-body text-center">
              <div
                style={{ fontSize: "2rem", fontWeight: 800, color: "#2563eb" }}
              >
                {data.impressions}
              </div>
              <div
                className="text-muted"
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                👀 Impressions
              </div>
              <small className="text-muted">Popup shown</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #16a34a" }}
          >
            <div className="card-body text-center">
              <div
                style={{ fontSize: "2rem", fontWeight: 800, color: "#16a34a" }}
              >
                {data.answers}
              </div>
              <div
                className="text-muted"
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                ✅ Answers
              </div>
              <small className="text-muted">Source selected</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #d97706" }}
          >
            <div className="card-body text-center">
              <div
                style={{ fontSize: "2rem", fontWeight: 800, color: "#d97706" }}
              >
                {data.skips}
              </div>
              <div
                className="text-muted"
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                ⏭️ Skipped
              </div>
              <small className="text-muted">Close / Maybe later</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #7c3aed" }}
          >
            <div className="card-body text-center">
              <div
                style={{ fontSize: "2rem", fontWeight: 800, color: "#7c3aed" }}
              >
                {responseRate}%
              </div>
              <div
                className="text-muted"
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                📊 Response Rate
              </div>
              <small className="text-muted">Answers / Impressions</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Sources Breakdown */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                📊 How Users Found BoardVala
              </h5>

              {data.sources?.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {data.sources.map((source) => (
                    <div key={source._id}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                          {SOURCE_ICONS[source._id] || "🌐"}{" "}
                          {source._id.charAt(0).toUpperCase() + source._id.slice(1)}
                        </span>
                        <span className="fw-bold" style={{ color: "#1b263b" }}>
                          {source.count}
                        </span>
                      </div>
                      <div
                        style={{
                          height: "8px",
                          background: "#f1f5f9",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(source.count / maxCount) * 100}%`,
                            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                            borderRadius: "10px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  No responses yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Responses */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">🕐 Recent Responses</h5>

              {data.recent?.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {data.recent.map((item, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between align-items-center p-2 rounded"
                      style={{
                        background: i % 2 === 0 ? "#f8fafc" : "#fff",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div>
                        <span className="me-2">
                          {SOURCE_ICONS[item.source] || "🌐"}
                        </span>
                        <span className="fw-semibold">
                          {item.source.charAt(0).toUpperCase() + item.source.slice(1)}
                        </span>
                      </div>
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  No responses yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}