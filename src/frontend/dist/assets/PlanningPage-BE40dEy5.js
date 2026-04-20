import { e as createLucideIcon, h as useStudyStore, r as reactExports, k as jsxRuntimeExports, B as Button, l as motion, C as Clock, o as ue } from "./index-CviB1n4S.js";
import { P as Plus, A as AnimatePresence, B as Badge, X } from "./badge-D8m6OhXH.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-BbdGlSpY.js";
import { I as Input } from "./input-C6_3rC4p.js";
import { a as generatePlannerWithOllama } from "./ollama-CQFyrNv9.js";
import { S as Sparkles } from "./sparkles-DyJQeLW4.js";
import { C as Calendar } from "./calendar-Dx4jJhrs.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function PlanningPage() {
  const { tasks, planner, setPlanner } = useStudyStore();
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [newSubject, setNewSubject] = reactExports.useState("");
  const initialSubjects = reactExports.useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    tasks.forEach((t) => s.add(t.subject));
    return Array.from(s);
  }, [tasks]);
  const [subjects, setSubjects] = reactExports.useState(initialSubjects);
  const addSubject = () => {
    if (!newSubject.trim()) return;
    if (subjects.includes(newSubject.trim())) {
      ue.error("Subject already added");
      return;
    }
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject("");
  };
  const removeSubject = (sub) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };
  const handleGenerate = async () => {
    if (subjects.length === 0) {
      ue.error("Add at least one subject");
      return;
    }
    setIsGenerating(true);
    try {
      const entries = await generatePlannerWithOllama(subjects);
      setPlanner({
        id: crypto.randomUUID(),
        name: "My AI Timetable",
        entries,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      ue.success("Timetable generated successfully!");
    } catch (error) {
      ue.error("Failed to generate timetable");
    } finally {
      setIsGenerating(false);
    }
  };
  const plannerByDay = reactExports.useMemo(() => {
    const map = {};
    DAYS.forEach((day) => map[day] = []);
    planner == null ? void 0 : planner.entries.forEach((entry) => {
      if (map[entry.day]) {
        map[entry.day].push(entry);
      }
    });
    return map;
  }, [planner]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-8 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "AI Study Planner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Generate a personalized study timetable based on your current subjects." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleGenerate,
          disabled: isGenerating || subjects.length === 0,
          className: "bg-gradient-primary text-white shadow-accent hover:opacity-90 min-w-[160px]",
          children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Generating..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 mr-2" }),
            "Generate Planner"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: "Your Subjects" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Add subject...",
                  value: newSubject,
                  onChange: (e) => setNewSubject(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && addSubject(),
                  className: "bg-background/50 h-9"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: addSubject, className: "h-9 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: subjects.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.8 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "pl-2 pr-1 py-1 flex items-center gap-1 group",
                    children: [
                      sub,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => removeSubject(sub),
                          className: "p-0.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                        }
                      )
                    ]
                  }
                )
              },
              sub
            )) }) }),
            subjects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4", children: "No subjects added yet." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "AI will balance your week across all subjects." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: !planner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[500px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-8 h-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground", children: "No Planner Yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xs mt-2", children: 'Click "Generate Planner" to have AI create a custom study schedule for you.' })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "space-y-6",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: DAYS.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border overflow-hidden hover:shadow-elevated transition-smooth", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "bg-muted/30 py-3 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-bold flex items-center justify-between", children: [
              day,
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] font-normal uppercase tracking-wider", children: [
                plannerByDay[day].length,
                " Sessions"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
              plannerByDay[day].map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 hover:bg-muted/20 transition-colors group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-medium text-primary bg-primary/10 px-1.5 rounded", children: entry.time }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-foreground", children: entry.subject }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-1 group-hover:line-clamp-none transition-all", children: entry.activity })
              ] }, i)),
              plannerByDay[day].length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-xs text-muted-foreground italic", children: "Rest day or no sessions scheduled." })
            ] }) })
          ] }, day)) })
        }
      ) })
    ] })
  ] });
}
export {
  PlanningPage as default
};
