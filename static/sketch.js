 // Global variable to store the classifier
let classifier;

// Label
let label = 'listening...';

// Teachable Machine model URL:
let soundModel = 'https://teachablemachine.withgoogle.com/models/YZL7EoS8n/';

let gameState = 0;
let gameStartTime = 0;
let gameDuration = 5; // start counting at 0

 let randomCommand = "";
 // let commands = ["Snap", "Clap", "Click"];
 let commands = ["Clap"];

function preload() {
  // Load the model
  classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
  createCanvas(320, 240);
  // Start classifying
  // The sound model will continuously listen to the microphone
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
  textSize(16);
  textAlign(CENTER);
  text("Welcome to Snap-It! Click anywhere to play.", width/2, height/2)
}

function playGame(){
  if(randomCommand === "") {
    randomCommand = commands[Math.floor(Math.random() * commands.length)];
  }
  background(255,255,255);
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text(randomCommand, width/2,height/2);
  if(randomCommand === "Click") {
    textSize(10)
    text("Click means make a sound like a balloon is popping", width/2, 150);
  }
  if(label === randomCommand) randomCommand = "";
}

function finishGame(){
  background(255,0,0);
  textAlign(CENTER);
  textSize(20);
  text("GAME OVER\nCLICK TO PLAY AGAIN", width/2,height/2);

}

function drawTime(){
  timeElapsed = round(millis()/1000);
  fill(0);
  textAlign(LEFT);
  textSize(10);
  text("Time Elapsed: " + timeElapsed, 8,15);
  if(gameStartTime){
    let gameTimeElapsed = gameDuration - (timeElapsed - gameStartTime);
    text("Time Remaining: " +  gameTimeElapsed, 8,30);
  }

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
  // console.log(results[0]);
  label = results[0].label;
}
