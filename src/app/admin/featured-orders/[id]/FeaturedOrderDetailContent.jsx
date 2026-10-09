"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getFeaturedOrderById,
  updateFeaturedOrderStatus,
  updateFeaturedOrderShipping,
  trackFeaturedOrder,
} from "../../../../services/featuredOrderService";
import Swal from "sweetalert2";

export default function AdminFeaturedOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [shippingForm, setShippingForm] = useState({
    courierName: "",
    trackingNumber: "",
  });
  const [updatingShipping, setUpdatingShipping] = useState(false);
  const [tracking, setTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const data = await getFeaturedOrderById(id);
      setOrder(data.order);
      setStatus(data.order.status);
      setShippingForm({
        courierName: data.order.courierName || "",
        trackingNumber: data.order.trackingNumber || "",
      });

      // try {
      //   const t = await getAdminFeaturedOrderTracking(id);
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

  async function handleStatusUpdate() {
    try {
      await updateFeaturedOrderStatus(id, status);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Status Updated Successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
      loadOrder();
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to update Status.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  async function handleUpdateShipping() {
    setUpdatingShipping(true);
    try {
      const res = await updateFeaturedOrderShipping(id, shippingForm);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: res.emailSent
          ? "Shipping saved & email sent to customer! ✉️"
          : "Shipping details updated!",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      console.log("err", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to update shipping.",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setUpdatingShipping(false);
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
    return "bg-danger";
  }

  function paymentBadgeClass(st) {
    const s = (st || "").toLowerCase();
    if (s === "captured" || s === "paid" || s === "success")
      return "bg-success";
    if (s === "authorized" || s === "created") return "bg-warning text-dark";
    if (s === "failed" || s === "refunded") return "bg-danger";
    return "bg-secondary";
  }

  if (loading) {
    return <div className="container py-5">Loading...</div>;
  }

  if (!order) {
    return <div className="container py-5">Order Not Found</div>;
  }

  const payment =
    order.payment && typeof order.payment === "object" ? order.payment : null;

  return (
    <>
      <div className="container py-5">
        <h2 className="mb-4">Featured Order Details</h2>

        <div className="row">
          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header">Customer Details</div>
              <div className="card-body">
                <p>
                  <strong>Name:</strong> {order.customerName}
                </p>
                <p>
                  <strong>Phone:</strong> {order.customerPhone}
                </p>
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
                <p className="mb-0">
                  <strong>Pincode:</strong> {order.customerPincode}
                </p>

                {/* ---- Shipping & Tracking ---- */}
                <div className="card shadow-sm mt-4">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">
                      <i className="bi bi-truck me-2"></i>Shipping & Tracking
                    </h5>

                    {/* Update Form */}
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Courier Name
                        </label>
                        <input
                          className="form-control"
                          value={shippingForm.courierName}
                          onChange={(e) =>
                            setShippingForm((prev) => ({
                              ...prev,
                              courierName: e.target.value,
                            }))
                          }
                          placeholder="e.g. BlueDart, Delhivery"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Tracking Number
                        </label>
                        <input
                          className="form-control"
                          value={shippingForm.trackingNumber}
                          onChange={(e) =>
                            setShippingForm((prev) => ({
                              ...prev,
                              trackingNumber: e.target.value,
                            }))
                          }
                          placeholder="Paste from Envia dashboard"
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-dark"
                        onClick={handleUpdateShipping}
                        disabled={updatingShipping}
                      >
                        {updatingShipping ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save me-2"></i>Save Shipping
                          </>
                        )}
                      </button>

                      {shippingForm.trackingNumber && (
                        <button
                          className="btn btn-outline-primary"
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
                              <i className="bi bi-geo-alt me-2"></i>Track
                              Shipment
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Live Tracking Events */}
                    {tracking && (
                      <div className="mt-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <span
                            className={`badge ${
                              tracking.status === "Delivered"
                                ? "bg-success"
                                : tracking.status === "Shipped"
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>Product</span>
                {order.orderType === "ledFrame" && (
                  <span
                    className="badge"
                    style={{ background: "#2563eb", color: "#fff" }}
                  >
                    LED Frame
                  </span>
                )}
              </div>
              <div className="card-body text-center">
                {order.orderType === "ledFrame" ? (
                  <>
                    <h5 className="fw-semibold mb-2">{order.title}</h5>
                    {order.frameSize && (
                      <p className="mb-3">
                        <span
                          className="badge bg-light text-dark"
                          style={{ fontSize: "0.85rem" }}
                        >
                          📐 Frame Size: {order.frameSize}
                        </span>
                      </p>
                    )}
                    {order.customerPhoto ? (
                      <>
                        <p
                          className="fw-semibold text-muted mb-2"
                          style={{ fontSize: "0.85rem" }}
                        >
                          📷 Customer's Photo (Print-Ready)
                        </p>
                        <div
                          style={{
                            border: "2px solid #e2e8f0",
                            overflow: "hidden",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={order.customerPhoto}
                            alt="Customer uploaded photo"
                            className="img-fluid"
                            style={{ maxHeight: "350px", objectFit: "contain" }}
                          />
                        </div>
                        <div className="mt-3">
                          <a
                            href={order.customerPhoto}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            <i className="bi bi-eye me-1"></i>View Full Size
                          </a>
                          <button
                            className="btn btn-sm btn-dark"
                            onClick={async () => {
                              try {
                                const res = await fetch(order.customerPhoto);
                                const blob = await res.blob();
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `LED-Frame-${order._id.slice(-6)}.jpg`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                              } catch {
                                window.open(order.customerPhoto, "_blank");
                              }
                            }}
                          >
                            <i className="bi bi-download me-1"></i>Download
                            Photo
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-muted">
                        No customer photo uploaded
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {order.previewImage ? (
                      <img
                        src={order.previewImage}
                        alt={order.title}
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: "350px", objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-muted mb-3">No image</div>
                    )}
                    <h5 className="fw-semibold mb-0">{order.title}</h5>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Payment Details</span>
            {payment && (
              <span
                className={`badge ${paymentBadgeClass(payment.paymentStatus)}`}
              >
                {payment.paymentStatus || "Unknown"}
              </span>
            )}
          </div>
          <div className="card-body">
            {payment ? (
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Amount Paid:</strong>{" "}
                    <span className="text-success fw-semibold">
                      ₹ {payment.amountPaid}
                    </span>
                  </p>
                  <p className="mb-md-0">
                    <strong>Payment Status:</strong>{" "}
                    <span
                      className={`badge ${paymentBadgeClass(payment.paymentStatus)}`}
                    >
                      {payment.paymentStatus || "-"}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Payment ID:</strong>{" "}
                    <code>{payment.paymentId || "-"}</code>
                  </p>
                  <p className="mb-0">
                    <strong>Razorpay Order ID:</strong>{" "}
                    <code>{payment.razorpayOrderId || "-"}</code>
                  </p>
                  {payment.createdAt && (
                    <p className="mb-0 mt-2">
                      <strong>Paid On:</strong>{" "}
                      {new Date(payment.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted mb-0">
                Payment information is not available for this order.
              </p>
            )}
          </div>
        </div>

        <div className="card shadow">
          <div className="card-header">Order Details</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Product:</strong> {order.title}
                  {order.orderType === "ledFrame" && (
                    <span
                      className="badge ms-2"
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        fontSize: "0.7rem",
                      }}
                    >
                      LED Frame
                    </span>
                  )}
                </p>
                {order.orderType === "ledFrame" && order.frameSize && (
                  <p>
                    <strong>Frame Size:</strong> {order.frameSize}
                  </p>
                )}
                <p>
                  <strong>Unit Price:</strong> ₹ {order.price}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Total Amount:</strong>{" "}
                  <span className="text-success fw-semibold">
                    ₹ {order.totalAmount}
                  </span>
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
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
                  <strong>Current Status:</strong>{" "}
                  <span className={`badge ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
            </div>

            <hr />

            <div className="row align-items-center">
              <div className="col-md-6">
                <label className="form-label">Order Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-md-6">
                <button
                  className="btn btn-success mt-4"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
