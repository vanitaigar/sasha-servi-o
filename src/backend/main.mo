import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import UserTypes "types/users";
import EmployeeTypes "types/employees";
import FinanceTypes "types/finance";
import MeetingTypes "types/meetings";
import AttendanceTypes "types/attendance";
import NotifTypes "types/notifications";
import UsersApi "mixins/users-api";
import EmployeesApi "mixins/employees-api";
import FinanceApi "mixins/finance-api";
import MeetingsApi "mixins/meetings-api";
import AttendanceApi "mixins/attendance-api";
import NotificationsApi "mixins/notifications-api";

actor {
  // --- Infrastructure ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinObjectStorage();

  // --- State ---
  let users = Map.empty<Principal, UserTypes.UserProfile>();
  let employees = Map.empty<Nat, EmployeeTypes.EmployeeProfile>();
  let reviews = Map.empty<Nat, EmployeeTypes.Review>();
  let transactions = Map.empty<Nat, FinanceTypes.Transaction>();
  let meetings = Map.empty<Nat, MeetingTypes.Meeting>();
  let attendanceRecords = Map.empty<Nat, AttendanceTypes.AttendanceRecord>();
  let locations = Map.empty<Nat, AttendanceTypes.Location>();
  let notifications = Map.empty<Nat, NotifTypes.Notification>();

  // --- Domain Mixins ---
  include UsersApi(accessControlState, users);
  include EmployeesApi(accessControlState, employees, reviews);
  include FinanceApi(accessControlState, transactions);
  include MeetingsApi(accessControlState, meetings);
  include AttendanceApi(accessControlState, attendanceRecords, locations);
  include NotificationsApi(accessControlState, notifications);
};
