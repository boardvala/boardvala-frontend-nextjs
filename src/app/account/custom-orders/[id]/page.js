"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import CustomOrderContent from "./CustomOrderContent";

export default function CustomOrderPage() {
  return (
    <Suspense>
      <ProtectedRoute role="user">
        <CustomOrderContent />
      </ProtectedRoute>
    </Suspense>
  );
}