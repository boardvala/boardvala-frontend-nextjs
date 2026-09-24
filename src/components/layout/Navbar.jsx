"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { getCartCount } from "../../utils/cartEvents";
import { usePathname } from "next/navigation";
import "../../styles/navbar.css";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const catalogRef = useRef(null);

  const pathname = usePathname();
  const navbarCollapseRef = useRef(null);
// Route change → menu auto-close
useEffect(() => {
  const navbar = navbarCollapseRef.current;
  if (navbar && navbar.classList.contains("show")) {
    navbar.classList.remove("show");
  }
}, [pathname]);

  const catalogues = [
    {
      name: "Festive Backdrop",
      link: "https://boardvala.my.canva.site/decorative-backdrop",
    },
    {
      name: "Festive Makhar",
      link: "https://boardvala.my.canva.site/decorative-makhar",
    },
  ];
  // CART COUNT
  // =====================================================

  useEffect(() => {
    setCartCount(getCartCount());

    const update = () => setCartCount(getCartCount());

    window.addEventListener("cartChanged", update);

    return () => {
      window.removeEventListener("cartChanged", update);
    };
  }, []);

  // =====================================================
  // CLOSE CATALOGUE WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        catalogRef.current &&
        !catalogRef.current.contains(event.target)
      ) {
        setCatalogOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bv-navbar shadow-sm">
        <div className="container">

          {/* LOGO */}

          <Link
            className="navbar-brand d-flex align-items-center"
            href="/"
          >
            <img
              src="/boardvala_logo.png"
              alt="BoardVala"
              className="bv-logo"
            />
          </Link>

          {/* MOBILE MENU BUTTON */}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu"
            aria-controls="menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="menu" ref={navbarCollapseRef}
          >
            <ul className="navbar-nav ms-auto align-items-lg-center">

              {/* HOME */}

              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/"
                >
                  Home
                </Link>
              </li>

              {/* ========================================
                  PRODUCT CATALOGUE DROPDOWN
              ======================================== */}

              <li
                className="nav-item bv-catalog"
                ref={catalogRef}
              >
                <button
                  type="button"
                  className="bv-catalog-btn"
                  onClick={() =>
                    setCatalogOpen((prev) => !prev)
                  }
                >
                  Product Catalogue

                  <FaChevronDown
                    className={`bv-catalog-arrow ${
                      catalogOpen ? "open" : ""
                    }`}
                  />
                </button>

                {catalogOpen && (
                  <div className="bv-catalog-menu">

                    {catalogues.map((catalogue) => (
                      <a
                        key={catalogue.name}
                        href={catalogue.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bv-catalog-item"
                        onClick={() =>
                          setCatalogOpen(false)
                        }
                      >
                        {catalogue.name}
                      </a>
                    ))}

                  </div>
                )}
              </li>

              {/* CART */}

              <li className="nav-item">
                <Link
                  className="bv-cart"
                  href="/cart"
                  title="Cart"
                >
                  <FaShoppingCart />

                  {cartCount > 0 && (
                    <span className="bv-cart-badge">
                      {cartCount}
                    </span>
                  )}

                </Link>
              </li>

              {/* LOGIN / ACCOUNT */}

              {!user ? (
                <li className="nav-item">
                  <Link
                    className="btn btn-warning ms-lg-3 fw-semibold"
                    href="/login"
                  >
                    Login
                  </Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href={
                        user.role === "admin"
                          ? "/admin/dashboard"
                          : "/account"
                      }
                    >
                      {user.role === "admin"
                        ? "Admin Dashboard"
                        : "My Account"}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button
                      className="btn btn-danger ms-lg-3"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}