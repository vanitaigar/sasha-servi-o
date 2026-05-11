import { Layout } from "@/components/Layout";
import ConfiguracoesPage from "@/pages/ConfiguracoesPage";
import DashboardAdminPage from "@/pages/DashboardAdminPage";
import DashboardEmployeePage from "@/pages/DashboardEmployeePage";
import DashboardOwnerPage from "@/pages/DashboardOwnerPage";
import FinanceiroPage from "@/pages/FinanceiroPage";
import FuncionarioDetailPage from "@/pages/FuncionarioDetailPage";
import FuncionariosPage from "@/pages/FuncionariosPage";
import LoginPage from "@/pages/LoginPage";
import NotificacoesPage from "@/pages/NotificacoesPage";
import PresencaPage from "@/pages/PresencaPage";
import RelatoriosPage from "@/pages/RelatoriosPage";
import ReunioesPage from "@/pages/ReunioesPage";
import { useAppStore } from "@/store";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useEffect } from "react";

// ─── Placeholder for routes without a dedicated page ───────────────────────────────────────────────
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-foreground mb-2">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm">
          Esta página está em construção.
        </p>
      </div>
    </div>
  );
}

const PerfilPage = () => <PlaceholderPage title="Meu Perfil" />;

// Dashboard adapts based on user role
function DashboardPage() {
  const userProfile = useAppStore((s) => s.userProfile);
  if (userProfile?.role === "OWNER") return <DashboardOwnerPage />;
  if (userProfile?.role === "ADMIN") return <DashboardAdminPage />;
  return <DashboardEmployeePage />;
}

// ─── Theme initializer ───────────────────────────────────────────────────────────────────────────────
function ThemeInitializer() {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  return null;
}

// ─── Routes ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <ThemeInitializer />
      <Outlet />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const financeiroRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/financeiro",
  component: FinanceiroPage,
});

const funcionariosRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/funcionarios",
  component: FuncionariosPage,
});

const funcionarioDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/funcionarios/$id",
  component: FuncionarioDetailPage,
});

const reunioesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/reunioes",
  component: ReunioesPage,
});

const presencaRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/presenca",
  component: PresencaPage,
});

const relatoriosRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/relatorios",
  component: RelatoriosPage,
});

const notificacoesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/notificacoes",
  component: NotificacoesPage,
});

const configuracoesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/configuracoes",
  component: ConfiguracoesPage,
});

const perfilRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/perfil",
  component: PerfilPage,
});

// ─── Router ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedLayoutRoute.addChildren([
    indexRoute,
    dashboardRoute,
    financeiroRoute,
    funcionariosRoute,
    funcionarioDetailRoute,
    reunioesRoute,
    presencaRoute,
    relatoriosRoute,
    notificacoesRoute,
    configuracoesRoute,
    perfilRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
