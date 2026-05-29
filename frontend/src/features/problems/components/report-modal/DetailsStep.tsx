import { Sparkles } from "lucide-react";

interface DetailsStepProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  reporterName: string;
  setReporterName: (name: string) => void;
}

export const DetailsStep = ({
  title,
  setTitle,
  description,
  setDescription,
  reporterName,
  setReporterName,
}: DetailsStepProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Buraco na Rua das Flores"
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o problem em detalhes..."
          rows={3}
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seu nome (opcional)</label>
        <input
          value={reporterName}
          onChange={(e) => setReporterName(e.target.value)}
          placeholder="Como você quer ser identificado"
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      <div className="rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/20 p-3 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Sua ocorrência será analisada pela equipe responsável e você poderá acompanhar o status em tempo real.
        </p>
      </div>
    </div>
  );
};
