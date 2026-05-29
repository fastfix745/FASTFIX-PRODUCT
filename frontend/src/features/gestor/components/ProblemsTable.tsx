import { useState, memo } from "react";
import { BarChart3, Search, Globe, Eye } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import {
  categoryConfig,
  severityConfig,
  statusConfig,
  Status,
  formatDateBR,
} from "@/features/problems/config/problems";
import { Problem } from "@/features/problems/hooks/useProblems";

interface ProblemsTableProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  handleStatusChange: (id: string, newStatus: Status) => void;
  handleTogglePublic: (id: string, isPublic: boolean) => void;
}

export const ProblemsTable = memo(({
  problems,
  onSelectProblem,
  handleStatusChange,
  handleTogglePublic,
}: ProblemsTableProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = problems.filter((p) => {
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent" /> Gestão de Reportes
        </h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full sm:w-56 pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {[
              { key: "all", label: "Todos" },
              { key: "pending", label: "Pendentes" },
              { key: "in_progress", label: "Andamento" },
              { key: "resolved", label: "Resolvidos" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedStatus(f.key)}
                className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition-colors flex-1 sm:flex-none text-center ${
                  selectedStatus === f.key
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-3 font-semibold">Problema</th>
              <th className="text-left py-2 px-3 font-semibold hidden lg:table-cell">Cidade</th>
              <th className="text-center py-2 px-3 font-semibold">Severidade</th>
              <th className="text-center py-2 px-3 font-semibold">Apoios</th>
              <th className="text-center py-2 px-3 font-semibold">Status</th>
              <th className="text-center py-2 px-3 font-semibold hidden md:table-cell">
                <span className="flex items-center justify-center gap-1">
                  <Globe className="w-3 h-3" /> Público
                </span>
              </th>
              <th className="text-center py-2 px-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground font-medium">
                  Nenhum reporte encontrado
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const cat = categoryConfig[p.category];
                const CatIcon = cat.icon;
                return (
                  <tr key={p.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md bg-muted ${cat.color} shrink-0`}>
                          <CatIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate max-w-[140px] sm:max-w-xs">{p.title}</p>
                          <p className="text-muted-foreground text-[10px] truncate max-w-[140px]">
                            {p.reporterName} • {formatDateBR(p.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden lg:table-cell text-muted-foreground">{p.city}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${severityConfig[p.severity].className}`}>
                        {severityConfig[p.severity].label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">{p.upvotes}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as Status)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent ${statusConfig[p.status].className}`}
                      >
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="resolved">Resolvido</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <div className="flex justify-center">
                        <Switch
                          checked={p.isPublic}
                          onCheckedChange={(v) => handleTogglePublic(p.id, v)}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectProblem(p)}
                        className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                        title="Visualizar Detalhes"
                        type="button"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ProblemsTable.displayName = "ProblemsTable";
