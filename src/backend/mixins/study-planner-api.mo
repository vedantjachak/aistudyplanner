import List "mo:core/List";
import Lib "../lib/study-planner";
import Types "../types/study-planner";
import Common "../types/common";

mixin (
  tasks : List.List<Types.Task>,
  sessions : List.List<Types.StudySession>,
  quizzes : List.List<Types.Quiz>,
  quizResults : List.List<Types.QuizResult>,
  reminders : List.List<Types.Reminder>,
  counters : Lib.Counters,
) {

  // ── Task Management ───────────────────────────────────────────────────────

  public shared func createTask(input : Types.CreateTaskInput) : async Types.Task {
    Lib.createTask(tasks, counters, input);
  };

  public shared func updateTask(input : Types.UpdateTaskInput) : async Bool {
    Lib.updateTask(tasks, input);
  };

  public shared func deleteTask(id : Common.TaskId) : async Bool {
    Lib.deleteTask(tasks, sessions, quizResults, reminders, id);
  };

  public query func getTask(id : Common.TaskId) : async ?Types.Task {
    Lib.getTask(tasks, id);
  };

  public query func getAllTasks() : async [Types.Task] {
    tasks.toArray();
  };

  // ── Study Session Management ──────────────────────────────────────────────

  public shared func startSession(taskId : Common.TaskId) : async ?Types.StudySession {
    Lib.startSession(tasks, sessions, counters, taskId);
  };

  public shared func pauseSession(sessionId : Common.SessionId) : async Bool {
    Lib.pauseSession(sessions, sessionId);
  };

  public shared func resumeSession(sessionId : Common.SessionId) : async Bool {
    Lib.resumeSession(sessions, sessionId);
  };

  public shared func completeSession(sessionId : Common.SessionId) : async Bool {
    Lib.completeSession(tasks, sessions, sessionId);
  };

  public query func getActiveSessions() : async [Types.StudySession] {
    Lib.getActiveSessions(sessions);
  };

  // ── Progress & Productivity Tracking ──────────────────────────────────────

  public query func getStudyStats() : async Types.StudyStats {
    Lib.getStats(tasks, sessions);
  };

  public query func getStudyTimeBySubject() : async [Types.SubjectTime] {
    Lib.getStudyTimeBySubject(tasks, sessions);
  };

  public query func getDailyStudyData(days : Nat) : async [Types.DailyStudyData] {
    Lib.getDailyStudyData(sessions, tasks, days);
  };

  // ── AI Quiz System ────────────────────────────────────────────────────────

  public shared func generateQuiz(taskId : Common.TaskId) : async ?Types.Quiz {
    Lib.generateQuiz(tasks, quizzes, counters, taskId);
  };

  public shared func submitQuizAnswers(submission : Types.QuizAnswerSubmission) : async ?Types.QuizResult {
    Lib.submitQuizAnswers(quizzes, quizResults, submission);
  };

  public query func getQuizHistory() : async [Types.QuizResult] {
    quizResults.toArray();
  };

  // ── Reminders ─────────────────────────────────────────────────────────────

  public shared func createReminder(input : Types.CreateReminderInput) : async Types.Reminder {
    Lib.createReminder(reminders, counters, input);
  };

  public query func getUpcomingReminders() : async [Types.Reminder] {
    reminders.toArray();
  };

  public shared func dismissReminder(id : Common.ReminderId) : async Bool {
    Lib.dismissReminder(reminders, id);
  };

  public shared func snoozeReminder(id : Common.ReminderId, snoozeUntil : Common.Timestamp) : async Bool {
    Lib.snoozeReminder(reminders, id, snoozeUntil);
  };
};
