import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { motion } from "motion/react";
import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  completionRate: number;
  avgQuizScore: number;
  consistency: number;
}

const TOOLTIP_STYLE = {
  background: "oklch(0.20 0 0)",
  border: "1px solid oklch(0.30 0 0)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.94 0 0)",
};

export function PerformanceRadial({
  completionRate,
  avgQuizScore,
  consistency,
}: Props) {
  const radialData = [
    { name: "Consistency", value: consistency, fill: "oklch(0.62 0.20 120)" },
    { name: "Quiz Score", value: avgQuizScore, fill: "oklch(0.68 0.16 180)" },
    { name: "Completion", value: completionRate, fill: "oklch(0.72 0.19 270)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45, duration: 0.45 }}
    >
      <Card
        className="border-border h-full"
        data-ocid="insights.performance_radial"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="18%"
              outerRadius="88%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background={{ fill: "oklch(0.22 0 0)" }}
                dataKey="value"
                cornerRadius={5}
              />
              <Legend
                iconSize={8}
                iconType="circle"
                formatter={(value: string) => (
                  <span style={{ fontSize: "11px", color: "oklch(0.68 0 0)" }}>
                    {value}
                  </span>
                )}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => [`${v}%`]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Score chips */}
          <div className="flex justify-around mt-2">
            {[
              {
                label: "Completion",
                value: completionRate,
                color: "text-chart-1",
              },
              { label: "Quiz Avg", value: avgQuizScore, color: "text-chart-2" },
              {
                label: "Consistency",
                value: consistency,
                color: "text-chart-3",
              },
            ].map((chip) => (
              <div key={chip.label} className="text-center">
                <p className={`text-lg font-display font-bold ${chip.color}`}>
                  {chip.value}%
                </p>
                <p className="text-xs text-muted-foreground">{chip.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
