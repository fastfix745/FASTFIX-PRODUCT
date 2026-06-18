import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Camera,
  Plus
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import NavBar from "../components/NavBar";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

interface FormData {
  tipoProblema: string;
  descricao: string;
  bairro: string;
  nome: string;
  contato: string;
}

const tipoProblemas = [
  { id: "vias", label: "Vias/Buracos", icon: "🚧" },
  { id: "iluminacao", label: "Iluminação", icon: "💡" },
  { id: "saneamento", label: "Saneamento", icon: "🌊" },
  { id: "pracas", label: "Praças/Parques", icon: "🌳" },
  { id: "transito", label: "Trânsito", icon: "🚦" },
  { id: "acessibilidade", label: "Acessibilidade", icon: "♿" }
];

const bairros = ["Centro", "Jardim América", "Vila Nova", "Boa Vista", "São Judas"];

const steps = [
  { step: 1, label: "Tipo do problema" },
  { step: 2, label: "Localização" },
  { step: 3, label: "Seus dados" }
];

const Registro = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isComplete, setIsComplete] = useState(false);
  const [protocolo, setProtocolo] = useState("");

  const [formData, setFormData] = useState<FormData>({
    tipoProblema: "",
    descricao: "",
    bairro: "",
    nome: "",
    contato: ""
  });

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.tipoProblema !== "" && formData.descricao.trim() !== "";
    if (currentStep === 2) return formData.bairro !== "";
    if (currentStep === 3) return formData.nome.trim() !== "";
    return false;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Gerar protocolo
      const numero = Math.floor(Math.random() * 9000) + 1000;
      const newProtocolo = `PFX-2026-${numero}`;
      setProtocolo(newProtocolo);
      setIsComplete(true);
      toast.success("Demanda registrada com sucesso!");
    } else {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/painel");
    } else {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsComplete(false);
    setFormData({
      tipoProblema: "",
      descricao: "",
      bairro: "",
      nome: "",
      contato: ""
    });
  };

  // Tela de sucesso
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center shadow-elegant animate-scale-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Demanda registrada!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sua demanda foi registrada com sucesso. Anote o protocolo abaixo:
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-muted-foreground mb-1">Protocolo de Atendimento</p>
            <span className="font-mono text-3xl font-bold text-blue-600 tracking-wider">
              {protocolo}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate("/painel")}
              className="w-full bg-gradient-accent text-accent-foreground font-bold"
            >
              Voltar ao Painel
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              Registrar outra
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Indicador de progresso
  const renderProgress = () => (
    <div className="bg-muted/30 border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((item, index) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            const isLast = index === steps.length - 1;

            return (
              <div key={item.step} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white"
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
                      isCompleted ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Passo 1: Tipo do problema
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-foreground">Qual tipo de problema?</h3>
        <p className="text-sm text-muted-foreground mt-1">Selecione a categoria que melhor descreve</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tipoProblemas.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => updateForm("tipoProblema", tipo.id)}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              formData.tipoProblema === tipo.id
                ? "border-accent bg-accent/10"
                : "border-border hover:border-accent/50 hover:bg-muted/50"
            }`}
          >
            <span className="text-2xl block mb-2">{tipo.icon}</span>
            <span className="font-semibold text-foreground text-sm">{tipo.label}</span>
          </button>
        ))}
      </div>

      <div>
        <Label htmlFor="descricao" className="text-sm font-medium text-foreground">
          Descreva o problema *
        </Label>
        <Textarea
          id="descricao"
          placeholder="Descreva o problema com o máximo de detalhes possível..."
          value={formData.descricao}
          onChange={(e) => updateForm("descricao", e.target.value)}
          className="mt-1.5 min-h-[100px]"
        />
      </div>
    </div>
  );

  // Passo 2: Localização
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-foreground">Onde está o problema?</h3>
        <p className="text-sm text-muted-foreground mt-1">Informe a localização</p>
      </div>

      <div>
        <Label htmlFor="bairro" className="text-sm font-medium text-foreground">
          Bairro *
        </Label>
        <Select value={formData.bairro} onValueChange={(v) => updateForm("bairro", v)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Selecione o bairro" />
          </SelectTrigger>
          <SelectContent>
            {bairros.map((bairro) => (
              <SelectItem key={bairro} value={bairro}>
                {bairro}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium text-foreground">
          Adicionar foto
        </Label>
        <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 hover:bg-muted/30 transition-colors cursor-pointer">
          <Camera className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Clique para adicionar uma foto
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Visual apenas — funcionalidade de upload não implementada)
          </p>
        </div>
      </div>
    </div>
  );

  // Passo 3: Dados do cidadão
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-foreground">Seus dados para acompanhamento</h3>
        <p className="text-sm text-muted-foreground mt-1">Informe seus dados de contato</p>
      </div>

      <div>
        <Label htmlFor="nome" className="text-sm font-medium text-foreground">
          Nome completo *
        </Label>
        <div className="relative mt-1.5">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="nome"
            placeholder="Seu nome completo"
            value={formData.nome}
            onChange={(e) => updateForm("nome", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contato" className="text-sm font-medium text-foreground">
          WhatsApp ou E-mail
        </Label>
        <div className="relative mt-1.5">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="contato"
            placeholder="(00) 00000-0000 ou seu@email.com"
            value={formData.contato}
            onChange={(e) => updateForm("contato", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <p className="text-xs text-green-700 dark:text-green-400">
          <strong>Confidencialidade:</strong> Seus dados são protegidos e usados apenas para contato sobre a demanda. Não serão compartilhados.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {renderProgress()}

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="glass-card rounded-2xl p-6 shadow-card">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </main>

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
            {currentStep === 3 ? "Enviar demanda ✓" : "Continuar"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Registro;