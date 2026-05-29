import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchNotifications,
  subscribeToNotifications,
  unsubscribeNotifications,
} from "@/services/notifications/notificationsService";
import { queryKeys } from "@/services/queryKeys";
import type { Notification } from "@/types/notification";

export function useNotificationsQuery(userId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.notifications.byUser(userId ?? ""),
    queryFn: () => fetchNotifications(userId as string),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    const channel = subscribeToNotifications(userId, {
      onInsert: (notification) => {
        queryClient.setQueryData<Notification[]>(
          queryKeys.notifications.byUser(userId),
          (prev) => [notification, ...(prev ?? [])],
        );
        toast(notification.title, { description: notification.body ?? undefined });
      },
      onUpdate: (notification) => {
        queryClient.setQueryData<Notification[]>(
          queryKeys.notifications.byUser(userId),
          (prev) => prev?.map((item) => (item.id === notification.id ? notification : item)) ?? [],
        );
      },
    });

    return () => {
      unsubscribeNotifications(channel);
    };
  }, [userId, queryClient]);

  return query;
}
