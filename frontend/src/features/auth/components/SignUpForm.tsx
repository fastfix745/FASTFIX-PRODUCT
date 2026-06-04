import React, { useState, memo } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

interface SignUpFormProps {
  loading: boolean;
  onSubmit: (data: { email: string; password: string; displayName: string; city: string }) => void;
}

export const SignUpForm = memo(({ loading, onSubmit }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");

  const validate = (): string | null => {
    if (!displayName.trim() || displayName.trim().length < 2) return "Informe seu nome.";
    if (!city.trim()) return "Informe sua cidade.";
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
        <label htmlFor="city" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Cidade
        </label>
        <input
          id="city"
          required
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ex: Fortaleza"
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
        />
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
        <div className="relative mt-1.5">
          <input
            id="password"
            required
            type={showPassword ? "text" : "password"}
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Eye className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
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
