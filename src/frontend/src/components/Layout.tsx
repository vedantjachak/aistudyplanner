import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStudyStore } from "../store/useStudyStore";
import { AnimatedBackground } from "./AnimatedBackground";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isDarkMode } = useStudyStore();

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />

      <div className="flex min-h-screen">
        <Sidebar currentPath={location.pathname} />

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav currentPath={location.pathname} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
