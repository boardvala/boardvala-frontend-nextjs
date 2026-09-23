"use client";
export const dynamic = "force-dynamic";

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