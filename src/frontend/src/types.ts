import type { ExternalBlob } from "@/backend";
import type { Principal } from "@icp-sdk/core/principal";

export type Role = "OWNER" | "ADMIN" | "EMPLOYEE";
export type Department = "GAS_STATION" | "BAR" | "BARBERSHOP";
export type TransactionType = "INCOME" | "EXPENSE";
export type ReportPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface UserProfile {
  id: Principal;
  name: string;
  email: string;
  role: Role;
  photoUrl: ExternalBlob;
  createdAt: bigint;
  isActive: boolean;
}

export interface EmployeeProfile {
  id: bigint;
  userId: Principal;
  department: Department;
  position: string;
  salary: number;
  performanceScore: number;
}

export interface Transaction {
  id: bigint;
  transactionType: TransactionType;
  amount: number;
  category: string;
  department: Department;
  createdBy: Principal;
  date: bigint;
  notes: string;
}

export interface Meeting {
  id: bigint;
  title: string;
  description: string;
  date: bigint;
  participants: Principal[];
  createdBy: Principal;
}

export interface AttendanceRecord {
  id: bigint;
  userId: Principal;
  checkIn: bigint;
  checkOut: bigint | null;
  gpsLat: number;
  gpsLng: number;
}

export interface Notification {
  id: bigint;
  userId: Principal;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: bigint;
}

export interface Review {
  id: bigint;
  employeeId: bigint;
  score: number;
  comments: string;
  date: bigint;
}

export const DEPARTMENT_LABELS: Record<Department, string> = {
  GAS_STATION: "Estação de Serviço",
  BAR: "Bar",
  BARBERSHOP: "Barbearia",
};

export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Dono",
  ADMIN: "Administrador",
  EMPLOYEE: "Funcionário",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
};

export const REPORT_PERIOD_LABELS: Record<ReportPeriod, string> = {
  DAILY: "Diário",
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  YEARLY: "Anual",
};
