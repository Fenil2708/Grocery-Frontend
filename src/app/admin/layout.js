"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ThemeProvider from "@/admin-context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(true);

  const hideLayout =
    pathname === "/admin/login" ||
    pathname === "/admin/register" ||
    pathname === "/admin/verify" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/forgot-password/change-password";

  useEffect(() => {
    const token = Cookies.get("adminAccessToken");
    if (!token && !hideLayout) {
      router.push("/admin/login");
    }
  }, [pathname, hideLayout, router]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 1024) {
          setIsNavOpen(false);
        } else {
          setIsNavOpen(true);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarClasses = `sidebarWrapper fixed lg:sticky top-0 left-0 z-[100] h-screen bg-white border-r border-gray-200 shadow-md transition-all duration-300 ${
    isNavOpen 
      ? "w-[260px] translate-x-0" 
      : "w-0 lg:w-[70px] -translate-x-full lg:translate-x-0"
  }`;

  return (
    <div className={inter.className}>
      <ThemeProvider>
        {hideLayout ? (
          children
        ) : (
          <div className="mainWrapper flex min-h-screen bg-[#f1f1f1]">
            <div className={sidebarClasses}>
              <Sidebar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
            </div>

            {isNavOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-[90] lg:hidden" 
                onClick={() => setIsNavOpen(false)}
              />
            )}

            <div className="mainContent flex-1 flex flex-col min-w-0 transition-all duration-300">
              <Header setIsNavOpen={setIsNavOpen} isNavOpen={isNavOpen} />
              <div className="p-4 md:p-6 lg:p-8 flex-1">
                {children}
              </div>
            </div>
          </div>
        )}
      </ThemeProvider>
    </div>
  );
}