import { Link, useLocation } from "react-router-dom";
import { Building2, Landmark, User, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const NavBar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/20"
      style={{ backgroundColor: "#1B3A6B" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo FastFix */}
          <Link to="/painel" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center">
              <Landmark className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-display font-bold text-lg">FastFix</span>
          </Link>

          {/* Centro: dois grupos separados */}
          <div className="hidden md:flex items-center gap-6">
            {/* Grupo Cidadão */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white/60 text-xs font-medium">
                <User className="w-3.5 h-3.5" />
                <span>Cidadão</span>
              </div>
              <Link
                to="/painel"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/painel")
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Painel Público
              </Link>
              <Link
                to="/registrar"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/registrar")
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Registrar
              </Link>
            </div>

            {/* Divisor vertical */}
            <div className="w-px h-8 bg-white/20" />

            {/* Grupo Prefeitura */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white/60 text-xs font-medium">
                <Building2 className="w-3.5 h-3.5" />
                <span>Prefeitura</span>
              </div>
              <Link
                to="/backoffice"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/backoffice")
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Backoffice
              </Link>
            </div>
          </div>

          {/* Voltar ao site */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            )}
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar ao site</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;