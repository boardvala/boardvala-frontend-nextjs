"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import AddFeaturedContent from "./AddFeaturedContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <AddFeaturedContent />
      </ProtectedRoute>
    </Suspense>
  );
}