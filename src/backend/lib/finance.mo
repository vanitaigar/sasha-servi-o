import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Types "../types/finance";
import Common "../types/common";

module {
  public func getTransaction(
    transactions : Map.Map<Nat, Types.Transaction>,
    id : Nat,
  ) : ?Types.Transaction {
    transactions.get(id);
  };

  public func listTransactions(
    transactions : Map.Map<Nat, Types.Transaction>,
  ) : [Types.Transaction] {
    transactions.values() |> _.toArray();
  };

  public func listTransactionsByDepartment(
    transactions : Map.Map<Nat, Types.Transaction>,
    department : Common.Department,
  ) : [Types.Transaction] {
    transactions.values()
      |> _.filter(func(t : Types.Transaction) : Bool { t.department == department })
      |> _.toArray();
  };

  public func listTransactionsFiltered(
    transactions : Map.Map<Nat, Types.Transaction>,
    txType : ?Common.TransactionType,
    department : ?Common.Department,
    fromTs : ?Common.Timestamp,
    toTs : ?Common.Timestamp,
  ) : [Types.Transaction] {
    transactions.values()
      |> _.filter(
          func(t : Types.Transaction) : Bool {
            let matchType = switch (txType) {
              case null true;
              case (?tp) { t.transactionType == tp };
            };
            let matchDept = switch (department) {
              case null true;
              case (?d) { t.department == d };
            };
            let matchFrom = switch (fromTs) {
              case null true;
              case (?f) { t.date >= f };
            };
            let matchTo = switch (toTs) {
              case null true;
              case (?to) { t.date <= to };
            };
            matchType and matchDept and matchFrom and matchTo;
          },
        )
      |> _.toArray();
  };

  public func createTransaction(
    transactions : Map.Map<Nat, Types.Transaction>,
    nextId : Nat,
    input : Types.TransactionInput,
    createdBy : Principal,
    now : Common.Timestamp,
  ) : Types.Transaction {
    let tx : Types.Transaction = {
      id = nextId;
      transactionType = input.transactionType;
      amount = input.amount;
      category = input.category;
      department = input.department;
      notes = input.notes;
      createdBy;
      date = now;
    };
    transactions.add(nextId, tx);
    tx;
  };

  public func deleteTransaction(
    transactions : Map.Map<Nat, Types.Transaction>,
    id : Nat,
  ) : Bool {
    switch (transactions.get(id)) {
      case null false;
      case _ {
        transactions.remove(id);
        true;
      };
    };
  };

  public func generateReport(
    transactions : Map.Map<Nat, Types.Transaction>,
    period : Common.ReportPeriod,
    department : ?Common.Department,
    from : Common.Timestamp,
    to : Common.Timestamp,
  ) : Types.Report {
    var income : Float = 0.0;
    var expense : Float = 0.0;
    for ((_, tx) in transactions.entries()) {
      let inRange = tx.date >= from and tx.date <= to;
      let inDept = switch (department) {
        case null true;
        case (?d) { tx.department == d };
      };
      if (inRange and inDept) {
        switch (tx.transactionType) {
          case (#INCOME) { income += tx.amount };
          case (#EXPENSE) { expense += tx.amount };
        };
      };
    };
    {
      period;
      department;
      income;
      expense;
      profit = income - expense;
      from;
      to;
    };
  };
};
