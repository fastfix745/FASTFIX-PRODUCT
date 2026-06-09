import { useState, lazy, Suspense } from "react";
import { Loader2, Shield, MapPin, Cpu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  useProblemsByCityQuery,
  useUpdateStatus,
  useTogglePublic,
  useUpdateMedia,
  useDeleteProblem,
  uploadProblemMedia,
  Problem,
} from "@/features/problems/hooks/useProblems";
import { Status } from "@/features/problems/config/problems";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import { KpiSkeleton, TableSkeleton } from "@/shared/components/ui/SkeletonLoaders";

// Import subcomponents
import { GestorHeader } from "../components/GestorHeader";
import { KpiCards } from "../components/KpiCards";
import { HeatmapMock } from "../components/HeatmapMock";
import { PriorityList } from "../components/PriorityList";
import { ProblemsTable } from "../components/ProblemsTable";

// Importação lazy do modal para otimização de performance
const ProblemDetailsModal = lazy(() => import("../components/ProblemDetailsModal"));

const GestorDashboard = () => {
  const { user, profile, roles, isManager, loading, signOut } = useAuth();
  const navigate = useNavigate();
  // Se o gestor tiver cidade no perfil, filtra por cidade; se não tiver, busca todos os reportes
  const managerCity = profile?.city && profile.city.trim() !== "" ? profile.city : undefined;
  const isAdmin = roles.includes("admin");
  const { data: problems = [], isLoading } = useProblemsByCityQuery(managerCity);
  const updateStatus = useUpdateStatus();
  const togglePublic = useTogglePublic();
  const updateMedia = useUpdateMedia();
  const deleteProblem = useDeleteProblem();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

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
          <p className="text-sm text-muted-foreground mt-2">Faça login para acessar o painel do gestor.</p>
          <Button onClick={() => navigate("/auth")} className="mt-5 w-full bg-gradient-accent text-accent-foreground font-bold">
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  if (!isManager) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center shadow-elegant">
          <Shield className="w-10 h-10 mx-auto text-severity-high mb-3" />
          <h2 className="font-display font-bold text-xl text-foreground">Permissão necessária</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Esta área é exclusiva para gestores municipais. Solicite acesso ao administrador da plataforma.
          </p>
          <Button onClick={() => navigate("/app")} variant="outline" className="mt-5">
            Voltar ao app
          </Button>
        </div>
      </div>
    );
  }

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

  const handleDeleteProblem = (id: string) => {
    deleteProblem.mutate(
      { id },
      {
        onSuccess: () => toast.success("Denúncia excluída com sucesso"),
        onError: (err) => toast.error("Erro ao excluir", { description: (err as Error).message }),
      }
    );
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


  const totalProblems = problems.length;
  const pending = problems.filter((p) => p.status === "pending").length;
  const inProgress = problems.filter((p) => p.status === "in_progress").length;
  const resolved = problems.filter((p) => p.status === "resolved").length;
  const avgUpvotes = totalProblems > 0 ? Math.round(problems.reduce((s, p) => s + p.upvotes, 0) / totalProblems) : 0;

  // Pegar os 5 últimos reportes
  const latestProblems = [...problems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <GestorHeader signOut={signOut} isAdmin={isAdmin} />

      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <KpiSkeleton />
          <TableSkeleton />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <KpiCards pending={pending} inProgress={inProgress} resolved={resolved} avgUpvotes={avgUpvotes} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <HeatmapMock />
            <PriorityList problems={problems} onSelectProblem={setSelectedProblem} />
          </div>

          {/* Últimos Reportes */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Últimos Reportes</h3>
            {latestProblems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum reporte encontrado</p>
            ) : (
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
            )}
          </div>

          <ProblemsTable
            problems={problems}
            onSelectProblem={setSelectedProblem}
            handleStatusChange={handleStatusChange}
            handleTogglePublic={handleTogglePublic}
            handleDeleteProblem={handleDeleteProblem}
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
            uploadingBefore={uploadingBefore}
            uploadingAfter={uploadingAfter}
          />
        )}
      </Suspense>
    </div>
  );
};

export default GestorDashboard;
