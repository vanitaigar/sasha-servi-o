import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Types "../types/employees";
import Common "../types/common";

module {
  public func getEmployee(
    employees : Map.Map<Nat, Types.EmployeeProfile>,
    id : Nat,
  ) : ?Types.EmployeeProfile {
    employees.get(id);
  };

  public func listEmployees(
    employees : Map.Map<Nat, Types.EmployeeProfile>,
  ) : [Types.EmployeeProfile] {
    employees.values() |> _.toArray();
  };

  public func listByDepartment(
    employees : Map.Map<Nat, Types.EmployeeProfile>,
    department : Common.Department,
  ) : [Types.EmployeeProfile] {
    employees.values()
      |> _.filter(func(e : Types.EmployeeProfile) : Bool { e.department == department })
      |> _.toArray();
  };

  public func createEmployee(
    employees : Map.Map<Nat, Types.EmployeeProfile>,
    nextId : Nat,
    input : Types.EmployeeProfileInput,
  ) : Types.EmployeeProfile {
    let profile : Types.EmployeeProfile = {
      id = nextId;
      userId = input.userId;
      department = input.department;
      position = input.position;
      salary = input.salary;
      performanceScore = 0.0;
    };
    employees.add(nextId, profile);
    profile;
  };

  public func updateEmployee(
    employees : Map.Map<Nat, Types.EmployeeProfile>,
    id : Nat,
    input : Types.EmployeeProfileInput,
  ) : ?Types.EmployeeProfile {
    switch (employees.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.EmployeeProfile = {
          existing with
          userId = input.userId;
          department = input.department;
          position = input.position;
          salary = input.salary;
        };
        employees.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteEmployee(
    employees : Map.Map<Nat, Types.EmployeeProfile>,
    id : Nat,
  ) : Bool {
    switch (employees.get(id)) {
      case null false;
      case _ {
        employees.remove(id);
        true;
      };
    };
  };

  public func updatePerformanceScore(
    employees : Map.Map<Nat, Types.EmployeeProfile>,
    id : Nat,
    score : Float,
  ) : Bool {
    switch (employees.get(id)) {
      case null false;
      case (?existing) {
        let updated : Types.EmployeeProfile = { existing with performanceScore = score };
        employees.add(id, updated);
        true;
      };
    };
  };

  public func getReview(
    reviews : Map.Map<Nat, Types.Review>,
    id : Nat,
  ) : ?Types.Review {
    reviews.get(id);
  };

  public func listReviewsForEmployee(
    reviews : Map.Map<Nat, Types.Review>,
    employeeId : Nat,
  ) : [Types.Review] {
    reviews.values()
      |> _.filter(func(r : Types.Review) : Bool { r.employeeId == employeeId })
      |> _.toArray();
  };

  public func createReview(
    reviews : Map.Map<Nat, Types.Review>,
    nextId : Nat,
    input : Types.ReviewInput,
    reviewedBy : Principal,
    now : Int,
  ) : Types.Review {
    let review : Types.Review = {
      id = nextId;
      employeeId = input.employeeId;
      score = input.score;
      comments = input.comments;
      date = now;
      reviewedBy;
    };
    reviews.add(nextId, review);
    review;
  };
};
