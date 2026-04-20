import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface SubjectTime {
    subject: string;
    totalMinutes: bigint;
}
export type ReminderId = bigint;
export interface DailyStudyData {
    date: string;
    totalMinutes: bigint;
}
export interface QuizQuestion {
    id: bigint;
    correctOptionId: bigint;
    question: string;
    options: Array<QuizOption>;
}
export interface CreateTaskInput {
    title: string;
    subject: string;
    dueDate: Timestamp;
    durationMinutes: bigint;
}
export interface Task {
    id: TaskId;
    status: TaskStatus;
    title: string;
    subject: string;
    createdAt: Timestamp;
    dueDate: Timestamp;
    durationMinutes: bigint;
}
export interface Quiz {
    id: QuizId;
    subject: string;
    createdAt: Timestamp;
    taskId: TaskId;
    questions: Array<QuizQuestion>;
}
export type SessionId = bigint;
export interface QuizResult {
    completedAt: Timestamp;
    subject: string;
    score: bigint;
    taskId: TaskId;
    totalQuestions: bigint;
    quizId: QuizId;
}
export interface StudyStats {
    currentStreakDays: bigint;
    totalStudyMinutes: bigint;
    totalCompletedTasks: bigint;
}
export interface Reminder {
    id: ReminderId;
    status: ReminderStatus;
    snoozeUntil?: Timestamp;
    scheduledTime: Timestamp;
    createdAt: Timestamp;
    message: string;
    linkedTaskId?: TaskId;
}
export type TaskId = bigint;
export interface StudySession {
    id: SessionId;
    startTime: Timestamp;
    status: SessionStatus;
    pausedAt?: Timestamp;
    endTime?: Timestamp;
    totalElapsedSeconds: bigint;
    taskId: TaskId;
}
export interface QuizOption {
    id: bigint;
    text: string;
}
export interface CreateReminderInput {
    scheduledTime: Timestamp;
    message: string;
    linkedTaskId?: TaskId;
}
export interface UpdateTaskInput {
    id: TaskId;
    title?: string;
    subject?: string;
    dueDate?: Timestamp;
    durationMinutes?: bigint;
}
export interface QuizAnswerSubmission {
    answers: Array<[bigint, bigint]>;
    quizId: QuizId;
}
export type QuizId = bigint;
export enum ReminderStatus {
    pending = "pending",
    snoozed = "snoozed",
    dismissed = "dismissed"
}
export enum SessionStatus {
    active = "active",
    completed = "completed",
    paused = "paused"
}
export enum TaskStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export interface backendInterface {
    completeSession(sessionId: SessionId): Promise<boolean>;
    createReminder(input: CreateReminderInput): Promise<Reminder>;
    createTask(input: CreateTaskInput): Promise<Task>;
    deleteTask(id: TaskId): Promise<boolean>;
    dismissReminder(id: ReminderId): Promise<boolean>;
    generateQuiz(taskId: TaskId): Promise<Quiz | null>;
    getActiveSessions(): Promise<Array<StudySession>>;
    getAllTasks(): Promise<Array<Task>>;
    getDailyStudyData(days: bigint): Promise<Array<DailyStudyData>>;
    getQuizHistory(): Promise<Array<QuizResult>>;
    getStudyStats(): Promise<StudyStats>;
    getStudyTimeBySubject(): Promise<Array<SubjectTime>>;
    getTask(id: TaskId): Promise<Task | null>;
    getUpcomingReminders(): Promise<Array<Reminder>>;
    pauseSession(sessionId: SessionId): Promise<boolean>;
    resumeSession(sessionId: SessionId): Promise<boolean>;
    snoozeReminder(id: ReminderId, snoozeUntil: Timestamp): Promise<boolean>;
    startSession(taskId: TaskId): Promise<StudySession | null>;
    submitQuizAnswers(submission: QuizAnswerSubmission): Promise<QuizResult | null>;
    updateTask(input: UpdateTaskInput): Promise<boolean>;
}
