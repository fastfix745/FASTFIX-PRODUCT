export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  city: string;
  avatar_url: string | null;
}

export type Role = "citizen" | "manager" | "admin";
