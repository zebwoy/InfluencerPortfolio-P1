"use client";
import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminUploader from "./AdminUploader";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminUploader />;
} 