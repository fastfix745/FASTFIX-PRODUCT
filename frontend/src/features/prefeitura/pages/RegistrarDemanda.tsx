import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapIcon,
  ArrowLeft,
  ArrowRight,
  Check,
  Car,
  Lightbulb,
  Droplets,
  Trash2,
  FileText,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Copy
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { gerarProtocolo, tiposProblema } from "../data/mockData";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

const stepLabels = [
  { step: 1, label: "Tipo" },
  { step: 2, label: "Local" },
  { step: 3, label: "Dados" }
];

const RegistrarDemanda = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isComplete, setIsComplete] = useState(false);
  const [protocolo, setProtocolo] = useState("");

  // Dados do formulário
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    endereco: "",
    referencia: "",
    descricao: "",
    nome: "",
    cpf: "",
    telefone: "",
    email: ""
  });

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedType !== null;
    if (currentStep === 2) return formData.endereco.trim() !== "" && formData.descricao.trim() !== "";
    if (currentStep === 3) return formData.nome.trim() !== "";
    return false;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Gerar protocolo
      const newProtocolo = gerarProtocolo();
      setProtocolo(newProtocolo);
      setIsComplete(true);
    } else {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/prefeitura");
    } else {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const copyProtocol = () => {
    navigator.clipboard.writeText(protocolo);
    toast.success("Protocolo copiado!");
  };

  // Tela de sucesso
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center shadow-elegant animate-scale-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-severity-low/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-severity-low" />
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Demandа Registrada!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sua demanda foi registrada com sucesso. Anote o protocolo abaixo para acompanhamento.
          </p>

          <div className="bg-muted/50 rounded-2xl p-6 mb-6">
            <p className="text-xs text-muted-foreground mb-1">Protocolo de Atendimento</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-3xl font-bold text-foreground tracking-wider">
                {protocolo}
              </span>
              <button
                onClick={copyProtocol}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Copiar"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Você receberá atualizações sobre o status da sua demanda por e-mail ou telefone.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate("/prefeitura")}
              className="w-full bg-gradient-accent text-accent-foreground font-bold"
            >
              Voltar ao Painel
            </Button>
            <Button
              onClick={() => {
                setCurrentStep(1);
                setIsComplete(false);
                setSelectedType(null);
                setFormData({
                  endereco: "",
                  referencia: "",
                  descricao: "",
                  nome: "",
                  cpf: "",
                  telefone: "",
                  email: ""
                });
              }}
              variant="outline"
              className="w-full"
            >
              Registrar Nova Demanda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render step 1: Tipo do problema
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-foreground">Qual é o problema?</h3>
        <p className="text-sm text-muted-foreground mt-1">Selecione a categoria que melhor descreve</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiposProblema.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => setSelectedType(tipo.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedType === tipo.id
                ? "border-accent bg-accent/10"
                : "border-border hover:border-accent/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tipo.icone}</span>
              <div>
                <p className="font-semibold text-foreground">{tipo.titulo}</p>
                <p className="text-xs text-muted-foreground mt-1">{tipo.descricao}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Render step 2: Localização
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-foreground">Onde fica?</h3>
        <p className="text-sm text-muted-foreground mt-1">Informe o endereço do problema</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="endereco" className="text-sm font-medium text-foreground">
            Endereço *
          </Label>
          <div className="relative mt-1.5">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="endereco"
              placeholder="Ex: Av. Principal, 123"
              value={formData.endereco}
              onChange={(e) => updateForm("endereco", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="referencia" className="text-sm font-medium text-foreground">
            Ponto de Referência
          </Label>
          <Input
            id="referencia"
            placeholder="Ex: Em frente ao mercado"
            value={formData.referencia}
            onChange={(e) => updateForm("referencia", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="descricao" className="text-sm font-medium text-foreground">
            Descrição do Problema *
          </Label>
          <Textarea
            id="descricao"
            placeholder="Descreva o problema com o máximo de detalhes..."
            value={formData.descricao}
            onChange={(e) => updateForm("descricao", e.target.value)}
            className="mt-1.5 min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );

  // Render step 3: Dados do cidadão
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-foreground">Seus Dados</h3>
        <p className="text-sm text-muted-foreground mt-1">Informe seus dados para contato (exceto nome é obrigatório)</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="nome" className="text-sm font-medium text-foreground">
            Nome Completo *
          </Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="nome"
              placeholder="Seu nome"
              value={formData.nome}
              onChange={(e) => updateForm("nome", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cpf" className="text-sm font-medium text-foreground">
            CPF
          </Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => updateForm("cpf", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="telefone" className="text-sm font-medium text-foreground">
            Telefone
          </Label>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={(e) => updateForm("telefone", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            E-mail
          </Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => updateForm("email", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Seus dados são protegidos e usados apenas para contato sobre a demanda.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-elegant">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/prefeitura" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <MapIcon className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-display text-base font-bold leading-tight">FastFix</h1>
                <p className="text-[10px] opacity-75">Prefeitura Municipal</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Indicador de progresso */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {stepLabels.map((item, index) => {
              const isActive = currentStep === item.step;
              const isCompleted = currentStep > item.step;
              const isLast = index === stepLabels.length - 1;

              return (
                <div key={item.step} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isCompleted
                          ? "bg-severity-low text-white"
                          : isActive
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={`flex-1 h-0.5 mx-3 transition-all ${
                        isCompleted ? "bg-severity-low" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo do passo */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="glass-card rounded-2xl p-6 shadow-card">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </main>

      {/* Botões de navegação */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? "Cancelar" : "Voltar"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-accent text-accent-foreground font-bold"
          >
            {currentStep === 3 ? "Registrar" : "Próximo"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrarDemanda;