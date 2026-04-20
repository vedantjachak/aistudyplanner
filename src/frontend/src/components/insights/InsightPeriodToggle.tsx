import { motion } from "motion/react";
import type { InsightPeriod } from "../../pages/InsightsPage";

interface Props {
  period: InsightPeriod;
  onChange: (p: InsightPeriod) => void;
}

const OPTIONS: { value: InsightPeriod; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
];

export function InsightPeriodToggle({ period, onChange }: Props) {
  return (
    <div
      className="flex items-center bg-muted rounded-xl p-1 gap-0.5"
      data-ocid="insights.period_toggle"
    >
      {OPTIONS.map((opt) => (
        <button
          type="button"
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="relative px-3 py-1.5 text-xs font-medium rounded-lg transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-pressed={period === opt.value}
          data-ocid={`insights.period.${opt.value}`}
        >
          {period === opt.value && (
            <motion.span
              layoutId="period-pill"
              className="absolute inset-0 bg-card rounded-lg shadow-subtle border border-border"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 transition-colors duration-200 ${
              period === opt.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}
