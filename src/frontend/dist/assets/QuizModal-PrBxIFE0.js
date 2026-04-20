import { e as createLucideIcon, h as useStudyStore, r as reactExports, k as jsxRuntimeExports, l as motion, Z as Zap, q as cn, B as Button } from "./index-CviB1n4S.js";
import { D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle } from "./dialog-BlnJS6wj.js";
import { B as Brain } from "./brain-X8ClrNe6.js";
import { A as AnimatePresence } from "./badge-D8m6OhXH.js";
import { S as Sparkles } from "./sparkles-DyJQeLW4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
function ScoreRing({ score, total }) {
  const pct = total > 0 ? score / total : 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dash = pct * circumference;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-24 h-24 mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        className: "w-full h-full -rotate-90",
        viewBox: "0 0 96 96",
        "aria-label": `Score: ${score} out of ${total}`,
        role: "img",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
            "Quiz score: ",
            score,
            "/",
            total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "48",
              cy: "48",
              r: radius,
              strokeWidth: "6",
              className: "stroke-muted fill-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.circle,
            {
              cx: "48",
              cy: "48",
              r: radius,
              strokeWidth: "6",
              fill: "none",
              stroke: "url(#scoreGrad)",
              strokeLinecap: "round",
              strokeDasharray: circumference,
              initial: { strokeDashoffset: circumference },
              animate: { strokeDashoffset: circumference - dash },
              transition: { duration: 1, delay: 0.3, ease: "easeOut" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "scoreGrad", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.72 0.19 270)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.68 0.16 180)" })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-display font-bold text-foreground leading-none", children: score }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
        "/",
        total
      ] })
    ] })
  ] });
}
function AnswerOption({
  label,
  index,
  selected,
  revealed,
  isCorrect,
  onClick,
  disabled
}) {
  const letter = String.fromCharCode(65 + index);
  const baseClass = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-smooth flex items-center gap-3 group";
  let stateClass = "border-border bg-muted/30 hover:bg-primary/8 hover:border-primary/40 hover:text-primary";
  if (revealed && isCorrect)
    stateClass = "border-chart-3/60 bg-chart-3/12 text-chart-3";
  else if (revealed && selected && !isCorrect)
    stateClass = "border-destructive/60 bg-destructive/12 text-destructive";
  else if (selected)
    stateClass = "border-primary/60 bg-primary/12 text-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      onClick,
      disabled,
      whileTap: disabled ? {} : { scale: 0.98 },
      whileHover: disabled ? {} : { x: 3 },
      className: cn(
        baseClass,
        stateClass,
        disabled && !revealed && "cursor-not-allowed"
      ),
      "data-ocid": `quiz.answer.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 transition-smooth",
              "bg-muted text-muted-foreground",
              revealed && isCorrect && "bg-chart-3/20 text-chart-3",
              revealed && selected && !isCorrect && "bg-destructive/20 text-destructive",
              selected && !revealed && "bg-primary/20 text-primary"
            ),
            children: letter
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 min-w-0", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
          revealed && isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0 },
              animate: { scale: 1 },
              exit: { scale: 0 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-chart-3 flex-shrink-0" })
            }
          ),
          revealed && selected && !isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0 },
              animate: { scale: 1 },
              exit: { scale: 0 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive flex-shrink-0" })
            }
          )
        ] })
      ]
    }
  );
}
function QuizModal() {
  const { quizState, answerQuestion, closeQuiz, addQuizResult } = useStudyStore();
  const { activeQuiz, currentQuestion, selectedAnswers, isCompleted } = quizState;
  const [pendingAnswer, setPendingAnswer] = reactExports.useState(null);
  const [revealed, setRevealed] = reactExports.useState(false);
  const prevAnswerCount = reactExports.useRef(selectedAnswers.length);
  reactExports.useEffect(() => {
    if (selectedAnswers.length !== prevAnswerCount.current) {
      prevAnswerCount.current = selectedAnswers.length;
      setPendingAnswer(null);
      setRevealed(false);
    }
  });
  if (!activeQuiz) return null;
  const question = activeQuiz.questions[currentQuestion];
  const progress = selectedAnswers.length / activeQuiz.questions.length * 100;
  const score = isCompleted ? selectedAnswers.filter(
    (ans, i) => ans === activeQuiz.questions[i].correctIndex
  ).length : 0;
  const pct = Math.round(score / activeQuiz.questions.length * 100);
  const isGreat = pct === 100;
  const isGood = pct >= 60;
  function handleSelectAnswer(idx) {
    if (revealed || pendingAnswer !== null) return;
    setPendingAnswer(idx);
    setRevealed(true);
  }
  function handleNext() {
    if (pendingAnswer === null) return;
    answerQuestion(pendingAnswer);
  }
  function handleFinish() {
    const result = {
      id: crypto.randomUUID(),
      quizId: activeQuiz.id,
      score,
      total: activeQuiz.questions.length,
      completedAt: (/* @__PURE__ */ new Date()).toISOString(),
      answers: selectedAnswers
    };
    addQuizResult(result);
    closeQuiz();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!activeQuiz, onOpenChange: () => closeQuiz(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg border-border bg-card overflow-hidden",
      "data-ocid": "quiz.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-32 bg-gradient-primary opacity-5 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2.5 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-accent",
              animate: { rotate: [0, 5, -5, 0] },
              transition: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-4 h-4 text-white" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "AI Quiz" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
              " ",
              "— ",
              activeQuiz.subject
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 text-primary" }),
                isCompleted ? "Completed!" : `Question ${selectedAnswers.length + 1} of ${activeQuiz.questions.length}`
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                Math.round(progress),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "h-full bg-gradient-primary rounded-full",
                animate: { width: `${progress}%` },
                transition: { duration: 0.5, ease: "easeOut" }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 24 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -24 },
              transition: { duration: 0.28, ease: "easeOut" },
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-relaxed bg-muted/30 rounded-xl px-4 py-3 border border-border/50", children: question.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: question.options.map((option, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AnswerOption,
                  {
                    label: option,
                    index: i,
                    selected: pendingAnswer === i,
                    revealed,
                    isCorrect: i === question.correctIndex,
                    onClick: () => handleSelectAnswer(i),
                    disabled: revealed
                  },
                  option
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: revealed && pendingAnswer !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 8 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0 },
                    className: "flex items-center justify-between",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: cn(
                            "text-sm font-medium",
                            pendingAnswer === question.correctIndex ? "text-chart-3" : "text-destructive"
                          ),
                          children: pendingAnswer === question.correctIndex ? "✓ Correct!" : `✗ The answer was: ${question.options[question.correctIndex]}`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          className: "bg-gradient-primary text-white hover:opacity-90 h-8 text-sm",
                          onClick: handleNext,
                          "data-ocid": "quiz.next_button",
                          children: selectedAnswers.length + 1 === activeQuiz.questions.length ? "See Results" : "Next →"
                        }
                      )
                    ]
                  }
                ) })
              ]
            },
            `q-${currentQuestion}`
          ) : (
            /* Results screen */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.35 },
                className: "space-y-5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3 py-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ScoreRing,
                      {
                        score,
                        total: activeQuiz.questions.length
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.p,
                        {
                          className: "text-lg font-display font-bold text-foreground",
                          initial: { opacity: 0, y: 8 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: 0.5 },
                          children: isGreat ? "Perfect Score! 🏆" : isGood ? "Great Work! 🎉" : "Keep Studying! 💪"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.p,
                        {
                          className: "text-sm text-muted-foreground mt-1",
                          initial: { opacity: 0 },
                          animate: { opacity: 1 },
                          transition: { delay: 0.7 },
                          children: isGreat ? "You aced every question — outstanding recall!" : isGood ? "Solid performance. Review missed items to reinforce." : "Don't worry — revisit the material and try again soon."
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin", children: activeQuiz.questions.map((q, i) => {
                    const isCorrect = selectedAnswers[i] === q.correctIndex;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, x: -8 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: 0.2 + i * 0.08 },
                        className: cn(
                          "flex items-start gap-2.5 p-3 rounded-xl text-xs border",
                          isCorrect ? "bg-chart-3/8 border-chart-3/20" : "bg-destructive/8 border-destructive/20"
                        ),
                        children: [
                          isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-chart-3 flex-shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium line-clamp-1", children: q.question }),
                            !isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-chart-3 mt-0.5", children: [
                              "Correct: ",
                              q.options[q.correctIndex]
                            ] })
                          ] })
                        ]
                      },
                      q.id
                    );
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "flex-1 gap-1.5 border-border",
                        onClick: closeQuiz,
                        "data-ocid": "quiz.close_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" }),
                          "Skip for now"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        className: "flex-2 flex-1 bg-gradient-primary text-white hover:opacity-90 shadow-accent gap-1.5",
                        onClick: handleFinish,
                        "data-ocid": "quiz.finish_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                          "Done — Back to Tasks"
                        ]
                      }
                    )
                  ] })
                ]
              },
              "results"
            )
          ) })
        ] })
      ]
    }
  ) });
}
export {
  CircleCheck as C,
  QuizModal as Q
};
