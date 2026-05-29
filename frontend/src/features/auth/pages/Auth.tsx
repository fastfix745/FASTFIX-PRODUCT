import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  useSignUpMutation,
  useSignInMutation,
  useResetPasswordMutation,
  useGoogleSignInMutation,
} from "@/features/auth/hooks/mutations/useAuthMutations";
import { friendlyAuthError, type AuthMode } from "@/features/auth/utils/friendlyError";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

// Subformulários refatorados
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const signUp = useSignUpMutation();
  const signIn = useSignInMutation();
  const resetPassword = useResetPasswordMutation();
  const googleSignIn = useGoogleSignInMutation();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loading = signUp.isPending || signIn.isPending || resetPassword.isPending || googleSignIn.isPending;

  useEffect(() => {
    if (!authLoading && user) navigate("/app", { replace: true });
  }, [user, authLoading, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha precisa ter ao menos 6 caracteres.");
      return;
    }

    try {
      await signIn.mutateAsync({ email: email.trim(), password });
      navigate("/app", { replace: true });
    } catch (err) {
      const f = friendlyAuthError((err as Error).message);
      toast.error(f.title, { description: f.description });
      if (f.hint) setMode(f.hint);
    }
  };

  const handleSignUpSubmit = async (data: {
    email: string;
    password: string;
    displayName: string;
    city: string;
  }) => {
    try {
      const result = await signUp.mutateAsync({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        city: data.city,
      });

      if (result.session) {
        toast.success("Conta criada!", { description: "Bem-vindo ao FastFix." });
        navigate("/app", { replace: true });
      } else {
        toast.success("Confirme seu e-mail", {
          description: "Enviamos um link de ativação para " + data.email,
        });
        setMode("login");
        setEmail(data.email);
        setPassword("");
      }
    } catch (err) {
      const f = friendlyAuthError((err as Error).message);
      toast.error(f.title, { description: f.description });
      if (f.hint) setMode(f.hint);
    }
  };

  const handleForgotPasswordSubmit = async (targetEmail: string) => {
    try {
      await resetPassword.mutateAsync(targetEmail);
      toast.success("Link enviado", { description: "Verifique sua caixa de entrada." });
      setMode("login");
      setEmail(targetEmail);
    } catch (err) {
      const f = friendlyAuthError((err as Error).message);
      toast.error(f.title, { description: f.description });
    }
  };

  const handleGoogle = async () => {
    try {
      await googleSignIn.mutateAsync();
    } catch {
      toast.error("Falha no login com Google", { description: "Tente novamente em instantes." });
    }
  };

  const title = mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha";
  const subtitle =
    mode === "login"
      ? "Acesse para reportar e acompanhar"
      : mode === "signup"
      ? "Junte-se à transformação da sua cidade"
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

        {mode === "login" && (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSubmit={handleLoginSubmit}
            setMode={setMode}
          />
        )}

        {mode === "signup" && (
          <SignUpForm
            loading={loading}
            onSubmit={handleSignUpSubmit}
          />
        )}

        {mode === "forgot" && (
          <ForgotPasswordForm
            loading={loading}
            onSubmit={handleForgotPasswordSubmit}
            setMode={setMode}
          />
        )}

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
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </Button>
          </>
        )}

        {mode !== "forgot" && (
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
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
