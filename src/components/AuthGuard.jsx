"use client";
import React, { useContext, useEffect } from "react";
import { MyContext } from "@/context/ThemeProvider";
import { useRouter, usePathname } from "next/navigation";

const publicPages = ["/login", "/register", "/verify", "/forgot-password"];

const AuthGuard = ({ children }) => {
  const context = useContext(MyContext);
  const router = useRouter();
  const pathname = usePathname();

  const isAdminPath = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminPath) return;

    // We check if it's not a public page and the user is not logged in
    if (!publicPages.includes(pathname) && !context?.isLogin) {
      // Small delay to ensure cookies are read if they exist
      const timer = setTimeout(() => {
        if (!context?.isLogin) {
          router.push("/login");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [context?.isLogin, pathname, isAdminPath, router]);

  // If it's a public page, an admin page, or the user is logged in, show the content
  // Otherwise, we show nothing or a loader while redirecting
  if (publicPages.includes(pathname) || isAdminPath || context?.isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Checking authentication...</p>
      </div>
    </div>
  );
};

export default AuthGuard;
