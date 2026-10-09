"use client";

import { useEffect, useState } from "react";
import { getSurveyStats } from "../../../services/surveyService";

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

  const pages = data.pages || [];
  const maxPage = pages.length > 0 ? Math.max(...pages.map((p) => p.count)) : 1;

  return (
    <div className="container py-4 py-md-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-bar-chart me-2"></i>Site Visit Analytics
      </h2>

      {/* Total Impressions Card */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div
            className="card border-0 shadow-sm"
            style={{ borderLeft: "4px solid #059669" }}
          >
            <div className="card-body text-center py-4">
              <div
                style={{ fontSize: "2.5rem", fontWeight: 800, color: "#059669" }}
              >
                {data.impressions}
              </div>
              <div
                className="text-muted"
                style={{ fontSize: "0.85rem", fontWeight: 600 }}
              >
                👀 Total Impressions
              </div>
              <small className="text-muted">
                Welcome toast shown to visitors
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Page-wise Impressions (from backend aggregation) */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">📄 Page-wise Impressions</h5>

              {pages.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {pages.map((item) => (
                    <div key={item._id}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span
                          className="fw-semibold"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {item._id || "/"}
                        </span>
                        <span className="fw-bold" style={{ color: "#065f46" }}>
                          {item.count}
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
                            width: `${(item.count / maxPage) * 100}%`,
                            background:
                              "linear-gradient(90deg, #059669, #10b981)",
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
                  No impressions yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Impressions */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">🕐 Recent Impressions</h5>

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
                      <span
                        className="fw-semibold text-truncate"
                        style={{ maxWidth: "60%" }}
                      >
                        📄 {item.page || "/"}
                      </span>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
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
                  No impressions yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}