import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AreaPoint } from "../../hooks/useInsightData";
import type { InsightPeriod } from "../../pages/InsightsPage";

interface Props {
  data: AreaPoint[];
  period: InsightPeriod;
}

const TOOLTIP_STYLE = {
  background: "oklch(0.20 0 0)",
  border: "1px solid oklch(0.30 0 0)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.94 0 0)",
};

const PERIOD_LABEL: Record<InsightPeriod, string> = {
  week: "7-Day Trend",
  month: "30-Day Trend",
  all: "All-Time Trend",
};

export function MonthlyAreaChart({ data, period }: Props) {
  // For dense data, show every nth tick
  const tickEvery = data.length <= 7 ? 1 : data.length <= 30 ? 5 : 10;
  const tickData = data.filter(
    (_, i) => i % tickEvery === 0 || i === data.length - 1,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.32, duration: 0.45 }}
    >
      <Card
        className="border-border h-full"
        data-ocid="insights.monthly_area_chart"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            {PERIOD_LABEL[period]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={data}
              margin={{ top: 6, right: 8, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaGradCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.68 0.16 180)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.68 0.16 180)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0 0)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "oklch(0.58 0 0)" }}
                axisLine={false}
                tickLine={false}
                ticks={tickData.map((d) => d.label)}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.58 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => [`${v} min`, "Study time"]}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="oklch(0.68 0.16 180)"
                strokeWidth={2}
                fill="url(#areaGradCyan)"
                dot={false}
                activeDot={{ r: 4, fill: "oklch(0.68 0.16 180)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
