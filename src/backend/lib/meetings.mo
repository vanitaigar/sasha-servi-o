import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Types "../types/meetings";

module {
  public func getMeeting(
    meetings : Map.Map<Nat, Types.Meeting>,
    id : Nat,
  ) : ?Types.Meeting {
    meetings.get(id);
  };

  public func listMeetings(
    meetings : Map.Map<Nat, Types.Meeting>,
  ) : [Types.Meeting] {
    meetings.values() |> _.toArray();
  };

  public func createMeeting(
    meetings : Map.Map<Nat, Types.Meeting>,
    nextId : Nat,
    input : Types.MeetingInput,
    createdBy : Principal,
  ) : Types.Meeting {
    let meeting : Types.Meeting = {
      id = nextId;
      title = input.title;
      description = input.description;
      date = input.date;
      participants = input.participants;
      createdBy;
    };
    meetings.add(nextId, meeting);
    meeting;
  };

  public func updateMeeting(
    meetings : Map.Map<Nat, Types.Meeting>,
    id : Nat,
    input : Types.MeetingInput,
    _caller : Principal,
  ) : ?Types.Meeting {
    switch (meetings.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Meeting = {
          existing with
          title = input.title;
          description = input.description;
          date = input.date;
          participants = input.participants;
        };
        meetings.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteMeeting(
    meetings : Map.Map<Nat, Types.Meeting>,
    id : Nat,
    _caller : Principal,
  ) : Bool {
    switch (meetings.get(id)) {
      case null false;
      case _ {
        meetings.remove(id);
        true;
      };
    };
  };
};
