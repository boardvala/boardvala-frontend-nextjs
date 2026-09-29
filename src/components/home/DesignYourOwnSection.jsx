"use client";

import Link from "next/link";
// TODO: तुमच्या स्वतःच्या नेमप्लेट फोटोने बदला (public/ मधला path किंवा Cloudinary URL).
const SECTION_IMAGE = "catlog.png";

export default function DesignYourOwnSection() {
  return (
    <section className="py-5 bg-light">
      <style>{`
        .dyo-check {
          display: inline-grid;
          place-items: center;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #2563eb;
          color: #fff;
          font-size: .8rem;
          flex-shrink: 0;
        }
        .dyo-img {
          width: 100%;
          max-height: 440px;
          object-fit: cover;
          border-radius: 18px;
          box-shadow: 0 20px 45px rgba(15,23,42,.18);
        }
        .dyo-cta {
          display: inline-block;
          text-decoration: none;
          background: #2563eb;
          border: none;
          color: #fff;
          font-weight: 700;
          padding: 14px 30px;
          border-radius: 12px;
          box-shadow: 0 10px 26px rgba(37, 99, 235, 0.45);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
       }
       .dyo-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(37, 99, 235, 0.55);
          color: #fff;
        }
      `}</style>

      <div className="container">
        <div className="row align-items-center g-4">
          {/* Left — image */}
          <div className="col-lg-6 text-center">
            <img
              src={SECTION_IMAGE}
              alt="A custom acrylic photo frame, name plate ready to be produced - by boardvala"
              className="dyo-img"
            />
          </div>

          {/* Right — copy */}
          <div className="col-lg-6">
            <span className="badge bg-primary px-3 py-2 mb-3">
              CUSTOM DESIGN SERVICE
            </span>

            <h2 className="fw-bold mb-3">Already have your own design?</h2>

            <p className="text-muted fs-5 mb-4">
              Upload your artwork, logo or photo and choose the size that fits
              your door. Our team produces it on premium materials with a clean,
              professional finish — ready to mount at your home or flat.
            </p>

            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <span className="dyo-check">✓</span>
                <span className="ms-3">Upload JPG, PNG, SVG</span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <span className="dyo-check">✓</span>
                <span className="ms-3">
                  Choose your exact size &amp; orientation
                </span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <span className="dyo-check">✓</span>
                <span className="ms-3">
                  Premium MDF, Acrylic, Sunboard &amp; Vinyl finishes
                </span>
              </div>

              <div className="d-flex align-items-center">
                <span className="dyo-check">✓</span>
                <span className="ms-3">
                  Fast production &amp; secure delivery
                </span>
              </div>
            </div>

            <Link href="/custom-design" className="dyo-cta">
              Upload Your Design →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
