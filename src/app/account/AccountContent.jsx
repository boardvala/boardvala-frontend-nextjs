"use client";

import Link from "next/link";

import { useAuth } from "../../context/AuthContext";

export default function Account() {
  const { user } = useAuth();

  const displayName = user?.name || user?.email || "there";

  return (
    <>
      <style>{`
        .acc-wrap { background: #f6f7f9; min-height: 78vh; }
        .acc-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
          color: #fff;
          border-radius: 18px;
          padding: 32px;
        }
        .acc-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: #2563eb;
          color: #fff;
          display: grid; place-items: center;
          font-size: 1.6rem; font-weight: 700;
          flex-shrink: 0;
        }
        .acc-card {
          background: #fff;
          border: 1px solid #ecedef;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(15,23,42,.05);
        }
        .acc-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #f1f3f5;
        }
        .acc-info-row:last-child { border-bottom: 0; }
        .acc-info-row .label { color: #6b7280; font-size: .9rem; }
        .acc-info-row .value { font-weight: 600; text-align: right; word-break: break-word; }
        .acc-action {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 18px;
          text-decoration: none;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
          height: 100%;
        }
        .acc-action:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 26px rgba(15,23,42,.10);
          border-color: #cbd5e1;
          color: #0f172a;
        }
        .acc-action .ico {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: #eef4ff;
          display: grid; place-items: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .acc-action .t { font-weight: 700; }
        .acc-action .s { color: #6b7280; font-size: .82rem; }
      `}</style>

      <div className="acc-wrap py-5">
        <div className="container">
          {/* Hero — मजकूर मधोमध (center) */}
          <div className="acc-hero text-center mb-4">
            <div className="acc-avatar mx-auto mb-3">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <h3 className="fw-bold mb-1">Welcome, {displayName}</h3>
            <p className="mb-0" style={{ color: "#cbd5e1" }}>
              Manage your account and orders
            </p>
          </div>

          <div className="row g-4">
            {/* Account info */}
            <div className="col-lg-7">
              <div className="acc-card p-4 h-100">
                <h5 className="fw-bold mb-3">Account Information</h5>

                <div className="acc-info-row">
                  <span className="label">Email</span>
                  <span className="value">{user?.email || "Not Available"}</span>
                </div>

                <div className="acc-info-row">
                  <span className="label">Mobile</span>
                  <span className="value">{user?.mobile || "Not Added"}</span>
                </div>

                <div className="acc-info-row">
                  <span className="label">Account Type</span>
                  <span className="value text-capitalize">{user?.role}</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-12">
                  <Link href="/account/orders" className="acc-action">
                    <span className="ico">📦</span>
                    <span>
                      <span className="t d-block">My Orders</span>
                      <span className="s">View your order history</span>
                    </span>
                  </Link>
                </div>

                <div className="col-12">
                  <Link href="/account/change-password" className="acc-action">
                    <span className="ico">🔒</span>
                    <span>
                      <span className="t d-block">Change Password</span>
                      <span className="s">Update your password</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}