import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Department, TransactionType } from "@/types";
import { DEPARTMENT_LABELS, TRANSACTION_TYPE_LABELS } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarPlus,
  DollarSign,
  Fuel,
  Scissors,
  TrendingDown,
  TrendingUp,
  Users,
  Wine,
} from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Mock data ───────────────────────────────────────────────────────────────
const WEEKLY_DATA = [
  { day: "Seg", receita: 1850, despesa: 620 },
  { day: "Ter", receita: 2400, despesa: 810 },
  { day: "Qua", receita: 1920, despesa: 540 },
  { day: "Qui", receita: 2700, despesa: 920 },
  { day: "Sex", receita: 3100, despesa: 750 },
  { day: "Sáb", receita: 3850, despesa: 1100 },
  { day: "Dom", receita: 2100, despesa: 480 },
];

const DEPARTMENT_PIE_DATA = [
  { name: "Estação de Serviço", value: 48, key: "GAS_STATION" as Department },
  { name: "Bar", value: 31, key: "BAR" as Department },
  { name: "Barbearia", value: 21, key: "BARBERSHOP" as Department },
];

const RECENT_TRANSACTIONS = [
  {
    id: 1,
    description: "Venda de combustível",
    type: "INCOME" as TransactionType,
    amount: 4200,
    department: "GAS_STATION" as Department,
    date: "Hoje, 09:42",
    category: "Combustível",
  },
  {
    id: 2,
    description: "Reposição de estoque",
    type: "EXPENSE" as TransactionType,
    amount: 1350,
    department: "BAR" as Department,
    date: "Hoje, 11:15",
    category: "Estoque",
  },
  {
    id: 3,
    description: "Serviços de barbearia",
    type: "INCOME" as TransactionType,
    amount: 780,
    department: "BARBERSHOP" as Department,
    date: "Hoje, 13:30",
    category: "Serviços",
  },
  {
    id: 4,
    description: "Pedidos de bar",
    type: "INCOME" as TransactionType,
    amount: 2150,
    department: "BAR" as Department,
    date: "Ontem, 21:05",
    category: "Vendas",
  },
  {
    id: 5,
    description: "Manutenção de equipamentos",
    type: "EXPENSE" as TransactionType,
    amount: 640,
    department: "GAS_STATION" as Department,
    date: "Ontem, 15:20",
    category: "Manutenção",
  },
];

const DEPT_STATS = [
  {
    key: "GAS_STATION" as Department,
    label: "Estação de Serviço",
    receita: 18240,
    despesa: 4800,
    icon: Fuel,
    colorClass: "text-chart-1",
    bgClass: "bg-chart-1/10",
    trend: 12.4,
  },
  {
    key: "BAR" as Department,
    label: "Bar",
    receita: 11730,
    despesa: 3200,
    icon: Wine,
    colorClass: "text-chart-2",
    bgClass: "bg-chart-2/10",
    trend: 8.1,
  },
  {
    key: "BARBERSHOP" as Department,
    label: "Barbearia",
    receita: 7920,
    despesa: 1100,
    icon: Scissors,
    colorClass: "text-chart-3",
    bgClass: "bg-chart-3/10",
    trend: -3.2,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 0,
  }).format(value);
}

// ─── Sub-components ──────────────────────────────────────────────────────────
interface SummaryCardProps {
  title: string;
  today: number;
  week: number;
  type: "income" | "expense" | "profit";
  ocid: string;
}

function SummaryCard({ title, today, week, type, ocid }: SummaryCardProps) {
  const colorMap = {
    income: {
      icon: TrendingUp,
      iconClass: "text-chart-3",
      bgClass: "bg-chart-3/10",
    },
    expense: {
      icon: TrendingDown,
      iconClass: "text-destructive",
      bgClass: "bg-destructive/10",
    },
    profit: {
      icon: DollarSign,
      iconClass: "text-chart-1",
      bgClass: "bg-chart-1/10",
    },
  };
  const { icon: Icon, iconClass, bgClass } = colorMap[type];

  return (
    <Card className="card-elevated" data-ocid={ocid}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2 rounded-lg", bgClass)}>
            <Icon className={cn("w-5 h-5", iconClass)} />
          </div>
          <Badge
            variant="outline"
            className="text-[10px] text-muted-foreground"
          >
            Esta semana
          </Badge>
        </div>
        <p className="text-label mb-1">{title}</p>
        <p className="font-display font-bold text-2xl text-foreground tracking-tight">
          {formatCurrency(week)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Hoje:{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(today)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

function DepartmentIcon({ dept }: { dept: Department }) {
  if (dept === "GAS_STATION") return <Fuel className="w-3.5 h-3.5" />;
  if (dept === "BAR") return <Wine className="w-3.5 h-3.5" />;
  return <Scissors className="w-3.5 h-3.5" />;
}

const DEPT_BADGE_CLASSES: Record<Department, string> = {
  GAS_STATION: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  BAR: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  BARBERSHOP: "bg-chart-3/15 text-chart-3 border-chart-3/30",
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function DashboardAdminPage() {
  const navigate = useNavigate();

  const totals = useMemo(() => {
    const weekIncome = WEEKLY_DATA.reduce((s, d) => s + d.receita, 0);
    const weekExpense = WEEKLY_DATA.reduce((s, d) => s + d.despesa, 0);
    const todayIncome = WEEKLY_DATA[WEEKLY_DATA.length - 1].receita;
    const todayExpense = WEEKLY_DATA[WEEKLY_DATA.length - 1].despesa;
    return {
      weekIncome,
      weekExpense,
      weekProfit: weekIncome - weekExpense,
      todayIncome,
      todayExpense,
      todayProfit: todayIncome - todayExpense,
    };
  }, []);

  return (
    <div
      className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6"
      data-ocid="dashboard.page"
    >
      {/* ── Page header ── */}
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">
          Painel Geral
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Visão geral do desempenho da empresa
        </p>
      </div>

      {/* ── Summary cards ── */}
      <section data-ocid="dashboard.summary_section">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            title="Total de Receitas"
            today={totals.todayIncome}
            week={totals.weekIncome}
            type="income"
            ocid="dashboard.income_card"
          />
          <SummaryCard
            title="Total de Despesas"
            today={totals.todayExpense}
            week={totals.weekExpense}
            type="expense"
            ocid="dashboard.expense_card"
          />
          <SummaryCard
            title="Lucro Líquido"
            today={totals.todayProfit}
            week={totals.weekProfit}
            type="profit"
            ocid="dashboard.profit_card"
          />
        </div>
      </section>

      {/* ── Quick access buttons ── */}
      <section data-ocid="dashboard.quick_access_section">
        <h2 className="text-label mb-3">Acesso Rápido</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2 transition-smooth hover:bg-primary/10 hover:border-primary hover:text-primary"
            onClick={() => navigate({ to: "/financeiro" })}
            data-ocid="dashboard.financeiro_button"
          >
            <Banknote className="w-4 h-4" />
            Financeiro
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 transition-smooth hover:bg-primary/10 hover:border-primary hover:text-primary"
            onClick={() => navigate({ to: "/funcionarios" })}
            data-ocid="dashboard.funcionarios_button"
          >
            <Users className="w-4 h-4" />
            Funcionários
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 transition-smooth hover:bg-primary/10 hover:border-primary hover:text-primary"
            onClick={() => navigate({ to: "/reunioes" })}
            data-ocid="dashboard.criar_reuniao_button"
          >
            <CalendarPlus className="w-4 h-4" />
            Criar Reunião
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </Button>
        </div>
      </section>

      {/* ── Charts row ── */}
      <section
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        data-ocid="dashboard.charts_section"
      >
        {/* Weekly area chart */}
        <Card
          className="card-elevated lg:col-span-2"
          data-ocid="dashboard.weekly_chart_card"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base font-semibold">
                Resumo Financeiro Semanal
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                Últimos 7 dias
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={WEEKLY_DATA}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-chart-3)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-chart-3)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-chart-2)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-chart-2)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  labelStyle={{
                    color: "var(--color-foreground)",
                    fontWeight: 600,
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "receita" ? "Receita" : "Despesa",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  fill="url(#gradIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="despesa"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  fill="url(#gradExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 justify-end">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-0.5 bg-chart-3 rounded-full inline-block" />
                Receita
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-0.5 bg-chart-2 rounded-full inline-block" />
                Despesa
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="card-elevated" data-ocid="dashboard.pie_chart_card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base font-semibold">
              Receita por Setor
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={DEPARTMENT_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DEPARTMENT_PIE_DATA.map((entry, idx) => (
                    <Cell key={entry.name} fill={PIE_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value}%`, "Participação"]}
                />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* ── Bottom row: Transactions + Department breakdown ── */}
      <section
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        data-ocid="dashboard.bottom_section"
      >
        {/* Recent transactions */}
        <Card
          className="card-elevated lg:col-span-3"
          data-ocid="dashboard.transactions_card"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base font-semibold">
                Transações Recentes
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-primary gap-1 h-7"
                onClick={() => navigate({ to: "/financeiro" })}
                data-ocid="dashboard.view_all_transactions_button"
              >
                Ver todas
                <ArrowUpRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1" data-ocid="dashboard.transactions_list">
              {RECENT_TRANSACTIONS.map((tx, idx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/40 transition-colors duration-150"
                  data-ocid={`dashboard.transaction.item.${idx + 1}`}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      tx.type === "INCOME"
                        ? "bg-chart-3/15"
                        : "bg-destructive/15",
                    )}
                  >
                    {tx.type === "INCOME" ? (
                      <TrendingUp className="w-4 h-4 text-chart-3" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">
                        {tx.date}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
                          DEPT_BADGE_CLASSES[tx.department],
                        )}
                        data-ocid={`dashboard.transaction.dept_badge.${idx + 1}`}
                      >
                        <DepartmentIcon dept={tx.department} />
                        {DEPARTMENT_LABELS[tx.department]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        tx.type === "INCOME"
                          ? "text-chart-3"
                          : "text-destructive",
                      )}
                    >
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {TRANSACTION_TYPE_LABELS[tx.type]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department breakdown */}
        <div
          className="lg:col-span-2 flex flex-col gap-4"
          data-ocid="dashboard.departments_section"
        >
          {DEPT_STATS.map((dept, idx) => {
            const Icon = dept.icon;
            const profit = dept.receita - dept.despesa;
            const isPositive = dept.trend >= 0;
            return (
              <Card
                key={dept.key}
                className="card-elevated"
                data-ocid={`dashboard.dept_card.${idx + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("p-2 rounded-lg", dept.bgClass)}>
                      <Icon className={cn("w-4 h-4", dept.colorClass)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {dept.label}
                      </p>
                      <p
                        className={cn(
                          "text-[11px] font-medium flex items-center gap-0.5",
                          isPositive ? "text-chart-3" : "text-destructive",
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isPositive ? "+" : ""}
                        {dept.trend}% este mês
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        Receita
                      </p>
                      <p className="text-xs font-semibold text-foreground">
                        {formatCurrency(dept.receita)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        Despesa
                      </p>
                      <p className="text-xs font-semibold text-foreground">
                        {formatCurrency(dept.despesa)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        Lucro
                      </p>
                      <p className="text-xs font-semibold text-chart-3">
                        {formatCurrency(profit)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
