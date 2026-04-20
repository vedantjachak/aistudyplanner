import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  PlayCircle,
  Plus,
  Sparkles,
  StopCircle,
  Timer,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { QuizModal } from "../components/QuizModal";
import { streamQuizFromOllama } from "../lib/ollama";
import { useStudyStore } from "../store/useStudyStore";
import type { Task } from "../types";

// ─── Constants ──────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  violet: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  cyan: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  green: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  orange: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  rose: "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

const PRIORITY_BADGE: Record<string, string> = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  low: "bg-chart-3/20 text-chart-3 border-chart-3/30",
};

const CHART_COLORS = [
  "oklch(0.72 0.19 270)",
  "oklch(0.68 0.16 180)",
  "oklch(0.62 0.2 120)",
  "oklch(0.68 0.18 50)",
  "oklch(0.6 0.22 15)",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const sampleQuizzes: Record<
  string,
  { question: string; options: string[]; correctIndex: number }[]
> = {
  Mathematics: [
    {
      question: "What is the determinant of a 2×2 identity matrix?",
      options: ["0", "1", "2", "-1"],
      correctIndex: 1,
    },
    {
      question: "In linear algebra, what does 'rank' of a matrix refer to?",
      options: [
        "Number of rows",
        "Number of non-zero rows in row echelon form",
        "Number of columns",
        "Trace of the matrix",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Which theorem states every matrix satisfies its characteristic equation?",
      options: ["Rank-Nullity", "Cayley-Hamilton", "Spectral", "Jordan"],
      correctIndex: 1,
    },
  ],
  Chemistry: [
    {
      question: "What type of bond involves sharing electrons?",
      options: ["Ionic", "Covalent", "Hydrogen", "Metallic"],
      correctIndex: 1,
    },
    {
      question: "Which functional group is characteristic of alcohols?",
      options: ["-COOH", "-NH2", "-OH", "-CHO"],
      correctIndex: 2,
    },
    {
      question: "What is the primary product of glucose fermentation?",
      options: ["Acetic acid", "Ethanol", "Methanol", "Lactic acid"],
      correctIndex: 1,
    },
  ],
  Physics: [
    {
      question: "Newton's second law relates force to which quantities?",
      options: [
        "Speed and distance",
        "Mass and acceleration",
        "Velocity and time",
        "Energy and power",
      ],
      correctIndex: 1,
    },
    {
      question: "Which law describes conservation of energy?",
      options: [
        "First Law of Thermodynamics",
        "Ohm's Law",
        "Hooke's Law",
        "Boyle's Law",
      ],
      correctIndex: 0,
    },
    {
      question: "What is the SI unit of electric resistance?",
      options: ["Ampere", "Volt", "Ohm", "Watt"],
      correctIndex: 2,
    },
  ],
};

// ─── Animated Progress Ring ─────────────────────────────────────────────────

function ProgressRing({ percent }: { percent: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const springPercent = useSpring(0, { stiffness: 60, damping: 15 });
  const strokeDashoffset = useTransform(
    springPercent,
    (v) => circumference - (v / 100) * circumference,
  );

  useEffect(() => {
    springPercent.set(percent);
  }, [percent, springPercent]);

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg
        className="w-full h-full -rotate-90"
        viewBox="0 0 128 128"
        role="img"
        aria-label={`Daily goal ${percent}% complete`}
      >
        {/* Track */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-muted"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.72 0.19 270)" />
            <stop offset="100%" stopColor="oklch(0.68 0.16 180)" />
          </linearGradient>
        </defs>
        {/* Progress arc */}
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="8"
          stroke="url(#ring-gradient)"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-display font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {percent}%
        </motion.span>
        <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
          Complete
        </span>
      </div>
    </div>
  );
}

// ─── Live Timer ──────────────────────────────────────────────────────────────

function useElapsedTime(startTime: number | null) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Active Session Banner ───────────────────────────────────────────────────

function ActiveSessionBanner() {
  const { activeSession, tasks, stopSession, openQuiz, openQuizLoading, completeTask, setQuizStreamingText } =
    useStudyStore();
  const timer = useElapsedTime(activeSession?.startTime ?? null);

  if (!activeSession) return null;
  const task = tasks.find((t) => t.id === activeSession.taskId);

  function handleStop() {
    stopSession();
    toast.success("Session saved!", { duration: 2000 });
  }

  function handleComplete() {
    if (!task) return;
    completeTask(task.id);
    stopSession();
    openQuizLoading(task.subject);
    streamQuizFromOllama(task, (partial) => setQuizStreamingText(partial)).then(openQuiz);
    toast.success(`"${task.title}" completed! Generating quiz… 🎯`, { duration: 3000 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      data-ocid="active_session.banner"
    >
      <Card className="border-primary/40 bg-primary/5 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary animate-pulse-gentle" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Timer className="w-4 h-4 text-primary animate-pulse-gentle" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  Active Session
                </p>
                <p className="text-sm font-display font-semibold text-foreground truncate">
                  {task?.title ?? "Unknown Task"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p
                  className="text-xl font-mono font-bold text-primary tabular-nums"
                  data-ocid="active_session.timer"
                >
                  {timer}
                </p>
                <p className="text-[10px] text-muted-foreground">elapsed</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-border text-muted-foreground hover:text-destructive hover:border-destructive/30"
                  onClick={handleStop}
                  data-ocid="active_session.stop_button"
                >
                  <StopCircle className="w-3.5 h-3.5 mr-1" />
                  Stop
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-gradient-primary text-white hover:opacity-90"
                  onClick={handleComplete}
                  data-ocid="active_session.complete_button"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Done
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  colorClass,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  colorClass: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="border-border hover:shadow-elevated transition-smooth hover:-translate-y-0.5 group overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-smooth" />
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                {label}
              </p>
              <p className="text-2xl font-display font-bold text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Task Card ───────────────────────────────────────────────────────────────

function TaskCard({ task, index }: { task: Task; index: number }) {
  const { completeTask, startSession, activeSession, stopSession, openQuiz, openQuizLoading, setQuizStreamingText } =
    useStudyStore();
  const isSessionActive = activeSession?.taskId === task.id;

  function handleComplete() {
    completeTask(task.id);
    stopSession();
    openQuizLoading(task.subject);
    streamQuizFromOllama(task, (partial) => setQuizStreamingText(partial)).then(openQuiz);
    toast.success(`"${task.title}" completed! Generating quiz… 🎯`, { duration: 3000 });
  }

  function handleSession() {
    if (isSessionActive) {
      stopSession();
      toast.success("Session saved!", { duration: 2000 });
    } else {
      startSession(task.id);
      toast.info(`Started: ${task.title}`, { duration: 2000 });
    }
  }

  const daysUntilDue = Math.ceil(
    (new Date(task.dueDate).getTime() - Date.now()) / 86400000,
  );
  const isOverdue = daysUntilDue < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      data-ocid={`task.item.${index + 1}`}
    >
      <Card
        className={`group relative overflow-hidden border transition-smooth hover:shadow-elevated hover:-translate-y-0.5 ${
          isSessionActive ? "border-primary/50 shadow-accent" : "border-border"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-smooth" />
        {isSessionActive && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary animate-pulse-gentle" />
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium px-2 py-0.5 ${SUBJECT_COLORS[task.subjectColor]}`}
                >
                  {task.subject}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium px-2 py-0.5 capitalize ${PRIORITY_BADGE[task.priority]}`}
                >
                  {task.priority}
                </Badge>
                {isOverdue && (
                  <Badge
                    variant="destructive"
                    className="text-[10px] px-2 py-0.5"
                  >
                    Overdue
                  </Badge>
                )}
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm leading-snug truncate">
                {task.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.estimatedMinutes}m
                </span>
                <span>
                  {isOverdue
                    ? `${Math.abs(daysUntilDue)}d overdue`
                    : daysUntilDue === 0
                      ? "Due today"
                      : `${daysUntilDue}d left`}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 px-2 text-xs ${
                  isSessionActive
                    ? "text-destructive hover:text-destructive"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={handleSession}
                aria-label={isSessionActive ? "Stop session" : "Start session"}
                data-ocid={`task.session_button.${index + 1}`}
              >
                {isSessionActive ? (
                  <StopCircle className="w-4 h-4" />
                ) : (
                  <PlayCircle className="w-4 h-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-chart-3"
                onClick={handleComplete}
                aria-label="Mark task complete"
                data-ocid={`task.complete_button.${index + 1}`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Weekly Chart ─────────────────────────────────────────────────────────────

function WeeklyChart({
  sessions,
}: { sessions: { date: string; durationMinutes: number }[] }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const data = useMemo(() => {
    const today = new Date();
    return DAYS.map((day, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - ((today.getDay() - 1 + 7) % 7) + i);
      const dateStr = d.toISOString().split("T")[0];
      const minutes = sessions
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      return {
        day,
        minutes,
        isToday: dateStr === today.toISOString().split("T")[0],
      };
    });
  }, [sessions]);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart
        data={data}
        barSize={20}
        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="oklch(0.3 0 0 / 0.3)"
        />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v > 0 ? `${v}m` : "")}
        />
        <Tooltip
          cursor={{ fill: "oklch(0.72 0.19 270 / 0.08)" }}
          contentStyle={{
            background: "oklch(0.2 0 0)",
            border: "1px solid oklch(0.3 0 0)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "oklch(0.94 0 0)",
          }}
          formatter={(value: number) => [`${value}m`, "Studied"]}
        />
        <Bar
          dataKey="minutes"
          radius={[4, 4, 0, 0]}
          isAnimationActive={animated}
          animationDuration={800}
        >
          {data.map((entry) => (
            <Cell
              key={entry.day}
              fill={
                entry.isToday
                  ? "url(#bar-gradient)"
                  : "oklch(0.72 0.19 270 / 0.35)"
              }
            />
          ))}
        </Bar>
        <defs>
          <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 270)" />
            <stop offset="100%" stopColor="oklch(0.68 0.16 180)" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Subject Donut ────────────────────────────────────────────────────────────

function SubjectDonut({ tasks }: { tasks: Task[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);

  const data = useMemo(() => {
    const subjectMap: Record<string, number> = {};
    for (const t of tasks) {
      subjectMap[t.subject] = (subjectMap[t.subject] ?? 0) + t.estimatedMinutes;
    }
    return Object.entries(subjectMap).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        No subjects yet
      </div>
    );
  }

  const renderActiveShape = (props: unknown) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props as {
        cx: number;
        cy: number;
        innerRadius: number;
        outerRadius: number;
        startAngle: number;
        endAngle: number;
        fill: string;
      };
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={(outerRadius as number) + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={34}
            outerRadius={52}
            dataKey="value"
            isAnimationActive={animated}
            animationBegin={0}
            animationDuration={900}
            activeIndex={activeIdx ?? undefined}
            activeShape={renderActiveShape}
            onMouseEnter={(_, idx) => setActiveIdx(idx)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CHART_COLORS[data.indexOf(entry) % CHART_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-1.5 min-w-0">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="text-muted-foreground truncate flex-1">
              {entry.name}
            </span>
            <span className="font-mono font-medium text-foreground">
              {entry.value}m
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quiz Score Card ──────────────────────────────────────────────────────────

function QuizScoreCard({
  score,
  total,
  subject,
  date,
  index,
}: {
  score: number;
  total: number;
  subject?: string;
  date: string;
  index: number;
}) {
  const pct = Math.round((score / total) * 100);
  const colorClass =
    pct >= 80
      ? "text-chart-3 bg-chart-3/10 border-chart-3/20"
      : pct >= 50
        ? "text-chart-4 bg-chart-4/10 border-chart-4/20"
        : "text-destructive bg-destructive/10 border-destructive/20";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.07 }}
      data-ocid={`quiz.score_card.${index + 1}`}
    >
      <div className={`rounded-xl border p-3 text-center ${colorClass}`}>
        <Trophy className="w-4 h-4 mx-auto mb-1 opacity-80" />
        <p className="text-lg font-display font-bold tabular-nums">{pct}%</p>
        <p className="text-[10px] font-medium opacity-70 truncate">
          {subject ?? "Quiz"}
        </p>
        <p className="text-[9px] opacity-50 mt-0.5">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function NewUserEmptyState({ onAddTask }: { onAddTask: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      data-ocid="dashboard.empty_state"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 shadow-accent">
        <BookOpen className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-xl font-display font-bold text-foreground mb-2">
        Welcome, Scholar!
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-6 leading-relaxed">
        Your AI-powered study planner is ready. Add your first task to start
        tracking progress, earning streaks, and unlocking quizzes.
      </p>
      <Button
        className="bg-gradient-primary text-white hover:opacity-90 shadow-accent"
        onClick={onAddTask}
        data-ocid="dashboard.empty_state.add_task_button"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Task
      </Button>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { tasks, sessions, quizResults, quizState, activeSession } =
    useStudyStore();
  const [showAllTasks, setShowAllTasks] = useState(false);
  const navigate = useNavigate();

  const isNewUser = tasks.length === 0;

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const total = tasks.length;
    const todayStr = new Date().toISOString().split("T")[0];
    const todayMinutes = sessions
      .filter((s) => s.date === todayStr)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalStudyTime = sessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );
    const streak = sessions.length > 0 ? Math.min(sessions.length, 7) : 0;
    const avgScore =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) /
              quizResults.length,
          )
        : 0;
    const dailyGoalMinutes = 120;
    const dailyGoalPct = Math.min(
      100,
      Math.round((todayMinutes / dailyGoalMinutes) * 100),
    );
    return {
      completed,
      total,
      todayMinutes,
      totalStudyTime,
      streak,
      avgScore,
      dailyGoalPct,
    };
  }, [tasks, sessions, quizResults]);

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const upcomingTasks = [...pendingTasks]
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 3);
  const displayedTasks = showAllTasks ? pendingTasks : pendingTasks.slice(0, 4);
  const overallProgress =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const recentQuizResults = quizResults.slice(0, 5);

  // Recent quiz results (subject not stored in QuizResult type)
  const enrichedQuizResults = useMemo(
    () =>
      recentQuizResults.map((r) => ({
        ...r,
        subject: undefined as string | undefined,
      })),
    [recentQuizResults],
  );

  function handleStartTask() {
    navigate({ to: "/tasks" });
  }

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* ── Header ── */}
      <motion.div
        className="flex items-start justify-between gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            {greeting}, Scholar{" "}
            <span className="animate-pulse-gentle inline-block">👋</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {pendingTasks.length} tasks remaining · {overallProgress}% weekly
            goal
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI Ready</span>
        </motion.div>
      </motion.div>

      {/* ── Active Session Banner ── */}
      <AnimatePresence>
        {activeSession && <ActiveSessionBanner />}
      </AnimatePresence>

      {isNewUser ? (
        <NewUserEmptyState onAddTask={handleStartTask} />
      ) : (
        <>
          {/* ── Hero Stats Row ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            <Card className="border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-[0.04] pointer-events-none" />
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Progress Ring */}
                  <ProgressRing percent={stats.dailyGoalPct} />

                  {/* Daily goal info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h2 className="text-lg font-display font-semibold text-foreground">
                      Daily Goal Progress
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {stats.todayMinutes}m studied today · goal: 2h
                    </p>
                    <div className="mt-4 relative h-2 rounded-full overflow-hidden bg-muted">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.dailyGoalPct}%` }}
                        transition={{
                          delay: 0.7,
                          duration: 0.9,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-4 flex-wrap justify-center sm:justify-start">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Flame className="w-3.5 h-3.5 text-chart-4" />
                        <span className="font-semibold text-foreground">
                          {stats.streak}
                        </span>{" "}
                        day streak
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-chart-3" />
                        <span className="font-semibold text-foreground">
                          {stats.completed}/{stats.total}
                        </span>{" "}
                        complete
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Brain className="w-3.5 h-3.5 text-chart-1" />
                        <span className="font-semibold text-foreground">
                          {stats.avgScore > 0 ? `${stats.avgScore}%` : "—"}
                        </span>{" "}
                        quiz avg
                      </span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      className="bg-gradient-primary text-white hover:opacity-90 shadow-accent text-xs"
                      onClick={handleStartTask}
                      data-ocid="dashboard.start_new_task_button"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      New Task
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10 text-xs"
                      onClick={() => navigate({ to: "/tasks" })}
                      data-ocid="dashboard.view_all_tasks_button"
                    >
                      <Zap className="w-3.5 h-3.5 mr-1" />
                      All Tasks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={`${stats.completed}/${stats.total}`}
              sub="tasks this week"
              colorClass="bg-chart-3/20 text-chart-3"
              delay={0.2}
            />
            <StatCard
              icon={Clock}
              label="Today"
              value={`${stats.todayMinutes}m`}
              sub="studied today"
              colorClass="bg-chart-1/20 text-chart-1"
              delay={0.25}
            />
            <StatCard
              icon={TrendingUp}
              label="Total Time"
              value={`${Math.floor(stats.totalStudyTime / 60)}h ${stats.totalStudyTime % 60}m`}
              sub="all sessions"
              colorClass="bg-chart-2/20 text-chart-2"
              delay={0.3}
            />
            <StatCard
              icon={Flame}
              label="Streak"
              value={`${stats.streak}d`}
              sub="days studying"
              colorClass="bg-chart-4/20 text-chart-4"
              delay={0.35}
            />
          </div>

          {/* ── Charts Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Weekly bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.45 }}
            >
              <Card
                className="border-border h-full"
                data-ocid="dashboard.weekly_chart.card"
              >
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="flex items-center gap-2 text-sm font-display font-semibold">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Weekly Study Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-5 px-5">
                  <WeeklyChart sessions={sessions} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Subject donut chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.45 }}
            >
              <Card
                className="border-border h-full"
                data-ocid="dashboard.subject_chart.card"
              >
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="flex items-center gap-2 text-sm font-display font-semibold">
                    <BookOpen className="w-4 h-4 text-secondary" />
                    Study by Subject
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-5 px-5">
                  <SubjectDonut tasks={tasks} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Upcoming Tasks + Quiz Scores Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Upcoming tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.45 }}
              className="lg:col-span-2"
              data-ocid="dashboard.upcoming_tasks.section"
            >
              <Card className="border-border h-full">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-display font-semibold">
                      <Clock className="w-4 h-4 text-chart-2" />
                      Upcoming Tasks
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary text-xs gap-1 h-7 px-2"
                      onClick={() => navigate({ to: "/tasks" })}
                      data-ocid="dashboard.upcoming_tasks.view_all_link"
                    >
                      View all
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-5 px-5">
                  {upcomingTasks.length === 0 ? (
                    <div
                      className="text-center py-8 border border-dashed border-border rounded-xl"
                      data-ocid="dashboard.upcoming_tasks.empty_state"
                    >
                      <CheckCircle2 className="w-8 h-8 text-chart-3 mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        All caught up!
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        No upcoming tasks. Add new ones to keep learning.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {upcomingTasks.map((task, i) => (
                        <TaskCard key={task.id} task={task} index={i} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent quiz scores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.45 }}
              data-ocid="dashboard.quiz_scores.section"
            >
              <Card className="border-border h-full">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="flex items-center gap-2 text-sm font-display font-semibold">
                    <Brain className="w-4 h-4 text-chart-4" />
                    Recent Quizzes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-5 px-5">
                  {enrichedQuizResults.length === 0 ? (
                    <div
                      className="text-center py-6 border border-dashed border-border rounded-xl"
                      data-ocid="dashboard.quiz_scores.empty_state"
                    >
                      <Brain className="w-7 h-7 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Complete tasks to unlock AI quizzes
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {enrichedQuizResults.map((r, i) => (
                        <QuizScoreCard
                          key={r.id}
                          score={r.score}
                          total={r.total}
                          subject={r.subject}
                          date={r.completedAt}
                          index={i}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── All Pending Tasks ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.45 }}
            data-ocid="dashboard.all_tasks.section"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                All Pending Tasks
                {pendingTasks.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    {pendingTasks.length}
                  </Badge>
                )}
              </h2>
              {pendingTasks.length > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-xs gap-1 h-7 px-2"
                  onClick={() => setShowAllTasks(!showAllTasks)}
                  data-ocid="dashboard.all_tasks.show_all_toggle"
                >
                  {showAllTasks ? "Show less" : "See all"}
                  <ChevronRight
                    className={`w-3 h-3 transition-smooth ${showAllTasks ? "rotate-90" : ""}`}
                  />
                </Button>
              )}
            </div>

            {pendingTasks.length === 0 ? (
              <div
                className="text-center py-10 border border-dashed border-border rounded-xl"
                data-ocid="dashboard.all_tasks.empty_state"
              >
                <CheckCircle2 className="w-9 h-9 text-chart-3 mx-auto mb-3" />
                <p className="font-medium text-foreground text-sm">
                  All tasks complete!
                </p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  You've finished everything. Ready for more?
                </p>
                <Button
                  size="sm"
                  className="bg-gradient-primary text-white hover:opacity-90"
                  onClick={handleStartTask}
                  data-ocid="dashboard.all_tasks.add_more_button"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add More Tasks
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <AnimatePresence>
                  {displayedTasks.map((task, i) => (
                    <TaskCard key={task.id} task={task} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </>
      )}

      {quizState.activeQuiz && <QuizModal />}
    </div>
  );
}
