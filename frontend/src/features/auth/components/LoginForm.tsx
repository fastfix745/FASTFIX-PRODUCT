import { memo, useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { type AuthMode } from "@/features/auth/utils/friendlyError";

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  setMode: (mode: AuthMode) => void;
}

export const LoginForm = memo(({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  setMode,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form onSubmit={onSubmit} className="space-y-3 mt-6" noValidate>
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
        <div className="flex items-baseline justify-between">
          <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Senha
          </label>
          <button
            type="button"
            onClick={() => setMode("forgot")}
            className="text-[11px] text-accent hover:underline font-semibold"
          >
            Esqueci minha senha
          </button>
        </div>
        <div className="relative mt-1.5">
          <input
            id="password"
            required
            type={showPassword ? "text" : "password"}
            minLength={6}
            autoComplete="current-password"
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
        {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-label="Carregando" /> : "Entrar"}
      </Button>
    </form>
  );
});

LoginForm.displayName = "LoginForm";
