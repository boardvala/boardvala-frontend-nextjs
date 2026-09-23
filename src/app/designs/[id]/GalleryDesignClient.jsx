"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../../../components/product/ProductCard";
import ReviewSection from "../../../components/review/ReviewSection";
import { getGalleryImage } from "../../../utils/imageUtils";
import "../../../styles/gallerydetails.css";

export default function GalleryDesignClient({ design, similarDesigns, pricing }) {
  const router = useRouter();

  const [selectedFrameSize, setSelectedFrameSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (design?.images?.length > 0) {
      setSelectedImage(getGalleryImage(design.images[0]));
    }

    if (pricing?.framePrices?.length) {
      setSelectedFrameSize(pricing.framePrices[0].frameSize);
    }
  }, [design, pricing]);

  if (!design) {
    return (
      <div className="container py-5">
        <h2>Design Not Found</h2>
        <button
          className="btn btn-outline-dark mt-3"
          onClick={() => router.back()}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const selectedPrice =
    pricing?.framePrices?.find((item) => item.frameSize === selectedFrameSize)
      ?.price || 0;

  function handleUpload() {
    const params = new URLSearchParams({
      material: design.category,
      galleryDesignId: design._id,
    });

    if (pricing?.pricingType !== "banner" && selectedFrameSize) {
      params.set("selectedFrameSize", selectedFrameSize);
    }

    router.push(`/custom-design?${params.toString()}`);
  }

  return (
    <>
      <div className="gd-wrap py-4 py-md-5">
        <div className="container">
          <div className="gd-grid">
            {/* ---- Media ---- */}
            <div className="gd-media">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={design.title}
                  className="gd-main-img"
                />
              )}

              {design.images.length > 1 && (
                <div className="gd-thumbs">
                  {design.images.map((image, index) => {
                    const src = getGalleryImage(image);
                    if (!src) return null;
                    return (
                      <img
                        key={index}
                        src={src}
                        alt={`${design.title} ${index + 1}`}
                        className={`gd-thumb ${
                          selectedImage === src ? "active" : ""
                        }`}
                        onClick={() => setSelectedImage(src)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* ---- Info ---- */}
            <div className="gd-info">
              <h1 className="gd-title">{design.title}</h1>

              <div className="gd-price">
                {pricing?.pricingType === "banner" ? (
                  <span style={{ fontSize: "1.1rem" }}>Starting @ ₹ 500</span>
                ) : (
                  `₹ ${selectedPrice}`
                )}
              </div>

              {/* About */}
              <p className="gd-section-head">About This Item</p>
              <p className="gd-desc">
                {design.description || "No description available."}
              </p>

              {pricing?.pricingType === "banner" ? (
                <div
                  className="p-3 rounded mb-3"
                  style={{ background: "#f1f5f9" }}
                >
                  <p
                    className="mb-1 fw-semibold"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className="bi bi-rulers me-1"></i>Custom Size Banner
                  </p>
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Enter your desired width & length for banner. minimum order
                    ₹500.
                  </p>
                </div>
              ) : (
                <>
                  <p className="gd-section-head">Available Sizes</p>
                  <div className="gd-sizes">
                    {pricing?.framePrices?.map((item) => (
                      <button
                        key={item.frameSize}
                        type="button"
                        className={`gd-size-btn ${
                          selectedFrameSize === item.frameSize ? "active" : ""
                        }`}
                        onClick={() => setSelectedFrameSize(item.frameSize)}
                      >
                        {item.frameSize}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Upload — मुख्य CTA */}
              <button className="gd-upload-btn" onClick={handleUpload}>
                Upload My Design →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Designs */}
      <section className="container pb-5">
        <hr className="mb-4 mb-md-5" />

        <div className="mb-4">
          <h3 className="gd-similar-head mb-1">Similar Designs</h3>
          <p className="text-muted mb-0">
            Explore more {design.category} designs.
          </p>
        </div>

        <div className="row">
          {similarDesigns.length > 0 ? (
            similarDesigns.map((item) => (
              <ProductCard key={`${item.type}-${item.id}`} product={item} />
            ))
          ) : (
            <div className="text-center text-muted">
              No similar designs available.
            </div>
          )}
        </div>
      </section>

      <ReviewSection galleryDesignId={design._id} />
    </>
  );
}