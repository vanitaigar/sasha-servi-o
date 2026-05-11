module {
  public type AttendanceRecord = {
    id : Nat;
    userId : Principal;
    checkIn : Int;
    checkOut : ?Int;
    gpsLat : Float;
    gpsLng : Float;
  };

  public type Location = {
    id : Nat;
    name : Text;
    gpsLat : Float;
    gpsLng : Float;
    radius : Float;
  };

  public type LocationInput = {
    name : Text;
    gpsLat : Float;
    gpsLng : Float;
    radius : Float;
  };
};
