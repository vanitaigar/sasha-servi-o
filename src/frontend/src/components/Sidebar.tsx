import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Role } from "@/types";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Fuel,
  LayoutDashboard,
  MapPin,
  Scissors,
  Settings,
  UserCircle,
  Users,
  Wine,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Painel Geral",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Funcionários",
    href: "/funcionarios",
    icon: Users,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Reuniões",
    href: "/reunioes",
    icon: CalendarDays,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: BarChart3,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Presença GPS",
    href: "/presenca",
    icon: MapPin,
    roles: ["OWNER", "ADMIN", "EMPLOYEE"],
  },
  {
    label: "Notificações",
    href: "/notificacoes",
    icon: Bell,
    roles: ["OWNER", "ADMIN", "EMPLOYEE"],
  },
  {
    label: "Meu Perfil",
    href: "/perfil",
    icon: UserCircle,
    roles: ["EMPLOYEE"],
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    roles: ["OWNER"],
  },
];

const DEPT_BADGES = [
  { label: "Posto", color: "bg-chart-1/20 text-chart-1 border-chart-1/30" },
  { label: "Bar", color: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  { label: "Barbearia", color: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { userProfile, unreadNotificationsCount } = useAppStore();
  const role = userProfile?.role ?? "ADMIN";
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-smooth",
        collapsed ? "w-16" : "w-60",
      )}
      data-ocid="sidebar"
    >
      {/* Logo + Collapse */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-sidebar-border",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Fuel className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sidebar-foreground text-sm tracking-tight">
              SASHA
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Fuel className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "w-6 h-6 rounded flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-smooth",
            collapsed && "hidden",
          )}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          data-ocid="sidebar.toggle"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Dept badges */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2 flex flex-wrap gap-1">
          {DEPT_BADGES.map((d) => (
            <span
              key={d.label}
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                d.color,
              )}
            >
              {d.label}
            </span>
          ))}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const showBadge =
            item.href === "/notificacoes" && unreadNotificationsCount > 0;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed && "justify-center px-2",
              )}
              data-ocid={`sidebar.nav.${item.href.replace("/", "")}`}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive
                    ? "text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/60",
                )}
              />
              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!collapsed && showBadge && (
                <Badge className="ml-auto h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground border-0">
                  {unreadNotificationsCount > 9
                    ? "9+"
                    : unreadNotificationsCount}
                </Badge>
              )}
              {collapsed && showBadge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapsed toggle button */}
      {collapsed && (
        <button
          type="button"
          onClick={onToggle}
          className="mx-auto mb-2 w-8 h-8 rounded flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
          aria-label="Expandir menu"
          data-ocid="sidebar.expand"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* User footer */}
      <div
        className={cn(
          "border-t border-sidebar-border p-3",
          collapsed ? "flex justify-center" : "",
        )}
      >
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-primary" />
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">
                {userProfile?.name ?? "Utilizador"}
              </p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">
                {userProfile?.role === "OWNER"
                  ? "Dono"
                  : userProfile?.role === "ADMIN"
                    ? "Administrador"
                    : "Funcionário"}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
