"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

// TODO: तुमच्या स्वतःच्या नेमप्लेट फोटोने बदला (public/ मधला path किंवा Cloudinary URL).
const SECTION_IMAGE = "Engraved-House-Name.jpg";

export default function DesignYourOwnSection() {
  const router = useRouter();
  const { user } = useAuth();

  function handleUploadDesign() {
    router.push("/custom-design");
  }

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
          background: #0f172a;
          color: #fff;
          font-weight: 700;
          padding: 13px 30px;
          border-radius: 12px;
          border: none;
          transition: transform .15s ease, background .15s ease;
        }
        .dyo-cta:hover {
          background: #1e293b;
          color: #fff;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="container">
        <div className="row align-items-center g-4">
          {/* Left — image */}
          <div className="col-lg-6 text-center">
            <img
              src={SECTION_IMAGE}
              alt="A custom name plate ready to be produced"
              className="dyo-img"
            />
          </div>

          {/* Right — copy */}
          <div className="col-lg-6">
            <span className="badge bg-primary px-3 py-2 mb-3">
              CUSTOM DESIGN SERVICE
            </span>

            <h2 className="fw-bold mb-3">
              Already have your own design?
            </h2>

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
                <span className="ms-3">Fast production &amp; secure delivery</span>
              </div>
            </div>

            <button type="button" className="dyo-cta" onClick={handleUploadDesign}>
              Upload Your Design →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}