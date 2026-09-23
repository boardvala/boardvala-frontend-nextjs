"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import MyOrdersContent from "./MyOrdersContent";

export default function MyOrdersPage() {
  return (
    <Suspense>
      <ProtectedRoute role="user">
        <MyOrdersContent />
      </ProtectedRoute>
    </Suspense>
  );
}