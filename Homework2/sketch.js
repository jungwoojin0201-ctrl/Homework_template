let player;
let gamestate = 'READY';

let boxX = 0;        
let boxY;
let boxSpeed = 0;
let shake = 0;
let boxFade = 255;
let alive = true;

let standY;
let floorY;

let beamProgress = 0;

let pressX = 0;
let pressY = 0;
let dragged = false;
let hit = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  setPositions();
  player = new Player();
  boxY = -height;
}

function setPositions() {
  standY = height * 0.8;
  floorY = standY + 30;
}

function draw() {
  background(255);

  push();
  if (shake > 0) {
    translate(random(-shake, shake), random(-shake, shake));
    shake *= 0.9;
    if (shake < 0.5) shake = 0;
  }

  fill(0);
  noStroke();
  rect(-50, floorY, width + 100, height);

  if (gamestate === 'SPAWN') {
    player.speed += 1;
    player.y += player.speed;
    if (player.y >= standY) {
      player.y = standY;
      player.speed = 0;
      gamestate = 'READY';
    }
  }

  if (gamestate === 'PUSH') {
    boxX = mouseX;
    if (alive && boxX - 10 < player.x) {
      player.x = boxX - 10;
    }
    if (alive && player.x <= 10) {
      player.x = 10;
      alive = false;
      hit = true;
      shake = 30;
    }
  }

  if (gamestate === 'BEAM') {
    if (alive) {
      beamProgress = min(beamProgress + 0.01, 1);
      if (beamProgress > 0.6) {
        player.speed += 0.03;
        player.y -= player.speed;
        player.angle += 0.03;
        if (player.y < -80) alive = false;
      }
    } else {
      beamProgress -= 0.02;
      if (beamProgress <= 0) {
        beamProgress = 0;
        gamestate = 'DONE';
      }
    }

    let topW = width * 0.04 * beamProgress;
    let bottomW = width * 0.15 * beamProgress;
    noStroke();
    fill(255, 220, 0, 200);
    quad(player.x - topW / 2, 0, player.x + topW / 2, 0,
        player.x + bottomW / 2, floorY, player.x - bottomW / 2, floorY);
  }

  if (alive) {
    player.display();
  }

  if (gamestate === 'FALL') {
    boxSpeed += 1.5;
    boxY += boxSpeed;

    if (boxY + height >= standY - 38) {
      alive = false;
    }

    if (boxY + height >= floorY) {
      boxY = floorY - height;
      gamestate = 'SHAKE';
      shake = 30;
    }
  }

  if (gamestate === 'FALL' || gamestate === 'SHAKE' || gamestate === 'PUSH' || gamestate === 'FADE') {
    fill(255, boxFade);
    stroke(0, boxFade);
    strokeWeight(8);
    rect(boxX, boxY, width, height);
  }

  if ((gamestate === 'SHAKE' && shake === 0) || gamestate === 'FADE') {
    boxFade -= 5;
    if (boxFade <= 0) {
      if (alive) gamestate = 'READY';
      else gamestate = 'DONE';
    }
  }
  pop();
}

function mousePressed() {
  pressX = mouseX;
  pressY = mouseY;
  dragged = false;
}

function mouseDragged() {

  if (abs(mouseX - pressX) > 10) dragged = true;

  if (gamestate === 'READY' && pressX - mouseX > 10 && abs(mouseX - pressX) > abs(mouseY - pressY)) {
    boxY = floorY - height;
    boxFade = 255;
    hit = false;
    gamestate = 'PUSH';
  }

  if (gamestate === 'READY' && mouseY - pressY > 10 && abs(mouseY - pressY) > abs(mouseX - pressX)) {
    beamProgress = 0;
    player.speed = 0.5;
    player.angle = 0;
    gamestate = 'BEAM';
  }
}

function mouseReleased() {
  if (gamestate === 'PUSH') {
    gamestate = 'FADE';
  } else if (gamestate === 'READY' && !dragged) {
    boxX = 0;
    boxY = -height;
    boxSpeed = 0;
    boxFade = 255;
    gamestate = 'FALL';
  }
}

function keyPressed() {
  if (key === ' ' && gamestate === 'DONE') {
    player.x = width / 2;
    player.angle = 0;
    player.y = -100;
    player.speed = 0;
    alive = true;
    gamestate = 'SPAWN';
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = standY;
    this.speed = 0;
    this.angle = 0;
  }

  display() {
    push();
    translate(this.x, this.y - 4);
    rotate(this.angle);
    translate(0, 4);
    scale(4);
    noStroke();

    rectMode(CENTER);
    fill(20);
    rect(0, -8, 3, 3);       // 머리
    rect(0, -1, 5, 8);       // 몸통
    rect(-1.5, 5, 1.5, 5);   // 왼쪽 다리
    rect(1.5, 5, 1.5, 5);    // 오른쪽 다리
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setPositions();
  if (gamestate === 'READY') {
    player.x = width / 2;
    player.y = standY;
  }
}
