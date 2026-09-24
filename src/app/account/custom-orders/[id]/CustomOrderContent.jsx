"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { getMyCustomDesignOrderById } from "../../../../services/customDesignService";
import { trackOrderShipment } from "../../../../services/customDesignService";

export default function CustomOrderDetails() {
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
      const data = await getMyCustomDesignOrderById(id);

      setOrder(data.order);

      // try {
      //   const t = await getOrderTracking(id);
      //   setTracking(t.tracking);
      // } catch (trackErr) {
      //   console.log("tracking:", trackErr);
      // }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleTrackShipment() {
    setTrackingLoading(true);
    try {
      const data = await trackOrderShipment(id);
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
        <div className="alert alert-danger">Custom design order not found.</div>

        <Link href="/account/orders" className="btn btn-secondary">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const badgeClass =
    order.status === "Completed"
      ? "bg-success"
      : order.status === "Rejected"
        ? "bg-danger"
        : order.status === "Processing"
          ? "bg-primary"
          : "bg-warning text-dark";

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Custom Order Details</h2>

          <Link href="/account/orders" className="btn btn-outline-dark">
            Back
          </Link>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Order ID #{order._id.slice(-6).toUpperCase()}</strong>

            <span className={`badge ${badgeClass}`}>{order.status}</span>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-5 text-center mb-4 mb-md-0">
                <img
                  src={order.designFile?.url}
                  alt="Custom Design"
                  className="img-fluid rounded border"
                  style={{
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div className="col-md-7">
                <h5 className="mb-3">Order Summary</h5>

                <hr />
                <p>
                  <strong>Material:</strong> {order.material}
                </p>

                <p>
                  <strong>Size:</strong> {order.frameSize}
                </p>

                <p>
                  <strong>Price:</strong> ₹ {order.price}
                </p>

                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>

                <p>
                  <strong>Total:</strong> ₹ {order.totalAmount}
                </p>

                <p>
                  <strong>Placed On:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>

                <p>
                  <strong>Order Status:</strong>{" "}
                  <span className={`badge ${badgeClass}`}>{order.status}</span>
                </p>

                <p>
                  <strong>Instructions:</strong>
                </p>

                <div className="border rounded p-3 bg-light">
                  {order.instructions
                    ? order.instructions
                    : "No special instructions."}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Shipping Information</h5>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Name:</strong> {order.customerName}
                </p>
                <p>
                  <strong>Phone:</strong> {order.customerPhone}
                </p>
              </div>

              <div className="col-md-6">
                <p>
                  <strong>Email:</strong> {order.customerEmail || "-"}
                </p>
                <p>
                  <strong>Address:</strong> {order.customerAddress}
                </p>
                <p>
                  <strong>City:</strong> {order.customerCity}
                </p>
                <p>
                  <strong>State:</strong> {order.customerState}
                </p>
                <p>
                  <strong>Pincode:</strong> {order.customerPincode}
                </p>
              </div>
            </div>

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
