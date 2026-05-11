import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import NotifTypes "../types/notifications";
import NotificationsLib "../lib/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notifications : Map.Map<Nat, NotifTypes.Notification>,
) {
  var nextNotificationId : Nat = 1;

  /// Lists the caller's notifications
  public query ({ caller }) func listMyNotifications() : async [NotifTypes.Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    NotificationsLib.listForUser(notifications, caller);
  };

  /// Marks a notification as read
  public shared ({ caller }) func markNotificationRead(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    NotificationsLib.markRead(notifications, id, caller);
  };

  /// Marks all of the caller's notifications as read
  public shared ({ caller }) func markAllNotificationsRead() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    NotificationsLib.markAllRead(notifications, caller);
  };

  /// Sends a notification to a user — ADMIN/OWNER only
  public shared ({ caller }) func sendNotification(input : NotifTypes.NotificationInput) : async NotifTypes.Notification {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem enviar notificações");
    };
    let id = nextNotificationId;
    nextNotificationId += 1;
    NotificationsLib.send(notifications, id, input, Time.now());
  };

  /// Deletes a notification owned by the caller
  public shared ({ caller }) func deleteNotification(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    NotificationsLib.deleteNotification(notifications, id, caller);
  };
};
