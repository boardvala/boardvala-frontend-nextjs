"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMyFeaturedOrderById } from "../../../../services/featuredOrderService";
import { getFeaturedOrderTracking } from "../../../../services/featuredOrderService";


export default function FeaturedOrderContent() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);

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
          <div className="alert alert-danger">
            order not found.
          </div>

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
          <div className="col-md-5 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
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
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="col-md-7 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <hr />

                <h6 className="fw-semibold mb-3">{order.title}</h6>

                <p className="mb-2">
                  <strong>Order ID:</strong> #
                  {order._id.slice(-6).toUpperCase()}
                </p>
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
                <span className="text-muted">Tracking No</span>
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
              Your order is being processed. Tracking details will appear here
              once it ships.
            </div>
          )}
        </div> */}
        </div>
       </div>
      </div>
    </>
  );
}
