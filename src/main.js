/**
 * Main Class!
 * @author Zion Reynolds, Francis, Brendon Elmore, Mike Vance, Jack Delano, Adam Davis
 * @version 18APR25
 */

//Index:  0        1        2           3           4         5          6          7         8           9        10       11
//Name: Ariados, Crator, Criminalis, Cryogonal, Efflutal, Forbiddron, Hogriks, Marelstorm, Pythonova, Shorelorn, Tekagon, Titaneon
let allMonsters = []; // array that contains every monster as an object.
let enemyMonsters = [];

let ui;
let battleBackground;
let playerRoster = new Roster();

// Audio variables
let typeSounds = {};
let song1;
let song2;
let effectiveHitSound;
let loseSound;
let winSound;
let slider;
let font;
let startScreen;

// Battler engine set up
let batEng;

// Monster variables and monster object array to be implemented
let monsterData = [];
let enemymonsterData = [];
let moveData = [];
let allMoves = [];
let typeResist;
let typeEffective;
let ariados, crator, criminalis, cryogonal, efflutal, forbiddron, hogriks, marelstorm, pythonova, shorelorn, tekagon, titaneon;
let Fireball, Flamerush, Thunderbolt, Static_Shock, Water_Gun, Splash, Overgrowth, Vine_Whip, Soul_Suck, Spook, Sandstorm, Smash, Hyper_Beam, Bone_Claw, Tornado, Gust, Swarm, Sting, Earthquake, Sink_Hole, Bite, Headbutt, Frostbite, Chill_Touch, Shatter_Psyche, Dream_Eater, Whirlwind_Kick, Karate_Chop, CloudKill, Sludge_Bomb, Sword_Jiggy, Agility, Slow, Harden, Shatter, Growl;
let monsterFrontImages = [];
let start = false;
let varanitor;
let green;
let enterSound;
let arrowSound;
let deleteSound;
let animating = false;
let frame = 0;
let totalFrames = 100;
let animationStartX;
let animationStartY;
let animationEndX;
let animationEndY;
let movetype = null;
// Global trainer avatar module
let trainerImages = [];
let trainerSelector;
let animationSprites;
let isthisAI;
let aimovetype = null;
let invert;
let creditPic;
async function preload() {
  green = loadImage("sprites/zgreengirl.jpg");
  varanitor = loadImage("sprites/Varanitor_Front.webp");
  pythonova = loadImage("sprites/Pythonova_Front.webp");
  tekagon = loadImage("sprites/Tekagon_Front.webp");
  font = await loadFont("fonts/Pixel.ttf");
  startScreen = loadImage("backgrounds/Start.jpg");
  creditPic = loadImage("credits/theBoys.jpg");
  const monsterResponse = await fetch('src/dat/monsters.json');
  const monsterResponse1 = await fetch('src/dat/monsters.json');
  monsterData = await monsterResponse.json();
  enemymonsterData = await monsterResponse1.json();
  const movesResponse = await fetch('src/dat/moves.json');
  moveData = await movesResponse.json();
  const effectiveData = await fetch('src/dat/typeeffectiveness.json');
  typeEffective = await effectiveData.json();
  battleBackground = loadImage("backgrounds/zforest.jpg");
  battleBackground2 = loadImage("backgrounds/zgrave.jpg");
  battleBackground3 = loadImage("backgrounds/cave.png");
  animationSprites = loadImage("sprites/Pixel_Magic_Effects_Animations.png");

  for (let i = 0; i <= 25; i++) {
    trainerImages[i] = loadImage("trainer_sprites/trainer" + i + ".png");
  }

  trainerSelector = new Trainer();

  await loadMoves();
  await loadMonsters();
}

function setup() {
  song1 = loadSound("src/songs/StartMusic.mp3"); //DO NOT MOVE
  song2 = loadSound("src/songs/BattleMusic.mp3"); //DO NOT MOVE

  enterSound = loadSound("src/Sounds/enterSound.mp3");
  arrowSound = loadSound("src/Sounds/arrowSound.mp3");
  deleteSound = loadSound("src/Sounds/deleteSound.mp3");

  effectiveHitSound = loadSound("src/Sounds/EffectiveHitSound.mp3");
  loseSound = loadSound("src/Sounds/LosingScreenSoundEffect.mp3");
  winSound = loadSound("src/Sounds/WinScreenSoundEffect.mp3");

  typeSounds = {
    "Normal": loadSound("src/Sounds/normal.mp3"),
    "Fire": loadSound("src/Sounds/fire.mp3"),
    "Water": loadSound("src/Sounds/water.mp3"),
    "Electric": loadSound("src/Sounds/electric.mp3"),
    "Grass": loadSound("src/Sounds/grass.mp3"),
    "Ice": loadSound("src/Sounds/ice.mp3"),
    "Fighting": loadSound("src/Sounds/fighting.mp3"),
    "Poison": loadSound("src/Sounds/poison.mp3"),
    "Ground": loadSound("src/Sounds/ground.mp3"),
    "Flying": loadSound("src/Sounds/flying.mp3"),
    "Psychic": loadSound("src/Sounds/psych.mp3"),
    "Bug": loadSound("src/Sounds/bug.mp3"),
    "Rock": loadSound("src/Sounds/rock.mp3"),
    "Ghost": loadSound("src/Sounds/ghost.mp3"),
    "Dragon": loadSound("src/Sounds/dragon.mp3"),
    "Dark": loadSound("src/Sounds/dark.mp3"),
    "Steel": loadSound("src/Sounds/steel.mp3"),
    "Fairy": loadSound("src/Sounds/fairy.mp3")
  };

  let canvas = createCanvas(800, 600);
  canvas.parent('game-container') // puts the game canvas in a div so object centering works properly.
  ui = new userInterface(); // user interface object
  playerRoster = new Roster();

  // **ENGINE THINGS**
  batEng = new BattlerEngine();
  // **ENGINE THINGS**

  imageMode(CENTER);

  let sfxLabel = createDiv('Sound Effects Volume');
  sfxLabel.parent('controls-container');
  sfxLabel.style('color', 'white');
  sfxLabel.style('font-family', font);
  sfxLabel.style('margin-bottom', '6px');
  sfxLabel.style('margin-top', '6px');

  sfxSlider = createSlider(0, 1, 0.5, 0.01);
  sfxSlider.parent('controls-container');
  sfxSlider.style('width', '160px');

  let musicLabel = createDiv('Music Volume');
  musicLabel.parent('controls-container');
  musicLabel.style('color', 'white');
  musicLabel.style('font-family', font);
  musicLabel.style('margin-bottom', '6px');
  musicLabel.style('margin-top', '6px');

  slider = createSlider(0, 1, .5, 0.01);
  slider.parent('controls-container');
  slider.style('width', '160px');
}

function draw() {
  // Volume/sound functionality
  song1.setVolume(slider.value() / 2);
  song2.setVolume(slider.value() / 2);

  // SFX
  effectiveHitSound.setVolume(sfxSlider.value());
  winSound.setVolume(sfxSlider.value());
  loseSound.setVolume(sfxSlider.value());
  enterSound.setVolume(sfxSlider.value());
  arrowSound.setVolume(sfxSlider.value());
  deleteSound.setVolume(sfxSlider.value());

  for (let t in typeSounds) {
    typeSounds[t].setVolume(sfxSlider.value());
  }
  song1.setVolume(slider.value() / 2);
  effectiveHitSound.setVolume(slider.value() / 2);
  winSound.setVolume(slider.value() / 2);
  loseSound.setVolume(slider.value() / 2);
  // UI functionality
  background(220);
  ui.show(); // in draw() for demonstration purposes. Should be in whatever class manages the game
  if (!batEng.gameOver) {
    batEng.battler();
  } else {
    if (batEng.gameWon == true) {
      console.log("Game Won!")
      frame = 0;
    }
  }
  if ((movetype != null && aimovetype != null) && frame <= totalFrames) {
    const t = frame / totalFrames;

    const startX = isthisAI ? animationEndX : animationStartX;
    const startY = isthisAI ? animationEndY : animationStartY;
    const endX = isthisAI ? animationStartX : animationEndX;
    const endY = isthisAI ? animationStartY : animationEndY;

    const x = lerp(startX, endX, t);
    const y = lerp(startY, endY, t);

    const moveTypeSpriteCoords = {
      "Bug": [192, 64], "Normal": [320, 64], "Fire": [0, 0],
      "Water": [128, 128], "Grass": [64, 448], "Electric": [320, 128],
      "Ice": [576, 448], "Fighting": [256, 384], "Poison": [256, 512],
      "Ground": [448, 64], "Flying": [576, 64], "Psychic": [256, 574],
      "Ghost": [256, 448], "Dragon": [0, 320], "Dark": [320, 0],
      "Steel": [192, 0], "Rock": [448, 256], "Status": [640, 0]
    };

    // Use actual attacker to pick the move type
    const currentMoveType = isthisAI ? movetype : aimovetype;
    const [sx, sy] = moveTypeSpriteCoords[currentMoveType] || [512, 320];

    imageMode(CENTER);
    push();
    translate(x, y);
    if (isthisAI) scale(-1, 1);
    image(animationSprites, 0, 0, 40, 40, sx, sy, 64, 64);
    pop();

    frame++;

    if (frame > totalFrames) {
      frame = 0;
      if (animating === true) {
        animating = "second";
        isthisAI = !aiGoesFirst; // 🔄 Switch to second attacker
      } else if (animating === "second") {
        animating = false;
        movetype = null;
        aimovetype = null;
      }
    }
  }
}

function gameManager() {
  // Created for future editing purposes
}

function keyPressed() {
  if (key === 'a') {
    startAnimation(240, 440, 550, 300); // Start at (240,440) → (550,300)
  }

  // prevent arrow key scrolling
  window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  }, false);
  // **Uncomment for key debugging**
  //console.log("Key: " + key + " | KeyCode: " + keyCode);
  if (ui.getCurrentScreen() == "splash" && key == 'c') {
    ui.setCurrentScreen("credit");
  } else if (ui.getCurrentScreen() == "splash" && key == 'Enter') { // Switch to select screen menu
    song1.loop();
    console.log("Start Game")
    ui.setCurrentScreen("trainer");
  } else if (ui.getCurrentScreen() == "credit" && key == 'Enter') {
    ui.setCurrentScreen("splash");
  } else if (key == "w") {
    ui.setCurrentScreen("winner");
  } else if (key == "l") {
    ui.setCurrentScreen("loser");
  } else if (ui.getCurrentScreen() == "battle") { // battle screen input logic
    if (batEng.switchAllowed) { // monster switch/selection logic
      if (key == 'ArrowRight') {
        playerRoster.next();
        arrowSound.play();
      } else if (key == 'ArrowLeft') {
        playerRoster.prev();
        arrowSound.play();
      } else if (key == 'Enter') { // Switches monsters (if they haven't been switched this turn)
        batEng.switchMonsters();
        // batEng.currentMonsterPlayerStatusMultipliers.attack = 1;
        // batEng.currentMonsterPlayerStatusMultipliers.speed = 1;
        // batEng.currentMonsterPlayerStatusMultipliers.defense = 1;
        enterSound.play();
      }
    } else if (batEng.turn && !batEng.moveSelected) { // move selection
      if (key == '1') {
        batEng.moveSelector(0); // Select move 1
        console.log("Move 1")
      } else if (key == '2') {
        batEng.moveSelector(1); // Select move 2
        console.log("Move 2")
      } else if (key == '3') {
        batEng.moveSelector(2); // Select move 3
        console.log("Move 3")
      } else if (key == '4') {
        batEng.moveSelector(3); // Select move 4
        console.log("Move 4")
      }
    }
  } else if ((ui.getCurrentScreen() == "winner" || ui.getCurrentScreen() == "loser") && key == 'r') { // reset game, untested
    window.location.reload();
  } else if (ui.getCurrentScreen() == "select") {  // Logic for monster selection screen
    if (key == 'Escape') {
      ui.setCurrentScreen("splash");
    } else if (key == 'ArrowRight') { // move selection box right
      ui.moveSelectionBox("right");
      arrowSound.play();
    } else if (key == 'ArrowLeft') { // move selection box left
      ui.moveSelectionBox("left");
      arrowSound.play();
    } else if (key == 'ArrowDown') { // move selection box down
      ui.moveSelectionBox("down");
      arrowSound.play();
    } else if (key == 'ArrowUp') { // move selection box up
      ui.moveSelectionBox("up");
      arrowSound.play();
    } else if (key == 'Enter') { // add selected monster to roster or start game
      enterSound.play();
      if (playerRoster.numMonsters == playerRoster.maxSize) {
        song1.stop();
        song1 = song2;
        song1.loop();

        ui.setCurrentScreen("battle");
        batEng = new BattlerEngine();
        batEng.battler();
        start = true;
        console.log("Start Battle");
      } else if (ui.selectedIndex < allMonsters.length) {
        playerRoster.addMonster(allMonsters.at(ui.selectedIndex));
        console.log("Added: " + allMonsters.at(ui.selectedIndex).name);
      }
    } else if (key == 'Backspace' && playerRoster.numMonsters > 0) { // remove last monster from roster
      console.log("Removed: " + playerRoster.monsters.at(playerRoster.numMonsters - 1).name);
      playerRoster.removeMonster();
      deleteSound.play();
    }
  } else if (ui.getCurrentScreen() == "trainer") { // functionality for trainer selection screen
    if (key == 'Enter') {
      trainerSelector.setPlayer();
      trainerSelector.setAI();
      enterSound.play();
      ui.setCurrentScreen("select");
    } else if (key == 'ArrowRight') {
      trainerSelector.next();
      arrowSound.play();
      console.log(trainerSelector.currIndex);
    } else if (key == 'ArrowLeft') {
      trainerSelector.prev();
      arrowSound.play();
      console.log(trainerSelector.currIndex);
    }
  }
}

/**
 * Asynchronous function that reads monster data into an array of monster objects
 */
async function loadMonsters() {
  monsterData.forEach(data => {
    let monster = new Monster(
      data.id,
      data.name,
      data.attack,
      data.defense,
      data.speed,
      data.hp,
      data.learnable_move_IDs,
      data.sprite_front,
      data.sprite_back,
      data.Types,
      data.Moves
    );
    allMonsters.push(monster);
    let img = loadImage(data.sprite_front);
    monsterFrontImages.push(img);
  });
  monsterData.forEach(data => {
    let monster = new Monster(
      data.id,
      data.name,
      data.attack,
      data.defense,
      data.speed,
      data.hp,
      data.learnable_move_IDs,
      data.sprite_front,
      data.sprite_back,
      data.Types,
      data.Moves
    );
    enemyMonsters.push(monster);
  });
}

/**
 * Asynchronous function that reads move data into an array of move objects
 */
async function loadMoves() {
  moveData.forEach(data => {
    let move = new Move(
      data.MoveID,
      data.Name,
      data.Attack,
      data.Accuracy,
      data.isStatus,
      data.TargetSelf,
      data.StatToChange,
      data.StatChangeMultiplier,
      data.Type,
      data.index
    );
    allMoves.push(move);
  });
  console.log(allMoves);
}
let aiGoesFirst;
function startAnimation(startX, startY, endX, endY, move, isAi, aiFirst = false) {
  animationStartX = startX;
  animationStartY = startY;
  animationEndX = endX;
  animationEndY = endY;
  animating = true;
  frame = 1;
  if (!isAi) {
  aiGoesFirst = aiFirst;
  }
  if (isAi) {
    aimovetype = move.type;
  } else {
    movetype = move.type;
  }

  // Set isthisAI for the first move based on who should attack first
  isthisAI = aiGoesFirst;
}