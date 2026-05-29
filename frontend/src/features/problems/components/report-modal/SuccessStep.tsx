import { CheckCircle2 } from "lucide-react";

export const SuccessStep = () => {
  return (
    <div className="py-12 text-center animate-scale-in">
      <div className="w-16 h-16 mx-auto rounded-full bg-success/15 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </div>
      <h3 className="font-display font-bold text-xl text-foreground">Reporte registrado!</h3>
      <p className="text-sm text-muted-foreground mt-2">Sua ocorrência foi enviada à prefeitura.</p>
    </div>
  );
};
