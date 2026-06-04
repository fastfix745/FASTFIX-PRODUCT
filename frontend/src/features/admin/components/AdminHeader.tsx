import { Shield, Settings, LogOut, BarChart3, Globe, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface AdminHeaderProps {
  signOut: () => Promise<void>;
}

export const AdminHeader = ({ signOut }: AdminHeaderProps) => {
  const { profile, user } = useAuth();

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Admin';

  return (
    <header className="bg-gradient-primary text-primary-foreground px-4 sm:px-6 py-4 shadow-elegant">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
            <Shield className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight flex items-center gap-2">
              Painel Admin
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                GLOBAL
              </span>
            </h1>
            <p className="text-[10px] opacity-75 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Visão geral de todas as cidades
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{displayName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};