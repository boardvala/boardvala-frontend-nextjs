"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import AddGalleryContent from "./AddGalleryContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <AddGalleryContent />
      </ProtectedRoute>
    </Suspense>
  );
}