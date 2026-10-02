"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import SurveyContent from "./SurveyContent";

export default function Page() {
  return (
    <Suspense>
      <ProtectedRoute role="admin">
        <SurveyContent />
      </ProtectedRoute>
    </Suspense>
  );
}