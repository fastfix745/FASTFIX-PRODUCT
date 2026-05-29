import React, { useState, memo } from "react";
import { Loader2, Locate, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCityDetection } from "@/features/auth/hooks/useCityDetection";
import { toast } from "sonner";

interface SignUpFormProps {
  loading: boolean;
  onSubmit: (data: { email: string; password: string; displayName: string; city: string }) => void;
}

export const SignUpForm = memo(({ loading, onSubmit }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { city, detectingCity, detectCity } = useCityDetection();

  const validate = (): string | null => {
    if (!displayName.trim() || displayName.trim().length < 2) return "Informe seu nome.";
    if (!city) return "Toque em Detectar via GPS para informar sua cidade.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Informe um e-mail válido.";
    if (password.length < 6) return "A senha precisa ter ao menos 6 caracteres.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    onSubmit({
      email: email.trim(),
      password,
      displayName: displayName.trim(),
      city,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-6" noValidate>
      <div>
        <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Nome
        </label>
        <input
          id="name"
          required
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Seu nome"
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Cidade
        </label>
        <div className="mt-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={detectCity}
            disabled={detectingCity}
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-border bg-card text-foreground text-sm hover:bg-muted transition disabled:opacity-70"
          >
            {detectingCity ? <Loader2 className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
            <span className="font-semibold">{city ? "Atualizar" : "Detectar via GPS"}</span>
          </button>
          <div className="flex-1 min-w-0 px-3 py-3 rounded-xl border border-border bg-muted/40 text-sm text-foreground flex items-center gap-2 truncate justify-center sm:justify-start">
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

      <div>
        <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Senha
        </label>
        <input
          id="password"
          required
          type="password"
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-accent text-accent-foreground font-bold shadow-glow h-11 mt-2 transition-transform active:scale-[0.98]"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-label="Carregando" /> : "Criar conta"}
      </Button>
    </form>
  );
});

SignUpForm.displayName = "SignUpForm";
