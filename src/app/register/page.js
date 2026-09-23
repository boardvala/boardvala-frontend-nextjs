// src/app/register/page.js
"use client";

import { Suspense } from "react";
import RegisterContent from "./RegisterContent";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border"></div></div>}>
      <RegisterContent />
    </Suspense>
  );
}