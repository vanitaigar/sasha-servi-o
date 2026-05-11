import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserProfile = {
    id : Principal;
    name : Text;
    email : Text;
    role : Common.Role;
    photoUrl : Storage.ExternalBlob;
    createdAt : Common.Timestamp;
    isActive : Bool;
  };

  public type UserProfileInput = {
    name : Text;
    email : Text;
    role : Common.Role;
    photoUrl : Storage.ExternalBlob;
  };
};
