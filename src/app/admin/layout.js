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

  const sidebarClasses = `sidebarWrapper fixed lg:sticky top-0 left-0 z-[100] h-screen bg-white border-r border-gray-100 shadow-xl lg:shadow-none transition-all duration-500 ease-in-out ${
    isNavOpen 
      ? "w-[280px] translate-x-0" 
      : "w-0 lg:w-[80px] -translate-x-full lg:translate-x-0"
  }`;

  return (
    <div className={inter.className}>
      <ThemeProvider>
        {hideLayout ? (
          children
        ) : (
          <div className="mainWrapper flex min-h-screen bg-[#f8fafc]">
            <div className={sidebarClasses}>
              <Sidebar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
            </div>

            {isNavOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] lg:hidden transition-all duration-500" 
                onClick={() => setIsNavOpen(false)}
              />
            )}

            <div className={`mainContent flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out`}>
              <Header setIsNavOpen={setIsNavOpen} isNavOpen={isNavOpen} />
              <main className="p-4 md:p-6 lg:p-10 flex-1 max-w-[1600px] mx-auto w-full">
                {children}
              </main>
              <footer className="p-6 text-center text-[13px] font-bold text-slate-400 bg-white border-t border-slate-50">
                 &copy; 2026 Admin Dashboard • Premium Management System
              </footer>
            </div>
          </div>
        )}
      </ThemeProvider>
    </div>
  );
}