import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellOff,
  BellRing,
  ChevronDown,
  Clock,
  Link2,
  Plus,
  SnowflakeIcon,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useStudyStore } from "../store/useStudyStore";
import type { Reminder, ReminderFrequency, SnoozeOption } from "../types";
import { getEffectiveScheduledAt, getReminderUrgency } from "../types";

// ─── Urgency config ──────────────────────────────────────────────────────────

const URGENCY_CONFIG = {
  urgent: {
    label: "Urgent",
    badgeCls: "bg-destructive/20 text-destructive border-destructive/40",
    glowCls: "shadow-[0_0_18px_0_oklch(0.63_0.2_15/0.35)]",
    stripCls: "from-destructive to-destructive/60",
    iconCls: "bg-destructive/20 text-destructive",
    borderCls: "border-destructive/30",
  },
  soon: {
    label: "Soon",
    badgeCls: "bg-chart-4/20 text-chart-4 border-chart-4/40",
    glowCls: "shadow-[0_0_16px_0_oklch(0.68_0.18_50/0.3)]",
    stripCls: "from-chart-4 to-chart-4/60",
    iconCls: "bg-chart-4/20 text-chart-4",
    borderCls: "border-chart-4/30",
  },
  later: {
    label: "Upcoming",
    badgeCls: "bg-primary/20 text-primary border-primary/40",
    glowCls: "shadow-[0_0_16px_0_oklch(0.72_0.19_270/0.25)]",
    stripCls: "from-primary to-secondary",
    iconCls: "bg-gradient-primary text-white",
    borderCls: "border-primary/20",
  },
} as const;

const FREQ_LABELS: Record<ReminderFrequency, string> = {
  once: "One-time",
  daily: "Daily",
  weekly: "Weekly",
};

const SNOOZE_OPTIONS: { value: SnoozeOption; label: string }[] = [
  { value: "15min", label: "15 minutes" },
  { value: "1hour", label: "1 hour" },
  { value: "3hours", label: "3 hours" },
  { value: "tomorrow", label: "Tomorrow 9 AM" },
];

// ─── Countdown ───────────────────────────────────────────────────────────────

function useCountdown(targetISO: string) {
  const [diff, setDiff] = useState(
    () => new Date(targetISO).getTime() - Date.now(),
  );
  const rafRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const tick = () => {
      setDiff(new Date(targetISO).getTime() - Date.now());
      rafRef.current = setTimeout(tick, 1000);
    };
    tick();
    return () => clearTimeout(rafRef.current);
  }, [targetISO]);

  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m ${secs}s`;
}

// ─── Add Reminder Dialog ──────────────────────────────────────────────────────

function AddReminderDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { addReminder, tasks } = useStudyStore();
  const [form, setForm] = useState({
    title: "",
    message: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "09:00",
    frequency: "once" as ReminderFrequency,
    linkedTaskId: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const scheduledAt = new Date(
      `${form.scheduledDate}T${form.scheduledTime}`,
    ).toISOString();
    addReminder({
      id: crypto.randomUUID(),
      title: form.title,
      message: form.message,
      scheduledAt,
      frequency: form.frequency,
      linkedTaskId: form.linkedTaskId || undefined,
      isDismissed: false,
    });
    toast.success("Reminder set! 🔔");
    onClose();
    setForm({
      title: "",
      message: "",
      scheduledDate: new Date().toISOString().split("T")[0],
      scheduledTime: "09:00",
      frequency: "once",
      linkedTaskId: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md border-border bg-card"
        data-ocid="reminders.add_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Bell className="w-5 h-5 text-primary" />
            Add Reminder
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rtitle">Title *</Label>
            <Input
              id="rtitle"
              placeholder="e.g. Midterm exam study block"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              data-ocid="reminders.title.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rmsg">Message</Label>
            <Textarea
              id="rmsg"
              placeholder="What should you remember or do?"
              rows={2}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              data-ocid="reminders.message.textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rdate">Date *</Label>
              <Input
                id="rdate"
                type="date"
                value={form.scheduledDate}
                onChange={(e) =>
                  setForm({ ...form, scheduledDate: e.target.value })
                }
                data-ocid="reminders.date.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rtime">Time *</Label>
              <Input
                id="rtime"
                type="time"
                value={form.scheduledTime}
                onChange={(e) =>
                  setForm({ ...form, scheduledTime: e.target.value })
                }
                data-ocid="reminders.time.input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select
                value={form.frequency}
                onValueChange={(v) =>
                  setForm({ ...form, frequency: v as ReminderFrequency })
                }
              >
                <SelectTrigger data-ocid="reminders.frequency.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">One-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Linked Task</Label>
              <Select
                value={form.linkedTaskId}
                onValueChange={(v) =>
                  setForm({ ...form, linkedTaskId: v === "__none__" ? "" : v })
                }
              >
                <SelectTrigger data-ocid="reminders.task.select">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {tasks.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-ocid="reminders.add_dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary text-white hover:opacity-90"
              data-ocid="reminders.add_dialog.submit_button"
            >
              Set Reminder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Snooze Popover ───────────────────────────────────────────────────────────

function SnoozePopover({
  reminderId,
  index,
}: { reminderId: string; index: number }) {
  const { snoozeReminder } = useStudyStore();
  const [open, setOpen] = useState(false);

  function handleSnooze(option: SnoozeOption) {
    snoozeReminder(reminderId, option);
    const labels = {
      "15min": "15 minutes",
      "1hour": "1 hour",
      "3hours": "3 hours",
      tomorrow: "Tomorrow 9 AM",
    };
    toast.success(`Snoozed until ${labels[option]}`);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          data-ocid={`reminders.snooze_button.${index + 1}`}
        >
          <SnowflakeIcon className="w-3 h-3" />
          Snooze
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-44 p-1.5"
        align="end"
        data-ocid={`reminders.snooze_popover.${index + 1}`}
      >
        <p className="text-xs text-muted-foreground px-2 py-1 font-medium">
          Snooze for
        </p>
        {SNOOZE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSnooze(opt.value)}
            className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors"
          >
            {opt.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

// ─── Reminder Card ────────────────────────────────────────────────────────────

function ReminderCard({
  reminder,
  index,
}: { reminder: Reminder; index: number }) {
  const { dismissReminder, deleteReminder, tasks } = useStudyStore();
  const effective = getEffectiveScheduledAt(reminder);
  const urgency = getReminderUrgency(effective);
  const cfg = URGENCY_CONFIG[urgency];
  const countdown = useCountdown(effective);
  const isPast = new Date(effective).getTime() <= Date.now();
  const linkedTask = tasks.find((t) => t.id === reminder.linkedTaskId);

  const scheduledDate = new Date(effective);
  const dateStr = scheduledDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = scheduledDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function handleDismiss() {
    dismissReminder(reminder.id);
    toast.success("Reminder dismissed", { description: reminder.title });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        x: 60,
        height: 0,
        marginBottom: 0,
        overflow: "hidden",
      }}
      transition={{
        delay: index * 0.07,
        duration: 0.35,
      }}
      data-ocid={`reminders.item.${index + 1}`}
    >
      <Card
        className={cn(
          "border overflow-hidden relative group transition-all duration-300",
          cfg.borderCls,
          !isPast && cfg.glowCls,
        )}
      >
        {/* Urgency top strip */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r",
            cfg.stripCls,
          )}
        />

        <CardContent className="p-4 pt-5">
          <div className="flex items-start gap-3">
            {/* Bell icon */}
            <motion.div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                cfg.iconCls,
              )}
              animate={
                !isPast && urgency === "urgent" ? { scale: [1, 1.08, 1] } : {}
              }
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.4,
                ease: "easeInOut",
              }}
            >
              {isPast ? (
                <BellOff className="w-4.5 h-4.5" />
              ) : (
                <BellRing className="w-4.5 h-4.5" />
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-sm font-display font-semibold text-foreground">
                  {reminder.title}
                </p>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-1.5 py-0 border", cfg.badgeCls)}
                >
                  {isPast ? "Past" : cfg.label}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-border text-muted-foreground"
                >
                  {FREQ_LABELS[reminder.frequency]}
                </Badge>
                {reminder.snoozedUntil && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-chart-2/40 text-chart-2 bg-chart-2/10"
                  >
                    Snoozed
                  </Badge>
                )}
              </div>

              {reminder.message && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {reminder.message}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {dateStr} · {timeStr}
                </span>
                {linkedTask && (
                  <span className="flex items-center gap-1 text-primary/80">
                    <Link2 className="w-3 h-3" />
                    {linkedTask.title}
                  </span>
                )}
              </div>

              {/* Countdown */}
              {countdown && !isPast && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-semibold border",
                      cfg.badgeCls,
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    {countdown}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {!reminder.isDismissed && !isPast && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                  onClick={handleDismiss}
                  data-ocid={`reminders.dismiss_button.${index + 1}`}
                >
                  <X className="w-3 h-3" />
                  Dismiss
                </Button>
              )}
              {!reminder.isDismissed && !isPast && (
                <SnoozePopover reminderId={reminder.id} index={index} />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth"
                onClick={() => {
                  deleteReminder(reminder.id);
                  toast.success("Reminder deleted");
                }}
                data-ocid={`reminders.delete_button.${index + 1}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RemindersPage() {
  const { reminders } = useStudyStore();
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "urgent" | "soon" | "later">(
    "all",
  );
  const [dismissedOpen, setDismissedOpen] = useState(false);

  const active = reminders.filter((r) => !r.isDismissed);
  const dismissed = reminders.filter((r) => r.isDismissed);

  const filteredActive = active
    .filter((r) => {
      if (filter === "all") return true;
      return getReminderUrgency(getEffectiveScheduledAt(r)) === filter;
    })
    .sort(
      (a, b) =>
        new Date(getEffectiveScheduledAt(a)).getTime() -
        new Date(getEffectiveScheduledAt(b)).getTime(),
    );

  const urgentCount = active.filter(
    (r) => getReminderUrgency(getEffectiveScheduledAt(r)) === "urgent",
  ).length;

  const FILTERS: { value: typeof filter; label: string }[] = [
    { value: "all", label: `All (${active.length})` },
    { value: "urgent", label: "🔴 Urgent" },
    { value: "soon", label: "🟡 Soon" },
    { value: "later", label: "🟢 Later" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Reminders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {active.length} active ·{" "}
            {urgentCount > 0 && (
              <span className="text-destructive font-medium">
                {urgentCount} urgent
              </span>
            )}
            {urgentCount === 0 && "none urgent"}
          </p>
        </motion.div>
        <Button
          className="bg-gradient-primary text-white hover:opacity-90 shadow-accent gap-2 flex-shrink-0"
          onClick={() => setAddOpen(true)}
          data-ocid="reminders.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </Button>
      </div>

      {/* Urgency legend */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-3 gap-3"
      >
        {(["urgent", "soon", "later"] as const).map((u) => {
          const count = active.filter(
            (r) => getReminderUrgency(getEffectiveScheduledAt(r)) === u,
          ).length;
          const cfg = URGENCY_CONFIG[u];
          return (
            <button
              key={u}
              type="button"
              onClick={() => setFilter(filter === u ? "all" : u)}
              className={cn(
                "rounded-xl p-3 border text-left transition-all duration-200",
                cfg.borderCls,
                filter === u
                  ? "bg-card shadow-elevated"
                  : "bg-card/50 hover:bg-card",
              )}
              data-ocid={`reminders.urgency_filter.${u}`}
            >
              <p
                className={cn(
                  "text-xl font-display font-bold",
                  cfg.badgeCls.split(" ")[1],
                )}
              >
                {count}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                {cfg.label}
              </p>
            </button>
          );
        })}
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
        data-ocid="reminders.filter.tab"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 border",
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary shadow-accent"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted",
            )}
            data-ocid={`reminders.filter.${f.value}`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Active reminders list */}
      <div className="space-y-3" data-ocid="reminders.list">
        <AnimatePresence mode="popLayout">
          {filteredActive.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center border border-dashed border-border rounded-2xl bg-card/30"
              data-ocid="reminders.empty_state"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  repeatDelay: 2,
                }}
                className="inline-block mb-3"
              >
                <Bell className="w-12 h-12 text-muted-foreground mx-auto" />
              </motion.div>
              <p className="font-display font-semibold text-foreground text-lg">
                All clear!
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                No reminders here yet. Stay proactive — add one to keep your
                studies on track! 🎯
              </p>
              <Button
                className="mt-4 bg-gradient-primary text-white hover:opacity-90 gap-2"
                onClick={() => setAddOpen(true)}
                data-ocid="reminders.empty_state_add_button"
              >
                <Plus className="w-4 h-4" />
                Add Your First Reminder
              </Button>
            </motion.div>
          ) : (
            filteredActive.map((r, i) => (
              <ReminderCard key={r.id} reminder={r} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Dismissed section */}
      {dismissed.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Collapsible open={dismissedOpen} onOpenChange={setDismissedOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full py-2"
                data-ocid="reminders.dismissed_section.toggle"
              >
                <BellOff className="w-4 h-4" />
                <span className="font-medium">
                  Past & Dismissed ({dismissed.length})
                </span>
                <motion.div
                  animate={{ rotate: dismissedOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 mt-2"
                data-ocid="reminders.dismissed_list"
              >
                <AnimatePresence>
                  {dismissed.map((r, i) => (
                    <ReminderCard key={r.id} reminder={r} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>
      )}

      <AddReminderDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
