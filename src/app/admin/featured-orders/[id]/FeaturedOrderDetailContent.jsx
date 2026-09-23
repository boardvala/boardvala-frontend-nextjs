"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getFeaturedOrderById,
  updateFeaturedOrderStatus,
} from "../../../../services/featuredOrderService";

export default function AdminFeaturedOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const data = await getFeaturedOrderById(id);
      setOrder(data.order);
      setStatus(data.order.status);

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
      alert("Status Updated Successfully");
      loadOrder();
    } catch (err) {
      console.error(err);
      alert("Unable to Update Status");
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

                <hr />
                <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                  <i className="bi bi-truck me-2"></i>Shipping &amp; Tracking
                </h6>
                {tracking?.awbCode ? (
                  <div
                    className="p-3 rounded"
                    style={{ background: "#eef2ff" }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Courier</span>
                      <span className="fw-semibold">
                        {tracking.courierName}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Tracking No (AWB)</span>
                      <span className="fw-semibold">{tracking.awbCode}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Status</span>
                      <span
                        className="fw-semibold"
                        style={{ color: "#2563eb" }}
                      >
                        {tracking.shipmentStatus || tracking.orderStatus}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-3 rounded text-muted"
                    style={{ background: "#f1f5f9" }}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Not shipped yet. Assign a courier in Shiprocket to generate
                    tracking.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header">Product</div>
              <div className="card-body text-center">
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
                </p>
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
