"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import FeaturedOrderContent from "./FeaturedOrderContent";

export default function FeaturedOrderPage() {
  return (
    <Suspense>
      <ProtectedRoute role="user">
        <FeaturedOrderContent />
      </ProtectedRoute>
    </Suspense>
  );
}