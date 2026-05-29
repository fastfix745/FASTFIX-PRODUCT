import { useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/features/notifications/hooks/useNotifications";
import { timeAgo } from "@/features/problems/config/problems";

const NotificationBell = () => {
  const { user } = useAuth();
  const { data: items = [] } = useNotifications(user?.id);
  const markAsRead = useMarkNotificationRead(user?.id);
  const markAllRead = useMarkAllNotificationsRead(user?.id);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = items.filter((i) => !i.read).length;

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors relative"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-severity-critical text-white text-[10px] font-bold flex items-center justify-center animate-pulse-glow">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-elegant z-50 animate-fade-in-up">
          <div className="flex items-center justify-between p-3 border-b border-border sticky top-0 bg-card">
            <p className="font-display font-bold text-foreground text-sm">Notificações</p>
            {unread > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-[10px] font-semibold text-accent hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Nenhuma notificação ainda
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.read && markAsRead.mutate(n.id)}
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${!n.read ? "bg-accent/5" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{n.title}</p>
                      {n.body && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {n.read && <Check className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
