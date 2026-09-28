"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import BlogListContent from "./BlogListContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <BlogListContent />
      </ProtectedRoute>
    </Suspense>
  );
}