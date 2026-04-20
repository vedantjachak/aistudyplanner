import { useMemo } from "react";
import type { InsightPeriod } from "../pages/InsightsPage";
import type { QuizResult, StudySession, Task } from "../types";

const SUBJECT_COLORS: Record<string, string> = {
  violet: "oklch(0.72 0.19 270)",
  cyan: "oklch(0.68 0.16 180)",
  green: "oklch(0.62 0.20 120)",
  orange: "oklch(0.68 0.18 50)",
  rose: "oklch(0.60 0.22 15)",
};

export interface DayBar {
  day: string;
  minutes: number;
  date: string;
}
export interface AreaPoint {
  date: string;
  label: string;
  minutes: number;
}
export interface SubjectStat {
  subject: string;
  minutes: number;
  tasks: number;
  color: string;
  pct: number;
}

export interface InsightResult {
  totalMinutes: number;
  avgDailyMinutes: number;
  bestDay: string;
  topSubject: string;
  completionRate: number;
  avgQuizScore: number;
  consistency: number;
  weeklyBars: DayBar[];
  monthlyArea: AreaPoint[];
  subjects: SubjectStat[];
  streak: number;
}

interface Params {
  tasks: Task[];
  sessions: StudySession[];
  quizResults: QuizResult[];
  period: InsightPeriod;
}

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Demo seed data for empty state
const DEMO_WEEKLY: DayBar[] = [
  { day: "Mon", minutes: 45, date: "" },
  { day: "Tue", minutes: 95, date: "" },
  { day: "Wed", minutes: 30, date: "" },
  { day: "Thu", minutes: 130, date: "" },
  { day: "Fri", minutes: 80, date: "" },
  { day: "Sat", minutes: 60, date: "" },
  { day: "Sun", minutes: 20, date: "" },
];

const DEMO_SUBJECTS: SubjectStat[] = [
  {
    subject: "Mathematics",
    minutes: 180,
    tasks: 3,
    color: SUBJECT_COLORS.violet,
    pct: 100,
  },
  {
    subject: "Computer Science",
    minutes: 145,
    tasks: 2,
    color: SUBJECT_COLORS.cyan,
    pct: 80,
  },
  {
    subject: "Physics",
    minutes: 120,
    tasks: 2,
    color: SUBJECT_COLORS.green,
    pct: 67,
  },
  {
    subject: "Literature",
    minutes: 75,
    tasks: 1,
    color: SUBJECT_COLORS.orange,
    pct: 42,
  },
  {
    subject: "Chemistry",
    minutes: 90,
    tasks: 2,
    color: SUBJECT_COLORS.rose,
    pct: 50,
  },
];

function buildMonthlyDemo(): AreaPoint[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return {
      date: d.toISOString().split("T")[0],
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      minutes: Math.round(20 + Math.random() * 100),
    };
  });
}

export function useInsightData({
  tasks,
  sessions,
  quizResults,
  period,
}: Params): InsightResult {
  return useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Filter sessions by period
    const cutoff = new Date(today);
    if (period === "week") cutoff.setDate(today.getDate() - 6);
    else if (period === "month") cutoff.setDate(today.getDate() - 29);
    else cutoff.setFullYear(2000);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    const filteredSessions = sessions.filter(
      (s) => s.date >= cutoffStr && s.date <= todayStr,
    );

    // Weekly bars (last 7 days always)
    const weeklyBars: DayBar[] = WEEK_LABELS.map((day, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      const mins = sessions
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      return { day, minutes: mins, date: dateStr };
    });

    const useDemo = sessions.length === 0;
    const barsData = useDemo ? DEMO_WEEKLY : weeklyBars;

    // Monthly area points
    const days = period === "week" ? 7 : period === "month" ? 30 : 90;
    const monthlyArea: AreaPoint[] = Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split("T")[0];
      const mins = filteredSessions
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      return {
        date: dateStr,
        label:
          days <= 7 ? WEEK_LABELS[i % 7] : `${d.getMonth() + 1}/${d.getDate()}`,
        minutes: useDemo
          ? Math.round(20 + Math.sin(i * 0.5) * 40 + Math.random() * 30)
          : mins,
      };
    });

    // Subjects
    const subjectMap: Record<
      string,
      { minutes: number; tasks: number; color: string }
    > = {};
    for (const t of tasks) {
      if (!subjectMap[t.subject]) {
        subjectMap[t.subject] = {
          minutes: 0,
          tasks: 0,
          color: SUBJECT_COLORS[t.subjectColor] ?? SUBJECT_COLORS.violet,
        };
      }
      subjectMap[t.subject].tasks += 1;
      const taskMinutes = filteredSessions
        .filter((s) => s.taskId === t.id)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      subjectMap[t.subject].minutes += taskMinutes;
    }
    const rawSubjects = Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      ...data,
    }));
    const maxMins = Math.max(...rawSubjects.map((s) => s.minutes), 1);
    const computedSubjects: SubjectStat[] = rawSubjects
      .sort((a, b) => b.minutes - a.minutes)
      .map((s) => ({ ...s, pct: Math.round((s.minutes / maxMins) * 100) }));
    const subjects = useDemo ? DEMO_SUBJECTS : computedSubjects;

    // Stats
    const totalMinutes = useDemo
      ? barsData.reduce((sum, d) => sum + d.minutes, 0)
      : filteredSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const dayCount = Math.max(days, 1);
    const avgDailyMinutes = Math.round(totalMinutes / dayCount);
    const bestBarDay = [...barsData].sort((a, b) => b.minutes - a.minutes)[0];
    const bestDay = bestBarDay ? bestBarDay.day : "—";
    const topSubject = subjects[0]?.subject ?? "—";
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const completionRate =
      tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 75;
    const avgQuizScore =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) /
              quizResults.length,
          )
        : 82;
    const activeDays = useDemo
      ? 5
      : barsData.filter((d) => d.minutes > 0).length;
    const consistency = Math.round((activeDays / 7) * 100);
    const streak = useDemo
      ? 4
      : (() => {
          let s = 0;
          for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const ds = d.toISOString().split("T")[0];
            if (sessions.some((sess) => sess.date === ds)) s++;
            else break;
          }
          return s;
        })();

    return {
      totalMinutes,
      avgDailyMinutes,
      bestDay,
      topSubject,
      completionRate,
      avgQuizScore,
      consistency,
      weeklyBars: barsData,
      monthlyArea: useDemo ? buildMonthlyDemo() : monthlyArea,
      subjects,
      streak,
    };
  }, [tasks, sessions, quizResults, period]);
}
