import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { MapPin, Loader2, ArrowLeft } from "lucide-react";

const CEARA_CITIES = [
  "Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral",
  "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Pacatuba",
  "Aquiraz", "Crateús", "Pacajus", "Russas", "Tianguá", "Outra",
];

type Mode = "login" | "signup" | "forgot";

const friendlyError = (raw: string): { title: string; description?: string; hint?: Mode } => {
  const msg = (raw || "").toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid_credentials")) {
    return { title: "E-mail ou senha incorretos", description: "Verifique seus dados ou recupere a senha." };
  }
  if (msg.includes("user already registered") || msg.includes("user_already_exists")) {
    return { title: "E-mail já cadastrado", description: "Faça login com sua senha.", hint: "login" };
  }
  if (msg.includes("email not confirmed")) {
    return { title: "Confirme seu e-mail", description: "Enviamos um link de confirmação para você." };
  }
  if (msg.includes("password should be") || msg.includes("weak password")) {
    return { title: "Senha muito fraca", description: "Use ao menos 6 caracteres." };
  }
  if (msg.includes("rate limit") || msg.includes("too many")) {
    return { title: "Muitas tentativas", description: "Aguarde alguns instantes e tente novamente." };
  }
  if (msg.includes("network") || msg.includes("failed to fetch")) {
    return { title: "Sem conexão", description: "Verifique sua internet e tente novamente." };
  }
  return { title: "Não foi possível concluir", description: raw };
};

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("Fortaleza");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/app", { replace: true });
  }, [user, authLoading, navigate]);

  const validate = (): string | null => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Informe um e-mail válido.";
    if (mode !== "forgot") {
      if (password.length < 6) return "A senha precisa ter ao menos 6 caracteres.";
    }
    if (mode === "signup") {
      if (displayName.trim().length < 2) return "Informe seu nome.";
      if (!city) return "Selecione sua cidade.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) { toast.error(v); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { display_name: displayName.trim(), city },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Conta criada!", { description: "Bem-vindo ao FastFix." });
          navigate("/app", { replace: true });
        } else {
          toast.success("Confirme seu e-mail", {
            description: "Enviamos um link de ativação para " + email.trim(),
          });
          setMode("login");
          setPassword("");
        }
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        navigate("/app", { replace: true });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Link enviado", { description: "Verifique sua caixa de entrada." });
        setMode("login");
      }
    } catch (err) {
      const f = friendlyError((err as Error).message);
      toast.error(f.title, { description: f.description });
      if (f.hint) setMode(f.hint);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/app`,
      });
      if (result.error) {
        toast.error("Falha no login com Google", { description: "Tente novamente em instantes." });
        setLoading(false);
      }
      // se result.redirected, o browser navega — mantemos loading
    } catch {
      toast.error("Falha no login com Google");
      setLoading(false);
    }
  };

  const title = mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha";
  const subtitle =
    mode === "login" ? "Acesse para reportar e acompanhar"
    : mode === "signup" ? "Junte-se à transformação da sua cidade"
    : "Enviaremos um link para redefinir sua senha";

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-mesh p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-elegant animate-fade-in-up">
        <Link to="/" className="flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant transition-transform group-hover:scale-105">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground">FastFix</h1>
            <p className="text-[10px] text-muted-foreground">Smart City Platform</p>
          </div>
        </Link>

        <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-3 mt-6" noValidate>
          {mode === "signup" && (
            <>
              <div>
                <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</label>
                <input
                  id="name" required autoComplete="name"
                  value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                />
              </div>
              <div>
                <label htmlFor="city" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cidade</label>
                <select
                  id="city" value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                >
                  {CEARA_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-mail</label>
            <input
              id="email" required type="email" autoComplete="email" inputMode="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
            />
          </div>
          {mode !== "forgot" && (
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Senha</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] text-accent hover:underline font-semibold"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <input
                id="password" required type="password" minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
            </div>
          )}

          <Button
            type="submit" disabled={loading}
            className="w-full bg-gradient-accent text-accent-foreground font-bold shadow-glow h-11 mt-2 transition-transform active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-label="Carregando" /> : title}
          </Button>
        </form>

        {mode !== "forgot" && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">ou</span>
              </div>
            </div>

            <Button onClick={handleGoogle} disabled={loading} variant="outline" className="w-full h-11 font-semibold">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuar com Google
            </Button>
          </>
        )}

        {mode === "forgot" ? (
          <button
            type="button" onClick={() => setMode("login")}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-accent hover:underline mt-5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o login
          </button>
        ) : (
          <button
            type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-center text-sm text-accent hover:underline mt-5 font-semibold"
          >
            {mode === "login" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
