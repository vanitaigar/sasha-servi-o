import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_EMPLOYEES, type MockEmployee } from "@/pages/FuncionariosPage";
import { useAppStore } from "@/store";
import { DEPARTMENT_LABELS } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Mail,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

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

function getDeptColor(dept: MockEmployee["department"]): string {
  if (dept === "GAS_STATION")
    return "bg-accent/15 text-accent-foreground border-accent/25";
  if (dept === "BAR")
    return "bg-secondary/15 text-secondary-foreground border-secondary/25";
  return "bg-primary/10 text-primary border-primary/25";
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function formatSalary(amount: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Star Rating Input ───────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label="Avaliação em estrelas"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
          className="p-0.5 transition-smooth"
          data-ocid={`review.star.${star}`}
        >
          <Star
            className={`w-7 h-7 transition-smooth ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Performance Score Form ──────────────────────────────────────────────────
function UpdateScoreForm({
  employee,
  onClose,
}: { employee: MockEmployee; onClose: () => void }) {
  const [score, setScore] = useState<string>(
    employee.performanceScore.toString(),
  );
  const [submitted, setSubmitted] = useState(false);

  const numScore = Number.parseFloat(score);
  const isValid = !Number.isNaN(numScore) && numScore >= 0 && numScore <= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="bg-card rounded-xl border border-border p-5 space-y-4"
      data-ocid="update_score.card"
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">
          Atualizar Pontuação de Desempenho
        </h3>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Pontuação atual:</span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getScoreColor(employee.performanceScore)}`}
        >
          {employee.performanceScore.toFixed(1)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="score-input" className="text-xs font-medium">
            Nova pontuação{" "}
            <span className="text-muted-foreground">(0 – 10)</span>
          </Label>
          <input
            id="score-input"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            data-ocid="update_score.input"
          />
          {score && !isValid && (
            <p
              className="text-xs text-destructive"
              data-ocid="update_score.field_error"
            >
              A pontuação deve ser entre 0 e 10
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={!isValid || submitted}
            className="flex-1"
            data-ocid="update_score.submit_button"
          >
            {submitted ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Guardado!
              </span>
            ) : (
              "Guardar pontuação"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-ocid="update_score.cancel_button"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Review Form ─────────────────────────────────────────────────────────────
function SubmitReviewForm({ employee }: { employee: MockEmployee }) {
  const [starScore, setStarScore] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (starScore === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStarScore(0);
      setComments("");
    }, 1500);
  };

  return (
    <div
      className="bg-card rounded-xl border border-border p-5 space-y-4"
      data-ocid="review.card"
    >
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-amber-400" />
        <h3 className="font-semibold text-sm text-foreground">
          Submeter Avaliação
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Classificação</Label>
          <StarRating value={starScore} onChange={setStarScore} />
          {starScore > 0 && (
            <p className="text-xs text-muted-foreground">
              {
                ["Insuficiente", "Fraco", "Satisfatório", "Bom", "Excelente"][
                  starScore - 1
                ]
              }
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor={`review-comments-${employee.id}`}
            className="text-xs font-medium"
          >
            Comentários
          </Label>
          <Textarea
            id={`review-comments-${employee.id}`}
            placeholder="Descreva o desempenho do funcionário..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-[80px] text-sm resize-none"
            data-ocid="review.textarea"
          />
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={starScore === 0 || submitted}
          className="w-full"
          data-ocid="review.submit_button"
        >
          {submitted ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Avaliação enviada!
            </span>
          ) : (
            "Enviar avaliação"
          )}
        </Button>
      </form>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FuncionarioDetailPage() {
  const { id } = useParams({ from: "/protected/funcionarios/$id" });
  const navigate = useNavigate();
  const { userProfile } = useAppStore();
  const [showScoreForm, setShowScoreForm] = useState(false);

  const employee = MOCK_EMPLOYEES.find((e) => e.id === id);

  const canManage =
    userProfile?.role === "OWNER" || userProfile?.role === "ADMIN";

  if (!employee) {
    return (
      <div
        className="p-6 md:p-8 max-w-7xl mx-auto"
        data-ocid="funcionario_detail.not_found"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/funcionarios" })}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
        </Button>
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">Funcionário não encontrado.</p>
        </div>
      </div>
    );
  }

  const initials = getInitials(employee.name);

  return (
    <div
      className="p-5 md:p-7 max-w-4xl mx-auto space-y-5"
      data-ocid="funcionario_detail.page"
    >
      {/* Back nav */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/funcionarios" })}
        className="-ml-1 text-muted-foreground hover:text-foreground"
        data-ocid="funcionario_detail.back_button"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar à lista
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — profile card */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile header */}
          <div
            className="bg-card rounded-xl border border-border p-6"
            data-ocid="funcionario_detail.card"
          >
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 border-2 border-primary/20 shadow-sm">
                {employee.photoUrl ? (
                  <img
                    src={employee.photoUrl}
                    alt={employee.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {initials}
                  </span>
                )}
              </div>

              {/* Name + badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h1 className="font-display font-bold text-xl text-foreground">
                      {employee.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {employee.position}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold border ${getScoreColor(employee.performanceScore)}`}
                    data-ocid="funcionario_detail.score_badge"
                  >
                    {employee.performanceScore.toFixed(1)} / 10
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className={`text-xs border ${getDeptColor(employee.department)}`}
                  >
                    {DEPARTMENT_LABELS[employee.department]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs border ${
                      employee.isActive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {employee.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Mail} label="Email" value={employee.email} />
              <InfoRow
                icon={Building2}
                label="Departamento"
                value={DEPARTMENT_LABELS[employee.department]}
              />
              <InfoRow
                icon={Briefcase}
                label="Cargo"
                value={employee.position}
              />
              <InfoRow
                icon={DollarSign}
                label="Salário"
                value={formatSalary(employee.salary)}
              />
              <InfoRow
                icon={Calendar}
                label="Data de Contratação"
                value={formatDate(employee.hireDate)}
              />
            </div>
          </div>

          {/* Performance score update (admin/owner only) */}
          {canManage &&
            (showScoreForm ? (
              <UpdateScoreForm
                employee={employee}
                onClose={() => setShowScoreForm(false)}
              />
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowScoreForm(true)}
                className="flex items-center gap-2"
                data-ocid="funcionario_detail.update_score_button"
              >
                <TrendingUp className="w-4 h-4" />
                Atualizar pontuação de desempenho
              </Button>
            ))}
        </div>

        {/* Right column — review form */}
        <div className="space-y-5">
          {canManage && <SubmitReviewForm employee={employee} />}

          {/* Score visual */}
          <div
            className="bg-card rounded-xl border border-border p-5"
            data-ocid="funcionario_detail.score_card"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Desempenho
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-3xl font-bold ${getScoreColor(employee.performanceScore).split(" ")[1]}`}
              >
                {employee.performanceScore.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-sm">/ 10</span>
            </div>
            {/* Bar */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(employee.performanceScore / 10) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground">0</span>
              <span className="text-[10px] text-muted-foreground">10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
