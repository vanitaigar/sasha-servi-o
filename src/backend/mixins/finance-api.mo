import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import FinanceTypes "../types/finance";
import Common "../types/common";
import FinanceLib "../lib/finance";

mixin (
  accessControlState : AccessControl.AccessControlState,
  transactions : Map.Map<Nat, FinanceTypes.Transaction>,
) {
  var nextTransactionId : Nat = 1;

  /// Gets a transaction by ID — ADMIN/OWNER only
  public query ({ caller }) func getTransaction(id : Nat) : async ?FinanceTypes.Transaction {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem ver transações");
    };
    FinanceLib.getTransaction(transactions, id);
  };

  /// Lists all transactions with optional filters — ADMIN/OWNER only
  public query ({ caller }) func listTransactions(
    txType : ?Common.TransactionType,
    department : ?Common.Department,
    fromTs : ?Common.Timestamp,
    toTs : ?Common.Timestamp,
  ) : async [FinanceTypes.Transaction] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem listar transações");
    };
    FinanceLib.listTransactionsFiltered(transactions, txType, department, fromTs, toTs);
  };

  /// Lists transactions filtered by department — ADMIN/OWNER only
  public query ({ caller }) func listTransactionsByDepartment(department : Common.Department) : async [FinanceTypes.Transaction] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem listar transações");
    };
    FinanceLib.listTransactionsByDepartment(transactions, department);
  };

  /// Records a new transaction — ADMIN/OWNER only
  public shared ({ caller }) func recordTransaction(input : FinanceTypes.TransactionInput) : async FinanceTypes.Transaction {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem registar transações");
    };
    let id = nextTransactionId;
    nextTransactionId += 1;
    FinanceLib.createTransaction(transactions, id, input, caller, Time.now());
  };

  /// Deletes a transaction — ADMIN/OWNER only
  public shared ({ caller }) func deleteTransaction(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem eliminar transações");
    };
    FinanceLib.deleteTransaction(transactions, id);
  };

  /// Generates a financial report — ADMIN/OWNER only
  public query ({ caller }) func generateReport(
    period : Common.ReportPeriod,
    department : ?Common.Department,
    from : Common.Timestamp,
    to : Common.Timestamp,
  ) : async FinanceTypes.Report {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem gerar relatórios");
    };
    FinanceLib.generateReport(transactions, period, department, from, to);
  };
};
