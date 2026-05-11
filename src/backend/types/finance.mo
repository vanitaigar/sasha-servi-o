import Common "common";

module {
  public type Transaction = {
    id : Nat;
    transactionType : Common.TransactionType;
    amount : Float;
    category : Text;
    department : Common.Department;
    createdBy : Principal;
    date : Common.Timestamp;
    notes : Text;
  };

  public type TransactionInput = {
    transactionType : Common.TransactionType;
    amount : Float;
    category : Text;
    department : Common.Department;
    notes : Text;
  };

  public type Report = {
    period : Common.ReportPeriod;
    department : ?Common.Department;
    income : Float;
    expense : Float;
    profit : Float;
    from : Common.Timestamp;
    to : Common.Timestamp;
  };
};
