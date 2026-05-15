import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";

const CEARA_CITIES = [
  "Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral",
  "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Pacatuba",
  "Aquiraz", "Crateús", "Pacajus", "Russas", "Tianguá", "Outra",
];

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("Fortaleza");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { display_name: displayName, city },
          },
        });
        if (error) throw error;
        toast.success("Cadastro realizado!", { description: "Você já pode acessar a plataforma." });
        navigate("/app");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/app");
      }
    } catch (err) {
      toast.error("Erro de autenticação", { description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/app`,
    });
    if (result.error) {
      toast.error("Falha no login com Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-elegant animate-fade-in-up">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground">FastFix</h1>
            <p className="text-[10px] text-muted-foreground">Smart City Platform</p>
          </div>
        </Link>

        <h2 className="font-display text-2xl font-bold text-foreground">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "login" ? "Acesse para reportar e acompanhar" : "Junte-se à transformação da sua cidade"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 mt-6">
          {mode === "signup" && (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</label>
                <input
                  required value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cidade</label>
                <select
                  value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {CEARA_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
            <input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Senha</label>
            <input
              required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" minLength={6}
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-accent text-accent-foreground font-bold shadow-glow h-11 mt-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-muted-foreground">ou</span>
          </div>
        </div>

        <Button onClick={handleGoogle} disabled={loading} variant="outline" className="w-full h-11 font-semibold">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continuar com Google
        </Button>

        <button
          type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-center text-sm text-accent hover:underline mt-5 font-semibold"
        >
          {mode === "login" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
