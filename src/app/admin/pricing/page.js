"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import PricingContent from "./PricingContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <PricingContent />
      </ProtectedRoute>
    </Suspense>
  );
}