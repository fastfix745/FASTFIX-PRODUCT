import { useState, useEffect } from "react";
import { X, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { ProblemCategory, Severity } from "@/features/problems/config/problems";
import { useUpdateProblem, uploadProblemMedia } from "@/features/problems/hooks/useProblems";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { Problem } from "@/types/problem";

// Import steps
import { PhotoStep } from "./report-modal/PhotoStep";
import { LocationStep } from "./report-modal/LocationStep";
import { CategoryStep } from "./report-modal/CategoryStep";
import { DetailsStep } from "./report-modal/DetailsStep";

interface EditProblemModalProps {
  problem: Problem;
  isOpen: boolean;
  onClose: () => void;
}

type Coords = { lat: number; lng: number } | null;

const STEPS = ["Foto", "Local", "Categoria", "Detalhes"];

// Função para fazer reverse geocoding com Nominatim
const reverseGeocode = async (lat: number, lng: number): Promise<{ city: string; address: string }> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "User-Agent": "FastFix/1.0",
        },
      }
    );
    const data = await response.json();

    if (data.address) {
      const city = data.address.city || data.address.town || data.address.municipality || data.address.county || "";
      const state = data.address.state || "";
      const road = data.address.road || "";
      const neighbourhood = data.address.neighbourhood || "";

      return {
        city: city ? `${city}, ${state}` : city,
        address: road || neighbourhood || "",
      };
    }
  } catch (error) {
    console.error("Erro no reverse geocoding:", error);
  }
  return { city: "", address: "" };
};

// Função para detectar localização
const detectLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não suportada"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

const EditProblemModal = ({ problem, isOpen, onClose }: EditProblemModalProps) => {
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [coords, setCoords] = useState<Coords>(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [category, setCategory] = useState<ProblemCategory | null>(null);
  const [severity, setSeverity] = useState<Severity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const updateProblem = useUpdateProblem();

  // Inicializa os campos com os dados do problema existente
  useEffect(() => {
    if (isOpen && problem) {
      setAddress(problem.address);
      setCity(problem.city);
      setCategory(problem.category as ProblemCategory);
      setSeverity(problem.severity as Severity);
      setTitle(problem.title);
      setDescription(problem.description);
      setCoords({ lat: problem.lat, lng: problem.lng });
      if (problem.imageUrl) {
        setPhotos([problem.imageUrl]);
      }
    }
  }, [isOpen, problem]);

  if (!isOpen) return null;

  const reset = () => {
    setStep(0);
    setPhotos([]);
    setPhotoFiles([]);
    setCoords(null);
    setAddress("");
    setCity("");
    setCategory(null);
    setSeverity("medium");
    setTitle("");
    setDescription("");
  };

  // Função para auto-detectar localização
  const handleAutoLocate = async () => {
    setLocating(true);
    try {
      const position = await detectLocation();
      setCoords(position);

      // Reverse geocoding para obter cidade e endereço
      const locationData = await reverseGeocode(position.lat, position.lng);
      if (locationData.city) {
        setCity(locationData.city);
      }
      if (locationData.address) {
        setAddress(locationData.address);
      }
    } catch (error) {
      console.error("Erro ao detectar localização:", error);
      toast.error("Não foi possível detectar sua localização", {
        description: "Por favor, insira manualmente sua cidade e endereço.",
      });
    } finally {
      setLocating(false);
    }
  };

  const close = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const onPickPhotos = (files: FileList | null) => {
    if (!files) return;
    const sliced = Array.from(files).slice(0, 5);
    setPhotoFiles((prev) => [...prev, ...sliced].slice(0, 5));
    sliced.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((prev) => [...prev, reader.result as string].slice(0, 5));
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async () => {
    if (!category || !title || !address || !city) return;
    try {
      let imageUrl: string | undefined;
      if (photoFiles[0]) {
        try {
          imageUrl = await uploadProblemMedia(photoFiles[0], "reports");
        } catch {
          // fallback para foto existente
          imageUrl = problem.imageUrl ?? undefined;
        }
      }

      await updateProblem.mutateAsync({
        id: problem.id,
        input: {
          title,
          description: description || title,
          category,
          severity,
          address,
          lat: coords?.lat ?? 0,
          lng: coords?.lng ?? 0,
          city: city,
          imageUrl,
        },
      });
      toast.success("Denúncia atualizada com sucesso");
      setTimeout(close, 1000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Tente novamente.";
      console.error("Erro na edição:", e);
      toast.error("Erro ao atualizar denúncia", { description: msg });
    }
  };

  const canNext = [
    true, // photo step optional
    address.length > 3 && city.length > 0,
    !!category,
    !!title,
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full sm:max-w-lg glass-card rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto shadow-elegant">
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Passo {step + 1} de {STEPS.length}</p>
              <h2 className="font-display text-xl font-bold text-foreground">Editar Ocorrência</h2>
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

          {/* Step Content */}
          {step === 0 && (
            <PhotoStep
              photos={photos}
              onPickPhotos={onPickPhotos}
              onRemovePhoto={(i) => setPhotos((p) => p.filter((_, x) => x !== i))}
            />
          )}

          {step === 1 && (
            <LocationStep
              locating={locating}
              coords={coords}
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
              autoLocate={true}
              onAutoLocate={handleAutoLocate}
              onRetryLocate={() => {
                handleAutoLocate();
              }}
            />
          )}

          {step === 2 && (
            <CategoryStep
              category={category}
              setCategory={setCategory}
              severity={severity}
              setSeverity={setSeverity}
            />
          )}

          {step === 3 && (
            <DetailsStep
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              reporterName=""
              setReporterName={() => {}}
            />
          )}

          {/* Footer */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-border/50">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} className="font-semibold">
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
                disabled={!canNext[step] || updateProblem.isPending}
                className="flex-1 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-95"
              >
                {updateProblem.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>Salvar Alterações</>
                )}
              </Button>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default EditProblemModal;