import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { DEPARTMENT_LABELS } from "@/types";
import type { Department } from "@/types";
import {
  Bell,
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
type Period = "hoje" | "semana" | "mes";

interface KPI {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface BarChartData {
  departamento: string;
  receita: number;
  despesa: number;
}

interface TopEmployee {
  rank: number;
  name: string;
  department: Department;
  position: string;
  score: number;
}

// ─── Mock data per period ─────────────────────────────────────────────────────
const MOCK_DATA: Record<
  Period,
  {
    totalIncome: number;
    totalExpense: number;
    alertCount: number;
    barData: BarChartData[];
    topEmployees: TopEmployee[];
  }
> = {
  hoje: {
    totalIncome: 4_250,
    totalExpense: 1_870,
    alertCount: 3,
    barData: [
      { departamento: "Est. Serviço", receita: 2_100, despesa: 950 },
      { departamento: "Bar", receita: 1_380, despesa: 620 },
      { departamento: "Barbearia", receita: 770, despesa: 300 },
    ],
    topEmployees: [
      {
        rank: 1,
        name: "Carlos Mendes",
        department: "GAS_STATION",
        position: "Técnico Sénior",
        score: 98,
      },
      {
        rank: 2,
        name: "Ana Ferreira",
        department: "BARBERSHOP",
        position: "Barbeira Principal",
        score: 95,
      },
      {
        rank: 3,
        name: "Rui Oliveira",
        department: "BAR",
        position: "Barman",
        score: 92,
      },
      {
        rank: 4,
        name: "Sofia Costa",
        department: "BARBERSHOP",
        position: "Barbeira",
        score: 88,
      },
      {
        rank: 5,
        name: "João Santos",
        department: "GAS_STATION",
        position: "Operador",
        score: 84,
      },
    ],
  },
  semana: {
    totalIncome: 28_640,
    totalExpense: 12_310,
    alertCount: 7,
    barData: [
      { departamento: "Est. Serviço", receita: 14_200, despesa: 6_100 },
      { departamento: "Bar", receita: 9_800, despesa: 4_200 },
      { departamento: "Barbearia", receita: 4_640, despesa: 2_010 },
    ],
    topEmployees: [
      {
        rank: 1,
        name: "Carlos Mendes",
        department: "GAS_STATION",
        position: "Técnico Sénior",
        score: 97,
      },
      {
        rank: 2,
        name: "Ana Ferreira",
        department: "BARBERSHOP",
        position: "Barbeira Principal",
        score: 94,
      },
      {
        rank: 3,
        name: "Rui Oliveira",
        department: "BAR",
        position: "Barman",
        score: 91,
      },
      {
        rank: 4,
        name: "Sofia Costa",
        department: "BARBERSHOP",
        position: "Barbeira",
        score: 87,
      },
      {
        rank: 5,
        name: "Maria Lima",
        department: "BAR",
        position: "Gerente de Turno",
        score: 83,
      },
    ],
  },
  mes: {
    totalIncome: 118_900,
    totalExpense: 52_400,
    alertCount: 12,
    barData: [
      { departamento: "Est. Serviço", receita: 58_000, despesa: 25_000 },
      { departamento: "Bar", receita: 39_900, despesa: 17_400 },
      { departamento: "Barbearia", receita: 21_000, despesa: 10_000 },
    ],
    topEmployees: [
      {
        rank: 1,
        name: "Carlos Mendes",
        department: "GAS_STATION",
        position: "Técnico Sénior",
        score: 96,
      },
      {
        rank: 2,
        name: "Ana Ferreira",
        department: "BARBERSHOP",
        position: "Barbeira Principal",
        score: 93,
      },
      {
        rank: 3,
        name: "Maria Lima",
        department: "BAR",
        position: "Gerente de Turno",
        score: 90,
      },
      {
        rank: 4,
        name: "Rui Oliveira",
        department: "BAR",
        position: "Barman",
        score: 89,
      },
      {
        rank: 5,
        name: "João Santos",
        department: "GAS_STATION",
        position: "Operador",
        score: 85,
      },
    ],
  },
};

const PERIOD_LABELS: Record<Period, string> = {
  hoje: "Hoje",
  semana: "Esta Semana",
  mes: "Este Mês",
};

const _DEPT_COLORS: Record<string, string> = {
  "Est. Serviço": "var(--color-chart-1)",
  Bar: "var(--color-chart-2)",
  Barbearia: "var(--color-chart-3)",
};

const DEPT_BADGE_COLORS: Record<Department, string> = {
  GAS_STATION: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  BAR: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  BARBERSHOP: "bg-chart-3/20 text-chart-3 border-chart-3/30",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: entry.fill }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-medium text-foreground">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({
  label,
  value,
  change,
  icon: Icon,
  color,
  index,
}: KPI & { index: number }) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        className="bg-card border-border overflow-hidden"
        data-ocid={`dashboard.kpi_card.${index + 1}`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-label mb-2">{label}</p>
              <p className="text-display text-2xl text-foreground">
                {formatCurrency(value)}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `color-mix(in oklch, ${color} 18%, transparent)`,
              }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-chart-3" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-destructive" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isPositive ? "text-chart-3" : "text-destructive",
              )}
            >
              {isPositive ? "+" : ""}
              {change}% vs período anterior
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 90
      ? "var(--color-chart-3)"
      : score >= 75
        ? "var(--color-chart-1)"
        : "var(--color-chart-2)";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-8 text-right">
        {score}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DashboardOwnerPage() {
  const [period, setPeriod] = useState<Period>("semana");
  const unreadCount = useAppStore((s) => s.unreadNotificationsCount);
  const data = MOCK_DATA[period];

  const netProfit = data.totalIncome - data.totalExpense;

  const kpis: KPI[] = useMemo(
    () => [
      {
        label: "Receita Total",
        value: data.totalIncome,
        change: 8.4,
        icon: DollarSign,
        color: "oklch(var(--chart-3))",
      },
      {
        label: "Despesa Total",
        value: data.totalExpense,
        change: -3.2,
        icon: TrendingDown,
        color: "oklch(var(--destructive))",
      },
      {
        label: "Lucro Líquido",
        value: netProfit,
        change: 12.1,
        icon: TrendingUp,
        color: "oklch(var(--primary))",
      },
    ],
    [data.totalIncome, data.totalExpense, netProfit],
  );

  const alertCount = data.alertCount + unreadCount;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6" data-ocid="dashboard.page">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-2xl md:text-3xl text-foreground">
            Painel do Dono
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Visão geral consolidada de todos os setores
          </p>
        </div>

        {/* Period selector */}
        <div
          className="flex items-center gap-1 bg-muted rounded-xl p-1 shrink-0"
          data-ocid="dashboard.period_selector"
        >
          {(["hoje", "semana", "mes"] as Period[]).map((p) => (
            <Button
              key={p}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPeriod(p)}
              className={cn(
                "h-8 px-4 text-sm rounded-lg transition-smooth",
                period === p
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`dashboard.period_${p}.tab`}
            >
              {PERIOD_LABELS[p]}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Department badges ── */}
      <div
        className="flex flex-wrap gap-2"
        data-ocid="dashboard.departments.section"
      >
        {(["GAS_STATION", "BAR", "BARBERSHOP"] as Department[]).map((dept) => (
          <Badge
            key={dept}
            variant="outline"
            className={cn(
              "text-xs font-semibold border",
              DEPT_BADGE_COLORS[dept],
            )}
          >
            {DEPARTMENT_LABELS[dept]}
          </Badge>
        ))}
      </div>

      {/* ── KPI Cards Row ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        data-ocid="dashboard.kpis.section"
      >
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} index={i} />
        ))}

        {/* Alert card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: kpis.length * 0.08 }}
        >
          <Card
            className="bg-card border-border overflow-hidden"
            data-ocid="dashboard.alerts_card"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-label mb-2">Alertas Activos</p>
                  <p className="text-display text-2xl text-foreground">
                    {alertCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-destructive/10">
                  <Bell className="w-5 h-5 text-destructive" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xs text-muted-foreground">
                  {alertCount > 0
                    ? `${alertCount} notificações por rever`
                    : "Nenhum alerta pendente"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Charts + Table Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 xl:gap-6">
        {/* Bar chart — 3/5 width */}
        <motion.div
          className="xl:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card
            className="bg-card border-border h-full"
            data-ocid="dashboard.bar_chart.section"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-foreground">
                  Receita vs Despesa por Setor
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground border-border"
                >
                  {PERIOD_LABELS[period]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={data.barData}
                  margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                  barCategoryGap="30%"
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="departamento"
                    tick={{
                      fill: "oklch(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "oklch(var(--muted-foreground))",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                    }
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "oklch(var(--muted)/0.4)" }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: 12,
                      color: "oklch(var(--muted-foreground))",
                    }}
                    formatter={(value: string) => value}
                  />
                  <Bar
                    dataKey="receita"
                    name="Receita"
                    fill="oklch(var(--chart-3))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="despesa"
                    name="Despesa"
                    fill="oklch(var(--destructive))"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.7}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary side panel — 2/5 width */}
        <motion.div
          className="xl:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card
            className="bg-card border-border h-full"
            data-ocid="dashboard.summary_panel"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">
                Resumo por Setor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.barData.map((item) => {
                const profit = item.receita - item.despesa;
                const margin = ((profit / item.receita) * 100).toFixed(1);
                return (
                  <div key={item.departamento} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {item.departamento}
                      </span>
                      <span className="text-xs font-semibold text-chart-3">
                        {margin}% margem
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Receita
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">
                          {formatCurrency(item.receita)}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Despesa
                        </p>
                        <p className="text-sm font-semibold text-destructive mt-0.5">
                          {formatCurrency(item.despesa)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    Lucro Total
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(netProfit)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Top Employees Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <Card
          className="bg-card border-border"
          data-ocid="dashboard.top_employees.section"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-semibold text-foreground">
                  Top 5 Funcionários
                </CardTitle>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs">{PERIOD_LABELS[period]}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" data-ocid="dashboard.employees_table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-label px-6 py-3 text-left w-10">#</th>
                    <th className="text-label px-4 py-3 text-left">
                      Funcionário
                    </th>
                    <th className="text-label px-4 py-3 text-left">Setor</th>
                    <th className="text-label px-4 py-3 text-left">Cargo</th>
                    <th className="text-label px-4 py-3 text-right">
                      Pontuação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topEmployees.map((emp, idx) => (
                    <tr
                      key={emp.rank}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                      data-ocid={`dashboard.employee_row.${idx + 1}`}
                    >
                      <td className="px-6 py-3.5">
                        <span
                          className={cn(
                            "inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold",
                            emp.rank === 1
                              ? "bg-yellow-400/20 text-yellow-500"
                              : emp.rank === 2
                                ? "bg-slate-400/20 text-slate-400"
                                : emp.rank === 3
                                  ? "bg-amber-700/20 text-amber-600"
                                  : "bg-muted text-muted-foreground",
                          )}
                        >
                          {emp.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {emp.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {emp.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            DEPT_BADGE_COLORS[emp.department],
                          )}
                        >
                          {DEPARTMENT_LABELS[emp.department]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-muted-foreground">
                          {emp.position}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end min-w-[120px]">
                          <ScoreBar score={emp.score} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
