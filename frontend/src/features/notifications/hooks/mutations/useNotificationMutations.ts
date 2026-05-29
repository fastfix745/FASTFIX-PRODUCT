import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notifications/notificationsService";
import { queryKeys } from "@/services/queryKeys";
import type { Notification } from "@/types/notification";

function markReadInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  id: string,
) {
  queryClient.setQueryData<Notification[]>(
    queryKeys.notifications.byUser(userId),
    (prev) => prev?.map((item) => (item.id === id ? { ...item, read: true } : item)) ?? [],
  );
}

function markAllReadInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
) {
  queryClient.setQueryData<Notification[]>(
    queryKeys.notifications.byUser(userId),
    (prev) => prev?.map((item) => ({ ...item, read: true })) ?? [],
  );
}

export function useMarkNotificationRead(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: (_data, id) => {
      if (userId) markReadInCache(queryClient, userId, id);
    },
  });
}

export function useMarkAllNotificationsRead(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("Usuário não autenticado");
      return markAllNotificationsAsRead(userId);
    },
    onSuccess: () => {
      if (userId) markAllReadInCache(queryClient, userId);
    },
  });
}
