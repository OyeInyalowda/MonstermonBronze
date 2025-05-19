/**
 * Battler engine class.
 * @author Zion Reynolds, Francis, Brendon Elmore, Mike Vance
 */

class BattlerEngine {
    constructor() {
        // **playerRoster is established as a global variable in the main class**

        this.rosterAI = new Roster();

        // Gives AI a random roster of monsters.
        let shuffled = [...enemyMonsters].sort(() => 0.5 - Math.random());
        shuffled.slice(0, 6).forEach(monster => this.rosterAI.addMonster(monster));

        // Sets current monsters to first monster in either roster
        this.currentMonsterPlayer = playerRoster.peek();
        this.currentMonsterPlayerStatusMultipliers =
        {
            attack: 1,
            defense: 1,
            speed: 1
        }
        this.currentMonsterPlayerAIMultipliers =
        {
            attack: 1,
            defense: 1,
            speed: 1
        }
        this.currentMonsterAI = this.rosterAI.peek();

        // Keeps track of turn order and move selection
        this.turn = true;
        this.moveSelected = false;
        this.moveIDSelected = 0;

        // Keeps track of game state
        this.gameOver = false;
        this.gameWon = false;
        this.winCondition = false;

        // Switch system tracker
        this.switchAllowed = true;
        this.isAnimating = false;
        this.canvasContext;
        this.animationSprite
    }

    peekPlayerMultipliers() {
        return this.currentMonsterPlayerStatusMultipliers;
    }
    peekAiMultipliers() {
        return this.currentMonsterPlayerAIMultipliers;
    }

    battler() {
        if (this.isAnimating) {
            return;
        }
        if (!this.gameOver) {
            if (this.moveSelected) { // Await a moveID selected from the battler UI
                let playerturn = (this.currentMonsterPlayer.speed * this.currentMonsterPlayerStatusMultipliers.speed < this.currentMonsterAI.speed * this.currentMonsterPlayerAIMultipliers.speed);
                if (playerturn) {
                    // "AI" turn
                    let selectedMoveAI = this.currentMonsterAI.moveset[Math.floor(4 * Math.random())];
                    console.log(selectedMoveAI);
                    // Does the move hit?
                    if (100 * Math.random() < selectedMoveAI.accuracy) {
                        // If it does, deal the move's damage to the Player's monster
                        let moveSoundType = selectedMoveAI.type;
                        if (typeSounds[moveSoundType]) {
                            typeSounds[moveSoundType].play();
                        } else {
                            effectiveHitSound.play();
                        }
                        startAnimation(240, 440, 550, 300, selectedMoveAI, false, true);
                        this.attack(false, selectedMoveAI);


                        // If the move changes a status change corresponding attribute of the Player's monster
                        if (selectedMoveAI.isStatus) {
                            if (selectedMoveAI.statToChange == "attack") {
                                if (selectedMoveAI.targetSelf) {
                                    this.currentMonsterPlayerStatusMultipliers.attack *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerStatusMultipliers.attack > 2) {
                                        this.currentMonsterPlayerStatusMultipliers.attack = 2;
                                    }
                                    if (this.currentMonsterPlayerStatusMultipliers.attack < 0.5) {
                                        this.currentMonsterPlayerStatusMultipliers.attack = 0.5;
                                    }
                                } else {
                                    this.currentMonsterPlayerAIMultipliers.attack *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerAIMultipliers.attack > 2) {
                                        this.currentMonsterPlayerAIMultipliers.attack = 2;
                                    }
                                    if (this.currentMonsterPlayerAIMultipliers.attack < 0.5) {
                                        this.currentMonsterPlayerAIMultipliers.attack = 0.5;
                                    }
                                }
                            }
                            if (selectedMoveAI.statToChange == "defense") {
                                if (selectedMoveAI.targetSelf) {
                                    this.currentMonsterPlayerStatusMultipliers.defense *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerStatusMultipliers.defense > 2) {
                                        this.currentMonsterPlayerStatusMultipliers.defense = 2;
                                    }
                                    if (this.currentMonsterPlayerStatusMultipliers.defense < 0.5) {
                                        this.currentMonsterPlayerStatusMultipliers.defense = 0.5;
                                    }
                                } else {
                                    this.currentMonsterPlayerAIMultipliers.defense *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerAIMultipliers.defense > 2) {
                                        this.currentMonsterPlayerAIMultipliers.defense = 2;
                                    }
                                    if (this.currentMonsterPlayerAIMultipliers.defense < 0.5) {
                                        this.currentMonsterPlayerAIMultipliers.defense = 0.5;
                                    }
                                }
                            }
                            if (selectedMoveAI.statToChange == "speed") {
                                if (selectedMoveAI.targetSelf) {
                                    this.currentMonsterPlayerStatusMultipliers.speed *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerStatusMultipliers.speed > 2) {
                                        this.currentMonsterPlayerStatusMultipliers.speed = 2;
                                    }
                                    if (this.currentMonsterPlayerStatusMultipliers.speed < 0.5) {
                                        this.currentMonsterPlayerStatusMultipliers.speed = 0.5;
                                    }
                                } else {
                                    this.currentMonsterPlayerAIMultipliers.speed *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerAIMultipliers.speed > 2) {
                                        this.currentMonsterPlayerAIMultipliers.speed = 2;
                                    }
                                    if (this.currentMonsterPlayerAIMultipliers.speed < 0.5) {
                                        this.currentMonsterPlayerAIMultipliers.speed = 0.5;
                                    }
                                }
                            }
                        }
                    } else {
                        console.log("enemy missed");
                    }


                    // Account for the Player's current monster being defeated, and switch out to next available
                    // monster in Player's roster (if possible).
                    if (this.currentMonsterPlayer.current_hp <= 0 && !this.gameOver) {
                        playerRoster.numFainted = playerRoster.numFainted + 1; // Add to number feinted in Player's roster
                        this.currentMonsterPlayer.current_hp = 0; // Player monster's health does not go below 0
                        if (playerRoster.numFainted < 6) {
                            while (this.currentMonsterPlayer.current_hp <= 0) {
                                this.currentMonsterPlayer = playerRoster.next();
                            }
                        }
                        else {
                            // End the game and break out of the turn order
                            this.gameOver == true;
                        }
                    }
                }
                let selectedMove = this.currentMonsterPlayer.moveset[this.moveIDSelected];
                let message = this.currentMonsterPlayer.name + " used " + selectedMove.name + ", "; // move effect message
                // Does the move hit?
                startAnimation(240, 440, 550, 300, selectedMove, true);
                if (100 * Math.random() < selectedMove.accuracy) {
                    // If it does, deal the move's damage to the AI's monster
                    let moveType = selectedMove.type;
                    // If the move changes a status change corresponding attribute of the AI's monster
                    let monsterType = this.currentMonsterAI.types;
                    let attackMult = typeEffective[0][moveType][monsterType];
                    this.attack(true, selectedMove);

                    if (attackMult == 2) {
                        message = message + "it was super effective!"
                    }
                    else if (attackMult == 0.5) {
                        message = message + "it wasn't very effective!"
                    }
                    else if (attackMult == 1) {
                        message = message + "it was average effectiveness!"
                    }
                    else if (attackMult == 0) {
                        message = message + "it was ineffective!"
                    }
                    // **DEBUGGING PURPOSES**
                    // console.log(selectedMove.accuracy);
                    // console.log(this.currentMonsterAI.current_hp);
                    // **DEBUGGING PURPOSES**

                    // If the move changes a status change corresponding attribute of the AI's monster
                    if (selectedMove.isStatus) {
                        if (selectedMove.statToChange == "attack") {
                            if (selectedMove.targetSelf) {
                                this.currentMonsterPlayerStatusMultipliers.attack *= selectedMove.statChangeMultiplier;
                                if (this.currentMonsterPlayerStatusMultipliers.attack > 2) {
                                    this.currentMonsterPlayerStatusMultipliers.attack = 2;
                                }
                                if (this.currentMonsterPlayerStatusMultipliers.attack < 0.5) {
                                    this.currentMonsterPlayerStatusMultipliers.attack = 0.5;
                                }
                            } else {
                                this.currentMonsterPlayerAIMultipliers.attack *= selectedMove.statChangeMultiplier;
                                if (this.currentMonsterPlayerAIMultipliers.attack > 2) {
                                    this.currentMonsterPlayerAIMultipliers.attack = 2;
                                }
                                if (this.currentMonsterPlayerAIMultipliers.attack < 0.5) {
                                    this.currentMonsterPlayerAIMultipliers.attack = 0.5;
                                }
                            }
                        }
                        if (selectedMove.statToChange == "defense") {
                            if (selectedMove.targetSelf) {
                                this.currentMonsterPlayerStatusMultipliers.defense *= selectedMove.statChangeMultiplier;
                                if (this.currentMonsterPlayerStatusMultipliers.defense > 2) {
                                    this.currentMonsterPlayerStatusMultipliers.defense = 2;
                                }
                                if (this.currentMonsterPlayerStatusMultipliers.defense < 0.5) {
                                    this.currentMonsterPlayerStatusMultipliers.defense = 0.5;
                                }
                            } else {
                                this.currentMonsterPlayerAIMultipliers.defense *= selectedMove.statChangeMultiplier;
                                if (this.currentMonsterPlayerAIMultipliers.defense > 2) {
                                    this.currentMonsterPlayerAIMultipliers.defense = 2;
                                }
                                if (this.currentMonsterPlayerAIMultipliers.defense < 0.5) {
                                    this.currentMonsterPlayerAIMultipliers.defense = 0.5;
                                }
                            }
                        }
                        if (selectedMove.statToChange == "speed") {
                            if (selectedMove.targetSelf) {
                                this.currentMonsterPlayerStatusMultipliers.speed *= selectedMove.statChangeMultiplier;
                                if (this.currentMonsterPlayerStatusMultipliers.speed > 2) {
                                    this.currentMonsterPlayerStatusMultipliers.speed = 2;
                                }
                                if (this.currentMonsterPlayerStatusMultipliers.speed < 0.5) {
                                    this.currentMonsterPlayerStatusMultipliers.speed = 0.5;
                                }
                            } else {
                                this.currentMonsterPlayerAIMultipliers.speed *= selectedMove.statChangeMultiplier;
                                if (this.currentMonsterPlayerAIMultipliers.speed > 2) {
                                    this.currentMonsterPlayerAIMultipliers.speed = 2;
                                }
                                if (this.currentMonsterPlayerAIMultipliers.speed < 0.5) {
                                    this.currentMonsterPlayerAIMultipliers.speed = 0.5;
                                }
                            }
                        }
                    } else {
                        this.attack(true, selectedMove);

                    }
                    // **DEBUGGING PURPOSES**
                    console.log(selectedMove.accuracy);
                    console.log(this.currentMonsterAI.current_hp);
                    // **DEBUGGING PURPOSES**


                    let moveSoundType = selectedMove.type;
                    if (typeSounds[moveSoundType]) {
                        typeSounds[moveSoundType].play();
                    } else {
                        effectiveHitSound.play();
                    }
                } else {
                    effectiveHitSound.play();
                    message = message + "this move missed!";
                }

                ui.tempMessage(message, 100); // move effect popup

                if (playerRoster.numFainted == 6 || this.rosterAI.numFainted == 6) {
                    // **DEBUGGING PURPOSES**
                    // console.log("Someone lost!");

                    this.gameOver = true;
                }

                // Account for AI's current monster being defeated, and switch out to next available
                // monster in AI's roster (if possible).
                if (this.currentMonsterAI.current_hp <= 0 && !this.gameOver) {
                    this.rosterAI.numFainted = this.rosterAI.numFainted + 1; // Add to number feinted in AI's roster
                    this.currentMonsterAI.current_hp = 0; // AI monster's health does not go below 0
                    if (this.rosterAI.numFainted < 6) {
                        while (this.currentMonsterAI.current_hp <= 0) {
                            this.currentMonsterAI = this.rosterAI.next();
                            this.currentMonsterPlayerAIMultipliers.attack = 1;
                            this.currentMonsterPlayerAIMultipliers.defense = 1;
                            this.currentMonsterPlayerAIMultipliers.speed = 1;
                        }
                    }
                    else {
                        // End the game and break out of the turn order
                        this.gameOver == true;
                    }
                }
                if (!playerturn) {
                    // "AI" turn
                    let selectedMoveAI = this.currentMonsterAI.moveset[Math.floor(4 * Math.random())];
                    console.log(selectedMoveAI);
                    // Does the move hit?
                    if (100 * Math.random() < selectedMoveAI.accuracy) {
                        // If it does, deal the move's damage to the Player's monster
                        let moveSoundType = selectedMove.type;
                        if (typeSounds[moveSoundType]) {
                            typeSounds[moveSoundType].play();
                        } else {
                            effectiveHitSound.play();
                        }
                        startAnimation(240, 440, 550, 300, selectedMoveAI, false);
                        this.attack(false, selectedMoveAI);
                        // If the move changes a status change corresponding attribute of the Player's monster
                        if (selectedMoveAI.isStatus) {
                            if (selectedMoveAI.statToChange == "attack") {
                                if (selectedMoveAI.targetSelf) {
                                    this.currentMonsterPlayerAIMultipliers.attack *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerAIMultipliers.attack > 2) {
                                        this.currentMonsterPlayerAIMultipliers.attack = 2;
                                    }
                                    if (this.currentMonsterPlayerAIMultipliers.attack < 0.5) {
                                        this.currentMonsterPlayerAIMultipliers.attack = 0.5;
                                    }
                                } else {
                                    this.currentMonsterPlayerStatusMultipliers.attack *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerStatusMultipliers.attack > 2) {
                                        this.currentMonsterPlayerStatusMultipliers.attack = 2;
                                    }
                                    if (this.currentMonsterPlayerStatusMultipliers.attack < 0.5) {
                                        this.currentMonsterPlayerStatusMultipliers.attack = 0.5;
                                    }
                                }
                            }
                            if (selectedMoveAI.statToChange == "defense") {
                                if (selectedMoveAI.targetSelf) {
                                    this.currentMonsterPlayerAIMultipliers.defense *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerAIMultipliers.defense > 2) {
                                        this.currentMonsterPlayerAIMultipliers.defense = 2;
                                    }
                                    if (this.currentMonsterPlayerAIMultipliers.defense < 0.5) {
                                        this.currentMonsterPlayerAIMultipliers.defense = 0.5;
                                    }
                                } else {
                                    this.currentMonsterPlayerStatusMultipliers.defense *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerStatusMultipliers.defense > 2) {
                                        this.currentMonsterPlayerStatusMultipliers.defense = 2;
                                    }
                                    if (this.currentMonsterPlayerStatusMultipliers.defense < 0.5) {
                                        this.currentMonsterPlayerStatusMultipliers.defense = 0.5;
                                    }
                                }
                            }
                            if (selectedMoveAI.statToChange == "speed") {
                                if (selectedMoveAI.targetSelf) {
                                    this.currentMonsterPlayerAIMultipliers.speed *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerAIMultipliers.speed > 2) {
                                        this.currentMonsterPlayerAIMultipliers.speed = 2;
                                    }
                                    if (this.currentMonsterPlayerAIMultipliers.speed < 0.5) {
                                        this.currentMonsterPlayerAIMultipliers.speed = 0.5;
                                    }
                                } else {
                                    this.currentMonsterPlayerStatusMultipliers.speed *= selectedMoveAI.statChangeMultiplier;
                                    if (this.currentMonsterPlayerStatusMultipliers.speed > 2) {
                                        this.currentMonsterPlayerStatusMultipliers.speed = 2;
                                    }
                                    if (this.currentMonsterPlayerStatusMultipliers.speed < 0.5) {
                                        this.currentMonsterPlayerStatusMultipliers.speed = 0.5;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    console.log("enemy missed");
                }


                // Account for the Player's current monster being defeated, and switch out to next available
                // monster in Player's roster (if possible).
                if (this.currentMonsterPlayer.current_hp <= 0 && !this.gameOver) {
                    playerRoster.numFainted = playerRoster.numFainted + 1; // Add to number feinted in Player's roster
                    this.currentMonsterPlayer.current_hp = 0; // Player monster's health does not go below 0
                    if (playerRoster.numFainted < 6) {
                        while (this.currentMonsterPlayer.current_hp <= 0) {
                            this.currentMonsterPlayer = playerRoster.next();
                        }
                    }
                    else {
                        // End the game and break out of the turn order
                        this.gameOver == true;
                    }
                }
                // After AI's turn, re-enable player capabilities
                this.switchAllowed = true;
                this.moveSelected = false;
            }

            // End game if either roster is depleted of monsters
            if (playerRoster.numFainted == 6 || this.rosterAI.numFainted == 6) {
                this.gameOver = true;
                console.log("Game over");
            }
        } // game is over

        if (this.rosterAI.numFainted == 6) {
            // Audio control
            this.stopSongs();
            winSound.play();

            // **DEBUGGING PURPOSES
            console.log("AI lost!");

            // this.gameWon = true;

            ui.setCurrentScreen("winner");

            // **DEBUGGING PURPOSES**
            console.log("You won!")

        } else if (playerRoster.numFainted == 6) {
            // Audio control
            this.stopSongs();
            loseSound.play();

            //game over
            ui.setCurrentScreen("loser");

            // **DEBUGGING PURPOSES**
            console.log("You lost!")
        }


    }

    moveSelector(id) {
        this.moveIDSelected = id;
        this.moveSelected = true;
    }

    switchMonsters() {
        // If the player hasn't already switched monsters this turn
        if (this.switchAllowed) {
            // If the current monster in the roster is avaialable, allow a switch
            if (playerRoster.peek().current_hp != 0) {
                if (this.currentMonsterPlayer != playerRoster.peek()) {
                    this.currentMonsterPlayerStatusMultipliers.attack = 1;
                    this.currentMonsterPlayerStatusMultipliers.speed = 1;
                    this.currentMonsterPlayerStatusMultipliers.defense = 1;
                }
                // Controlled from the main class
                this.currentMonsterPlayer = playerRoster.peek();

                this.switchAllowed = false;
                console.log("Selected: " + this.currentMonsterPlayer.name)
            }
            else {
                console.log(playerRoster.peek().name + " is unavailable!");
            }
        }
        else {
            // **DEBUGGING PURPOSES**
            console.log("Already switched this turn!");
        }
    }

    stopSongs() {
        if (song1.isPlaying()) {
            song1.pause();
        }
        if (song2.isPlaying()) {
            song2.pause();
        }
    }
    //this will start a two second timeout, after which the battle will resume
    //this time will be spent to play a small animation
    attack(isPlayer, selectedMove) {
        let damageDealt;

        if (isPlayer) {

            const attacker = this.currentMonsterPlayer;
            const defender = this.currentMonsterAI;

            const movePower = selectedMove.attack;
            const moveType = selectedMove.type;
            const targetType = defender.types;

            // Make sure effectiveness doesn't return undefined
            const effectiveness = typeEffective[0][moveType][targetType];

            // **DEBUG**
            console.log(effectiveness);

            // Base damage
            damageDealt = Math.floor(movePower * ((attacker.attack * this.currentMonsterPlayerStatusMultipliers.attack) / (defender.defense * this.currentMonsterPlayerAIMultipliers.defense)) * effectiveness);

            // **DEBUG**
            console.log(damageDealt);

            defender.current_hp -= damageDealt;

            // **DEBUG**
            console.log(defender.current_hp);

            console.log(`${attacker.name} used ${selectedMove.name}!`);
            if (effectiveness > 1) {
                console.log("It's super effective!");
            } else if (effectiveness < 1) {
                console.log("It's not very effective...");
            }
            console.log(`Dealt ${damageDealt} damage.`);
        } else {
            const defender = this.currentMonsterPlayer;
            const attacker = this.currentMonsterAI;

            const movePower = selectedMove.attack;
            const moveType = selectedMove.type;
            const targetType = defender.types;

            // Make sure effectiveness doesn't return undefined
            const effectiveness = typeEffective[0][moveType][targetType];

            // **DEBUG**
            console.log(effectiveness);

            // Base damage
            damageDealt = Math.floor(movePower * ((attacker.attack * this.currentMonsterPlayerAIMultipliers.attack) / (defender.defense * this.currentMonsterPlayerStatusMultipliers.defense)) * effectiveness);

            // **DEBUG**
            console.log(damageDealt);

            defender.current_hp -= damageDealt;

            // **DEBUG**
            console.log(defender.current_hp);

            console.log(`${attacker.name} used ${selectedMove.name}!`);
            if (effectiveness > 1) {
                console.log("It's super effective!");
            } else if (effectiveness < 1) {
                console.log("It's not very effective...");
            }
            console.log(`Dealt ${damageDealt} damage.`);
        }
    }
}
