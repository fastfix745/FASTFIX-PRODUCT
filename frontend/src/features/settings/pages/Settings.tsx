import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Shield,
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  Mail,
  Eye,
  EyeOff,
  LogOut
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { supabase } from "@/services/supabase/client";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

type Tab = "profile" | "notifications" | "security";

const Settings = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);

  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");

  // Update state when profile is loaded
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setCity(profile.city || "");
    }
  }, [profile]);

  // Notifications state
  const [notifyStatus, setNotifyStatus] = useState(true);
  const [notifyUpvotes, setNotifyUpvotes] = useState(true);

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          city: city.toLowerCase().trim()
        })
        .eq("user_id", user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar perfil", { description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha precisa ter ao menos 6 caracteres");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Erro ao alterar senha", { description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile" as Tab, label: "Perfil", icon: User },
    { id: "notifications" as Tab, label: "Notificações", icon: Bell },
    { id: "security" as Tab, label: "Segurança", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium hover:opacity-80"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="font-display text-lg font-bold">Configurações</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="glass-card rounded-xl p-5 space-y-5 animate-fade-in">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Informações do Perfil</h2>
              <p className="text-sm text-muted-foreground mt-1">Atualize suas informações pessoais</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  E-mail
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm"
                />
                <p className="text-[10px] text-muted-foreground mt-1">O e-mail não pode ser alterado</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Nome
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Cidade
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Fortaleza"
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full bg-gradient-accent text-accent-foreground font-bold"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Salvar</>}
            </Button>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="glass-card rounded-xl p-5 space-y-5 animate-fade-in">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Preferências de Notificações</h2>
              <p className="text-sm text-muted-foreground mt-1">Escolha como deseja receber notificações</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Status do reporte</p>
                  <p className="text-xs text-muted-foreground">Receba alertas quando o status mudar</p>
                </div>
                <button
                  onClick={() => setNotifyStatus(!notifyStatus)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    notifyStatus ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    notifyStatus ? "translate-x-5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Novos apoios</p>
                  <p className="text-xs text-muted-foreground">Receba alertas quando alguém apoiar seu reporte</p>
                </div>
                <button
                  onClick={() => setNotifyUpvotes(!notifyUpvotes)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    notifyUpvotes ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    notifyUpvotes ? "translate-x-5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>
            </div>

            <Button className="w-full bg-gradient-accent text-accent-foreground font-bold">
              <><Save className="w-4 h-4 mr-2" /> Salvar preferências</>
            </Button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="glass-card rounded-xl p-5 space-y-5 animate-fade-in">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Segurança</h2>
              <p className="text-sm text-muted-foreground mt-1">Gerencie sua senha e segurança</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nova Senha
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Confirmar Senha
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={saving || !newPassword || !confirmPassword}
              className="w-full bg-gradient-accent text-accent-foreground font-bold"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4 mr-2" /> Alterar Senha</>}
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Precisa de ajuda? Entre em contato com o suporte.
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="w-full text-severity-critical border-severity-critical/30 hover:bg-severity-critical/10"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sair da conta
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;