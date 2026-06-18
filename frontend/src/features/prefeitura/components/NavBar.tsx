import { Link, useLocation } from "react-router-dom";
import { Building2, Landmark, ClipboardList } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/painel") {
      return currentPath === "/painel";
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#111827] border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-6">
            <Link to="/painel" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Landmark className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="text-white font-display font-bold text-sm">FastFix</span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                to="/painel"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/painel") && !isActive("/backoffice") && !isActive("/registrar")
                    ? "bg-accent text-accent-foreground"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Painel Público</span>
              </Link>

              <Link
                to="/backoffice"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/backoffice")
                    ? "bg-accent text-accent-foreground"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>Backoffice</span>
              </Link>

              <Link
                to="/registrar"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/registrar")
                    ? "bg-accent text-accent-foreground"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Registrar</span>
              </Link>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            FastFix Prefecture v1.0
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;