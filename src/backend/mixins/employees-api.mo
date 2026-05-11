import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import EmployeeTypes "../types/employees";
import Common "../types/common";
import EmployeesLib "../lib/employees";

mixin (
  accessControlState : AccessControl.AccessControlState,
  employees : Map.Map<Nat, EmployeeTypes.EmployeeProfile>,
  reviews : Map.Map<Nat, EmployeeTypes.Review>,
) {
  var nextEmployeeId : Nat = 1;
  var nextReviewId : Nat = 1;

  /// Gets an employee profile by ID
  public query ({ caller }) func getEmployeeProfile(id : Nat) : async ?EmployeeTypes.EmployeeProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    EmployeesLib.getEmployee(employees, id);
  };

  /// Lists all employees — authenticated users
  public query ({ caller }) func listEmployees() : async [EmployeeTypes.EmployeeProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    EmployeesLib.listEmployees(employees);
  };

  /// Lists employees by department
  public query ({ caller }) func listEmployeesByDepartment(department : Common.Department) : async [EmployeeTypes.EmployeeProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    EmployeesLib.listByDepartment(employees, department);
  };

  /// Creates an employee profile — ADMIN/OWNER only
  public shared ({ caller }) func createEmployeeProfile(input : EmployeeTypes.EmployeeProfileInput) : async EmployeeTypes.EmployeeProfile {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem criar perfis de funcionários");
    };
    let id = nextEmployeeId;
    nextEmployeeId += 1;
    EmployeesLib.createEmployee(employees, id, input);
  };

  /// Updates an employee profile — ADMIN/OWNER only
  public shared ({ caller }) func updateEmployeeProfile(id : Nat, input : EmployeeTypes.EmployeeProfileInput) : async ?EmployeeTypes.EmployeeProfile {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem atualizar funcionários");
    };
    EmployeesLib.updateEmployee(employees, id, input);
  };

  /// Deletes an employee profile — ADMIN/OWNER only
  public shared ({ caller }) func deleteEmployeeProfile(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem eliminar funcionários");
    };
    EmployeesLib.deleteEmployee(employees, id);
  };

  /// Updates the performance score of an employee — ADMIN/OWNER only
  public shared ({ caller }) func updatePerformanceScore(id : Nat, score : Float) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem atualizar avaliações");
    };
    EmployeesLib.updatePerformanceScore(employees, id, score);
  };

  /// Submits a review for an employee — ADMIN/OWNER only
  public shared ({ caller }) func submitReview(input : EmployeeTypes.ReviewInput) : async EmployeeTypes.Review {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem submeter avaliações");
    };
    let id = nextReviewId;
    nextReviewId += 1;
    EmployeesLib.createReview(reviews, id, input, caller, Time.now());
  };

  /// Lists reviews for a given employee
  public query ({ caller }) func listReviewsForEmployee(employeeId : Nat) : async [EmployeeTypes.Review] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    EmployeesLib.listReviewsForEmployee(reviews, employeeId);
  };
};
