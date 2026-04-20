import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { motion } from "motion/react";
import type { SubjectStat } from "../../hooks/useInsightData";

interface Props {
  subjects: SubjectStat[];
}

export function SubjectBreakdown({ subjects }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.42, duration: 0.45 }}
    >
      <Card
        className="border-border h-full"
        data-ocid="insights.subjects_breakdown"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Top Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.slice(0, 5).map((sub, i) => (
            <motion.div
              key={sub.subject}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.48 + i * 0.07, duration: 0.4 }}
              data-ocid={`insights.subject.item.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: sub.color }}
                  />
                  <span className="text-sm text-foreground font-medium truncate">
                    {sub.subject}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {sub.minutes}m · {sub.tasks}{" "}
                  {sub.tasks === 1 ? "task" : "tasks"}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: sub.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${sub.pct}%` }}
                  transition={{
                    delay: 0.55 + i * 0.07,
                    duration: 0.7,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
