"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../../../components/auth/ProtectedRoute";
import EditFeaturedContent from "./EditFeaturedContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <EditFeaturedContent />
      </ProtectedRoute>
    </Suspense>
  );
}