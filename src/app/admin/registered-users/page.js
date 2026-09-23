"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import UsersContent from "./UsersContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <UsersContent />
      </ProtectedRoute>
    </Suspense>
  );
}