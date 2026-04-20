import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Planner,
  Quiz,
  QuizResult,
  Reminder,
  SnoozeOption,
  StudySession,
  Task,
} from "../types";

interface ActiveSession {
  taskId: string;
  startTime: number;
  isPaused: boolean;
}

interface QuizState {
  activeQuiz: Quiz | null;
  currentQuestion: number;
  selectedAnswers: number[];
  isCompleted: boolean;
  isLoading: boolean;
  streamingText: string; // accumulated streamed tokens
}

interface StudyStore {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;

  // Study sessions
  sessions: StudySession[];
  addSession: (session: StudySession) => void;
  activeSession: ActiveSession | null;
  startSession: (taskId: string) => void;
  stopSession: () => StudySession | null;

  // Quizzes
  quizResults: QuizResult[];
  addQuizResult: (result: QuizResult) => void;
  quizState: QuizState;
  openQuiz: (quiz: Quiz) => void;
  openQuizLoading: (subject: string) => void;
  setQuizStreamingText: (text: string) => void;
  answerQuestion: (answerIndex: number) => void;
  closeQuiz: () => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  dismissReminder: (id: string) => void;
  snoozeReminder: (id: string, option: SnoozeOption) => void;

  // Planner
  planner: Planner | null;
  setPlanner: (planner: Planner | null) => void;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Review Linear Algebra Chapter 5",
    subject: "Mathematics",
    subjectColor: "violet",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-04-17",
    estimatedMinutes: 90,
    tags: ["algebra", "midterm"],
  },
  {
    id: "2",
    title: "Read Organic Chemistry Notes",
    subject: "Chemistry",
    subjectColor: "cyan",
    priority: "medium",
    status: "todo",
    dueDate: "2026-04-18",
    estimatedMinutes: 60,
    tags: ["organic", "reactions"],
  },
  {
    id: "3",
    title: "Complete Physics Problem Set",
    subject: "Physics",
    subjectColor: "green",
    priority: "high",
    status: "todo",
    dueDate: "2026-04-16",
    estimatedMinutes: 120,
    tags: ["mechanics", "homework"],
  },
  {
    id: "4",
    title: "Write Essay Draft — Romanticism",
    subject: "Literature",
    subjectColor: "orange",
    priority: "medium",
    status: "completed",
    dueDate: "2026-04-14",
    estimatedMinutes: 75,
    completedAt: "2026-04-14T15:30:00",
    tags: ["essay", "romanticism"],
  },
  {
    id: "5",
    title: "Study Data Structures Trees",
    subject: "Computer Science",
    subjectColor: "rose",
    priority: "low",
    status: "todo",
    dueDate: "2026-04-19",
    estimatedMinutes: 45,
    tags: ["trees", "algorithms"],
  },
];

function makeSnoozeDate(option: SnoozeOption): string {
  const d = new Date();
  switch (option) {
    case "15min":
      d.setMinutes(d.getMinutes() + 15);
      break;
    case "1hour":
      d.setHours(d.getHours() + 1);
      break;
    case "3hours":
      d.setHours(d.getHours() + 3);
      break;
    case "tomorrow":
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      break;
  }
  return d.toISOString();
}

const _now = new Date();
const defaultReminders: Reminder[] = [
  {
    id: "1",
    title: "Morning Study Session",
    message: "Start your day with 30 minutes of focused review before classes",
    scheduledAt: new Date(
      _now.getFullYear(),
      _now.getMonth(),
      _now.getDate(),
      8,
      0,
    ).toISOString(),
    linkedTaskId: "1",
    frequency: "daily",
    isDismissed: false,
  },
  {
    id: "2",
    title: "Midterm Prep Reminder",
    message:
      "Chemistry midterm is approaching — review key organic reactions tonight",
    scheduledAt: new Date(_now.getTime() + 30 * 60 * 1000).toISOString(),
    linkedTaskId: "2",
    frequency: "once",
    isDismissed: false,
  },
  {
    id: "3",
    title: "Physics Problem Set Due Soon",
    message:
      "Your physics homework is due tomorrow. Make sure you've completed all problems.",
    scheduledAt: new Date(_now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    linkedTaskId: "3",
    frequency: "once",
    isDismissed: false,
  },
  {
    id: "4",
    title: "Weekly Algorithm Review",
    message:
      "Dedicate 2 hours this weekend to Computer Science algorithms and data structures.",
    scheduledAt: new Date(
      _now.getFullYear(),
      _now.getMonth(),
      _now.getDate() + 3,
      10,
      0,
    ).toISOString(),
    linkedTaskId: "5",
    frequency: "weekly",
    isDismissed: false,
  },
  {
    id: "5",
    title: "Essay Deadline Passed",
    message:
      "Great job completing your Romanticism essay draft ahead of schedule!",
    scheduledAt: new Date(_now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    linkedTaskId: "4",
    frequency: "once",
    isDismissed: true,
  },
];

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: true,
      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),

      // Tasks
      tasks: defaultTasks,
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      completeTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "completed",
                  completedAt: new Date().toISOString(),
                }
              : t,
          ),
        })),

      // Sessions
      sessions: [],
      addSession: (session) =>
        set((s) => ({ sessions: [session, ...s.sessions] })),
      activeSession: null,
      startSession: (taskId) =>
        set({
          activeSession: { taskId, startTime: Date.now(), isPaused: false },
        }),
      stopSession: () => {
        const { activeSession, tasks } = get();
        if (!activeSession) return null;
        const task = tasks.find((t) => t.id === activeSession.taskId);
        const durationMinutes = Math.round(
          (Date.now() - activeSession.startTime) / 60000,
        );
        const session: StudySession = {
          id: crypto.randomUUID(),
          taskId: activeSession.taskId,
          taskTitle: task?.title ?? "Unknown Task",
          subject: task?.subject ?? "Unknown",
          startTime: new Date(activeSession.startTime).toISOString(),
          endTime: new Date().toISOString(),
          durationMinutes: Math.max(1, durationMinutes),
          date: new Date().toISOString().split("T")[0],
        };
        set((s) => ({
          activeSession: null,
          sessions: [session, ...s.sessions],
        }));
        return session;
      },

      // Quizzes
      quizResults: [],
      addQuizResult: (result) =>
        set((s) => ({ quizResults: [result, ...s.quizResults] })),
      quizState: {
        activeQuiz: null,
        currentQuestion: 0,
        selectedAnswers: [],
        isCompleted: false,
        isLoading: false,
        streamingText: "",
      },
      openQuiz: (quiz) =>
        set({
          quizState: {
            activeQuiz: quiz,
            currentQuestion: 0,
            selectedAnswers: [],
            isCompleted: false,
            isLoading: false,
            streamingText: "",
          },
        }),
      openQuizLoading: (subject) =>
        set({
          quizState: {
            activeQuiz: { id: "__loading__", taskId: "", taskTitle: "", subject, questions: [], createdAt: "" },
            currentQuestion: 0,
            selectedAnswers: [],
            isCompleted: false,
            isLoading: true,
            streamingText: "",
          },
        }),
      setQuizStreamingText: (text) =>
        set((s) => ({
          quizState: { ...s.quizState, streamingText: text },
        })),
      answerQuestion: (answerIndex) =>
        set((s) => {
          const { quizState } = s;
          const newAnswers = [...quizState.selectedAnswers, answerIndex];
          const isCompleted =
            newAnswers.length === quizState.activeQuiz?.questions.length;
          return {
            quizState: {
              ...quizState,
              selectedAnswers: newAnswers,
              currentQuestion: isCompleted
                ? quizState.currentQuestion
                : quizState.currentQuestion + 1,
              isCompleted,
            },
          };
        }),
      closeQuiz: () =>
        set({
          quizState: {
            activeQuiz: null,
            currentQuestion: 0,
            selectedAnswers: [],
            isCompleted: false,
            isLoading: false,
            streamingText: "",
          },
        }),

      // Reminders
      reminders: defaultReminders,
      addReminder: (reminder) =>
        set((s) => ({ reminders: [reminder, ...s.reminders] })),
      updateReminder: (id, updates) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        })),
      deleteReminder: (id) =>
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),
      dismissReminder: (id) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, isDismissed: true } : r,
          ),
        })),
      snoozeReminder: (id, option) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id
              ? {
                  ...r,
                  snoozedUntil: makeSnoozeDate(option),
                  isDismissed: false,
                }
              : r,
          ),
        })),

      // Planner
      planner: null,
      setPlanner: (planner) => set({ planner }),
    }),
    { name: "study-planner-store" },
  ),
);
