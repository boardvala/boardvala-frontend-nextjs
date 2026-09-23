"use client";

import { useEffect } from "react";
import WhatsAppButton from "../components/WhatsAppButton";
import { usePathname } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// या pages ला Navbar/Footer नको
const HIDE_LAYOUT = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function LayoutShell({ children }) {
  const pathname = usePathname();

  // Bootstrap JS load
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const hideLayout = HIDE_LAYOUT.some((path) => pathname.startsWith(path));

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh" }}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}