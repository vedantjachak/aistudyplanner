import {
  Award,
  BarChart3,
  Brain,
  Calendar,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { InsightPeriodToggle } from "../components/insights/InsightPeriodToggle";
import { InsightStatCards } from "../components/insights/InsightStatCards";
import { MonthlyAreaChart } from "../components/insights/MonthlyAreaChart";
import { PerformanceRadial } from "../components/insights/PerformanceRadial";
import { QuizTrendChart } from "../components/insights/QuizTrendChart";
import { StreakCalendar } from "../components/insights/StreakCalendar";
import { SubjectBreakdown } from "../components/insights/SubjectBreakdown";
import { WeeklyBarChart } from "../components/insights/WeeklyBarChart";
import { useInsightData } from "../hooks/useInsightData";
import { useStudyStore } from "../store/useStudyStore";

export type InsightPeriod = "week" | "month" | "all";

export default function InsightsPage() {
  const [period, setPeriod] = useState<InsightPeriod>("week");
  const { tasks, sessions, quizResults } = useStudyStore();
  const insight = useInsightData({ tasks, sessions, quizResults, period });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            Productivity Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visualize your study patterns, streaks & performance
          </p>
        </div>
        <InsightPeriodToggle period={period} onChange={setPeriod} />
      </motion.div>

      {/* Summary stat cards */}
      <InsightStatCards insight={insight} />

      {/* Main charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        <WeeklyBarChart data={insight.weeklyBars} />
        <MonthlyAreaChart data={insight.monthlyArea} period={period} />
      </div>

      {/* Streak calendar */}
      <StreakCalendar sessions={sessions} />

      {/* Subject + Performance row */}
      <div className="grid lg:grid-cols-2 gap-5">
        <SubjectBreakdown subjects={insight.subjects} />
        <PerformanceRadial
          completionRate={insight.completionRate}
          avgQuizScore={insight.avgQuizScore}
          consistency={insight.consistency}
        />
      </div>

      {/* Quiz trend */}
      <QuizTrendChart results={quizResults} />
    </div>
  );
}
