"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (role && user.role !== role) {
      router.push("/");
    }
  }, [user, loading, role]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  if (!user) return null;
  if (role && user.role !== role) return null;

  return children;
}