"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    redirect("/dashboard"); // server-side navigation to redirect the page to dashboard automatically once the url loads
  }, []);

  return null;
}
