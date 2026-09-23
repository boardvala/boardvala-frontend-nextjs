"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import CustomOrdersContent from "./CustomOrdersContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <CustomOrdersContent />
      </ProtectedRoute>
    </Suspense>
  );
}