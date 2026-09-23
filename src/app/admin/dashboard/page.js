"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import DashboardContent from "./DashboardContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <DashboardContent />
      </ProtectedRoute>
    </Suspense>
  );
}