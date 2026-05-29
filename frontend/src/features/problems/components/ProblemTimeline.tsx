import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Problem } from "@/features/problems/hooks/useProblems";
import { formatDateTimeBR } from "@/features/problems/config/problems";

interface Props {
  problem: Problem;
}

/** Visual timeline of a problem's lifecycle. */
const ProblemTimeline = ({ problem }: Props) => {
  const steps = [
    { key: "reported", label: "Reportado", date: problem.createdAt, done: true },
    {
      key: "review",
      label: "Em análise",
      date: problem.status !== "pending" ? problem.createdAt : null,
      done: problem.status !== "pending",
    },
    {
      key: "in_progress",
      label: "Em andamento",
      date: problem.status === "in_progress" || problem.status === "resolved" ? problem.createdAt : null,
      done: problem.status === "in_progress" || problem.status === "resolved",
    },
    {
      key: "resolved",
      label: "Resolvido",
      date: problem.status === "resolved" ? problem.createdAt : null,
      done: problem.status === "resolved",
    },
  ];

  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const Icon = s.done ? CheckCircle2 : i === steps.findIndex((x) => !x.done) ? Clock : Circle;
        const isCurrent = !s.done && i === steps.findIndex((x) => !x.done);
        return (
          <li key={s.key} className="flex items-start gap-3">
            <div className={`relative shrink-0 ${i < steps.length - 1 ? "after:absolute after:left-1/2 after:top-7 after:w-px after:h-6 after:-translate-x-1/2 after:bg-border" : ""}`}>
              <Icon className={`w-6 h-6 ${s.done ? "text-success" : isCurrent ? "text-accent animate-pulse-glow rounded-full" : "text-muted-foreground/40"}`} />
            </div>
            <div className="flex-1 -mt-0.5">
              <p className={`text-sm font-semibold ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
              {s.date && <p className="text-[11px] text-muted-foreground mt-0.5">{formatDateTimeBR(s.date)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default ProblemTimeline;
