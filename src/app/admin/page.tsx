"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const authCookie = Cookies.get("auth");

      if (authCookie || user) {
        // Kullanıcı giriş yapmışsa blogs sayfasına yönlendir
        router.replace("/admin/blogs");
      } else {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        router.replace("/admin/login");
      }
    }
  }, [loading, user, router]);

  // Yönlendirme yapılırken loading göster
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}
