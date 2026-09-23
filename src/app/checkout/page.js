// src/app/checkout/page.js
"use client";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <ProtectedRoute role="user">
      <CheckoutContent />
    </ProtectedRoute>
  );
}