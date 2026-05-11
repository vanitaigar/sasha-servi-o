module {
  public type Notification = {
    id : Nat;
    userId : Principal;
    title : Text;
    message : Text;
    isRead : Bool;
    createdAt : Int;
  };

  public type NotificationInput = {
    userId : Principal;
    title : Text;
    message : Text;
  };
};
