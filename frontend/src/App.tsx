import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProviders } from "@/layouts/AppProviders";
import { Loader2 } from "lucide-react";
import { MAINTENANCE_MODE } from "@/config";

const Index = lazy(() => import("@/features/landing/pages/Index"));
const Auth = lazy(() => import("@/features/auth/pages/Auth"));
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPassword"));
const CitizenApp = lazy(() => import("@/features/citizen/pages/CitizenApp"));
const GestorDashboard = lazy(() => import("@/features/gestor/pages/GestorDashboard"));
const GestorPlanos = lazy(() => import("@/features/gestor/pages/GestorPlanos"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const Transparencia = lazy(() => import("@/features/transparencia/pages/Transparencia"));
const Settings = lazy(() => import("@/features/settings/pages/Settings"));
const NotFound = lazy(() => import("@/layouts/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center flex flex-col items-center gap-2">
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
      <p className="text-muted-foreground text-sm font-medium animate-pulse">
        Carregando...
      </p>
    </div>
  </div>
);

const Maintenance = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
    <h1 className="text-2xl font-bold">🔧 Sistema em manutenção</h1>
    <p className="text-muted-foreground mt-2">
      Estamos corrigindo bugs. Voltamos em breve.
    </p>
  </div>
);

const App = () => {
  if (MAINTENANCE_MODE) {
    return (
      <AppProviders>
        <Maintenance />
      </AppProviders>
    );
  }

  return (
    <AppProviders>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/app" element={<CitizenApp />} />
            <Route path="/gestor" element={<GestorDashboard />} />
            <Route path="/gestor/planos" element={<GestorPlanos />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/transparencia" element={<Transparencia />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;