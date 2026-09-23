"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import GalleryContent from "./GalleryContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <GalleryContent />
      </ProtectedRoute>
    </Suspense>
  );
}