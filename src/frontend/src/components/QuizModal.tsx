import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Brain,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useStudyStore } from "../store/useStudyStore";
import type { QuizResult } from "../types";

// ─── Score ring visual ────────────────────────────────────────────────────────

function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? score / total : 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dash = pct * circumference;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg
        className="w-full h-full -rotate-90"
        viewBox="0 0 96 96"
        aria-label={`Score: ${score} out of ${total}`}
        role="img"
      >
        <title>
          Quiz score: {score}/{total}
        </title>
        <circle
          cx="48"
          cy="48"
          r={radius}
          strokeWidth="6"
          className="stroke-muted fill-none"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          strokeWidth="6"
          fill="none"
          stroke="url(#scoreGrad)"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.72 0.19 270)" />
            <stop offset="100%" stopColor="oklch(0.68 0.16 180)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-display font-bold text-foreground leading-none">
          {score}
        </span>
        <span className="text-[10px] text-muted-foreground">/{total}</span>
      </div>
    </div>
  );
}

// ─── AI Loading Screen ────────────────────────────────────────────────────────

function AILoadingScreen({ subject }: { subject: string }) {
  const { quizState } = useStudyStore();
  const { streamingText } = quizState;

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = mins > 0
    ? `${mins}:${String(secs).padStart(2, "0")}`
    : `${String(secs).padStart(2, "0")}s`;

  const tokenCount = streamingText.length;
  // Rough progress estimate — JSON quiz is usually ~400-600 chars
  const estimatedTotal = 500;
  const streamProgress = Math.min(Math.round((tokenCount / estimatedTotal) * 100), 95);

  const isStreaming = tokenCount > 0;

  // Show only the last few lines of streamed text
  const displayLines = streamingText
    .split("\n")
    .filter(Boolean)
    .slice(-4);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-5 py-4"
    >
      {/* Header row: brain + timer */}
      <div className="flex items-center gap-4 w-full">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-accent flex-shrink-0"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-end justify-between mb-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {isStreaming ? "Streaming tokens…" : "Connecting to AI…"}
            </p>
            <span className="text-xl font-mono font-bold text-foreground tabular-nums">
              {timeStr}
            </span>
          </div>
          {/* Progress bar — actual token-based when streaming, shimmer otherwise */}
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            {isStreaming ? (
              <motion.div
                className="h-full bg-gradient-primary rounded-full"
                animate={{ width: `${streamProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            ) : (
              <motion.div
                className="h-full w-1/3 bg-gradient-primary rounded-full"
                animate={{ x: ["0%", "300%", "0%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Subject badge */}
      <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
        <span className="text-xs font-medium text-primary">{subject}</span>
      </div>

      {/* Terminal output panel */}
      <div className="w-full rounded-xl border border-border bg-black/40 backdrop-blur-sm overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-muted/20">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-chart-4/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-chart-3/70" />
          <span className="ml-2 text-[10px] text-muted-foreground font-mono">
            ollama · llama2 · stream
          </span>
          <span className="ml-auto text-[10px] font-mono text-muted-foreground tabular-nums">
            {tokenCount > 0 ? `${tokenCount} chars` : "waiting…"}
          </span>
        </div>

        {/* Streamed text */}
        <div className="p-3 min-h-[80px] max-h-[120px] overflow-hidden font-mono text-xs leading-relaxed">
          {!isStreaming ? (
            <span className="text-muted-foreground animate-pulse">▋</span>
          ) : (
            <AnimatePresence initial={false}>
              {displayLines.map((line, i) => (
                <motion.p
                  key={`${i}-${line.slice(0, 10)}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "break-all",
                    i === displayLines.length - 1
                      ? "text-green-400"
                      : "text-green-400/50",
                  )}
                >
                  {line}
                </motion.p>
              ))}
              <motion.span
                key="cursor"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block text-green-400"
              >
                ▋
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        AI is crafting personalized questions for <strong className="text-foreground">{subject}</strong>…
      </p>
    </motion.div>
  );
}

// ─── Answer option button ─────────────────────────────────────────────────────

interface AnswerOptionProps {
  label: string;
  index: number;
  selected: boolean;
  revealed: boolean;
  isCorrect: boolean;
  onClick: () => void;
  disabled: boolean;
}

function AnswerOption({
  label,
  index,
  selected,
  revealed,
  isCorrect,
  onClick,
  disabled,
}: AnswerOptionProps) {
  const letter = String.fromCharCode(65 + index);

  const baseClass =
    "w-full text-left px-4 py-3 rounded-xl border text-sm transition-smooth flex items-center gap-3 group";

  let stateClass =
    "border-border bg-muted/30 hover:bg-primary/8 hover:border-primary/40 hover:text-primary";
  if (revealed && isCorrect)
    stateClass = "border-chart-3/60 bg-chart-3/12 text-chart-3";
  else if (revealed && selected && !isCorrect)
    stateClass = "border-destructive/60 bg-destructive/12 text-destructive";
  else if (selected)
    stateClass = "border-primary/60 bg-primary/12 text-primary";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.98 }}
      whileHover={disabled ? {} : { x: 3 }}
      className={cn(
        baseClass,
        stateClass,
        disabled && !revealed && "cursor-not-allowed",
      )}
      data-ocid={`quiz.answer.${index + 1}`}
    >
      <span
        className={cn(
          "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 transition-smooth",
          "bg-muted text-muted-foreground",
          revealed && isCorrect && "bg-chart-3/20 text-chart-3",
          revealed &&
            selected &&
            !isCorrect &&
            "bg-destructive/20 text-destructive",
          selected && !revealed && "bg-primary/20 text-primary",
        )}
      >
        {letter}
      </span>
      <span className="flex-1 min-w-0">{label}</span>
      <AnimatePresence>
        {revealed && isCorrect && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <CheckCircle2 className="w-4 h-4 text-chart-3 flex-shrink-0" />
          </motion.div>
        )}
        {revealed && selected && !isCorrect && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function QuizModal() {
  const { quizState, answerQuestion, closeQuiz, addQuizResult } =
    useStudyStore();
  const { activeQuiz, currentQuestion, selectedAnswers, isCompleted, isLoading } =
    quizState;

  const [pendingAnswer, setPendingAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const prevAnswerCount = useRef(selectedAnswers.length);

  useEffect(() => {
    if (selectedAnswers.length !== prevAnswerCount.current) {
      prevAnswerCount.current = selectedAnswers.length;
      setPendingAnswer(null);
      setRevealed(false);
    }
  });

  if (!activeQuiz) return null;

  const question = isLoading ? null : activeQuiz.questions[currentQuestion];
  const progress = isLoading
    ? 0
    : (selectedAnswers.length / activeQuiz.questions.length) * 100;

  const score = isCompleted
    ? selectedAnswers.filter(
        (ans, i) => ans === activeQuiz.questions[i].correctIndex,
      ).length
    : 0;

  const pct = isCompleted
    ? Math.round((score / activeQuiz.questions.length) * 100)
    : 0;
  const isGreat = pct === 100;
  const isGood = pct >= 60;

  function handleSelectAnswer(idx: number) {
    if (revealed || pendingAnswer !== null) return;
    setPendingAnswer(idx);
    setRevealed(true);
  }

  function handleNext() {
    if (pendingAnswer === null) return;
    answerQuestion(pendingAnswer);
  }

  function handleFinish() {
    const result: QuizResult = {
      id: crypto.randomUUID(),
      quizId: activeQuiz!.id,
      score,
      total: activeQuiz!.questions.length,
      completedAt: new Date().toISOString(),
      answers: selectedAnswers,
    };
    addQuizResult(result);
    closeQuiz();
  }

  return (
    <Dialog open={!!activeQuiz} onOpenChange={() => closeQuiz()}>
      <DialogContent
        className="max-w-lg border-border bg-card overflow-hidden"
        data-ocid="quiz.dialog"
      >
        {/* Decorative gradient glow behind header */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-primary opacity-5 pointer-events-none" />

        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2.5 font-display">
            <motion.div
              className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-accent"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut",
              }}
            >
              <Brain className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <span className="text-foreground">AI Quiz</span>
              <span className="text-muted-foreground font-normal">
                {" "}
                — {activeQuiz.subject}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative space-y-5">

          {/* Loading or Quiz content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <AILoadingScreen key="loading" subject={activeQuiz.subject} />
            ) : (
              <motion.div
                key="quiz-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-primary" />
                      {isCompleted
                        ? "Completed!"
                        : `Question ${selectedAnswers.length + 1} of ${activeQuiz.questions.length}`}
                    </span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-primary rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Question / Results panel */}
                <AnimatePresence mode="wait">
                  {!isCompleted && question ? (
                    <motion.div
                      key={`q-${currentQuestion}`}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="space-y-4"
                    >
                      <p className="text-sm font-medium text-foreground leading-relaxed bg-muted/30 rounded-xl px-4 py-3 border border-border/50">
                        {question.question}
                      </p>

                      <div className="space-y-2.5">
                        {question.options.map((option, i) => (
                          <AnswerOption
                            key={option}
                            label={option}
                            index={i}
                            selected={pendingAnswer === i}
                            revealed={revealed}
                            isCorrect={i === question.correctIndex}
                            onClick={() => handleSelectAnswer(i)}
                            disabled={revealed}
                          />
                        ))}
                      </div>

                      <AnimatePresence>
                        {revealed && pendingAnswer !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-between"
                          >
                            <p
                              className={cn(
                                "text-sm font-medium",
                                pendingAnswer === question.correctIndex
                                  ? "text-chart-3"
                                  : "text-destructive",
                              )}
                            >
                              {pendingAnswer === question.correctIndex
                                ? "✓ Correct!"
                                : `✗ The answer was: ${question.options[question.correctIndex]}`}
                            </p>
                            <Button
                              className="bg-gradient-primary text-white hover:opacity-90 h-8 text-sm"
                              onClick={handleNext}
                              data-ocid="quiz.next_button"
                            >
                              {selectedAnswers.length + 1 ===
                              activeQuiz.questions.length
                                ? "See Results"
                                : "Next →"}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    /* Results screen */
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-5"
                    >
                      {/* Score visual */}
                      <div className="text-center space-y-3 py-2">
                        <ScoreRing
                          score={score}
                          total={activeQuiz.questions.length}
                        />
                        <div>
                          <motion.p
                            className="text-lg font-display font-bold text-foreground"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            {isGreat
                              ? "Perfect Score! 🏆"
                              : isGood
                                ? "Great Work! 🎉"
                                : "Keep Studying! 💪"}
                          </motion.p>
                          <motion.p
                            className="text-sm text-muted-foreground mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            {isGreat
                              ? "You aced every question — outstanding recall!"
                              : isGood
                                ? "Solid performance. Review missed items to reinforce."
                                : "Don't worry — revisit the material and try again soon."}
                          </motion.p>
                        </div>
                      </div>

                      {/* Breakdown */}
                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                        {activeQuiz.questions.map((q, i) => {
                          const isCorrect = selectedAnswers[i] === q.correctIndex;
                          return (
                            <motion.div
                              key={q.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.08 }}
                              className={cn(
                                "flex items-start gap-2.5 p-3 rounded-xl text-xs border",
                                isCorrect
                                  ? "bg-chart-3/8 border-chart-3/20"
                                  : "bg-destructive/8 border-destructive/20",
                              )}
                            >
                              {isCorrect ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-chart-3 flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-foreground font-medium line-clamp-1">
                                  {q.question}
                                </p>
                                {!isCorrect && (
                                  <p className="text-chart-3 mt-0.5">
                                    Correct: {q.options[q.correctIndex]}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 border-border"
                          onClick={closeQuiz}
                          data-ocid="quiz.close_button"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Skip for now
                        </Button>
                        <Button
                          className="flex-2 flex-1 bg-gradient-primary text-white hover:opacity-90 shadow-accent gap-1.5"
                          onClick={handleFinish}
                          data-ocid="quiz.finish_button"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Done — Back to Tasks
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
