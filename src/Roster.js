class Roster {

  /**
   * Roster class.
   * @author Brendon Elmore, Mike Vance
   * @version 22APR25
   */
  constructor() {
    this.monsters = [];
    this.monsterIDs = [];
    this.numMonsters = 0;
    this.maxSize = 6;
    this.numFainted = 0;
    this.trainer = null;
    this.currIndex = 0; // index of current monster
  }

  /**
   * Add monsters sequentially until roster is full.
   * @param {Monster} monster 
   */
  addMonster(monster) {
    if (this.numMonsters < this.maxSize && !this.monsterIDs.includes(monster.id)) {
      this.monsters.push(monster);
      this.monsterIDs.push(monster.id);
      this.numMonsters++;
    } else {
      console.log("Full Party / Duplicate Choice");
    }
  }

  /**
   * Add monsters at a specific index unless the slot is taken or the party is full.
   * @param {Monster} monster 
   * @param {number} index 
   */
        /* Turns out JS doesn't allow overloaded methods. We can go back and rework this but for now only the sequential methods are used
  addMonster(monster, index) {
    if (this.numMonsters < this.maxSize) {
      if (this.monsters[index] == null) {
        this.monsters[index] = monster;
        this.numMonsters++;
      } else {
        console.log("Slot Filled");
      }
    } else {
      console.log("Full Party");
    }
  }
        */

  /**
   * Remove the monster at the end of the array.
   */
  removeMonster() {
    if (this.numMonsters != 0) {
      this.monsters.pop();
      this.monsterIDs.pop();
      this.numMonsters--;
    } else {
      console.log("Empty Party");
    }
  }

  /**
   * Remove a monster at a specific index. 
   * @param {number} index 
   */
        /* 
  removeMonster(index) {
    if (this.numMonsters == 0) {
      if (this.monsters[index] != null) {
        this.monsters[index] = null;
        this.numMonsters--;
      } else {
        console.log("Slot Filled");
      }
    } else {
      console.log("Empty Party");
    }
  }
        */


  /**
   * Peeks at the current monster.
   * @returns current monster.
   */
  peek() {
    return this.monsters.at(this.currIndex);
  }
  
  /**
   * Iterates through every monster in the roster and restarts when the end is reached.
   * @returns currently selected monster.
   */
  next() {
    let curr;
    if(this.currIndex < this.maxSize - 1) {
      curr = this.monsters.at(this.currIndex);
      this.currIndex++;
      return curr;
    } else {
      curr = this.monsters.at(this.currIndex);
      this.currIndex = 0;
      return curr;
    }
  }

  /**
   * Reverse iterates through every monster in the roster and restarts when the end is reached.
   * @returns currently selected monster.
   */
  prev() {
    let curr;
    if(this.currIndex > 0) {
      curr = this.monsters.at(this.currIndex);
      this.currIndex--;
      return curr;    
    } else {
      curr = this.monsters.at(this.currIndex);
      this.currIndex = this.maxSize - 1;
      return curr;
    }
  }

  /**
   * Returns the current roster as an array
   * @returns array of monsters
   */
  toArray() {
    return this.monsters;
  }
}