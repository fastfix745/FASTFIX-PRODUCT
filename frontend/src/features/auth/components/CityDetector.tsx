import { memo } from "react";
import { Loader2, Locate, CheckCircle2 } from "lucide-react";

interface CityDetectorProps {
  city: string;
  detectingCity: boolean;
  onDetect: () => void;
}

export const CityDetector = memo(({ city, detectingCity, onDetect }: CityDetectorProps) => {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cidade</label>
      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={onDetect}
          disabled={detectingCity}
          className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-3 rounded-xl border border-border bg-card text-foreground text-sm hover:bg-muted transition disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {detectingCity ? <Loader2 className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
          <span className="font-semibold">{city ? "Atualizar" : "Detectar via GPS"}</span>
        </button>
        <div className="flex-1 min-w-0 px-3 py-3 rounded-xl border border-border bg-muted/40 text-sm text-foreground flex items-center gap-2 truncate">
          {city ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span className="truncate">{city}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Nenhuma localização detectada</span>
          )}
        </div>
      </div>
    </div>
  );
});

CityDetector.displayName = "CityDetector";
