"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../../../../components/auth/ProtectedRoute";
import EditGalleryContent from "./EditGalleryContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <EditGalleryContent />
      </ProtectedRoute>
    </Suspense>
  );
}