let current = null;

const places = {
  cafe:   { label: "Cafe",   col: "#ffff" },
  home:   { label: "Home",   col: "#ffff" },
  school: { label: "School", col: "#ffff" },
};

const MAP_BG = "#f3efe8";

let boxes = {};
let backBtn = {};

function isNotes(key) {
  return key === "cafe" || key === "school";
}

const HOME_MARGIN = 76;
const CLOUD_BUMP = 0.075;
const CLOUD_SPACING = 1.35;
const CLOUD_SQUARE = 4;
const CLOUD_FILL = "#fffdf8";
let homeCloud = null;
const POP_TIME = 500;
const HOME_RESPAWN = 1400;
const HOME_DOUBLE_TAP = 350;
let homeText = "";
let homeGood = "";
let homeAlive = true;
let popAt = -99999;
let bornAt = -99999;
let homeLastTap = -99999;
let popBits = [];
const SMALL_SCALE = 0.1;
const PULL_START = 30;
const PULL_SAVE = 110;
const SMALL_SPEED = 0.35;
const ARRIVE_MS = 900;
const SAVE_RESPAWN = 600;
const HOME_SEND_ZONE = 110;
let homeSaved = [];
let cloudPull = null;
let cloudPullX = 0;
let cloudPullY = 0;
let smallDrag = null;
let cloudSending = null;
let savedOut = false;

const MAP_STORE_KEY = "notes_map_drawing_v1";
const MAP_PENCIL = 0.006;
const MAP_ERASER = 0.035;
const MAP_TOOLS = ["move", "draw", "erase"];
let mapTool = "move"; 
let mapStrokes = [];
let mapStroke = null;
let mapDown = false;
let mapDirty = false;

const OUT_TIME = 700;
const IN_TIME  = 800;
const ZOOM_AMOUNT = 1.2;

const PAPER_TOP = 76;
const PAPER_TIME = 900;
const PAPER_DELAY = 300;
const PAPER_RATIO = 1.414;
let paperStart = 0;

const STACK_SHEETS = 3;
const STACK_OFF_X = 7;
const STACK_OFF_Y = 5;
const FLIP_TIME = 500;

const TEAR_START = 25;
const THROW_SPEED = 3;
let pressPaper = null;
let tear = null;

const CRUMPLE_STEP = 0.07;
const CRUMPLE_DECAY = 0.15;
const BALL_SCALE = 0.14;

const FOLD_COUNT = 4;
const FOLD_TIME = 520;
const FOLD_SWIPE = 55;
const FOLD_GOOD_DEG = 5;
const FOLD_BAD_DEG = 25;
const PACKET_SAVE_TIME = 0.65;
const FILE_SLOTS = 6;
const PAPER_FRONT = "#f3efe6";
const PAPER_BACK = "#e4ddcc";
const FILE_ROWS = 6;
let saved = [];
let fileShown = 0;
let fileBump = -9999;
let filesOpen = false;
let listKind = "file";
let fileScroll = 0;
let viewing = -1;
let viewKind = "file";
let viewAt = 0;

const SEND_START = 40;
const WEAR_MAX_OPENS = 8;
let bag = { home: [], cafe: [], school: [] };
let bagCount = 0;
let useSeq = 0;
let sendMenu = null;
let viewPress = null;
let viewDrag = 0;
let toast = { text: "", at: -99999 };
let sheetFade = 0;

const FLUTTER_STRIPS = 10;
const FLUTTER_STRENGTH = 4;

const A4_WIDTH_PT = 595;
const MARGIN_PT = 72;
const FONT_PT = 12;
const LINE_PT = 22;
const FONT_FAMILY = "Calibri, 'Malgun Gothic', Arial, sans-serif";
const KO_FONT = "'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif";

let ta;
let lastGood = "";
let lastSel = 0;

const spaces = {
  cafe:   { pages: [{ text: "", strokes: [] }], pageIdx: 0, idleIdx: 3 },
  school: { pages: [{ text: "", strokes: [] }], pageIdx: 0, idleIdx: 3 },
};
let pages = spaces.school.pages;
let pageIdx = 0;
let flip = null;

const TOOL_SIZE = 44;
const TOOL_GAP = 12;
const TOOLS = ["type", "draw", "erase"];
const INK = "#23201c";
const PENCIL_WIDTH = 0.004;
const ERASER_RADIUS = 0.025;
let tool = "type";
let strokes = pages[0].strokes;
let currentStroke = null;

function toolList() {
  return current === "cafe" ? [] : TOOLS;
}

const IDLE_OPTIONS = [5, 10, 30, 60, 120, 180, 300];
let idleIdx = 3;
const FADE_SEC = 20;
const MAX_DARK = 0.92;
const SHAKE_STEP = 0.05;
const DARK_BLOCK = 0.05;
let darkness = 0;
let idleSince = 0;
let prevText = "";
let lastDx = 0;
let lastDy = 0;
let settingsOpen = false;

const CAFE_PAPER_TOP = 150;
const CAFE_RULED = true;
const DRAIN_SEC = 40;
const LOW_POWER = 0.2;
const WAKE_AT = 0.1;
const SIP_RATE = 0.25;
const COFFEE_USE = 0.12;
const COFFEE_REFILL = 0.015;
const LAG_FAST = 80;
const LAG_SLOW = 400;
let caffeine = 1;
let cafeDead = false;
let coffee = 1;
let drinking = false;
let sipAnim = 0;
let shown = "";
let lastShow = 0;

const FORCE_HOLD_MS = 3000;
const REBOOT_MS = 2600;
let powerHold = -1;
let rebootAt = -99999;

const SCHOOL_OPEN_HOUR = 9;
const SCHOOL_CLOSE_HOUR = 24;
const SCHOOL_TEST = "";
const SCHOOL_MSG_TIME = 2600;
let schoolMsgAt = -99999;

let phase = "none";
let t = 0;
let pending = null;
let from = null;
let zoomCenter = { x: 0, y: 0 };

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  setupPointer(cnv);
  textFont("Georgia");
  textAlign(CENTER, CENTER);
  layout();
  loadMapDrawing();

  ta = document.createElement("textarea");
  ta.style.cssText =
    "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;" +
    "border:0;padding:0;resize:none;font-size:16px;pointer-events:none;";
  ta.setAttribute("autocomplete", "off");
  ta.setAttribute("autocorrect", "off");
  ta.setAttribute("spellcheck", "false");
  document.body.appendChild(ta);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layout();
}

function layout() {
  const gap = 20;
  const s = min((width - gap * 3) / 2, (height - gap * 3) / 2);

  const totalW = s * 2 + gap;
  const startX = (width - totalW) / 2;
  const totalH = s * 2 + gap;
  const startY = (height - totalH) / 2;

  boxes = {
    cafe:   { x: width / 2 - s / 2, y: startY,           s: s },
    home:   { x: startX,            y: startY + s + gap, s: s },
    school: { x: startX + s + gap,  y: startY + s + gap, s: s },
  };

  backBtn = { x: 20, y: 20, w: 70, h: 24};

buildHomeCloud();
}

function ease(x) {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
}

function smooth01(x, a, b) {
  const k = constrain((x - a) / (b - a), 0, 1);
  return k * k * (3 - 2 * k);
}

function pr(seed, i) {
  const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function goTo(target) {
  if (phase !== "none") return;
  ta.blur();
  currentStroke = null;
  mapStroke = null;
  mapDown = false;
  settingsOpen = false;
  filesOpen = false;
  closeViewer();
  sendMenu = null;
  drinking = false;
  powerHold = -1;
  clearTear();
  pressPaper = null;
  from = current;
  pending = target;
  phase = "out";
  t = 0;

  if (from === null && target !== null) {
    const b = boxes[target];
    zoomCenter = { x: b.x + b.s / 2, y: b.y + b.s / 2 };
  } else {
    zoomCenter = { x: width / 2, y: height / 2 };
  }
}

function stashSpace(key) {
  savePage();
  spaces[key].pages = pages;
  spaces[key].pageIdx = pageIdx;
  spaces[key].idleIdx = idleIdx;
}

function openSpace(key) {
  pages = spaces[key].pages;
  idleIdx = spaces[key].idleIdx;
  if (key === "cafe") tool = "type";
  loadPage(min(spaces[key].pageIdx, pages.length - 1));
}

function updateTransition() {
  if (phase === "none") return;

  const duration = phase === "out" ? OUT_TIME : IN_TIME;
  t += deltaTime / duration;

  if (t >= 1) {
    if (phase === "out") {
      if (isNotes(current)) stashSpace(current);
if (current === "home") homeText = ta.value;
current = pending;
if (isNotes(current)) openSpace(current);
if (current === "home") {
  ta.value = homeText;
  homeGood = homeText;
}
      paperStart = millis();
      darkness = 0;
      idleSince = millis();
      prevText = ta.value;
      lastDx = 0;
      lastDy = 0;
      settingsOpen = false;
      filesOpen = false;
      viewing = -1;
      viewPress = null;
      viewDrag = 0;
      sendMenu = null;
      drinking = false;
      powerHold = -1;
      rebootAt = -99999;
      sipAnim = 0;
      schoolMsgAt = -99999;
      flip = null;
      clearTear();
      pressPaper = null;
      phase = "in";
      t = 0;
    } else {
      phase = "none";
      t = 1;
    }
  }
}

function draw() {
  try {
    drawFrame();
  } catch (err) {
    console.error(err);
    resetMatrix();
    drawingContext.globalAlpha = 1;
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = "rgba(0,0,0,0)";
    noStroke();
    fill(255, 225, 225);
    rect(0, 0, width, 90);
    fill(160, 30, 30);
    textAlign(LEFT, TOP);
    textSize(14);
    text("Error: " + err.message, 16, 14, width - 32, 70);
  }
}

function drawFrame() {
  updateTransition();
  const e = ease(constrain(t, 0, 1));

  push();
  let sc = 1;
  let cx = width / 2, cy = height / 2;

  if (phase === "out") {
    cx = zoomCenter.x; cy = zoomCenter.y;
    if (from === null) sc = 1 + e * ZOOM_AMOUNT;
    else sc = 1 + e * 0.04;
  } else if (phase === "in") {
    if (current === null) sc = 0.94 + e * 0.06;
    else sc = 1.06 - e * 0.06;
  }

  translate(cx, cy);
  scale(sc);
  translate(-cx, -cy);

  if (current === null) drawMap();
  else drawPlace(current);
  pop();

  if (phase !== "none") {
    const target = phase === "out" ? pending : current;
    const overlayCol = target === null ? MAP_BG : places[target].col;
    const alpha = phase === "out" ? e * 255 : (1 - e) * 255;
    noStroke();
    const c = color(overlayCol);
    c.setAlpha(alpha);
    fill(c);
    rect(0, 0, width, height);
  }

  if (phase !== "none") cursor(ARROW);
}

function drawMap() {
  background(MAP_BG);
  let hovering = false;

  for (const key in boxes) {
    const b = boxes[key];
    const over = phase === "none" && mapTool === "move" &&
                 mouseX > b.x && mouseX < b.x + b.s &&
                 mouseY > b.y && mouseY < b.y + b.s;
    if (over) hovering = true;

    stroke("#23201c");
    strokeWeight(4);
    fill(places[key].col);
    rect(b.x, b.y - (over ? 3 : 0), b.s, b.s);

    noStroke();
    fill("#23201c");
    textSize(20);
    text(places[key].label, b.x + b.s * 0.1, b.y + b.s * 0.1 - (over ? 3 : 0));
  }

  drawMapStrokes();

  drawMapTools();

  if (phase === "none") {
    const ti = overMapTool();

    if (mapTool === "erase" && ti < 0) {
      push();
      noFill();
      stroke(INK);
      strokeWeight(1.5);
      circle(mouseX, mouseY, mapEraserRadius() * 2);
      pop();
    }

    if (ti >= 0) cursor(HAND);
    else if (mapTool === "draw") cursor(CROSS);
    else if (mapTool === "erase") noCursor();
    else cursor(hovering ? HAND : ARROW);
  }
}

function mapPencilWidth() {
  return max(2.5, min(width, height) * MAP_PENCIL);
}

function mapEraserRadius() {
  return max(14, min(width, height) * MAP_ERASER);
}

function drawMapStrokes() {
  push();
  stroke(INK);
  strokeWeight(mapPencilWidth());
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();
  for (const s of mapStrokes) {
    if (s.length === 1) {
      point(s[0].x * width, s[0].y * height);
    } else if (s.length > 1) {
      beginShape();
      for (const p of s) vertex(p.x * width, p.y * height);
      endShape();
    }
  }
  pop();
}

function drawMapTools() {
  for (let i = 0; i < MAP_TOOLS.length; i++) {
    drawToolIcon(toolBtn(i), i, mapTool === MAP_TOOLS[i]);
  }
}

function overMapTool() {
  if (current !== null || phase !== "none") return -1;
  for (let i = 0; i < MAP_TOOLS.length; i++) {
    if (hitRect(toolBtn(i))) return i;
  }
  return -1;
}

function eraseMapAt(mx, my) {
  const rad = mapEraserRadius();
  const out = [];
  let changed = false;
  for (const s of mapStrokes) {
    let piece = [];
    for (const p of s) {
      if (dist(p.x * width, p.y * height, mx, my) < rad) {
        changed = true;
        if (piece.length > 0) { out.push(piece); piece = []; }
      } else {
        piece.push(p);
      }
    }
    if (piece.length > 0) out.push(piece);
  }
  if (changed) {
    mapStrokes = out;
    mapDirty = true;
  }
}

function eraseMapAlong(x1, y1, x2, y2) {
  const rad = mapEraserRadius();
  const steps = max(1, ceil(dist(x1, y1, x2, y2) / (rad / 2)));
  for (let k = 0; k <= steps; k++) {
    eraseMapAt(lerp(x1, x2, k / steps), lerp(y1, y2, k / steps));
  }
}

function mapPressed() {
  const ti = overMapTool();
  if (ti >= 0) {
    mapTool = MAP_TOOLS[ti];
    mapStroke = null;
    mapDown = false;
    return false;
  }

  if (mapTool === "draw") {
    mapStroke = [{ x: mouseX / width, y: mouseY / height }];
    mapStrokes.push(mapStroke);
    mapDown = true;
    mapDirty = true;
    return false;
  }

  if (mapTool === "erase") {
    mapDown = true;
    eraseMapAt(mouseX, mouseY);
    return false;
  }

  for (const key in boxes) {
    const b = boxes[key];
    if (mouseX > b.x && mouseX < b.x + b.s &&
        mouseY > b.y && mouseY < b.y + b.s) {
      goTo(key);
      return;
    }
  }
}

function mapDragged() {
  if (!mapDown) return;

  if (mapTool === "draw" && mapStroke) {
    const last = mapStroke[mapStroke.length - 1];
    if (last) {
      const lx = last.x * width;
      const ly = last.y * height;
      const stepPx = max(2, min(width, height) * 0.004);
      const steps = ceil(dist(lx, ly, mouseX, mouseY) / stepPx);
      for (let k = 1; k < steps; k++) {
        const px = lerp(lx, mouseX, k / steps);
        const py = lerp(ly, mouseY, k / steps);
        mapStroke.push({ x: px / width, y: py / height });
      }
    }
    mapStroke.push({ x: mouseX / width, y: mouseY / height });
    mapDirty = true;
  } else if (mapTool === "erase") {
    eraseMapAlong(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function saveMapDrawing() {
  try {
    const data = mapStrokes.map(function (s) {
      return s.map(function (p) { return [round(p.x * 10000) / 10000, round(p.y * 10000) / 10000]; });
    });
    localStorage.setItem(MAP_STORE_KEY, JSON.stringify(data));
  } catch (e) {
  }
}

function loadMapDrawing() {
  try {
    const raw = localStorage.getItem(MAP_STORE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    mapStrokes = data.map(function (s) {
      return s.map(function (p) { return { x: p[0], y: p[1] }; });
    });
  } catch (e) {
    mapStrokes = [];
  }
}

function buildHomeCloud() {
  const M = HOME_MARGIN;
  const W = width - M * 2;
  const H = height - M * 2;
  if (W < 120 || H < 120) {
    homeCloud = null;
    return;
  }

  const rBase = constrain(min(W, H) * CLOUD_BUMP, 22, 80);
  const inset = rBase * 1.15 + 2;
  const A = W / 2 - inset;
  const B = H / 2 - inset;
  const cx = width / 2;
  const cy = height / 2;

  const N = 720;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const a = TWO_PI * i / N;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pts.push({
      x: cx + A * Math.sign(c) * Math.pow(Math.abs(c), 2 / CLOUD_SQUARE),
      y: cy + B * Math.sign(s) * Math.pow(Math.abs(s), 2 / CLOUD_SQUARE),
    });
  }

  const cum = [0];
  for (let i = 1; i <= N; i++) {
    const p = pts[i - 1];
    const q = pts[i % N];
    cum.push(cum[i - 1] + dist(p.x, p.y, q.x, q.y));
  }
  const total = cum[N];
  const count = max(8, round(total / (rBase * CLOUD_SPACING)));

  const bumps = [];
  let j = 0;
  for (let k = 0; k < count; k++) {
    const target = total * k / count;
    while (j < N - 1 && cum[j + 1] < target) j++;
    const seg = cum[j + 1] - cum[j];
    const f = seg > 0 ? (target - cum[j]) / seg : 0;
    const p = pts[j];
    const q = pts[(j + 1) % N];
    bumps.push({
      x: lerp(p.x, q.x, f),
      y: lerp(p.y, q.y, f),
      r: rBase * (0.88 + 0.27 * pr(11, k)),
    });
  }

homeCloud = {
  bumps: bumps, poly: pts, cx: cx, cy: cy,
  hx: A + rBase, hy: B + rBase,
  tx: cx - (A - rBase * 1.2), ty: cy - (B - rBase * 1.2),
  tw: 2 * (A - rBase * 1.2), th: 2 * (B - rBase * 1.2),
};
}

function drawHomeCloud() {
  if (!homeCloud) return;

  push();
  noStroke();

  fill(INK);
  for (const b of homeCloud.bumps) circle(b.x, b.y, (b.r + 2) * 2);

  fill(CLOUD_FILL);
  for (const b of homeCloud.bumps) circle(b.x, b.y, (b.r - 2) * 2);
  beginShape();
  for (const p of homeCloud.poly) vertex(p.x, p.y);
  endShape(CLOSE);

  pop();
}

function overCloud() {
  if (!homeCloud) return false;
  const c = homeCloud;
  return pow(abs(mouseX - c.cx) / c.hx, CLOUD_SQUARE) + pow(abs(mouseY - c.cy) / c.hy, CLOUD_SQUARE) <= 1;
}

function popCloud() {
  homeAlive = false;
  popAt = millis();
  popBits = [];
  for (let i = 0; i < 40; i++) {
    const b = homeCloud.bumps[floor(random(homeCloud.bumps.length))];
    const a = atan2(b.y - homeCloud.cy, b.x - homeCloud.cx) + random(-0.5, 0.5);
    popBits.push({ x: b.x, y: b.y, vx: cos(a) * random(2, 9), vy: sin(a) * random(2, 9), r: random(3, 9) });
  }
  ta.value = "";
  homeText = "";
  homeGood = "";
  ta.blur();
}

function homePressed() {
  if (!homeCloud) return false;
  for (let i = homeSaved.length - 1; i >= 0; i--) {
    const c = homeSaved[i];
    if (c.arrive) continue;
    const hw = max(homeCloud.hx * c.s * 1.2, 30);
    const hh = max(homeCloud.hy * c.s * 1.2, 24);
    if (pow(abs(mouseX - c.x) / hw, CLOUD_SQUARE) + pow(abs(mouseY - c.y) / hh, CLOUD_SQUARE) <= 1) {
      smallDrag = { c: c, ox: c.x - mouseX, oy: c.y - mouseY, moved: false };
      homeSaved.splice(i, 1);
      homeSaved.push(c);
      ta.blur();
      return false;
    }
  }
  if (!homeAlive || !overCloud()) {
    ta.blur();
    return false;
  }
  const now = millis();
  if (now - homeLastTap < HOME_DOUBLE_TAP) {
    homeLastTap = -99999;
    popCloud();
    return false;
  }
  homeLastTap = now;
  cloudPull = { x: mouseX, y: mouseY, active: false };
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);
  setTimeout(function () {
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }, 0);
  return false;
}

function drawHomeText() {
  const c = homeCloud;
  const fs = constrain(min(c.tw, c.th) * 0.05, 18, 34);
  const lh = fs * 1.5;
  const maxLines = max(1, floor(c.th / lh));

  push();
  textFont(KO_FONT);
  textSize(fs);
  textAlign(LEFT, TOP);

  let lines = wrapText(ta.value, c.tw);
  if (lines.length > maxLines) {
    ta.value = homeGood;
    ta.setSelectionRange(homeGood.length, homeGood.length);
    lines = wrapText(ta.value, c.tw);
  }
  homeGood = ta.value;

  noStroke();
  fill(INK);
  for (let k = 0; k < lines.length; k++) {
    text(lines[k].text, c.tx, c.ty + k * lh);
  }

  if (document.activeElement === ta && floor(millis() / 500) % 2 === 0) {
    const pos = min(ta.selectionStart, ta.value.length);
    let li = lines.length - 1;
    for (let k = 0; k < lines.length; k++) {
      const l = lines[k];
      const next = lines[k + 1];
      if (pos >= l.start && pos < l.end) { li = k; break; }
      if (pos === l.end && (!next || next.start > l.end)) { li = k; break; }
    }
    const l = lines[li];
    const caretX = c.tx + textWidth(l.text.substring(0, pos - l.start));
    stroke(INK);
    strokeWeight(2);
    line(caretX, c.ty + li * lh, caretX, c.ty + li * lh + fs * 1.2);
  }

  if (ta.value.length === 0 && document.activeElement !== ta) {
    noStroke();
    textAlign(CENTER, CENTER);
    fill(35, 32, 28, 110);
    textSize(fs * 0.7);
    text("한 번 누르면 쓰기 · 두 번 누르면 펑", c.cx, c.cy);
  }
  pop();
}

function drawPop(k) {
  const c = homeCloud;
  const a = 255 * (1 - k);
  const spread = 1 + k * 0.6;
  const shrink = 1 - k * 0.5;

  push();
  const ink = color(INK);
  ink.setAlpha(a);
  const paper = color(CLOUD_FILL);
  paper.setAlpha(a);
  noStroke();
  for (const b of c.bumps) {
    const x = c.cx + (b.x - c.cx) * spread;
    const y = c.cy + (b.y - c.cy) * spread;
    fill(ink);
    circle(x, y, (b.r + 2) * 2 * shrink);
    fill(paper);
    circle(x, y, (b.r - 2) * 2 * shrink);
  }
  for (const p of popBits) {
    const x = p.x + p.vx * k * 40;
    const y = p.y + p.vy * k * 40 + k * k * 80;
    fill(ink);
    circle(x, y, p.r * 2 * (1 - k));
  }
  pop();
}

function drawHome() {
  if (!homeCloud) return;
  const age = millis() - popAt;
  const c = homeCloud;

  if (!homeAlive) {
    if (savedOut) {
      if (age > SAVE_RESPAWN) {
        homeAlive = true;
        savedOut = false;
        homeText = "";
        homeGood = "";
        bornAt = millis();
      }
    } else if (age < POP_TIME) {
      drawPop(age / POP_TIME);
    } else if (HOME_RESPAWN >= 0 && age > POP_TIME + HOME_RESPAWN) {
      homeAlive = true;
      homeText = "";
      homeGood = "";
      bornAt = millis();
    }
  } else {
    if (!(cloudPull && cloudPull.active)) {
      cloudPullX = lerp(cloudPullX, 0, 0.25);
      cloudPullY = lerp(cloudPullY, 0, 0.25);
    }
    const g = ease(constrain((millis() - bornAt) / 500, 0, 1));
    const prog = constrain(-cloudPullY / PULL_SAVE, 0, 1);
    const sc = (0.6 + 0.4 * g) * lerp(1, 0.65, prog);

    push();
    translate(c.cx + cloudPullX, c.cy + cloudPullY);
    scale(sc);
    translate(-c.cx, -c.cy);
    drawingContext.globalAlpha = g;
    drawHomeCloud();
    drawHomeText();
    pop();

    if (cloudPull && cloudPull.active) {
      push();
      noStroke();
      fill(INK);
      textFont(KO_FONT);
      textSize(15);
      textAlign(CENTER, CENTER);
      text(prog >= 1 ? "놓으면 저장돼요" : "더 올리면 저장돼요", width / 2, 54);
      pop();
    }
  }

  updateSmallClouds();
  drawHomeSendZone();
  drawSmallClouds();
}
function cloudTextInfo() {
  const c = homeCloud;
  const fs = constrain(min(c.tw, c.th) * 0.05, 18, 34);
  const lh = fs * 1.5;
  push();
  textFont(KO_FONT);
  textSize(fs);
  const lines = wrapText(ta.value, c.tw);
  const bars = lines.map(function (l, k) {
    return { x: c.tx - c.cx, y: c.ty - c.cy + k * lh + fs * 0.6, w: textWidth(l.text) };
  });
  pop();
  return bars;
}

function saveCloud() {
  const c = homeCloud;
  const hw = c.hx * SMALL_SCALE;
  const hh = c.hy * SMALL_SCALE;
  const a = random(TWO_PI);
  homeSaved.push({
    text: ta.value,
    bars: cloudTextInfo(),
    sx: c.cx + cloudPullX,
    sy: c.cy + cloudPullY,
    s0: 0.65,
    s: 0.65,
    x: c.cx + cloudPullX,
    y: c.cy + cloudPullY,
    tx: random(min(HOME_SEND_ZONE + hw + 20, width / 2), max(width / 2, width - hw - 20)),
    ty: random(min(hh + 20, height / 2), max(height / 2, height - hh - 20)),
    t0: millis(),
    arrive: true,
    vx: cos(a) * SMALL_SPEED,
    vy: sin(a) * SMALL_SPEED,
  });
  ta.value = "";
  homeText = "";
  homeGood = "";
  ta.blur();
  homeAlive = false;
  savedOut = true;
  popAt = millis();
  cloudPull = null;
  cloudPullX = 0;
  cloudPullY = 0;
}

function updateSmallClouds() {
  if (cloudSending && !sendMenu) cloudSending = null;
  const f = constrain(deltaTime / 16.67, 0.5, 3);
  for (const c of homeSaved) {
    if (c.arrive) {
      const k = constrain((millis() - c.t0) / ARRIVE_MS, 0, 1);
      const e = ease(k);
      c.x = lerp(c.sx, c.tx, e);
      c.y = lerp(c.sy, c.ty, e);
      c.s = lerp(c.s0, SMALL_SCALE, e);
      if (k >= 1) c.arrive = false;
      continue;
    }
    if (c === cloudSending || (smallDrag && smallDrag.c === c)) continue;
    c.vx += random(-0.03, 0.03);
    c.vy += random(-0.03, 0.03);
    const sp = sqrt(c.vx * c.vx + c.vy * c.vy) || 1;
    c.vx = c.vx / sp * SMALL_SPEED;
    c.vy = c.vy / sp * SMALL_SPEED;
    c.x += c.vx * f;
    c.y += c.vy * f;
    const hw = homeCloud.hx * c.s;
    const hh = homeCloud.hy * c.s;
    if (c.x < hw + 10) { c.x = hw + 10; c.vx = abs(c.vx); }
    if (c.x > width - hw - 10) { c.x = width - hw - 10; c.vx = -abs(c.vx); }
    if (c.y < hh + 10) { c.y = hh + 10; c.vy = abs(c.vy); }
    if (c.y > height - hh - 10) { c.y = height - hh - 10; c.vy = -abs(c.vy); }
  }
}

function drawSmallCloud(c) {
  const hc = homeCloud;
  const s = c.s;
  const o = 1 + (s - SMALL_SCALE) / (1 - SMALL_SCALE);
  push();
  noStroke();
  fill(INK);
  for (const b of hc.bumps) {
    circle(c.x + (b.x - hc.cx) * s, c.y + (b.y - hc.cy) * s, (b.r * s + o) * 2);
  }
  fill(CLOUD_FILL);
  for (const b of hc.bumps) {
    circle(c.x + (b.x - hc.cx) * s, c.y + (b.y - hc.cy) * s, max(1, b.r * s - o) * 2);
  }
  beginShape();
  for (const p of hc.poly) vertex(c.x + (p.x - hc.cx) * s, c.y + (p.y - hc.cy) * s);
  endShape(CLOSE);
  stroke(35, 32, 28, 120);
  strokeWeight(max(1, 8 * s));
  strokeCap(ROUND);
  for (const bar of c.bars) {
    if (bar.w < 1) continue;
    line(c.x + bar.x * s, c.y + bar.y * s, c.x + (bar.x + bar.w) * s, c.y + bar.y * s);
  }
  pop();
}

function drawSmallClouds() {
  for (const c of homeSaved) drawSmallCloud(c);
}

function drawHomeSendZone() {
  if (!smallDrag || !smallDrag.moved) return;
  const z = HOME_SEND_ZONE;
  const prox = smooth01(mouseX, z + 280, z);
  const hot = mouseX < z;
  push();
  noStroke();
  fill(255, 233, 168, (hot ? 170 : 90) * prox);
  rect(0, 0, z, height);
  stroke(35, 32, 28, 120 * prox);
  strokeWeight(2);
  drawingContext.setLineDash([8, 8]);
  line(z, 0, z, height);
  drawingContext.setLineDash([]);
  noStroke();
  fill(35, 32, 28, 210 * prox);
  textFont(KO_FONT);
  textAlign(CENTER, CENTER);
  textSize(15);
  text("← 보내기", z / 2, height / 2);
  pop();
}

function homeDragged() {
  if (sendMenu) return false;
  if (smallDrag) {
    smallDrag.c.x = mouseX + smallDrag.ox;
    smallDrag.c.y = mouseY + smallDrag.oy;
    smallDrag.moved = true;
    return false;
  }
  if (cloudPull && homeAlive) {
    const dx = mouseX - cloudPull.x;
    const dy = mouseY - cloudPull.y;
    if (!cloudPull.active && dy < -PULL_START && abs(dy) > abs(dx)) {
      cloudPull.active = true;
      homeLastTap = -99999;
      ta.blur();
    }
    if (cloudPull.active) {
      cloudPullX = dx * 0.4;
      cloudPullY = min(0, dy);
    }
  }
  return false;
}

function homeReleased() {
  if (smallDrag) {
    const c = smallDrag.c;
    const moved = smallDrag.moved;
    smallDrag = null;
    if (moved && mouseX < HOME_SEND_ZONE) {
      cloudSending = c;
      sendMenu = { from: "home", source: "cloud", shake: -99999 };
    }
    return;
  }
  if (cloudPull) {
    const active = cloudPull.active;
    cloudPull = null;
    if (active && cloudPullY <= -PULL_SAVE) {
      if (ta.value.trim().length > 0) saveCloud();
      else showToast("빈 구름은 저장할 수 없어요");
    }
  }
}
function paperTop() {
  return current === "cafe" ? CAFE_PAPER_TOP : PAPER_TOP;
}

function paperRect() {
  const p = constrain((millis() - paperStart - PAPER_DELAY) / PAPER_TIME, 0, 1);
  const e = ease(p);

  const availH = height - paperTop();
  const w = min(availH / PAPER_RATIO, width - 80);
  const h = w * PAPER_RATIO;

  const x = (width - w) / 2;
  const finalY = height - h;
  const y = lerp(height, finalY, e);
  return { x: x, y: y, w: w, h: h, done: p >= 1, e: e };
}

function overPaper() {
  if (!isNotes(current) || phase !== "none") return false;
  const r = paperRect();
  return r.done && mouseX > r.x && mouseX < r.x + r.w &&
         mouseY > r.y && mouseY < r.y + r.h;
}

function blocked() {
  if (current === "cafe") return cafeDead || rebooting();
  if (current === "school") return !schoolOpen() || darkness > DARK_BLOCK;
  return false;
}

function savePage() {
  pages[pageIdx].text = ta.value;
  pages[pageIdx].strokes = strokes;
}

function loadPage(i) {
  pageIdx = i;
  ta.value = pages[i].text;
  strokes = pages[i].strokes;
  const n = ta.value.length;
  ta.setSelectionRange(n, n);
  lastGood = ta.value;
  lastSel = n;
  prevText = ta.value;
  shown = ta.value;
  currentStroke = null;
}

function removeCurrentPage() {
  pages.splice(pageIdx, 1);
  if (pages.length === 0) pages.push({ text: "", strokes: [] });
  loadPage(min(pageIdx, pages.length - 1));
}

function turnPage(i) {
  if (i < 0 || i >= pages.length || i === pageIdx) return;
  savePage();
  const dir = i > pageIdx ? "next" : "prev";
  const left = { text: ta.value, strokes: strokes };
  loadPage(i);
  flip = { dir: dir, other: left, start: millis() };
}

function flipping() {
  return flip !== null && millis() - flip.start < FLIP_TIME;
}

function pageNavBtn(which) {
  const cx = width / 2;
  return which === 0
    ? { x: cx - 80, y: 20, w: 28, h: 24 }
    : { x: cx + 52, y: 20, w: 28, h: 24 };
}

function overPageNav() {
  if (!isNotes(current) || phase !== "none") return -1;
  if (pageIdx > 0 && hitRect(pageNavBtn(0))) return 0;
  if (pageIdx < pages.length - 1 && hitRect(pageNavBtn(1))) return 1;
  return -1;
}

function drawPageNav() {
  push();
  for (let i = 0; i < 2; i++) {
    const b = pageNavBtn(i);
    const enabled = i === 0 ? pageIdx > 0 : pageIdx < pages.length - 1;
    const col = enabled ? color(INK) : color(35, 32, 28, 60);
    stroke(col);
    strokeWeight(4);
    noFill();
    rect(b.x, b.y, b.w, b.h);
    noStroke();
    fill(col);
    const mx = b.x + b.w / 2;
    const my = b.y + b.h / 2;
    if (i === 0) triangle(mx + 4, my - 6, mx + 4, my + 6, mx - 5, my);
    else triangle(mx - 4, my - 6, mx - 4, my + 6, mx + 5, my);
  }
  noStroke();
  fill(INK);
  textAlign(CENTER, CENTER);
  textSize(14);
  text((pageIdx + 1) + " / " + pages.length, width / 2, 32);
  pop();
}

function underPage() {
  if (pageIdx + 1 < pages.length) return pages[pageIdx + 1];
  if (pageIdx > 0) return pages[pageIdx - 1];
  return { text: "", strokes: [] };
}

function clearTear() {
  if (tear && tear.buf) tear.buf.remove();
  tear = null;
  fileShown = saved.length;
}

function renderSheetBuffer(g, txt, strokesArr, w, h, holes, ruled) {
  const sc = w / A4_WIDTH_PT;
  const margin = MARGIN_PT * sc;
  const lineH = LINE_PT * sc;
  const textW = w - margin * 2;
  const maxLines = floor((h - margin * 2) / lineH);

  g.clear();

  g.stroke(INK);
  g.strokeWeight(4);
  g.fill("#fffdf8");
  g.rect(2, 2, w - 4, h - 4);

  g.textFont(FONT_FAMILY);
  g.textSize(FONT_PT * sc);
  g.textAlign(LEFT, BASELINE);
  const lines = wrapText(txt, textW, g);

  if (ruled) {
    g.stroke(35, 32, 28, 40);
    g.strokeWeight(1);
    for (let k = 0; k < maxLines; k++) {
      const ly = margin + (k + 1) * lineH;
      g.line(margin, ly, w - margin, ly);
    }
  }

  g.noStroke();
  g.fill("#23201c");
  for (let k = 0; k < lines.length; k++) {
    const ly = margin + (k + 1) * lineH;
    g.text(lines[k].text, margin, ly - lineH * 0.3);
  }

  g.stroke(INK);
  g.strokeWeight(max(1.5, w * PENCIL_WIDTH));
  g.strokeCap(ROUND);
  g.strokeJoin(ROUND);
  g.noFill();
  for (const s of strokesArr) {
    if (s.length === 1) {
      g.point(s[0].x * w, s[0].y * h);
    } else {
      g.beginShape();
      for (const p of s) g.vertex(p.x * w, p.y * h);
      g.endShape();
    }
  }

  if (holes) {
    const gap = LINE_PT * 2 * sc;
    g.stroke("#8a857b");
    g.strokeWeight(1.5);
    g.fill(255);
    for (let y = gap * 0.75; y < h - gap * 0.5; y += gap) {
      g.circle(18 * sc, y, 10 * sc);
    }
  }
}

function makeCreases() {
  const creases = [];
  for (let i = 0; i < 16; i++) {
    const x1 = random();
    const y1 = random();
    const a = random(TWO_PI);
    const len = random(0.12, 0.4);
    creases.push({
      x1: x1, y1: y1,
      x2: constrain(x1 + cos(a) * len * 0.7, 0, 1),
      y2: constrain(y1 + sin(a) * len, 0, 1),
    });
  }
  return creases;
}

function startTear() {
  const r = paperRect();
  const bw = round(r.w);
  const bh = round(r.h);

  const buf = createGraphics(bw, bh);
  renderSheetBuffer(buf, ta.value, strokes, bw, bh, current !== "cafe", current !== "cafe" || CAFE_RULED);

  const cols = [];
  for (let i = 0; i <= FLUTTER_STRIPS; i++) cols.push({ w: 0, v: 0 });

  const creases = makeCreases();
  const blob = [];
  for (let i = 0; i < 14; i++) blob.push(random(0.82, 1.1));
  const ballLines = [];
  for (let i = 0; i < 9; i++) {
    const a1 = random(TWO_PI);
    const r1 = random(0.1, 0.8);
    const a2 = random(TWO_PI);
    const r2 = random(0.1, 0.8);
    ballLines.push({ x1: cos(a1) * r1, y1: sin(a1) * r1, x2: cos(a2) * r2, y2: sin(a2) * r2 });
  }

  tear = {
    phase: "drag",
    send: current === "cafe",
    px: pressPaper.x, py: pressPaper.y,
    ox: 0, oy: 0,
    tx: 0, ty: 0,
    rot: 0,
    vx: 0, vy: 0,
    lastX: mouseX, lastY: mouseY,
    spin: 0,
    buf: buf, bw: bw, bh: bh,
    cols: cols,
    crumple: 0,
    scBase: 1,
    sc: 1,
    sdx: 0, sdy: 0,
    lastShake: -9999,
    creases: creases, blob: blob, ballLines: ballLines,
    dim: 0,
    fold: 0,
    foldStart: 0,
    q: [],
    J: [{ x: 0, y: 0, r: 0 }],
    fjx: [], fjy: [],
    neat: 1, skew: 0, seed: floor(random(1, 1000)),
    pw: 60,
    press: null,
    deskSc: 1, dox: 0, doy: 0,
    fade: 1,
    packA: 0,
    ccx: 0, ccy: 0, csz: 40,
    cp: 0, sp: 0,
  };
  ta.blur();
  currentStroke = null;
  markActive();
}

function throwTornPage() {
  removeCurrentPage();

  tear.phase = "away";
  tear.vx = constrain(tear.vx * 0.8, -14, 14);
  tear.vy = max(tear.vy, 10);
  tear.spin = constrain(tear.vx * 0.004, -0.05, 0.05) + 0.012;
  markActive();
}

function dropBall() {
  removeCurrentPage();

  tear.phase = "drop";
  tear.vx = constrain(tear.vx * 0.6, -8, 8);
  tear.vy = max(tear.vy, 3);
  tear.spin = constrain(tear.vx * 0.01, -0.1, 0.1);
  markActive();
}

function toDesk() {
  const r = paperRect();
  tear.deskSc = min(0.9, height * 0.74 / r.h);
  const cx0 = r.x + r.w / 2;
  const cy0 = r.y + r.h / 2;
  tear.dox = width / 2 - tear.px - tear.deskSc * (cx0 - tear.px);
  tear.doy = (height / 2 + 10) - tear.py - tear.deskSc * (cy0 - tear.py);
  tear.phase = "toDesk";
  tear.fold = 0;
  tear.press = null;
  tear.vx = 0;
  tear.vy = 0;
}

function deskGeom(r) {
  const dw = r.w * tear.deskSc;
  const dh = r.h * tear.deskSc;
  const Cx = width / 2;
  const Cy = height / 2 + 10;
  return { dw: dw, dh: dh, Cx: Cx, Cy: Cy, x: Cx - dw / 2, y: Cy - dh / 2 };
}

function foldState(g, k) {
  const W = g.dw, H = g.dh;
  if (k === 0) return { x: g.Cx - W / 2, y: g.Cy - H / 2, w: W,     h: H };
  if (k === 1) return { x: g.Cx - W / 4, y: g.Cy - H / 2, w: W / 2, h: H };
  if (k === 2) return { x: g.Cx - W / 4, y: g.Cy - H / 4, w: W / 2, h: H / 2 };
  if (k === 3) return { x: g.Cx - W / 8, y: g.Cy - H / 4, w: W / 4, h: H / 2 };
  return            { x: g.Cx - W / 8, y: g.Cy - H / 8, w: W / 4, h: H / 4 };
}

function startFold(dx, dy) {
  const k = tear.fold;
  const sideways = (k % 2 === 0);
  const dev = degrees(sideways ? atan2(abs(dy), abs(dx)) : atan2(abs(dx), abs(dy)));
  const q = 1 - smooth01(dev, FOLD_GOOD_DEG, FOLD_BAD_DEG);
  const sl = 1 - q;

  tear.q.push(q);
  const J = tear.J[k];
  tear.J.push({
    x: J.x + (random() - 0.5) * 2 * sl * 14,
    y: J.y + (random() - 0.5) * 2 * sl * 14,
    r: constrain(J.r + (random() - 0.5) * 2 * sl * 0.12, -0.4, 0.4),
  });
  tear.fjx[k] = (random() - 0.5) * 2 * sl * 22;
  tear.fjy[k] = (random() - 0.5) * 2 * sl * 22;

  tear.phase = "folding";
  tear.foldStart = millis();
  currentStroke = null;
}

function startPacket() {
  const g = deskGeom(paperRect());
  const J = tear.J[FOLD_COUNT];
  let sum = 0;
  for (const v of tear.q) sum += v;
  tear.neat = tear.q.length > 0 ? sum / tear.q.length : 1;
  tear.seed = floor(random(1, 1000));
  tear.pw = g.dw / 4;
  tear.skew = J.r;
  tear.cx = g.Cx + J.x;
  tear.cy = g.Cy + J.y;
  tear.homeX = tear.cx;
  tear.homeY = tear.cy;
  tear.crot = 0;
  tear.cvx = 0;
  tear.cvy = 0;
  tear.cmx = mouseX;
  tear.cmy = mouseY;
  tear.phase = "packet";

  if (tear.neat > 0.7) showToast("각 맞춰 접었어요");
  else if (tear.neat < 0.4) showToast("대충 접었어요");
  else showToast("무난하게 접었어요");
}

function putBack() {
  tear.phase = "back";
  tear.fold = 0;
  tear.q = [];
  tear.J = [{ x: 0, y: 0, r: 0 }];
  tear.fjx = [];
  tear.fjy = [];
  tear.press = null;
}

function savePacket() {
  saved.push({
    text: ta.value, strokes: strokes,
    time: nf(hour(), 2) + ":" + nf(minute(), 2),
    neat: tear.neat, skew: tear.skew, seed: tear.seed, creases: makeCreases(),
  });
  removeCurrentPage();

  tear.phase = "packetSave";
  tear.p = 0;
  tear.sx = tear.cx;
  tear.sy = tear.cy;
  tear.ss = tear.pw;
  tear.srot = tear.crot;
  markActive();
}

function overPacket() {
  return tear && tear.phase === "packet" && dist(mouseX, mouseY, tear.cx, tear.cy) < tear.pw * 0.95;
}

function packetAimedAtFile() {
  if (!tear) return false;
  const f = fileRect();
  const dx = f.cx - mouseX;
  const dy = (f.pocketY - 10) - mouseY;
  const d = sqrt(dx * dx + dy * dy);
  if (d < 130) return true;

  const sp = sqrt(tear.cvx * tear.cvx + tear.cvy * tear.cvy);
  if (sp > 4 && d < 900) {
    const cosA = (tear.cvx * dx + tear.cvy * dy) / (sp * d);
    if (cosA > 0.92) return true;
  }
  return false;
}

function fileHot() {
  return current === "school" && tear && tear.phase === "packetDrag" && packetAimedAtFile();
}

function tearPressed() {
  if (mouseX > backBtn.x && mouseX < backBtn.x + backBtn.w &&
      mouseY > backBtn.y && mouseY < backBtn.y + backBtn.h) {
    goTo(null);
    return;
  }
  if (tear.phase === "packet" && overPacket()) {
    tear.phase = "packetDrag";
    tear.cvx = 0;
    tear.cvy = 0;
    tear.cmx = mouseX;
    tear.cmy = mouseY;
    tear.press = null;
    return false;
  }
  if (tear.phase === "desk" || tear.phase === "packet") {
    tear.press = { x: mouseX, y: mouseY, moved: false };
  }
  return false;
}

function sendZoneX() {
  const r = paperRect();
  return constrain(r.x - 20, 70, 150);
}

function drawSendZone() {
  if (!tear || tear.phase !== "drag" || tear.crumple >= 1) return;
  if (!(current === "school" || current === "cafe")) return;

  const z = sendZoneX();
  const prox = smooth01(mouseX, z + 280, z);
  const hot = mouseX < z;

  push();
  noStroke();
  fill(255, 233, 168, (hot ? 170 : 90) * prox);
  rect(0, 0, z, height);

  stroke(35, 32, 28, 120 * prox);
  strokeWeight(2);
  drawingContext.setLineDash([8, 8]);
  line(z, 0, z, height);
  drawingContext.setLineDash([]);

  noStroke();
  fill(35, 32, 28, 210 * prox);
  textFont(KO_FONT);
  textAlign(CENTER, CENTER);
  textSize(15);
  text("← 보내기", z / 2, height / 2);
  pop();
}

function startToPacket() {
  const r = paperRect();
  const sct = 0.3;
  const T = { x: width / 2, y: height / 2 - 90 };
  const cx0 = r.x + r.w / 2;
  const cy0 = r.y + r.h / 2;

  tear.phase = "toPacket";
  tear.cp = 0;
  tear.ox0 = tear.ox;
  tear.oy0 = tear.oy;
  tear.rot0 = tear.rot;
  tear.sc0 = tear.scBase;
  tear.sct = sct;
  tear.tox = T.x - tear.px - sct * (cx0 - tear.px);
  tear.toy = T.y - tear.py - sct * (cy0 - tear.py);
  tear.vx = 0;
  tear.vy = 0;
}

function sendDests() {
  if (current === "home") return ["cafe", "school"];
  return current === "cafe" ? ["school", "home"] : ["cafe", "home"];
}

function sendLabel(d) {
  if (d === "cafe") return "카페로 보내기";
  if (d === "school") return "학교로 보내기";
  return "집으로 보내기 (준비 중)";
}

function sendMenuRect() {
  return { x: width / 2 - 170, y: height / 2 - 10, w: 340, h: 176 };
}

function sendBtnRect(i) {
  const p = sendMenuRect();
  return { x: p.x + 20, y: p.y + 58 + i * 56, w: p.w - 40, h: 44 };
}

function overSendBtn() {
  if (!sendMenu) return -1;
  for (let i = 0; i < 2; i++) if (hitRect(sendBtnRect(i))) return i;
  return -1;
}

function drawSendMenu() {
  if (!sendMenu) return;
  const p = sendMenuRect();
  const dests = sendDests();

  push();
  textFont(KO_FONT);
  stroke(INK);
  strokeWeight(4);
  fill("#fffdf8");
  rect(p.x, p.y, p.w, p.h);

  noStroke();
  fill(INK);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(17);
  text("어디로 보낼까요?", p.x + p.w / 2, p.y + 30);
  textStyle(NORMAL);

  for (let i = 0; i < 2; i++) {
    const b = sendBtnRect(i);
    const enabled = dests[i] !== "home";
    const hov = enabled && hitRect(b);
    const age = millis() - sendMenu.shake;
    const sh = (!enabled && age < 400) ? sin(age * 0.05) * 5 * (1 - age / 400) : 0;

    stroke(enabled ? color(INK) : color(160));
    strokeWeight(3);
    fill(enabled ? (hov ? color("#f1ede4") : color("#fffdf8")) : color(228, 226, 221));
    rect(b.x + sh, b.y, b.w, b.h);

    noStroke();
    fill(enabled ? color(INK) : color(150));
    textSize(15);
    text(sendLabel(dests[i]), b.x + sh + b.w / 2, b.y + b.h / 2);
  }

  fill(255, 215);
  textSize(12);
  text("바깥을 누르면 취소돼요", width / 2, p.y + p.h + 18);
  pop();
}

function sendMenuPressed() {
  const dests = sendDests();
  for (let i = 0; i < 2; i++) {
    if (hitRect(sendBtnRect(i))) {
      if (dests[i] === "home") sendMenu.shake = millis();
      else doSend(dests[i]);
      return false;
    }
  }
  if (!hitRect(sendMenuRect())) cancelSend();
  return false;
}

function cancelSend() {
  if (sendMenu && sendMenu.source === "tear" && tear && tear.phase === "sendChoose") tear.phase = "back";
  cloudSending = null;
  sendMenu = null;
}

function makeBagItem(text, strokesArr, fromPlace) {
  const stains = [];
  for (let i = 0; i < 10; i++) {
    stains.push({
      x: random(0.1, 0.9), y: random(0.08, 0.92),
      r: random(0.035, 0.1), a: random(0.5, 1),
      k: random(0, 0.85),
    });
  }
  bagCount++;
  return {
    text: text, strokes: strokesArr, from: fromPlace,
    n: bagCount, time: nf(hour(), 2) + ":" + nf(minute(), 2),
    wear: 0, used: ++useSeq, stains: stains, creases: makeCreases(),
    neat: 0.85, skew: (random() - 0.5) * 0.06, seed: floor(random(1, 1000)),
  };
}

function bagList(place) {
  return (bag[place] || []).slice().sort(function (a, b) { return a.used - b.used; });
}

function wearLevel(it) {
  return constrain(it.wear / WEAR_MAX_OPENS, 0, 1);
}

function showToast(msg) {
  toast = { text: msg, at: millis() };
}

function drawToast() {
  const age = millis() - toast.at;
  if (age < 0 || age > 2600) return;
  const a = 1 - smooth01(age, 2000, 2600);
  const g = smooth01(age, 0, 180);

  push();
  textFont(KO_FONT);
  textSize(15);
  textStyle(BOLD);
  const w = textWidth(toast.text) + 44;
  translate(width / 2, 84 - (1 - g) * 10);
  drawingContext.globalAlpha = a * g;
  stroke(INK);
  strokeWeight(3);
  fill("#fffdf8");
  rect(-w / 2, -18, w, 36, 18);
  noStroke();
  fill(INK);
  textAlign(CENTER, CENTER);
  text(toast.text, 0, 0);
  pop();
}

function doSend(dest) {
  const fromPlace = current;
  const msg = dest === "cafe" ? "카페로 보냈어요" : "학교로 보냈어요";
    if (sendMenu.source === "cloud") {
    const c = cloudSending;
    if (c) {
      bag[dest].push(makeBagItem(c.text, [], "home"));
      homeSaved.splice(homeSaved.indexOf(c), 1);
    }
    cloudSending = null;
    sendMenu = null;
    showToast(msg);
    return;
  }

  if (sendMenu.source === "tear") {
    const item = makeBagItem(ta.value, strokes, fromPlace);
    bag[dest].push(item);
    removeCurrentPage();

    tear.phase = "sendAway";
    tear.sp = 0;
    tear.csx = tear.ccx;
    tear.csy = tear.ccy;
    tear.fade = 0;
    tear.packA = 1;
    markActive();
  } else {
    const list = bagList(current);
    const item = list[viewing];
    if (item) {
      bag[current].splice(bag[current].indexOf(item), 1);
      item.wear++;
      item.from = fromPlace;
      item.used = ++useSeq;
      bag[dest].push(item);
    }
    viewing = -1;
    viewPress = null;
    viewDrag = 0;
  }

  sendMenu = null;
  showToast(msg);
}

function bagRect() {
  const r = paperRect();
  const w = 104;
  const h = 118;
  const leftEdge = current === "cafe" ? r.x - 30 : r.x - 44;
  const cx = constrain(leftEdge / 2, w / 2 + 12, max(w / 2 + 12, leftEdge - w / 2 - 8));
  const by = height - 26 + (1 - r.e) * 170;
  return { x: cx - w / 2, y: by - h, w: w, h: h, cx: cx, by: by };
}

function overBag() {
  return (current === "school" || current === "cafe") && phase === "none" && hitRect(bagRect());
}

function drawBag() {
  const b = bagRect();
  const items = (bag[current] || []).slice(-3);
  const n = (bag[current] || []).length;
  const show = items.length;

  push();
  noFill();
  stroke(INK);
  strokeWeight(3);
  arc(b.cx, b.y + 34, 52, 50, PI, TWO_PI);

  for (let i = 0; i < show; i++) {
    const off = i - (show - 1) / 2;
    const it = items[i];
    drawPacket(b.cx + off * 26, b.y + 26 - (i % 2) * 6, 19, off * 0.2, it.skew, it.neat, 1, it.seed);
  }

  stroke(INK);
  strokeWeight(3);
  fill("#c9a77c");
  rect(b.x + 4, b.y + 34, b.w - 8, b.h - 34, 10);

  fill("#b58a58");
  rect(b.x + 4, b.y + 34, b.w - 8, 36, 10, 10, 3, 3);

  fill("#efe2a8");
  strokeWeight(2.5);
  rect(b.cx - 9, b.y + 60, 18, 16, 3);

  if (n > 0) {
    noStroke();
    fill("#d9453d");
    circle(b.x + b.w - 6, b.y + 40, 22);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(11);
    text(min(n, 99), b.x + b.w - 6, b.y + 40);
  }
  pop();

  push();
  noStroke();
  fill(35, 32, 28, 130);
  textAlign(CENTER, CENTER);
  textSize(10);
  text("Bag", b.cx, b.by + 12);
  pop();
}

function drawWear(r, it, wl) {
  push();

  noStroke();
  fill(170, 135, 80, 70 * wl);
  rect(r.x + 3, r.y + 3, r.w - 6, r.h - 6);
  noFill();
  stroke(110, 80, 40, 40 * wl);
  strokeWeight(14);
  rect(r.x + 9, r.y + 9, r.w - 18, r.h - 18);

  for (const s of it.stains) {
    if (s.k > wl) continue;
    const a = constrain((wl - s.k) * 4, 0, 1) * s.a;
    const cx = r.x + s.x * r.w;
    const cy = r.y + s.y * r.h;
    const rad = s.r * r.w;
    noStroke();
    fill(120, 80, 40, 38 * a);
    ellipse(cx, cy, rad * 2.1, rad * 1.8);
    noFill();
    stroke(110, 70, 35, 90 * a);
    strokeWeight(2);
    ellipse(cx, cy, rad * 1.9, rad * 1.6);
    noStroke();
    fill(90, 60, 30, 25 * a);
    ellipse(cx + rad * 0.2, cy, rad * 0.8, rad * 0.6);
  }

  const nC = ceil(wl * it.creases.length);
  const wlw = max(1.2, r.w * 0.003);
  for (let i = 0; i < nC; i++) {
    const c = it.creases[i];
    const x1 = r.x + c.x1 * r.w;
    const y1 = r.y + c.y1 * r.h;
    const x2 = r.x + c.x2 * r.w;
    const y2 = r.y + c.y2 * r.h;
    stroke(255, 255, 255, 130);
    strokeWeight(wlw);
    line(x1 + wlw, y1 + wlw, x2 + wlw, y2 + wlw);
    stroke(35, 32, 28, 90);
    strokeWeight(wlw);
    line(x1, y1, x2, y2);
  }
  pop();
}

function drawFoldCreases(r, it) {
  const sl = 1 - (it.neat === undefined ? 1 : it.neat);
  const seed = it.seed || 1;
  const lw = max(1, r.w * 0.0025);

  push();
  noFill();
  const xs = [0.25, 0.5, 0.75];
  const ys = [0.25, 0.5, 0.75];
  for (let i = 0; i < 3; i++) {
    const px = xs[i] + (pr(seed, 20 + i) - 0.5) * sl * 0.12;
    const lean = (pr(seed, 23 + i) - 0.5) * sl * 0.08;
    const topX = r.x + (px + lean) * r.w;
    const botX = r.x + (px - lean) * r.w;
    stroke(255, 255, 255, 130);
    strokeWeight(lw);
    line(topX + lw, r.y, botX + lw, r.y + r.h);
    stroke(35, 32, 28, 55);
    line(topX, r.y, botX, r.y + r.h);

    const py = ys[i] + (pr(seed, 30 + i) - 0.5) * sl * 0.12;
    const tilt = (pr(seed, 33 + i) - 0.5) * sl * 0.06;
    const leftY = r.y + (py + tilt) * r.h;
    const rightY = r.y + (py - tilt) * r.h;
    stroke(255, 255, 255, 130);
    line(r.x, leftY + lw, r.x + r.w, rightY + lw);
    stroke(35, 32, 28, 55);
    line(r.x, leftY, r.x + r.w, rightY);
  }

  const nC = ceil(sl * 12);
  for (let i = 0; i < nC && it.creases && i < it.creases.length; i++) {
    const c = it.creases[i];
    const x1 = r.x + c.x1 * r.w;
    const y1 = r.y + c.y1 * r.h;
    const x2 = r.x + c.x2 * r.w;
    const y2 = r.y + c.y2 * r.h;
    stroke(255, 255, 255, 110);
    strokeWeight(lw);
    line(x1 + lw, y1 + lw, x2 + lw, y2 + lw);
    stroke(35, 32, 28, 70);
    line(x1, y1, x2, y2);
  }
  pop();
}

function updateFlutter(r) {
  const N = tear.cols.length - 1;
  const f = constrain(deltaTime / 16.67, 0.5, 1.2);
  const gu = constrain((tear.px - r.x) / r.w, 0, 1);
  const gi = round(gu * N);
  const lim = r.w * 0.05;

  const dz = function (v) { return abs(v) < 2 ? 0 : v - 2 * Math.sign(v); };
  const sy = dz(tear.vy);
  const sx = dz(tear.vx);

  for (let i = 0; i <= N; i++) {
    const c = tear.cols[i];
    const u = i / N;
    const d = abs(u - gu);

    let drive = 0;
    if (tear.phase !== "back") {
      drive = (-sy * 0.3 + sin(millis() * 0.012 + u * 6) * abs(sx) * 0.1) * d * FLUTTER_STRENGTH;
    }

    const left = tear.cols[max(0, i - 1)].w;
    const right = tear.cols[min(N, i + 1)].w;

    const force = -0.18 * c.w + 0.12 * (left + right - 2 * c.w) - 0.3 * c.v + drive * 0.15;

    c.v += force * f;
    c.w = constrain(c.w + c.v * f, -lim, lim);
  }

  tear.cols[gi].w = 0;
  tear.cols[gi].v = 0;
}

function updateTear() {
  if (!tear) return;
  const f = constrain(deltaTime / 16.67, 0.5, 3);
  const dt = min(deltaTime, 100) / 1000;
  const r = paperRect();
  const ph = tear.phase;
  const deskish = ph === "toDesk" || ph === "desk" || ph === "folding" ||
                  ph === "packet" || ph === "packetDrag" || ph === "toPacket" || ph === "sendChoose";

  if (ph === "drag") {
    const rdx = mouseX - tear.lastX;
    const rdy = mouseY - tear.lastY;
    if (sqrt(rdx * rdx + rdy * rdy) > 4) {
      if (!tear.send && tear.sdx * rdx + tear.sdy * rdy < 0 && tear.crumple < 1) {
        tear.crumple = min(1, tear.crumple + CRUMPLE_STEP);
        tear.lastShake = millis();
      }
      tear.sdx = rdx;
      tear.sdy = rdy;
    }
    if (tear.crumple < 1 && millis() - tear.lastShake > 400) {
      tear.crumple = max(0, tear.crumple - CRUMPLE_DECAY * dt);
    }

    tear.tx = mouseX - tear.px;
    tear.ty = mouseY - tear.py;
    tear.ox = lerp(tear.ox, tear.tx, 0.4);
    tear.oy = lerp(tear.oy, tear.ty, 0.4);
    const targetRot = constrain(tear.ox / r.w * 0.4 + tear.oy / r.h * 0.15, -0.4, 0.6);
    tear.rot = lerp(tear.rot, targetRot, 0.3);

    tear.vx = lerp(tear.vx, mouseX - tear.lastX, 0.5);
    tear.vy = lerp(tear.vy, mouseY - tear.lastY, 0.5);
    tear.lastX = mouseX;
    tear.lastY = mouseY;
    markActive();
  } else if (ph === "back") {
    tear.ox = lerp(tear.ox, 0, 0.25);
    tear.oy = lerp(tear.oy, 0, 0.25);
    tear.rot = lerp(tear.rot, 0, 0.25);
    tear.scBase = lerp(tear.scBase, 1, 0.25);
    tear.crumple = lerp(tear.crumple, 0, 0.2);
    if (tear.crumple < 0.01) tear.crumple = 0;
    tear.fade = lerp(tear.fade, 1, 0.2);
    tear.packA = lerp(tear.packA, 0, 0.2);
    tear.vx = 0;
    tear.vy = 0;
    let calm = true;
    for (const c of tear.cols) if (abs(c.w) > 1) calm = false;
    if (abs(tear.ox) < 0.5 && abs(tear.oy) < 0.5 && abs(tear.rot) < 0.01 &&
        abs(tear.scBase - 1) < 0.003 && tear.crumple === 0 && calm &&
        abs(tear.fade - 1) < 0.02 && tear.packA < 0.02) {
      clearTear();
      return;
    }
  } else if (ph === "away") {
    tear.ox += tear.vx * f;
    tear.oy += tear.vy * f;
    tear.vy += 1.1 * f;
    tear.rot += tear.spin * f;
    if (tear.oy > height) {
      clearTear();
      return;
    }
  } else if (ph === "drop") {
    tear.ox += tear.vx * f;
    tear.oy += tear.vy * f;
    tear.vy += 1.3 * f;
    tear.rot += tear.spin * f;
    if (tear.py + tear.oy > height + 80) {
      clearTear();
      return;
    }
  } else if (ph === "toDesk") {
    tear.crumple = lerp(tear.crumple, 0, 0.2);
    if (tear.crumple < 0.01) tear.crumple = 0;
    tear.ox = lerp(tear.ox, tear.dox, 0.2);
    tear.oy = lerp(tear.oy, tear.doy, 0.2);
    tear.rot = lerp(tear.rot, 0, 0.2);
    tear.scBase = lerp(tear.scBase, tear.deskSc, 0.2);
    tear.vx = 0;
    tear.vy = 0;
    if (abs(tear.ox - tear.dox) < 0.6 && abs(tear.oy - tear.doy) < 0.6 && abs(tear.rot) < 0.005 &&
        abs(tear.scBase - tear.deskSc) < 0.002 && tear.crumple === 0) {
      tear.ox = tear.dox;
      tear.oy = tear.doy;
      tear.rot = 0;
      tear.scBase = tear.deskSc;
      tear.phase = "desk";
    }
  } else if (ph === "folding") {
    if ((millis() - tear.foldStart) / FOLD_TIME >= 1) {
      tear.fold++;
      if (tear.fold >= FOLD_COUNT) startPacket();
      else tear.phase = "desk";
    }
  } else if (ph === "packet" || ph === "packetDrag") {
    if (ph === "packetDrag") {
      tear.cvx = lerp(tear.cvx, mouseX - tear.cmx, 0.5);
      tear.cvy = lerp(tear.cvy, mouseY - tear.cmy, 0.5);
      tear.cmx = mouseX;
      tear.cmy = mouseY;
      tear.cx = lerp(tear.cx, mouseX, 0.4);
      tear.cy = lerp(tear.cy, mouseY, 0.4);
      tear.crot = lerp(tear.crot, constrain(tear.cvx * 0.03, -0.45, 0.45), 0.2);
    } else {
      tear.cx = lerp(tear.cx, tear.homeX, 0.15);
      tear.cy = lerp(tear.cy, tear.homeY, 0.15);
      tear.crot = lerp(tear.crot, 0, 0.15);
    }
  } else if (ph === "packetSave") {
    tear.p += dt / PACKET_SAVE_TIME;
    const p = min(1, tear.p);
    const fr = fileRect();
    const slot = max(0, min(saved.length, FILE_SLOTS) - 1);
    const sx2 = fileSlotX(fr, slot);
    const mx = sx2, my = fr.pocketY - 46;
    const ix = sx2, iy = fr.pocketY - 10;
    if (p < 0.6) {
      const q = ease(p / 0.6);
      tear.cx = lerp(tear.sx, mx, q);
      tear.cy = lerp(tear.sy, my, q);
      tear.pw = lerp(tear.ss, 20, q);
      tear.crot = lerp(tear.srot, 0, q);
    } else {
      const q = (p - 0.6) / 0.4;
      tear.cx = lerp(mx, ix, q * q);
      tear.cy = lerp(my, iy, q * q);
      tear.pw = 20;
    }
    if (tear.p >= 1) {
      fileBump = millis();
      clearTear();
      return;
    }
  } else if (ph === "toPacket") {
    tear.cp += dt / 0.55;
    const p = min(1, tear.cp);
    const e2 = ease(p);
    tear.ox = lerp(tear.ox0, tear.tox, e2);
    tear.oy = lerp(tear.oy0, tear.toy, e2);
    tear.rot = lerp(tear.rot0, 0, e2);
    tear.scBase = lerp(tear.sc0, tear.sct, e2);
    tear.crumple = lerp(tear.crumple, 0, 0.2);
    if (tear.crumple < 0.01) tear.crumple = 0;
    tear.fade = 1 - smooth01(p, 0.15, 0.7);
    tear.packA = smooth01(p, 0.35, 0.9);
    tear.vx = 0;
    tear.vy = 0;
    if (p >= 1) {
      tear.phase = "sendChoose";
      sendMenu = { from: current, source: "tear", shake: -99999 };
    }
  } else if (ph === "sendChoose") {
    tear.fade = 0;
    tear.packA = 1;
  } else if (ph === "sendAway") {
    tear.sp += dt / 0.8;
    const p = min(1, tear.sp);
    const e2 = p * p;
    tear.ccx = lerp(tear.csx, -160, e2);
    tear.ccy = tear.csy - 60 * sin(p * PI * 0.9);
    if (p >= 1) {
      clearTear();
      return;
    }
  }

  if (deskish) markActive();
  tear.dim = lerp(tear.dim, deskish ? 1 : 0, 0.12);

  tear.sc = tear.scBase * lerp(1, BALL_SCALE, ease(tear.crumple));

  const strips = tear.phase === "drag" || tear.phase === "back" || tear.phase === "away" ||
                 tear.phase === "drop" || tear.phase === "toDesk" || tear.phase === "toPacket";
  if (strips) updateFlutter(r);

  const baseSz = r.w * 0.15;
  if (tear.phase === "sendAway") {
    tear.csz = baseSz * lerp(1, 0.55, min(1, tear.sp));
  } else {
    tear.ccx = tear.px + tear.ox + tear.sc * (r.x + r.w / 2 - tear.px);
    tear.ccy = tear.py + tear.oy + tear.sc * (r.y + r.h / 2 - tear.py);
    tear.csz = baseSz;
  }
}

function drawTornSheet(r) {
  if (!tear || !tear.buf) return;

  if (tear.phase === "desk" || tear.phase === "folding" || tear.phase === "packet" ||
      tear.phase === "packetDrag" || tear.phase === "packetSave") {
    drawDeskThing(r);
    return;
  }

  if (tear.dim > 0.01) {
    push();
    noStroke();
    fill(0, 60 * tear.dim);
    rect(0, 0, width, height);
    pop();
  }

  const N = tear.cols.length - 1;
  const buf = tear.buf;
  const pd = buf.pixelDensity();
  const sliceW = tear.bw / N;
  const ctx = drawingContext;
  const c = tear.crumple;
  const sheetA = (1 - smooth01(c, 0.55, 0.9)) * tear.fade;
  const ballA = smooth01(c, 0.55, 0.9);

  if (sheetA > 0.01) {
    const ws = tear.cols.map(function (cc) { return cc.w; });
    const dys = [];
    const dws = [];
    for (let i = 0; i < N; i++) {
      const dy = constrain(ws[i + 1] - ws[i], -0.9 * sliceW, 0.9 * sliceW);
      dys.push(dy);
      dws.push(sqrt(sliceW * sliceW - dy * dy));
    }

    const gu = constrain((tear.px - r.x) / r.w, 0, 1);
    const gi = round(gu * N);
    const xs = [r.x];
    for (let i = 0; i < N; i++) xs.push(xs[i] + dws[i]);
    const shiftX = (r.x + gi * sliceW) - xs[gi];
    for (let i = 0; i <= N; i++) xs[i] += shiftX;

    push();
    ctx.globalAlpha = sheetA;
    translate(tear.px + tear.ox, tear.py + tear.oy);
    rotate(tear.rot + sin(millis() * 0.03) * 0.05 * c);
    scale(tear.sc);
    translate(-tear.px, -tear.py);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = -4;
    ctx.fillStyle = "#fffdf8";
    ctx.beginPath();
    ctx.moveTo(xs[0], r.y + ws[0]);
    for (let i = 1; i <= N; i++) ctx.lineTo(xs[i], r.y + ws[i]);
    for (let i = N; i >= 0; i--) ctx.lineTo(xs[i], r.y + tear.bh + ws[i]);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    for (let i = 0; i < N; i++) {
      const slope = dys[i] / dws[i];

      ctx.save();
      ctx.translate(xs[i], r.y + ws[i]);
      ctx.transform(1, slope, 0, 1, 0, 0);
      ctx.drawImage(buf.elt, i * sliceW * pd, 0, sliceW * pd, tear.bh * pd,
                    0, 0, dws[i] + 1, tear.bh);

      const amount = min(0.3, abs(dys[i]) / sliceW * 0.5);
      ctx.fillStyle = dys[i] > 0 ? "rgba(0,0,0," + amount + ")"
                                 : "rgba(255,255,255," + (amount * 0.6) + ")";
      ctx.fillRect(0, 0, dws[i] + 1, tear.bh);
      ctx.restore();
    }

    if (c > 0.02) {
      const a = min(1, c * 1.4);
      const wl = 1.5 / max(tear.sc, 0.25);
      noStroke();
      fill(0, 22 * a);
      rect(r.x, r.y, tear.bw, tear.bh);
      for (const cr of tear.creases) {
        const x1 = r.x + cr.x1 * tear.bw;
        const y1 = r.y + cr.y1 * tear.bh;
        const x2 = r.x + cr.x2 * tear.bw;
        const y2 = r.y + cr.y2 * tear.bh;
        stroke(255, 255, 255, 150 * a);
        strokeWeight(wl);
        line(x1 + wl, y1 + wl, x2 + wl, y2 + wl);
        stroke(35, 32, 28, 120 * a);
        strokeWeight(wl);
        line(x1, y1, x2, y2);
      }
    }
    pop();
  }

  if (ballA > 0.01) {
    const R = r.w * 0.075;
    push();
    ctx.globalAlpha = ballA;
    translate(tear.px + tear.ox + sin(millis() * 0.04) * 2 * c, tear.py + tear.oy);
    rotate(tear.rot);

    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    fill("#f3efe6");
    stroke(INK);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < tear.blob.length; i++) {
      const ang = TWO_PI * i / tear.blob.length;
      const rr = R * tear.blob[i];
      vertex(cos(ang) * rr, sin(ang) * rr);
    }
    endShape(CLOSE);

    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    stroke(35, 32, 28, 120);
    strokeWeight(1.6);
    noFill();
    for (const l of tear.ballLines) line(l.x1 * R, l.y1 * R, l.x2 * R, l.y2 * R);

    noStroke();
    fill(255, 255, 255, 120);
    ellipse(-R * 0.3, -R * 0.3, R * 0.7, R * 0.5);
    pop();
  }

  if (tear.packA > 0.01) {
    const bob = tear.phase === "sendChoose" ? sin(millis() * 0.003) * 4 : 0;
    if (tear.phase !== "sendAway") {
      push();
      noStroke();
      fill(0, 30 * tear.packA);
      ellipse(tear.ccx, tear.ccy + tear.csz * 0.8, tear.csz * 1.3, tear.csz * 0.2);
      pop();
    }
    drawPacket(tear.ccx, tear.ccy + bob, tear.csz, tear.phase === "sendAway" ? -0.35 : 0, 0, 0.85, tear.packA, tear.seed);
  }
}

function ctxPaperRect(ctx, x, y, w, h, col, withShadow) {
  ctx.save();
  if (withShadow) {
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
  }
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, h);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function ctxPaperPoly(ctx, pts, col) {
  ctx.save();
  ctx.fillStyle = col;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawFoldGuide(s, k) {
  const sideways = (k % 2 === 0);
  const pulse = 0.55 + 0.35 * sin(millis() * 0.006);
  const cx = s.x + s.w / 2;
  const cy = s.y + s.h / 2;
  const len = min(120, (sideways ? s.w : s.h) * 0.45);

  push();
  stroke(35, 32, 28, 140);
  strokeWeight(2);
  drawingContext.setLineDash([8, 8]);
  if (sideways) line(cx, s.y - 14, cx, s.y + s.h + 14);
  else line(s.x - 14, cy, s.x + s.w + 14, cy);
  drawingContext.setLineDash([]);

  stroke(35, 32, 28, 255 * pulse);
  fill(35, 32, 28, 255 * pulse);
  strokeWeight(3);
  if (sideways) {
    line(cx + len / 2, cy, cx - len / 2 + 6, cy);
    triangle(cx - len / 2, cy, cx - len / 2 + 14, cy - 8, cx - len / 2 + 14, cy + 8);
  } else {
    line(cx, cy + len / 2, cx, cy - len / 2 + 6);
    triangle(cx, cy - len / 2, cx - 8, cy - len / 2 + 14, cx + 8, cy - len / 2 + 14);
  }
  pop();
}

function drawDeskThing(r) {
  const ctx = drawingContext;
  const g = deskGeom(r);

  push();
  noStroke();
  fill(0, 60 * tear.dim);
  rect(0, 0, width, height);
  pop();

  if (tear.phase === "packet" || tear.phase === "packetDrag" || tear.phase === "packetSave") {
    const bob = tear.phase === "packet" ? sin(millis() * 0.003) * 3 : 0;
    if (tear.phase !== "packetSave") {
      push();
      noStroke();
      fill(0, 30);
      ellipse(tear.cx, tear.cy + tear.pw * 0.8, tear.pw * 1.3, tear.pw * 0.2);
      pop();
    }
    drawPacket(tear.cx, tear.cy + bob, tear.pw, tear.crot, tear.skew, tear.neat, 1, tear.seed);
    return;
  }

  const k = tear.fold;
  const anim = tear.phase === "folding";
  const e = anim ? ease(constrain((millis() - tear.foldStart) / FOLD_TIME, 0, 1)) : 0;
  const buf = tear.buf;
  const iw = buf.elt.width;
  const ih = buf.elt.height;
  const s = foldState(g, k);

  const J0 = tear.J[k];
  const J1 = tear.J[min(k + 1, tear.J.length - 1)];
  const Jt = anim ? { x: lerp(J0.x, J1.x, e), y: lerp(J0.y, J1.y, e), r: lerp(J0.r, J1.r, e) } : J0;

  ctx.save();
  ctx.translate(g.Cx + Jt.x, g.Cy + Jt.y);
  ctx.rotate(Jt.r);
  ctx.translate(-g.Cx, -g.Cy);

  if (!anim) {
    if (k === 0) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 26;
      ctx.shadowOffsetY = 8;
      ctx.drawImage(buf.elt, 0, 0, iw, ih, s.x, s.y, s.w, s.h);
      ctx.restore();
    } else {
      ctxPaperRect(ctx, s.x, s.y, s.w, s.h, PAPER_FRONT, true);
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      if (k % 2 === 1) ctx.fillRect(s.x + s.w - 10, s.y, 10, s.h);
      else ctx.fillRect(s.x, s.y + s.h - 10, s.w, 10);
      ctx.restore();
    }
    if (tear.phase === "desk") drawFoldGuide(s, k);
  } else {
    const sideways = (k % 2 === 0);
    const ang = e * Math.PI;
    const c = Math.cos(ang);
    const sn = Math.sin(ang);
    const fx = Math.sin(e * Math.PI) * (tear.fjx[k] || 0);
    const fy = Math.sin(e * Math.PI) * (tear.fjy[k] || 0);

    if (sideways) {
      const hw = s.w / 2;
      const hx = s.x + hw;

      ctx.save();
      ctx.translate(hw / 2 * e, 0);

      if (k === 0) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 8;
        ctx.drawImage(buf.elt, 0, 0, iw / 2, ih, s.x, s.y, hw, s.h);
        ctx.restore();
      } else {
        ctxPaperRect(ctx, s.x, s.y, hw, s.h, PAPER_FRONT, true);
      }

      ctx.save();
      ctx.translate(fx, fy);
      if (c > 0.02) {
        const w = hw * c;
        if (k === 0) ctx.drawImage(buf.elt, iw / 2, 0, iw / 2, ih, hx, s.y, w, s.h);
        else ctxPaperRect(ctx, hx, s.y, w, s.h, PAPER_FRONT, false);
        ctx.fillStyle = "rgba(0,0,0," + (0.18 * (1 - c)) + ")";
        ctx.fillRect(hx, s.y, w, s.h);
      } else if (c < -0.02) {
        const w = hw * (-c);
        const lift = 12 * sn;
        ctxPaperPoly(ctx, [[hx, s.y], [hx - w, s.y - lift], [hx - w, s.y + s.h + lift], [hx, s.y + s.h]], PAPER_BACK);
      }
      ctx.restore();
      ctx.restore();
    } else {
      const hh = s.h / 2;
      const hy = s.y + hh;

      ctx.save();
      ctx.translate(0, hh / 2 * e);
      ctxPaperRect(ctx, s.x, s.y, s.w, hh, PAPER_FRONT, true);

      ctx.save();
      ctx.translate(fx, fy);
      if (c > 0.02) {
        const h = hh * c;
        ctxPaperRect(ctx, s.x, hy, s.w, h, PAPER_FRONT, false);
        ctx.fillStyle = "rgba(0,0,0," + (0.16 * (1 - c)) + ")";
        ctx.fillRect(s.x, hy, s.w, h);
      } else if (c < -0.02) {
        const h = hh * (-c);
        const lift = 10 * sn;
        ctxPaperPoly(ctx, [[s.x, hy], [s.x + s.w, hy], [s.x + s.w + lift, hy - h], [s.x - lift, hy - h]], PAPER_BACK);
      }
      ctx.restore();
      ctx.restore();
    }
  }
  ctx.restore();
}

function roughRect(x, y, w, h, jit, seed) {
  const pts = [
    [x, y], [x + w / 2, y], [x + w, y],
    [x + w, y + h / 2], [x + w, y + h],
    [x + w / 2, y + h], [x, y + h], [x, y + h / 2],
  ];
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    vertex(pts[i][0] + (pr(seed, i * 2) - 0.5) * 2 * jit,
           pts[i][1] + (pr(seed, i * 2 + 1) - 0.5) * 2 * jit);
  }
  endShape(CLOSE);
}

function drawPacket(cx, cy, w, rot, skew, neat, alpha, seed) {
  const h = w * PAPER_RATIO;
  const sl = 1 - neat;
  const jit = sl * w * 0.07;

  push();
  translate(cx, cy);
  rotate(rot + skew);
  drawingContext.globalAlpha = alpha;
  strokeJoin(ROUND);
  stroke(INK);
  strokeWeight(max(1.5, w / 36));

  for (let i = 2; i >= 1; i--) {
    fill(i === 2 ? "#e2dac6" : "#ebe5d6");
    const ox = i * w * 0.035 + (pr(seed, 10 + i) - 0.5) * sl * w * 0.3;
    const oy = i * w * 0.035 + (pr(seed, 14 + i) - 0.5) * sl * w * 0.3;
    roughRect(-w / 2 + ox, -h / 2 + oy, w, h, jit, seed + i);
  }

  fill(PAPER_FRONT);
  roughRect(-w / 2, -h / 2, w, h, jit, seed);

  noFill();
  stroke(35, 32, 28, 70);
  strokeWeight(max(1, w / 60));
  if (sl < 0.15) {
    line(w / 2 - w * 0.12, -h / 2 + 3, w / 2 - w * 0.12, h / 2 - 3);
    line(-w / 2 + 3, h / 2 - h * 0.1, w / 2 - 3, h / 2 - h * 0.1);
  } else {
    const nC = 2 + floor(sl * 4);
    for (let i = 0; i < nC; i++) {
      const x1 = (pr(seed, 20 + i * 4) - 0.5) * w * 0.85;
      const y1 = (pr(seed, 21 + i * 4) - 0.5) * h * 0.85;
      const x2 = x1 + (pr(seed, 22 + i * 4) - 0.5) * w * 0.7;
      const y2 = y1 + (pr(seed, 23 + i * 4) - 0.5) * h * 0.5;
      line(x1, y1, x2, y2);
    }
  }
  pop();
}

function markActive() {
  idleSince = millis();
  if (darkness <= DARK_BLOCK) darkness = 0;
}

function updateIdle() {
  if (!isNotes(current) || phase !== "none") return;

  if (viewing >= 0) idleSince = millis();

  if (ta.value !== prevText && !blocked()) {
    prevText = ta.value;
    markActive();
  }

  if (current === "school" && schoolOpen() && millis() - idleSince > IDLE_OPTIONS[idleIdx] * 1000) {
    darkness = min(MAX_DARK, darkness + deltaTime / (FADE_SEC * 1000));
  }
}

function drawSleepyCover() {
  if (darkness <= 0) return;

  push();
  noStroke();
  fill(0, darkness * 255);
  rect(0, 0, width, height);

  if (darkness > 0.3) {
    const a = constrain(map(darkness, 0.3, 0.7, 0, 220), 0, 220);
    fill(255, a);
    textAlign(CENTER, CENTER);
    textSize(constrain(width * 0.05, 28, 48));
    text("Zzz...", width / 2, height / 2 - 20);
    textSize(16);
    text("Press and shake the screen to wake up", width / 2, height / 2 + 24);
  }
  pop();
}

function schoolOpen() {
  if (SCHOOL_TEST === "open") return true;
  if (SCHOOL_TEST === "closed") return false;
  const h = hour();
  return h >= SCHOOL_OPEN_HOUR && h < SCHOOL_CLOSE_HOUR;
}

function notebookRect(r) {
  const x = r.x - 30;
  const y = r.y - STACK_SHEETS * STACK_OFF_Y - 4;
  return { x: x, y: y, w: r.w + 30 + STACK_SHEETS * STACK_OFF_X + 8, h: height - y + 10 };
}

function overNotebook() {
  if (current !== "school" || phase !== "none") return false;
  const nb = notebookRect(paperRect());
  return mouseX > nb.x && mouseX < nb.x + nb.w && mouseY > nb.y && mouseY < nb.y + nb.h;
}

function updateSchool() {
  if (current !== "school" || phase !== "none") return;
  if (!schoolOpen() && document.activeElement === ta) ta.blur();
}

function drawSchoolClosed() {
  if (current !== "school" || schoolOpen()) return;
  const r = paperRect();
  const nb = notebookRect(r);

  push();
  noStroke();
  fill(105, 108, 114, 150);
  rect(nb.x, nb.y, nb.w, nb.h);

  const age = millis() - schoolMsgAt;
  if (age >= 0 && age < SCHOOL_MSG_TIME) {
    const a = 1 - smooth01(age, SCHOOL_MSG_TIME - 600, SCHOOL_MSG_TIME);
    const grow = 0.94 + 0.06 * smooth01(age, 0, 160);
    const bw = min(360, width - 40);
    const bh = 120;

    drawingContext.globalAlpha = a;
    translate(width / 2, height / 2);
    scale(grow);

    stroke(INK);
    strokeWeight(4);
    fill("#fffdf8");
    rect(-bw / 2, -bh / 2, bw, bh);

    noStroke();
    fill(INK);
    textFont(KO_FONT);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(constrain(bw * 0.075, 20, 28));
    text("내일 다시 오십시오", 0, -14);
    textStyle(NORMAL);
    textSize(14);
    fill(35, 32, 28, 170);
    text("운영 시간 " + nf(SCHOOL_OPEN_HOUR, 2) + ":00 – " + nf(SCHOOL_CLOSE_HOUR, 2) + ":00", 0, 28);
  }
  pop();
}

function rebooting() {
  return millis() - rebootAt < REBOOT_MS;
}

function holdProgress() {
  if (powerHold < 0 || !mouseIsPressed) return 0;
  return constrain((millis() - powerHold) / FORCE_HOLD_MS, 0, 1);
}

function forceQuit() {
  ta.blur();
  currentStroke = null;
  settingsOpen = false;
  filesOpen = false;
  closeViewer();
  sendMenu = null;
  flip = null;
  removeCurrentPage();
  rebootAt = millis();
}

function updateCafe() {
  if (current !== "cafe" || phase !== "none") return;
  const dt = min(deltaTime, 100) / 1000;
  const sipping = drinking && mouseIsPressed && coffee > 0.001;

  if (powerHold >= 0) {
    if (!mouseIsPressed) {
      powerHold = -1;
    } else {
      idleSince = millis();
      if (holdProgress() >= 1) {
        powerHold = -1;
        forceQuit();
      }
    }
  }

  if (sipping) {
    coffee = max(0, coffee - COFFEE_USE * dt);
    caffeine = min(1, caffeine + SIP_RATE * dt);
    idleSince = millis();
  } else {
    coffee = min(1, coffee + COFFEE_REFILL * dt);
    if (millis() - idleSince > IDLE_OPTIONS[idleIdx] * 1000) {
      caffeine = max(0, caffeine - dt / DRAIN_SEC);
    }
  }
  sipAnim = lerp(sipAnim, sipping ? 1 : 0, 0.18);

  if (caffeine <= 0.001) cafeDead = true;
  else if (cafeDead && caffeine >= WAKE_AT) cafeDead = false;
}

function updateLag() {
  const v = ta.value;
  if (current !== "cafe" || caffeine >= LOW_POWER || cafeDead) { shown = v; return; }
  if (!v.startsWith(shown)) { shown = v; return; }
  if (shown.length < v.length) {
    const lag = lerp(LAG_FAST, LAG_SLOW, 1 - constrain(caffeine / LOW_POWER, 0, 1));
    if (millis() - lastShow > lag) {
      shown = v.substring(0, shown.length + 1);
      lastShow = millis();
    }
  }
}

function batteryColor(level) {
  if (level > 0.4) return color("#4caf6a");
  if (level > LOW_POWER) return color("#f0a030");
  return color("#d9453d");
}

function drawBattery(x, y, w, h, level, col, sw, bolt) {
  push();
  stroke(col);
  strokeWeight(sw);
  noFill();
  rect(x, y, w, h);

  noStroke();
  fill(col);
  rect(x + w + 1.5, y + h * 0.3, max(2, w * 0.08), h * 0.4);

  let c = batteryColor(level);
  if (level < LOW_POWER && floor(millis() / 400) % 2 === 0) c = color(217, 69, 61, 90);
  fill(c);
  const pad = sw + 1.5;
  rect(x + pad, y + pad, max(0, (w - pad * 2) * level), h - pad * 2);

  if (bolt) {
    fill(col);
    const cx = x + w / 2;
    beginShape();
    vertex(cx + 2, y + pad);
    vertex(cx - w * 0.14, y + h * 0.55);
    vertex(cx, y + h * 0.55);
    vertex(cx - 2, y + h - pad);
    vertex(cx + w * 0.14, y + h * 0.45);
    vertex(cx, y + h * 0.45);
    endShape(CLOSE);
  }
  pop();
}

function cafeScreen(r) {
  return { x: r.x - 30, y: r.y - 74, w: r.w + 60 };
}

function drawCafeScreen(r) {
  const s = cafeScreen(r);
  const sh = height - s.y + 30;
  const ui = "Helvetica, Arial, sans-serif";

  push();
  drawingContext.shadowColor = "rgba(0,0,0,0.25)";
  drawingContext.shadowBlur = 24;
  drawingContext.shadowOffsetY = -4;
  stroke(INK);
  strokeWeight(4);
  fill("#c9d3dc");
  rect(s.x, s.y, s.w, sh);
  pop();

  push();
  textFont(ui);

  noStroke();
  fill("#f4f2ee");
  rect(s.x + 2, s.y + 2, s.w - 4, 24);
  stroke(35, 32, 28, 70);
  strokeWeight(1);
  line(s.x + 2, s.y + 26, s.x + s.w - 2, s.y + 26);

  noStroke();
  fill(INK);
  circle(s.x + 18, s.y + 14, 9);
  textAlign(LEFT, CENTER);
  textSize(12);
  textStyle(BOLD);
  text("Docs", s.x + 32, s.y + 14);
  textStyle(NORMAL);
  text("File    Edit    View", s.x + 72, s.y + 14);

  textAlign(RIGHT, CENTER);
  const clock = nf(hour(), 2) + ":" + nf(minute(), 2);
  text(clock, s.x + s.w - 12, s.y + 14);

  const bx = s.x + s.w - 12 - 34 - 34;
  drawBattery(bx, s.y + 8, 26, 12, caffeine, color(INK), 1.5, sipAnim > 0.5);
  noStroke();
  fill(INK);
  textAlign(RIGHT, CENTER);
  textSize(12);
  const pct = round(caffeine * 100) + "%";
  text(pct, bx - 8, s.y + 14);
  const pw = textWidth(pct);
  textSize(11);
  fill(35, 32, 28, 150);
  text("Caffeine", bx - 8 - pw - 8, s.y + 14);

  const wx = r.x - 14;
  const wy = r.y - 44;
  const ww = r.w + 28;
  stroke(INK);
  strokeWeight(3);
  fill("#e4e2de");
  rect(wx, wy, ww, height - wy + 30);

  noStroke();
  fill("#f1efeb");
  rect(wx + 1.5, wy + 1.5, ww - 3, 28);
  stroke(35, 32, 28, 70);
  strokeWeight(1);
  line(wx + 1.5, wy + 30, wx + ww - 1.5, wy + 30);

  noStroke();
  fill("#ff5f57");
  circle(wx + 16, wy + 15, 10);
  fill("#febc2e");
  circle(wx + 32, wy + 15, 10);
  fill("#28c840");
  circle(wx + 48, wy + 15, 10);
  fill(INK);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Untitled.docx", wx + ww / 2, wy + 15);
  pop();
}

function drawCafeOverlay(r) {
  const s = cafeScreen(r);
  const top = s.y + 26;
  const ui = "Helvetica, Arial, sans-serif";
  const lowPower = caffeine < LOW_POWER && !cafeDead;

  push();
  noStroke();
  textFont(ui);

  if (lowPower) {
    fill(0, (1 - caffeine / LOW_POWER) * 110);
    rect(s.x + 2, top, s.w - 4, height - top + 40);

    const bw = min(210, s.w - 24);
    const bh = 52;
    const bx = s.x + s.w - bw - 12;
    const by = top + 10;
    stroke(INK);
    strokeWeight(3);
    fill("#fffdf8");
    rect(bx, by, bw, bh);
    noStroke();
    fill(INK);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(13);
    text("Low Power Mode", bx + 12, by + 18);
    textStyle(NORMAL);
    textSize(11);
    text("Hold the coffee cup to charge", bx + 12, by + 35);
  }

  if (cafeDead) {
    fill(8, 8, 10, 245);
    rect(s.x + 2, top, s.w - 4, height - top + 40);

    const cx = s.x + s.w / 2;
    const cy = top + min(190, (height - top) / 2);
    drawBattery(cx - 46, cy - 24, 92, 44, caffeine, color(255), 3, sipAnim > 0.5);

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(22);
    text("Out of battery", cx, cy + 56);
    textSize(14);
    fill(255, 170);
    text("Hold the coffee cup to charge", cx, cy + 84);
  }

  const hp = holdProgress();
  if (hp > 0 && !rebooting()) {
    noStroke();
    fill(0, hp * 150);
    rect(s.x + 2, s.y + 2, s.w - 4, height - s.y + 40);
    if (hp > 0.25) {
      fill(255, 220);
      textAlign(CENTER, CENTER);
      textSize(16);
      text("Force quitting...", s.x + s.w / 2, s.y + min(190, (height - s.y) / 2));
    }
  }

  if (rebooting()) {
    const pr2 = constrain((millis() - rebootAt) / REBOOT_MS, 0, 1);
    const cx = s.x + s.w / 2;
    const cy = s.y + min(190, (height - s.y) / 2);
    noStroke();
    fill(8, 8, 10);
    rect(s.x + 2, s.y + 2, s.w - 4, height - s.y + 40);

    fill(255);
    circle(cx, cy - 20, 38);
    fill(70);
    rect(cx - 60, cy + 24, 120, 5);
    fill(255);
    rect(cx - 60, cy + 24, 120 * pr2, 5);

    textAlign(CENTER, CENTER);
    textSize(15);
    fill(255);
    text("Document closed unexpectedly", cx, cy + 54);
    textSize(12);
    fill(255, 150);
    text("Unsaved changes were lost.", cx, cy + 76);
  }
  pop();
}

function cupPos() {
  const r = paperRect();
  const laptopRight = r.x + r.w + 30;
  const x = constrain((laptopRight + width) / 2, 56, width - 56);
  return { x: x, y: height - 44 + (1 - r.e) * 160 };
}

function overCup() {
  if (current !== "cafe" || phase !== "none") return false;
  const c = cupPos();
  return mouseX > c.x - 46 && mouseX < c.x + 46 && mouseY > c.y - 74 && mouseY < c.y + 12;
}

function drawCup() {
  const c = cupPos();

  push();
  stroke(INK);
  strokeWeight(4);
  fill("#fffdf8");
  rect(c.x - 40, c.y, 80, 7);

  translate(c.x, c.y);
  rotate(-sipAnim * 0.45);

  if (coffee > 0.05) {
    noFill();
    stroke(35, 32, 28, 70 + sipAnim * 60);
    strokeWeight(2);
    for (let i = -1; i <= 1; i++) {
      beginShape();
      for (let k = 0; k <= 6; k++) {
        vertex(i * 11 + sin(millis() * 0.004 + k * 0.9 + i * 2) * 3, -60 - k * 6);
      }
      endShape();
    }
  }

  stroke(INK);
  strokeWeight(4);
  fill("#fffdf8");
  quad(-29, -52, 29, -52, 22, 0, -22, 0);

  if (coffee > 0.03) {
    const sy = -4 - coffee * 44;
    const hw = function (y) { return 29 - 7 * ((y + 52) / 52) - 4; };
    noStroke();
    fill("#5b3a21");
    quad(-hw(sy), sy, hw(sy), sy, hw(-4), -4, -hw(-4), -4);
  }

  noFill();
  stroke(INK);
  strokeWeight(4);
  arc(30, -26, 26, 26, -HALF_PI, HALF_PI);
  pop();

  push();
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  const need = caffeine < 0.35;
  fill(35, 32, 28, need ? 150 + 90 * sin(millis() * 0.008) : 130);
  text(coffee < 0.03 ? "Refilling..." : "Hold to sip", c.x, c.y + 22);
  pop();
}

function powerBtn() {
  return toolBtn(1);
}

function overPowerBtn() {
  return current === "cafe" && phase === "none" && hitRect(powerBtn());
}

function drawPowerBtn() {
  const b = powerBtn();
  const prog = holdProgress();

  push();
  stroke(INK);
  strokeWeight(4);
  fill("#fffdf8");
  rect(b.x, b.y, b.w, b.h);

  if (prog > 0) {
    noStroke();
    fill("#d9453d");
    const hh = (b.h - 6) * prog;
    rect(b.x + 3, b.y + b.h - 3 - hh, b.w - 6, hh);
  }

  translate(b.x + b.w / 2, b.y + b.h / 2);
  noFill();
  stroke(prog > 0.5 ? color(255) : color(INK));
  strokeWeight(3);
  arc(0, 1, 18, 18, -HALF_PI + 0.65, -HALF_PI + TWO_PI - 0.65, OPEN);
  line(0, -11, 0, -2);
  pop();

  push();
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(10);
  fill(35, 32, 28, prog > 0 ? 200 : 130);
  text(prog > 0 ? "Keep holding..." : "Force quit", b.x + b.w / 2, b.y + b.h + 10);
  pop();
}

function toolBtn(i) {
  return {
    x: width - 20 - TOOL_SIZE,
    y: 20 + i * (TOOL_SIZE + TOOL_GAP),
    w: TOOL_SIZE,
    h: TOOL_SIZE,
  };
}

function hitRect(b) {
  return mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h;
}

function overToolBtn() {
  if (!isNotes(current) || phase !== "none") return -1;
  const n = toolList().length;
  for (let i = 0; i < n; i++) {
    if (hitRect(toolBtn(i))) return i;
  }
  return -1;
}

function settingsBtn() {
  return toolBtn(toolList().length);
}

function overSettingsBtn() {
  return isNotes(current) && phase === "none" && hitRect(settingsBtn());
}

function settingsPanel() {
  const w = 230, h = 130;
  return { x: width - 20 - TOOL_SIZE - 12 - w, y: 20, w: w, h: h };
}

function minusBtn() {
  const p = settingsPanel();
  return { x: p.x + 16, y: p.y + 62, w: 44, h: 44 };
}

function plusBtn() {
  const p = settingsPanel();
  return { x: p.x + p.w - 16 - 44, y: p.y + 62, w: 44, h: 44 };
}

function overSettingsUI() {
  if (!isNotes(current) || phase !== "none") return false;
  if (overSettingsBtn()) return true;
  return settingsOpen && (hitRect(minusBtn()) || hitRect(plusBtn()));
}

function idleLabel(sec) {
  return sec < 60 ? sec + " sec" : (sec / 60) + " min";
}

function drawToolIcon(b, i, selected) {
  const bg = selected ? INK : "#fffdf8";
  const fg = selected ? "#fffdf8" : INK;

  stroke(INK);
  strokeWeight(4);
  fill(bg);
  rect(b.x, b.y, b.w, b.h);

  push();
  translate(b.x + b.w / 2, b.y + b.h / 2);
  noStroke();
  fill(fg);
  if (i === 0) {
    beginShape();
    vertex(-7, -12);
    vertex(-7, 10);
    vertex(-2, 6);
    vertex(1, 13);
    vertex(5, 11);
    vertex(2, 5);
    vertex(8, 5);
    endShape(CLOSE);
  } else if (i === 1) {
    rotate(QUARTER_PI);
    rect(-4, -14, 8, 18);
    triangle(-4, 4, 4, 4, 0, 13);
    stroke(bg);
    strokeWeight(1.5);
    line(-4, -9, 4, -9);
  } else {
    rotate(-QUARTER_PI);
    rect(-6, -10, 12, 20);
    stroke(bg);
    strokeWeight(1.5);
    line(-6, 2, 6, 2);
  }
  pop();
}

function drawToolButtons() {
  const list = toolList();
  for (let i = 0; i < list.length; i++) {
    drawToolIcon(toolBtn(i), i, tool === list[i]);
  }
}

function drawSettings() {
  const b = settingsBtn();
  const bg = settingsOpen ? INK : "#fffdf8";
  const fg = settingsOpen ? "#fffdf8" : INK;
  stroke(INK);
  strokeWeight(4);
  fill(bg);
  rect(b.x, b.y, b.w, b.h);

  push();
  translate(b.x + b.w / 2, b.y + b.h / 2);
  noFill();
  stroke(fg);
  strokeWeight(3);
  circle(0, 0, 16);
  for (let k = 0; k < 8; k++) {
    rotate(PI / 4);
    line(0, -9, 0, -14);
  }
  pop();

  if (!settingsOpen) return;

  const p = settingsPanel();
  stroke(INK);
  strokeWeight(4);
  fill("#fffdf8");
  rect(p.x, p.y, p.w, p.h);

  noStroke();
  fill(INK);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(current === "cafe" ? "Idle time before battery drains" : "Idle time before the screen dims",
       p.x + p.w / 2, p.y + 28);

  textSize(20);
  text(idleLabel(IDLE_OPTIONS[idleIdx]), p.x + p.w / 2, p.y + 84);

  const m = minusBtn();
  const pl = plusBtn();
  const canMinus = idleIdx > 0;
  const canPlus = idleIdx < IDLE_OPTIONS.length - 1;

  stroke(INK);
  strokeWeight(3);
  fill("#fffdf8");
  rect(m.x, m.y, m.w, m.h);
  rect(pl.x, pl.y, pl.w, pl.h);

  stroke(canMinus ? INK : color(35, 32, 28, 60));
  strokeWeight(3);
  line(m.x + 14, m.y + m.h / 2, m.x + m.w - 14, m.y + m.h / 2);

  stroke(canPlus ? INK : color(35, 32, 28, 60));
  line(pl.x + 14, pl.y + pl.h / 2, pl.x + pl.w - 14, pl.y + pl.h / 2);
  line(pl.x + pl.w / 2, pl.y + 14, pl.x + pl.w / 2, pl.y + pl.h - 14);
}

function fileRect() {
  const r = paperRect();
  const w = 118;
  const h = 150;
  const left = r.x + r.w + 34;
  const cx = constrain((left + width) / 2, w / 2 + 12, width - w / 2 - 20);
  const by = height - 26 + (1 - r.e) * 170;
  return { x: cx - w / 2, y: by - h, w: w, h: h, cx: cx, by: by, pocketY: by - h + 64 };
}

function overFile() {
  return current === "school" && phase === "none" && hitRect(fileRect());
}

function fileSlotX(f, i) {
  return f.x + 26 + i * ((f.w - 52) / (FILE_SLOTS - 1));
}

function drawFile() {
  const f = fileRect();
  const hot = fileHot();
  const bump = constrain(1 - (millis() - fileBump) / 450, 0, 1);
  const grow = hot ? 1.08 : 1 + 0.08 * sin(bump * PI);
  const count = min(fileShown, saved.length);
  const first = max(0, count - FILE_SLOTS);

  push();
  translate(f.cx, f.by);
  scale(grow);
  translate(-f.cx, -f.by);

  stroke(INK);
  strokeWeight(3);
  fill(hot ? "#f0d37e" : "#cfae6c");
  rect(f.x + 10, f.y + 2, 44, 18, 4, 4, 0, 0);
  rect(f.x, f.y + 14, f.w, f.h - 14, 4);

  for (let i = first; i < count; i++) {
    const it = saved[i];
    const slot = i - first;
    const sl = 1 - it.neat;
    const px = fileSlotX(f, slot);
    const py = f.pocketY - 10 - pr(it.seed, 40) * sl * 8;
    const rot = (pr(it.seed, 41) - 0.5) * sl * 0.9;
    drawPacket(px, py, 20, rot, it.skew * 0.5, it.neat, 1, it.seed);
  }

  stroke(INK);
  strokeWeight(3);
  fill(hot ? "#f7e2a0" : "#e6cd94");
  rect(f.x, f.pocketY, f.w, f.by - f.pocketY, 4);

  fill("#fffdf8");
  strokeWeight(2);
  rect(f.cx - 30, f.pocketY + 24, 60, 28, 3);
  noStroke();
  fill(INK);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Notes", f.cx, f.pocketY + 38);

  if (fileShown > 0) {
    fill("#d9453d");
    circle(f.x + f.w - 6, f.y + 22, 22);
    fill(255);
    textSize(11);
    text(min(fileShown, 99), f.x + f.w - 6, f.y + 22);
  }
  pop();
}

function curList() {
  return listKind === "bag" ? bagList(current) : saved;
}

function viewList() {
  return viewKind === "bag" ? bagList(current) : saved;
}

function filePanel() {
  const list = curList();
  const rows = max(1, min(FILE_ROWS, list.length));
  const w = 270;
  const h = list.length === 0 ? 100 : rows * 52 + 54;
  if (listKind === "bag") {
    const b = bagRect();
    return { x: constrain(b.cx - w / 2, 12, max(12, width - w - 12)), y: max(70, b.y - h - 14), w: w, h: h };
  }
  return { x: width - 20 - TOOL_SIZE - 12 - w, y: 20, w: w, h: h };
}

function fileRowRect(k) {
  const p = filePanel();
  return { x: p.x + 12, y: p.y + 48 + k * 52, w: p.w - 24, h: 46 };
}

function overFileRow() {
  if (!filesOpen || !(current === "school" || current === "cafe") || phase !== "none") return -1;
  const list = curList();
  const n = min(FILE_ROWS, list.length - fileScroll);
  for (let k = 0; k < n; k++) {
    if (hitRect(fileRowRect(k))) return list.length - 1 - (fileScroll + k);
  }
  return -1;
}

function previewOf(it) {
  const first = it.text.split("\n").find(function (s) { return s.trim().length > 0; });
  if (first) {
    const s = first.trim();
    return s.length > 24 ? s.substring(0, 24) + "…" : s;
  }
  return it.strokes.length > 0 ? "(drawing)" : "(blank page)";
}

function fromLabel(it) {
  if (it.from === "school") return "School";
  if (it.from === "home") return "Home";
  return "Cafe";
}

function neatLabel(it) {
  if (it.neat > 0.7) return "neat";
  if (it.neat < 0.4) return "messy";
  return "ok";
}

function drawFilePanel() {
  if (!filesOpen) return;
  const p = filePanel();
  const list = curList();
  const isBag = listKind === "bag";

  push();
  stroke(INK);
  strokeWeight(4);
  fill("#fffdf8");
  rect(p.x, p.y, p.w, p.h);

  noStroke();
  fill(INK);
  textAlign(LEFT, CENTER);
  textSize(14);
  text((isBag ? "Bag (" : "File (") + list.length + ")", p.x + 16, p.y + 24);

  if (list.length === 0) {
    textSize(13);
    fill(35, 32, 28, 150);
    text("Nothing here yet.", p.x + 16, p.y + 54);
    text(isBag ? "Send a page from the other place." : "Fold a torn page four times.", p.x + 16, p.y + 74);
    pop();
    return;
  }

  if (list.length > FILE_ROWS) {
    textAlign(RIGHT, CENTER);
    textSize(11);
    fill(35, 32, 28, 140);
    text("(scroll)", p.x + p.w - 16, p.y + 24);
    textAlign(LEFT, CENTER);
  }

  const n = min(FILE_ROWS, list.length - fileScroll);
  for (let k = 0; k < n; k++) {
    const idx = list.length - 1 - (fileScroll + k);
    const it = list[idx];
    const rr = fileRowRect(k);
    const hov = hitRect(rr);

    stroke(INK);
    strokeWeight(3);
    fill(hov ? "#f1ede4" : "#fffdf8");
    rect(rr.x, rr.y, rr.w, rr.h);

    noStroke();
    fill(INK);
    textSize(13);
    textAlign(LEFT, CENTER);
    if (isBag) text("Page " + it.n + "  ·  from " + fromLabel(it), rr.x + 10, rr.y + 15);
    else text("Page " + (idx + 1) + "  ·  " + it.time, rr.x + 10, rr.y + 15);
    textSize(12);
    fill(35, 32, 28, 150);
    text(previewOf(it), rr.x + 10, rr.y + 33);

    textAlign(RIGHT, CENTER);
    textSize(11);
    if (isBag) text("opened " + it.wear + "×", rr.x + rr.w - 10, rr.y + 15);
    else text(neatLabel(it), rr.x + rr.w - 10, rr.y + 15);
  }
  pop();
}

function viewerRect() {
  const h = min(height - 110, (width - 60) * PAPER_RATIO);
  const w = h / PAPER_RATIO;
  return { x: (width - w) / 2, y: 70, w: w, h: h };
}

function viewerCloseBtn() {
  return { x: width - 20 - 90, y: 20, w: 90, h: 30 };
}

function closeViewer() {
  if (viewing >= 0 && viewKind === "bag") {
    const it = bagList(current)[viewing];
    if (it) {
      it.wear++;
      it.used = ++useSeq;
    }
  }
  viewing = -1;
  viewPress = null;
  viewDrag = 0;
}

function drawHoles(r) {
  const sc = r.w / A4_WIDTH_PT;
  const gap = LINE_PT * 2 * sc;
  push();
  stroke("#8a857b");
  strokeWeight(1.5);
  fill(255);
  for (let y = r.y + gap * 0.75; y < r.y + r.h - gap * 0.5; y += gap) {
    circle(r.x + 18 * sc, y, 10 * sc);
  }
  pop();
}

function drawViewer() {
  const list = viewList();
  if (viewing < 0 || viewing >= list.length) return;
  const it = list[viewing];
  const bagView = viewKind === "bag";
  const r = viewerRect();
  const ve = ease(constrain((millis() - viewAt) / 450, 0, 1));
  const midY = r.y + r.h / 2;
  const wl = bagView ? wearLevel(it) : 0;

  push();
  noStroke();
  fill(0, 165);
  rect(0, 0, width, height);
  pop();

  push();
  translate(viewDrag, 0);

  push();
  translate(width / 2, midY);
  scale(0.25 + 0.75 * ve);
  rotate((1 - ve) * -0.5);
  translate(-width / 2, -midY);
  drawingContext.globalAlpha = 0.2 + 0.8 * ve;
  sheetFade = wl;
  drawSheet(r, it.text, it.strokes, 1, false, 0);
  sheetFade = 0;
  if (!bagView || it.from === "school") drawHoles(r);
  drawFoldCreases(r, it);
  if (wl > 0) drawWear(r, it, wl);
  pop();

  if (ve < 0.7) drawPacket(width / 2, midY, r.w * 0.16, 0, it.skew || 0, it.neat === undefined ? 0.85 : it.neat, 1 - ve / 0.7, it.seed || 1);
  pop();

  push();
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  if (bagView) text("Page " + it.n + "  ·  from " + fromLabel(it) + "  ·  opened " + it.wear + "×", width / 2, 36);
  else text("Page " + (viewing + 1) + "  ·  saved " + it.time + "  ·  " + neatLabel(it), width / 2, 36);

  if (bagView) {
    textFont(KO_FONT);
    textSize(13);
    fill(255, 215);
    text("페이지를 왼쪽으로 밀면 " + (current === "school" ? "카페" : "학교") + "로 보낼 수 있어요", width / 2, height - 38);
  }
  textFont(FONT_FAMILY);
  textSize(12);
  fill(255, 170);
  text("Esc or click outside the page to close", width / 2, height - 16);

  const cb = viewerCloseBtn();
  stroke(255);
  strokeWeight(3);
  fill(hitRect(cb) ? color(255, 60) : color(0, 0));
  rect(cb.x, cb.y, cb.w, cb.h);
  noStroke();
  fill(255);
  textSize(13);
  text("Close", cb.x + cb.w / 2, cb.y + cb.h / 2);
  pop();
}

function drawTearHint() {
  if (!tear) return;
  let msg = "";

  if (tear.phase === "drag") {
    if (tear.send) msg = "Drop it on the left edge to send it  ·  Let go anywhere else to cancel";
    else msg = tear.crumple >= 1
      ? "Let go to drop the crumpled paper"
      : "Shake to crumple  ·  Left edge to send  ·  Outside the notebook to fold  ·  Throw down to discard";
  } else if (tear.phase === "toDesk" || tear.phase === "desk") {
    msg = "Fold " + (tear.fold + 1) + " of " + FOLD_COUNT + "  ·  Swipe straight along the arrow (the straighter, the neater)  ·  Tap to put it back";
  } else if (tear.phase === "packet" || tear.phase === "packetDrag") {
    msg = "Drag the folded paper into the file  ·  Tap outside to unfold";
  }
  if (msg === "") return;

  push();
  noStroke();
  fill(tear.dim > 0.4 ? color(255, 240) : color(35, 32, 28, 150));
  textAlign(CENTER, CENTER);
  textSize(13);
  text(msg, width / 2, 54);
  pop();
}

function eraseAt(mx, my) {
  const r = paperRect();
  const rad = ERASER_RADIUS * r.w;
  const out = [];
  for (const s of strokes) {
    let piece = [];
    for (const p of s) {
      const px = r.x + p.x * r.w;
      const py = r.y + p.y * r.h;
      if (dist(px, py, mx, my) < rad) {
        if (piece.length > 0) { out.push(piece); piece = []; }
      } else {
        piece.push(p);
      }
    }
    if (piece.length > 0) out.push(piece);
  }
  strokes = out;
}

function eraseAlong(x1, y1, x2, y2) {
  const r = paperRect();
  const rad = ERASER_RADIUS * r.w;
  const steps = max(1, ceil(dist(x1, y1, x2, y2) / (rad / 2)));
  for (let k = 0; k <= steps; k++) {
    eraseAt(lerp(x1, x2, k / steps), lerp(y1, y2, k / steps));
  }
}

function wrapText(str, maxW, g) {
  const tw = g ? function (s) { return g.textWidth(s); } : function (s) { return textWidth(s); };
  const lines = [];
  let idx = 0;
  const paras = str.split("\n");
  for (let pi = 0; pi < paras.length; pi++) {
    const para = paras[pi];
    if (para.length === 0) {
      lines.push({ start: idx, end: idx, text: "" });
    } else {
      let start = 0;
      while (start < para.length) {
        let end = start;
        let lastSpace = -1;
        while (end < para.length) {
          if (para[end] === " ") lastSpace = end;
          if (tw(para.substring(start, end + 1)) > maxW && end > start) break;
          end++;
        }
        let lineEnd;
        if (end >= para.length) lineEnd = para.length;
        else if (lastSpace > start) lineEnd = lastSpace + 1;
        else lineEnd = end;
        lines.push({ start: idx + start, end: idx + lineEnd, text: para.substring(start, lineEnd) });
        start = lineEnd;
      }
    }
    idx += para.length + 1;
  }
  return lines;
}

function drawStack(r) {
  push();
  strokeWeight(3);
  stroke(INK);
  const shades = ["#f1ede4", "#e9e4d8", "#e1dccf"];
  for (let i = STACK_SHEETS; i >= 1; i--) {
    fill(shades[min(i - 1, shades.length - 1)]);
    rect(r.x + i * STACK_OFF_X, r.y - i * STACK_OFF_Y, r.w, r.h + i * STACK_OFF_Y);
  }
  pop();
}

function drawRings(r) {
  const sc = r.w / A4_WIDTH_PT;
  const gap = LINE_PT * 2 * sc;
  push();
  strokeCap(ROUND);
  for (let y = r.y + gap * 0.75; y < r.y + r.h - gap * 0.5; y += gap) {
    const hx = r.x + 18 * sc;

    stroke("#8a857b");
    strokeWeight(1.5);
    fill(255);
    circle(hx, y, 10 * sc);

    stroke("#3a3733");
    strokeWeight(max(2.5, 5 * sc));
    line(r.x - 16 * sc, y - 5 * sc, hx, y);

    stroke("#c9c4b9");
    strokeWeight(max(1, 1.6 * sc));
    line(r.x - 16 * sc, y - 6.5 * sc, hx - 1 * sc, y - 1.5 * sc);
  }
  pop();
}

function drawSheet(r, txt, strokesArr, sx, live, shade) {
  if (sx < 0.02) return;

  const sc = r.w / A4_WIDTH_PT;
  const margin = MARGIN_PT * sc;
  const lineH = LINE_PT * sc;
  const textW = r.w - margin * 2;
  const maxLines = floor((r.h - margin * 2) / lineH);
  const fa = 1 - 0.5 * sheetFade;

  push();
  translate(r.x, 0);
  scale(sx, 1);
  translate(-r.x, 0);

  push();
  drawingContext.shadowColor = "rgba(0,0,0,0.25)";
  drawingContext.shadowBlur = 24;
  drawingContext.shadowOffsetY = -4;
  stroke("#23201c");
  strokeWeight(4);
  fill("#fffdf8");
  rect(r.x, r.y, r.w, r.h);
  pop();

  push();
  textFont(FONT_FAMILY);
  textSize(FONT_PT * sc);
  textAlign(LEFT, BASELINE);

  const lines = wrapText(txt, textW);

  if (current !== "cafe" || CAFE_RULED) {
    stroke(35, 32, 28, 40 * fa);
    strokeWeight(1);
    for (let k = 0; k < maxLines; k++) {
      const ly = r.y + margin + (k + 1) * lineH;
      line(r.x + margin, ly, r.x + r.w - margin, ly);
    }
  }

  noStroke();
  fill(35, 32, 28, 255 * fa);
  for (let k = 0; k < lines.length; k++) {
    const ly = r.y + margin + (k + 1) * lineH;
    text(lines[k].text, r.x + margin, ly - lineH * 0.3);
  }

  if (live && document.activeElement === ta && floor(millis() / 500) % 2 === 0) {
    const pos = min(ta.selectionStart, txt.length);
    let li = lines.length - 1;
    for (let k = 0; k < lines.length; k++) {
      const l = lines[k];
      const next = lines[k + 1];
      if (pos >= l.start && pos < l.end) { li = k; break; }
      if (pos === l.end && (!next || next.start > l.end)) { li = k; break; }
    }
    const l = lines[li];
    const cxp = r.x + margin + textWidth(l.text.substring(0, pos - l.start));
    const cyp = r.y + margin + (li + 1) * lineH;
    stroke("#23201c");
    strokeWeight(1.5);
    line(cxp, cyp - lineH * 0.85, cxp, cyp - lineH * 0.1);
  }
  pop();

  push();
  stroke(35, 32, 28, 255 * fa);
  strokeWeight(max(1.5, r.w * PENCIL_WIDTH));
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();
  for (const s of strokesArr) {
    if (s.length === 1) {
      point(r.x + s[0].x * r.w, r.y + s[0].y * r.h);
    } else {
      beginShape();
      for (const p of s) vertex(r.x + p.x * r.w, r.y + p.y * r.h);
      endShape();
    }
  }
  pop();

  if (shade > 0) {
    noStroke();
    fill(0, shade * 70);
    rect(r.x, r.y, r.w, r.h);
  }
  pop();
}

function drawNotes() {
  const r = paperRect();
  const cafe = current === "cafe";

  const sc = r.w / A4_WIDTH_PT;
  const margin = MARGIN_PT * sc;
  const lineH = LINE_PT * sc;
  const textW = r.w - margin * 2;
  const maxLines = floor((r.h - margin * 2) / lineH);

  if (flip && millis() - flip.start >= FLIP_TIME) flip = null;

  if (cafe) drawCafeScreen(r);
  else drawStack(r);

  push();
  textFont(FONT_FAMILY);
  textSize(FONT_PT * sc);
  textAlign(LEFT, BASELINE);

  if (blocked() && ta.value !== lastGood) {
    ta.value = lastGood;
    ta.setSelectionRange(lastSel, lastSel);
  }

  let guard = 0;
  while (maxLines >= 1 && wrapText(ta.value, textW).length > maxLines && guard < 30) {
    guard++;
    const full = ta.value;

    let lo = 0, hi = full.length;
    while (lo < hi) {
      const mid = ceil((lo + hi) / 2);
      if (wrapText(full.substring(0, mid), textW).length <= maxLines) lo = mid;
      else hi = mid - 1;
    }
    let pageText = full.substring(0, lo);
    let rest = full.substring(lo);

    if (/\S$/.test(pageText) && /^\S/.test(rest)) {
      const word = pageText.match(/\S+$/)[0];
      if (word.length < pageText.length) {
        pageText = pageText.slice(0, pageText.length - word.length);
        rest = word + rest;
      }
    }
    rest = rest.replace(/^\n/, "");

    ta.value = pageText;
    savePage();
    const left = { text: pageText, strokes: strokes };
    pages.splice(pageIdx + 1, 0, { text: rest, strokes: [] });
    loadPage(pageIdx + 1);
    flip = { dir: "next", other: left, start: millis() };
  }
  lastGood = ta.value;
  lastSel = ta.selectionStart;
  pop();

  updateLag();

  const cur = { text: shown, strokes: strokes };

  const holding = tear && tear.phase !== "away" && tear.phase !== "drop" &&
                  tear.phase !== "packetSave" && tear.phase !== "sendAway";
  if (holding) {
    const under = underPage();
    drawSheet(r, under.text, under.strokes, 1, false, 0);
    if (!cafe) drawRings(r);
    drawTornSheet(r);
    return;
  }

  if (flip) {
    const fe = ease(constrain((millis() - flip.start) / FLIP_TIME, 0, 1));
    if (flip.dir === "next") {
      drawSheet(r, cur.text, cur.strokes, 1, true, 0);
      drawSheet(r, flip.other.text, flip.other.strokes, 1 - fe, false, fe);
    } else {
      drawSheet(r, flip.other.text, flip.other.strokes, 1, false, 0);
      drawSheet(r, cur.text, cur.strokes, fe, true, 1 - fe);
    }
  } else {
    drawSheet(r, cur.text, cur.strokes, 1, true, 0);
  }

  if (cafe) drawCafeOverlay(r);
  else drawRings(r);

  if (tear && !holding) drawTornSheet(r);
}

function drawPlace(key) {
  background(places[key].col);

  if (isNotes(key)) {
    drawSendZone();

    updateIdle();
    if (key === "cafe") updateCafe();
    if (key === "school") updateSchool();
    updateTear();
    drawNotes();
    if (key === "school") drawSleepyCover();
    if (key === "cafe") drawCup();
    if (key === "school") drawSchoolClosed();
    drawToolButtons();
    drawSettings();
    if (key === "cafe") drawPowerBtn();
    if (key === "school") drawFile();
    drawBag();
    drawFilePanel();
    drawPageNav();
    if (tear) drawTearHint();

    if (tool === "erase" && key === "school" && viewing < 0 && overPaper() &&
        !blocked() && !overSettingsUI() && !tear) {
      const r = paperRect();
      push();
      noFill();
      stroke(INK);
      strokeWeight(1.5);
      circle(mouseX, mouseY, ERASER_RADIUS * r.w * 2);
      pop();
    }
  }

  if (key === "home") drawHome();

  const over = phase === "none" &&
               mouseX > backBtn.x && mouseX < backBtn.x + backBtn.w &&
               mouseY > backBtn.y && mouseY < backBtn.y + backBtn.h;
  stroke("#23201c");
  strokeWeight(4);
  noFill();
  rect(backBtn.x, backBtn.y, backBtn.w, backBtn.h);
  noStroke();
  fill("#23201c");
  textSize(13);
  text("Back", backBtn.x + backBtn.w / 2, backBtn.y + backBtn.h / 2);

  if (isNotes(key)) drawViewer();

  if (isNotes(key)|| key === "home") {
    drawToast();
    drawSendMenu();
  }

  if (phase === "none") {
    if (sendMenu) cursor(overSendBtn() >= 0 ? HAND : ARROW);
    else if (viewing >= 0) cursor(hitRect(viewerCloseBtn()) ? HAND : ARROW);
    else if (tear && (tear.phase === "drag" || tear.phase === "packetDrag")) cursor("grabbing");
    else if (tear && tear.phase === "packet" && overPacket()) cursor(HAND);
    else if (tear) cursor(over ? HAND : ARROW);
    else if (over || overToolBtn() >= 0 || overSettingsUI() || overPageNav() >= 0 || overCup() ||
             overFile() || overBag() || overPowerBtn() || overFileRow() >= 0) cursor(HAND);
    else if (overPaper()) {
      if (blocked()) cursor(ARROW);
      else if (tool === "type") cursor(TEXT);
      else if (tool === "draw") cursor(CROSS);
      else noCursor();
    } else cursor(ARROW);
  }
}

function mousePressed() {
  if (phase !== "none") return;
  if (current === null) return mapPressed();
  if (sendMenu) return sendMenuPressed();
  if (tear) return tearPressed();
  pressPaper = null;

  if (viewing >= 0) {
    const r = viewerRect();
    const insidePage = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
    if (hitRect(viewerCloseBtn()) || !insidePage) closeViewer();
    else if (viewKind === "bag") {
      viewPress = { x: mouseX, y: mouseY };
      viewDrag = 0;
    }
    return false;
  }

  if (mouseX > backBtn.x && mouseX < backBtn.x + backBtn.w &&
      mouseY > backBtn.y && mouseY < backBtn.y + backBtn.h) {
    goTo(null);
    return;
  }

  if (current === "home") return homePressed();
  if (current === "school" && !schoolOpen()) {
    if (overNotebook() || overToolBtn() >= 0 || overPageNav() >= 0 || overBag() || overFile() || overSettingsBtn()) {
      schoolMsgAt = millis();
    }
    return false;
  }

  if (isNotes(current)) {
    lastDx = 0;
    lastDy = 0;

    if (overSettingsBtn()) {
      settingsOpen = !settingsOpen;
      filesOpen = false;
      markActive();
      return false;
    }

    if (settingsOpen) {
      const p = settingsPanel();
      if (hitRect(minusBtn())) {
        if (idleIdx > 0) idleIdx--;
        markActive();
        return false;
      }
      if (hitRect(plusBtn())) {
        if (idleIdx < IDLE_OPTIONS.length - 1) idleIdx++;
        markActive();
        return false;
      }
      if (hitRect(p)) return false;
      settingsOpen = false;
    }

    if (overBag()) {
      if (filesOpen && listKind === "bag") filesOpen = false;
      else { filesOpen = true; listKind = "bag"; }
      settingsOpen = false;
      fileScroll = 0;
      markActive();
      return false;
    }
    if (current === "school" && overFile()) {
      if (filesOpen && listKind === "file") filesOpen = false;
      else { filesOpen = true; listKind = "file"; }
      settingsOpen = false;
      fileScroll = 0;
      markActive();
      return false;
    }
    if (filesOpen) {
      const row = overFileRow();
      if (row >= 0) {
        viewKind = listKind;
        viewing = row;
        viewAt = millis();
        viewPress = null;
        viewDrag = 0;
        filesOpen = false;
        ta.blur();
        markActive();
        return false;
      }
      if (hitRect(filePanel())) return false;
      filesOpen = false;
    }

    const pn = overPageNav();
    if (pn >= 0) {
      if (!flipping()) turnPage(pn === 0 ? pageIdx - 1 : pageIdx + 1);
      markActive();
      return false;
    }

    if (overCup()) {
      drinking = true;
      markActive();
      return false;
    }

    if (overPowerBtn()) {
      powerHold = millis();
      markActive();
      return false;
    }
  }

  const ti = overToolBtn();
  if (ti >= 0) {
    tool = toolList()[ti];
    currentStroke = null;
    markActive();
    if (tool === "type") {
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
      setTimeout(function () {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
      }, 0);
    } else {
      ta.blur();
    }
    return false;
  }

  if (overPaper()) {
    if (blocked()) return false;
    if (flipping()) return false;

    markActive();
    if (tool === "draw") {
      const r = paperRect();
      currentStroke = [{ x: (mouseX - r.x) / r.w, y: (mouseY - r.y) / r.h }];
      strokes.push(currentStroke);
      return false;
    }
    if (tool === "erase") {
      eraseAt(mouseX, mouseY);
      return false;
    }
    pressPaper = { x: mouseX, y: mouseY };

    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    setTimeout(function () {
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }, 0);
    return false;
  } else {
    ta.blur();
  }
}

function mouseDragged() {
    if (current === "home") {
    if (phase === "none") homeDragged();
    return false;
  }
  if (current === null) {
    if (phase === "none") mapDragged();
    return false;
  }

  if (!isNotes(current) || phase !== "none") return;

  if (sendMenu) return false;

  if (viewing >= 0) {
    if (viewKind === "bag" && viewPress) viewDrag = constrain(mouseX - viewPress.x, -480, 0);
    return false;
  }

  if (drinking || powerHold >= 0) return false;

  if (current === "school" && darkness > DARK_BLOCK) {
    const dx = mouseX - pmouseX;
    const dy = mouseY - pmouseY;
    if (sqrt(dx * dx + dy * dy) > 4) {
      if (lastDx * dx + lastDy * dy < 0) {
        darkness = max(0, darkness - SHAKE_STEP);
      }
      lastDx = dx;
      lastDy = dy;
    }
    idleSince = millis();
    if (darkness <= DARK_BLOCK) {
      darkness = 0;
      idleSince = millis();
    }
    return false;
  }

  if (blocked()) return false;

  if (flipping()) return false;

  if (tear && tear.phase === "desk") {
    if (tear.press && !tear.press.moved &&
        dist(mouseX, mouseY, tear.press.x, tear.press.y) > FOLD_SWIPE) {
      tear.press.moved = true;
      startFold(mouseX - tear.press.x, mouseY - tear.press.y);
    }
    return false;
  }

  if (tear) return false;

  if (tool === "type") {
    if (pressPaper) {
      const dx = mouseX - pressPaper.x;
      const dy = mouseY - pressPaper.y;
      if (current === "school" && dx > TEAR_START && dx > abs(dy)) startTear();
      else if (current === "cafe" && dx < -SEND_START && -dx > abs(dy)) startTear();
    }
    return false;
  }

  const r = paperRect();
  const inside = r.done && mouseX > r.x && mouseX < r.x + r.w &&
                 mouseY > r.y && mouseY < r.y + r.h;

  if (tool === "erase") {
    if (inside) {
      markActive();
      eraseAlong(pmouseX, pmouseY, mouseX, mouseY);
    }
    return false;
  }

  if (tool !== "draw") return;
  if (inside) {
    markActive();
    if (currentStroke === null) {
      currentStroke = [];
      strokes.push(currentStroke);
    }
    const last = currentStroke[currentStroke.length - 1];
    if (last) {
      const lx = r.x + last.x * r.w;
      const ly = r.y + last.y * r.h;
      const steps = ceil(dist(lx, ly, mouseX, mouseY) / (r.w * 0.004));
      for (let k = 1; k < steps; k++) {
        const px = lerp(lx, mouseX, k / steps);
        const py = lerp(ly, mouseY, k / steps);
        currentStroke.push({ x: (px - r.x) / r.w, y: (py - r.y) / r.h });
      }
    }
    currentStroke.push({ x: (mouseX - r.x) / r.w, y: (mouseY - r.y) / r.h });
  } else {
    currentStroke = null;
  }
  return false;
}

function mouseReleased() {
  if (current === "home" && phase === "none") homeReleased();
  currentStroke = null;
  lastDx = 0;
  lastDy = 0;
  drinking = false;
  powerHold = -1;

  mapStroke = null;
  mapDown = false;
  if (mapDirty) {
    saveMapDrawing();
    mapDirty = false;
  }

  if (viewing >= 0 && viewKind === "bag" && viewPress) {
    const dx = mouseX - viewPress.x;
    const dy = mouseY - viewPress.y;
    if (dx < -SEND_START * 1.5 && -dx > abs(dy)) {
      sendMenu = { from: current, source: "view", shake: -99999 };
    }
    viewPress = null;
    viewDrag = 0;
  }

  if (tear) {
    if (tear.phase === "drag") {
      const r = paperRect();
      const inNotebook = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
      const inZone = mouseX < sendZoneX() && tear.crumple < 1;
      if (inZone) startToPacket();
      else if (tear.send) tear.phase = "back";
      else if (tear.crumple >= 1) dropBall();
      else if (tear.vy > THROW_SPEED && tear.vy > abs(tear.vx) * 0.6) throwTornPage();
      else if (inNotebook) tear.phase = "back";
      else toDesk();
    } else if (tear.phase === "packetDrag") {
      if (packetAimedAtFile()) savePacket();
      else tear.phase = "packet";
    } else if (tear.press) {
      if (!tear.press.moved && (tear.phase === "desk" || tear.phase === "packet")) putBack();
    }
    if (tear) tear.press = null;
  }
  pressPaper = null;
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    if (sendMenu) {
      cancelSend();
    } else {
      closeViewer();
      filesOpen = false;
    }
  }
}

function mouseWheel(event) {
  if ((current === "school" || current === "cafe") && filesOpen && curList().length > FILE_ROWS) {
    fileScroll = constrain(fileScroll + (event.delta > 0 ? 1 : -1), 0, curList().length - FILE_ROWS);
    return false;
  }
}

let wantKeyboard = false;
let touchX0 = 0;
let touchY0 = 0;

let wantKeyboard = false;
let ptrId = null;
let ptrX0 = 0;
let ptrY0 = 0;

function setupPointer(cnv) {
  const el = cnv.elt;
  el.style.touchAction = "none";
  el.style.webkitUserSelect = "none";
  el.style.userSelect = "none";

  function pos(e) {
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  el.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse") return;      // 마우스는 p5가 원래대로 처리
    if (ptrId !== null) return;                 // 한 손가락만
    e.preventDefault();
    ptrId = e.pointerId;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    const p = pos(e);
    window.pmouseX = p.x; window.pmouseY = p.y;
    window.mouseX = p.x;  window.mouseY = p.y;
    ptrX0 = p.x; ptrY0 = p.y;
    window.mouseIsPressed = true;
    mousePressed();
    wantKeyboard = (document.activeElement === ta);
  }, { passive: false });

  el.addEventListener("pointermove", function (e) {
    if (e.pointerType === "mouse" || e.pointerId !== ptrId) return;
    e.preventDefault();
    const p = pos(e);
    window.pmouseX = window.mouseX; window.pmouseY = window.mouseY;
    window.mouseX = p.x;            window.mouseY = p.y;
    if (dist(p.x, p.y, ptrX0, ptrY0) > 10) wantKeyboard = false;
    mouseDragged();
  }, { passive: false });

  function end(e) {
    if (e.pointerType === "mouse" || e.pointerId !== ptrId) return;
    e.preventDefault();
    ptrId = null;
    window.mouseIsPressed = false;
    mouseReleased();
    if (wantKeyboard) {
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }
    wantKeyboard = false;
  }
  el.addEventListener("pointerup", end, { passive: false });
  el.addEventListener("pointercancel", end, { passive: false });
}
