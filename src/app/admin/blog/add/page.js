"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import AddBlogContent from "./AddBlogContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <AddBlogContent />
      </ProtectedRoute>
    </Suspense>
  );
}