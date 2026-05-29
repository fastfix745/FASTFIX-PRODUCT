import { MapPin, Loader2 } from "lucide-react";

interface LocationStepProps {
  locating: boolean;
  coords: { lat: number; lng: number } | null;
  address: string;
  setAddress: (address: string) => void;
  onRetryLocate: () => void;
}

export const LocationStep = ({
  locating,
  coords,
  address,
  setAddress,
  onRetryLocate,
}: LocationStepProps) => {
  return (
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
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Endereço de referência
        </label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ex: Av. Beira Mar, 120 - Meireles, Fortaleza"
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      {!coords && !locating && (
        <button
          type="button"
          onClick={onRetryLocate}
          className="text-xs text-accent font-semibold hover:underline"
        >
          Tentar detectar novamente
        </button>
      )}
    </div>
  );
};
