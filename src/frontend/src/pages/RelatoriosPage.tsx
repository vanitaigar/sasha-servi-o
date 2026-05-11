import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Department, ReportPeriod } from "@/types";
import { DEPARTMENT_LABELS, REPORT_PERIOD_LABELS } from "@/types";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
interface DeptData {
  department: Department;
  receitas: number;
  despesas: number;
  lucro: number;
}

interface TrendPoint {
  label: string;
  receitas: number;
  despesas: number;
}

interface ReportData {
  totalReceitas: number;
  totalDespesas: number;
  lucro: number;
  deptBreakdown: DeptData[];
  trend: TrendPoint[];
}

// ─── Mock data generators ─────────────────────────────────────────────────────
const DEPT_COLORS: Record<Department, string> = {
  GAS_STATION: "hsl(var(--chart-1))",
  BAR: "hsl(var(--chart-2))",
  BARBERSHOP: "hsl(var(--chart-3))",
};

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateData(period: ReportPeriod, offset: number): ReportData {
  const rng = seedRand(period.charCodeAt(0) * 31 + offset * 7919);
  const base = { DAILY: 1, WEEKLY: 7, MONTHLY: 30, YEARLY: 365 }[period];

  const gasStation = { r: 2800 + rng() * 1200, e: 1200 + rng() * 500 };
  const bar = { r: 3500 + rng() * 1500, e: 2100 + rng() * 700 };
  const barbershop = { r: 1800 + rng() * 800, e: 700 + rng() * 300 };

  const scale = base;
  const gs = { r: gasStation.r * scale, e: gasStation.e * scale };
  const br = { r: bar.r * scale, e: bar.e * scale };
  const bs = { r: barbershop.r * scale, e: barbershop.e * scale };

  const totalReceitas = gs.r + br.r + bs.r;
  const totalDespesas = gs.e + br.e + bs.e;

  const trendLabels: Record<ReportPeriod, string[]> = {
    DAILY: ["00h", "03h", "06h", "09h", "12h", "15h", "18h", "21h"],
    WEEKLY: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    MONTHLY: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    YEARLY: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
  };

  const labels = trendLabels[period];
  const trend: TrendPoint[] = labels.map((label) => {
    const r = rng();
    const r2 = rng();
    const recFactor = 0.6 + r * 0.8;
    const expFactor = 0.5 + r2 * 0.7;
    return {
      label,
      receitas: Math.round((totalReceitas / labels.length) * recFactor),
      despesas: Math.round((totalDespesas / labels.length) * expFactor),
    };
  });

  return {
    totalReceitas,
    totalDespesas,
    lucro: totalReceitas - totalDespesas,
    deptBreakdown: [
      {
        department: "GAS_STATION",
        receitas: gs.r,
        despesas: gs.e,
        lucro: gs.r - gs.e,
      },
      { department: "BAR", receitas: br.r, despesas: br.e, lucro: br.r - br.e },
      {
        department: "BARBERSHOP",
        receitas: bs.r,
        despesas: bs.e,
        lucro: bs.r - bs.e,
      },
    ],
    trend,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPeriodLabel(period: ReportPeriod, offset: number): string {
  const now = new Date();
  if (period === "DAILY") {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  if (period === "WEEKLY") {
    const d = new Date(now);
    d.setDate(d.getDate() + offset * 7);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })} — ${end.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })}`;
  }
  if (period === "MONTHLY") {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return d.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
  }
  // YEARLY
  return String(now.getFullYear() + offset);
}

// ─── Sub-components ──────────────────────────────────────────────────────────
interface KpiCardProps {
  title: string;
  value: number;
  positive?: boolean | null;
  ocid: string;
}
function KpiCard({ title, value, positive, ocid }: KpiCardProps) {
  const isPositive = positive === true || (positive === null && value >= 0);
  const isNeutral = positive === undefined;
  const color = isNeutral
    ? "text-foreground"
    : value === 0
      ? "text-muted-foreground"
      : isPositive
        ? "text-emerald-500 dark:text-emerald-400"
        : "text-destructive";
  const Icon = value === 0 ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <Card data-ocid={ocid} className="hover:shadow-md transition-smooth">
      <CardHeader className="pb-2">
        <CardTitle className="text-label">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2">
          <span className={`text-2xl font-display font-bold ${color}`}>
            {formatCurrency(value)}
          </span>
          {!isNeutral && <Icon className={`h-5 w-5 mb-0.5 ${color}`} />}
        </div>
      </CardContent>
    </Card>
  );
}

interface DeptTableProps {
  data: DeptData[];
}
function DeptTable({ data }: DeptTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left px-4 py-3 text-label font-semibold">
              Departamento
            </th>
            <th className="text-right px-4 py-3 text-label font-semibold">
              Receitas
            </th>
            <th className="text-right px-4 py-3 text-label font-semibold">
              Despesas
            </th>
            <th className="text-right px-4 py-3 text-label font-semibold">
              Lucro
            </th>
            <th className="text-right px-4 py-3 text-label font-semibold">
              Margem
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const margin =
              row.receitas > 0 ? (row.lucro / row.receitas) * 100 : 0;
            const isProfit = row.lucro >= 0;
            return (
              <tr
                key={row.department}
                data-ocid={`relatorios.dept_row.${i + 1}`}
                className="border-t border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: DEPT_COLORS[row.department] }}
                    />
                    <span className="font-medium text-foreground">
                      {DEPARTMENT_LABELS[row.department]}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-primary">
                  {formatCurrency(row.receitas)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-destructive">
                  {formatCurrency(row.despesas)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono font-semibold ${isProfit ? "text-primary" : "text-destructive"}`}
                >
                  {formatCurrency(row.lucro)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Badge
                    variant={isProfit ? "default" : "destructive"}
                    className="font-mono text-xs"
                  >
                    {margin.toFixed(1)}%
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-muted/40 font-semibold">
            <td className="px-4 py-3 text-foreground">Total</td>
            <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
              {formatCurrency(data.reduce((s, r) => s + r.receitas, 0))}
            </td>
            <td className="px-4 py-3 text-right font-mono text-destructive">
              {formatCurrency(data.reduce((s, r) => s + r.despesas, 0))}
            </td>
            <td
              className={`px-4 py-3 text-right font-mono font-bold ${
                data.reduce((s, r) => s + r.lucro, 0) >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-destructive"
              }`}
            >
              {formatCurrency(data.reduce((s, r) => s + r.lucro, 0))}
            </td>
            <td className="px-4 py-3 text-right">
              <Badge
                variant={
                  data.reduce((s, r) => s + r.lucro, 0) >= 0
                    ? "default"
                    : "destructive"
                }
                className="font-mono text-xs"
              >
                {(
                  (data.reduce((s, r) => s + r.lucro, 0) /
                    Math.max(
                      data.reduce((s, r) => s + r.receitas, 0),
                      1,
                    )) *
                  100
                ).toFixed(1)}
                %
              </Badge>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

interface DeptBarChartProps {
  data: DeptData[];
}
function DeptBarChart({ data }: DeptBarChartProps) {
  const chartData = data.map((d) => ({
    name: DEPARTMENT_LABELS[d.department].split(" ")[0],
    Receitas: Math.round(d.receitas),
    Despesas: Math.round(d.despesas),
    Lucro: Math.round(d.lucro),
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar
          dataKey="Receitas"
          fill="hsl(var(--chart-3))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="Despesas"
          fill="hsl(var(--chart-2))"
          radius={[4, 4, 0, 0]}
        />
        <Bar dataKey="Lucro" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface TrendLineChartProps {
  data: TrendPoint[];
}
function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="receitas"
          name="Receitas"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="despesas"
          name="Despesas"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RelatoriosPage() {
  const [period, setPeriod] = useState<ReportPeriod>("MONTHLY");
  const [offset, setOffset] = useState(0);

  const data = useMemo(() => generateData(period, offset), [period, offset]);
  const periodLabel = useMemo(
    () => getPeriodLabel(period, offset),
    [period, offset],
  );
  const isCurrentPeriod = offset === 0;

  function handlePeriodChange(p: ReportPeriod) {
    setPeriod(p);
    setOffset(0);
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">
          Relatórios
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Análise financeira por período e departamento
        </p>
      </div>

      {/* Period Tabs + Navigator */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Tabs
          value={period}
          onValueChange={(v) => handlePeriodChange(v as ReportPeriod)}
          data-ocid="relatorios.period.tab"
        >
          <TabsList>
            {(Object.keys(REPORT_PERIOD_LABELS) as ReportPeriod[]).map((p) => (
              <TabsTrigger
                key={p}
                value={p}
                data-ocid={`relatorios.period.${p.toLowerCase()}`}
              >
                {REPORT_PERIOD_LABELS[p]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Date Navigator */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setOffset((o) => o - 1)}
            data-ocid="relatorios.nav.prev"
            aria-label="Período anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5 min-w-0 px-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
              {periodLabel}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setOffset((o) => o + 1)}
            disabled={isCurrentPeriod}
            data-ocid="relatorios.nav.next"
            aria-label="Próximo período"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        data-ocid="relatorios.kpi.section"
      >
        <KpiCard
          title="Total Receitas"
          value={data.totalReceitas}
          positive={true}
          ocid="relatorios.kpi.receitas"
        />
        <KpiCard
          title="Total Despesas"
          value={data.totalDespesas}
          positive={false}
          ocid="relatorios.kpi.despesas"
        />
        <KpiCard
          title="Lucro Bruto"
          value={data.lucro}
          positive={null}
          ocid="relatorios.kpi.lucro"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line Chart */}
        <Card data-ocid="relatorios.trend_chart">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              Evolução de Receitas e Despesas
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Comparativo ao longo do período
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <TrendLineChart data={data.trend} />
          </CardContent>
        </Card>

        {/* Dept Bar Chart */}
        <Card data-ocid="relatorios.dept_chart">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              Desempenho por Departamento
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Receitas, despesas e lucro por setor
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <DeptBarChart data={data.deptBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown Table */}
      <Card data-ocid="relatorios.dept_table">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Detalhes por Departamento
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Análise financeira detalhada por setor
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <DeptTable data={data.deptBreakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
