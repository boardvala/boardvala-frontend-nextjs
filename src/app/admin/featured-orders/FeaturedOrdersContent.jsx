"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllFeaturedOrders } from "../../../services/featuredOrderService";


export default function AdminFeaturedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getAllFeaturedOrders();
      setOrders(data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function statusBadge(status) {
    if (status === "pending") return "bg-warning text-dark";
    if (status === "processing") return "bg-primary";
    if (status === "completed") return "bg-success";
    return "bg-danger";
  }

  if (loading) {
    return <div className="container py-5">Loading...</div>;
  }

  return (
    <>
      <div className="container py-4 py-md-5">
        <h2 className="mb-4">Featured Product Orders</h2>
        <div className="table-responsive">
          <table
            className="table table-bordered table-hover align-middle"
            style={{ minWidth: "900px" }}
          >
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Order ID</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img
                        src={order.previewImage}
                        alt="Product"
                        width="70"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "6px" }}
                      />
                    </td>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>{order.title}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerPhone}</td>
                    <td>{order.quantity}</td>
                    <td>₹ {order.totalAmount}</td>
                    <td>
                      <span className={`badge ${statusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </td>
                    <td>
                      <Link
                        href={`/admin/featured-orders/${order._id}`}
                        className="btn btn-dark btn-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No featured product orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}