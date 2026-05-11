import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Department, Transaction, TransactionType } from "@/types";
import { DEPARTMENT_LABELS, TRANSACTION_TYPE_LABELS } from "@/types";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Euro,
  Filter,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const INCOME_CATEGORIES = ["Vendas", "Serviços", "Outros"];
const EXPENSE_CATEGORIES = ["Salários", "Fornecedores", "Manutenção", "Outros"];
const DEPARTMENTS: Department[] = ["GAS_STATION", "BAR", "BARBERSHOP"];

function _randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1n,
    transactionType: "INCOME",
    amount: 1250.0,
    category: "Vendas",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-28").getTime()),
    notes: "Vendas de combustível semana",
  },
  {
    id: 2n,
    transactionType: "INCOME",
    amount: 380.5,
    category: "Serviços",
    department: "BARBERSHOP",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-27").getTime()),
    notes: "Cortes de cabelo",
  },
  {
    id: 3n,
    transactionType: "EXPENSE",
    amount: 620.0,
    category: "Salários",
    department: "BAR",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-26").getTime()),
    notes: "Pagamento de funcionários",
  },
  {
    id: 4n,
    transactionType: "INCOME",
    amount: 890.75,
    category: "Vendas",
    department: "BAR",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-25").getTime()),
    notes: "Vendas fim de semana",
  },
  {
    id: 5n,
    transactionType: "EXPENSE",
    amount: 340.0,
    category: "Fornecedores",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-24").getTime()),
    notes: "Reposição de stock",
  },
  {
    id: 6n,
    transactionType: "INCOME",
    amount: 2100.0,
    category: "Vendas",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-23").getTime()),
    notes: "Vendas de combustível",
  },
  {
    id: 7n,
    transactionType: "EXPENSE",
    amount: 180.0,
    category: "Manutenção",
    department: "BARBERSHOP",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-22").getTime()),
    notes: "Manutenção equipamentos",
  },
  {
    id: 8n,
    transactionType: "INCOME",
    amount: 560.0,
    category: "Serviços",
    department: "BAR",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-21").getTime()),
    notes: "Eventos privados",
  },
  {
    id: 9n,
    transactionType: "EXPENSE",
    amount: 420.0,
    category: "Fornecedores",
    department: "BAR",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-20").getTime()),
    notes: "Bebidas e alimentos",
  },
  {
    id: 10n,
    transactionType: "INCOME",
    amount: 310.0,
    category: "Outros",
    department: "BARBERSHOP",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-19").getTime()),
    notes: "Venda de produtos",
  },
  {
    id: 11n,
    transactionType: "EXPENSE",
    amount: 850.0,
    category: "Salários",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-18").getTime()),
    notes: "Salários mensais",
  },
  {
    id: 12n,
    transactionType: "INCOME",
    amount: 1480.0,
    category: "Vendas",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-17").getTime()),
    notes: "Combustível e loja",
  },
  {
    id: 13n,
    transactionType: "EXPENSE",
    amount: 95.0,
    category: "Manutenção",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-16").getTime()),
    notes: "Reparação de equipamentos",
  },
  {
    id: 14n,
    transactionType: "INCOME",
    amount: 720.0,
    category: "Serviços",
    department: "BARBERSHOP",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-15").getTime()),
    notes: "Serviços de estética",
  },
  {
    id: 15n,
    transactionType: "EXPENSE",
    amount: 260.0,
    category: "Outros",
    department: "BAR",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-14").getTime()),
    notes: "Decoração temática",
  },
  {
    id: 16n,
    transactionType: "INCOME",
    amount: 1950.0,
    category: "Vendas",
    department: "BAR",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-13").getTime()),
    notes: "Fim de semana",
  },
  {
    id: 17n,
    transactionType: "EXPENSE",
    amount: 540.0,
    category: "Fornecedores",
    department: "BARBERSHOP",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-12").getTime()),
    notes: "Produtos de barbearia",
  },
  {
    id: 18n,
    transactionType: "INCOME",
    amount: 430.0,
    category: "Outros",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-11").getTime()),
    notes: "Loja de conveniência",
  },
  {
    id: 19n,
    transactionType: "EXPENSE",
    amount: 320.0,
    category: "Manutenção",
    department: "BAR",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-10").getTime()),
    notes: "Manutenção do espaço",
  },
  {
    id: 20n,
    transactionType: "INCOME",
    amount: 660.0,
    category: "Serviços",
    department: "BARBERSHOP",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-09").getTime()),
    notes: "Serviços especiais",
  },
  {
    id: 21n,
    transactionType: "EXPENSE",
    amount: 1200.0,
    category: "Salários",
    department: "BARBERSHOP",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-08").getTime()),
    notes: "Pagamento de pessoal",
  },
  {
    id: 22n,
    transactionType: "INCOME",
    amount: 3200.0,
    category: "Vendas",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-07").getTime()),
    notes: "Semana de alta movimentação",
  },
  {
    id: 23n,
    transactionType: "EXPENSE",
    amount: 480.0,
    category: "Fornecedores",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-06").getTime()),
    notes: "Combustível para revenda",
  },
  {
    id: 24n,
    transactionType: "INCOME",
    amount: 590.0,
    category: "Serviços",
    department: "BAR",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-05").getTime()),
    notes: "Reservas de grupos",
  },
  {
    id: 25n,
    transactionType: "EXPENSE",
    amount: 150.0,
    category: "Outros",
    department: "GAS_STATION",
    createdBy: "" as unknown as Transaction["createdBy"],
    date: BigInt(new Date("2026-04-04").getTime()),
    notes: "Material de escritório",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(timestamp: bigint): string {
  return format(new Date(Number(timestamp)), "dd/MM/yyyy", { locale: pt });
}

type SortField = "date" | "amount";
type SortDir = "asc" | "desc";

// ─── Sub-components ──────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}
function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}

interface TransactionFormProps {
  type: TransactionType;
  onSubmit: (t: Omit<Transaction, "id" | "createdBy">) => void;
}
function TransactionForm({ type, onSubmit }: TransactionFormProps) {
  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0)
      e.amount = "Valor inválido";
    if (!category) e.category = "Selecione uma categoria";
    if (!department) e.department = "Selecione um setor";
    if (!date) e.date = "Selecione uma data";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      transactionType: type,
      amount: Number(amount),
      category,
      department: department as Department,
      date: BigInt(new Date(date).getTime()),
      notes,
    });
    setAmount("");
    setCategory("");
    setDepartment("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setNotes("");
    setErrors({});
  };

  const isIncome = type === "INCOME";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Valor (€)" htmlFor={`${type}-amount`}>
          <Input
            id={`${type}-amount`}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={cn(errors.amount && "border-destructive")}
            data-ocid={`${type === "INCOME" ? "income" : "expense"}.amount_input`}
          />
          {errors.amount && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid={`${type === "INCOME" ? "income" : "expense"}.amount_input.field_error`}
            >
              {errors.amount}
            </p>
          )}
        </FormField>

        <FormField label="Categoria" htmlFor={`${type}-category`}>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              id={`${type}-category`}
              className={cn(errors.category && "border-destructive")}
              data-ocid={`${type === "INCOME" ? "income" : "expense"}.category_select`}
            >
              <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid={`${type === "INCOME" ? "income" : "expense"}.category_select.field_error`}
            >
              {errors.category}
            </p>
          )}
        </FormField>

        <FormField label="Setor" htmlFor={`${type}-department`}>
          <Select
            value={department}
            onValueChange={(v) => setDepartment(v as Department)}
          >
            <SelectTrigger
              id={`${type}-department`}
              className={cn(errors.department && "border-destructive")}
              data-ocid={`${type === "INCOME" ? "income" : "expense"}.department_select`}
            >
              <SelectValue placeholder="Selecionar setor" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {DEPARTMENT_LABELS[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid={`${type === "INCOME" ? "income" : "expense"}.department_select.field_error`}
            >
              {errors.department}
            </p>
          )}
        </FormField>

        <FormField label="Data" htmlFor={`${type}-date`}>
          <Input
            id={`${type}-date`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={cn(errors.date && "border-destructive")}
            data-ocid={`${type === "INCOME" ? "income" : "expense"}.date_input`}
          />
          {errors.date && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid={`${type === "INCOME" ? "income" : "expense"}.date_input.field_error`}
            >
              {errors.date}
            </p>
          )}
        </FormField>
      </div>

      <FormField label="Notas (opcional)" htmlFor={`${type}-notes`}>
        <Textarea
          id={`${type}-notes`}
          placeholder="Adicione observações ou detalhes adicionais..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          data-ocid={`${type === "INCOME" ? "income" : "expense"}.notes_textarea`}
        />
      </FormField>

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          className={cn(
            "gap-2 min-w-[160px]",
            isIncome
              ? "bg-primary hover:bg-primary/90"
              : "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
          )}
          data-ocid={`${type === "INCOME" ? "income" : "expense"}.submit_button`}
        >
          {isIncome ? (
            <>
              <TrendingUp className="w-4 h-4" /> Registar Receita
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4" /> Registar Despesa
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FinanceiroPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Filters
  const [filterType, setFilterType] = useState<TransactionType | "ALL">("ALL");
  const [filterDept, setFilterDept] = useState<Department | "ALL">("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const hasFilters =
    filterType !== "ALL" ||
    filterDept !== "ALL" ||
    filterDateFrom !== "" ||
    filterDateTo !== "";

  const clearFilters = () => {
    setFilterType("ALL");
    setFilterDept("ALL");
    setFilterDateFrom("");
    setFilterDateTo("");
    setCurrentPage(1);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "ALL" && t.transactionType !== filterType)
        return false;
      if (filterDept !== "ALL" && t.department !== filterDept) return false;
      if (filterDateFrom) {
        const tDate = new Date(Number(t.date));
        const from = new Date(filterDateFrom);
        if (tDate < from) return false;
      }
      if (filterDateTo) {
        const tDate = new Date(Number(t.date));
        const to = new Date(filterDateTo);
        to.setHours(23, 59, 59);
        if (tDate > to) return false;
      }
      return true;
    });
  }, [transactions, filterType, filterDept, filterDateFrom, filterDateTo]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let diff = 0;
      if (sortField === "date") diff = Number(a.date) - Number(b.date);
      else diff = a.amount - b.amount;
      return sortDir === "asc" ? diff : -diff;
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const totalIncome = filtered
    .filter((t) => t.transactionType === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.transactionType === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);
  const profit = totalIncome - totalExpense;

  const handleAddTransaction = (
    data: Omit<Transaction, "id" | "createdBy">,
  ) => {
    const newTx: Transaction = {
      ...data,
      id: BigInt(Date.now()),
      createdBy: "" as unknown as Transaction["createdBy"],
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return (
        <span className="inline-flex flex-col opacity-30">
          <ChevronUp className="w-3 h-3 -mb-1" />
          <ChevronDown className="w-3 h-3" />
        </span>
      );
    return sortDir === "asc" ? (
      <ChevronUp className="w-4 h-4 text-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary" />
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6" data-ocid="financeiro.page">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              Financeiro
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Gestão de receitas, despesas e relatórios financeiros
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Euro className="w-4 h-4" />
            <span className="text-xs font-medium">EUR</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            className="bg-card border-border"
            data-ocid="financeiro.income_summary_card"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "color-mix(in oklch, var(--primary) 15%, transparent)",
                  }}
                >
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Receitas
                  </p>
                  <p className="text-lg font-bold font-display text-foreground truncate">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-card border-border"
            data-ocid="financeiro.expense_summary_card"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "color-mix(in oklch, var(--destructive) 15%, transparent)",
                  }}
                >
                  <TrendingDown className="w-4 h-4 text-destructive" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Despesas
                  </p>
                  <p className="text-lg font-bold font-display text-foreground truncate">
                    {formatCurrency(totalExpense)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-card border-border"
            data-ocid="financeiro.profit_summary_card"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      profit >= 0
                        ? "color-mix(in oklch, var(--primary) 15%, transparent)"
                        : "color-mix(in oklch, var(--destructive) 15%, transparent)",
                  }}
                >
                  <Euro
                    className={cn(
                      "w-4 h-4",
                      profit >= 0 ? "text-primary" : "text-destructive",
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    Lucro Líquido
                  </p>
                  <p
                    className={cn(
                      "text-lg font-bold font-display truncate",
                      profit >= 0 ? "text-primary" : "text-destructive",
                    )}
                  >
                    {formatCurrency(profit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transacoes" className="space-y-5">
          <TabsList
            className="bg-muted/60 p-1"
            data-ocid="financeiro.main_tabs"
          >
            <TabsTrigger
              value="transacoes"
              className="gap-2"
              data-ocid="financeiro.tab.transacoes"
            >
              <Filter className="w-3.5 h-3.5" />
              Transações
            </TabsTrigger>
            <TabsTrigger
              value="receita"
              className="gap-2"
              data-ocid="financeiro.tab.receita"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              Adicionar Receita
            </TabsTrigger>
            <TabsTrigger
              value="despesa"
              className="gap-2"
              data-ocid="financeiro.tab.despesa"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              Adicionar Despesa
            </TabsTrigger>
          </TabsList>

          {/* ── Transações Tab ── */}
          <TabsContent
            value="transacoes"
            className="space-y-4"
            data-ocid="financeiro.transacoes_panel"
          >
            {/* Filter Bar */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    Filtros
                    {hasFilters && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-4 px-1.5"
                      >
                        Activos
                      </Badge>
                    )}
                  </CardTitle>
                  {hasFilters && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                      data-ocid="financeiro.clear_filters_button"
                    >
                      <X className="w-3 h-3" /> Limpar filtros
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      Tipo
                    </Label>
                    <Select
                      value={filterType}
                      onValueChange={(v) => {
                        setFilterType(v as TransactionType | "ALL");
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger
                        className="h-8 text-xs"
                        data-ocid="financeiro.filter_type_select"
                      >
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos</SelectItem>
                        <SelectItem value="INCOME">Receita</SelectItem>
                        <SelectItem value="EXPENSE">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      Setor
                    </Label>
                    <Select
                      value={filterDept}
                      onValueChange={(v) => {
                        setFilterDept(v as Department | "ALL");
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger
                        className="h-8 text-xs"
                        data-ocid="financeiro.filter_dept_select"
                      >
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos</SelectItem>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {DEPARTMENT_LABELS[d]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      Data de
                    </Label>
                    <Input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => {
                        setFilterDateFrom(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-8 text-xs"
                      data-ocid="financeiro.filter_date_from_input"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      Data até
                    </Label>
                    <Input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => {
                        setFilterDateTo(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-8 text-xs"
                      data-ocid="financeiro.filter_date_to_input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card
              className="bg-card border-border overflow-hidden"
              data-ocid="financeiro.transactions_table"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Tipo
                      </th>
                      <th
                        className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors select-none"
                        onClick={() => toggleSort("amount")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") toggleSort("amount");
                        }}
                        data-ocid="financeiro.sort_amount_button"
                      >
                        <span className="inline-flex items-center gap-1 justify-end">
                          Valor <SortIcon field="amount" />
                        </span>
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                        Categoria
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                        Setor
                      </th>
                      <th
                        className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors select-none"
                        onClick={() => toggleSort("date")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") toggleSort("date");
                        }}
                        data-ocid="financeiro.sort_date_button"
                      >
                        <span className="inline-flex items-center gap-1">
                          Data <SortIcon field="date" />
                        </span>
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-12"
                          data-ocid="financeiro.transactions_table.empty_state"
                        >
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Filter className="w-8 h-8 opacity-40" />
                            <p className="text-sm font-medium">
                              Nenhuma transação encontrada
                            </p>
                            <p className="text-xs">
                              Ajuste os filtros ou adicione transações
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginated.map((tx, i) => (
                        <tr
                          key={tx.id.toString()}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                          data-ocid={`financeiro.transactions_table.item.${(currentPage - 1) * PAGE_SIZE + i + 1}`}
                        >
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                tx.transactionType === "INCOME"
                                  ? "default"
                                  : "destructive"
                              }
                              className={cn(
                                "gap-1 text-xs font-medium",
                                tx.transactionType === "INCOME"
                                  ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                                  : "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
                              )}
                            >
                              {tx.transactionType === "INCOME" ? (
                                <ArrowUpCircle className="w-3 h-3" />
                              ) : (
                                <ArrowDownCircle className="w-3 h-3" />
                              )}
                              {TRANSACTION_TYPE_LABELS[tx.transactionType]}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">
                            <span
                              className={
                                tx.transactionType === "INCOME"
                                  ? "text-primary"
                                  : "text-destructive"
                              }
                            >
                              {tx.transactionType === "INCOME" ? "+" : "-"}
                              {formatCurrency(tx.amount)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                            {tx.category}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {DEPARTMENT_LABELS[tx.department]}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                            {formatDate(tx.date)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs max-w-[180px] truncate hidden lg:table-cell">
                            {tx.notes || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <>
                  <Separator />
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    data-ocid="financeiro.pagination"
                  >
                    <p className="text-xs text-muted-foreground">
                      A mostrar {(currentPage - 1) * PAGE_SIZE + 1}–
                      {Math.min(currentPage * PAGE_SIZE, sorted.length)} de{" "}
                      {sorted.length} transações
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="w-7 h-7"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        data-ocid="financeiro.pagination_prev"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-xs px-2 text-muted-foreground">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="w-7 h-7"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        data-ocid="financeiro.pagination_next"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Table footer: count when no pagination */}
              {totalPages <= 1 && sorted.length > 0 && (
                <div className="px-4 py-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    {sorted.length} transação(ões) no total
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* ── Adicionar Receita Tab ── */}
          <TabsContent value="receita" data-ocid="financeiro.receita_panel">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        "color-mix(in oklch, var(--primary) 15%, transparent)",
                    }}
                  >
                    <ArrowUpCircle className="w-4 h-4 text-primary" />
                  </div>
                  Adicionar Receita
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Registe uma nova entrada de receita no sistema
                </p>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5">
                <TransactionForm
                  type="INCOME"
                  onSubmit={handleAddTransaction}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Adicionar Despesa Tab ── */}
          <TabsContent value="despesa" data-ocid="financeiro.despesa_panel">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        "color-mix(in oklch, var(--destructive) 15%, transparent)",
                    }}
                  >
                    <ArrowDownCircle className="w-4 h-4 text-destructive" />
                  </div>
                  Adicionar Despesa
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Registe uma nova despesa ou saída financeira
                </p>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5">
                <TransactionForm
                  type="EXPENSE"
                  onSubmit={handleAddTransaction}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
