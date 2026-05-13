import { useEffect, useState } from "react";
import { X, Camera, MapPin, Loader2, CheckCircle2, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { ProblemCategory, Severity, categoryConfig, severityConfig } from "@/lib/problems";
import { useCreateProblem } from "@/hooks/useProblems";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Coords = { lat: number; lng: number } | null;

const STEPS = ["Foto", "Local", "Categoria", "Detalhes"];

const ReportModal = ({ isOpen, onClose }: ReportModalProps) => {
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [coords, setCoords] = useState<Coords>(null);
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [category, setCategory] = useState<ProblemCategory | null>(null);
  const [severity, setSeverity] = useState<Severity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const createProblem = useCreateProblem();

  // Auto-detect location when reaching step 1
  useEffect(() => {
    if (step !== 1 || coords || locating) return;
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocating(false);
        toast({ title: "Não foi possível detectar sua localização", description: "Informe o endereço manualmente." });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [step, coords, locating]);

  if (!isOpen) return null;

  const reset = () => {
    setStep(0); setPhotos([]); setCoords(null); setAddress(""); setCategory(null);
    setSeverity("medium"); setTitle(""); setDescription(""); setReporterName(""); setSubmitted(false);
  };

  const close = () => { onClose(); setTimeout(reset, 300); };

  const onPickPhotos = (files: FileList | null) => {
    if (!files) return;
    const arr: string[] = [];
    Array.from(files).slice(0, 5).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        arr.push(reader.result as string);
        if (arr.length === Math.min(files.length, 5)) {
          setPhotos((prev) => [...prev, ...arr].slice(0, 5));
        }
      };
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async () => {
    if (!category || !title || !address || !coords) return;
    try {
      await createProblem.mutateAsync({
        title,
        description: description || title,
        category,
        severity,
        address,
        lat: coords.lat,
        lng: coords.lng,
        reporterName: reporterName || "Cidadão",
        imageUrl: photos[0] ?? null,
      });
      setSubmitted(true);
      toast({ title: "Reporte enviado com sucesso", description: "Sua ocorrência foi registrada e está em análise." });
      setTimeout(close, 1800);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Tente novamente.";
      toast({ title: "Erro ao enviar reporte", description: msg, variant: "destructive" });
    }
  };

  const canNext = [
    true,                          // photo step optional
    !!coords && address.length > 3,
    !!category,
    !!title,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full sm:max-w-lg glass-card rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto shadow-elegant">
        {submitted ? (
          <div className="py-12 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/15 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">Reporte registrado!</h3>
            <p className="text-sm text-muted-foreground mt-2">Sua ocorrência foi enviada à prefeitura.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Passo {step + 1} de {STEPS.length}</p>
                <h2 className="font-display text-xl font-bold text-foreground">Reportar Ocorrência</h2>
              </div>
              <button onClick={close} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Stepper */}
            <div className="flex gap-1.5 mb-6">
              {STEPS.map((label, i) => (
                <div key={label} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-all ${i <= step ? "bg-gradient-accent" : "bg-muted"}`} />
                  <p className={`text-[10px] mt-1.5 font-semibold ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
                </div>
              ))}
            </div>

            {/* Step 0 — Photo */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-in">
                <label className="block w-full h-44 rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:border-accent hover:bg-accent/5 cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
                  <Camera className="w-10 h-10 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Tirar foto ou anexar</span>
                  <span className="text-[11px] text-muted-foreground">Até 5 imagens — opcional</span>
                  <input
                    type="file" accept="image/*" multiple capture="environment"
                    className="hidden"
                    onChange={(e) => onPickPhotos(e.target.files)}
                  />
                </label>
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                        <img src={src} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setPhotos((p) => p.filter((_, x) => x !== i))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/70 text-background text-xs flex items-center justify-center"
                          aria-label="Remover foto"
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 1 — Location */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-2xl bg-accent/10 border border-accent/30 p-4 flex items-start gap-3">
                  {locating ? (
                    <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${coords ? "text-success" : "text-accent"}`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {locating ? "Detectando sua localização..." : coords ? "Localização detectada" : "Localização indisponível"}
                    </p>
                    {coords && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Endereço de referência</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Av. Beira Mar, 120 - Meireles, Fortaleza"
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                {!coords && !locating && (
                  <button
                    onClick={() => { setCoords(null); setLocating(false); setStep(1); }}
                    className="text-xs text-accent font-semibold hover:underline"
                  >
                    Tentar detectar novamente
                  </button>
                )}
              </div>
            )}

            {/* Step 2 — Category */}
            {step === 2 && (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(categoryConfig) as [ProblemCategory, typeof categoryConfig[ProblemCategory]][]).map(([key, config]) => {
                    const Icon = config.icon;
                    const active = category === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setCategory(key)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold
                          ${active ? "border-accent bg-accent/10 text-accent shadow-sm" : "border-border bg-card text-muted-foreground hover:border-accent/40"}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-center leading-tight">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severidade</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {(Object.entries(severityConfig) as [Severity, typeof severityConfig[Severity]][]).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setSeverity(key)}
                        className={`px-2 py-2 rounded-lg text-xs font-bold transition-all
                          ${severity === key ? config.className : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Details */}
            {step === 3 && (
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
                    placeholder="Descreva o problema em detalhes..."
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
            )}

            {/* Footer */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-border/50">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="font-semibold"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext[step]}
                  className="flex-1 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-95"
                >
                  Continuar <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canNext[step] || createProblem.isPending}
                  className="flex-1 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-95"
                >
                  {createProblem.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Enviando...</>
                  ) : (
                    <>Enviar Reporte</>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
