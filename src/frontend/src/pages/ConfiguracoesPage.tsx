import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { DEPARTMENT_LABELS, ROLE_LABELS } from "@/types";
import {
  Building2,
  Info,
  Monitor,
  Moon,
  Shield,
  Sun,
  User,
} from "lucide-react";

const ROLE_BADGE_STYLES: Record<string, string> = {
  OWNER: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  ADMIN: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  EMPLOYEE: "bg-chart-3/20 text-chart-3 border-chart-3/30",
};

const THEME_OPTIONS = [
  {
    value: "light" as const,
    label: "Claro",
    icon: Sun,
    description: "Fundo branco e cores vivas",
  },
  {
    value: "dark" as const,
    label: "Escuro",
    icon: Moon,
    description: "Fundo escuro, ideal para a noite",
  },
];

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const { userProfile } = useAppStore();

  // Mock profile for display when no real profile is present
  const displayProfile = userProfile ?? {
    name: "Administrador",
    email: "admin@sashaservico.com",
    role: "ADMIN" as const,
    isActive: true,
  };

  return (
    <div
      className="p-6 md:p-8 max-w-2xl mx-auto"
      data-ocid="configuracoes.page"
    >
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Personalize a sua experiência
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Section */}
        <Card data-ocid="configuracoes.profile.card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-primary" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-xl text-primary">
                  {displayProfile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-base truncate">
                  {displayProfile.name}
                </p>
                <p
                  className="text-sm text-muted-foreground truncate"
                  data-ocid="configuracoes.profile.email"
                >
                  {displayProfile.email}
                </p>
              </div>
            </div>

            <Separator />

            {/* Role */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Função</span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold border",
                  ROLE_BADGE_STYLES[displayProfile.role] ?? "",
                )}
                data-ocid="configuracoes.profile.role_badge"
              >
                {ROLE_LABELS[displayProfile.role]}
              </Badge>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-chart-3" />
                </div>
                <span className="text-sm text-muted-foreground">Estado</span>
              </div>
              <span className="text-sm font-medium text-chart-3">
                {displayProfile.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card data-ocid="configuracoes.aparencia.card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Monitor className="w-4 h-4 text-primary" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Escolha o tema da interface. A preferência é guardada
              automaticamente.
            </p>
            <div
              className="grid grid-cols-2 gap-3"
              data-ocid="configuracoes.theme.toggle"
            >
              {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-smooth text-left",
                      isActive
                        ? "border-primary bg-primary/8 shadow-sm"
                        : "border-border bg-muted/30 hover:border-border hover:bg-muted/60",
                    )}
                    data-ocid={`configuracoes.theme.${option.value}`}
                    aria-pressed={isActive}
                    aria-label={`Tema ${option.label}`}
                  >
                    {isActive && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary" />
                    )}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          isActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {option.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* App Info Section */}
        <Card data-ocid="configuracoes.info.card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4 text-primary" />
              Informações da Aplicação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              icon={<Building2 className="w-4 h-4" />}
              label="Aplicação"
              value="SASHA SERVIÇO"
            />
            <Separator />
            <InfoRow label="Versão" value="1.0.0" />
            <Separator />
            <InfoRow label="Plataforma" value="Internet Computer" />
            <Separator />
            <InfoRow
              label="Sectores activos"
              value="Estação de Serviço · Bar · Barbearia"
            />
            <Separator />
            <InfoRow
              label="Suporte"
              value={
                <a
                  href="https://caffeine.ai?utm_source=sasha-settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  caffeine.ai
                </a>
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      {typeof value === "string" ? (
        <span className="text-sm font-medium text-foreground text-right">
          {value}
        </span>
      ) : (
        value
      )}
    </div>
  );
}
