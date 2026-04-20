import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { StudySession } from "../../types";

interface Props {
  sessions: StudySession[];
}

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getIntensity(minutes: number): number {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 90) return 3;
  return 4;
}

const INTENSITY_CLASSES = [
  "bg-muted/50",
  "bg-chart-1/30",
  "bg-chart-1/55",
  "bg-chart-1/80",
  "bg-chart-1",
];

export function StreakCalendar({ sessions }: Props) {
  const weeks = useMemo(() => {
    const today = new Date();
    // Build 10 weeks of data (70 days)
    const days: { date: string; minutes: number; dayOfWeek: number }[] = [];
    for (let i = 69; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const isDemo = sessions.length === 0;
      const mins = isDemo
        ? Math.random() > 0.35
          ? Math.round(15 + Math.random() * 100)
          : 0
        : sessions
            .filter((s) => s.date === dateStr)
            .reduce((sum, s) => sum + s.durationMinutes, 0);
      // day: 0=Sun, adjust to Mon=0
      const dow = (d.getDay() + 6) % 7;
      days.push({ date: dateStr, minutes: mins, dayOfWeek: dow });
    }
    // Group into weeks (columns), aligning by Mon
    const cols: (typeof days)[] = [];
    let currentCol: typeof days = [];
    for (const day of days) {
      if (day.dayOfWeek === 0 && currentCol.length > 0) {
        cols.push(currentCol);
        currentCol = [];
      }
      currentCol.push(day);
    }
    if (currentCol.length) cols.push(currentCol);
    return cols;
  }, [sessions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38, duration: 0.45 }}
    >
      <Card className="border-border" data-ocid="insights.streak_calendar">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-chart-4" />
              Activity Heatmap — Last 10 Weeks
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              {INTENSITY_CLASSES.map((cls) => (
                <span
                  key={`int-${cls.slice(0, 12)}`}
                  className={`w-3 h-3 rounded-sm ${cls} border border-border/30`}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-fit">
              {/* Day labels */}
              <div className="flex flex-col gap-1 mr-1 mt-0 pt-0">
                {WEEK_LABELS.map((l) => (
                  <div
                    key={`wl-${l}`}
                    className="w-4 h-3.5 text-[9px] text-muted-foreground flex items-center"
                  >
                    {WEEK_LABELS.indexOf(l) % 2 === 0 ? l : ""}
                  </div>
                ))}
              </div>
              {weeks.map((col, wi) => (
                <div
                  key={`week-${wi}-${col[0]?.date ?? wi}`}
                  className="flex flex-col gap-1"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((di) => {
                    const day = col.find((d) => d.dayOfWeek === di);
                    const intensity = day ? getIntensity(day.minutes) : 0;
                    return (
                      <motion.div
                        key={`cell-${wi}-${di}`}
                        className={`w-3.5 h-3.5 rounded-sm ${INTENSITY_CLASSES[intensity]} border border-border/20 cursor-default`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.4 + (wi * 7 + di) * 0.003,
                          duration: 0.2,
                        }}
                        title={day ? `${day.date}: ${day.minutes}m` : ""}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
