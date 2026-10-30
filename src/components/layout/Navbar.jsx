"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { FaShoppingCart } from "react-icons/fa";
import { FiUser, FiX, FiMenu } from "react-icons/fi";
import { getCartCount } from "../../utils/cartEvents";
import { usePathname } from "next/navigation";
import "../../styles/navbar.css";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [sideOpen, setSideOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Route change → sidebar close
  useEffect(() => {
    setSideOpen(false);
  }, [pathname]);

  // Body scroll lock when sidebar open
  useEffect(() => {
    document.body.style.overflow = sideOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sideOpen]);

  // CART COUNT
  useEffect(() => {
    setCartCount(getCartCount());
    const update = () => setCartCount(getCartCount());
    window.addEventListener("cartChanged", update);
    return () => window.removeEventListener("cartChanged", update);
  }, []);

  useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  function handleLogout() {
    logout();
    setSideOpen(false);
    router.push("/");
  }

  return (
    <>
      <nav className={`navbar navbar-dark bv-navbar shadow-sm ${scrolled ? "bv-scrolled" : ""}`}>
        <div className="container">

          {/* LOGO */}
          <Link className="navbar-brand d-flex align-items-center" href="/">
            <img src="/boardvala_logo.png" alt="BoardVala" className="bv-logo" />
          </Link>

          {/* DESKTOP NAV */}
          <ul className="navbar-nav flex-row align-items-center gap-3 d-none d-lg-flex">
            <li className="nav-item"><Link className="nav-link" href="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/about">About Us</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/contact">Contact</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/blog">Blog</Link></li>
            <li className="nav-item">
              <Link className="bv-cart" href="/cart" title="Cart">
                <FaShoppingCart />
                {cartCount > 0 && <span className="bv-cart-badge">{cartCount}</span>}
              </Link>
            </li>
            {!user ? (
              <li className="nav-item">
                <Link href="/login" className="bv-user-icon" title="Login"><FiUser /></Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href={user.role === "admin" ? "/admin/dashboard" : "/account"}>
                    {user.role === "admin" ? "Dashboard" : "My Account"}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>

          {/* MOBILE — Cart + User + Hamburger */}
          <div className="d-flex align-items-center gap-3 d-lg-none">
            <Link href="/cart" className="bv-cart-mobile" title="Cart">
              <FaShoppingCart />
              {cartCount > 0 && <span className="bv-cart-badge">{cartCount}</span>}
            </Link>
            <Link
              href={user ? (user.role === "admin" ? "/admin/dashboard" : "/account") : "/login"}
              className="bv-user-mobile"
              title={user ? "Account" : "Login"}
            >
              <FiUser />
            </Link>
            <button className="bv-hamburger" onClick={() => setSideOpen(true)} aria-label="Open menu">
              <FiMenu />
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE SIDEBAR OVERLAY */}
      <div className={`bv-sidebar-overlay ${sideOpen ? "active" : ""}`} onClick={() => setSideOpen(false)} />

      {/* MOBILE SIDEBAR */}
      <div className={`bv-sidebar ${sideOpen ? "open" : ""}`}>
        <div className="bv-sidebar-header">
          <button className="bv-sidebar-close" onClick={() => setSideOpen(false)} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        <div className="bv-sidebar-links">
          <Link href="/" className="bv-sidebar-link" onClick={() => setSideOpen(false)}>Home</Link>
          <Link href="/about" className="bv-sidebar-link" onClick={() => setSideOpen(false)}>About Us</Link>
          <Link href="/contact" className="bv-sidebar-link" onClick={() => setSideOpen(false)}>Contact</Link>
          <Link href="/blog" className="bv-sidebar-link" onClick={() => setSideOpen(false)}>Blog</Link>
          <Link href="/products" className="bv-sidebar-link" onClick={() => setSideOpen(false)}>Designs</Link>
          <Link href="/featured-products" className="bv-sidebar-link" onClick={() => setSideOpen(false)}>Featured Products</Link>
        </div>

        <div className="bv-sidebar-footer">
          {!user ? (
            <Link href="/login" className="bv-sidebar-btn" onClick={() => setSideOpen(false)}>
              <FiUser /> Login / Sign Up
            </Link>
          ) : (
            <>
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/account"}
                className="bv-sidebar-btn"
                onClick={() => setSideOpen(false)}
              >
                <FiUser /> {user.role === "admin" ? "Admin Dashboard" : "My Account"}
              </Link>
              <button className="bv-sidebar-btn logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}