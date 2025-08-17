"use client";
import { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminUploader from "./AdminUploader";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const authed = localStorage.getItem("admin-authed");
        if (authed === "1") {
          setIsAuthenticated(true);
        }
      }
    } catch {}
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminUploader />;
} 