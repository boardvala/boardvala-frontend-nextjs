"use client";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import ChangePasswordContent from "./ChangePasswordContent";

export default function ChangePasswordPage() {
  return (
    <Suspense>
      <ProtectedRoute role="user">
        <ChangePasswordContent />
      </ProtectedRoute>
    </Suspense>
  );
}