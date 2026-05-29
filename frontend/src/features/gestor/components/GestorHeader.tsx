import { Link } from "react-router-dom";
import { Shield, Eye, LogOut } from "lucide-react";
import NotificationBell from "@/features/notifications/components/NotificationBell";

interface GestorHeaderProps {
  signOut: () => void;
}

export const GestorHeader = ({ signOut }: GestorHeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Shield className="w-4 h-4 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-display text-base font-bold leading-tight">FastFix</h1>
          <p className="text-[10px] opacity-75">Painel do Gestor</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <Link
          to="/app"
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Visão Cidadão
        </Link>
        <button
          onClick={signOut}
          className="p-2 rounded-lg hover:bg-primary-foreground/10"
          aria-label="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
