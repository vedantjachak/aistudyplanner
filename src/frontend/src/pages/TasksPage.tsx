import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CheckCircle2,
  CheckSquare,
  Clock,
  Pause,
  Play,
  Plus,
  Search,
  Sparkles,
  Square,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { QuizModal } from "../components/QuizModal";
import { useStudyStore } from "../store/useStudyStore";
import type {
  Quiz,
  SubjectColor,
  Task,
  TaskPriority,
  TaskStatus,
} from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  violet: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  cyan: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  green: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  orange: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  rose: "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

const SUBJECT_PRESETS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Literature",
  "History",
  "Economics",
  "Psychology",
  "Philosophy",
  "Geography",
  "Art History",
  "Sociology",
  "Business",
  "Political Science",
  "Languages",
  "Other"
];

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: "text-destructive",
  medium: "text-chart-4",
  low: "text-chart-3",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
};

import { streamQuizFromOllama } from "../lib/ollama";

// ─── Add Task Dialog ────────────────────────────────────────────────────────

function AddTaskDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { addTask } = useStudyStore();
  const [form, setForm] = useState({
    title: "",
    subject: "",
    customSubject: "",
    subjectColor: "violet" as SubjectColor,
    priority: "medium" as TaskPriority,
    dueDate: "",
    estimatedMinutes: 60,
    tags: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalSubject = form.subject === "Other" ? form.customSubject : form.subject;
    if (!form.title.trim() || !finalSubject.trim() || !form.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    addTask({
      id: crypto.randomUUID(),
      title: form.title,
      subject: finalSubject,
      subjectColor: form.subjectColor,
      priority: form.priority,
      dueDate: form.dueDate,
      estimatedMinutes: form.estimatedMinutes,
      status: "todo",
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    toast.success("Task added! 🚀");
    onClose();
    setForm({
      title: "",
      subject: "",
      customSubject: "",
      subjectColor: "violet",
      priority: "medium",
      dueDate: "",
      estimatedMinutes: 60,
      tags: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md border-border bg-card"
        data-ocid="tasks.add_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Review Chapter 7 — Calculus"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              data-ocid="tasks.title.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={form.subject || ""}
                onValueChange={(v) => setForm({ ...form, subject: v })}
              >
                <SelectTrigger data-ocid="tasks.subject.select">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_PRESETS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.subject === "Other" && (
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="customSubject">Custom Subject</Label>
                <Input
                  id="customSubject"
                  placeholder="e.g. Music Theory"
                  value={form.customSubject}
                  onChange={(e) => setForm({ ...form, customSubject: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Color Tag</Label>
              <Select
                value={form.subjectColor}
                onValueChange={(v) =>
                  setForm({ ...form, subjectColor: v as SubjectColor })
                }
              >
                <SelectTrigger data-ocid="tasks.color.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "violet",
                      "cyan",
                      "green",
                      "orange",
                      "rose",
                    ] as SubjectColor[]
                  ).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) =>
                  setForm({ ...form, priority: v as TaskPriority })
                }
              >
                <SelectTrigger data-ocid="tasks.priority.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Duration (min)</Label>
              <Input
                type="number"
                min={5}
                max={480}
                value={form.estimatedMinutes}
                onChange={(e) =>
                  setForm({ ...form, estimatedMinutes: Number(e.target.value) })
                }
                data-ocid="tasks.minutes.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              data-ocid="tasks.due_date.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="homework, exam, review"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              data-ocid="tasks.tags.input"
            />
          </div>
          <DialogFooter className="gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-ocid="tasks.add_dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary text-white hover:opacity-90 shadow-accent"
              data-ocid="tasks.add_dialog.submit_button"
            >
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────

function DeleteConfirmDialog({
  taskTitle,
  onConfirm,
  onCancel,
}: {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent
        className="max-w-sm border-border bg-card"
        data-ocid="tasks.delete_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-destructive" />
            Delete Task
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="text-foreground font-medium">"{taskTitle}"</span>?
          This cannot be undone.
        </p>
        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            data-ocid="tasks.delete_dialog.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            data-ocid="tasks.delete_dialog.confirm_button"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Timer Hook ──────────────────────────────────────────────────────────────

function useTaskTimer(_taskId: string, isActive: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());
  const elapsedRef = useRef(0);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  useEffect(() => {
    if (isActive) {
      startRef.current = Date.now() - elapsedRef.current * 1000;
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const reset = useCallback(() => {
    setElapsed(0);
    startRef.current = Date.now();
  }, []);

  return { elapsed, reset };
}

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Celebration Particles ─────────────────────────────────────────────────

const BURST_KEYS = ["b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7"] as const;

function CelebrationBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      {BURST_KEYS.map((key, i) => (
        <motion.div
          key={key}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background:
              i % 2 === 0 ? "oklch(0.72 0.19 270)" : "oklch(0.68 0.16 180)",
            left: `${20 + (i % 4) * 20}%`,
            top: "50%",
          }}
          initial={{ scale: 0, opacity: 1, y: 0, x: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            y: [-20 - i * 8, -60 - i * 8],
            x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 5)],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── Task Card ───────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  index: number;
  onDeleteRequest: (task: Task) => void;
  onQuizOpen: (quiz: Quiz) => void;
}

function TaskCard({ task, index, onDeleteRequest, onQuizOpen }: TaskCardProps) {
  const { updateTask, completeTask, activeSession, startSession, stopSession, openQuiz, openQuizLoading, setQuizStreamingText } =
    useStudyStore();
  const isActiveSession = activeSession?.taskId === task.id;
  const [localPaused, setLocalPaused] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const { elapsed, reset } = useTaskTimer(
    task.id,
    isActiveSession && !localPaused,
  );

  const daysUntilDue = Math.ceil(
    (new Date(task.dueDate).getTime() - Date.now()) / 86400000,
  );
  const isOverdue = daysUntilDue < 0 && task.status !== "completed";
  const remainingSecs = Math.max(0, task.estimatedMinutes * 60 - elapsed);
  const progressPct = Math.min(
    100,
    (elapsed / (task.estimatedMinutes * 60)) * 100,
  );

  function handleStart() {
    startSession(task.id);
    setLocalPaused(false);
    reset();
    updateTask(task.id, { status: "in_progress" });
    toast.success(`Started: ${task.title}`);
  }

  function handlePause() {
    setLocalPaused((p) => !p);
  }

  async function handleCompleteSession() {
    stopSession();
    setLocalPaused(false);
    completeTask(task.id);
    setJustCompleted(true);
    toast.success(`"${task.title}" completed! Generating AI quiz… 🎯`, { duration: 3000 });

    openQuizLoading(task.subject);
    try {
      const quiz = await streamQuizFromOllama(task, (partial) => setQuizStreamingText(partial));
      setJustCompleted(false);
      openQuiz(quiz);
    } catch (err) {
      toast.error("Failed to generate AI quiz.");
      setJustCompleted(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      data-ocid={`tasks.item.${index + 1}`}
      className="relative"
    >
      {justCompleted && !isGeneratingQuiz && <CelebrationBurst />}
      <Card
        className={cn(
          "border overflow-hidden transition-smooth group relative",
          task.status === "completed" && "opacity-60",
          isActiveSession
            ? "border-primary/50 shadow-accent"
            : "border-border hover:border-primary/30 hover:shadow-elevated",
        )}
      >
        {/* Gradient top accent bar for active tasks */}
        {isActiveSession && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}

        <CardContent className="p-4">
          {/* Main row */}
          <div className="flex items-start gap-3">
            {/* Complete checkbox */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                if (task.status !== "completed") {
                  setJustCompleted(true);
                  completeTask(task.id);
                  toast.success("Task completed! 🎉");
                  setTimeout(() => setJustCompleted(false), 900);
                }
              }}
              className={cn(
                "mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-smooth flex items-center justify-center",
                task.status === "completed"
                  ? "border-chart-3 bg-chart-3/20"
                  : "border-border hover:border-chart-3",
              )}
              data-ocid={`tasks.checkbox.${index + 1}`}
            >
              <AnimatePresence>
                {task.status === "completed" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-chart-3" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-medium text-foreground truncate",
                    task.status === "completed" &&
                      "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </p>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 border ${SUBJECT_COLORS[task.subjectColor]}`}
                >
                  {task.subject}
                </Badge>
                {task.status !== "completed" && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      task.status === "in_progress" &&
                        "border-primary/40 bg-primary/10 text-primary",
                    )}
                  >
                    {STATUS_LABELS[task.status]}
                  </Badge>
                )}
                {isActiveSession && (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                    }}
                    className="flex items-center gap-1 text-[10px] text-primary font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    LIVE
                  </motion.span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span
                  className={cn("font-medium", PRIORITY_STYLES[task.priority])}
                >
                  {task.priority}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.estimatedMinutes}m
                </span>
                <span
                  className={cn(isOverdue && "text-destructive font-medium")}
                >
                  {isOverdue
                    ? `${Math.abs(daysUntilDue)}d overdue`
                    : task.status === "completed"
                      ? "Done"
                      : daysUntilDue === 0
                        ? "Due today"
                        : `${daysUntilDue}d left`}
                </span>
                {task.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded bg-muted text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Timer bar (shown when session is active) */}
              <AnimatePresence>
                {isActiveSession && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {localPaused ? "Paused —" : "Elapsed —"}
                        <span className="font-mono text-foreground font-semibold ml-1">
                          {formatTime(elapsed)}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Remaining:
                        <span
                          className={cn(
                            "font-mono font-semibold ml-1",
                            remainingSecs === 0
                              ? "text-chart-3"
                              : "text-foreground",
                          )}
                        >
                          {remainingSecs === 0
                            ? "Done!"
                            : formatTime(remainingSecs)}
                        </span>
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-primary rounded-full"
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 self-start">
              {isGeneratingQuiz && (
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-xs text-primary animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Generating Quiz...
                  </span>
                </div>
              )}
              {task.status !== "completed" && !isGeneratingQuiz && (
                <div className="flex items-center gap-1">
                  {!isActiveSession ? (
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs border-primary/40 text-primary hover:bg-primary/10"
                        onClick={handleStart}
                        data-ocid={`tasks.start_button.${index + 1}`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Start
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 border-border"
                          onClick={handlePause}
                          data-ocid={`tasks.pause_button.${index + 1}`}
                        >
                          {localPaused ? (
                            <Play className="w-3 h-3 fill-current text-primary" />
                          ) : (
                            <Pause className="w-3 h-3 text-muted-foreground" />
                          )}
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 border-chart-3/40 text-chart-3 hover:bg-chart-3/10"
                          onClick={handleCompleteSession}
                          data-ocid={`tasks.complete_session_button.${index + 1}`}
                        >
                          <Square className="w-3 h-3 fill-current" />
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </div>
              )}
              {task.status !== "completed" && (
                <Select
                  value={task.status}
                  onValueChange={(v) =>
                    updateTask(task.id, { status: v as TaskStatus })
                  }
                >
                  <SelectTrigger
                    className="h-7 text-xs w-28 border-border"
                    data-ocid={`tasks.status.select.${index + 1}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth"
                onClick={() => onDeleteRequest(task)}
                data-ocid={`tasks.delete_button.${index + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="py-16 flex flex-col items-center gap-4 border border-dashed border-border rounded-2xl bg-card/40"
      data-ocid="tasks.empty_state"
    >
      {hasSearch ? (
        <>
          <Search className="w-10 h-10 text-muted-foreground/40" />
          <div className="text-center">
            <p className="font-medium text-foreground">No tasks found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term
            </p>
          </div>
        </>
      ) : (
        <>
          <motion.div
            className="relative"
            animate={{ y: [0, -6, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "easeInOut",
            }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-accent">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                delay: 0.5,
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </motion.div>
          </motion.div>
          <div className="text-center space-y-1.5">
            <p className="font-display font-semibold text-foreground text-lg">
              No tasks yet!
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Add your first study task to get started. Complete sessions to
              unlock AI-powered quizzes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {["Start session", "Complete task", "Take quiz"].map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium text-[10px]">
                  {i + 1}
                </span>
                {step}
                {i < 2 && <span className="text-muted-foreground/40">→</span>}
              </span>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const { tasks, openQuiz } = useStudyStore();
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const { deleteTask } = useStudyStore();

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  function handleQuizOpen(quiz: Quiz) {
    openQuiz(quiz);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-accent">
              <CheckSquare className="w-4.5 h-4.5 text-white" />
            </div>
            Task Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {counts.todo + counts.in_progress} active · {counts.completed}{" "}
            completed
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            className="bg-gradient-primary text-white hover:opacity-90 shadow-accent gap-2"
            onClick={() => setAddOpen(true)}
            data-ocid="tasks.add_button"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks or subjects…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="tasks.search_input"
          />
        </div>
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
        >
          <TabsList data-ocid="tasks.filter.tab">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="todo">Todo ({counts.todo})</TabsTrigger>
            <TabsTrigger value="in_progress">
              Active ({counts.in_progress})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Done ({counts.completed})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Task list */}
      <div className="space-y-2.5" data-ocid="tasks.list">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <EmptyState key="empty" hasSearch={!!search} />
          ) : (
            filteredTasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                index={i}
                onDeleteRequest={setDeleteTarget}
                onQuizOpen={handleQuizOpen}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AddTaskDialog open={addOpen} onClose={() => setAddOpen(false)} />

      {deleteTarget && (
        <DeleteConfirmDialog
          taskTitle={deleteTarget.title}
          onConfirm={() => {
            deleteTask(deleteTarget.id);
            toast.success("Task deleted");
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <QuizModal />
    </div>
  );
}
