import { Camera } from "lucide-react";

interface PhotoStepProps {
  photos: string[];
  onPickPhotos: (files: FileList | null) => void;
  onRemovePhoto: (index: number) => void;
}

export const PhotoStep = ({ photos, onPickPhotos, onRemovePhoto }: PhotoStepProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <label className="block w-full h-44 rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:border-accent hover:bg-accent/5 cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
        <Camera className="w-10 h-10 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Tirar foto ou anexar</span>
        <span className="text-[11px] text-muted-foreground">Até 5 imagens — opcional</span>
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
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
                type="button"
                onClick={() => onRemovePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/70 text-background text-xs flex items-center justify-center"
                aria-label="Remover foto"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
