/**
 * User interface class.
 * The show() method displays the splash screen by default. Display different screens
 * using the setCurrentScreen() method.
 * @author Mike Vance, Jesus H. Christ, Zion Reynolds, Brendon Elmore, Adam Davis
 * @version 18APR25
 */

class userInterface {
  constructor() {
    this.frameCenterX = width / 2; // center x-coord for menu frame
    this.frameCenterY = height / 2; // center y-coord for menu frame
    this.frameWidth = 650; // width of menu frame
    this.frameHeight = 450; // height of menu frame
    this.currentScreen = ""; // name of the current screen displayed
    this.battleBGChoice = null; // no background chosen yet
    this.messageEndTime = 0;
    this.message = "";
    this.hpBarLength = 150;
    this.enemyhpBarLength = 150;
    this.boxX = 200;
    this.boxY = 200;
    this.selectedIndex = 0;
  }


  /**
   * Shows the current screen using switch cases. Splash is default.
   * Current options: splash, placeholder
   */
  show() {
    switch (this.currentScreen) {
      case "placeholder":
        this.#placeholderScreen();
        break;
      case "splash":
        this.#splashScreen();
        break;
      case "select":
        this.#selectScreen();
        break;
      case "winner":
        this.#winnerScreen();
        break;
      case "loser":
        this.#loserScreen();
        break;
      case "battle":
        this.#battleScreen();
        break;
      case "trainer":
        this.#trainerScreen();
        break;
      case "credit":
        this.#creditScreen();
        break;
      default:
        this.#splashScreen();
        break;
    }
  }


  /**
   * Getter for current screen displayed by the UI class.
   * @returns currentScreen
   */
  getCurrentScreen() {
    return this.currentScreen;
  }

  /**
   * Setter for the currentScreen attribute. Used to change the screen displayed.
   * @param {string} nextScreen
   */
  setCurrentScreen(nextScreen) {
    this.currentScreen = nextScreen;
  }

  /**
   * Sets the attributes to be used by showTempMessage()
   * @param {string} text
   * @param {number} duration
   */
  tempMessage(text, duration) {
    this.message = text;
    this.messageEndTime = frameCount + duration;
  }
  //***********************
  // Game Screens - Private
  //***********************

  /**
   * Splash screen that welcomes the player to the game.
   */
  #splashScreen() {

    background(0);
    this.#showFrame();
    image(startScreen, width / 2, height / 2, width - 165, height - 165);

    this.#shadow();
    this.#showWelcome();
    this.#hideShadow();
    // ensure current screen is set
    image(green, 455, 425, 140, 140);
    image(varanitor, 335, 420, 150, 150);

    this.setCurrentScreen("splash");
  }

  /**
   * Placeholder screen for testing purposes.
   */
  #placeholderScreen() {
    background(150);
    this.#showFrame();

    fill('red');
    textSize(35);
    textStyle(BOLD);
    textAlign(CENTER);
    text("PLACEHOLDER", this.frameCenterX, this.frameCenterY);

    let testRoster = new Roster();

    testRoster.addMonster(allMonsters.at(0));
    testRoster.addMonster(allMonsters.at(1));
    //console.log(testRoster);

    let testIMG = testRoster.next().sprite_front;
    //console.log(testIMG);

    image(testIMG, 200, 200);

    testIMG = testRoster.next().sprite_front;

    //image(testIMG, 200, 200);

    // ensure current screen is set
    this.setCurrentScreen("placeholder");
  }

  /**
   * Monster select screen from which players can select monsters to add
   * to their roster.
   */
  #selectScreen() {

    background(0);

    this.#showFrame();
    this.#shadow();
    this.#showSelectMenu();
    this.#hideShadow();
    this.#loadMonsterImages();
    this.#selectionScreenEngine2();
    this.#displaySelectedMonster();

    // ensure current screen is set
    this.setCurrentScreen("select");
  }

  /**
   * Game over screen that is shown when the player wins.
   */
  #winnerScreen() {
    background(0);
    this.#showFrame();

    textAlign(CENTER, CENTER);

    textSize(48);
    textStyle(BOLD);
    fill('green');
    text("YOU WON!", this.frameCenterX, this.frameCenterY - 100);

    textSize(24);
    textStyle(NORMAL);
    fill('black');
    text("Press 'R' to go to the Main Menu.", this.frameCenterX, this.frameCenterY - 60);

    scale(-1, 1);
    let finalSC = tekagon;
    finalSC.resize(200, 200);
    image(finalSC, this.frameCenterX - 650, this.frameCenterY + 75);
    scale(-1, 1);

    let finalSC2 = pythonova;
    finalSC2.resize(200, 200);
    image(finalSC2, this.frameCenterX + 150, this.frameCenterY + 75);


    this.setCurrentScreen("winner");
  }

  /**
   * Game over screen that is shown when the player loses.
   */
  #loserScreen() {
    background(0);
    this.#showFrame();

    fill('black');
    textAlign(CENTER, CENTER);

    textSize(48);
    textStyle(BOLD);
    fill('red');
    text("YOU LOST!", this.frameCenterX, this.frameCenterY - 100);



    textSize(24);
    textStyle(NORMAL);
    fill('black');
    text("Press 'R' to go to the Main Menu.", this.frameCenterX, this.frameCenterY - 60);

    scale(-1, 1);
    let finalSC = tekagon;
    finalSC.resize(200, 200);
    image(finalSC, this.frameCenterX - 650, this.frameCenterY + 75);
    scale(-1, 1);

    let finalSC2 = pythonova;
    finalSC2.resize(200, 200);
    image(finalSC2, this.frameCenterX + 150, this.frameCenterY + 75);

    this.setCurrentScreen("loser");
  }

  /**
   * Monstermon battle screen.
   */
  #battleScreen() {

    // Choose a background only ONCE
    if (this.battleBGChoice === null) {
      this.battleBGChoice = random([1, 2, 3]);
    }

    // Use the chosen background every frame
    if (this.battleBGChoice === 1) {
      image(battleBackground, width / 2, height / 2, width, height);
    } else if (this.battleBGChoice === 2) {
      image(battleBackground2, width / 2, height / 2, width, height);
    } else if (this.battleBGChoice === 3) {
      image(battleBackground3, width / 2, height / 2, width, height);
    }
    this.#showAttributes();
    this.#showRoster();
    this.#showPlayerMonster();
    this.#showOpponentMonster();
    this.#showTurnPrompt();
    this.#showTempMessage();
    this.#showTrainers();

    // ensure current screen is set
    this.setCurrentScreen("battle");
  }

  #creditScreen() {
    background(0);
    this.#showFrame();

    this.#shadow();
    this.#showCredit();
    this.#hideShadow();

    // ensure current screen is set
    this.setCurrentScreen("credit");
  }

  //************************
  // UI Components - Private
  //************************

  /**
   * Displays a blank menu frame.
   */
  #showFrame() {
    // background pattern
    background(0);
    for (let i = 0; i < width; i += 20) {
      for (let j = 0; j < height; j += 20) {
        noStroke();
        fill('rgba(255, 255, 255, 0.15)');
        rect(i, j, 10, 10, 2);
      }
    }
    // frame
    rectMode(CENTER);
    fill('#C3CFA1');
    stroke('#C3CFA1');
    strokeWeight(3);
    rect(this.frameCenterX, this.frameCenterY, this.frameWidth, this.frameHeight, 15);
    noStroke();

  }

  /**
   * Displays game credits.
   */
  #showCredit() {

    let spacing = 20; // variable to adjust spacing between text blocks

    fill('black');
    textFont(font);

    // Credit Text
    textSize(16);
    textStyle(NORMAL);
    textAlign(CENTER);
    text("This game was created for academic purposes by", this.frameCenterX, 100);
    text("Adam Davis, Jack Delano, Brendon Elmore, Zion Reynolds, and Mike Vance", this.frameCenterX, 100 + (spacing));

    // The Boys <3
    creditPic.resize(400, 0);
    image(creditPic, this.frameCenterX, this.frameCenterY);

    // Other text
    textSize(22);
    textStyle(NORMAL);
    textAlign(CENTER);
    text("Thanks for playing!", this.frameCenterX, this.frameCenterY + 185);

    textSize(16);
    textStyle(NORMAL);
    textAlign(CENTER);
    text("Press ENTER to return to the main menu", this.frameCenterX, this.frameCenterY + (185 + spacing));
  }
  /**
   * Displays welcome text.
   */
  #showWelcome() {

    let spacing = 20; // variable to adjust spacing between text blocks

    fill('black');
    textFont(font);


    // Other text
    textSize(22);
    textStyle(NORMAL);
    textAlign(CENTER);
    text("Welcome to Monstérmon!", this.frameCenterX, this.frameCenterY);

    textSize(16);
    textStyle(NORMAL);
    textAlign(CENTER);
    text("Press ENTER to continue or 'C' for credits", this.frameCenterX, this.frameCenterY + (spacing));

  }

  /**
   * Sets up select menu.
   */
  #showSelectMenu() {
    let spacing = 80;
    let boxHeight = 60;
    let boxWidth = 60;
    let boxX = 200;
    let boxY = 200;

    // Menu title
    fill('black');
    textSize(24);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text("Select Your Monsters!", this.frameCenterX, 100);

    // Sectional selection boxes
    fill('#8A946F');
    stroke('black');
    strokeWeight(2);
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 6; y++) {
        rect(boxX, boxY, boxHeight, boxWidth, 15);
        boxX += spacing;
      }
      boxX = 200;
      boxY += spacing;
    }

    // Display for roster panel

    fill('#8A946F');
    stroke('black');
    let rosterSpace = 110;
    for (let x = 0; x < 6; x++) {
      rect(rosterSpace, 480, 60, 60);
      rosterSpace += 60;
    }
    stroke('black');
    textStyle(NORMAL);
    textSize(20);
    textAlign(LEFT, BOTTOM);
    fill("black");

    text("Roster", 90, 450);

    // Display play button
    stroke('black');
    strokeWeight(2);
    fill('#f44336');
    let buttonText = playerRoster.numMonsters + " / " + playerRoster.maxSize;
    let fontSize = 20;
    if (playerRoster.numMonsters == playerRoster.maxSize) {
      fill('#70b869	');
      buttonText = "Enter to play";
      fontSize = 15;
    }
    rect(540, 480, 120, 60, 15); // 560, 480, 120, 60, 15

    // Play button text
    fill('black')
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    textSize(fontSize);
    text(buttonText, 540, 478);

    // Control tip text
    if (playerRoster.numMonsters != playerRoster.maxSize) {
      textSize(15);
      text("Switch Monster: Up/Down/Left/Right Arrow", 400, 405);
      text("Confirm Selection: Enter", 400, 420);
      text("Remove Last Selection: Backspace", 400, 435);
    }

  }



  /**
   * Adds shadow to elements
   */
  #shadow() {
    // Add shadow effect
    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = 5;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
  }

  /**
   * Sets shadow values to 0 for elements following this method call.
   */
  #hideShadow() {
    // Add shadow effect
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
  }

  /**
   * Displays the user's roster on the battle screen.
   */
  #showRoster() {
    // Display for roster panel
    rectMode(CENTER);
    fill('#8A946F');
    stroke('black');
    strokeWeight(2);
    let rosterSpace = 32;
    for (let x = 0; x < 6; x++) {
      rect(rosterSpace, height - 32, 60, 60);
      rosterSpace += 60;
    }

    // display roster sprites
    let spacing = 60;
    let x = 32;
    let y = 568;
    for (let j = 0; j < playerRoster.maxSize; j++) {
      image(playerRoster.next().sprite_front, x, y);
      x += spacing;
    }

    // selection square is yellow until a selection is made
    let r, g, b;
    if (batEng.turn && batEng.switchAllowed) {

      // If the current roster rotation is on the Player's current monster
      // make the selection box green
      if (playerRoster.peek() == batEng.currentMonsterPlayer) {
        r = 0;
        g = 255;
        b = 0;
      }

      // Otherwise, make selection box yellow
      else {
        r = 255;
        g = 251;
        b = 0;
      }

      if (playerRoster.peek().current_hp == 0) { // Selecton box is red if monster is unavailable
        r = 255;
        g = 0;
        b = 0;
      }
    }
    fill(r, g, b, 80)
    rect(32, height - 32, 60, 60);
  }

  /**
   * Show's currently selected monster's stats on the battle screen.
   */
  #showAttributes() {
    // box containing player's selected monster stats
    fill('#8A946F');
    stroke('black');
    strokeWeight(2);
    rectMode(CORNER);
    rect(398, 518, 400, 80);
    rect(600, 543, 190, 43);
    // player monster stats text
    let curr = playerRoster.peek();
    let space = 15;
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(12);

    let nameString = "Monster: " + curr.name;
    if (batEng.turn && !batEng.switchAllowed) {
      nameString = "Monster: " + "<" + curr.name + ">";
    }
    text(nameString, 400, 530);
    text("HP: " + curr.current_hp + "/" + curr.hp, 550, 530); // Should eventually be "HP: current / max"
    text("Stat Boosts:", 605, 550);
    let statobject = batEng.peekPlayerMultipliers();
    text("Attack: x" + statobject.attack, 605, 569);
    text("Defense: x" + statobject.defense, 695, 550);
    text("Speed: x" + statobject.speed, 695, 569);
    fill(255, 255, 255);
    rect(625, 525, 150, 12);
    fill(0, 255, 0);
    if ((curr.current_hp / curr.hp) < 0.5) {
      fill(255, 255, 0);
      if (curr.current_hp / curr.hp < 0.25) {
        fill(255, 0, 0);
      }
    }
    if (curr == null) {
      rect(625, 525, 150, 12);
    } else {
      rect(625, 525, this.hpBarLength * (curr.current_hp / curr.hp), 12);
    }
    fill('black');
    text("Moves: ", 400, 545);
    text("1. " + curr.moveset.at(0).name, 400, 560); // move #1
    text("3. " + curr.moveset.at(2).name, 500, 560); // move #3

    text("2. " + curr.moveset.at(1).name, 400, 560 + space); // move #2
    text("4. " + curr.moveset.at(3).name, 500, 560 + space); // move #4

    // box containing AI's selected monster stats
    fill('#8A946F');
    stroke('black');
    strokeWeight(2);
    rectMode(CORNER);
    rect(2, 2, 400, 80);
    rect(204, 27, 190, 43);
    // AI monster stats text
    let curr2 = batEng.currentMonsterAI;
    let space2 = 15;
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(12);

    let nameString2 = "Monster: " + curr2.name;

    text(nameString2, 4, 12);
    text("HP: " + curr2.current_hp + "/" + curr2.hp, 152, 12); // Should eventually be "HP: current / max"
    text("Stat Boosts:", 209, 34);
    let statobject2 = batEng.peekAiMultipliers();
    text("Attack: x" + statobject2.attack, 209, 53);
    text("Defense: x" + statobject2.defense, 299, 34);
    text("Speed: x" + statobject2.speed, 299, 53);
    text("Moves: ", 4, 27);
    text("1. " + curr2.moveset.at(0).name, 4, 42); // move #1
    text("3. " + curr2.moveset.at(2).name, 104, 42); // move #3

    text("2. " + curr2.moveset.at(1).name, 4, 42 + space2); // move #2
    text("4. " + curr2.moveset.at(3).name, 104, 42 + space2); // move #4
    fill(255, 255, 255);
    rect(220, 7, 150, 12);
    fill(0, 255, 0);
    if ((curr2.current_hp / curr2.hp) < 0.5) {
      fill(255, 255, 0);
      if ((curr2.current_hp / curr2.hp < 0.25)) {
        fill(255, 0, 0);
      }
    }
    if (curr2 == null) {
      rect(220, 7, 150, 12);
    } else {
      rect(220, 7, this.enemyhpBarLength * (curr2.current_hp / curr2.hp), 12);
    }
    fill('black');
  }

  /**
   * Shows the currently selected monsters.
   */
  #showPlayerMonster() {
    /* **UNCOMMENT FOR DEBUGGING PURPOSES ONLY**
    let curr = playerRoster.peek().sprite_back;
    */
    let curr = batEng.currentMonsterPlayer.sprite_back; // Now displays Players current monster

    let x = 240;
    let y = 440;

    image(curr, x, y, curr.width * 2, curr.height * 2);
  }

  /**
   * Displays the current enemy monster.
   */
  #showOpponentMonster() {
    /* **UNCOMMENT FOR DEBUGGING PURPOSES ONLY**
    let curr = allMonsters.at(2).sprite_front; // opponent is a fixed monster for now
    */
    let curr = batEng.currentMonsterAI.sprite_front; // Now displays AI's current monster

    let x = 550;
    let y = 300;

    image(curr, x, y, curr.width * 1.4, curr.height * 1.4);
  }

  /**
   * Prompts the player to take their turn.
   */
  #showTurnPrompt() {
    // if player hasn't selected a monster

    // prompt frame
    fill('#8A946F');
    stroke('black');
    strokeWeight(2);
    rectMode(CORNER);
    rect(398, 465, 400, 50, 10);

    if (batEng.turn && batEng.switchAllowed) {
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      textSize(15);
      // prompt text
      text("It's your turn!", 415, 472);
      text("Switch Monster: Left/Right Arrow", 415, 486);
      text("Confirm Selection: Enter", 415, 500);
    } else if (batEng.turn && !batEng.moveSelected) {
      // prompt text
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      textSize(15);
      text("Use Move: 1, 2, 3, or 4", 415, 488);
    } else {
      // prompt text
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      textSize(15);
      text("Your opponent is taking their turn...", 415, 488);
    }
  }

  /**
   * Shows a popup message.
   */
  #showTempMessage() {
    if (frameCount < this.messageEndTime) {
      // prompt frame
      fill('#8A946F');
      stroke('black');
      strokeWeight(2);
      rectMode(CORNER);
      rect(398, 432, 400, 30, 10);

      // prompt text
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      fill('black');
      textAlign(LEFT, CENTER);
      textSize(13);
      text(this.message, 401, 444);
    }
  }

  /**
   * Runs funcitonality for seleciton screen engine
   */
  #selectionScreenEngine() {

    // **USE IF DEBUGGING IS NEEDED**
    //text("X: " + mouseX + ", Y: " + mouseY, 100, 100);
    //text(rosterMonsters, 100, 130);

    let boundingBoxXMax = 230;
    let boundingBoxYMax = 170;
    let boundingBoxXMin = 170;
    let boundingBoxYMin = 230;

    let spacing = 80;
    let boxHeight = 60;
    let boxWidth = 60;
    let boxX = 200;
    let boxY = 200;

    // If the mouse is hovering over a box with a mouse in it, highlight box
    // with green square, indicating that it can be selected; otherwise,
    // highlight the box with a red square
    let i = 0;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 6; y++) {
        if (i < allMonsters.length) {
          if (monsterIndex[i]) {
            if (mouseX >= boundingBoxXMin && mouseX <= boundingBoxXMax
              && mouseY <= boundingBoxYMin && mouseY >= boundingBoxYMax) {
              // If a monster is clicked, makes its selection unavailable,
              // remove it from its selection box, and add it to the roster
              // (see also select screen setting for loadMonsterImages and)
              // mouseClicked
              fill(0, 255, 0, 80)
              rect(boxX, boxY, boxHeight, boxWidth);
              fill('#f44336')
            }
          }
          else {
            if (mouseX >= boundingBoxXMin && mouseX <= boundingBoxXMax
              && mouseY <= boundingBoxYMin && mouseY >= boundingBoxYMax) {
              fill(255, 0, 0, 80)
              rect(boxX, boxY, boxHeight, boxWidth);
              fill('black')
            }
          }
          i++;
        }
        boxX += spacing;
        boundingBoxXMax += spacing;
        boundingBoxXMin += spacing;
      }
      boxX = 200;
      boundingBoxXMax = 230;
      boundingBoxXMin = 170;
      boxY += spacing;
      boundingBoxYMax += spacing;
      boundingBoxYMin += spacing;
    }
  }

  #selectionScreenEngine2() {
    // display roster sprites
    let spacing = 60;
    let x = 110;
    let y = 480;
    for (let j = 0; j < playerRoster.numMonsters; j++) {
      image(playerRoster.monsters.at(j).sprite_front, x, y);
      x += spacing;
    }

    let r = 0;
    let g = 255;
    let b = 0;
    if (playerRoster.monsterIDs.includes(this.selectedIndex)) {
      r = 244;
      g = 67;
      b = 54;
    }

    fill(r, g, b, 80);
    rect(this.boxX, this.boxY, 60, 60, 10);
  }

  /**
   * Adjusts the coordinates for the selection box.
   * @param {string} direction
   */
  moveSelectionBox(direction) {
    if (direction == "up" && this.boxY > 200) {
      this.boxY -= 80;
      this.selectedIndex -= 6;
      console.log("Index: " + this.selectedIndex);
    } else if (direction == "down" && this.boxY < 360) {
      this.boxY += 80;
      this.selectedIndex += 6;
      console.log("Index: " + this.selectedIndex);
    } else if (direction == "right" && this.boxX < 600) {
      this.boxX += 80;
      this.selectedIndex += 1;
      console.log("Index: " + this.selectedIndex);
    } else if (direction == "left" && this.boxX > 200) {
      this.boxX -= 80;
      this.selectedIndex -= 1;
      console.log("Index: " + this.selectedIndex);
    }
  }

  /**
   * Displays the current selected monster's image in the monster
   * selection screen.
   */
  #displaySelectedMonster() {
    let displayMonster = monsterFrontImages.at(this.selectedIndex); // Monster on display
    let monsterName = allMonsters.at(this.selectedIndex).name; // Monster on display name
    let monsterType = allMonsters.at(this.selectedIndex).types; // Monster on type name
    let typeColors = ['#A6B91A', '#6F35FC', '#A98FF3', '#96D9D6','#F95587', '#A33EA1',
      '#B6A136', '#6390F0', '#EE8130', '#6390F0', '#E2BF65', '#B7B7CE', "#D685AD", '#7AC74C',
      '#F7D02C', '#705746', '#735797', '#C22E28']; // // Colors that correlate with monster type
    
    // Set up display box and text
    stroke('black');
    fill('black');
    strokeWeight(0.5);
    textSize(15);
    text(monsterName, 660, 503);
    fill(typeColors[this.selectedIndex]);
    strokeWeight(2);
    text(monsterType, 660, 515);
    stroke('black');
    fill('black');
    strokeWeight(2);
    if (playerRoster.monsterIDs.includes(this.selectedIndex)) {
      stroke('red');
    }
    else {
      stroke('green');
    }
    rect(660, 448, 100, 100);

    // Display monster
    displayMonster.resize(85, 0);
    image(displayMonster, 660, 448);
    stroke('black');
    strokeWeight(1);
  }

  /**
   * Loads necessary monster images based on the screen that is dispalyed.
   */
  #loadMonsterImages() {
    if (this.getCurrentScreen() == "select") {
      // Resizes front monster art for select screen
      for (let x = 0; x < allMonsters.length; x++) {
        allMonsters[x].sprite_front.resize(50, 0);
      }

      let imgX = 200;
      let imgY = 200;
      let spacing = 80;
      let i = 0;
      let rosterSpace = 110;
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 6; y++) {
          if (i < allMonsters.length) {
            image(allMonsters[i].sprite_front, imgX, imgY);

            i++;
            imgX += spacing;
          }
        }
        imgX = 200;
        imgY += spacing;
      }
    }
  }

  /**
   * Displays trainer avatar selection screen.
   */
  #trainerScreen() {
    background(0);
    this.#showFrame();
    fill('black');
    textSize(34);
    text('Choose Your Trainer!', 400, 170);
    stroke('black');
    strokeWeight(4);
    triangle(245, 400, 245, 300, 200, 350);
    triangle(555, 400, 555, 300, 600, 350);
    fill('black');
    fill('#C3CFA1');
    rect(400, 350, 275, 300);
    trainerSelector.curr.resize(0, 270);
    image(trainerSelector.curr, 400, 350);
    strokeWeight(2);
  }

  /**
   * Loads respective trainer avatars on the battle screen
   */
  #showTrainers() {
    stroke('black');
    fill('#C3CFA1');
    strokeWeight(4);
    rect(4, 375, 150, 150); // orig y = 340
    trainerSelector.playerTrainer.resize(0, 130);
    image(trainerSelector.playerTrainer, 80, 445);
    trainerSelector.AITrainer.resize(0, 110);
    image(trainerSelector.AITrainer, 650, 220);
    strokeWeight(2);
  }
} // end UI class ¯\_( ͡° ͜ʖ ͡°)_/¯
