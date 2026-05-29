import { MapPin, Users, Globe, Upload, Loader2, MessageSquare } from "lucide-react";
import type { Problem } from "@/features/problems/hooks/useProblems";
import type { Status } from "@/features/problems/config/problems";
import { severityConfig, statusConfig, formatDateTimeBR } from "@/features/problems/config/problems";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import BeforeAfterSlider from "@/features/problems/components/BeforeAfterSlider";

interface ProblemDetailsModalProps {
  selectedProblem: Problem;
  onClose: () => void;
  handleStatusChange: (id: string, newStatus: Status) => void;
  handleTogglePublic: (id: string, isPublic: boolean) => void;
  handleUpload: (kind: "before" | "after", files: FileList | null) => void;
  uploadingBefore: boolean;
  uploadingAfter: boolean;
}

export const ProblemDetailsModal = ({
  selectedProblem,
  onClose,
  handleStatusChange,
  handleTogglePublic,
  handleUpload,
  uploadingBefore,
  uploadingAfter,
}: ProblemDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 glass-card rounded-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-foreground text-lg">Detalhes do Reporte</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted" type="button">
            <span className="text-muted-foreground text-lg">×</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityConfig[selectedProblem.severity].className}`}>
              {severityConfig[selectedProblem.severity].label}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[selectedProblem.status].className}`}>
              {statusConfig[selectedProblem.status].label}
            </span>
            <span className="text-xs text-muted-foreground">{selectedProblem.upvotes} apoios · {selectedProblem.city}</span>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground">{selectedProblem.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{selectedProblem.description}</p>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            {selectedProblem.address}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4 shrink-0" />
            Reportado por {selectedProblem.reporterName} em {formatDateTimeBR(selectedProblem.createdAt)}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/20">
            <div>
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-accent" /> Tornar Público
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Visível para qualquer cidade no mural de transparência</p>
            </div>
            <Switch
              checked={selectedProblem.isPublic}
              onCheckedChange={(v) => handleTogglePublic(selectedProblem.id, v)}
            />
          </div>

          <div className="border-t border-border pt-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Atualizar Status</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["pending", "in_progress", "resolved"] as Status[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(selectedProblem.id, s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    selectedProblem.status === s
                      ? statusConfig[s].className
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          {selectedProblem.isPublic && selectedProblem.status === "resolved" && (
            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Showcase Antes & Depois
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1">Antes ({selectedProblem.beforeImages.length})</p>
                  <label className="block w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-accent cursor-pointer flex items-center justify-center bg-muted/30 transition-colors">
                    {uploadingBefore ? (
                      <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    ) : (
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleUpload("before", e.target.files)}
                      disabled={uploadingBefore}
                    />
                  </label>
                  {selectedProblem.beforeImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-1 mt-2 animate-fade-in">
                      {selectedProblem.beforeImages.slice(0, 3).map((u, i) => (
                        <img key={i} src={u} className="aspect-square object-cover rounded shadow-sm" alt="" />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1">Depois ({selectedProblem.afterImages.length})</p>
                  <label className="block w-full h-24 rounded-lg border-2 border-dashed border-success/50 hover:border-success cursor-pointer flex items-center justify-center bg-success/5 transition-colors">
                    {uploadingAfter ? (
                      <Loader2 className="w-5 h-5 animate-spin text-success" />
                    ) : (
                      <Upload className="w-5 h-5 text-success" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleUpload("after", e.target.files)}
                      disabled={uploadingAfter}
                    />
                  </label>
                  {selectedProblem.afterImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-1 mt-2 animate-fade-in">
                      {selectedProblem.afterImages.slice(0, 3).map((u, i) => (
                        <img key={i} src={u} className="aspect-square object-cover rounded shadow-sm" alt="" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedProblem.beforeImages.length > 0 && selectedProblem.afterImages.length > 0 && (
                <div className="animate-fade-in">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-2">Pré-visualização</p>
                  <BeforeAfterSlider before={selectedProblem.beforeImages[0]} after={selectedProblem.afterImages[0]} />
                </div>
              )}
            </div>
          )}

          <div className="border-t border-border pt-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resposta ao Cidadão</label>
            <textarea
              placeholder="Escreva uma atualização..."
              rows={3}
              className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <Button className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-xs transition-colors">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Enviar Resposta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsModal;
