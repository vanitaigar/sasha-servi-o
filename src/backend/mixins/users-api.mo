import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserTypes "../types/users";
import Common "../types/common";
import UsersLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<Principal, UserTypes.UserProfile>,
) {
  /// Returns the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    UsersLib.getUser(users, caller);
  };

  /// Saves/updates the caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(input : UserTypes.UserProfileInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    switch (users.get(caller)) {
      case null {
        ignore UsersLib.createUser(users, caller, input, Time.now());
      };
      case _ {
        ignore UsersLib.updateUser(users, caller, input);
      };
    };
  };

  /// Returns any user's profile (own always allowed; others require admin)
  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    if (not Principal.equal(caller, userId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem ver perfis de outros utilizadores");
    };
    UsersLib.getUser(users, userId);
  };

  /// Lists all users — ADMIN/OWNER only
  public query ({ caller }) func listUsers() : async [UserTypes.UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem listar utilizadores");
    };
    UsersLib.listUsers(users);
  };

  /// Creates a new user — ADMIN/OWNER only
  public shared ({ caller }) func createUser(id : Principal, input : UserTypes.UserProfileInput) : async UserTypes.UserProfile {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem criar utilizadores");
    };
    UsersLib.createUser(users, id, input, Time.now());
  };

  /// Updates a user — ADMIN/OWNER only
  public shared ({ caller }) func updateUser(id : Principal, input : UserTypes.UserProfileInput) : async ?UserTypes.UserProfile {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem atualizar utilizadores");
    };
    UsersLib.updateUser(users, id, input);
  };

  /// Deactivates a user — OWNER only (admin in authorization context)
  public shared ({ caller }) func deactivateUser(id : Principal) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas o dono pode desativar utilizadores");
    };
    UsersLib.deactivateUser(users, id);
  };

  /// Assigns a role to a user — OWNER only
  public shared ({ caller }) func assignUserRole(id : Principal, role : Common.Role) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas o dono pode atribuir funções");
    };
    UsersLib.assignRole(users, id, role);
  };
};
