"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense>
      <ProtectedRoute role="user">
        <CheckoutContent />
      </ProtectedRoute>
    </Suspense>
  );
}