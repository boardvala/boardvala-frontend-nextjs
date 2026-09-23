"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCustomDesignOrders } from "../../../services/customDesignService";


export default function AdminCustomDesignOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getCustomDesignOrders();
      setOrders(data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="container py-5">Loading...</div>;
  }

  return (
    <>
      <div className="container py-4 py-md-5">
        <h2 className="mb-4">Custom Design Orders</h2>

        {/* table-responsive: mobile वर आडवं scroll, table तसाच राहतो */}
        <div className="table-responsive">
          <table
            className="table table-bordered table-hover align-middle"
            style={{ minWidth: "900px" }}
          >
            <thead className="table-dark">
              <tr>
                <th>Design</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Size</th>
                <th>Price</th>
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
                        src={order.designFile.url}
                        alt="Design"
                        width="70"
                        height="50"
                        style={{
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </td>

                    <td>#{order._id.slice(-6).toUpperCase()}</td>

                    <td>{order.customerName}</td>

                    <td>{order.customerPhone}</td>

                    <td>{order.frameSize}</td>

                    <td>₹ {order.price}</td>

                    <td>
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
                        href={`/admin/custom-design-orders/${order._id}`}
                        className="btn btn-dark btn-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No custom design orders found.
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