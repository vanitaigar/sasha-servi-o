import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { useState } from "react";

interface MockNotification {
  id: number;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  category: "financeiro" | "equipe" | "sistema" | "reuniao";
}

const CATEGORY_COLORS: Record<MockNotification["category"], string> = {
  financeiro: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  equipe: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  sistema: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  reuniao: "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

const CATEGORY_LABELS: Record<MockNotification["category"], string> = {
  financeiro: "Financeiro",
  equipe: "Equipe",
  sistema: "Sistema",
  reuniao: "Reunião",
};

const INITIAL_NOTIFICATIONS: MockNotification[] = [
  {
    id: 1,
    title: "Nova venda registada",
    message:
      "Uma venda de €245,00 foi registada na Estação de Serviço por Carlos Mendes.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
    isRead: false,
    category: "financeiro",
  },
  {
    id: 2,
    title: "Reunião agendada",
    message:
      "Reunião de equipe marcada para amanhã às 10:00 — Revisão de metas mensais.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    isRead: false,
    category: "reuniao",
  },
  {
    id: 3,
    title: "Funcionário avaliado",
    message:
      "Ana Costa recebeu uma nova avaliação de desempenho com pontuação 4,8/5.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    category: "equipe",
  },
  {
    id: 4,
    title: "Despesa registada",
    message:
      "Despesa de €890,00 em reabastecimento adicionada ao Bar & Restaurante.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: false,
    category: "financeiro",
  },
  {
    id: 5,
    title: "Check-in GPS confirmado",
    message:
      "João Silva realizou check-in às 08:32 na Barbearia. Localização validada.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    isRead: true,
    category: "equipe",
  },
  {
    id: 6,
    title: "Relatório semanal disponível",
    message:
      "O relatório semanal de desempenho está disponível para consulta na secção Relatórios.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
    category: "sistema",
  },
  {
    id: 7,
    title: "Promoção aprovada",
    message:
      "A promoção de Maria Santos para Chefe de Turno foi aprovada pelo dono.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
    isRead: true,
    category: "equipe",
  },
];

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Agora mesmo";
  if (diffMin < 60) return `${diffMin} min atrás`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
}

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState<MockNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [activeFilter, setActiveFilter] = useState<"todas" | "nao-lidas">(
    "todas",
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered =
    activeFilter === "nao-lidas"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  function markAsRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto" data-ocid="notificacoes.page">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Notificações
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} notificação${unreadCount > 1 ? "ões" : ""} não lida${unreadCount > 1 ? "s" : ""}`
              : "Tudo em dia"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="shrink-0 gap-2"
            data-ocid="notificacoes.mark_all_button"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 mb-4 bg-muted rounded-lg p-1 w-fit"
        data-ocid="notificacoes.filter.tab"
      >
        <button
          type="button"
          onClick={() => setActiveFilter("todas")}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-smooth",
            activeFilter === "todas"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          data-ocid="notificacoes.filter.todas"
        >
          Todas
          <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
            {notifications.length}
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("nao-lidas")}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-smooth",
            activeFilter === "nao-lidas"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          data-ocid="notificacoes.filter.nao-lidas"
        >
          Não lidas
          {unreadCount > 0 && (
            <Badge className="ml-2 text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">
              {unreadCount}
            </Badge>
          )}
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4"
          data-ocid="notificacoes.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Bell className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Sem notificações</p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeFilter === "nao-lidas"
                ? "Não há notificações por ler."
                : "Não há notificações ainda."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((notification, index) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              index={index + 1}
              onMarkRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  notification,
  index,
  onMarkRead,
}: {
  notification: MockNotification;
  index: number;
  onMarkRead: (id: number) => void;
}) {
  return (
    <div
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
      onKeyDown={(e) =>
        e.key === "Enter" && !notification.isRead && onMarkRead(notification.id)
      }
      className={cn(
        "group relative flex gap-4 rounded-xl border p-4 transition-smooth cursor-pointer",
        notification.isRead
          ? "bg-card border-border hover:border-border/80"
          : "bg-primary/5 border-primary/20 hover:border-primary/40",
      )}
      data-ocid={`notificacoes.item.${index}`}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span
          className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary"
          data-ocid={`notificacoes.unread_dot.${index}`}
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold",
          CATEGORY_COLORS[notification.category],
        )}
      >
        <Bell className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pr-4">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p
            className={cn(
              "text-sm font-semibold leading-snug",
              notification.isRead ? "text-foreground" : "text-foreground",
            )}
          >
            {notification.title}
          </p>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0 font-medium border",
              CATEGORY_COLORS[notification.category],
            )}
          >
            {CATEGORY_LABELS[notification.category]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {notification.message}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
