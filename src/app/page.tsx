"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    redirect("/dashboard"); // Client-side navigation
  }, []);

  return null;
}
