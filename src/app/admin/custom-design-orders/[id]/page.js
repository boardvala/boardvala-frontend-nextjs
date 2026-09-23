"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import OrderDetailContent from "./OrderDetailContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <OrderDetailContent />
      </ProtectedRoute>
    </Suspense>
  );
}