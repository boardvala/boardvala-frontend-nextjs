"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../../../../components/auth/ProtectedRoute";
import EditBlogContent from "./EditBlogContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <EditBlogContent />
      </ProtectedRoute>
    </Suspense>
  );
}