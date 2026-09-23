"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "../../../services/orderService";
import { getMyCustomDesignOrders } from "../../../services/customDesignService";
import { getMyFeaturedOrders } from "../../../services/featuredOrderService";


export default function MyOrdersContent() {
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [featuredOrders, setFeaturedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    loadCustomOrders();
    loadFeaturedOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomOrders() {
    try {
      const data = await getMyCustomDesignOrders();
      setCustomOrders(data.orders);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadFeaturedOrders() {
    try {
      const data = await getMyFeaturedOrders();
      setFeaturedOrders(data.orders);
    } catch (err) {
      console.log(err);
    }
  }

  // featured order status — lowercase enum नुसार badge
  function featuredBadge(status) {
    if (status === "completed") return "bg-success";
    if (status === "processing") return "bg-primary";
    if (status === "cancelled") return "bg-danger";
    return "bg-warning text-dark"; // pending
  }

  const noOrders =
    orders.length === 0 &&
    customOrders.length === 0 &&
    featuredOrders.length === 0;

  return (
    <>
      <div className="container py-5">
        <h2 className="mb-4">My Orders</h2>

        {loading && <div className="spinner-border"></div>}

        {!loading && noOrders && (
          <div className="alert alert-info">
            You haven't placed any orders yet.
          </div>
        )}

        {/* ---- Product orders (जुने, तशीच logic) ---- */}
        {orders.map((order) => (
          <div key={order._id} className="card shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between">
              <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
              <span className="badge bg-primary">{order.status}</span>
            </div>

            <div className="card-body">
              <p>
                <strong>Placed:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong>₹ {order.totalAmount}
              </p>
              <p>
                <strong>Items:</strong>
                {order.items.length}
              </p>

              <Link
                href={`/account/orders/${order._id}`}
                className="btn btn-dark"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {/* ---- Custom design orders ---- */}
        {customOrders.map((order) => (
          <div key={order._id} className="card shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>Order ID #{order._id.slice(-6).toUpperCase()}</strong>

              <span
                className={`badge ${
                  order.status === "Completed"
                    ? "bg-success"
                    : order.status === "Processing"
                      ? "bg-primary"
                      : order.status === "Rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3 text-center">
                  <img
                    src={order.designFile?.url}
                    alt="Custom Design"
                    className="img-fluid rounded"
                    style={{ maxHeight: "120px", objectFit: "contain" }}
                  />
                </div>

                <div className="col-md-9">
                  <p>
                    <strong>Placed on:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </p>

                  <Link
                    href={`/account/custom-orders/${order._id}`}
                    className="btn btn-dark"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ---- Featured product orders ---- */}
        {featuredOrders.map((order) => (
          <div key={order._id} className="card shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>Order ID #{order._id.slice(-6).toUpperCase()}</strong>

              <span className={`badge ${featuredBadge(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3 text-center">
                  <img
                    src={order.previewImage}
                    alt={order.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: "120px", objectFit: "contain" }}
                  />
                </div>

                <div className="col-md-9">
                  <p className="mb-1">
                    <strong>{order.title}</strong>
                  </p>
                  <p className="mb-1">
                    Qty: {order.quantity} &nbsp;|&nbsp; Total: ₹{" "}
                    {order.totalAmount}
                  </p>
                  <p>
                    <strong>Placed on:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </p>

                  <Link
                    href={`/account/featured-orders/${order._id}`}
                    className="btn btn-dark"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}