import type { backendInterface } from "../backend";
import {
  ReminderStatus,
  SessionStatus,
  TaskStatus,
} from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const oneDay = BigInt(86_400_000_000_000);

export const mockBackend: backendInterface = {
  getAllTasks: async () => [
    {
      id: BigInt(1),
      title: "Chapter 5: Calculus Review",
      subject: "Mathematics",
      status: TaskStatus.inProgress,
      dueDate: now + oneDay,
      durationMinutes: BigInt(60),
      createdAt: now - oneDay,
    },
    {
      id: BigInt(2),
      title: "Essay: French Revolution Causes",
      subject: "History",
      status: TaskStatus.pending,
      dueDate: now + oneDay * BigInt(2),
      durationMinutes: BigInt(90),
      createdAt: now - oneDay,
    },
    {
      id: BigInt(3),
      title: "Physics Lab Report",
      subject: "Physics",
      status: TaskStatus.completed,
      dueDate: now - oneDay,
      durationMinutes: BigInt(45),
      createdAt: now - oneDay * BigInt(3),
    },
    {
      id: BigInt(4),
      title: "Vocabulary: Chapter 8",
      subject: "English Literature",
      status: TaskStatus.pending,
      dueDate: now + oneDay * BigInt(3),
      durationMinutes: BigInt(30),
      createdAt: now,
    },
  ],

  getTask: async (id) => ({
    id,
    title: "Chapter 5: Calculus Review",
    subject: "Mathematics",
    status: TaskStatus.inProgress,
    dueDate: now + oneDay,
    durationMinutes: BigInt(60),
    createdAt: now - oneDay,
  }),

  createTask: async (input) => ({
    id: BigInt(99),
    title: input.title,
    subject: input.subject,
    status: TaskStatus.pending,
    dueDate: input.dueDate,
    durationMinutes: input.durationMinutes,
    createdAt: now,
  }),

  updateTask: async () => true,
  deleteTask: async () => true,

  getStudyStats: async () => ({
    currentStreakDays: BigInt(7),
    totalStudyMinutes: BigInt(1230),
    totalCompletedTasks: BigInt(24),
  }),

  getDailyStudyData: async () => [
    { date: "2026-04-09", totalMinutes: BigInt(45) },
    { date: "2026-04-10", totalMinutes: BigInt(90) },
    { date: "2026-04-11", totalMinutes: BigInt(60) },
    { date: "2026-04-12", totalMinutes: BigInt(120) },
    { date: "2026-04-13", totalMinutes: BigInt(75) },
    { date: "2026-04-14", totalMinutes: BigInt(105) },
    { date: "2026-04-15", totalMinutes: BigInt(30) },
  ],

  getStudyTimeBySubject: async () => [
    { subject: "Mathematics", totalMinutes: BigInt(420) },
    { subject: "History", totalMinutes: BigInt(300) },
    { subject: "Physics", totalMinutes: BigInt(240) },
    { subject: "English Literature", totalMinutes: BigInt(180) },
    { subject: "Chemistry", totalMinutes: BigInt(90) },
  ],

  getActiveSessions: async () => [
    {
      id: BigInt(1),
      taskId: BigInt(1),
      startTime: now - BigInt(20) * BigInt(60_000_000_000),
      status: SessionStatus.active,
      totalElapsedSeconds: BigInt(1200),
    },
  ],

  startSession: async (taskId) => ({
    id: BigInt(10),
    taskId,
    startTime: now,
    status: SessionStatus.active,
    totalElapsedSeconds: BigInt(0),
  }),

  pauseSession: async () => true,
  resumeSession: async () => true,
  completeSession: async () => true,

  generateQuiz: async (taskId) => ({
    id: BigInt(1),
    taskId,
    subject: "Mathematics",
    createdAt: now,
    questions: [
      {
        id: BigInt(1),
        question: "What is the derivative of x²?",
        correctOptionId: BigInt(2),
        options: [
          { id: BigInt(1), text: "x" },
          { id: BigInt(2), text: "2x" },
          { id: BigInt(3), text: "x²" },
          { id: BigInt(4), text: "2" },
        ],
      },
      {
        id: BigInt(2),
        question: "What is the integral of 2x dx?",
        correctOptionId: BigInt(1),
        options: [
          { id: BigInt(1), text: "x² + C" },
          { id: BigInt(2), text: "2x² + C" },
          { id: BigInt(3), text: "x + C" },
          { id: BigInt(4), text: "2 + C" },
        ],
      },
      {
        id: BigInt(3),
        question: "What is the limit of sin(x)/x as x → 0?",
        correctOptionId: BigInt(3),
        options: [
          { id: BigInt(1), text: "0" },
          { id: BigInt(2), text: "∞" },
          { id: BigInt(3), text: "1" },
          { id: BigInt(4), text: "undefined" },
        ],
      },
    ],
  }),

  submitQuizAnswers: async () => ({
    quizId: BigInt(1),
    taskId: BigInt(1),
    subject: "Mathematics",
    score: BigInt(2),
    totalQuestions: BigInt(3),
    completedAt: now,
  }),

  getQuizHistory: async () => [
    {
      quizId: BigInt(1),
      taskId: BigInt(3),
      subject: "Physics",
      score: BigInt(4),
      totalQuestions: BigInt(5),
      completedAt: now - oneDay,
    },
    {
      quizId: BigInt(2),
      taskId: BigInt(2),
      subject: "History",
      score: BigInt(3),
      totalQuestions: BigInt(4),
      completedAt: now - oneDay * BigInt(2),
    },
  ],

  getUpcomingReminders: async () => [
    {
      id: BigInt(1),
      message: "Review Calculus notes before tomorrow's exam",
      scheduledTime: now + BigInt(2) * BigInt(3_600_000_000_000),
      status: ReminderStatus.pending,
      createdAt: now - oneDay,
      linkedTaskId: BigInt(1),
    },
    {
      id: BigInt(2),
      message: "Submit History essay draft",
      scheduledTime: now + oneDay,
      status: ReminderStatus.pending,
      createdAt: now,
      linkedTaskId: BigInt(2),
    },
    {
      id: BigInt(3),
      message: "Team study session — Physics Lab",
      scheduledTime: now + oneDay * BigInt(2),
      status: ReminderStatus.snoozed,
      snoozeUntil: now + BigInt(4) * BigInt(3_600_000_000_000),
      createdAt: now - oneDay,
    },
  ],

  createReminder: async (input) => ({
    id: BigInt(99),
    message: input.message,
    scheduledTime: input.scheduledTime,
    status: ReminderStatus.pending,
    createdAt: now,
    linkedTaskId: input.linkedTaskId,
  }),

  dismissReminder: async () => true,
  snoozeReminder: async () => true,
};
