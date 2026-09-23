"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../../styles/cart.css";
import { getProductImage } from "../../utils/imageUtils"
import { notifyCartChanged } from "../../utils/cartEvents"
import { SkeletonCartPage } from "../../components/Skeleton";

import {
  getCart,
  removeCartItem,
  updateCartQuantity,
} from "../../services/cartService";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [customItems, setCustomItems] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const data = await getCart();

      setItems(data);

      const customCart = JSON.parse(localStorage.getItem("customCart")) || [];

      setCustomItems(customCart);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function increase(item) {
    await updateCartQuantity(item._id || item.id, item.quantity + 1);
    loadCart();
  }

  async function decrease(item) {
    if (item.quantity <= 1) return;
    await updateCartQuantity(item._id || item.id, item.quantity - 1);
    loadCart();
  }

  async function remove(item) {
    await removeCartItem(item._id || item.id);
    loadCart();
  }

  function increaseCustom(item) {
    const cart = JSON.parse(localStorage.getItem("customCart")) || [];
    const updated = cart.map((x) =>
      x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x,
    );
    localStorage.setItem("customCart", JSON.stringify(updated));
    notifyCartChanged();
    setCustomItems(updated);
  }

  function decreaseCustom(item) {
    const cart = JSON.parse(localStorage.getItem("customCart")) || [];
    const updated = cart.map((x) =>
      x.id === item.id ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x,
    );
    localStorage.setItem("customCart", JSON.stringify(updated));
    notifyCartChanged();
    setCustomItems(updated);
  }

  function removeCustom(item) {
    const cart = JSON.parse(localStorage.getItem("customCart")) || [];
    const updated = cart.filter((x) => x.id !== item.id);
    localStorage.setItem("customCart", JSON.stringify(updated));
    notifyCartChanged();
    setCustomItems(updated);
  }

  if (loading) {
  return <SkeletonCartPage />;
}

  const productTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const customTotal = customItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const grandTotal = productTotal + customTotal;

  return (
    <>
      <div className="container py-5">
        <h2 className="mb-4">Shopping Cart</h2>

        {items.length === 0 && customItems.length === 0 ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "60vh" }}
          >
            <i
              className="bi bi-cart3 d-block mb-3"
              style={{ fontSize: "5rem", color: "#cbd5e1" }}
            ></i>
            <h4 className="fw-bold mb-2" style={{ color: "#1b263b" }}>
              Cart is Empty
            </h4>
            <p className="text-muted mb-4">
              Looks like you haven't added anything yet.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                href="/custom-design"
                className="btn text-white px-4"
                style={{ backgroundColor: "#2563eb" }}
              >
                <i className="bi bi-upload me-2"></i>
                Upload Your Design
              </Link>
              <Link href="/products" className="btn btn-outline-dark px-4">
                Browse Design
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {items.map((item) => (
                <div
                  key={item._id || item.id}
                  className="card shadow-sm border-0 mb-3"
                >
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-12 text-center mb-3 mb-lg-0">
                        {item.finalSvg ? (
                          <div
                            className="cart-svg-preview"
                            dangerouslySetInnerHTML={{ __html: item.finalSvg }}
                          />
                        ) : (
                          <img
                            src={getProductImage(item.product.previewImage)}
                            className="rounded img-fluid"
                            style={{ maxHeight: "140px", objectFit: "cover" }}
                            alt=""
                          />
                        )}
                      </div>

                      <div className="col-lg-4 col-md-12 mb-3 mb-lg-0">
                        <h4 className="fw-bold">{item.product.name}</h4>
                        <p className="mb-1">₹ {item.product.price}</p>
                        <p className="text-success fw-bold mb-0">
                          Total : ₹ {item.product.price * item.quantity}
                        </p>
                      </div>

                      <div className="col-lg-2 col-6 text-center">
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => decrease(item)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => increase(item)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-lg-2 col-6 text-center text-lg-end mt-3 mt-lg-0">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => remove(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {customItems.map((item) => (
                <div
                  key={item.id}
                  className="card shadow-sm mb-3"
                  style={{ border: "1px solid #e9ecef", borderRadius: "12px" }}
                >
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-12 text-center mb-3 mb-lg-0">
                        <img
                          src={item.previewImage}
                          alt=""
                          className="rounded img-fluid"
                          style={{ maxHeight: "140px", objectFit: "cover" }}
                        />
                      </div>

                      <div className="col-lg-4 col-md-12 mb-3 mb-lg-0">
                        {item.orderType === "featuredProduct" ? (
                          <>
                            <h5 className="fw-bold mb-1">{item.name}</h5>
                            <p className="text-success fw-bold mb-0">
                              ₹ {item.price} × {item.quantity} = ₹{" "}
                              {item.price * item.quantity}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mb-1">
                              <strong>Material:</strong> {item.material}
                            </p>
                            <p className="mb-1">
                              <strong>Size:</strong> {item.frameSize}
                            </p>
                            {item.material !== "Banner" && (
                              <p className="mb-1">
                                <strong>Orientation:</strong> {item.orientation}
                              </p>
                            )}
                            <p className="text-success fw-bold mb-0">
                              ₹ {item.price} × {item.quantity} = ₹{" "}
                              {item.price * item.quantity}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="col-lg-2 col-6 text-center">
                        <p className="fw-semibold mb-2">Quantity</p>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => decreaseCustom(item)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => increaseCustom(item)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-lg-2 col-6 text-center text-lg-end mt-3 mt-lg-0">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeCustom(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              {customItems.length > 0 && (
                <div
                  className="card shadow-sm border-0"
                  style={{
                    position: "sticky",
                    top: "90px",
                    borderRadius: "15px",
                  }}
                >
                  <div className="card-body">
                    <h4 className="fw-bold mb-4">Order Summary</h4>

                    {customItems.map((item) => (
                      <div key={item.id} className="mb-3">
                        <div className="fw-semibold">
                          {item.orderType === "featuredProduct"
                            ? item.name
                            : "Custom Design"}
                        </div>

                        {item.orderType === "featuredProduct" ? (
                          <small className="text-muted d-block">
                            Featured Product
                          </small>
                        ) : (
                          <>
                            <small className="text-muted d-block">
                              {item.material}
                            </small>
                            <small className="text-muted d-block">
                              {item.frameSize}
                            </small>
                          </>
                        )}

                        <small className="text-muted d-block">
                          Qty : {item.quantity}
                        </small>

                        <div className="fw-bold text-success">
                          ₹ {item.price * item.quantity}
                        </div>

                        <hr />
                      </div>
                    ))}

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Sub-total</span>
                      <span className="fw-semibold">₹ {grandTotal}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Shipping</span>
                      <span>
                        <span className="text-muted text-decoration-line-through me-2">
                          ₹ 100
                        </span>
                        <span className="fw-semibold text-success">FREE</span>
                      </span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <strong>Grand Total</strong>
                      <strong className="text-success">₹ {grandTotal}</strong>
                    </div>

                    <Link
                      href="/checkout?fromCart=true"
                      className="btn w-100 mt-4 text-white"
                      style={{ backgroundColor: "#2563eb" }}
                    >
                      Proceed To Checkout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-5">
          <div className="text-center mb-4">
            <div className="d-flex align-items-center gap-3 mb-1">
              <hr
                className="flex-grow-1 m-0"
                style={{ borderColor: "#8e99a7" }}
              />
              <div className="d-flex align-items-center gap-2">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  style={{ width: 22, height: 22 }}
                />
                <h5 className="fw-bold mb-0">What Our Customers Say</h5>
              </div>
              <hr
                className="flex-grow-1 m-0"
                style={{ borderColor: "#8e99a7" }}
              />
            </div>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span style={{ color: "#f59e0b", fontSize: "1.1rem" }}>
                ★★★★★
              </span>
              <span className="text-muted">4.8 on Google</span>
            </div>
          </div>

          <div className="row g-3 justify-content-center">
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body p-3">
                  <div style={{ color: "#f59e0b", marginBottom: "8px" }}>
                    ★★★★★
                  </div>
                  <p
                    className="mb-3"
                    style={{ fontSize: "0.88rem", color: "#334155" }}
                  >
                    "Very good service and point to the details whatever we
                    needed it delivered. Must visit for any name plate, home
                    name, boarding with any kind of medium is available. Thanks
                    for the suggestion and very well delivered our board."
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#2563eb",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      R
                    </span>
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ fontSize: "0.85rem", lineHeight: 1.2 }}
                      >
                        Rushi
                      </div>
                      <small className="text-muted">Amravati</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body p-3">
                  <div style={{ color: "#f59e0b", marginBottom: "8px" }}>
                    ★★★★★
                  </div>
                  <p
                    className="mb-3"
                    style={{ fontSize: "0.88rem", color: "#334155" }}
                  >
                    "The fitting guys are really professional. They took proper
                    measurement and fit my name plate. Name plate as good as
                    promised Thanks BOARDVALA"
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#16a34a",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      MM
                    </span>
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ fontSize: "0.85rem", lineHeight: 1.2 }}
                      >
                        Mayur Mundekar
                      </div>
                      <small className="text-muted">Amravati</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body p-3">
                  <div style={{ color: "#f59e0b", marginBottom: "8px" }}>
                    ★★★★★
                  </div>
                  <p
                    className="mb-3"
                    style={{ fontSize: "0.88rem", color: "#334155" }}
                  >
                    "Excellent workmanship and attention to detail. The name
                    plate looks elegant and is exactly as promised. Very
                    satisfied with the quality and timely delivery. Staff is
                    very co-operative. I really appreciate their patience
                    throughout the process."
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "e39e1dfc",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      SD
                    </span>
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ fontSize: "0.85rem", lineHeight: 1.2 }}
                      >
                        shubham duble
                      </div>
                      <small className="text-muted">Nashik</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body p-3">
                  <div style={{ color: "#f59e0b", marginBottom: "8px" }}>
                    ★★★★★
                  </div>
                  <p
                    className="mb-3"
                    style={{ fontSize: "0.88rem", color: "#334155" }}
                  >
                    "Best quality branding work done by, boardvala. Com,
                    boardwala, I installed baklit board from them, they given
                    very heavy frame work with warranty products of light, great
                    support by vaibhav sir, best signboard, signage manufacturer
                    nearest me.."
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#85df12",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      SS
                    </span>
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ fontSize: "0.85rem", lineHeight: 1.2 }}
                      >
                        Sarthak Sonar
                      </div>
                      <small className="text-muted">Amravati</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body p-3">
                  <div style={{ color: "#f59e0b", marginBottom: "8px" }}>
                    ★★★★★
                  </div>
                  <p
                    className="mb-3"
                    style={{ fontSize: "0.88rem", color: "#334155" }}
                  >
                    "I Approached Boardvala.com before two days with my
                    requirement. They given me Idea how it will look like before
                    making it.I liked it on a first go. Mr. Vaibhav Created and
                    Delivered Product Before Time. Excellent Work and Finishing,
                    Highly Recommended to everyone who is looking out best board
                    Services in Town. Thankful to Boardvala.com for amazing
                    experience"
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#9e16a3",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      BR
                    </span>
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ fontSize: "0.85rem", lineHeight: 1.2 }}
                      >
                        Bhramari Raut
                      </div>
                      <small className="text-muted">Amravati</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body p-3">
                  <div style={{ color: "#f59e0b", marginBottom: "8px" }}>
                    ★★★★★
                  </div>
                  <p
                    className="mb-3"
                    style={{ fontSize: "0.88rem", color: "#334155" }}
                  >
                    "Good finishing, quality work, committed delivery and
                    reasonable price. This makes me think to book order with
                    this supplier again in future. Very Good Customer service 👍
                    keep it up 😊"
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#dc2626",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      AM
                    </span>
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ fontSize: "0.85rem", lineHeight: 1.2 }}
                      >
                        Aditya Munot
                      </div>
                      <small className="text-muted">Amravati</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <a
              href="https://www.google.com/search?q=Boardvala&oq=Boardvala&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8Mg0IAhAuGK8BGMcBGIAEMgsIAxAAGAoYCxiABDILCAQQABgKGAsYgAQyBggFEAAYHjIGCAYQRRg8MgYIBxBFGDzSAQg2Mzc1ajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8#"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-dark px-4"
            >
              View All Reviews on Google →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
