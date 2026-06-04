import { useState, lazy, Suspense } from "react";
import { Loader2, Shield, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useProblems,
  useUpdateStatus,
  useTogglePublic,
  useUpdateMedia,
  useUpdateProblemResponse,
  uploadProblemMedia,
  Problem,
} from "@/features/problems/hooks/useProblems";
import { Status } from "@/features/problems/config/problems";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import { KpiSkeleton, TableSkeleton } from "@/shared/components/ui/SkeletonLoaders";

// Import subcomponents
import { AdminHeader } from "../components/AdminHeader";
import { KpiCards } from "@/features/gestor/components/KpiCards";
import { ProblemsTable } from "@/features/gestor/components/ProblemsTable";

// Importação lazy do modal para otimização de performance
const ProblemDetailsModal = lazy(() => import("@/features/gestor/components/ProblemDetailsModal"));

const AdminDashboard = () => {
  const { user, roles, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Admin busca todos os problemas (sem filtro de cidade)
  const { data: problems = [], isLoading } = useProblems();
  const updateStatus = useUpdateStatus();
  const togglePublic = useTogglePublic();
  const updateMedia = useUpdateMedia();
  const sendResponse = useUpdateProblemResponse();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);

  const isAdmin = roles.includes("admin");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
        <div className="glass-card rounded-3xl p-8 max-w-sm text-center shadow-elegant">
          <Shield className="w-10 h-10 mx-auto text-accent mb-3" />
          <h2 className="font-display font-bold text-xl text-foreground">Acesso restrito</h2>
          <p className="text-sm text-muted-foreground mt-2">Faça login para acessar o painel do admin.</p>
          <Button onClick={() => navigate("/auth")} className="mt-5 w-full bg-gradient-accent text-accent-foreground font-bold">
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center shadow-elegant">
          <Shield className="w-10 h-10 mx-auto text-severity-high mb-3" />
          <h2 className="font-display font-bold text-xl text-foreground">Permissão necessária</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Esta área é exclusiva para administradores. Solicite acesso ao administrador da plataforma.
          </p>
          <Button onClick={() => navigate("/app")} variant="outline" className="mt-5">
            Voltar ao app
          </Button>
        </div>
      </div>
    );
  }

  // Calcular estatísticas globais
  const totalProblems = problems.length;
  const pending = problems.filter((p) => p.status === "pending").length;
  const inProgress = problems.filter((p) => p.status === "in_progress").length;
  const resolved = problems.filter((p) => p.status === "resolved").length;
  const avgUpvotes = totalProblems > 0 ? Math.round(problems.reduce((s, p) => s + p.upvotes, 0) / totalProblems) : 0;

  // Agrupar problemas por cidade para显示
  const problemsByCity: Record<string, Problem[]> = {};
  problems.forEach((p) => {
    const cityMatch = p.address.match(/- ([^,]+)$/);
    const city = cityMatch ? cityMatch[1].trim() : "Outra";
    if (!problemsByCity[city]) problemsByCity[city] = [];
    problemsByCity[city].push(p);
  });

  // Pegar os 5 últimos reportes
  const latestProblems = [...problems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleStatusChange = (id: string, newStatus: Status) => {
    updateStatus.mutate({ id, status: newStatus });
    if (selectedProblem?.id === id) setSelectedProblem((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleTogglePublic = (id: string, isPublic: boolean) => {
    togglePublic.mutate(
      { id, isPublic },
      {
        onSuccess: () => toast.success(isPublic ? "Denúncia pública" : "Denúncia privada"),
      }
    );
    if (selectedProblem?.id === id) setSelectedProblem((prev) => (prev ? { ...prev, isPublic } : null));
  };

  const handleUpload = async (kind: "before" | "after", files: FileList | null) => {
    if (!files || !selectedProblem) return;
    const setter = kind === "before" ? setUploadingBefore : setUploadingAfter;
    setter(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files).slice(0, 4)) {
        urls.push(await uploadProblemMedia(f, `${selectedProblem.id}/${kind}`));
      }
      const current = kind === "before" ? selectedProblem.beforeImages : selectedProblem.afterImages;
      const next = [...current, ...urls];
      await updateMedia.mutateAsync({
        id: selectedProblem.id,
        ...(kind === "before" ? { before: next } : { after: next }),
      });
      setSelectedProblem((prev) =>
        prev
          ? {
              ...prev,
              ...(kind === "before" ? { beforeImages: next } : { afterImages: next }),
            }
          : null
      );
      toast.success(`Foto(s) "${kind === "before" ? "Antes" : "Depois"}" enviadas`);
    } catch (e) {
      toast.error("Erro no upload", { description: (e as Error).message });
    } finally {
      setter(false);
    }
  };

  const handleResponse = async (id: string, response: string) => {
    setSendingResponse(true);
    try {
      await sendResponse.mutateAsync({ id, response });
      setSelectedProblem((prev) =>
        prev
          ? {
              ...prev,
              response,
              responseCreatedAt: new Date().toISOString(),
            }
          : null
      );
      toast.success("Resposta enviada ao cidadão!");
    } catch (e) {
      toast.error("Erro ao enviar resposta", { description: (e as Error).message });
    } finally {
      setSendingResponse(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader signOut={signOut} />

      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <KpiSkeleton />
          <TableSkeleton />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* KPIs Globais */}
          <KpiCards pending={pending} inProgress={inProgress} resolved={resolved} avgUpvotes={avgUpvotes} />

          {/* Resumo por Cidade */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Problemas por Cidade
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(problemsByCity)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([city, cityProblems]) => {
                  const cityResolved = cityProblems.filter((p) => p.status === "resolved").length;
                  const cityPending = cityProblems.filter((p) => p.status === "pending").length;
                  const resolutionRate = cityProblems.length > 0 ? Math.round((cityResolved / cityProblems.length) * 100) : 0;

                  return (
                    <div
                      key={city}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => navigate(`/gestor?city=${encodeURIComponent(city)}`)}
                    >
                      <p className="text-sm font-semibold text-foreground truncate">{city}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cityProblems.length} problemas • {cityResolved} resolvidos
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-severity-low transition-all"
                          style={{ width: `${resolutionRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Últimos Reportes */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Últimos Reportes</h3>
            <div className="space-y-2">
              {latestProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => setSelectedProblem(problem)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{problem.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {problem.address}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ml-2 ${
                    problem.status === "resolved" ? "bg-severity-low/20 text-severity-low" :
                    problem.status === "in_progress" ? "bg-severity-medium/20 text-severity-medium" :
                    "bg-severity-high/20 text-severity-high"
                  }`}>
                    {problem.status === "resolved" ? "Resolvido" : problem.status === "in_progress" ? "Em Andamento" : "Pendente"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de Problemas */}
          <ProblemsTable
            problems={problems}
            onSelectProblem={setSelectedProblem}
            handleStatusChange={handleStatusChange}
            handleTogglePublic={handleTogglePublic}
          />
        </div>
      )}

      {/* Lazy loaded details modal */}
      <Suspense fallback={null}>
        {selectedProblem && (
          <ProblemDetailsModal
            selectedProblem={selectedProblem}
            onClose={() => setSelectedProblem(null)}
            handleStatusChange={handleStatusChange}
            handleTogglePublic={handleTogglePublic}
            handleUpload={handleUpload}
            handleResponse={handleResponse}
            uploadingBefore={uploadingBefore}
            uploadingAfter={uploadingAfter}
            sendingResponse={sendingResponse}
          />
        )}
      </Suspense>
    </div>
  );
};

export default AdminDashboard;