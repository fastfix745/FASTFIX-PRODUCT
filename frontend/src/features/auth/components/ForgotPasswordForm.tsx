import React, { useState, memo } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { type AuthMode } from "@/features/auth/utils/friendlyError";

interface ForgotPasswordFormProps {
  loading: boolean;
  onSubmit: (email: string) => void;
  setMode: (mode: AuthMode) => void;
}

export const ForgotPasswordForm = memo(({ loading, onSubmit, setMode }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");

  const validate = (): string | null => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Informe um e-mail válido.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    onSubmit(email.trim());
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3 mt-6" noValidate>
        <div>
          <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            E-mail
          </label>
          <input
            id="email"
            required
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-accent text-accent-foreground font-bold shadow-glow h-11 mt-2 transition-transform active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-label="Carregando" /> : "Recuperar Senha"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setMode("login")}
        className="w-full flex items-center justify-center gap-1.5 text-sm text-accent hover:underline mt-5 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o login
      </button>
    </>
  );
});

ForgotPasswordForm.displayName = "ForgotPasswordForm";
