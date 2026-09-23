"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getMyCustomDesignOrderById } from "../../../../services/customDesignService";
import { getOrderTracking } from "../../../../services/customDesignService";


export default function CustomOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);

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
          <div className="alert alert-danger">
            Custom design order not found.
          </div>

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
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.customerPhone}</p>
              </div>

              <div className="col-md-6">
                <p><strong>Email:</strong> {order.customerEmail || "-"}</p>
                <p><strong>Address:</strong> {order.customerAddress}</p>
                <p><strong>City:</strong> {order.customerCity}</p>
                <p><strong>State:</strong> {order.customerState}</p>
                <p><strong>Pincode:</strong> {order.customerPincode}</p>
              </div>
            </div>

            {/* ← Tracking इथे, address नंतर */}
            {/* <div className="mt-4">
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
                <div
                  className="p-3 rounded text-muted"
                  style={{ background: "#f1f5f9" }}
                >
                  <i className="bi bi-clock-history me-2"></i>
                  Your order is being processed. Tracking details will appear
                  here once it ships.
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
