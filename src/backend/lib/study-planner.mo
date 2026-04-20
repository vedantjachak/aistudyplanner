import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Types "../types/study-planner";
import Common "../types/common";

module {

  // ── Internal state record for counters ────────────────────────────────────
  public type Counters = {
    var nextTaskId : Nat;
    var nextSessionId : Nat;
    var nextQuizId : Nat;
    var nextReminderId : Nat;
  };

  // ── Built-in quiz question bank ────────────────────────────────────────────
  // Maps lowercase subject keywords → list of questions
  let QUESTION_BANK : [(Text, [Types.QuizQuestion])] = [
    (
      "math",
      [
        {
          id = 1;
          question = "What is the derivative of x²?";
          options = [
            { id = 1; text = "x" },
            { id = 2; text = "2x" },
            { id = 3; text = "2" },
            { id = 4; text = "x²" },
          ];
          correctOptionId = 2;
        },
        {
          id = 2;
          question = "What is the integral of 2x dx?";
          options = [
            { id = 1; text = "x" },
            { id = 2; text = "x² + C" },
            { id = 3; text = "2x² + C" },
            { id = 4; text = "2 + C" },
          ];
          correctOptionId = 2;
        },
        {
          id = 3;
          question = "What is the value of π (pi) approximately?";
          options = [
            { id = 1; text = "2.718" },
            { id = 2; text = "3.14159" },
            { id = 3; text = "1.618" },
            { id = 4; text = "2.303" },
          ];
          correctOptionId = 2;
        },
        {
          id = 4;
          question = "What is log₁₀(100)?";
          options = [
            { id = 1; text = "1" },
            { id = 2; text = "10" },
            { id = 3; text = "2" },
            { id = 4; text = "100" },
          ];
          correctOptionId = 3;
        },
        {
          id = 5;
          question = "What is the quadratic formula result for x² - 5x + 6 = 0?";
          options = [
            { id = 1; text = "x = 1, x = 6" },
            { id = 2; text = "x = 2, x = 3" },
            { id = 3; text = "x = -2, x = -3" },
            { id = 4; text = "x = 5, x = 6" },
          ];
          correctOptionId = 2;
        },
      ],
    ),
    (
      "science",
      [
        {
          id = 1;
          question = "What is the speed of light in a vacuum?";
          options = [
            { id = 1; text = "3 × 10⁸ m/s" },
            { id = 2; text = "3 × 10⁶ m/s" },
            { id = 3; text = "3 × 10¹⁰ m/s" },
            { id = 4; text = "3 × 10¹² m/s" },
          ];
          correctOptionId = 1;
        },
        {
          id = 2;
          question = "What is the chemical formula for water?";
          options = [
            { id = 1; text = "CO₂" },
            { id = 2; text = "H₂O₂" },
            { id = 3; text = "H₂O" },
            { id = 4; text = "HO" },
          ];
          correctOptionId = 3;
        },
        {
          id = 3;
          question = "Newton's second law states that F = ?";
          options = [
            { id = 1; text = "m / a" },
            { id = 2; text = "m + a" },
            { id = 3; text = "m × v" },
            { id = 4; text = "m × a" },
          ];
          correctOptionId = 4;
        },
        {
          id = 4;
          question = "What is the atomic number of Carbon?";
          options = [
            { id = 1; text = "4" },
            { id = 2; text = "6" },
            { id = 3; text = "8" },
            { id = 4; text = "12" },
          ];
          correctOptionId = 2;
        },
        {
          id = 5;
          question = "What is the unit of electrical resistance?";
          options = [
            { id = 1; text = "Volt" },
            { id = 2; text = "Ampere" },
            { id = 3; text = "Ohm" },
            { id = 4; text = "Watt" },
          ];
          correctOptionId = 3;
        },
      ],
    ),
    (
      "history",
      [
        {
          id = 1;
          question = "In which year did World War II end?";
          options = [
            { id = 1; text = "1943" },
            { id = 2; text = "1944" },
            { id = 3; text = "1945" },
            { id = 4; text = "1946" },
          ];
          correctOptionId = 3;
        },
        {
          id = 2;
          question = "Who was the first President of the United States?";
          options = [
            { id = 1; text = "Abraham Lincoln" },
            { id = 2; text = "Thomas Jefferson" },
            { id = 3; text = "John Adams" },
            { id = 4; text = "George Washington" },
          ];
          correctOptionId = 4;
        },
        {
          id = 3;
          question = "The French Revolution began in which year?";
          options = [
            { id = 1; text = "1776" },
            { id = 2; text = "1789" },
            { id = 3; text = "1799" },
            { id = 4; text = "1804" },
          ];
          correctOptionId = 2;
        },
        {
          id = 4;
          question = "Which ancient wonder was located in Alexandria?";
          options = [
            { id = 1; text = "Colossus of Rhodes" },
            { id = 2; text = "Hanging Gardens" },
            { id = 3; text = "Lighthouse of Alexandria" },
            { id = 4; text = "Temple of Artemis" },
          ];
          correctOptionId = 3;
        },
        {
          id = 5;
          question = "Who wrote the Communist Manifesto?";
          options = [
            { id = 1; text = "Lenin and Stalin" },
            { id = 2; text = "Marx and Engels" },
            { id = 3; text = "Hegel and Kant" },
            { id = 4; text = "Rousseau and Voltaire" },
          ];
          correctOptionId = 2;
        },
      ],
    ),
    (
      "english",
      [
        {
          id = 1;
          question = "What literary device is 'the wind whispered secrets'?";
          options = [
            { id = 1; text = "Simile" },
            { id = 2; text = "Metaphor" },
            { id = 3; text = "Personification" },
            { id = 4; text = "Alliteration" },
          ];
          correctOptionId = 3;
        },
        {
          id = 2;
          question = "Which of these is a synonym for 'ephemeral'?";
          options = [
            { id = 1; text = "Permanent" },
            { id = 2; text = "Transient" },
            { id = 3; text = "Eternal" },
            { id = 4; text = "Solid" },
          ];
          correctOptionId = 2;
        },
        {
          id = 3;
          question = "Who wrote 'Pride and Prejudice'?";
          options = [
            { id = 1; text = "Charlotte Brontë" },
            { id = 2; text = "Emily Brontë" },
            { id = 3; text = "Jane Austen" },
            { id = 4; text = "Mary Shelley" },
          ];
          correctOptionId = 3;
        },
        {
          id = 4;
          question = "What is the past tense of 'bring'?";
          options = [
            { id = 1; text = "Bringed" },
            { id = 2; text = "Brung" },
            { id = 3; text = "Brought" },
            { id = 4; text = "Brang" },
          ];
          correctOptionId = 3;
        },
        {
          id = 5;
          question = "In grammar, what is the subject of: 'The dog chased the cat'?";
          options = [
            { id = 1; text = "Chased" },
            { id = 2; text = "Cat" },
            { id = 3; text = "The" },
            { id = 4; text = "Dog" },
          ];
          correctOptionId = 4;
        },
      ],
    ),
    (
      "computer",
      [
        {
          id = 1;
          question = "What does CPU stand for?";
          options = [
            { id = 1; text = "Central Processing Unit" },
            { id = 2; text = "Computer Power Unit" },
            { id = 3; text = "Central Program Utility" },
            { id = 4; text = "Core Processing Unit" },
          ];
          correctOptionId = 1;
        },
        {
          id = 2;
          question = "What is the binary representation of the decimal number 10?";
          options = [
            { id = 1; text = "1010" },
            { id = 2; text = "1100" },
            { id = 3; text = "1001" },
            { id = 4; text = "0110" },
          ];
          correctOptionId = 1;
        },
        {
          id = 3;
          question = "Which data structure uses LIFO (Last In First Out)?";
          options = [
            { id = 1; text = "Queue" },
            { id = 2; text = "Stack" },
            { id = 3; text = "Array" },
            { id = 4; text = "Linked List" },
          ];
          correctOptionId = 2;
        },
        {
          id = 4;
          question = "What does HTML stand for?";
          options = [
            { id = 1; text = "Hyper Transfer Markup Language" },
            { id = 2; text = "Hypertext Machine Language" },
            { id = 3; text = "HyperText Markup Language" },
            { id = 4; text = "High-level Text Meta Language" },
          ];
          correctOptionId = 3;
        },
        {
          id = 5;
          question = "What is Big O notation O(1) called?";
          options = [
            { id = 1; text = "Linear time" },
            { id = 2; text = "Quadratic time" },
            { id = 3; text = "Logarithmic time" },
            { id = 4; text = "Constant time" },
          ];
          correctOptionId = 4;
        },
      ],
    ),
    (
      "default",
      [
        {
          id = 1;
          question = "What is the primary benefit of spaced repetition in studying?";
          options = [
            { id = 1; text = "Faster reading speed" },
            { id = 2; text = "Improved long-term retention" },
            { id = 3; text = "Better note-taking" },
            { id = 4; text = "Increased focus duration" },
          ];
          correctOptionId = 2;
        },
        {
          id = 2;
          question = "The Pomodoro Technique uses work intervals of how many minutes?";
          options = [
            { id = 1; text = "15 minutes" },
            { id = 2; text = "20 minutes" },
            { id = 3; text = "25 minutes" },
            { id = 4; text = "30 minutes" },
          ];
          correctOptionId = 3;
        },
        {
          id = 3;
          question = "Which memory technique uses visual associations with locations?";
          options = [
            { id = 1; text = "Chunking" },
            { id = 2; text = "Method of Loci" },
            { id = 3; text = "Acronyms" },
            { id = 4; text = "Elaborative interrogation" },
          ];
          correctOptionId = 2;
        },
        {
          id = 4;
          question = "What does active recall involve?";
          options = [
            { id = 1; text = "Rereading notes passively" },
            { id = 2; text = "Highlighting text" },
            { id = 3; text = "Testing yourself on material" },
            { id = 4; text = "Summarising with AI" },
          ];
          correctOptionId = 3;
        },
        {
          id = 5;
          question = "How many hours of sleep are generally recommended for optimal learning?";
          options = [
            { id = 1; text = "5-6 hours" },
            { id = 2; text = "6-7 hours" },
            { id = 3; text = "7-9 hours" },
            { id = 4; text = "9-11 hours" },
          ];
          correctOptionId = 3;
        },
      ],
    ),
  ];

  // ── Date helpers ───────────────────────────────────────────────────────────

  // Convert nanosecond timestamp to "YYYY-MM-DD" string
  public func timestampToDateStr(ts : Common.Timestamp) : Text {
    // ts is in nanoseconds (Int), convert to seconds
    let secondsTotal : Int = ts / 1_000_000_000;
    // Days since epoch (Unix epoch = 1970-01-01)
    let daysSinceEpoch : Int = secondsTotal / 86400;

    // Gregorian calendar conversion
    let z : Int = daysSinceEpoch + 719468;
    let era : Int = if (z >= 0) z / 146097 else (z - 146096) / 146097;
    let doe : Int = z - era * 146097;
    let yoe : Int = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y : Int = yoe + era * 400;
    let doy : Int = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp : Int = (5 * doy + 2) / 153;
    let d : Int = doy - (153 * mp + 2) / 5 + 1;
    let m : Int = if (mp < 10) mp + 3 else mp - 9;
    let year : Int = if (m <= 2) y + 1 else y;

    let yText = year.toText();
    let mText = if (m < 10) "0" # m.toText() else m.toText();
    let dText = if (d < 10) "0" # d.toText() else d.toText();
    yText # "-" # mText # "-" # dText;
  };

  // ── Task helpers ──────────────────────────────────────────────────────────

  public func createTask(
    tasks : List.List<Types.Task>,
    counters : Counters,
    input : Types.CreateTaskInput,
  ) : Types.Task {
    let id = counters.nextTaskId;
    counters.nextTaskId += 1;
    let task : Types.Task = {
      id;
      title = input.title;
      subject = input.subject;
      durationMinutes = input.durationMinutes;
      dueDate = input.dueDate;
      status = #pending;
      createdAt = Time.now();
    };
    tasks.add(task);
    task;
  };

  public func updateTask(
    tasks : List.List<Types.Task>,
    input : Types.UpdateTaskInput,
  ) : Bool {
    var found = false;
    tasks.mapInPlace(func(t : Types.Task) : Types.Task {
      if (t.id == input.id) {
        found := true;
        {
          t with
          title = switch (input.title) { case (?v) v; case null t.title };
          subject = switch (input.subject) { case (?v) v; case null t.subject };
          durationMinutes = switch (input.durationMinutes) {
            case (?v) v;
            case null t.durationMinutes;
          };
          dueDate = switch (input.dueDate) { case (?v) v; case null t.dueDate };
        };
      } else t;
    });
    found;
  };

  public func deleteTask(
    tasks : List.List<Types.Task>,
    sessions : List.List<Types.StudySession>,
    quizResults : List.List<Types.QuizResult>,
    reminders : List.List<Types.Reminder>,
    id : Common.TaskId,
  ) : Bool {
    let sizeBefore = tasks.size();
    // Remove by rebuilding with filter
    let kept = tasks.filter(func(t : Types.Task) : Bool { t.id != id });
    tasks.clear();
    tasks.append(kept);
    let deleted = tasks.size() < sizeBefore;
    if (deleted) {
      // Clean up dependent data
      let keptSessions = sessions.filter(func(s : Types.StudySession) : Bool {
        s.taskId != id;
      });
      sessions.clear();
      sessions.append(keptSessions);

      let keptResults = quizResults.filter(func(r : Types.QuizResult) : Bool {
        r.taskId != id;
      });
      quizResults.clear();
      quizResults.append(keptResults);

      let keptReminders = reminders.filter(func(r : Types.Reminder) : Bool {
        switch (r.linkedTaskId) {
          case (?tid) tid != id;
          case null true;
        };
      });
      reminders.clear();
      reminders.append(keptReminders);
    };
    deleted;
  };

  public func getTask(
    tasks : List.List<Types.Task>,
    id : Common.TaskId,
  ) : ?Types.Task {
    tasks.find(func(t : Types.Task) : Bool { t.id == id });
  };

  // ── Session helpers ───────────────────────────────────────────────────────

  public func startSession(
    tasks : List.List<Types.Task>,
    sessions : List.List<Types.StudySession>,
    counters : Counters,
    taskId : Common.TaskId,
  ) : ?Types.StudySession {
    // Task must exist
    switch (tasks.find(func(t : Types.Task) : Bool { t.id == taskId })) {
      case null null;
      case (?_task) {
        // Mark task as inProgress
        tasks.mapInPlace(func(t : Types.Task) : Types.Task {
          if (t.id == taskId) { { t with status = #inProgress } } else t;
        });
        let id = counters.nextSessionId;
        counters.nextSessionId += 1;
        let session : Types.StudySession = {
          id;
          taskId;
          startTime = Time.now();
          endTime = null;
          totalElapsedSeconds = 0;
          status = #active;
          pausedAt = null;
        };
        sessions.add(session);
        ?session;
      };
    };
  };

  public func pauseSession(
    sessions : List.List<Types.StudySession>,
    sessionId : Common.SessionId,
  ) : Bool {
    var found = false;
    let now = Time.now();
    sessions.mapInPlace(func(s : Types.StudySession) : Types.StudySession {
      if (s.id == sessionId and s.status == #active) {
        found := true;
        { s with status = #paused; pausedAt = ?now };
      } else s;
    });
    found;
  };

  public func resumeSession(
    sessions : List.List<Types.StudySession>,
    sessionId : Common.SessionId,
  ) : Bool {
    var found = false;
    sessions.mapInPlace(func(s : Types.StudySession) : Types.StudySession {
      if (s.id == sessionId and s.status == #paused) {
        found := true;
        // Resume: clear pausedAt, set status back to active
        // Paused time is not counted toward elapsed
        { s with status = #active; pausedAt = null };
      } else s;
    });
    found;
  };

  public func completeSession(
    tasks : List.List<Types.Task>,
    sessions : List.List<Types.StudySession>,
    sessionId : Common.SessionId,
  ) : Bool {
    var found = false;
    let now = Time.now();
    sessions.mapInPlace(func(s : Types.StudySession) : Types.StudySession {
      if (s.id == sessionId and (s.status == #active or s.status == #paused)) {
        found := true;
        // Compute total elapsed seconds (only active time)
        let activeElapsed : Nat = switch (s.status) {
          case (#active) {
            let diff = now - s.startTime;
            if (diff > 0) Int.abs(diff) / 1_000_000_000 else 0;
          };
          case (_) s.totalElapsedSeconds;
        };
        // Mark the associated task as completed
        tasks.mapInPlace(func(t : Types.Task) : Types.Task {
          if (t.id == s.taskId) { { t with status = #completed } } else t;
        });
        {
          s with
          status = #completed;
          endTime = ?now;
          totalElapsedSeconds = activeElapsed;
          pausedAt = null;
        };
      } else s;
    });
    found;
  };

  public func getActiveSessions(
    sessions : List.List<Types.StudySession>,
  ) : [Types.StudySession] {
    sessions.filter(func(s : Types.StudySession) : Bool {
      s.status == #active or s.status == #paused;
    }).toArray();
  };

  // ── Progress helpers ──────────────────────────────────────────────────────

  public func getStats(
    tasks : List.List<Types.Task>,
    sessions : List.List<Types.StudySession>,
  ) : Types.StudyStats {
    let completedTasks = tasks.filter(func(t : Types.Task) : Bool {
      t.status == #completed;
    });
    let totalCompletedTasks = completedTasks.size();

    // Total study minutes from completed sessions
    let totalStudySeconds = sessions.foldLeft(
      0 : Nat,
      func(acc : Nat, s : Types.StudySession) : Nat {
        if (s.status == #completed) {
          acc + s.totalElapsedSeconds;
        } else acc;
      },
    );
    let totalStudyMinutes = totalStudySeconds / 60;

    // Streak: count consecutive days with at least one completed session up to today
    let streakDays = computeStreak(sessions);

    {
      totalCompletedTasks;
      totalStudyMinutes;
      currentStreakDays = streakDays;
    };
  };

  // Compute streak days from completed sessions
  func computeStreak(sessions : List.List<Types.StudySession>) : Nat {
    let now = Time.now();

    // Collect all unique dates with completed sessions
    let dateSet = Map.empty<Text, Bool>();
    sessions.forEach(func(s : Types.StudySession) {
      if (s.status == #completed) {
        let d = timestampToDateStr(s.startTime);
        dateSet.add(d, true);
      };
    });

    // Walk backwards from today counting consecutive days
    var streak = 0;
    var dayOffset : Int = 0;
    let nsPerDay : Int = 86_400_000_000_000;
    var continuing = true;
    while (continuing) {
      let checkTs = now - dayOffset * nsPerDay;
      let dateStr = timestampToDateStr(checkTs);
      switch (dateSet.get(dateStr)) {
        case (?_) {
          streak += 1;
          dayOffset += 1;
        };
        case null {
          continuing := false;
        };
      };
    };
    streak;
  };

  public func getStudyTimeBySubject(
    tasks : List.List<Types.Task>,
    sessions : List.List<Types.StudySession>,
  ) : [Types.SubjectTime] {
    let subjectMap = Map.empty<Text, Nat>();
    // For each completed session, look up task subject and accumulate time
    sessions.forEach(func(s : Types.StudySession) {
      if (s.status == #completed) {
        switch (tasks.find(func(t : Types.Task) : Bool { t.id == s.taskId })) {
          case (?task) {
            let existing = switch (subjectMap.get(task.subject)) {
              case (?v) v;
              case null 0;
            };
            subjectMap.add(task.subject, existing + s.totalElapsedSeconds / 60);
          };
          case null {};
        };
      };
    });
    let entries = subjectMap.toArray();
    entries.map<(Text, Nat), Types.SubjectTime>(func((subject, totalMinutes)) {
      { subject; totalMinutes };
    });
  };

  public func getDailyStudyData(
    sessions : List.List<Types.StudySession>,
    _tasks : List.List<Types.Task>,
    days : Nat,
  ) : [Types.DailyStudyData] {
    let now = Time.now();
    let nsPerDay : Int = 86_400_000_000_000;
    let dailyMap = Map.empty<Text, Nat>();

    // Initialize all requested days with 0
    var i = 0;
    while (i < days) {
      let offset : Int = Int.fromNat(days - 1 - i);
      let dayTs = now - offset * nsPerDay;
      let dateStr = timestampToDateStr(dayTs);
      dailyMap.add(dateStr, 0);
      i += 1;
    };

    // Accumulate completed session times per day
    sessions.forEach(func(s : Types.StudySession) {
      if (s.status == #completed) {
        let dateStr = timestampToDateStr(s.startTime);
        switch (dailyMap.get(dateStr)) {
          case (?existing) {
            dailyMap.add(dateStr, existing + s.totalElapsedSeconds / 60);
          };
          case null {}; // Not in the requested range
        };
      };
    });

    // Convert to sorted array (sorted by date string which sorts chronologically)
    let entries = dailyMap.toArray();
    let sorted = entries.sort(func(a : (Text, Nat), b : (Text, Nat)) : { #less; #equal; #greater } {
      Text.compare(a.0, b.0);
    });
    sorted.map<(Text, Nat), Types.DailyStudyData>(func((date, totalMinutes)) {
      { date; totalMinutes };
    });
  };

  // ── Quiz helpers ──────────────────────────────────────────────────────────

  // Find questions for a subject by matching keywords
  func getQuestionsForSubject(subject : Text) : [Types.QuizQuestion] {
    let lowerSubject = subject.toLower();
    let bankList = List.fromArray<(Text, [Types.QuizQuestion])>(QUESTION_BANK);
    switch (
      bankList.find(func((key, _) : (Text, [Types.QuizQuestion])) : Bool {
        lowerSubject.contains(#text key);
      })
    ) {
      case (?(_, questions)) questions;
      case null {
        // Fall back to default
        switch (
          bankList.find(func((key, _) : (Text, [Types.QuizQuestion])) : Bool {
            key == "default";
          })
        ) {
          case (?(_, questions)) questions;
          case null [];
        };
      };
    };
  };

  public func generateQuiz(
    tasks : List.List<Types.Task>,
    quizzes : List.List<Types.Quiz>,
    counters : Counters,
    taskId : Common.TaskId,
  ) : ?Types.Quiz {
    switch (tasks.find(func(t : Types.Task) : Bool { t.id == taskId })) {
      case null null;
      case (?task) {
        let questions = getQuestionsForSubject(task.subject);
        if (questions.size() == 0) null
        else {
          let id = counters.nextQuizId;
          counters.nextQuizId += 1;
          let quiz : Types.Quiz = {
            id;
            taskId;
            subject = task.subject;
            questions;
            createdAt = Time.now();
          };
          quizzes.add(quiz);
          ?quiz;
        };
      };
    };
  };

  public func submitQuizAnswers(
    quizzes : List.List<Types.Quiz>,
    quizResults : List.List<Types.QuizResult>,
    submission : Types.QuizAnswerSubmission,
  ) : ?Types.QuizResult {
    switch (quizzes.find(func(q : Types.Quiz) : Bool { q.id == submission.quizId })) {
      case null null;
      case (?quiz) {
        // Grade each answer
        var correctCount = 0;
        for ((questionId, selectedOptionId) in submission.answers.values()) {
          switch (quiz.questions.find(func(q : Types.QuizQuestion) : Bool { q.id == questionId })) {
            case (?question) {
              if (question.correctOptionId == selectedOptionId) {
                correctCount += 1;
              };
            };
            case null {};
          };
        };
        let result : Types.QuizResult = {
          quizId = submission.quizId;
          taskId = quiz.taskId;
          subject = quiz.subject;
          score = correctCount;
          totalQuestions = quiz.questions.size();
          completedAt = Time.now();
        };
        quizResults.add(result);
        ?result;
      };
    };
  };

  // ── Reminder helpers ──────────────────────────────────────────────────────

  public func createReminder(
    reminders : List.List<Types.Reminder>,
    counters : Counters,
    input : Types.CreateReminderInput,
  ) : Types.Reminder {
    let id = counters.nextReminderId;
    counters.nextReminderId += 1;
    let reminder : Types.Reminder = {
      id;
      message = input.message;
      scheduledTime = input.scheduledTime;
      linkedTaskId = input.linkedTaskId;
      status = #pending;
      snoozeUntil = null;
      createdAt = Time.now();
    };
    reminders.add(reminder);
    reminder;
  };

  public func dismissReminder(
    reminders : List.List<Types.Reminder>,
    id : Common.ReminderId,
  ) : Bool {
    var found = false;
    reminders.mapInPlace(func(r : Types.Reminder) : Types.Reminder {
      if (r.id == id and (r.status == #pending or r.status == #snoozed)) {
        found := true;
        { r with status = #dismissed };
      } else r;
    });
    found;
  };

  public func snoozeReminder(
    reminders : List.List<Types.Reminder>,
    id : Common.ReminderId,
    snoozeUntil : Common.Timestamp,
  ) : Bool {
    var found = false;
    reminders.mapInPlace(func(r : Types.Reminder) : Types.Reminder {
      if (r.id == id and (r.status == #pending or r.status == #snoozed)) {
        found := true;
        { r with status = #snoozed; snoozeUntil = ?snoozeUntil };
      } else r;
    });
    found;
  };
};
