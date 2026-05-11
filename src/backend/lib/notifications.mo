import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Types "../types/notifications";

module {
  public func listForUser(
    notifications : Map.Map<Nat, Types.Notification>,
    userId : Principal,
  ) : [Types.Notification] {
    notifications.values()
      |> _.filter(func(n : Types.Notification) : Bool { Principal.equal(n.userId, userId) })
      |> _.toArray();
  };

  public func markRead(
    notifications : Map.Map<Nat, Types.Notification>,
    id : Nat,
    userId : Principal,
  ) : Bool {
    switch (notifications.get(id)) {
      case null false;
      case (?n) {
        if (not Principal.equal(n.userId, userId)) {
          false;
        } else {
          notifications.add(id, { n with isRead = true });
          true;
        };
      };
    };
  };

  public func markAllRead(
    notifications : Map.Map<Nat, Types.Notification>,
    userId : Principal,
  ) : Nat {
    var count = 0;
    for ((id, n) in notifications.entries()) {
      if (Principal.equal(n.userId, userId) and not n.isRead) {
        notifications.add(id, { n with isRead = true });
        count += 1;
      };
    };
    count;
  };

  public func send(
    notifications : Map.Map<Nat, Types.Notification>,
    nextId : Nat,
    input : Types.NotificationInput,
    now : Int,
  ) : Types.Notification {
    let notif : Types.Notification = {
      id = nextId;
      userId = input.userId;
      title = input.title;
      message = input.message;
      isRead = false;
      createdAt = now;
    };
    notifications.add(nextId, notif);
    notif;
  };

  public func deleteNotification(
    notifications : Map.Map<Nat, Types.Notification>,
    id : Nat,
    userId : Principal,
  ) : Bool {
    switch (notifications.get(id)) {
      case null false;
      case (?n) {
        if (not Principal.equal(n.userId, userId)) {
          false;
        } else {
          notifications.remove(id);
          true;
        };
      };
    };
  };
};
