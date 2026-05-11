module {
  // Shared primitive aliases
  public type Timestamp = Int;

  // Role variants
  public type Role = {
    #OWNER;
    #ADMIN;
    #EMPLOYEE;
  };

  // Department variants
  public type Department = {
    #GAS_STATION;
    #BAR;
    #BARBERSHOP;
  };

  // Transaction type variants
  public type TransactionType = {
    #INCOME;
    #EXPENSE;
  };

  // Report period variants
  public type ReportPeriod = {
    #DAILY;
    #WEEKLY;
    #MONTHLY;
    #YEARLY;
  };
};
