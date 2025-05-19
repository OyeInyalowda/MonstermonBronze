class Monster {
  /**
   * Monster class.
   * @author Brendon Elmore, Mike Vance
   * @version 12APR25
   * 
   * @param {number} id 
   * @param {string} name 
   * @param {number} attack 
   * @param {number} defense 
   * @param {number} speed 
   * @param {number} hp 
   * @param {number[]} learnableMoveIDs 
   * @param {string} sprite_front file path to front sprite
   * @param {string} sprite_back  file path to back sprite
   * @param {string} types 
   */
    constructor(id, name, attack, defense, speed, hp, learnableMoveIDs, sprite_front, sprite_back, types) {
      this.id = id;
      this.name = name;
      this.attack = attack;
      this.defense = defense;
      this.speed = speed;
      this.hp = hp;
      this.current_hp = hp;
      this.learnable_move_IDs = learnableMoveIDs;
      this.sprite_front = loadImage(sprite_front);
      this.sprite_back = loadImage(sprite_back);
      this.types = types;
      this.moveset = this.defaultMoves();
      this.fainted = false;
    }

    addMove(move) {
      if (this.moveset.length < 4) {
        this.moveset.push(move);
        console.log(`${move.name} added to ${this.name}'s moveset!`);
      } else {
        console.log(`${this.name}'s moveset is full!`);
      }
    }

    removeMove() {
      if (this.moveset.length == 0) {
        console.log("Empty Moves");
      } else {
        this.moveset.pop();
      }
    }

    /**
     * Returns the default move set.
     * @returns an array containing this monster's default moves.
     */
    defaultMoves() {
      let defaultMoves = [];
      for (let i = 0; i < this.learnable_move_IDs.length; i++) {
        let curr = this.learnable_move_IDs.at(i)
        defaultMoves.push(allMoves.at(curr));
      }

      return defaultMoves;
    }
  }