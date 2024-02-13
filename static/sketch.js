 // Global variable to store the classifier
let classifier;

// Label
let label = 'listening...';

// Teachable Machine model URL:
let soundModel = 'https://teachablemachine.withgoogle.com/models/YZL7EoS8n/';

let gameState = 0;
let gameStartTime = 0;
let gameDuration = 30; // start counting at 0

 let randomCommand = "";
 let previousCommand = "";
 let commands = ["Snap", "Clap", "Click"];
 let points = 0;

function preload() {
  // Load the model
  classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
  var canvas = createCanvas(416, 260);
  canvas.parent('sketch-holder');
  classifier.classify(gotResult);
}

function draw() {
  background(0);
  // Draw the label in the canvas
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(label, width / 2, height / 2);
  if (gameState === 0) {
    startGame();
  } else if (gameState === 1) {
    playGame();
  } else if (gameState === 2) {
    finishGame();
  }
  drawTime();

}


function startGame(){
  background(50);
  fill(255)
  textFont('Trebuchet MS')
  textSize(16);
  textAlign(CENTER);
  text("Welcome to Snap-It! Click anywhere to play.", width/2, height/2)
}

function playGame() {
    background(255, 255, 255);
    fill(0);
    textFont('Trebuchet MS')
    textAlign(CENTER);
    textSize(16);

    if (label === "listening...") {
        text("Waiting for model...", width / 2, height / 2);
        gameStartTime = timeElapsed;
        return;
    }

    if (randomCommand === "") {
      let availableCommands = commands.filter((value) => {return value !== previousCommand});
      randomCommand = commands[Math.floor(Math.random() * commands.length)];
    }
    text(randomCommand, width / 2, height / 2);
    if (randomCommand === "Click") {
        textSize(10);
        text("Click means make a sound like a balloon is popping", width / 2, 150);
    }

    if (label === randomCommand) {
      previousCommand = randomCommand;
      randomCommand = "";
      points++;
    }
}

function finishGame(){
  background(255,0,0);
  textFont('Trebuchet MS')
  textAlign(CENTER);
  textSize(20);
  text("GAME OVER\nCLICK TO PLAY AGAIN", width/2,height/2);

}

function drawTime(){
  timeElapsed = round(millis()/1000);
  fill(0);
  textAlign(LEFT);
  textSize(10);
  if(gameState === 1){
    let gameTimeElapsed = gameDuration - (timeElapsed - gameStartTime);
    text("Time Remaining: " +  gameTimeElapsed, 8,15);
  }
  text(points, 8, 30);

  // test to see if gameDuration is up
  if(timeElapsed - gameStartTime >= gameDuration){
    gameStartTime = NaN;
    gameState = 2;
  }
}

function mousePressed(){
  console.log(gameState);
  if(gameState === 0){
    gameState += 1;
    gameStartTime = timeElapsed;
    gameStartTime = round(millis()/1000);
  }
  else if(gameState === 2) {
    points = 0;
    gameStartTime = timeElapsed;
    gameState = 0;
  }

}

// The model recognizing a sound will trigger this event
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
   console.log(results[0]);
  label = results[0].label;
}
