import Common "common";

module {
  // ── Task ──────────────────────────────────────────────────────────────────
  public type TaskStatus = { #pending; #inProgress; #completed };

  public type Task = {
    id : Common.TaskId;
    title : Text;
    subject : Text;
    durationMinutes : Nat;
    dueDate : Common.Timestamp;
    status : TaskStatus;
    createdAt : Common.Timestamp;
  };

  // ── Study Session ─────────────────────────────────────────────────────────
  public type SessionStatus = { #active; #paused; #completed };

  public type StudySession = {
    id : Common.SessionId;
    taskId : Common.TaskId;
    startTime : Common.Timestamp;
    endTime : ?Common.Timestamp;
    totalElapsedSeconds : Nat;
    status : SessionStatus;
    pausedAt : ?Common.Timestamp;
  };

  // ── Progress & Stats ──────────────────────────────────────────────────────
  public type StudyStats = {
    totalCompletedTasks : Nat;
    totalStudyMinutes : Nat;
    currentStreakDays : Nat;
  };

  public type SubjectTime = {
    subject : Text;
    totalMinutes : Nat;
  };

  public type DailyStudyData = {
    date : Text;   // "YYYY-MM-DD"
    totalMinutes : Nat;
  };

  // ── Quiz ──────────────────────────────────────────────────────────────────
  public type QuizOption = {
    id : Nat;
    text : Text;
  };

  public type QuizQuestion = {
    id : Nat;
    question : Text;
    options : [QuizOption];
    correctOptionId : Nat;
  };

  public type Quiz = {
    id : Common.QuizId;
    taskId : Common.TaskId;
    subject : Text;
    questions : [QuizQuestion];
    createdAt : Common.Timestamp;
  };

  public type QuizResult = {
    quizId : Common.QuizId;
    taskId : Common.TaskId;
    subject : Text;
    score : Nat;        // number of correct answers
    totalQuestions : Nat;
    completedAt : Common.Timestamp;
  };

  public type QuizAnswerSubmission = {
    quizId : Common.QuizId;
    answers : [(Nat, Nat)];  // (questionId, selectedOptionId)
  };

  // ── Reminders ─────────────────────────────────────────────────────────────
  public type ReminderStatus = { #pending; #dismissed; #snoozed };

  public type Reminder = {
    id : Common.ReminderId;
    message : Text;
    scheduledTime : Common.Timestamp;
    linkedTaskId : ?Common.TaskId;
    status : ReminderStatus;
    snoozeUntil : ?Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  // ── Input types (for API) ─────────────────────────────────────────────────
  public type CreateTaskInput = {
    title : Text;
    subject : Text;
    durationMinutes : Nat;
    dueDate : Common.Timestamp;
  };

  public type UpdateTaskInput = {
    id : Common.TaskId;
    title : ?Text;
    subject : ?Text;
    durationMinutes : ?Nat;
    dueDate : ?Common.Timestamp;
  };

  public type CreateReminderInput = {
    message : Text;
    scheduledTime : Common.Timestamp;
    linkedTaskId : ?Common.TaskId;
  };
};
