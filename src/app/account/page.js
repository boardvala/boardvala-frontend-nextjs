// src/app/account/page.js
"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import AccountContent from "./AccountContent";

export default function AccountPage() {
  return (
    <Suspense>
      <ProtectedRoute role="user">
        <AccountContent />
      </ProtectedRoute>
    </Suspense>
  );
}