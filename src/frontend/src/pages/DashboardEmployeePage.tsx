import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store";
import { DEPARTMENT_LABELS } from "@/types";
import type { Department } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  LogIn,
  LogOut,
  MapPin,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_EMPLOYEE = {
  name: "Carlos Mendes",
  position: "Técnico Sénior",
  department: "BARBERSHOP" as Department,
  performanceScore: 82,
  admissionDate: "15/03/2022",
  salary: 1450,
  photoInitials: "CM",
};

const MOCK_ATTENDANCE = {
  checkIn: "08:47",
  checkOut: null as string | null,
  date: "Segunda, 04 de Maio de 2026",
};

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Reunião amanhã",
    message: "Reunião semanal às 09:00 na sala principal.",
    isRead: false,
    time: "há 2h",
  },
  {
    id: 2,
    title: "Avaliação disponível",
    message: "A sua avaliação mensal de Abril já está disponível.",
    isRead: false,
    time: "há 4h",
  },
  {
    id: 3,
    title: "Folga aprovada",
    message: "O seu pedido de folga para dia 10 foi aprovado.",
    isRead: false,
    time: "ontem",
  },
];

const UNREAD_COUNT = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

// ─── Performance Stars ────────────────────────────────────────────────────────
function PerformanceStars({ score }: { score: number }) {
  const stars = Math.round((score / 100) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((pos) => (
        <Star
          key={`star-${pos}`}
          size={16}
          className={
            pos <= stars
              ? "fill-primary text-primary"
              : "text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

// ─── Performance Bar ──────────────────────────────────────────────────────────
function PerformanceBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-chart-3"
      : score >= 60
        ? "bg-primary"
        : score >= 40
          ? "bg-chart-2"
          : "bg-destructive";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Desempenho geral</span>
        <span className="text-sm font-semibold text-foreground">{score}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <PerformanceStars score={score} />
    </div>
  );
}

// ─── Attendance Status Card ───────────────────────────────────────────────────
function AttendanceStatus({
  checkIn,
  checkOut,
}: {
  checkIn: string | null;
  checkOut: string | null;
}) {
  if (!checkIn) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <AlertCircle size={22} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Não fez check-in hoje</p>
        <Badge
          variant="outline"
          className="text-xs border-muted-foreground/40 text-muted-foreground"
        >
          Ausente
        </Badge>
      </div>
    );
  }

  const hasCheckedOut = !!checkOut;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <div className="w-8 h-8 rounded-full bg-chart-3/20 flex items-center justify-center flex-shrink-0">
          <LogIn size={14} className="text-chart-3" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Entrada</p>
          <p className="text-sm font-semibold text-foreground">{checkIn}</p>
        </div>
        <CheckCircle2
          size={16}
          className="text-chart-3 ml-auto flex-shrink-0"
        />
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            hasCheckedOut ? "bg-primary/20" : "bg-muted"
          }`}
        >
          <LogOut
            size={14}
            className={hasCheckedOut ? "text-primary" : "text-muted-foreground"}
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Saída</p>
          <p className="text-sm font-semibold text-foreground">
            {hasCheckedOut ? checkOut : "—"}
          </p>
        </div>
        {hasCheckedOut ? (
          <CheckCircle2
            size={16}
            className="text-primary ml-auto flex-shrink-0"
          />
        ) : (
          <Clock
            size={16}
            className="text-muted-foreground ml-auto flex-shrink-0 animate-pulse"
          />
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardEmployeePage() {
  const navigate = useNavigate();
  const unreadNotificationsCount = useAppStore(
    (s) => s.unreadNotificationsCount,
  );

  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
  const [checkedIn, setCheckedIn] = useState(!!MOCK_ATTENDANCE.checkIn);

  // Use store count if > 0, otherwise fallback to mock
  const notifCount =
    unreadNotificationsCount > 0 ? unreadNotificationsCount : UNREAD_COUNT;

  function handleCheckIn() {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setAttendance((prev) => ({ ...prev, checkIn: time }));
    setCheckedIn(true);
  }

  function handleCheckOut() {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setAttendance((prev) => ({ ...prev, checkOut: time }));
  }

  return (
    <div className="p-6 md:p-8" data-ocid="employee-dashboard.page">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Olá, {MOCK_EMPLOYEE.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {attendance.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
            >
              <MapPin size={11} />
              {DEPARTMENT_LABELS[MOCK_EMPLOYEE.department]}
            </Badge>
          </div>
        </div>

        {/* Top Row: Profile + Attendance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Profile Card */}
          <Card
            data-ocid="employee-dashboard.profile-card"
            className="border-border"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <User size={13} /> Meu Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-lg">
                    {MOCK_EMPLOYEE.photoInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-display font-bold text-lg text-foreground truncate">
                    {MOCK_EMPLOYEE.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {MOCK_EMPLOYEE.position}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs border-primary/30 text-primary bg-primary/5"
                  >
                    {DEPARTMENT_LABELS[MOCK_EMPLOYEE.department]}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase size={11} /> Cargo
                  </p>
                  <p className="font-medium text-foreground truncate">
                    {MOCK_EMPLOYEE.position}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={11} /> Desde
                  </p>
                  <p className="font-medium text-foreground">
                    {MOCK_EMPLOYEE.admissionDate}
                  </p>
                </div>
              </div>

              <Separator />

              <PerformanceBar score={MOCK_EMPLOYEE.performanceScore} />
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card
            data-ocid="employee-dashboard.attendance-card"
            className="border-border"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock size={13} /> Presença Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AttendanceStatus
                checkIn={attendance.checkIn}
                checkOut={attendance.checkOut}
              />

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-2">
                {!checkedIn ? (
                  <Button
                    type="button"
                    className="w-full gap-2"
                    onClick={handleCheckIn}
                    data-ocid="employee-dashboard.checkin_button"
                  >
                    <LogIn size={15} />
                    Fazer Check-in
                  </Button>
                ) : !attendance.checkOut ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleCheckOut}
                    data-ocid="employee-dashboard.checkout_button"
                  >
                    <LogOut size={15} />
                    Fazer Check-out
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm text-chart-3 py-2">
                    <CheckCircle2 size={15} />
                    <span>Turno concluído</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Panel */}
        <Card
          data-ocid="employee-dashboard.notifications-card"
          className="border-border"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Bell size={13} /> Notificações
                {notifCount > 0 && (
                  <Badge
                    className="ml-1 h-5 min-w-5 px-1.5 text-xs bg-destructive text-destructive-foreground"
                    data-ocid="employee-dashboard.notifications_badge"
                  >
                    {notifCount}
                  </Badge>
                )}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => navigate({ to: "/notificacoes" })}
                data-ocid="employee-dashboard.view_notifications_button"
              >
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_NOTIFICATIONS.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 py-8 text-center"
                data-ocid="employee-dashboard.notifications_empty_state"
              >
                <Bell size={24} className="text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Sem notificações por enquanto
                </p>
              </div>
            ) : (
              MOCK_NOTIFICATIONS.map((notif, index) => (
                <div
                  key={notif.id}
                  data-ocid={`employee-dashboard.notification.item.${index + 1}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      notif.isRead ? "bg-muted-foreground/30" : "bg-primary"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {notif.time}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Bottom Bar */}
        <Card
          data-ocid="employee-dashboard.quick-actions-card"
          className="border-border bg-muted/30"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={13} /> Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => navigate({ to: "/presenca" })}
                data-ocid="employee-dashboard.checkin_action_button"
              >
                <MapPin size={18} className="text-primary" />
                <span className="text-xs font-medium">Fazer Check-in</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2 hover:border-primary/50 hover:bg-primary/5 relative"
                onClick={() => navigate({ to: "/notificacoes" })}
                data-ocid="employee-dashboard.notifications_action_button"
              >
                <div className="relative">
                  <Bell size={18} className="text-primary" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                      {notifCount > 9 ? "9+" : notifCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">Notificações</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => navigate({ to: "/perfil" })}
                data-ocid="employee-dashboard.profile_action_button"
              >
                <User size={18} className="text-primary" />
                <span className="text-xs font-medium">Meu Perfil</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => navigate({ to: "/reunioes" })}
                data-ocid="employee-dashboard.meetings_action_button"
              >
                <Calendar size={18} className="text-primary" />
                <span className="text-xs font-medium">Reuniões</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
