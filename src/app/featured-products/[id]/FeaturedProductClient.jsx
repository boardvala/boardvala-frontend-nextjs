"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ProductCard from "../../../components/product/ProductCard";
import ReviewSection from "../../../components/review/ReviewSection";
import { getGalleryImage } from "../../../utils/imageUtils";
import { checkDeliveryByPincode } from "../../../services/deliveryService";
import "../../../styles/featured-details.css";

export default function FeaturedProductClient({ product, similar }) {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(getGalleryImage(product.images[0]));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container py-5">
        <h2>Product Not Found</h2>
        <button
          className="btn btn-outline-dark mt-3"
          onClick={() => router.back()}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // ---------- Pricing ----------
  const isBanner = product.category?.toLowerCase() === "banner";
  const selectedPrice = product.price;

  // ---------- Cart ----------
 function handleAddToCart() {
  const cart = JSON.parse(localStorage.getItem("customCart")) || [];

  // हाच featured product आधीच cart मध्ये आहे का
  const existingIndex = cart.findIndex(
    (item) =>
      item.orderType === "featuredProduct" &&
      item.featuredProductId === product._id,
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: Date.now(),
      orderType: "featuredProduct",
      featuredProductId: product._id,
      name: product.title,
      price: product.price,
      previewImage: product.images?.[0]
        ? getGalleryImage(product.images[0])
        : "",
      quantity,
    });
  }

  try {
    localStorage.setItem("customCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartChanged"));
  } catch (e) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: "Cart storage full. Please checkout current items first.",
      showConfirmButton: false,
      timer: 3000,
    });
    return;
  }

  router.push("/cart");
}

  // ---------- Delivery Check ----------
  async function handleCheckDelivery() {
    setChecking(true);
    try {
      const result = await checkDeliveryByPincode(pincode);
      setDeliveryResult(result);
    } catch (err) {
      console.log(err);
      setDeliveryResult({ available: false });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="fpd-wrap py-4 py-md-5">
      <div className="container">
        <div className="fpd-grid">
          {/* ---- Media (left) ---- */}
          <div className="fpd-media">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.title}
                className="fpd-main-img"
              />
            )}
            {product.images.length > 1 && (
              <div className="fpd-thumbs">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={getGalleryImage(image)}
                    alt={`${product.title} ${index + 1}`}
                    className={`fpd-thumb ${
                      selectedImage === getGalleryImage(image) ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(getGalleryImage(image))}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ---- Info (right) ---- */}
          <div className="fpd-info">
            {product.category && (
              <div className="fpd-cat">{product.category}</div>
            )}

            <h1 className="fpd-title">{product.title}</h1>

            <div className="fpd-price">
              {isBanner ? (
                <span style={{ fontSize: "1.1rem" }}>Starting @ ₹ 500</span>
              ) : (
                `₹ ${selectedPrice}`
              )}
            </div>

            {product.inStock ? (
              <span className="fpd-stock-in">In Stock</span>
            ) : (
              <span className="fpd-stock-out">Out of Stock</span>
            )}

            {/* Specifications */}
            <div className="mt-4">
              <p className="fpd-section-head">Product Specifications</p>
              <div
                className="rounded"
                style={{ border: "1px solid #e5e7eb", overflow: "hidden" }}
              >
                <div
                  className="d-flex justify-content-between px-3 py-2"
                  style={{ background: "#f8f9fa" }}
                >
                  <span className="text-muted">Material</span>
                  <span className="fw-semibold">{product.material || "-"}</span>
                </div>
                <div
                  className="d-flex justify-content-between px-3 py-2"
                  style={{ borderTop: "1px solid #e5e7eb" }}
                >
                  <span className="text-muted">Size</span>
                  <span className="fw-semibold">{product.size || "-"}</span>
                </div>
                <div
                  className="d-flex justify-content-between px-3 py-2"
                  style={{
                    background: "#f8f9fa",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <span className="text-muted">Thickness</span>
                  <span className="fw-semibold">
                    {product.thickness || "-"}
                  </span>
                </div>
                <div
                  className="d-flex justify-content-between px-3 py-2"
                  style={{ borderTop: "1px solid #e5e7eb" }}
                >
                  <span className="text-muted">Waterproof</span>
                  <span className="fw-semibold">
                    {product.waterproof ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity + Cart + Delivery */}
            <div
              className="mt-4"
              style={{ borderTop: "1px solid #ecedef", paddingTop: "20px" }}
            >
              {product.inStock && (
                <div className="mb-3">
                  <p className="fpd-section-head">Quantity</p>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span className="px-2 fw-bold">{quantity}</span>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Cart + Delivery row */}
              <div className="d-flex flex-column flex-md-row align-items-md-end gap-3">
                <button
                  className="fpd-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>

                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ecedef",
                    borderRadius: "12px",
                    boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                    padding: "10px 14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: ".72rem",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      fontWeight: 700,
                      color: "#6b7280",
                      margin: "0 0 8px",
                    }}
                  >
                    <i className="bi bi-geo-alt me-1"></i>Check Delivery
                  </p>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Enter pincode"
                      maxLength={6}
                      value={pincode}
                      inputMode="numeric"
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPincode(val);
                        if (val.length < 6) setDeliveryResult(null);
                      }}
                      style={{ maxWidth: "140px" }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: "#2563eb" }}
                      onClick={handleCheckDelivery}
                      disabled={pincode.length !== 6 || checking}
                    >
                      {checking ? "Checking..." : "Check"}
                    </button>
                    {deliveryResult && (
                      <span
                        className="fw-semibold"
                        style={{
                          fontSize: "0.82rem",
                          color: deliveryResult.available
                            ? "#16a34a"
                            : "#dc2626",
                        }}
                      >
                        <i
                          className={`bi ${
                            deliveryResult.available
                              ? "bi-check-circle-fill"
                              : "bi-x-circle-fill"
                          } me-1`}
                        ></i>
                        {deliveryResult.available
                          ? `Est. ${deliveryResult.estimatedDays}`
                          : "Not available"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Detail Sections (below grid) ---- */}
        <div className="mt-5">
          {/* About This Item */}
          {product.description && (
            <div className="mb-5">
              <h5 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                About This Item
              </h5>
              <div className="fpd-desc" style={{ lineHeight: 1.8 }}>
                {product.description.split("\n").map((para, i) => (
                  <p
                    key={i}
                    className={i > 0 ? "mt-3" : ""}
                    style={{ marginBottom: 0 }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          <div className="mb-5">
            <h5 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
              Key Features
            </h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>
                    Premium UV printing with vibrant, long-lasting colors
                  </span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>Scratch resistant and waterproof surface</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>Suitable for indoor and outdoor use</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>Easy to mount with included adhesive strips</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "#16a34a", marginTop: "2px" }}
                  ></i>
                  <span>Eco-friendly UV ink — safe and non-toxic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box + Shipping + Care — three columns */}
          <div className="row g-4">
            <div className="col-md-4">
              <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                <i
                  className="bi bi-box-seam me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                What&apos;s in the Box
              </h6>
              <div
                className="d-flex flex-column gap-2"
                style={{ fontSize: "0.9rem" }}
              >
                <span>1 × {product.title || "UV Printed Product"}</span>
                <span>Adhesive mounting strips</span>
                <span>Protective packaging</span>
              </div>
            </div>

            <div className="col-md-4">
              <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                <i
                  className="bi bi-truck me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                Shipping
              </h6>
              <div
                className="d-flex flex-column gap-2"
                style={{ fontSize: "0.9rem" }}
              >
                <span>Free shipping across India</span>
                <span>Dispatched within 3-5 business days</span>
              </div>
            </div>

            <div className="col-md-4">
              <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                <i
                  className="bi bi-heart me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                Care Instructions
              </h6>
              <div
                className="d-flex flex-column gap-2"
                style={{ fontSize: "0.9rem" }}
              >
                <span>Wipe clean with a soft, damp cloth</span>
                <span>Avoid prolonged direct sunlight</span>
                <span>Do not use chemical cleaners</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Similar Products ---- */}
      <section className="container pb-5">
        <hr className="mb-4 mb-md-5" />

        <div className="mb-4">
          <h3 className="fw-bold mb-1" style={{ color: "#1b263b" }}>
            Similar Products
          </h3>
          <p className="text-muted mb-0">
            More ready-to-order products you may like.
          </p>
        </div>

        <div className="row">
          {similar.length > 0 ? (
            similar.map((item) => (
              <ProductCard key={`featured-${item.id}`} product={item} />
            ))
          ) : (
            <div className="text-center text-muted">
              No similar products available.
            </div>
          )}
        </div>
      </section>

      {/* ---- Reviews ---- */}
      <ReviewSection featuredProductId={product._id} />
    </div>
  );
}
