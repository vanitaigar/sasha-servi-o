import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "@tanstack/react-router";
import { Fuel, Shield, TrendingUp, Users } from "lucide-react";
import { useEffect } from "react";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Gestão Financeira",
    desc: "Controlo de receitas e despesas por setor",
  },
  {
    icon: Users,
    title: "Equipa",
    desc: "Gestão de funcionários e avaliações",
  },
  {
    icon: Shield,
    title: "Segurança",
    desc: "Controlo de acesso por perfil de utilizador",
  },
];

const DEPARTMENTS = [
  { label: "⛽ Estação de Serviço", color: "text-chart-1" },
  { label: "🍸 Bar", color: "text-chart-2" },
  { label: "💈 Barbearia", color: "text-chart-3" },
];

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  useTheme(); // init theme on mount
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="login.page"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Left — branding */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Fuel className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
                SASHA SERVIÇO
              </h1>
              <p className="text-xs text-muted-foreground">
                Sistema de Gestão Empresarial
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-3xl text-foreground leading-tight">
              Gestão Unificada
              <br />
              <span className="text-primary">de Negócios</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Controle financeiro, gestão de funcionários, relatórios e muito
              mais — tudo num só lugar.
            </p>
          </div>

          {/* Departments */}
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <span
                key={d.label}
                className={`text-sm font-medium ${d.color} bg-card px-3 py-1 rounded-full border border-border`}
              >
                {d.label}
              </span>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {f.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — login card */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-sm" data-ocid="login.card">
            <CardContent className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-1">
                <h3 className="font-display font-bold text-xl text-foreground">
                  Bem-vindo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Inicie sessão com a sua identidade digital
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground">
                    Internet Identity
                  </span>
                </div>
              </div>

              {/* Login button */}
              <Button
                type="button"
                className="w-full h-11 font-semibold"
                onClick={() => login()}
                disabled={isLoading}
                data-ocid="login.submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    A verificar...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Entrar com Internet Identity
                  </span>
                )}
              </Button>

              {/* Info */}
              <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
                Acesso seguro e descentralizado. A sua identidade é protegida
                pela tecnologia Internet Computer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Criado com caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
