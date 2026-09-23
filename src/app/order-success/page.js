"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function OrderSuccess() {
  const [shippingAddress, setShippingAddress] = useState(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("orderSuccessData"));
      if (data?.shippingAddress) {
        setShippingAddress(data.shippingAddress);
      }
      // read झाल्यावर clear
      localStorage.removeItem("orderSuccessData");
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5 text-center">
              {/* Success */}
              <div
                className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="bi bi-check-lg text-success fs-1"></i>
              </div>

              <h1 className="fw-bold text-success">
                Order Placed Successfully!
              </h1>

              <p className="text-muted mt-2">
                Thank you for your order. We have received your order
                successfully.
              </p>

              {/* Shipping Address */}
              {shippingAddress && (
                <div className="card bg-light border-0 text-start mt-4">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      Shipping Address
                    </h5>

                    <div className="fw-semibold">{shippingAddress.name}</div>

                    <div className="text-muted mt-1">
                      {shippingAddress.address}
                    </div>

                    <div className="text-muted">
                      {shippingAddress.city}, {shippingAddress.state} -{" "}
                      {shippingAddress.pincode}
                    </div>

                    <div className="text-muted mt-2">
                      <i className="bi bi-telephone me-2"></i>
                      {shippingAddress.phone}
                    </div>

                    {shippingAddress.email && (
                      <div className="text-muted mt-1">
                        <i className="bi bi-envelope me-2"></i>
                        {shippingAddress.email}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
                <Link
                  href="/account/orders"
                  className="btn px-4 text-white"
                  style={{ backgroundColor: "#203352" }}
                >
                  <i className="bi bi-box-seam me-2"></i>
                  View My Orders
                </Link>

                <Link
                  href="/"
                  className="btn px-4 text-white"
                  style={{ backgroundColor: "#203352" }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}