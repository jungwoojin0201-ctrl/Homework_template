const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;

let engine;
let lines = [];
let notes = [];
let lineGap = 15;
let gatherFrame = 480;
let ceilingFrame = 1080;
let riseForce = 0.00015;
let pull = 0.0000009;
let wobble = 0.025;
let floatSize = 4;
let floatSpeed = 0.02;

let staffWidth = 0.6;

let notePos = [
  { step: 0, x: 0.08 }, // 1.
  { step: 1, x: 0.185 }, // 1.1
  { step: 2, x: 0.29 }, // 2.
  { step: 3, x: 0.395 }, // 2.1
  { step: 4, x: 0.5 },  // 3
  { step: 5, x: 0.605 }, // 3.1
  { step: 6, x: 0.71 }, // 4
  { step: 7, x: 0.815 }, // 4.1
  { step: 8, x: 0.92 }, // 5
];

let targetY = [];//줄높이

function noteX(i) {
  let left = width * (0.5 - staffWidth / 2);
  return left + width * staffWidth * notePos[i].x;
}

function noteY(i) {
  return height / 2 + lineGap * 2 - notePos[i].step * (lineGap / 2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();

  // 바닥and양옆
  Composite.add(engine.world, [
    Bodies.rectangle(width / 2, height + 50, width * 2, 100, { isStatic: true }),
    Bodies.rectangle(-50, height / 2, 100, height * 3, { isStatic: true }),
    Bodies.rectangle(width + 50, height / 2, 100, height * 3, { isStatic: true }),
  ]);

  for (let i = 0; i < 5; i++) {
    let line = Bodies.rectangle(random(width * 0.3, width * 0.7), random(-400, -50), width * staffWidth, 3, {
      restitution: 0.3,
    });
    Body.setAngle(line, random(TWO_PI));
    line.power = random(0.6, 1.4);
    line.phase = random(TWO_PI);
    lines.push(line);

    targetY.push(height / 2 + lineGap * 2 - i * lineGap);
    Composite.add(engine.world, line);
  }

  for (let i = 0; i < notePos.length; i++) {
    let note = Bodies.circle(random(width * 0.1, width * 0.9), random(-400, -50), lineGap * 0.6, {
      restitution: 0.6,
    });
    Body.setAngle(note, random(TWO_PI));
    note.power = random(0.6, 1.4);
    note.phase = random(TWO_PI);
    notes.push(note);
    Composite.add(engine.world, note);
  }
}

function draw() {
  background(255);
  Engine.update(engine);

  // 중력 끄고 모으
  if (frameCount == gatherFrame) {
    engine.gravity.scale = 0;
    for (let i = 0; i < 5; i++) {
      let a = ((lines[i].angle + PI) % TWO_PI + TWO_PI) % TWO_PI - PI;
      Body.setAngle(lines[i], a);
      lines[i].collisionFilter.mask = 0;
      lines[i].frictionAir = wobble;
    }
    for (let i = 0; i < notes.length; i++) {
      let a = ((notes[i].angle + PI) % TWO_PI + TWO_PI) % TWO_PI - PI;
      Body.setAngle(notes[i], a);
      notes[i].collisionFilter.mask = 0;
      notes[i].frictionAir = wobble;
    }
  }

  // 음표 얼리가서 천장에 붙히기
  if (frameCount == ceilingFrame) {
    let topWall = Bodies.rectangle(width / 2, -50, width * 2, 100, { isStatic: true });
    topWall.collisionFilter.category = 2;
    Composite.add(engine.world, topWall);
    for (let i = 0; i < notes.length; i++) {
      notes[i].collisionFilter.mask = 2;
      notes[i].frictionAir = 0.03;
      notes[i].restitution = 0.1;
    }
  }

  // 오선줄은 계속 유지하기
  if (frameCount > gatherFrame) {
    let t = (frameCount - gatherFrame) * floatSpeed;

    for (let i = 0; i < 5; i++) {
      let b = lines[i];
      let goalX = width / 2 + sin(t + b.phase) * floatSize;
      let goalY = targetY[i] + cos(t * 0.8 + b.phase) * floatSize;
      let goalAngle = sin(t * 0.7 + b.phase) * 0.01;
      let fx = (goalX - b.position.x) * pull * b.power * b.mass;
      let fy = (goalY - b.position.y) * pull * b.power * b.mass;
      Body.applyForce(b, b.position, { x: fx, y: fy });

      Body.setAngularVelocity(b, b.angularVelocity - (b.angle - goalAngle) * 0.0006 * b.power);
    }
  }

  // 중앙으로 모이기
  if (frameCount > gatherFrame && frameCount < ceilingFrame) {
    let t = (frameCount - gatherFrame) * floatSpeed;

    for (let i = 0; i < notes.length; i++) {
      let b = notes[i];
      let goalX = noteX(i) + sin(t + b.phase) * floatSize;
      let goalY = noteY(i) + cos(t * 0.8 + b.phase) * floatSize;
      let goalAngle = sin(t * 0.7 + b.phase) * 0.05;
      let fx = (goalX - b.position.x) * pull * b.power * b.mass;
      let fy = (goalY - b.position.y) * pull * b.power * b.mass;
      Body.applyForce(b, b.position, { x: fx, y: fy });
      Body.setAngularVelocity(b, b.angularVelocity - (b.angle - goalAngle) * 0.0006 * b.power);
    }
  }

  // 음표 위로 올라가 천장에 붙음
  if (frameCount > ceilingFrame) {
    for (let i = 0; i < notes.length; i++) {
      let b = notes[i];
      Body.applyForce(b, b.position, { x: 0, y: -riseForce * b.mass * b.power });
    }
  }

  stroke(0);
  strokeWeight(3.5);
  for (let i = 0; i < 5; i++) {
    let b = lines[i];
    push();
    translate(b.position.x, b.position.y);
    rotate(b.angle);
    line(-width * staffWidth / 2, 0, width * staffWidth / 2, 0);
    pop();
  }

  for (let i = 0; i < notes.length; i++) {
    let b = notes[i];
    push();
    translate(b.position.x, b.position.y);
    rotate(b.angle);

    // 대가리
    noStroke();
    fill(0);
    ellipse(0, 0, lineGap * 1.2, lineGap * 0.9);

    // 몸
    stroke(0);
    strokeWeight(3);
    line(lineGap * 0.55, 0, lineGap * 0.55, -lineGap * 3);
    pop();
  }
}
