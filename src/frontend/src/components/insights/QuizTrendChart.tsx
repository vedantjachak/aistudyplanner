import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { motion } from "motion/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { QuizResult } from "../../types";

interface Props {
  results: QuizResult[];
}

const DEMO_QUIZ_TREND = [
  { label: "Quiz 1", score: 60 },
  { label: "Quiz 2", score: 70 },
  { label: "Quiz 3", score: 65 },
  { label: "Quiz 4", score: 78 },
  { label: "Quiz 5", score: 82 },
  { label: "Quiz 6", score: 88 },
];

const TOOLTIP_STYLE = {
  background: "oklch(0.20 0 0)",
  border: "1px solid oklch(0.30 0 0)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.94 0 0)",
};

export function QuizTrendChart({ results }: Props) {
  const chartData =
    results.length > 0
      ? results
          .slice()
          .reverse()
          .slice(0, 20)
          .map((r, i) => ({
            label: `#${i + 1}`,
            score: Math.round((r.score / r.total) * 100),
          }))
      : DEMO_QUIZ_TREND;

  const avg = Math.round(
    chartData.reduce((s, d) => s + d.score, 0) / chartData.length,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.52, duration: 0.45 }}
    >
      <Card className="border-border" data-ocid="insights.quiz_trend_chart">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-secondary" />
              Quiz Performance Trend
            </CardTitle>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Avg: {avg}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 12, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.72 0.19 270)" />
                  <stop offset="100%" stopColor="oklch(0.68 0.16 180)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0 0)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "oklch(0.58 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "oklch(0.58 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine
                y={avg}
                stroke="oklch(0.68 0.16 180)"
                strokeDasharray="4 3"
                strokeOpacity={0.5}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => [`${v}%`, "Score"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#lineGlow)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "oklch(0.72 0.19 270)", strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  fill: "oklch(0.72 0.19 270)",
                  stroke: "oklch(0.68 0.16 180)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
