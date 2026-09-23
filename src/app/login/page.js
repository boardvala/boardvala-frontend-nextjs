"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}