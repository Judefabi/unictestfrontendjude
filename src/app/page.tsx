"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard"); // Client-side navigation
  }, [router]);

  return null;
}
