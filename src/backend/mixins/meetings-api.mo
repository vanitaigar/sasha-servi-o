import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MeetingTypes "../types/meetings";
import MeetingsLib "../lib/meetings";

mixin (
  accessControlState : AccessControl.AccessControlState,
  meetings : Map.Map<Nat, MeetingTypes.Meeting>,
) {
  var nextMeetingId : Nat = 1;

  /// Gets a meeting by ID
  public query ({ caller }) func getMeeting(id : Nat) : async ?MeetingTypes.Meeting {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    MeetingsLib.getMeeting(meetings, id);
  };

  /// Lists all meetings
  public query ({ caller }) func listMeetings() : async [MeetingTypes.Meeting] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    MeetingsLib.listMeetings(meetings);
  };

  /// Creates a meeting — ADMIN/OWNER only
  public shared ({ caller }) func createMeeting(input : MeetingTypes.MeetingInput) : async MeetingTypes.Meeting {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem criar reuniões");
    };
    let id = nextMeetingId;
    nextMeetingId += 1;
    MeetingsLib.createMeeting(meetings, id, input, caller);
  };

  /// Updates a meeting — ADMIN/OWNER only
  public shared ({ caller }) func updateMeeting(id : Nat, input : MeetingTypes.MeetingInput) : async ?MeetingTypes.Meeting {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem atualizar reuniões");
    };
    MeetingsLib.updateMeeting(meetings, id, input, caller);
  };

  /// Deletes a meeting — ADMIN/OWNER only
  public shared ({ caller }) func deleteMeeting(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem eliminar reuniões");
    };
    MeetingsLib.deleteMeeting(meetings, id, caller);
  };
};
