import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { unreadNotificationsCount, userProfile } = useAppStore();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const collapsed = isMobile ? true : sidebarCollapsed;

  return (
    <div
      className="flex h-screen bg-background overflow-hidden"
      data-ocid="app.layout"
    >
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="h-16 bg-card border-b border-border flex items-center gap-3 px-4 shrink-0"
          data-ocid="app.topbar"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 h-9 bg-muted/50 border-border/50 text-sm"
              data-ocid="app.search_input"
            />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {/* Theme toggle */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9"
              aria-label={
                theme === "dark"
                  ? "Mudar para modo claro"
                  : "Mudar para modo escuro"
              }
              data-ocid="app.theme_toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-9 h-9"
                aria-label="Notificações"
                data-ocid="app.notifications_button"
                onClick={() => navigate({ to: "/notificacoes" })}
              >
                <Bell className="w-4 h-4" />
              </Button>
              {unreadNotificationsCount > 0 && (
                <Badge
                  className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground border-0"
                  data-ocid="app.notifications_badge"
                >
                  {unreadNotificationsCount > 9
                    ? "9+"
                    : unreadNotificationsCount}
                </Badge>
              )}
            </div>

            {/* User / Logout */}
            <div className="flex items-center gap-2 ml-1 pl-3 border-l border-border">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-foreground leading-tight">
                  {userProfile?.name ?? "Utilizador"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {userProfile?.role === "OWNER"
                    ? "Dono"
                    : userProfile?.role === "ADMIN"
                      ? "Administrador"
                      : "Funcionário"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={logout}
                className="w-9 h-9 text-muted-foreground hover:text-destructive"
                aria-label="Sair"
                data-ocid="app.logout_button"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto bg-background"
          data-ocid="app.main_content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
