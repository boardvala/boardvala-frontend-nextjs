"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import FeaturedOrdersContent from "./FeaturedOrdersContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <FeaturedOrdersContent />
      </ProtectedRoute>
    </Suspense>
  );
}