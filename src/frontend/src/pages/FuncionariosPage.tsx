import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Department } from "@/types";
import { DEPARTMENT_LABELS } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Search, User } from "lucide-react";
import { useMemo, useState } from "react";

export interface MockEmployee {
  id: string;
  name: string;
  email: string;
  department: Department;
  position: string;
  salary: number;
  performanceScore: number;
  hireDate: string;
  photoUrl?: string;
  isActive: boolean;
}

export const MOCK_EMPLOYEES: MockEmployee[] = [
  {
    id: "1",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@sasha.ao",
    department: "GAS_STATION",
    position: "Operador de Pista",
    salary: 85000,
    performanceScore: 8.4,
    hireDate: "2021-03-15",
    isActive: true,
  },
  {
    id: "2",
    name: "Ana Sousa",
    email: "ana.sousa@sasha.ao",
    department: "GAS_STATION",
    position: "Supervisora de Turno",
    salary: 120000,
    performanceScore: 9.1,
    hireDate: "2019-07-01",
    isActive: true,
  },
  {
    id: "3",
    name: "Manuel Lopes",
    email: "manuel.lopes@sasha.ao",
    department: "GAS_STATION",
    position: "Mecânico",
    salary: 95000,
    performanceScore: 7.6,
    hireDate: "2022-01-10",
    isActive: true,
  },
  {
    id: "4",
    name: "Beatriz Costa",
    email: "beatriz.costa@sasha.ao",
    department: "BAR",
    position: "Bartender",
    salary: 75000,
    performanceScore: 9.3,
    hireDate: "2020-05-20",
    isActive: true,
  },
  {
    id: "5",
    name: "João Neto",
    email: "joao.neto@sasha.ao",
    department: "BAR",
    position: "Garçom",
    salary: 65000,
    performanceScore: 7.8,
    hireDate: "2022-09-05",
    isActive: true,
  },
  {
    id: "6",
    name: "Mariana Pinto",
    email: "mariana.pinto@sasha.ao",
    department: "BAR",
    position: "Gerente de Bar",
    salary: 135000,
    performanceScore: 8.9,
    hireDate: "2018-11-12",
    isActive: true,
  },
  {
    id: "7",
    name: "Rui Almeida",
    email: "rui.almeida@sasha.ao",
    department: "BAR",
    position: "Cozinheiro",
    salary: 80000,
    performanceScore: 8.2,
    hireDate: "2021-06-08",
    isActive: true,
  },
  {
    id: "8",
    name: "Fatima Santos",
    email: "fatima.santos@sasha.ao",
    department: "BARBERSHOP",
    position: "Barbeira Sénior",
    salary: 110000,
    performanceScore: 9.6,
    hireDate: "2017-04-22",
    isActive: true,
  },
  {
    id: "9",
    name: "Pedro Gomes",
    email: "pedro.gomes@sasha.ao",
    department: "BARBERSHOP",
    position: "Barbeiro",
    salary: 85000,
    performanceScore: 8.7,
    hireDate: "2020-02-14",
    isActive: true,
  },
  {
    id: "10",
    name: "Luísa Mendes",
    email: "luisa.mendes@sasha.ao",
    department: "BARBERSHOP",
    position: "Recepcionista",
    salary: 60000,
    performanceScore: 7.2,
    hireDate: "2023-03-01",
    isActive: true,
  },
  {
    id: "11",
    name: "André Teixeira",
    email: "andre.teixeira@sasha.ao",
    department: "BARBERSHOP",
    position: "Barbeiro",
    salary: 85000,
    performanceScore: 8.0,
    hireDate: "2022-07-18",
    isActive: true,
  },
  {
    id: "12",
    name: "Sofia Rodrigues",
    email: "sofia.rodrigues@sasha.ao",
    department: "GAS_STATION",
    position: "Operadora de Caixa",
    salary: 70000,
    performanceScore: 8.8,
    hireDate: "2021-11-30",
    isActive: true,
  },
];

const PAGE_SIZE = 20;

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getScoreColor(score: number): string {
  if (score >= 9) return "bg-primary/15 text-primary border-primary/30";
  if (score >= 7.5)
    return "bg-secondary/15 text-secondary-foreground border-secondary/30";
  if (score >= 5) return "bg-muted text-muted-foreground border-border";
  return "bg-destructive/15 text-destructive border-destructive/30";
}

function getDeptColor(dept: Department): string {
  if (dept === "GAS_STATION")
    return "bg-accent/15 text-accent-foreground border-accent/25";
  if (dept === "BAR")
    return "bg-secondary/15 text-secondary-foreground border-secondary/25";
  return "bg-primary/10 text-primary border-primary/25";
}

function AvatarCell({ employee }: { employee: MockEmployee }) {
  const initials = getInitials(employee.name);
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
        {employee.photoUrl ? (
          <img
            src={employee.photoUrl}
            alt={employee.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-primary">{initials}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {employee.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {employee.email}
        </p>
      </div>
    </div>
  );
}

export default function FuncionariosPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<Department | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_EMPLOYEES.filter((e) => {
      const matchesDept = deptFilter === "ALL" || e.department === deptFilter;
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [search, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeptChange = (val: string) => {
    setDeptFilter(val as Department | "ALL");
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div
      className="p-5 md:p-7 max-w-7xl mx-auto space-y-5"
      data-ocid="funcionarios.page"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Funcionários
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length}{" "}
            {filtered.length === 1
              ? "funcionário encontrado"
              : "funcionários encontrados"}
          </p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-card border-border"
            data-ocid="funcionarios.search_input"
          />
        </div>

        <Tabs
          value={deptFilter}
          onValueChange={handleDeptChange}
          data-ocid="funcionarios.dept_filter"
        >
          <TabsList className="h-9">
            <TabsTrigger
              value="ALL"
              className="text-xs px-3"
              data-ocid="funcionarios.filter.tab"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="GAS_STATION"
              className="text-xs px-3"
              data-ocid="funcionarios.filter_gas.tab"
            >
              Estação
            </TabsTrigger>
            <TabsTrigger
              value="BAR"
              className="text-xs px-3"
              data-ocid="funcionarios.filter_bar.tab"
            >
              Bar
            </TabsTrigger>
            <TabsTrigger
              value="BARBERSHOP"
              className="text-xs px-3"
              data-ocid="funcionarios.filter_barber.tab"
            >
              Barbearia
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table card */}
      <div
        className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
        data-ocid="funcionarios.table"
      >
        {/* Desktop table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Funcionário
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                  Departamento
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                  Cargo
                </th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Desempenho
                </th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div
                      className="flex flex-col items-center justify-center py-16 gap-3"
                      data-ocid="funcionarios.empty_state"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Nenhum funcionário encontrado
                      </p>
                      {search && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSearch("")}
                        >
                          Limpar pesquisa
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((employee, idx) => (
                  <tr
                    key={employee.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer transition-smooth"
                    onClick={() =>
                      navigate({ to: `/funcionarios/${employee.id}` })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      navigate({ to: `/funcionarios/${employee.id}` })
                    }
                    tabIndex={0}
                    data-ocid={`funcionarios.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <AvatarCell employee={employee} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${getDeptColor(employee.department)}`}
                      >
                        {DEPARTMENT_LABELS[employee.department]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-foreground">
                        {employee.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getScoreColor(employee.performanceScore)}`}
                      >
                        {employee.performanceScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate({ to: `/funcionarios/${employee.id}` });
                        }}
                        data-ocid={`funcionarios.view_button.${idx + 1}`}
                      >
                        Ver perfil
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Página anterior"
                data-ocid="funcionarios.pagination_prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Próxima página"
                data-ocid="funcionarios.pagination_next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
