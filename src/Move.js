class Move {
    constructor(moveID, name, attack, accuracy, isStatus, targetSelf, statToChange, statChangeMultiplier, type, index) {
      this.moveID = moveID;
      this.name = name;
      this.attack = attack;
      this.accuracy = accuracy;
      this.isStatus = isStatus;
      this.targetSelf = targetSelf;
      this.statToChange = statToChange;
      this.statChangeMultiplier = statChangeMultiplier;
      this.type = type;
      this.index = index;
    }
  }