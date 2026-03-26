import { useState } from "react";
import { X, Camera, MapPin, ChevronDown } from "lucide-react";
import { ProblemCategory, categoryConfig, Severity, severityConfig } from "@/lib/problems";
import { Button } from "@/components/ui/button";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal = ({ isOpen, onClose }: ReportModalProps) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ProblemCategory | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Mock submit
    onClose();
    setStep(1);
    setCategory(null);
    setSeverity(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md glass-card rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-foreground">
            {step === 1 ? "Reportar Problema" : step === 2 ? "Detalhes" : "Confirmar"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            {/* Photo area */}
            <button className="w-full h-40 rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors">
              <Camera className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Tirar foto ou anexar</span>
            </button>

            {/* Category selection */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoria</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(Object.entries(categoryConfig) as [ProblemCategory, typeof categoryConfig[ProblemCategory]][]).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-xs font-medium
                        ${category === key
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-card text-muted-foreground hover:border-accent/50"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-center leading-tight">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!category}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            >
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Buraco na Rua das Flores"
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o problema em detalhes..."
                rows={3}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severidade</label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {(Object.entries(severityConfig) as [Severity, typeof severityConfig[Severity]][]).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSeverity(key)}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all
                      ${severity === key ? config.className : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 text-accent text-xs font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Localização será detectada automaticamente via GPS</span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!title || !severity}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            >
              Enviar Reporte
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
