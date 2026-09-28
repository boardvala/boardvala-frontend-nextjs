"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminDashboardStat } from "../../../services/adminDashboardService";

// Management cards config
const CARDS = [
  // {
  //   title: "Add Product",
  //   desc: "Create a new customizable product.",
  //   to: "/admin/products/add",
  //   icon: "➕",
  // },
  // {
  //   title: "Manage Products",
  //   desc: "View, edit and organize products.",
  //   to: "/admin/products",
  //   icon: "📦",
  // },
  // {
  //   title: "Orders",
  //   desc: "View customer orders and production files.",
  //   to: "/admin/orders",
  //   icon: "🧾",
  // },
  {
    title: "Registered Users",
    desc: "View registered users and their account details.",
    to: "/admin/registered-users",
    icon: "👥",
  },
  {
    title: "Custom Design Orders",
    desc: "Review uploaded design requests & production details.",
    to: "/admin/custom-design-orders",
    icon: "🎨",
  },
  {
    title: "Add Gallery Designs",
    desc: "Manage customer-facing design gallery.",
    to: "/admin/gallery",
    icon: "🖼️",
  },
  {
    title: "Add Featured Products",
    desc: "Manage ready-to-order products with fixed prices.",
    to: "/admin/featured-products",
    icon: "⭐",
  },
  {
    title: "Featured Orders",
    desc: "Review Featured Orders & Orders details.",
    to: "/admin/featured-orders",
    icon: "⭐",
  },
  {
    title: "Add Pricing",
    desc: "Manage pricing by material and frame size.",
    to: "/admin/pricing",
    icon: "💰",
  },
  {
    title: "Blog Posts",
    desc: "Write and manage blog articles for SEO.",
    to: "/admin/blog",
    icon: "📝",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomOrders: 0,
    totalFeaturedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getAdminDashboardStat();
        if (res?.stats) setStats(res.stats);
      } catch (err) {
        console.log("Failed to load stats:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <>
      <style>{`
        .dash-wrap { background: #f6f7f9; min-height: 80vh; }
        .dash-head h2 { font-weight: 800; }

        .stat-card {
          border-radius: 16px;
          padding: 20px;
          color: #fff;
          box-shadow: 0 8px 22px rgba(15,23,42,.10);
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .stat-card .ico {
          width: 52px; height: 52px;
          border-radius: 12px;
          background: rgba(255,255,255,.18);
          display: grid; place-items: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .stat-card .num { font-size: 1.9rem; font-weight: 800; line-height: 1; }
        .stat-card .lbl { font-size: .82rem; opacity: .9; letter-spacing: .03em; }
        .stat-users { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
        .stat-custom { background: linear-gradient(135deg, #0f172a, #334155);}
        .stat-featured { background: linear-gradient(135deg, #f59e0b, #d97706);}

        .admin-card {
          background: #fff;
          border: 1px solid #ecedef;
          border-radius: 16px;
          padding: 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        }
        .admin-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(15,23,42,.10);
          border-color: #cbd5e1;
        }
        .admin-card.highlight { border-color: #2563eb; }
        .admin-card .c-ico {
          width: 46px; height: 46px;
          border-radius: 12px;
          background: #eef4ff;
          display: grid; place-items: center;
          font-size: 1.3rem;
          margin-bottom: 12px;
        }
        .admin-card h5 { font-weight: 700; margin-bottom: 6px; }
        .admin-card p { color: #6b7280; font-size: .88rem; flex-grow: 1; }
        .admin-card .btn-open {
          background: #0f172a; color: #fff;
          border-radius: 10px; font-weight: 600;
          padding: 8px 0; text-align: center;
          text-decoration: none;
          transition: background .15s ease;
        }
        .admin-card .btn-open:hover { background: #000; }
        .admin-card.highlight .btn-open { background: #2563eb; }
        .admin-card.highlight .btn-open:hover { background: #1d4ed8; }

        /* ---- Mobile: सगळं लहान करा ---- */
        @media (max-width: 576px) {
          .dash-head h2 { font-size: 1.35rem; }
          .dash-head p { font-size: .85rem; }

          .stat-card {
            padding: 12px;
            border-radius: 12px;
            gap: 10px;
          }
          .stat-card .ico {
            width: 38px; height: 38px;
            font-size: 1.1rem;
            border-radius: 9px;
          }
          .stat-card .num { font-size: 1.3rem; }
          .stat-card .lbl { font-size: .72rem; }

          .admin-card {
            padding: 14px;
            border-radius: 12px;
          }
          .admin-card .c-ico {
            width: 36px; height: 36px;
            font-size: 1.05rem;
            border-radius: 9px;
            margin-bottom: 8px;
          }
          .admin-card h5 { font-size: .95rem; margin-bottom: 4px; }
          .admin-card p { font-size: .78rem; }
          .admin-card .btn-open { font-size: .85rem; padding: 6px 0; }
        }
      `}</style>

      <div className="dash-wrap py-4 py-md-5">
        <div className="container">
          {/* Heading */}
          <div className="dash-head mb-4">
            <h2 className="mb-1">Admin Dashboard</h2>
            <p className="text-muted mb-0">
              Welcome to the BoardVala Administration Panel
            </p>
          </div>

          {/* Stat cards */}
          <div className="row g-2 g-sm-3 mb-4">
            <div className="col-6">
              <div className="stat-card stat-users">
                <span className="ico">👥</span>
                <div>
                  <div className="num">{loading ? "—" : stats.totalUsers}</div>
                  <div className="lbl">Registered Users</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card stat-custom">
                <span className="ico">🎨</span>
                <div>
                  <div className="num">
                    {loading ? "—" : stats.totalCustomOrders}
                  </div>
                  <div className="lbl">Custom Orders</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card stat-featured">
                <span className="ico">⭐</span>
                <div>
                  <div className="num">
                    {loading ? "—" : stats.totalFeaturedOrders}
                  </div>
                  <div className="lbl">Featured Orders</div>
                </div>
              </div>
            </div>
          </div>

          {/* Management cards — mobile: 2 col, lg: 3 */}
          <div className="row g-2 g-sm-3 g-md-4">
            {CARDS.map((card) => (
              <div className="col-6 col-lg-4" key={card.to}>
                <div
                  className={`admin-card ${card.highlight ? "highlight" : ""}`}
                >
                  <div className="c-ico">{card.icon}</div>
                  <h5>{card.title}</h5>
                  <p>{card.desc}</p>
                  <Link href={card.to} className="btn-open mt-2">
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
