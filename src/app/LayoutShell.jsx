"use client";

import WhatsAppButton from "../components/WhatsAppButton";
import { usePathname } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// या pages ला Navbar/Footer नको
const HIDE_LAYOUT = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function LayoutShell({ children }) {
  const pathname = usePathname();

  const hideLayout = HIDE_LAYOUT.some((path) => pathname.startsWith(path));

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}