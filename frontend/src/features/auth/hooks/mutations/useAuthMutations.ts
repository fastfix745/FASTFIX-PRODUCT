import { useMutation } from "@tanstack/react-query";
import {
  signUp,
  signInWithPassword,
  resetPasswordForEmail,
  signInWithGoogle,
  updatePassword,
  type SignUpInput,
} from "@/services/auth/authService";

export function useSignUpMutation() {
  return useMutation({ mutationFn: (input: SignUpInput) => signUp(input) });
}

export function useSignInMutation() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInWithPassword(email, password),
  });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: (email: string) => resetPasswordForEmail(email) });
}

export function useGoogleSignInMutation() {
  return useMutation({ mutationFn: signInWithGoogle });
}

export function useUpdatePasswordMutation() {
  return useMutation({ mutationFn: (password: string) => updatePassword(password) });
}
