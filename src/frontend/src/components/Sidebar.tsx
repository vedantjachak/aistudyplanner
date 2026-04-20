import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  CheckSquare,
  Clock,
  LayoutDashboard,
  Moon,
  Sun,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useStudyStore } from "../store/useStudyStore";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Planning", icon: Clock, to: "/planning" },
  { label: "Tasks", icon: CheckSquare, to: "/tasks" },
  { label: "Insights", icon: BarChart3, to: "/insights" },
  { label: "Reminders", icon: Bell, to: "/reminders" },
];

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  const { isDarkMode, toggleDarkMode, sessions } = useStudyStore();

  // Compute streak: count consecutive days (including today) that have sessions
  const streak = (() => {
    if (sessions.length === 0) return 0;
    const dates = new Set(sessions.map((s) => s.date));
    let count = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split("T")[0];
      if (dates.has(key)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  })();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-card border-r border-border z-20">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-accent flex-shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-foreground text-base leading-none">
            StudyAI
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">Smart Planner</p>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1" data-ocid="sidebar.nav">
        {navItems.map((item, i) => {
          const isActive =
            item.to === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.to);
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              <Link
                to={item.to}
                data-ocid={`sidebar.nav.${item.label.toLowerCase()}`}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth group cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-4 w-1 h-6 bg-gradient-primary rounded-full"
                    />
                  )}
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-smooth",
                      isActive && "text-primary",
                    )}
                  />
                  <span className="font-body text-sm font-medium">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom actions */}
      <div className="p-4 space-y-3">
        {/* AI Streak */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60">
          <Zap className="w-4 h-4 text-chart-4 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground">
              {streak > 0 ? `${streak}-day streak!` : "No streak yet"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Keep it up 🔥
            </p>
          </div>
        </div>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={toggleDarkMode}
          data-ocid="sidebar.dark_mode_toggle"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          <span className="text-sm">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </Button>
      </div>
    </aside>
  );
}
