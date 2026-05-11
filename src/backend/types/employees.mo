import Common "common";

module {
  public type EmployeeProfile = {
    id : Nat;
    userId : Principal;
    department : Common.Department;
    position : Text;
    salary : Float;
    performanceScore : Float;
  };

  public type EmployeeProfileInput = {
    userId : Principal;
    department : Common.Department;
    position : Text;
    salary : Float;
  };

  public type Review = {
    id : Nat;
    employeeId : Nat;
    score : Float;
    comments : Text;
    date : Int;
    reviewedBy : Principal;
  };

  public type ReviewInput = {
    employeeId : Nat;
    score : Float;
    comments : Text;
  };
};
