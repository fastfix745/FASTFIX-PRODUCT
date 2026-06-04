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
