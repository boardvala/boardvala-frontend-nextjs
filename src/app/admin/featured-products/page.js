"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import FeaturedProductsContent from "./FeaturedProductsContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <FeaturedProductsContent />
      </ProtectedRoute>
    </Suspense>
  );
}