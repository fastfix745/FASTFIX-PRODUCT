export type AuthMode = "login" | "signup" | "forgot";

export function friendlyAuthError(raw: string): {
  title: string;
  description?: string;
  hint?: AuthMode;
} {
  const msg = (raw || "").toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid_credentials")) {
    return { title: "E-mail ou senha incorretos", description: "Verifique seus dados ou recupere a senha." };
  }
  if (msg.includes("user already registered") || msg.includes("user_already_exists")) {
    return { title: "E-mail já cadastrado", description: "Faça login com sua senha.", hint: "login" };
  }
  if (msg.includes("email not confirmed")) {
    return { title: "Confirme seu e-mail", description: "Enviamos um link de confirmação para você." };
  }
  if (msg.includes("password should be") || msg.includes("weak password")) {
    return { title: "Senha muito fraca", description: "Use ao menos 6 caracteres." };
  }
  if (msg.includes("rate limit") || msg.includes("too many")) {
    return { title: "Muitas tentativas", description: "Aguarde alguns instantes e tente novamente." };
  }
  if (msg.includes("network") || msg.includes("failed to fetch")) {
    return { title: "Sem conexão", description: "Verifique sua internet e tente novamente." };
  }
  return { title: "Não foi possível concluir", description: raw };
}
