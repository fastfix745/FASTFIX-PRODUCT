import { supabase } from "@/services/supabase/client";
import type { Notification } from "@/types/notification";
import type { RealtimeChannel } from "@supabase/supabase-js";

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) throw error;
}

export interface NotificationRealtimeHandlers {
  onInsert: (notification: Notification) => void;
  onUpdate: (notification: Notification) => void;
}

export function subscribeToNotifications(
  userId: string,
  handlers: NotificationRealtimeHandlers,
): RealtimeChannel {
  return supabase
    .channel(`notif-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => handlers.onInsert(payload.new as Notification),
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => handlers.onUpdate(payload.new as Notification),
    )
    .subscribe();
}

export function unsubscribeNotifications(channel: RealtimeChannel) {
  return supabase.removeChannel(channel);
}
