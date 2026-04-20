import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DayBar } from "../../hooks/useInsightData";

interface Props {
  data: DayBar[];
}

const TOOLTIP_STYLE = {
  background: "oklch(0.20 0 0)",
  border: "1px solid oklch(0.30 0 0)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.94 0 0)",
};

export function WeeklyBarChart({ data }: Props) {
  const maxVal = Math.max(...data.map((d) => d.minutes), 1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.28, duration: 0.45 }}
    >
      <Card
        className="border-border h-full"
        data-ocid="insights.weekly_bar_chart"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            Weekly Study Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data}
              margin={{ top: 6, right: 8, left: -22, bottom: 0 }}
              barCategoryGap="30%"
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.72 0.19 270)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.68 0.16 180)"
                    stopOpacity={0.8}
                  />
                </linearGradient>
                <linearGradient id="barGradFaded" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.72 0.19 270)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.68 0.16 180)"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0 0)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "oklch(0.58 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.58 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "oklch(0.72 0.19 270 / 0.05)" }}
                formatter={(v: number) => [`${v} min`, "Study time"]}
              />
              <Bar dataKey="minutes" radius={[5, 5, 0, 0]} maxBarSize={44}>
                {data.map((entry, i) => (
                  <Cell
                    key={`bar-${entry.day}-${i}`}
                    fill={
                      entry.minutes === maxVal
                        ? "url(#barGrad)"
                        : "url(#barGradFaded)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
