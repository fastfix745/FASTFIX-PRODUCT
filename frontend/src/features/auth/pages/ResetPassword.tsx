import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { usePasswordRecovery } from "@/features/auth/hooks/usePasswordRecovery";
import { useUpdatePasswordMutation } from "@/features/auth/hooks/mutations/useAuthMutations";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const hasRecovery = usePasswordRecovery();
  const updatePassword = useUpdatePasswordMutation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("A senha precisa ter ao menos 6 caracteres.");
    if (password !== confirm) return toast.error("As senhas não conferem.");

    try {
      await updatePassword.mutateAsync(password);
      toast.success("Senha atualizada", { description: "Você já pode acessar." });
      navigate("/app", { replace: true });
    } catch (err) {
      toast.error("Não foi possível redefinir", { description: (err as Error).message });
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-mesh p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-elegant animate-fade-in-up">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground">FastFix</h1>
            <p className="text-[10px] text-muted-foreground">Redefinir senha</p>
          </div>
        </div>

        {!hasRecovery ? (
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Link inválido ou expirado</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Solicite um novo e-mail de recuperação na tela de login.
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full mt-5 h-11">Voltar ao login</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <h2 className="font-display text-2xl font-bold text-foreground">Nova senha</h2>
            <p className="text-sm text-muted-foreground !mt-1">Escolha uma senha segura com 6+ caracteres.</p>

            <div>
              <label htmlFor="pwd" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nova senha</label>
              <input
                id="pwd" type="password" required minLength={6} autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
            </div>
            <div>
              <label htmlFor="pwd2" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirmar senha</label>
              <input
                id="pwd2" type="password" required minLength={6} autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
            </div>

            <Button type="submit" disabled={updatePassword.isPending} className="w-full bg-gradient-accent text-accent-foreground font-bold shadow-glow h-11 mt-2">
              {updatePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
