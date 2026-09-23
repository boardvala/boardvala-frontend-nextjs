"use client";

import "../styles/skeleton.css";

// Basic building blocks
export function SkeletonBox({ width, height, radius = "8px", className = "" }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: width || "100%",
        height: height || "20px",
        borderRadius: radius,
      }}
    />
  );
}

export function SkeletonCircle({ size = "40px" }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
      }}
    />
  );
}

export function SkeletonText({ lines = 3, lastWidth = "60%" }) {
  return (
    <div className="d-flex flex-column gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer"
          style={{
            height: "14px",
            borderRadius: "6px",
            width: i === lines - 1 ? lastWidth : "100%",
          }}
        />
      ))}
    </div>
  );
}

// ---- Page-specific skeletons ----

// Home page sections
export function SkeletonHeroSection() {
  return (
    <div className="skeleton-shimmer" style={{ width: "100%", height: "60vh", borderRadius: 0 }} />
  );
}

export function SkeletonProductCard() {
  return (
    <div className="col-6 col-md-3">
      <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #ecedef" }}>
        <SkeletonBox height="180px" radius="0" />
        <div className="p-3">
          <SkeletonBox height="16px" width="70%" className="mb-2" />
          <SkeletonBox height="14px" width="40%" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 8 }) {
  return (
    <div className="row g-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

// Featured Product Details
export function SkeletonFeaturedProductDetails() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Image */}
        <div className="col-lg-6">
          <SkeletonBox height="400px" radius="12px" className="mb-3" />
          <div className="d-flex gap-2">
            <SkeletonBox width="70px" height="70px" radius="8px" />
            <SkeletonBox width="70px" height="70px" radius="8px" />
            <SkeletonBox width="70px" height="70px" radius="8px" />
          </div>
        </div>
        {/* Info */}
        <div className="col-lg-6">
          <SkeletonBox height="14px" width="80px" className="mb-3" />
          <SkeletonBox height="28px" width="70%" className="mb-3" />
          <SkeletonBox height="32px" width="120px" className="mb-3" />
          <SkeletonBox height="22px" width="90px" className="mb-4" />
          <SkeletonBox height="16px" width="150px" className="mb-2" />
          <SkeletonBox height="120px" radius="12px" className="mb-4" />
          <SkeletonBox height="16px" width="80px" className="mb-2" />
          <div className="d-flex gap-2 mb-4">
            <SkeletonBox width="36px" height="36px" radius="6px" />
            <SkeletonBox width="30px" height="36px" radius="6px" />
            <SkeletonBox width="36px" height="36px" radius="6px" />
          </div>
          <SkeletonBox height="48px" width="160px" radius="10px" />
        </div>
      </div>
    </div>
  );
}

// Gallery Design Details
export function SkeletonGalleryDesignDetails() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Media — left */}
        <div className="col-lg-6">
          <SkeletonBox height="380px" radius="12px" className="mb-3" />
          <div className="d-flex gap-2">
            <SkeletonBox width="65px" height="65px" radius="8px" />
            <SkeletonBox width="65px" height="65px" radius="8px" />
            <SkeletonBox width="65px" height="65px" radius="8px" />
            <SkeletonBox width="65px" height="65px" radius="8px" />
          </div>
        </div>

        {/* Info — right */}
        <div className="col-lg-6">
          {/* Title */}
          <SkeletonBox height="28px" width="80%" className="mb-3" />
          {/* Price */}
          <SkeletonBox height="32px" width="120px" className="mb-4" />

          {/* About heading */}
          <SkeletonBox height="12px" width="130px" className="mb-2" />
          {/* Description */}
          <SkeletonBox height="14px" width="100%" className="mb-2" />
          <SkeletonBox height="14px" width="90%" className="mb-2" />
          <SkeletonBox height="14px" width="60%" className="mb-4" />

          {/* Sizes heading */}
          <SkeletonBox height="12px" width="120px" className="mb-3" />
          {/* Size buttons */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            <SkeletonBox width="90px" height="38px" radius="8px" />
            <SkeletonBox width="90px" height="38px" radius="8px" />
            <SkeletonBox width="90px" height="38px" radius="8px" />
            <SkeletonBox width="90px" height="38px" radius="8px" />
          </div>

          {/* Upload button */}
          <SkeletonBox height="48px" width="200px" radius="10px" />
        </div>
      </div>

      {/* Similar Designs */}
      <hr className="my-5" />
      <SkeletonBox height="24px" width="180px" className="mb-2" />
      <SkeletonBox height="14px" width="220px" className="mb-4" />
      <div className="row g-3">
        <SkeletonProductCard />
        <SkeletonProductCard />
        <SkeletonProductCard />
        <SkeletonProductCard />
      </div>
    </div>
  );
}

// Review Page
export function SkeletonReviewPage() {
  return (
    <div style={{ background: "#f6f7f9", minHeight: "70vh" }}>
      <div className="container py-5">
        <SkeletonBox height="28px" width="250px" className="mb-2" />
        <SkeletonBox height="16px" width="300px" className="mb-4" />
        <div className="row g-4">
          <div className="col-lg-7">
            <SkeletonBox height="400px" radius="16px" />
          </div>
          <div className="col-lg-5">
            <SkeletonBox height="350px" radius="16px" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Page
export function SkeletonCartPage() {
  return (
    <div className="container py-5">
      <SkeletonBox height="28px" width="200px" className="mb-4" />
      <div className="row g-4">
        <div className="col-lg-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="card border-0 shadow-sm mb-3"
              style={{ borderRadius: "12px" }}
            >
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-center mb-3 mb-lg-0">
                    <SkeletonBox height="120px" width="140px" radius="8px" />
                  </div>
                  <div className="col-lg-4 mb-3 mb-lg-0">
                    <SkeletonBox height="18px" width="60%" className="mb-2" />
                    <SkeletonBox height="14px" width="40%" className="mb-2" />
                    <SkeletonBox height="16px" width="50%" />
                  </div>
                  <div className="col-lg-2 text-center">
                    <SkeletonBox height="32px" width="90px" radius="6px" />
                  </div>
                  <div className="col-lg-2 text-center">
                    <SkeletonBox height="32px" width="70px" radius="6px" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <SkeletonBox height="300px" radius="15px" />
        </div>
      </div>
    </div>
  );
}

// Order List
export function SkeletonOrderList({ count = 3 }) {
  return (
    <div className="container py-5">
      <SkeletonBox height="28px" width="200px" className="mb-4" />
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card border-0 shadow-sm mb-3"
          style={{ borderRadius: "12px" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <SkeletonBox height="16px" width="120px" />
              <SkeletonBox height="24px" width="90px" radius="999px" />
            </div>
            <div className="d-flex gap-3">
              <SkeletonBox width="80px" height="80px" radius="8px" />
              <div className="flex-grow-1">
                <SkeletonBox height="16px" width="60%" className="mb-2" />
                <SkeletonBox height="14px" width="40%" className="mb-2" />
                <SkeletonBox height="14px" width="30%" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Order Details
export function SkeletonOrderDetails() {
  return (
    <div className="container py-5">
      <SkeletonBox height="28px" width="250px" className="mb-4" />
      <div className="row g-4">
        <div className="col-lg-7">
          <SkeletonBox height="300px" radius="16px" className="mb-4" />
          <SkeletonBox height="150px" radius="16px" />
        </div>
        <div className="col-lg-5">
          <SkeletonBox height="250px" radius="16px" className="mb-4" />
          <SkeletonBox height="120px" radius="16px" />
        </div>
      </div>
    </div>
  );
}

// Checkout
export function SkeletonCheckout() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center g-4">
        <div className="col-lg-7">
          <SkeletonBox height="500px" radius="16px" />
        </div>
        <div className="col-lg-5">
          <SkeletonBox height="250px" radius="16px" />
        </div>
      </div>
    </div>
  );
}