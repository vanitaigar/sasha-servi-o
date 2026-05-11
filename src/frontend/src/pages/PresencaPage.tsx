import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CheckInState {
  timestamp: Date;
  lat: number;
  lng: number;
}

type GeoStatus =
  | "idle"
  | "loading"
  | "success"
  | "error_denied"
  | "error_unsupported"
  | "error_timeout";

interface HistoryEntry {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string | null;
  duration: string | null;
}

// ─── Mock history data ────────────────────────────────────────────────────────
const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: 1,
    date: "2026-04-28",
    checkIn: "08:02",
    checkOut: "17:05",
    duration: "9h 03m",
  },
  {
    id: 2,
    date: "2026-04-27",
    checkIn: "07:58",
    checkOut: "17:00",
    duration: "9h 02m",
  },
  {
    id: 3,
    date: "2026-04-26",
    checkIn: "08:15",
    checkOut: "17:20",
    duration: "9h 05m",
  },
  {
    id: 4,
    date: "2026-04-25",
    checkIn: "08:00",
    checkOut: "16:58",
    duration: "8h 58m",
  },
  {
    id: 5,
    date: "2026-04-24",
    checkIn: "08:10",
    checkOut: "17:10",
    duration: "9h 00m",
  },
  {
    id: 6,
    date: "2026-04-23",
    checkIn: "07:55",
    checkOut: "17:05",
    duration: "9h 10m",
  },
  {
    id: 7,
    date: "2026-04-22",
    checkIn: "08:05",
    checkOut: null,
    duration: null,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function calcDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const totalMin = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  return `${hours}h ${String(mins).padStart(2, "0")}m`;
}

function formatDatePT(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function getDayOfWeek(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("pt-PT", { weekday: "short" });
}

const GEO_ERROR_MESSAGES: Record<string, string> = {
  error_denied:
    "Permissão de localização negada. Ative o GPS nas definições do browser.",
  error_unsupported: "O seu browser não suporta geolocalização.",
  error_timeout:
    "Tempo limite excedido ao obter a localização. Tente novamente.",
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function PresencaPage() {
  const [checkIn, setCheckIn] = useState<CheckInState | null>(null);
  const [checkOut, setCheckOut] = useState<CheckInState | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [activeAction, setActiveAction] = useState<
    "checkin" | "checkout" | null
  >(null);

  const getLocation = (action: "checkin" | "checkout") => {
    if (!navigator.geolocation) {
      setGeoStatus("error_unsupported");
      return;
    }
    setActiveAction(action);
    setGeoStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const state: CheckInState = {
          timestamp: new Date(),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        if (action === "checkin") {
          setCheckIn(state);
          setCheckOut(null);
        } else {
          setCheckOut(state);
        }
        setGeoStatus("success");
        setActiveAction(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeoStatus("error_denied");
        else if (err.code === err.TIMEOUT) setGeoStatus("error_timeout");
        else setGeoStatus("error_unsupported");
        setActiveAction(null);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  const isCheckedIn = !!checkIn;
  const isCheckedOut = !!checkOut;
  const canCheckOut = isCheckedIn && !isCheckedOut;
  const isLoading = geoStatus === "loading";
  const hasError = geoStatus.startsWith("error_");

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div data-ocid="presenca.page">
          <h1 className="font-display font-bold text-2xl text-foreground">
            Presença GPS
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Registe a sua entrada e saída com verificação de localização.
          </p>
        </div>

        {/* Location status bar */}
        {geoStatus !== "idle" && (
          <div
            data-ocid="presenca.location_status"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${
              hasError
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : geoStatus === "loading"
                  ? "bg-muted border-border text-muted-foreground"
                  : "bg-primary/10 border-primary/30 text-primary"
            }`}
          >
            {geoStatus === "loading" && (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            )}
            {geoStatus === "success" && (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            {hasError && <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>
              {geoStatus === "loading" && "A obter localização..."}
              {geoStatus === "success" && "Localização capturada com sucesso."}
              {hasError && GEO_ERROR_MESSAGES[geoStatus]}
            </span>
          </div>
        )}

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Check-in card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <LogIn className="w-4 h-4 text-primary" />
                </div>
                Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkIn ? (
                <div
                  data-ocid="presenca.checkin.success_state"
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Registado
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDateTime(checkIn.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-mono text-xs">
                        {checkIn.lat.toFixed(6)}, {checkIn.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ainda não registou a entrada de hoje.
                </p>
              )}
              <Button
                data-ocid="presenca.checkin_button"
                variant="default"
                className="w-full gap-2 transition-smooth"
                disabled={isCheckedIn || isLoading}
                onClick={() => getLocation("checkin")}
              >
                {isLoading && activeAction === "checkin" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> A registar...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Fazer Check-in
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Check-out card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    canCheckOut ? "bg-chart-3/15" : "bg-muted"
                  }`}
                >
                  <LogOut
                    className={`w-4 h-4 ${canCheckOut ? "text-chart-3" : "text-muted-foreground"}`}
                  />
                </div>
                Check-out
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkOut ? (
                <div
                  data-ocid="presenca.checkout.success_state"
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Registado
                    </Badge>
                    {checkIn && (
                      <Badge
                        variant="outline"
                        className="gap-1 font-mono text-xs"
                      >
                        <Timer className="w-3 h-3" />
                        {calcDuration(checkIn.timestamp, checkOut.timestamp)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDateTime(checkOut.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-mono text-xs">
                        {checkOut.lat.toFixed(6)}, {checkOut.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {canCheckOut
                    ? `Em serviço desde ${formatTime(checkIn!.timestamp)}.`
                    : "Faça check-in primeiro para poder registar a saída."}
                </p>
              )}
              <Button
                data-ocid="presenca.checkout_button"
                variant="outline"
                className="w-full gap-2 transition-smooth"
                disabled={!canCheckOut || isLoading}
                onClick={() => getLocation("checkout")}
              >
                {isLoading && activeAction === "checkout" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> A registar...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" /> Fazer Check-out
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's status card */}
        <Card data-ocid="presenca.today_card" className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-primary" />
              Estado de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!checkIn ? (
              <div className="flex items-center gap-3 py-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Ainda não fez check-in hoje.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-label">Entrada</p>
                  <p className="font-display font-semibold text-lg text-foreground">
                    {formatTime(checkIn.timestamp)}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {checkIn.lat.toFixed(5)}, {checkIn.lng.toFixed(5)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-label">Saída</p>
                  {checkOut ? (
                    <>
                      <p className="font-display font-semibold text-lg text-foreground">
                        {formatTime(checkOut.timestamp)}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {checkOut.lat.toFixed(5)}, {checkOut.lng.toFixed(5)}
                      </p>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Em serviço
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-label">Duração</p>
                  {checkOut ? (
                    <p className="font-display font-semibold text-lg text-foreground">
                      {calcDuration(checkIn.timestamp, checkOut.timestamp)}
                    </p>
                  ) : (
                    <LiveDuration since={checkIn.timestamp} />
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History table */}
        <Card
          data-ocid="presenca.history_card"
          className="bg-card border-border"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-primary" />
              Histórico — Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-label">Data</th>
                    <th className="text-left px-4 py-3 text-label">Dia</th>
                    <th className="text-left px-4 py-3 text-label">Entrada</th>
                    <th className="text-left px-4 py-3 text-label">Saída</th>
                    <th className="text-right px-4 py-3 text-label">Duração</th>
                    <th className="text-left px-4 py-3 text-label">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HISTORY.map((entry, index) => (
                    <tr
                      key={entry.id}
                      data-ocid={`presenca.history.item.${index + 1}`}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-foreground">
                        {formatDatePT(entry.date)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">
                        {getDayOfWeek(entry.date)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-medium text-foreground">
                          {entry.checkIn}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {entry.checkOut ? (
                          <span className="font-mono font-medium text-foreground">
                            {entry.checkOut}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {entry.duration ? (
                          <span className="font-mono text-foreground">
                            {entry.duration}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {entry.checkOut ? (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completo
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs text-destructive border-destructive/30"
                          >
                            Incompleto
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Live duration counter ────────────────────────────────────────────────────
function LiveDuration({ since }: { since: Date }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="font-display font-semibold text-lg text-primary">
      {calcDuration(since, now)}
    </p>
  );
}
