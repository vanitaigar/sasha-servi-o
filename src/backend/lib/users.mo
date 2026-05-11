import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Types "../types/users";
import Common "../types/common";

module {
  public func getUser(
    users : Map.Map<Principal, Types.UserProfile>,
    id : Principal,
  ) : ?Types.UserProfile {
    users.get(id);
  };

  public func listUsers(
    users : Map.Map<Principal, Types.UserProfile>,
  ) : [Types.UserProfile] {
    users.values() |> _.toArray();
  };

  public func createUser(
    users : Map.Map<Principal, Types.UserProfile>,
    id : Principal,
    input : Types.UserProfileInput,
    now : Int,
  ) : Types.UserProfile {
    let profile : Types.UserProfile = {
      id;
      name = input.name;
      email = input.email;
      role = input.role;
      photoUrl = input.photoUrl;
      createdAt = now;
      isActive = true;
    };
    users.add(id, profile);
    profile;
  };

  public func updateUser(
    users : Map.Map<Principal, Types.UserProfile>,
    id : Principal,
    input : Types.UserProfileInput,
  ) : ?Types.UserProfile {
    switch (users.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.UserProfile = {
          existing with
          name = input.name;
          email = input.email;
          role = input.role;
          photoUrl = input.photoUrl;
        };
        users.add(id, updated);
        ?updated;
      };
    };
  };

  public func deactivateUser(
    users : Map.Map<Principal, Types.UserProfile>,
    id : Principal,
  ) : Bool {
    switch (users.get(id)) {
      case null false;
      case (?existing) {
        let updated : Types.UserProfile = { existing with isActive = false };
        users.add(id, updated);
        true;
      };
    };
  };

  public func assignRole(
    users : Map.Map<Principal, Types.UserProfile>,
    id : Principal,
    role : Common.Role,
  ) : Bool {
    switch (users.get(id)) {
      case null false;
      case (?existing) {
        let updated : Types.UserProfile = { existing with role };
        users.add(id, updated);
        true;
      };
    };
  };
};
