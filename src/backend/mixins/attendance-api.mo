import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import AttendanceTypes "../types/attendance";
import AttendanceLib "../lib/attendance";

mixin (
  accessControlState : AccessControl.AccessControlState,
  attendanceRecords : Map.Map<Nat, AttendanceTypes.AttendanceRecord>,
  locations : Map.Map<Nat, AttendanceTypes.Location>,
) {
  var nextAttendanceId : Nat = 1;
  var nextLocationId : Nat = 1;

  /// Records check-in with GPS — any authenticated user
  public shared ({ caller }) func checkIn(gpsLat : Float, gpsLng : Float) : async AttendanceTypes.AttendanceRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    let id = nextAttendanceId;
    nextAttendanceId += 1;
    AttendanceLib.checkIn(attendanceRecords, id, caller, gpsLat, gpsLng, Time.now());
  };

  /// Records check-out — any authenticated user
  public shared ({ caller }) func checkOut() : async ?AttendanceTypes.AttendanceRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    AttendanceLib.checkOut(attendanceRecords, caller, Time.now());
  };

  /// Gets a specific attendance record
  public query ({ caller }) func getAttendanceRecord(id : Nat) : async ?AttendanceTypes.AttendanceRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    AttendanceLib.getRecord(attendanceRecords, id);
  };

  /// Lists the caller's own attendance records
  public query ({ caller }) func listMyAttendance() : async [AttendanceTypes.AttendanceRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    AttendanceLib.listRecordsByUser(attendanceRecords, caller);
  };

  /// Lists all attendance records — ADMIN/OWNER only
  public query ({ caller }) func listAllAttendance() : async [AttendanceTypes.AttendanceRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem listar todas as presenças");
    };
    AttendanceLib.listAllRecords(attendanceRecords);
  };

  /// Lists attendance records for a specific user — ADMIN/OWNER only
  public query ({ caller }) func listAttendanceByUser(userId : Principal) : async [AttendanceTypes.AttendanceRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem ver presenças de outros utilizadores");
    };
    AttendanceLib.listRecordsByUser(attendanceRecords, userId);
  };

  // --- Location management ---

  /// Gets a location by ID
  public query ({ caller }) func getLocation(id : Nat) : async ?AttendanceTypes.Location {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    AttendanceLib.getLocation(locations, id);
  };

  /// Lists all configured locations
  public query ({ caller }) func listLocations() : async [AttendanceTypes.Location] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Não autorizado");
    };
    AttendanceLib.listLocations(locations);
  };

  /// Creates a location — ADMIN/OWNER only
  public shared ({ caller }) func createLocation(input : AttendanceTypes.LocationInput) : async AttendanceTypes.Location {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem criar localizações");
    };
    let id = nextLocationId;
    nextLocationId += 1;
    AttendanceLib.createLocation(locations, id, input);
  };

  /// Updates a location — ADMIN/OWNER only
  public shared ({ caller }) func updateLocation(id : Nat, input : AttendanceTypes.LocationInput) : async ?AttendanceTypes.Location {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem atualizar localizações");
    };
    AttendanceLib.updateLocation(locations, id, input);
  };

  /// Deletes a location — ADMIN/OWNER only
  public shared ({ caller }) func deleteLocation(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Não autorizado: apenas admins podem eliminar localizações");
    };
    AttendanceLib.deleteLocation(locations, id);
  };
};
