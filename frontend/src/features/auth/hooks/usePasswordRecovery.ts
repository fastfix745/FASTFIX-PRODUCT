import { useEffect, useState } from "react";
import { hasPasswordRecoveryInUrl, onAuthStateChange } from "@/services/auth/authService";

export function usePasswordRecovery() {
  const [hasRecovery, setHasRecovery] = useState(() => hasPasswordRecoveryInUrl());

  useEffect(() => {
    if (hasPasswordRecoveryInUrl()) setHasRecovery(true);

    const { data: { subscription } } = onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") setHasRecovery(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return hasRecovery;
}
