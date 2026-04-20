import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { generatePlannerInstant } from "../lib/ollama";
import { useStudyStore } from "../store/useStudyStore";
import type { PlannerEntry } from "../types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlanningPage() {
  const { tasks, planner, setPlanner } = useStudyStore();
  const [isGenerating] = useState(false); // kept for button disabled state only
  const [newSubject, setNewSubject] = useState("");
  
  // Extract unique subjects from tasks
  const initialSubjects = useMemo(() => {
    const s = new Set<string>();
    tasks.forEach((t) => s.add(t.subject));
    return Array.from(s);
  }, [tasks]);

  const [subjects, setSubjects] = useState<string[]>(initialSubjects);

  const addSubject = () => {
    if (!newSubject.trim()) return;
    if (subjects.includes(newSubject.trim())) {
      toast.error("Subject already added");
      return;
    }
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject("");
  };

  const removeSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };

  const handleGenerate = () => {
    if (subjects.length === 0) {
      toast.error("Add at least one subject");
      return;
    }

    const newId = crypto.randomUUID();

    // Instantly generate from smart mock template
    const instantEntries = generatePlannerInstant(subjects, (aiEntries) => {
      // AI upgraded: silently update and notify user
      setPlanner({
        id: newId,
        name: "My AI Timetable ✨",
        entries: aiEntries,
        createdAt: new Date().toISOString(),
      });
      toast.success("AI upgraded your timetable!", { duration: 3000 });
    });

    setPlanner({
      id: newId,
      name: "My Study Timetable",
      entries: instantEntries,
      createdAt: new Date().toISOString(),
    });
    toast.success("Timetable ready! AI is refining it in the background...", {
      duration: 3000,
    });
  };

  const plannerByDay = useMemo(() => {
    const map: Record<string, PlannerEntry[]> = {};
    DAYS.forEach((day) => (map[day] = []));
    planner?.entries.forEach((entry) => {
      if (map[entry.day]) {
        map[entry.day].push(entry);
      }
    });
    return map;
  }, [planner]);

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            AI Study Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate a personalized study timetable based on your current subjects.
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={subjects.length === 0}
          className="bg-gradient-primary text-white shadow-accent hover:opacity-90 min-w-[160px]"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Planner
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Subject Management */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                Your Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add subject..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubject()}
                  className="bg-background/50 h-9"
                />
                <Button size="sm" onClick={addSubject} className="h-9 px-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {subjects.map((sub) => (
                    <motion.div
                      key={sub}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className="pl-2 pr-1 py-1 flex items-center gap-1 group"
                      >
                        {sub}
                        <button
                          onClick={() => removeSubject(sub)}
                          className="p-0.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {subjects.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No subjects added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <p>AI will balance your week across all subjects.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Timetable */}
        <div className="lg:col-span-3">
          {!planner ? (
            <div className="h-[500px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-muted/20">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Planner Yet</h3>
              <p className="text-muted-foreground max-w-xs mt-2">
                Click "Generate Planner" to have AI create a custom study schedule for you.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {DAYS.map((day) => (
                  <Card key={day} className="border-border overflow-hidden hover:shadow-elevated transition-smooth">
                    <CardHeader className="bg-muted/30 py-3 border-b">
                      <CardTitle className="text-sm font-bold flex items-center justify-between">
                        {day}
                        <Badge variant="outline" className="text-[10px] font-normal uppercase tracking-wider">
                          {plannerByDay[day].length} Sessions
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {plannerByDay[day].map((entry, i) => (
                          <div key={i} className="p-4 hover:bg-muted/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-medium text-primary bg-primary/10 px-1.5 rounded">
                                {entry.time}
                              </span>
                            </div>
                            <h4 className="font-semibold text-sm text-foreground">
                              {entry.subject}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                              {entry.activity}
                            </p>
                          </div>
                        ))}
                        {plannerByDay[day].length === 0 && (
                          <div className="p-8 text-center text-xs text-muted-foreground italic">
                            Rest day or no sessions scheduled.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
