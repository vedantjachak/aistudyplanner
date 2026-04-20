import List "mo:core/List";
import Types "types/study-planner";
import Lib "lib/study-planner";
import StudyPlannerApi "mixins/study-planner-api";

actor {
  let tasks = List.empty<Types.Task>();
  let sessions = List.empty<Types.StudySession>();
  let quizzes = List.empty<Types.Quiz>();
  let quizResults = List.empty<Types.QuizResult>();
  let reminders = List.empty<Types.Reminder>();

  let counters : Lib.Counters = {
    var nextTaskId = 0;
    var nextSessionId = 0;
    var nextQuizId = 0;
    var nextReminderId = 0;
  };

  include StudyPlannerApi(
    tasks,
    sessions,
    quizzes,
    quizResults,
    reminders,
    counters,
  );
};
