"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import FeaturedOrderDetailContent from "./FeaturedOrderDetailContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <FeaturedOrderDetailContent />
      </ProtectedRoute>
    </Suspense>
  );
}