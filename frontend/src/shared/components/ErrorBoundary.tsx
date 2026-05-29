import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error captured by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-elegant text-center animate-fade-in-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-severity-critical/10 flex items-center justify-center mb-5 text-severity-critical border border-severity-critical/20">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground">Algo deu errado</h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Desculpe pelo transtorno. Ocorreu um erro inesperado na renderização do aplicativo.
            </p>
            {this.state.error && (
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-left overflow-x-auto max-h-32 text-[10px] font-mono text-muted-foreground">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Recarregar página
              </Button>
              <Button
                variant="outline"
                onClick={() => { window.location.href = "/"; }}
                className="flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
