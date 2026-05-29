import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { useProblems } from "@/features/problems/hooks/useProblems";
import BeforeAfterSlider from "@/features/problems/components/BeforeAfterSlider";
import { categoryConfig, formatDateBR } from "@/features/problems/config/problems";

const Transparencia = () => {
  const { data: problems = [], isLoading } = useProblems();
  const publicProblems = problems.filter((p) => p.isPublic);
  const showcases = publicProblems.filter((p) => p.status === "resolved" && p.beforeImages.length > 0 && p.afterImages.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-primary-foreground px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Início</span>
          </Link>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-75">Mural Público</p>
            <h1 className="font-display font-bold">Transparência</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Resultados públicos da gestão urbana
          </h2>
          <p className="text-muted-foreground mt-3">
            Casos resolvidos e marcados como públicos pelos gestores. Todas as cidades, em um só lugar.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Carregando...</p>
        ) : (
          <>
            {showcases.length > 0 && (
              <section className="mb-12">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Antes & Depois</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {showcases.map((p) => (
                    <div key={p.id} className="glass-card rounded-2xl p-4">
                      <BeforeAfterSlider before={p.beforeImages[0]} after={p.afterImages[0]} />
                      <div className="mt-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-success">Resolvido · {p.city}</p>
                        <h4 className="font-display font-bold text-foreground mt-1">{p.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {p.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Todos os casos públicos ({publicProblems.length})
              </h3>
              {publicProblems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Nenhum caso público publicado ainda.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publicProblems.map((p) => {
                    const cat = categoryConfig[p.category];
                    const Icon = cat.icon;
                    return (
                      <div key={p.id} className="glass-card rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1.5 rounded-lg bg-muted ${cat.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{p.city}</span>
                        </div>
                        <h4 className="font-display font-bold text-foreground text-sm">{p.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-2">{formatDateBR(p.createdAt)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Transparencia;
