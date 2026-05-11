import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfileInput {
    name: string;
    role: Role;
    photoUrl: ExternalBlob;
    email: string;
}
export interface UserProfile {
    id: Principal;
    name: string;
    createdAt: Timestamp;
    role: Role;
    photoUrl: ExternalBlob;
    isActive: boolean;
    email: string;
}
export type Timestamp = bigint;
export interface Location {
    id: bigint;
    name: string;
    radius: number;
    gpsLat: number;
    gpsLng: number;
}
export interface Meeting {
    id: bigint;
    title: string;
    participants: Array<Principal>;
    date: bigint;
    createdBy: Principal;
    description: string;
}
export interface MeetingInput {
    title: string;
    participants: Array<Principal>;
    date: bigint;
    description: string;
}
export interface LocationInput {
    name: string;
    radius: number;
    gpsLat: number;
    gpsLng: number;
}
export interface Report {
    to: Timestamp;
    expense: number;
    period: ReportPeriod;
    from: Timestamp;
    income: number;
    profit: number;
    department?: Department;
}
export interface Transaction {
    id: bigint;
    transactionType: TransactionType;
    date: Timestamp;
    createdBy: Principal;
    notes: string;
    category: string;
    department: Department;
    amount: number;
}
export interface EmployeeProfileInput {
    salary: number;
    userId: Principal;
    department: Department;
    position: string;
}
export interface Notification {
    id: bigint;
    title: string;
    userId: Principal;
    createdAt: bigint;
    isRead: boolean;
    message: string;
}
export interface NotificationInput {
    title: string;
    userId: Principal;
    message: string;
}
export interface EmployeeProfile {
    id: bigint;
    salary: number;
    performanceScore: number;
    userId: Principal;
    department: Department;
    position: string;
}
export interface AttendanceRecord {
    id: bigint;
    checkIn: bigint;
    userId: Principal;
    checkOut?: bigint;
    gpsLat: number;
    gpsLng: number;
}
export interface ReviewInput {
    score: number;
    employeeId: bigint;
    comments: string;
}
export interface TransactionInput {
    transactionType: TransactionType;
    notes: string;
    category: string;
    department: Department;
    amount: number;
}
export interface Review {
    id: bigint;
    date: bigint;
    reviewedBy: Principal;
    score: number;
    employeeId: bigint;
    comments: string;
}
export enum Department {
    BAR = "BAR",
    BARBERSHOP = "BARBERSHOP",
    GAS_STATION = "GAS_STATION"
}
export enum ReportPeriod {
    MONTHLY = "MONTHLY",
    DAILY = "DAILY",
    YEARLY = "YEARLY",
    WEEKLY = "WEEKLY"
}
export enum Role {
    ADMIN = "ADMIN",
    OWNER = "OWNER",
    EMPLOYEE = "EMPLOYEE"
}
export enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(id: Principal, role: Role): Promise<boolean>;
    checkIn(gpsLat: number, gpsLng: number): Promise<AttendanceRecord>;
    checkOut(): Promise<AttendanceRecord | null>;
    createEmployeeProfile(input: EmployeeProfileInput): Promise<EmployeeProfile>;
    createLocation(input: LocationInput): Promise<Location>;
    createMeeting(input: MeetingInput): Promise<Meeting>;
    createUser(id: Principal, input: UserProfileInput): Promise<UserProfile>;
    deactivateUser(id: Principal): Promise<boolean>;
    deleteEmployeeProfile(id: bigint): Promise<boolean>;
    deleteLocation(id: bigint): Promise<boolean>;
    deleteMeeting(id: bigint): Promise<boolean>;
    deleteNotification(id: bigint): Promise<boolean>;
    deleteTransaction(id: bigint): Promise<boolean>;
    generateReport(period: ReportPeriod, department: Department | null, from: Timestamp, to: Timestamp): Promise<Report>;
    getAttendanceRecord(id: bigint): Promise<AttendanceRecord | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmployeeProfile(id: bigint): Promise<EmployeeProfile | null>;
    getLocation(id: bigint): Promise<Location | null>;
    getMeeting(id: bigint): Promise<Meeting | null>;
    getTransaction(id: bigint): Promise<Transaction | null>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllAttendance(): Promise<Array<AttendanceRecord>>;
    listAttendanceByUser(userId: Principal): Promise<Array<AttendanceRecord>>;
    listEmployees(): Promise<Array<EmployeeProfile>>;
    listEmployeesByDepartment(department: Department): Promise<Array<EmployeeProfile>>;
    listLocations(): Promise<Array<Location>>;
    listMeetings(): Promise<Array<Meeting>>;
    listMyAttendance(): Promise<Array<AttendanceRecord>>;
    listMyNotifications(): Promise<Array<Notification>>;
    listReviewsForEmployee(employeeId: bigint): Promise<Array<Review>>;
    listTransactions(txType: TransactionType | null, department: Department | null, fromTs: Timestamp | null, toTs: Timestamp | null): Promise<Array<Transaction>>;
    listTransactionsByDepartment(department: Department): Promise<Array<Transaction>>;
    listUsers(): Promise<Array<UserProfile>>;
    markAllNotificationsRead(): Promise<bigint>;
    markNotificationRead(id: bigint): Promise<boolean>;
    recordTransaction(input: TransactionInput): Promise<Transaction>;
    saveCallerUserProfile(input: UserProfileInput): Promise<void>;
    sendNotification(input: NotificationInput): Promise<Notification>;
    submitReview(input: ReviewInput): Promise<Review>;
    updateEmployeeProfile(id: bigint, input: EmployeeProfileInput): Promise<EmployeeProfile | null>;
    updateLocation(id: bigint, input: LocationInput): Promise<Location | null>;
    updateMeeting(id: bigint, input: MeetingInput): Promise<Meeting | null>;
    updatePerformanceScore(id: bigint, score: number): Promise<boolean>;
    updateUser(id: Principal, input: UserProfileInput): Promise<UserProfile | null>;
}
