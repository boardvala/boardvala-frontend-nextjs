"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMyFeaturedOrderById, trackFeaturedOrder } from "../../../../services/featuredOrderService";


export default function FeaturedOrderContent() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const data = await getMyFeaturedOrderById(id);
      setOrder(data.order);

      // try {
      //   const t = await getFeaturedOrderTracking(id);
      //   setTracking(t.tracking);
      // } catch (trackErr) {
      //   console.log("tracking:", trackErr);
      // }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleTrackShipment() {
    setTrackingLoading(true);
    try {
      const data = await trackFeaturedOrder(id);
      if (data.success) {
        setTracking(data.tracking);
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: data.message || "Tracking not available yet.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Tracking failed.",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setTrackingLoading(false);
    }
  }

  function statusBadge(st) {
    if (st === "pending") return "bg-warning text-dark";
    if (st === "processing") return "bg-primary";
    if (st === "completed") return "bg-success";
    return "bg-danger"; // cancelled
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">order not found.</div>

        <Link href="/account/orders" className="btn btn-secondary">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Order Details</h2>
          <span className={`badge ${statusBadge(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="row">
          {/* Product */}
          {/* Product */}
          <div className="col-md-5 mb-4">
            <div className="card shadow-sm">
              {order.orderType === "ledFrame" && (
                <div
                  className="card-header text-center"
                  style={{ background: "#2563eb", color: "#fff" }}
                >
                  <i className="bi bi-lightbulb me-1"></i> LED Frame Order
                </div>
              )}
              <div className="card-body text-center">
                {order.orderType === "ledFrame" ? (
                  <>
                    {order.customerPhoto ? (
                      <img
                        src={order.customerPhoto}
                        alt="Your uploaded photo"
                        className="img-fluid"
                        style={{ maxHeight: "320px", objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-muted">Photo processing...</div>
                    )}
                    <p
                      className="text-muted mt-2 mb-0"
                      style={{ fontSize: "0.82rem" }}
                    >
                      📷 Your uploaded photo for LED frame
                    </p>
                  </>
                ) : (
                  <>
                    {order.previewImage ? (
                      <img
                        src={order.previewImage}
                        alt={order.title}
                        className="img-fluid rounded"
                        style={{ maxHeight: "320px", objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-muted">No image</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="col-md-7 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <hr />

                <h6 className="fw-semibold mb-3">
                  {order.title}
                  {order.orderType === "ledFrame" && (
                    <span
                      className="badge ms-2"
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        fontSize: "0.65rem",
                      }}
                    >
                      LED Frame
                    </span>
                  )}
                </h6>

                <p className="mb-2">
                  <strong>Order ID:</strong> #
                  {order._id.slice(-6).toUpperCase()}
                </p>
                {order.orderType === "ledFrame" && order.frameSize && (
                  <p className="mb-2">
                    <strong>Frame Size:</strong>{" "}
                    <span className="text-primary fw-semibold">
                      {order.frameSize}
                    </span>
                  </p>
                )}
                <p className="mb-2">
                  <strong>Unit Price:</strong> ₹ {order.price}
                </p>
                <p className="mb-2">
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p className="mb-2">
                  <strong>Total Paid:</strong>{" "}
                  <span className="text-success fw-semibold">
                    ₹ {order.totalAmount}
                  </span>
                </p>
                <p>
                  <strong>Order Status:</strong>{" "}
                  <span className={`badge ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </p>
                <p className="mb-0">
                  <strong>Placed on:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Shipping Information</h5>
            <hr />
            <p className="mb-2">
              <strong>Name:</strong> {order.customerName}
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> {order.customerPhone}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {order.customerEmail || "-"}
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {order.customerAddress}
            </p>
            <p className="mb-2">
              <strong>City:</strong> {order.customerCity}
            </p>
            <p className="mb-2">
              <strong>State:</strong> {order.customerState}
            </p>
            <p className="mb-0">
              <strong>Pincode:</strong> {order.customerPincode}
            </p>
            {order.trackingNumber ? (
              <div className="card shadow-sm mt-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-truck me-2"></i>Tracking Shippment
                  </h5>

                  <div className="d-flex flex-column gap-2 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Courier</span>
                      <span className="fw-semibold">
                        {order.courierName || "—"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Tracking Number</span>
                      <span className="fw-semibold">
                        {order.trackingNumber}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Status</span>
                      <span
                        className={`badge ${
                          order.shippingStatus
                            ?.toLowerCase()
                            .includes("delivered")
                            ? "bg-success"
                            : order.shippingStatus
                                  ?.toLowerCase()
                                  .includes("transit") ||
                                order.shippingStatus
                                  ?.toLowerCase()
                                  .includes("shipped")
                              ? "bg-primary"
                              : order.shippingStatus
                                    ?.toLowerCase()
                                    .includes("cancel")
                                ? "bg-danger"
                                : "bg-warning text-dark"
                        }`}
                      >
                        {order.shippingStatus || "Processing"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleTrackShipment}
                    disabled={trackingLoading}
                  >
                    {trackingLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Tracking...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-geo-alt me-2"></i>Track Shipment
                      </>
                    )}
                  </button>

                  {tracking && (
                    <div className="mt-3">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <span
                          className={`badge ${
                            tracking.status?.toLowerCase().includes("delivered")
                              ? "bg-success"
                              : tracking.status
                                    ?.toLowerCase()
                                    .includes("shipped")
                                ? "bg-primary"
                                : "bg-warning text-dark"
                          }`}
                          style={{ fontSize: "0.85rem" }}
                        >
                          {tracking.status}
                        </span>
                        {tracking.carrier && (
                          <span className="text-muted">
                            via {tracking.carrier}
                          </span>
                        )}
                        {tracking.estimatedDelivery && (
                          <span className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            Est:{" "}
                            {new Date(
                              tracking.estimatedDelivery,
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        {tracking.signedBy && (
                          <span className="text-muted">
                            <i className="bi bi-person-check me-1"></i>
                            Signed by: {tracking.signedBy}
                          </span>
                        )}
                      </div>

                      {tracking.events && tracking.events.length > 0 ? (
                        <div
                          className="border rounded p-3"
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          {tracking.events.map((event, i) => (
                            <div
                              key={i}
                              className={`d-flex gap-3 ${i < tracking.events.length - 1 ? "mb-3 pb-3 border-bottom" : ""}`}
                            >
                              <div>
                                <i
                                  className={`bi ${i === 0 ? "bi-geo-alt-fill text-primary" : "bi-circle text-muted"}`}
                                  style={{
                                    fontSize: i === 0 ? "1.1rem" : "0.7rem",
                                    marginTop: "4px",
                                  }}
                                ></i>
                              </div>
                              <div>
                                <div
                                  className="fw-semibold"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  {event.description}
                                </div>
                                <div
                                  className="text-muted"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {event.location && (
                                    <span className="me-3">
                                      <i className="bi bi-geo me-1"></i>
                                      {event.location}
                                    </span>
                                  )}
                                  {event.date && (
                                    <span>
                                      <i className="bi bi-clock me-1"></i>
                                      {new Date(event.date).toLocaleString(
                                        "en-IN",
                                        {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        },
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          No tracking events available yet.
                        </p>
                      )}

                      {tracking.trackUrl && (
                        <a
                          href={tracking.trackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-dark mt-3"
                        >
                          <i className="bi bi-box-arrow-up-right me-1"></i>
                          Track on Courier Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card shadow-sm mt-4">
                <div className="card-body text-center py-4">
                  <i
                    className="bi bi-box-seam text-muted"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p className="text-muted mt-2 mb-0">
                    Your order is being processed. Tracking details will be
                    available once shipped.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
