import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Flame, Target, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { InsightResult } from "../../hooks/useInsightData";

function AnimatedNumber({
  value,
  suffix = "",
}: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = 0;
    const end = value;
    const duration = 900;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

const KPI_CONFIG = [
  {
    key: "totalMinutes" as const,
    label: "Total Study Time",
    icon: Zap,
    color: "from-chart-1/20 to-chart-1/5 text-chart-1",
    bar: "bg-chart-1",
    format: (v: number) => `${Math.floor(v / 60)}h ${v % 60}m`,
    numericVal: (v: InsightResult) => v.totalMinutes,
  },
  {
    key: "avgDailyMinutes" as const,
    label: "Daily Average",
    icon: TrendingUp,
    color: "from-chart-2/20 to-chart-2/5 text-chart-2",
    bar: "bg-chart-2",
    format: (v: number) => `${v}m`,
    numericVal: (v: InsightResult) => v.avgDailyMinutes,
  },
  {
    key: "avgQuizScore" as const,
    label: "Avg Quiz Score",
    icon: Brain,
    color: "from-chart-3/20 to-chart-3/5 text-chart-3",
    bar: "bg-chart-3",
    format: (v: number) => `${v}%`,
    numericVal: (v: InsightResult) => v.avgQuizScore,
  },
  {
    key: "streak" as const,
    label: "Current Streak",
    icon: Flame,
    color: "from-chart-4/20 to-chart-4/5 text-chart-4",
    bar: "bg-chart-4",
    format: (v: number) => `${v} days`,
    numericVal: (v: InsightResult) => v.streak,
  },
];

interface Props {
  insight: InsightResult;
}

export function InsightStatCards({ insight }: Props) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      data-ocid="insights.stat_cards"
    >
      {KPI_CONFIG.map((kpi, i) => {
        const Icon = kpi.icon;
        const numVal = kpi.numericVal(insight);
        return (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            data-ocid={`insights.stat.${kpi.key}`}
          >
            <Card className="relative overflow-hidden border-border hover:-translate-y-0.5 transition-smooth hover:shadow-elevated group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-smooth" />
              <CardContent className="p-4 md:p-5 relative">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground font-medium leading-tight mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-xl md:text-2xl font-display font-bold text-foreground">
                      {kpi.key === "totalMinutes" ? (
                        `${Math.floor(numVal / 60)}h ${numVal % 60}m`
                      ) : (
                        <AnimatedNumber
                          value={numVal}
                          suffix={
                            kpi.key === "avgDailyMinutes"
                              ? "m"
                              : kpi.key === "avgQuizScore"
                                ? "%"
                                : " days"
                          }
                        />
                      )}
                    </p>
                  </div>
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 ${kpi.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
