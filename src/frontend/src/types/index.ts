export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "completed";
export type SubjectColor = "violet" | "cyan" | "green" | "orange" | "rose";

export interface Task {
  id: string;
  title: string;
  subject: string;
  subjectColor: SubjectColor;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  estimatedMinutes: number;
  completedAt?: string;
  tags: string[];
}

export interface StudySession {
  id: string;
  taskId: string;
  taskTitle: string;
  subject: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  date: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  taskId: string;
  taskTitle: string;
  subject: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  total: number;
  completedAt: string;
  answers: number[];
}

export type ReminderFrequency = "once" | "daily" | "weekly";
export type ReminderUrgency = "urgent" | "soon" | "later";
export type SnoozeOption = "15min" | "1hour" | "3hours" | "tomorrow";

export interface Reminder {
  id: string;
  title: string;
  message: string;
  scheduledAt: string; // ISO datetime string
  linkedTaskId?: string;
  frequency: ReminderFrequency;
  isDismissed: boolean;
  snoozedUntil?: string; // ISO datetime string
}

/** Derived urgency based on scheduledAt */
export function getReminderUrgency(scheduledAt: string): ReminderUrgency {
  const diffMs = new Date(scheduledAt).getTime() - Date.now();
  if (diffMs < 60 * 60 * 1000) return "urgent";
  if (diffMs < 24 * 60 * 60 * 1000) return "soon";
  return "later";
}

export function getEffectiveScheduledAt(reminder: Reminder): string {
  return reminder.snoozedUntil ?? reminder.scheduledAt;
}

export interface InsightData {
  date: string;
  minutesStudied: number;
  tasksCompleted: number;
  score?: number;
}

export interface SubjectInsight {
  subject: string;
  color: SubjectColor;
  totalMinutes: number;
  tasksCompleted: number;
  avgScore: number;
}

export interface PlannerEntry {
  day: string;
  time: string;
  subject: string;
  activity: string;
}

export interface Planner {
  id: string;
  name: string;
  entries: PlannerEntry[];
  createdAt: string;
}
