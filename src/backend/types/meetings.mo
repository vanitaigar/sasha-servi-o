module {
  public type Meeting = {
    id : Nat;
    title : Text;
    description : Text;
    date : Int;
    participants : [Principal];
    createdBy : Principal;
  };

  public type MeetingInput = {
    title : Text;
    description : Text;
    date : Int;
    participants : [Principal];
  };
};
