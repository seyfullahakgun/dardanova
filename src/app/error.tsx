"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import "@/app/[locale]/globals.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Bir şeyler yanlış gitti</h2>
        <p className="text-muted-foreground">
          Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <Button onClick={reset}>Tekrar Dene</Button>
      </div>
    </div>
  );
} 