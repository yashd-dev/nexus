"use client";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    console.log(user);

    if (user == null) {
      window.location.href = "/access-account";
    }
  }, []);
  return <>{children}</>;
}
