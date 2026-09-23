"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRequestImage } from "../../../../utils/imageUtils";
import {
  getCustomDesignOrder,
  updateCustomDesignStatus,
  getAdminOrderTracking,
} from "../../../../services/customDesignService";


export default function AdminCustomDesignOrderDetails() {
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
      const data = await getCustomDesignOrder(id);
      setOrder(data.order);
      setStatus(data.order.status);

      // try {
      //   const t = await getAdminOrderTracking(id);
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
      await updateCustomDesignStatus(id, status);
      alert("Status Updated Successfully");
      loadOrder();
    } catch (err) {
      console.error(err);
      alert("Unable to Update Status");
    }
  }

  async function downloadPreview() {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `design-${order._id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      window.open(fileUrl, "_blank");
    }
  }

  if (loading) {
    return <div className="container py-5">Loading...</div>;
  }

  if (!order) {
    return <div className="container py-5">Order Not Found</div>;
  }

  const fileUrl = getRequestImage(order.designFile);
  const extension = fileUrl.split(".").pop().split("?")[0].toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "svg", "webp"].includes(extension);

  // payment populate झाला असेल तर object, नाहीतर फक्त id (string) असू शकतो
  const payment =
    order.payment && typeof order.payment === "object" ? order.payment : null;

  // payment status नुसार badge रंग
  function paymentBadgeClass(st) {
    const s = (st || "").toLowerCase();
    if (s === "captured" || s === "paid" || s === "success")
      return "bg-success";
    if (s === "authorized" || s === "created") return "bg-warning text-dark";
    if (s === "failed" || s === "refunded") return "bg-danger";
    return "bg-secondary";
  }

  return (
    <>
      <div className="container py-5">
        <h2 className="mb-4">Custom Design Order Details</h2>

        <div className="row">
          {/* Customer */}
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

      {/* Tracking */}
      <hr />
      <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
        <i className="bi bi-truck me-2"></i>Shipping &amp; Tracking
      </h6>
      {tracking?.awbCode ? (
        <div className="p-3 rounded" style={{ background: "#eef2ff" }}>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Courier</span>
            <span className="fw-semibold">{tracking.courierName}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Tracking No (AWB)</span>
            <span className="fw-semibold">{tracking.awbCode}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Status</span>
            <span className="fw-semibold" style={{ color: "#2563eb" }}>
              {tracking.shipmentStatus || tracking.orderStatus}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded text-muted" style={{ background: "#f1f5f9" }}>
          <i className="bi bi-clock-history me-2"></i>
          Not shipped yet. Assign a courier in Shiprocket to generate tracking.
        </div>
      )}
    </div>
  </div>
</div>

          {/* Design */}
          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header">Uploaded Design</div>
              <div className="card-body text-center">
                {isImage ? (
                  <>
                    <img
                      src={getRequestImage(order.designFile)}
                      alt="Design"
                      className="img-fluid rounded mb-3"
                      style={{
                        maxHeight: "450px",
                        objectFit: "contain",
                      }}
                    />
                    <div>
                      <button
                        onClick={downloadPreview}
                        className="btn btn-outline-dark"
                      >
                        Download Preview
                      </button>
                    </div>
                  </>
                ) : (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    Open Design File
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
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
                      className={`badge ${paymentBadgeClass(
                        payment.paymentStatus,
                      )}`}
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

        {/* Order Details */}
        <div className="card shadow">
          <div className="card-header">Order Details</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
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
                  <strong>Qyantity:</strong> ₹ {order.quantity}
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
                  <span
                    className={`badge ${
                      order.status === "Pending"
                        ? "bg-warning text-dark"
                        : order.status === "Processing"
                          ? "bg-primary"
                          : order.status === "Completed"
                            ? "bg-success"
                            : "bg-danger"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="col-md-6">
                <p>
                  <strong>Instructions:</strong>
                </p>
                <p>{order.instructions || "-"}</p>
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
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
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
