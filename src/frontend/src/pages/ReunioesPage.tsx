import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Edit2,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
interface MockEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
}

interface MockMeeting {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  participants: string[];
  createdBy: string;
  createdAt: string;
}

const MOCK_EMPLOYEES: MockEmployee[] = [
  {
    id: "1",
    name: "Carlos Mendes",
    role: "Administrador",
    department: "Estação de Serviço",
    avatar: "CM",
  },
  {
    id: "2",
    name: "Ana Ferreira",
    role: "Funcionária",
    department: "Bar",
    avatar: "AF",
  },
  {
    id: "3",
    name: "Bruno Costa",
    role: "Funcionário",
    department: "Barbearia",
    avatar: "BC",
  },
  {
    id: "4",
    name: "Sofia Rodrigues",
    role: "Funcionária",
    department: "Estação de Serviço",
    avatar: "SR",
  },
  {
    id: "5",
    name: "Miguel Santos",
    role: "Funcionário",
    department: "Bar",
    avatar: "MS",
  },
  {
    id: "6",
    name: "Inês Oliveira",
    role: "Funcionária",
    department: "Barbearia",
    avatar: "IO",
  },
];

const INITIAL_MEETINGS: MockMeeting[] = [
  {
    id: "1",
    title: "Revisão Financeira Mensal",
    description:
      "Análise dos resultados financeiros de abril. Revisão de despesas operacionais, receitas por setor e projeção para maio. Todos os líderes de departamento devem trazer os relatórios atualizados.",
    date: "2026-05-10T10:00",
    participants: ["1", "2", "3"],
    createdBy: "Carlos Mendes",
    createdAt: "2026-05-01T09:00",
  },
  {
    id: "2",
    title: "Formação de Equipa — Bar",
    description:
      "Sessão de formação sobre novos cocktails sazonais e procedimentos de atendimento ao cliente. Presença obrigatória para toda a equipa do Bar.",
    date: "2026-05-15T14:30",
    participants: ["2", "5"],
    createdBy: "Carlos Mendes",
    createdAt: "2026-05-02T11:00",
  },
  {
    id: "3",
    title: "Avaliação de Desempenho — Barbearia",
    description:
      "Reunião de avaliação trimestral dos funcionários da Barbearia. Revisão de metas, desempenho individual e plano de desenvolvimento para o próximo trimestre.",
    date: "2026-05-20T09:00",
    participants: ["3", "6"],
    createdBy: "Carlos Mendes",
    createdAt: "2026-05-03T10:30",
  },
  {
    id: "4",
    title: "Planeamento Estratégico Q2",
    description:
      "Reunião geral para definir objetivos estratégicos do segundo trimestre. Discussão de expansão, novos serviços e investimentos em infraestrutura.",
    date: "2026-05-28T16:00",
    participants: ["1", "2", "3", "4", "5", "6"],
    createdBy: "Carlos Mendes",
    createdAt: "2026-05-04T08:00",
  },
  {
    id: "5",
    title: "Manutenção Preventiva — Posto",
    description:
      "Coordenação do plano de manutenção preventiva para os equipamentos do posto de gasolina. Calendário de paragens técnicas e responsabilidades da equipa.",
    date: "2026-06-05T08:00",
    participants: ["1", "4"],
    createdBy: "Sofia Rodrigues",
    createdAt: "2026-05-04T15:00",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDatePT(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShortPT(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isUpcoming(isoString: string): boolean {
  return new Date(isoString) > new Date();
}

function getAvatarColor(initials: string): string {
  const colors = [
    "bg-primary/20 text-primary",
    "bg-chart-2/20 text-chart-2",
    "bg-chart-3/20 text-chart-3",
    "bg-chart-4/20 text-chart-4",
    "bg-chart-5/20 text-chart-5",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

// ─── Components ───────────────────────────────────────────────────────────────
function AvatarInitials({
  name,
  size = "sm",
}: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const colorClass = getAvatarColor(initials);
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold shrink-0",
        colorClass,
        size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm",
      )}
    >
      {initials}
    </div>
  );
}

// ─── Meeting Card ─────────────────────────────────────────────────────────────
function MeetingCard({
  meeting,
  employees,
  canManage,
  onView,
  onDelete,
}: {
  meeting: MockMeeting;
  employees: MockEmployee[];
  canManage: boolean;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const upcoming = isUpcoming(meeting.date);
  const participantEmployees = employees.filter((e) =>
    meeting.participants.includes(e.id),
  );

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200"
      onClick={() => onView(meeting.id)}
      data-ocid={`reunioes.card.${meeting.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 border-0",
                  upcoming
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {upcoming ? "Próxima" : "Realizada"}
              </Badge>
            </div>
            <h3 className="font-display font-semibold text-base text-foreground leading-tight truncate">
              {meeting.title}
            </h3>
          </div>
          {canManage && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-8 h-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(meeting.id);
              }}
              aria-label="Eliminar reunião"
              data-ocid={`reunioes.delete_button.${meeting.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{formatDateShortPT(meeting.date)}</span>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {participantEmployees.slice(0, 4).map((emp) => (
                <AvatarInitials key={emp.id} name={emp.name} />
              ))}
            </div>
            {participantEmployees.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{participantEmployees.length - 4}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>
              {participantEmployees.length} participante
              {participantEmployees.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Created by */}
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          <span>
            Criado por{" "}
            <span className="font-medium text-foreground">
              {meeting.createdBy}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Meeting Detail ───────────────────────────────────────────────────────────
function MeetingDetail({
  meeting,
  employees,
  canManage,
  onBack,
  onSave,
  onDelete,
}: {
  meeting: MockMeeting;
  employees: MockEmployee[];
  canManage: boolean;
  onBack: () => void;
  onSave: (updated: MockMeeting) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(meeting.title);
  const [editDate, setEditDate] = useState(meeting.date);
  const [editParticipants, setEditParticipants] = useState<string[]>(
    meeting.participants,
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const upcoming = isUpcoming(meeting.date);
  const participantEmployees = employees.filter((e) =>
    meeting.participants.includes(e.id),
  );

  function handleSave() {
    onSave({
      ...meeting,
      title: editTitle,
      date: editDate,
      participants: editParticipants,
    });
    setEditing(false);
  }

  function handleCancelEdit() {
    setEditTitle(meeting.title);
    setEditDate(meeting.date);
    setEditParticipants(meeting.participants);
    setEditing(false);
  }

  function toggleParticipant(id: string) {
    setEditParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  return (
    <div data-ocid="reunioes.detail_panel">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="w-9 h-9"
          aria-label="Voltar"
          data-ocid="reunioes.back_button"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          {editing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-display font-bold text-xl h-auto text-foreground"
              data-ocid="reunioes.edit_title_input"
            />
          ) : (
            <h2 className="font-display font-bold text-xl text-foreground truncate">
              {meeting.title}
            </h2>
          )}
        </div>
        {canManage && !editing && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="gap-1.5"
              data-ocid="reunioes.edit_button"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              data-ocid="reunioes.detail_delete_button"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </Button>
          </div>
        )}
        {editing && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              data-ocid="reunioes.cancel_button"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="gap-1.5"
              data-ocid="reunioes.save_button"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Guardar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-xs font-semibold px-3 py-1 border-0",
                upcoming
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {upcoming ? "Próxima" : "Realizada"}
            </Badge>
          </div>

          {/* Date/Time */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <p className="text-label mb-2">Data e Hora</p>
              {editing ? (
                <Input
                  type="datetime-local"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="max-w-xs"
                  data-ocid="reunioes.edit_date_input"
                />
              ) : (
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium capitalize">
                    {formatDatePT(meeting.date)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <p className="text-label mb-2">Descrição</p>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {meeting.description}
              </p>
            </CardContent>
          </Card>

          {/* Created by */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>
              Criado por{" "}
              <span className="font-semibold text-foreground">
                {meeting.createdBy}
              </span>
            </span>
          </div>
        </div>

        {/* Right: participants */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Participantes
                <Badge className="ml-auto bg-primary/15 text-primary border-0 text-xs">
                  {editing
                    ? editParticipants.length
                    : participantEmployees.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {editing ? (
                <div
                  className="space-y-2"
                  data-ocid="reunioes.edit_participants"
                >
                  {employees.map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={editParticipants.includes(emp.id)}
                        onChange={() => toggleParticipant(emp.id)}
                        className="w-4 h-4 rounded accent-primary"
                        data-ocid={`reunioes.participant_checkbox.${emp.id}`}
                      />
                      <AvatarInitials name={emp.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight truncate">
                          {emp.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.department}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div
                  className="space-y-2"
                  data-ocid="reunioes.participants_list"
                >
                  {participantEmployees.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">
                      Sem participantes
                    </p>
                  ) : (
                    participantEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center gap-2.5 py-1"
                        data-ocid={`reunioes.participant_item.${emp.id}`}
                      >
                        <AvatarInitials name={emp.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground leading-tight truncate">
                            {emp.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {emp.department}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent data-ocid="reunioes.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Reunião?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que pretende eliminar a reunião{" "}
              <strong>{meeting.title}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="reunioes.delete_cancel_button">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDeleteDialog(false);
                onDelete(meeting.id);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="reunioes.delete_confirm_button"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Create Meeting Form ───────────────────────────────────────────────────────
function CreateMeetingForm({
  employees,
  onCancel,
  onSubmit,
}: {
  employees: MockEmployee[];
  onCancel: () => void;
  onSubmit: (data: Omit<MockMeeting, "id" | "createdAt">) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [search, setSearch] = useState("");

  const { userProfile } = useAppStore();
  const creatorName = userProfile?.name ?? "Administrador";

  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.department.toLowerCase().includes(search.toLowerCase()),
      ),
    [employees, search],
  );

  function toggleParticipant(id: string) {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      date,
      participants: selectedParticipants,
      createdBy: creatorName,
    });
  }

  const isValid = title.trim().length > 0 && date.length > 0;

  return (
    <div data-ocid="reunioes.create_form">
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="w-9 h-9"
          aria-label="Cancelar criação"
          data-ocid="reunioes.form_back_button"
        >
          <X className="w-5 h-5" />
        </Button>
        <h2 className="font-display font-bold text-xl text-foreground">
          Nova Reunião
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form fields */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-label" htmlFor="meeting-title">
                Título *
              </label>
              <Input
                id="meeting-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Reunião de avaliação mensal"
                className="h-10"
                required
                data-ocid="reunioes.title_input"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-label" htmlFor="meeting-desc">
                Descrição
              </label>
              <Textarea
                id="meeting-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo e a agenda da reunião..."
                rows={5}
                data-ocid="reunioes.description_textarea"
              />
            </div>

            {/* Date/Time */}
            <div className="space-y-1.5">
              <label className="text-label" htmlFor="meeting-date">
                Data e Hora *
              </label>
              <Input
                id="meeting-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 max-w-xs"
                required
                data-ocid="reunioes.date_input"
              />
            </div>

            {/* Creator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
              <User className="w-4 h-4" />
              <span>
                A criar como{" "}
                <span className="font-semibold text-foreground">
                  {creatorName}
                </span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={!isValid}
                className="gap-2"
                data-ocid="reunioes.submit_button"
              >
                <CheckCircle2 className="w-4 h-4" />
                Criar Reunião
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                data-ocid="reunioes.form_cancel_button"
              >
                Cancelar
              </Button>
            </div>
          </div>

          {/* Right: participants */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Participantes
                  {selectedParticipants.length > 0 && (
                    <Badge className="ml-auto bg-primary/15 text-primary border-0 text-xs">
                      {selectedParticipants.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Search participants */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar funcionários..."
                    className="pl-8 h-8 text-sm"
                    data-ocid="reunioes.participant_search_input"
                  />
                </div>

                <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                  {filteredEmployees.map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(emp.id)}
                        onChange={() => toggleParticipant(emp.id)}
                        className="w-4 h-4 rounded accent-primary"
                        data-ocid={`reunioes.new_participant_checkbox.${emp.id}`}
                      />
                      <AvatarInitials name={emp.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight truncate">
                          {emp.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.department}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type View = "list" | "create" | "detail";

export default function ReunioesPage() {
  const { userProfile } = useAppStore();
  const [meetings, setMeetings] = useState<MockMeeting[]>(INITIAL_MEETINGS);
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const canManage =
    userProfile?.role === "OWNER" ||
    userProfile?.role === "ADMIN" ||
    !userProfile;

  const selectedMeeting = meetings.find((m) => m.id === selectedId) ?? null;

  const filteredMeetings = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return meetings;
    return meetings.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.createdBy.toLowerCase().includes(q),
    );
  }, [meetings, searchQuery]);

  const upcomingMeetings = filteredMeetings.filter((m) => isUpcoming(m.date));
  const pastMeetings = filteredMeetings.filter((m) => !isUpcoming(m.date));

  function handleCreateMeeting(data: Omit<MockMeeting, "id" | "createdAt">) {
    const newMeeting: MockMeeting = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    setView("list");
  }

  function handleUpdateMeeting(updated: MockMeeting) {
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }

  function handleDeleteMeeting(id: string) {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (view === "detail") setView("list");
  }

  return (
    <div className="p-6 md:p-8 min-h-full" data-ocid="reunioes.page">
      <div className="max-w-7xl mx-auto">
        {/* List view */}
        {view === "list" && (
          <>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display font-bold text-2xl text-foreground">
                  Reuniões
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {meetings.length} reunião{meetings.length !== 1 ? "s" : ""} no
                  total
                </p>
              </div>
              {canManage && (
                <Button
                  type="button"
                  onClick={() => setView("create")}
                  className="gap-2 shrink-0"
                  data-ocid="reunioes.new_meeting_button"
                >
                  <Plus className="w-4 h-4" />
                  Nova Reunião
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar reuniões..."
                className="pl-9"
                data-ocid="reunioes.search_input"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7"
                  aria-label="Limpar pesquisa"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {/* Upcoming meetings */}
            {upcomingMeetings.length > 0 && (
              <section className="mb-8" data-ocid="reunioes.upcoming_section">
                <h2 className="text-label mb-4">Próximas reuniões</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {upcomingMeetings.map((m) => (
                    <MeetingCard
                      key={m.id}
                      meeting={m}
                      employees={MOCK_EMPLOYEES}
                      canManage={canManage}
                      onView={(id) => {
                        setSelectedId(id);
                        setView("detail");
                      }}
                      onDelete={setDeleteTargetId}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past meetings */}
            {pastMeetings.length > 0 && (
              <section data-ocid="reunioes.past_section">
                <h2 className="text-label mb-4">Reuniões realizadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pastMeetings.map((m) => (
                    <MeetingCard
                      key={m.id}
                      meeting={m}
                      employees={MOCK_EMPLOYEES}
                      canManage={canManage}
                      onView={(id) => {
                        setSelectedId(id);
                        setView("detail");
                      }}
                      onDelete={setDeleteTargetId}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {filteredMeetings.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-20 text-center"
                data-ocid="reunioes.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  {searchQuery
                    ? "Nenhuma reunião encontrada"
                    : "Sem reuniões agendadas"}
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {searchQuery
                    ? "Tente ajustar a sua pesquisa."
                    : "Crie a primeira reunião para começar."}
                </p>
                {canManage && !searchQuery && (
                  <Button
                    type="button"
                    onClick={() => setView("create")}
                    className="gap-2"
                    data-ocid="reunioes.empty_new_button"
                  >
                    <Plus className="w-4 h-4" />
                    Nova Reunião
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Create view */}
        {view === "create" && (
          <CreateMeetingForm
            employees={MOCK_EMPLOYEES}
            onCancel={() => setView("list")}
            onSubmit={handleCreateMeeting}
          />
        )}

        {/* Detail view */}
        {view === "detail" && selectedMeeting && (
          <MeetingDetail
            meeting={selectedMeeting}
            employees={MOCK_EMPLOYEES}
            canManage={canManage}
            onBack={() => setView("list")}
            onSave={handleUpdateMeeting}
            onDelete={handleDeleteMeeting}
          />
        )}
      </div>

      {/* Delete confirmation dialog (from list view) */}
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
      >
        <AlertDialogContent data-ocid="reunioes.list_delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Reunião?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que pretende eliminar esta reunião? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteTargetId(null)}
              data-ocid="reunioes.list_delete_cancel_button"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTargetId) handleDeleteMeeting(deleteTargetId);
                setDeleteTargetId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="reunioes.list_delete_confirm_button"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
