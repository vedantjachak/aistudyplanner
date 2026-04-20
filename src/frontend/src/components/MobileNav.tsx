import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { BarChart3, Bell, CheckSquare, Clock, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { label: "Home", icon: LayoutDashboard, to: "/" },
  { label: "Plan", icon: Clock, to: "/planning" },
  { label: "Tasks", icon: CheckSquare, to: "/tasks" },
  { label: "Insights", icon: BarChart3, to: "/insights" },
  { label: "Alerts", icon: Bell, to: "/reminders" },
];

interface MobileNavProps {
  currentPath: string;
}

export function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border"
      data-ocid="mobile.nav"
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={`mobile.nav.${item.label.toLowerCase()}`}
              className="flex-1"
            >
              <div className="flex flex-col items-center gap-1 py-1 px-2 relative">
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-pill"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-smooth",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-smooth",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
