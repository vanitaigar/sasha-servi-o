import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Types "../types/attendance";

module {
  public func checkIn(
    records : Map.Map<Nat, Types.AttendanceRecord>,
    nextId : Nat,
    userId : Principal,
    gpsLat : Float,
    gpsLng : Float,
    now : Int,
  ) : Types.AttendanceRecord {
    let record : Types.AttendanceRecord = {
      id = nextId;
      userId;
      checkIn = now;
      checkOut = null;
      gpsLat;
      gpsLng;
    };
    records.add(nextId, record);
    record;
  };

  public func checkOut(
    records : Map.Map<Nat, Types.AttendanceRecord>,
    userId : Principal,
    now : Int,
  ) : ?Types.AttendanceRecord {
    // Find the most recent open record for this user
    var found : ?Types.AttendanceRecord = null;
    for ((_, r) in records.entries()) {
      if (Principal.equal(r.userId, userId) and r.checkOut == null) {
        found := ?r;
      };
    };
    switch (found) {
      case null null;
      case (?r) {
        let updated : Types.AttendanceRecord = { r with checkOut = ?now };
        records.add(r.id, updated);
        ?updated;
      };
    };
  };

  public func getRecord(
    records : Map.Map<Nat, Types.AttendanceRecord>,
    id : Nat,
  ) : ?Types.AttendanceRecord {
    records.get(id);
  };

  public func listRecordsByUser(
    records : Map.Map<Nat, Types.AttendanceRecord>,
    userId : Principal,
  ) : [Types.AttendanceRecord] {
    records.values()
      |> _.filter(func(r : Types.AttendanceRecord) : Bool { Principal.equal(r.userId, userId) })
      |> _.toArray();
  };

  public func listAllRecords(
    records : Map.Map<Nat, Types.AttendanceRecord>,
  ) : [Types.AttendanceRecord] {
    records.values() |> _.toArray();
  };

  public func getLocation(
    locations : Map.Map<Nat, Types.Location>,
    id : Nat,
  ) : ?Types.Location {
    locations.get(id);
  };

  public func listLocations(
    locations : Map.Map<Nat, Types.Location>,
  ) : [Types.Location] {
    locations.values() |> _.toArray();
  };

  public func createLocation(
    locations : Map.Map<Nat, Types.Location>,
    nextId : Nat,
    input : Types.LocationInput,
  ) : Types.Location {
    let loc : Types.Location = {
      id = nextId;
      name = input.name;
      gpsLat = input.gpsLat;
      gpsLng = input.gpsLng;
      radius = input.radius;
    };
    locations.add(nextId, loc);
    loc;
  };

  public func updateLocation(
    locations : Map.Map<Nat, Types.Location>,
    id : Nat,
    input : Types.LocationInput,
  ) : ?Types.Location {
    switch (locations.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Location = {
          existing with
          name = input.name;
          gpsLat = input.gpsLat;
          gpsLng = input.gpsLng;
          radius = input.radius;
        };
        locations.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteLocation(
    locations : Map.Map<Nat, Types.Location>,
    id : Nat,
  ) : Bool {
    switch (locations.get(id)) {
      case null false;
      case _ {
        locations.remove(id);
        true;
      };
    };
  };
};
