"use strict";

const COLS = 10;
const ROWS = 20;
const LINES_PER_STATION = 8;
const STORAGE_KEYS = {
  record: "poputchik-tetris-record",
  sound: "poputchik-tetris-sound",
  scenery: "poputchik-tetris-scenery"
};

const STATIONS = [
  {
    name: "Летний луг",
    mode: "meadow",
    image: "assets/level-01-summer-meadow.png",
    accent: "#13b9a4",
    glow: "#ffd34d",
    warm: "#ff6f61",
    skyTop: "#78d7f4",
    skyBottom: "#fff0a6"
  },
  {
    name: "Березовый лес",
    mode: "forest",
    image: "assets/level-02-birch-forest.png",
    accent: "#23b36a",
    glow: "#ffe36a",
    warm: "#ff8b55",
    skyTop: "#62cef0",
    skyBottom: "#d7f7ac"
  },
  {
    name: "Деревня у реки",
    mode: "village",
    image: "assets/level-03-riverside-village.png",
    accent: "#30b67a",
    glow: "#ffd86b",
    warm: "#ff835b",
    skyTop: "#62cef0",
    skyBottom: "#dff7c3"
  },
  {
    name: "Большой город",
    mode: "city",
    image: "assets/level-04-big-city.png",
    accent: "#7b61ff",
    glow: "#ffcf4f",
    warm: "#ff6f61",
    skyTop: "#42459a",
    skyBottom: "#ff9e6b"
  },
  {
    name: "Море",
    mode: "sea",
    image: "assets/level-05-seaside.png",
    accent: "#00a6c8",
    glow: "#ffd34d",
    warm: "#ff7e4d",
    skyTop: "#6bd3ff",
    skyBottom: "#b8f1ff"
  },
  {
    name: "Горы",
    mode: "mountains",
    image: "assets/level-06-mountains.png",
    accent: "#5f8dff",
    glow: "#ffe06b",
    warm: "#ff6f61",
    skyTop: "#83d7ff",
    skyBottom: "#fff4b8"
  },
  {
    name: "Снежный лес",
    mode: "snowyForest",
    image: "assets/level-07-snowy-forest.png",
    accent: "#32a8e6",
    glow: "#f4fbff",
    warm: "#ff5e7a",
    skyTop: "#9ce0ff",
    skyBottom: "#ffffff"
  },
  {
    name: "Ночной город",
    mode: "nightCity",
    image: "assets/level-08-night-city.png",
    accent: "#7b61ff",
    glow: "#ffcf4f",
    warm: "#ff6f9f",
    skyTop: "#162f80",
    skyBottom: "#6c52c7"
  },
  {
    name: "Северное сияние",
    mode: "aurora",
    image: "assets/level-09-aurora.png",
    accent: "#3df0bd",
    glow: "#a4ffef",
    warm: "#b06cff",
    skyTop: "#061c62",
    skyBottom: "#194fa8"
  },
  {
    name: "Космос",
    mode: "space",
    image: "assets/level-10-space.png",
    accent: "#ff7ae6",
    glow: "#78f7ff",
    warm: "#ffd15c",
    skyTop: "#110b3d",
    skyBottom: "#3a1f83"
  }
];

const PIECES = {
  I: {
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: "#34c8ff",
    dark: "#1477a3"
  },
  J: {
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: "#5f8dff",
    dark: "#284fb0"
  },
  L: {
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: "#ff9c48",
    dark: "#ad5720"
  },
  O: {
    matrix: [
      [1, 1],
      [1, 1]
    ],
    color: "#ffd34d",
    dark: "#b67b05"
  },
  S: {
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: "#62dd72",
    dark: "#25823b"
  },
  T: {
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: "#a373ff",
    dark: "#5b38bd"
  },
  Z: {
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: "#ff6575",
    dark: "#b52d45"
  }
};

const sceneCanvas = document.getElementById("sceneCanvas");
const sceneCtx = sceneCanvas.getContext("2d");
const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");
const nextCanvas = document.getElementById("nextCanvas");
const nextCtx = nextCanvas.getContext("2d");
const mobileNextCanvas = document.getElementById("mobileNextCanvas");
const mobileNextCtx = mobileNextCanvas.getContext("2d");

const scoreValue = document.getElementById("scoreValue");
const recordValue = document.getElementById("recordValue");
const stationName = document.getElementById("stationName");
const levelValue = document.getElementById("levelValue");
const linesValue = document.getElementById("linesValue");
const levelProgress = document.getElementById("levelProgress");
const routeTrack = document.getElementById("routeTrack");
const muteButton = document.getElementById("muteButton");
const pauseButton = document.getElementById("pauseButton");
const newGameButton = document.getElementById("newGameButton");
const startButton = document.getElementById("startButton");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
const startScreen = document.getElementById("startScreen");
const pauseScreen = document.getElementById("pauseScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const toast = document.getElementById("toast");

const formatter = new Intl.NumberFormat("ru-RU");

let board = createBoard();
let bag = [];
let player = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let levelIndex = 0;
let record = readNumber(STORAGE_KEYS.record, 0);
let muted = readText(STORAGE_KEYS.sound, "on") === "off";
let sceneryPaused = readText(STORAGE_KEYS.scenery, "moving") === "paused";
let running = false;
let paused = false;
let gameOver = false;
let dropCounter = 0;
let dropInterval = 820;
let lastTime = 0;
let sceneClock = 0;
let boardMetrics = { width: 300, height: 600, cell: 30, x: 0, y: 0 };
let nextMetrics = { width: 120, height: 120 };
let mobileNextMetrics = { width: 120, height: 80 };
let sceneMetrics = { width: window.innerWidth, height: window.innerHeight };
let sparks = [];
let toastTimer = 0;
let assetWarningShown = false;
const missingAssets = new Set();
let audioCtx = null;
let masterGain = null;
let softDropTimer = 0;
let horizontalTimer = 0;
let touchStart = null;
let touchMoveDebt = 0;
let touchDropMark = 0;
let lastPreviewKey = "";
const sceneImages = {
  levels: STATIONS.map((station) => loadSceneImage(station.image))
};

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function loadSceneImage(src) {
  const image = new Image();
  image.decoding = "async";
  image.assetPath = src;
  image.src = src;
  image.addEventListener("load", () => {
    drawNext();
  });
  image.addEventListener("error", () => {
    missingAssets.add(src);
    image.failed = true;
    showMissingAssetWarning();
  });
  return image;
}

function showMissingAssetWarning() {
  if (assetWarningShown || missingAssets.size === 0) return;
  assetWarningShown = true;
  window.setTimeout(() => {
    showToast("Не найдены картинки уровней");
    console.warn("Missing local assets:", [...missingAssets]);
  }, 400);
}

function readNumber(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    const value = Number(stored);
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function readText(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Local records are optional when a browser blocks storage.
  }
}

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function nextType() {
  if (bag.length === 0) {
    bag = shuffle(Object.keys(PIECES));
  }
  return bag.pop();
}

function cloneMatrix(matrix) {
  return matrix.map((row) => [...row]);
}

function makePiece(type) {
  const matrix = cloneMatrix(PIECES[type].matrix);
  return {
    type,
    matrix,
    x: Math.floor(COLS / 2) - Math.ceil(matrix[0].length / 2),
    y: type === "I" ? -1 : 0
  };
}

function resizeCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const cssWidth = Math.max(1, rect.width);
  const cssHeight = Math.max(1, rect.height);
  const width = Math.max(1, Math.round(cssWidth * ratio));
  const height = Math.max(1, Math.round(cssHeight * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { width: cssWidth, height: cssHeight, ratio };
}

function resizeAll() {
  const sceneRatio = Math.min(window.devicePixelRatio || 1, 2);
  sceneMetrics = { width: window.innerWidth, height: window.innerHeight, ratio: sceneRatio };
  sceneCanvas.width = Math.round(sceneMetrics.width * sceneRatio);
  sceneCanvas.height = Math.round(sceneMetrics.height * sceneRatio);
  sceneCtx.setTransform(sceneRatio, 0, 0, sceneRatio, 0, 0);

  const boardSize = resizeCanvas(gameCanvas, gameCtx);
  const cell = Math.min(boardSize.width / COLS, boardSize.height / ROWS);
  boardMetrics = {
    width: boardSize.width,
    height: boardSize.height,
    cell,
    x: (boardSize.width - cell * COLS) / 2,
    y: (boardSize.height - cell * ROWS) / 2
  };

  const nextSize = resizeCanvas(nextCanvas, nextCtx);
  nextMetrics = { width: nextSize.width, height: nextSize.height };

  const mobileNextSize = resizeCanvas(mobileNextCanvas, mobileNextCtx);
  mobileNextMetrics = { width: mobileNextSize.width, height: mobileNextSize.height };
}

function syncPreviewMetrics(canvas, ctx, metrics) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return metrics;
  const needsResize =
    Math.abs(rect.width - metrics.width) > 0.5 ||
    Math.abs(rect.height - metrics.height) > 0.5 ||
    canvas.width <= 1 ||
    canvas.height <= 1;
  if (!needsResize) return metrics;
  const size = resizeCanvas(canvas, ctx);
  return { width: size.width, height: size.height };
}

function setTheme() {
  const station = STATIONS[levelIndex];
  document.documentElement.style.setProperty("--station-a", station.accent);
  document.documentElement.style.setProperty("--station-b", station.glow);
  document.documentElement.style.setProperty("--station-c", station.warm);
}

function updateHud() {
  const station = STATIONS[levelIndex];
  scoreValue.textContent = formatter.format(score);
  recordValue.textContent = formatter.format(Math.max(record, score));
  stationName.textContent = `Уровень ${levelIndex + 1}: ${station.name}`;
  levelValue.textContent = String(levelIndex + 1);
  linesValue.textContent = formatter.format(lines);
  const isFinalLevel = levelIndex === STATIONS.length - 1;
  const progress = isFinalLevel ? 100 : ((lines % LINES_PER_STATION) / LINES_PER_STATION) * 100;
  levelProgress.style.width = `${progress}%`;

  for (const stop of routeTrack.querySelectorAll(".route-stop")) {
    const index = Number(stop.dataset.index);
    stop.classList.toggle("is-done", index < levelIndex);
    stop.classList.toggle("is-current", index === levelIndex);
  }
}

function renderRoute() {
  routeTrack.textContent = "";
  STATIONS.forEach((station, index) => {
    const stop = document.createElement("div");
    stop.className = "route-stop";
    stop.dataset.index = String(index);

    const pin = document.createElement("i");
    pin.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = station.name;

    stop.append(pin, label);
    routeTrack.append(stop);
  });
}

function newGame() {
  board = createBoard();
  bag = [];
  sparks = [];
  score = 0;
  lines = 0;
  levelIndex = 0;
  dropCounter = 0;
  sceneClock = 0;
  dropInterval = getDropInterval();
  player = makePiece(nextType());
  nextPiece = makePiece(nextType());
  running = true;
  paused = false;
  gameOver = false;
  hideModal(startScreen);
  hideModal(pauseScreen);
  hideModal(gameOverScreen);
  pauseButton.disabled = false;
  setTheme();
  updateHud();
  drawNext();
  showToast("Отправление");
  resumeAudio().then((isReady) => {
    if (isReady) playEffect("start");
  });
}

function hideModal(modal) {
  modal.classList.remove("is-visible");
}

function showModal(modal) {
  modal.classList.add("is-visible");
}

function getDropInterval() {
  const base = 820 - levelIndex * 84 - Math.floor(lines / 24) * 18;
  return Math.max(95, base);
}

function collides(piece, offsetX = 0, offsetY = 0, matrix = piece.matrix) {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const nextX = piece.x + x + offsetX;
      const nextY = piece.y + y + offsetY;
      if (nextX < 0 || nextX >= COLS || nextY >= ROWS) return true;
      if (nextY >= 0 && board[nextY][nextX]) return true;
    }
  }
  return false;
}

function movePlayer(direction) {
  if (!canControl()) return;
  if (!collides(player, direction, 0)) {
    player.x += direction;
  }
}

function softDrop() {
  stepDown(true);
}

function gravityDrop() {
  stepDown(false);
}

function stepDown(isManual) {
  if (!canControl()) return;
  if (!collides(player, 0, 1)) {
    player.y += 1;
    if (isManual) {
      score += 1;
    }
    dropCounter = 0;
    updateHud();
  } else {
    lockPiece();
  }
}

function hardDrop() {
  if (!canControl()) return;
  let distance = 0;
  while (!collides(player, 0, 1)) {
    player.y += 1;
    distance += 1;
  }
  score += distance * 2;
  playEffect("drop");
  lockPiece();
}

function rotatePlayer() {
  if (!canControl()) return;
  const rotated = rotateMatrix(player.matrix);
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    if (!collides(player, kick, 0, rotated)) {
      player.matrix = rotated;
      player.x += kick;
      playEffect("rotate");
      return;
    }
  }
}

function rotateMatrix(matrix) {
  const size = matrix.length;
  const rotated = Array.from({ length: size }, () => Array(size).fill(0));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      rotated[x][size - 1 - y] = matrix[y][x];
    }
  }
  return rotated;
}

function canControl() {
  return running && !paused && !gameOver && player;
}

function lockPiece() {
  if (!player) return;
  for (let y = 0; y < player.matrix.length; y += 1) {
    for (let x = 0; x < player.matrix[y].length; x += 1) {
      if (!player.matrix[y][x]) continue;
      const boardX = player.x + x;
      const boardY = player.y + y;
      if (boardY < 0) {
        endGame();
        return;
      }
      board[boardY][boardX] = player.type;
    }
  }

  const cleared = sweepLines();
  spawnPiece();
  if (cleared === 0) {
    playEffect("land");
  }
  updateHud();
}

function sweepLines() {
  let cleared = 0;
  const clearedRows = [];

  outer: for (let y = ROWS - 1; y >= 0; y -= 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!board[y][x]) continue outer;
    }

    board.splice(y, 1);
    board.unshift(Array(COLS).fill(null));
    clearedRows.push(y);
    cleared += 1;
    y += 1;
  }

  if (cleared > 0) {
    const oldLevel = levelIndex;
    const lineScores = [0, 100, 300, 500, 800];
    score += lineScores[cleared] * (levelIndex + 1);
    lines += cleared;
    levelIndex = Math.min(STATIONS.length - 1, Math.floor(lines / LINES_PER_STATION));
    dropInterval = getDropInterval();
    for (const row of clearedRows) {
      spawnSparks(row);
    }
    if (levelIndex !== oldLevel) {
      setTheme();
      showToast(`Уровень ${levelIndex + 1}: ${STATIONS[levelIndex].name}`);
      playEffect("level");
    } else {
      playEffect("clear");
    }
  }

  return cleared;
}

function spawnPiece() {
  player = nextPiece;
  player.x = Math.floor(COLS / 2) - Math.ceil(player.matrix[0].length / 2);
  player.y = player.type === "I" ? -1 : 0;
  nextPiece = makePiece(nextType());
  lastPreviewKey = "";
  drawNext();

  if (collides(player)) {
    endGame();
  }
}

function endGame() {
  running = false;
  gameOver = true;
  pauseButton.disabled = true;
  finalScore.textContent = formatter.format(score);
  if (score > record) {
    record = score;
    writeStorage(STORAGE_KEYS.record, record);
    showToast("Новый рекорд");
  }
  updateHud();
  showModal(gameOverScreen);
  playEffect("gameover");
}

function togglePause(force) {
  if (!running || gameOver) return;
  paused = typeof force === "boolean" ? force : !paused;
  if (paused) {
    showModal(pauseScreen);
  } else {
    hideModal(pauseScreen);
    resumeAudio();
  }
}

function update(time = 0) {
  const delta = time - lastTime;
  lastTime = time;
  if (!sceneryPaused) {
    sceneClock += Math.min(delta, 50);
  }

  drawScene(sceneClock);
  updateSparks(delta);

  if (running && !paused && !gameOver) {
    dropCounter += delta;
    if (dropCounter > dropInterval) {
      gravityDrop();
      dropCounter = 0;
    }
  }

  drawBoard();
  refreshNextPreview();
  requestAnimationFrame(update);
}

function drawBoard() {
  const { width, height, cell, x: ox, y: oy } = boardMetrics;
  gameCtx.clearRect(0, 0, width, height);

  const station = STATIONS[levelIndex];
  const background = gameCtx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#153943");
  background.addColorStop(1, "#0e252d");
  gameCtx.fillStyle = background;
  roundRect(gameCtx, 0, 0, width, height, 8);
  gameCtx.fill();

  gameCtx.save();
  gameCtx.translate(ox, oy);

  gameCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      roundRect(gameCtx, x * cell + 1, y * cell + 1, cell - 2, cell - 2, Math.max(2, cell * 0.12));
      gameCtx.fill();
    }
  }

  drawMatrix(board, 0, 0, 1);

  if (player) {
    drawMatrix(player.matrix, player.x, player.y, 1, player.type);
  }

  drawSparks(gameCtx, cell);
  gameCtx.restore();

  gameCtx.save();
  gameCtx.globalAlpha = 0.16;
  gameCtx.strokeStyle = station.glow;
  gameCtx.lineWidth = Math.max(2, cell * 0.05);
  for (let y = 0; y <= ROWS; y += 4) {
    gameCtx.beginPath();
    gameCtx.moveTo(ox, oy + y * cell);
    gameCtx.lineTo(ox + COLS * cell, oy + y * cell);
    gameCtx.stroke();
  }
  gameCtx.restore();
}

function drawMatrix(matrix, offsetX, offsetY, alpha, forcedType = null) {
  const { cell } = boardMetrics;
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const type = forcedType || matrix[y][x];
      const drawX = (offsetX + x) * cell;
      const drawY = (offsetY + y) * cell;
      if (offsetY + y < 0) continue;
      drawBlock(gameCtx, drawX, drawY, cell, type, alpha);
    }
  }
}

function getGhostY() {
  if (!player) return 0;
  let ghostY = player.y;
  while (!collides({ ...player, y: ghostY }, 0, 1)) {
    ghostY += 1;
  }
  return ghostY;
}

function drawBlock(ctx, x, y, size, type, alpha = 1) {
  const piece = PIECES[type];
  const inset = Math.max(1.5, size * 0.08);
  const radius = Math.max(4, size * 0.18);
  ctx.save();
  ctx.globalAlpha = alpha;

  const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
  gradient.addColorStop(0, lighten(piece.color, 0.2));
  gradient.addColorStop(0.58, piece.color);
  gradient.addColorStop(1, piece.dark);

  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  roundRect(ctx, x + inset * 1.4, y + inset * 1.6, size - inset * 1.8, size - inset * 1.5, radius);
  ctx.fill();

  ctx.fillStyle = gradient;
  roundRect(ctx, x + inset, y + inset, size - inset * 2, size - inset * 2, radius);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.52)";
  ctx.lineWidth = Math.max(1, size * 0.045);
  roundRect(ctx, x + inset * 1.35, y + inset * 1.35, size - inset * 2.7, size - inset * 2.7, radius * 0.8);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
  roundRect(ctx, x + size * 0.2, y + size * 0.17, size * 0.38, size * 0.12, radius * 0.45);
  ctx.fill();
  ctx.restore();
}

function drawIcon(ctx, type, cx, cy, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.11);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (type === "I") {
    ctx.strokeRect(cx - size * 0.42, cy - size * 0.2, size * 0.84, size * 0.44);
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.22, cy - size * 0.2);
    ctx.lineTo(cx - size * 0.22, cy + size * 0.24);
    ctx.moveTo(cx + size * 0.22, cy - size * 0.2);
    ctx.lineTo(cx + size * 0.22, cy + size * 0.24);
    ctx.stroke();
  } else if (type === "J") {
    ctx.strokeRect(cx - size * 0.33, cy - size * 0.18, size * 0.66, size * 0.46);
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.18, cy - size * 0.18);
    ctx.lineTo(cx - size * 0.1, cy - size * 0.34);
    ctx.lineTo(cx + size * 0.1, cy - size * 0.34);
    ctx.lineTo(cx + size * 0.18, cy - size * 0.18);
    ctx.stroke();
  } else if (type === "L") {
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.16, cy - size * 0.02);
    ctx.lineTo(cx, cy + size * 0.14);
    ctx.lineTo(cx + size * 0.2, cy - size * 0.12);
    ctx.stroke();
  } else if (type === "O") {
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.35, cy - size * 0.1);
    ctx.lineTo(cx + size * 0.16, cy - size * 0.1);
    ctx.quadraticCurveTo(cx + size * 0.42, cy - size * 0.1, cx + size * 0.42, cy + size * 0.1);
    ctx.quadraticCurveTo(cx + size * 0.42, cy + size * 0.3, cx + size * 0.16, cy + size * 0.3);
    ctx.lineTo(cx - size * 0.35, cy + size * 0.3);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + size * 0.42, cy + size * 0.02);
    ctx.lineTo(cx + size * 0.62, cy + size * 0.02);
    ctx.stroke();
  } else if (type === "S") {
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.38, cy + size * 0.26);
    ctx.quadraticCurveTo(cx - size * 0.05, cy - size * 0.33, cx + size * 0.36, cy - size * 0.18);
    ctx.quadraticCurveTo(cx + size * 0.03, cy - size * 0.02, cx + size * 0.18, cy + size * 0.28);
    ctx.stroke();
  } else if (type === "T") {
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.36, cy - size * 0.26);
    ctx.lineTo(cx + size * 0.36, cy - size * 0.26);
    ctx.lineTo(cx + size * 0.2, cy + size * 0.28);
    ctx.lineTo(cx - size * 0.2, cy + size * 0.28);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.2, cy);
    ctx.lineTo(cx + size * 0.2, cy);
    ctx.stroke();
  } else if (type === "Z") {
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.36, cy + size * 0.24);
    ctx.lineTo(cx + size * 0.36, cy + size * 0.24);
    ctx.moveTo(cx - size * 0.25, cy + size * 0.08);
    ctx.lineTo(cx + size * 0.25, cy + size * 0.08);
    ctx.moveTo(cx - size * 0.15, cy - size * 0.08);
    ctx.lineTo(cx + size * 0.15, cy - size * 0.08);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNext() {
  nextMetrics = syncPreviewMetrics(nextCanvas, nextCtx, nextMetrics);
  mobileNextMetrics = syncPreviewMetrics(mobileNextCanvas, mobileNextCtx, mobileNextMetrics);
  drawNextPreview(nextCtx, nextMetrics);
  drawNextPreview(mobileNextCtx, mobileNextMetrics);
  lastPreviewKey = getPreviewKey();
}

function refreshNextPreview() {
  const before = getPreviewKey();
  nextMetrics = syncPreviewMetrics(nextCanvas, nextCtx, nextMetrics);
  mobileNextMetrics = syncPreviewMetrics(mobileNextCanvas, mobileNextCtx, mobileNextMetrics);
  const after = getPreviewKey();
  if (after !== lastPreviewKey || after !== before) {
    drawNextPreview(nextCtx, nextMetrics);
    drawNextPreview(mobileNextCtx, mobileNextMetrics);
    lastPreviewKey = after;
  }
}

function getPreviewKey() {
  const nextTypeName = nextPiece ? nextPiece.type : "empty";
  return [
    nextTypeName,
    Math.round(nextMetrics.width),
    Math.round(nextMetrics.height),
    Math.round(mobileNextMetrics.width),
    Math.round(mobileNextMetrics.height)
  ].join(":");
}

function drawNextPreview(ctx, metrics) {
  const { width, height } = metrics;
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.62)");
  gradient.addColorStop(1, "rgba(255, 211, 77, 0.18)");
  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  if (!nextPiece) return;
  const matrix = nextPiece.matrix;
  const cell = Math.min(width / 5.2, height / 4.7);
  const shapeWidth = matrix[0].length * cell;
  const shapeHeight = matrix.length * cell;
  const ox = (width - shapeWidth) / 2;
  const oy = (height - shapeHeight) / 2 + cell * 0.12;

  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (matrix[y][x]) {
        drawBlock(ctx, ox + x * cell, oy + y * cell, cell, nextPiece.type, 1);
      }
    }
  }
}

function spawnSparks(row) {
  const station = STATIONS[levelIndex];
  const colors = [station.accent, station.glow, station.warm, "#ffffff"];
  for (let i = 0; i < 34; i += 1) {
    sparks.push({
      x: Math.random() * COLS,
      y: row + Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 0.055,
      vy: -Math.random() * 0.06 - 0.015,
      size: Math.random() * 0.12 + 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 620 + Math.random() * 340
    });
  }
}

function updateSparks(delta) {
  const step = Math.min(delta, 32);
  sparks = sparks.filter((spark) => {
    spark.life -= step;
    spark.x += spark.vx * step;
    spark.y += spark.vy * step;
    spark.vy += 0.0009 * step;
    return spark.life > 0;
  });
}

function drawSparks(ctx, cell) {
  for (const spark of sparks) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, spark.life / 700));
    ctx.fillStyle = spark.color;
    roundRect(
      ctx,
      spark.x * cell,
      spark.y * cell,
      Math.max(2, spark.size * cell),
      Math.max(2, spark.size * cell),
      2
    );
    ctx.fill();
    ctx.restore();
  }
}

function drawScene(time) {
  const w = sceneMetrics.width;
  const h = sceneMetrics.height;
  const station = STATIONS[levelIndex];
  const t = time * 0.001;

  const levelImage = sceneImages.levels[levelIndex];
  if (isImageReady(levelImage)) {
    drawPicturePanorama(station, w, h, t);
  } else {
    drawFallbackLandscape(station, w, h, t);
  }

  drawForegroundMeadow(station, w, h, t);
  drawTrainInterior(station, w, h, t);
}

function isImageReady(image) {
  return image.complete && image.naturalWidth > 0;
}

function drawFallbackLandscape(station, w, h, t) {
  const sky = sceneCtx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, station.skyTop);
  sky.addColorStop(0.62, station.skyBottom);
  sky.addColorStop(1, "#f9e0ae");
  sceneCtx.fillStyle = sky;
  sceneCtx.fillRect(0, 0, w, h);

  drawSunAndMoon(station, w, h, t);
  drawLandscape(station, w, h, t);
}

function drawPicturePanorama(station, w, h, t) {
  const image = sceneImages.levels[levelIndex];
  sceneCtx.imageSmoothingEnabled = true;
  sceneCtx.imageSmoothingQuality = "high";

  drawMovingPanorama(image, w, h, 46 + levelIndex * 5, t);
  drawStationPictureOverlay(station, w, h);
  drawWindowMotionStreaks(w, h, t);
}

function drawMovingPanorama(image, w, h, speed, t) {
  const scale = Math.max((w * 1.18) / image.width, h / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const y = (h - drawHeight) / 2;
  const offset = -((t * speed) % drawWidth);
  let tileIndex = 0;

  sceneCtx.save();
  for (let x = offset - drawWidth; x < w + drawWidth; x += drawWidth) {
    drawPanoramaTile(image, x, y, drawWidth, drawHeight, tileIndex % 2 === 1);
    tileIndex += 1;
  }
  sceneCtx.restore();
}

function drawPanoramaTile(image, x, y, width, height, mirrored) {
  if (!mirrored) {
    sceneCtx.drawImage(image, x, y, width, height);
    return;
  }

  sceneCtx.save();
  sceneCtx.translate(x + width, y);
  sceneCtx.scale(-1, 1);
  sceneCtx.drawImage(image, 0, 0, width, height);
  sceneCtx.restore();
}

function drawStationPictureOverlay(station, w, h) {
  sceneCtx.save();

  const wash = sceneCtx.createLinearGradient(0, 0, 0, h);
  if (station.mode === "city") {
    wash.addColorStop(0, "rgba(42, 46, 126, 0.3)");
    wash.addColorStop(0.62, "rgba(255, 111, 97, 0.12)");
    wash.addColorStop(1, "rgba(19, 50, 58, 0.12)");
  } else if (station.mode === "snowyForest") {
    wash.addColorStop(0, "rgba(232, 250, 255, 0.28)");
    wash.addColorStop(0.68, "rgba(255, 255, 255, 0.26)");
    wash.addColorStop(1, "rgba(115, 197, 232, 0.12)");
  } else if (station.mode === "sea") {
    wash.addColorStop(0, "rgba(22, 187, 214, 0.18)");
    wash.addColorStop(0.72, "rgba(255, 238, 152, 0.1)");
    wash.addColorStop(1, "rgba(0, 166, 200, 0.18)");
  } else if (station.mode === "mountains") {
    wash.addColorStop(0, "rgba(95, 141, 255, 0.18)");
    wash.addColorStop(0.66, "rgba(255, 224, 107, 0.1)");
    wash.addColorStop(1, "rgba(20, 98, 126, 0.08)");
  } else {
    wash.addColorStop(0, "rgba(255, 255, 255, 0.06)");
    wash.addColorStop(0.66, "rgba(255, 211, 77, 0.08)");
    wash.addColorStop(1, "rgba(19, 185, 164, 0.08)");
  }
  sceneCtx.fillStyle = wash;
  sceneCtx.fillRect(0, 0, w, h);

  if (station.mode === "snowyForest") {
    drawSnow(w, h, performance.now() * 0.001);
  }

  sceneCtx.restore();
}

function drawWindowMotionStreaks(w, h, t) {
  sceneCtx.save();
  sceneCtx.globalAlpha = 0.16;
  sceneCtx.strokeStyle = "#ffffff";
  sceneCtx.lineWidth = Math.max(1.5, Math.min(w, h) * 0.004);
  for (let i = 0; i < 9; i += 1) {
    const y = h * (0.18 + i * 0.072);
    const x = (w - ((t * 360 + i * 173) % (w + 220))) - 120;
    sceneCtx.beginPath();
    sceneCtx.moveTo(x, y);
    sceneCtx.lineTo(x + 90, y - 8);
    sceneCtx.stroke();
  }
  sceneCtx.restore();
}

function drawForegroundMeadow(station, w, h, t) {
  const top = h * 0.885;
  const gradient = sceneCtx.createLinearGradient(0, top, 0, h);

  if (station.mode === "space") {
    gradient.addColorStop(0, "rgba(120, 247, 255, 0)");
    gradient.addColorStop(0.42, "rgba(255, 122, 230, 0.14)");
    gradient.addColorStop(1, "rgba(17, 11, 61, 0.58)");
  } else if (station.mode === "snowyForest" || station.mode === "aurora") {
    gradient.addColorStop(0, "rgba(240, 252, 255, 0)");
    gradient.addColorStop(0.42, "rgba(211, 242, 255, 0.3)");
    gradient.addColorStop(1, "rgba(98, 159, 201, 0.44)");
  } else if (station.mode === "nightCity") {
    gradient.addColorStop(0, "rgba(22, 47, 128, 0)");
    gradient.addColorStop(0.4, "rgba(123, 97, 255, 0.18)");
    gradient.addColorStop(1, "rgba(12, 25, 62, 0.46)");
  } else {
    gradient.addColorStop(0, "rgba(71, 153, 76, 0)");
    gradient.addColorStop(0.38, "rgba(45, 132, 69, 0.34)");
    gradient.addColorStop(1, "rgba(17, 80, 49, 0.58)");
  }

  sceneCtx.save();
  sceneCtx.fillStyle = gradient;
  sceneCtx.fillRect(0, top, w, h - top);

  if (!["meadow", "forest", "village", "mountains", "sea"].includes(station.mode)) {
    sceneCtx.restore();
    return;
  }

  sceneCtx.globalAlpha = 0.7;
  sceneCtx.strokeStyle = "rgba(255, 244, 171, 0.34)";
  sceneCtx.lineWidth = Math.max(2, w * 0.002);
  for (let i = 0; i < 34; i += 1) {
    const x = (i * 83 - t * 44) % (w + 120) - 60;
    const y = top + 8 + (i % 6) * 10;
    sceneCtx.beginPath();
    sceneCtx.moveTo(x, h);
    sceneCtx.quadraticCurveTo(x + 8, y, x + 18, y - 18);
    sceneCtx.stroke();
  }
  sceneCtx.restore();
}

function drawSunAndMoon(station, w, h, t) {
  const x = w * 0.78 + Math.sin(t * 0.12) * w * 0.03;
  const y = h * 0.18 + Math.cos(t * 0.1) * h * 0.025;
  sceneCtx.save();
  if (station.mode === "city") {
    sceneCtx.fillStyle = "rgba(255, 233, 160, 0.9)";
    sceneCtx.beginPath();
    sceneCtx.arc(x, y, Math.min(w, h) * 0.055, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.fillStyle = "rgba(255, 255, 255, 0.88)";
    for (let i = 0; i < 42; i += 1) {
      const sx = (i * 97) % w;
      const sy = (i * 43) % (h * 0.44);
      sceneCtx.fillRect(sx, sy, 2, 2);
    }
  } else {
    const radius = Math.min(w, h) * 0.075;
    const glow = sceneCtx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.4);
    glow.addColorStop(0, "rgba(255, 244, 165, 0.9)");
    glow.addColorStop(1, "rgba(255, 244, 165, 0)");
    sceneCtx.fillStyle = glow;
    sceneCtx.beginPath();
    sceneCtx.arc(x, y, radius * 2.4, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.fillStyle = station.glow;
    sceneCtx.beginPath();
    sceneCtx.arc(x, y, radius, 0, Math.PI * 2);
    sceneCtx.fill();
  }
  sceneCtx.restore();
}

function drawLandscape(station, w, h, t) {
  const horizon = h * 0.64;
  drawHills(w, h, horizon, t, station);

  if (station.mode === "city") {
    drawCity(w, h, horizon, t);
  } else if (station.mode === "snowyForest") {
    drawSnow(w, h, t);
    drawPines(w, h, horizon, t, "#3aaed0", "#f7fdff");
  } else if (station.mode === "sea") {
    drawSea(w, h, horizon, t);
  } else if (station.mode === "mountains") {
    drawMountains(w, h, horizon, t);
  } else {
    drawPines(w, h, horizon, t, "#2fa865", "#1f7a4d");
  }

  drawRails(w, h, t);
}

function drawHills(w, h, horizon, t, station) {
  const offset = (t * 24) % 260;
  sceneCtx.fillStyle = station.mode === "snowyForest" ? "#e9fbff" : "rgba(55, 160, 112, 0.45)";
  sceneCtx.beginPath();
  sceneCtx.moveTo(0, horizon);
  for (let x = -260; x <= w + 260; x += 130) {
    const peakX = x - offset;
    sceneCtx.quadraticCurveTo(peakX + 68, horizon - 82 - Math.sin((x + t) * 0.02) * 20, peakX + 140, horizon);
  }
  sceneCtx.lineTo(w, h);
  sceneCtx.lineTo(0, h);
  sceneCtx.closePath();
  sceneCtx.fill();
}

function drawPines(w, h, horizon, t, color, trunk) {
  const offset = (t * 96) % 140;
  for (let x = -140; x < w + 140; x += 70) {
    const px = x - offset;
    const base = horizon + 30 + Math.sin((x + t * 4) * 0.08) * 18;
    sceneCtx.fillStyle = trunk;
    sceneCtx.fillRect(px - 5, base - 52, 10, 56);
    sceneCtx.fillStyle = color;
    for (let layer = 0; layer < 3; layer += 1) {
      sceneCtx.beginPath();
      sceneCtx.moveTo(px, base - 95 + layer * 24);
      sceneCtx.lineTo(px - 32 + layer * 5, base - 44 + layer * 14);
      sceneCtx.lineTo(px + 32 - layer * 5, base - 44 + layer * 14);
      sceneCtx.closePath();
      sceneCtx.fill();
    }
  }
}

function drawCity(w, h, horizon, t) {
  const offset = (t * 58) % 180;
  for (let x = -180; x < w + 180; x += 60) {
    const px = x - offset;
    const height = 70 + ((x * 13) % 90);
    sceneCtx.fillStyle = x % 3 === 0 ? "#253267" : "#33458f";
    sceneCtx.fillRect(px, horizon - height, 45, height);
    sceneCtx.fillStyle = "#ffd86b";
    for (let y = horizon - height + 14; y < horizon - 10; y += 18) {
      sceneCtx.fillRect(px + 10, y, 7, 8);
      sceneCtx.fillRect(px + 27, y, 7, 8);
    }
  }
}

function drawSea(w, h, horizon, t) {
  sceneCtx.fillStyle = "rgba(0, 166, 200, 0.56)";
  sceneCtx.fillRect(0, horizon + 6, w, h - horizon);
  sceneCtx.strokeStyle = "rgba(255, 255, 255, 0.58)";
  sceneCtx.lineWidth = 4;
  for (let y = horizon + 24; y < h; y += 32) {
    sceneCtx.beginPath();
    for (let x = -40; x < w + 60; x += 28) {
      const yy = y + Math.sin(x * 0.035 + t * 2.4) * 5;
      if (x === -40) sceneCtx.moveTo(x, yy);
      else sceneCtx.lineTo(x, yy);
    }
    sceneCtx.stroke();
  }
}

function drawMountains(w, h, horizon, t) {
  const offset = (t * 30) % 320;
  for (let x = -320; x < w + 320; x += 160) {
    const px = x - offset;
    sceneCtx.fillStyle = "#7896d8";
    sceneCtx.beginPath();
    sceneCtx.moveTo(px - 40, horizon + 20);
    sceneCtx.lineTo(px + 70, horizon - 150);
    sceneCtx.lineTo(px + 190, horizon + 20);
    sceneCtx.closePath();
    sceneCtx.fill();
    sceneCtx.fillStyle = "#f8fdff";
    sceneCtx.beginPath();
    sceneCtx.moveTo(px + 70, horizon - 150);
    sceneCtx.lineTo(px + 34, horizon - 94);
    sceneCtx.lineTo(px + 72, horizon - 112);
    sceneCtx.lineTo(px + 108, horizon - 94);
    sceneCtx.closePath();
    sceneCtx.fill();
  }
}

function drawSnow(w, h, t) {
  sceneCtx.fillStyle = "rgba(255, 255, 255, 0.92)";
  for (let i = 0; i < 70; i += 1) {
    const x = (i * 83 + t * 26) % w;
    const y = (i * 47 + t * (24 + (i % 5) * 5)) % h;
    sceneCtx.beginPath();
    sceneCtx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2);
    sceneCtx.fill();
  }
}

function drawRails(w, h, t) {
  const floorTop = h * 0.76;
  sceneCtx.fillStyle = "rgba(68, 84, 82, 0.24)";
  sceneCtx.fillRect(0, floorTop, w, h - floorTop);

  const offset = (t * 160) % 90;
  sceneCtx.strokeStyle = "rgba(63, 64, 59, 0.55)";
  sceneCtx.lineWidth = Math.max(4, w * 0.006);
  sceneCtx.beginPath();
  sceneCtx.moveTo(w * 0.28, h);
  sceneCtx.lineTo(w * 0.45, floorTop);
  sceneCtx.moveTo(w * 0.72, h);
  sceneCtx.lineTo(w * 0.55, floorTop);
  sceneCtx.stroke();

  sceneCtx.strokeStyle = "rgba(255, 255, 255, 0.36)";
  sceneCtx.lineWidth = Math.max(2, w * 0.004);
  for (let y = floorTop - offset; y < h + 100; y += 90) {
    const scale = (y - floorTop) / Math.max(1, h - floorTop);
    const left = w * (0.45 - scale * 0.24);
    const right = w * (0.55 + scale * 0.24);
    sceneCtx.beginPath();
    sceneCtx.moveTo(left, y);
    sceneCtx.lineTo(right, y);
    sceneCtx.stroke();
  }
}

function drawTrainInterior(station, w, h, t) {
  const pad = Math.min(w, h) * 0.025;
  sceneCtx.save();
  sceneCtx.fillStyle = "rgba(255, 250, 241, 0.05)";
  sceneCtx.fillRect(0, 0, w, h);

  const frameGradient = sceneCtx.createLinearGradient(0, 0, 0, h);
  frameGradient.addColorStop(0, "rgba(255, 250, 241, 0.52)");
  frameGradient.addColorStop(1, "rgba(255, 178, 88, 0.18)");
  sceneCtx.strokeStyle = frameGradient;
  sceneCtx.lineWidth = Math.max(10, pad * 1.2);
  roundRect(sceneCtx, pad, pad, w - pad * 2, h - pad * 2, 22);
  sceneCtx.stroke();

  sceneCtx.globalAlpha = 0.7;
  drawWindowReflection(w, h, t);
  sceneCtx.globalAlpha = 1;

  const sillY = h * 0.94;
  const sill = sceneCtx.createLinearGradient(0, sillY, 0, h);
  sill.addColorStop(0, "rgba(255, 250, 241, 0.58)");
  sill.addColorStop(1, "rgba(255, 211, 77, 0.26)");
  sceneCtx.fillStyle = sill;
  sceneCtx.fillRect(0, sillY, w, h - sillY);

  sceneCtx.fillStyle = "rgba(255, 255, 255, 0.55)";
  roundRect(sceneCtx, w * 0.12, sillY + 7, w * 0.28, Math.max(5, h * 0.012), 8);
  sceneCtx.fill();

  sceneCtx.fillStyle = station.warm;
  roundRect(sceneCtx, w * 0.72, sillY + 8, w * 0.16, Math.max(5, h * 0.011), 8);
  sceneCtx.fill();
  sceneCtx.restore();
}

function drawWindowReflection(w, h, t) {
  sceneCtx.strokeStyle = "rgba(255, 255, 255, 0.24)";
  sceneCtx.lineWidth = Math.max(1.5, w * 0.0028);
  for (let i = 0; i < 3; i += 1) {
    const x = w * (0.26 + i * 0.18) + Math.sin(t * 0.35 + i) * 6;
    sceneCtx.beginPath();
    sceneCtx.moveTo(x, h * 0.12);
    sceneCtx.lineTo(x + w * 0.1, h * 0.45);
    sceneCtx.stroke();
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function lighten(hex, amount) {
  const value = hex.replace("#", "");
  const number = parseInt(value, 16);
  const r = Math.min(255, Math.round(((number >> 16) & 255) + 255 * amount));
  const g = Math.min(255, Math.round(((number >> 8) & 255) + 255 * amount));
  const b = Math.min(255, Math.round((number & 255) + 255 * amount));
  return `rgb(${r}, ${g}, ${b})`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1500);
}

function ensureAudio() {
  if (muted) return false;
  if (!audioCtx) {
    const AudioConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioConstructor) {
      muted = true;
      writeStorage(STORAGE_KEYS.sound, "off");
      updateSoundButton();
      showToast("Звук недоступен");
      return false;
    }
    audioCtx = new AudioConstructor();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(audioCtx.destination);
  }
  return true;
}

function resumeAudio() {
  if (muted) return Promise.resolve(false);
  if (!ensureAudio() || !audioCtx) return Promise.resolve(false);
  if (audioCtx.state === "suspended") {
    return audioCtx
      .resume()
      .then(() => {
        return true;
      })
      .catch(() => {
        showToast("Нажмите звук еще раз");
        return false;
      });
  }
  return Promise.resolve(true);
}

function playEffect(name) {
  if (muted) return;
  ensureAudio();
  if (!audioCtx || !masterGain) return;

  const effects = {
    rotate: [500, 0.045, "triangle", 0.014],
    land: [170, 0.055, "sine", 0.018],
    drop: [145, 0.075, "sawtooth", 0.022],
    clear: [660, 0.11, "triangle", 0.04],
    level: [820, 0.16, "triangle", 0.045],
    start: [523, 0.12, "triangle", 0.026],
    gameover: [120, 0.2, "sine", 0.034]
  };
  const effect = effects[name];
  if (!effect) return;
  playTone(effect[0], effect[1], effect[2], effect[3]);
  if (name === "clear" || name === "level") {
    window.setTimeout(() => playTone(effect[0] * 1.25, effect[1] * 0.8, effect[2], effect[3] * 0.75), 90);
  }
}

function playTone(frequency, duration, type, gainValue) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function updateSoundButton() {
  muteButton.setAttribute("aria-label", muted ? "Звук выключен" : "Звук включен");
  muteButton.querySelector("span").textContent = muted ? "♪/" : "♪";
}

function toggleSound() {
  muted = !muted;
  writeStorage(STORAGE_KEYS.sound, muted ? "off" : "on");
  updateSoundButton();
  if (!muted) {
    resumeAudio().then((isReady) => {
      if (isReady) playEffect("start");
    });
  }
}

function toggleScenery() {
  sceneryPaused = !sceneryPaused;
  writeStorage(STORAGE_KEYS.scenery, sceneryPaused ? "paused" : "moving");
  showToast(sceneryPaused ? "Вид остановлен" : "Вид едет");
}

function canToggleSceneryFrom(target) {
  if (!(target instanceof Element)) return false;
  return (
    target === sceneCanvas ||
    target === document.body ||
    target === document.documentElement ||
    target.classList.contains("app-shell") ||
    target.classList.contains("play-layout") ||
    target.classList.contains("board-zone")
  );
}

function handleAction(action) {
  resumeAudio();
  if (action === "left") movePlayer(-1);
  if (action === "right") movePlayer(1);
  if (action === "rotate") rotatePlayer();
  if (action === "down") softDrop();
  if (action === "drop") hardDrop();
}

function bindControls() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    const action = button.dataset.action;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      resumeAudio();
      handleAction(action);
      if (action === "down") {
        softDropTimer = window.setInterval(() => handleAction("down"), 95);
      }
      if (action === "left" || action === "right") {
        horizontalTimer = window.setInterval(() => handleAction(action), 105);
      }
    });
    button.addEventListener("pointerup", clearHoldTimers);
    button.addEventListener("pointerleave", clearHoldTimers);
    button.addEventListener("pointercancel", clearHoldTimers);
    button.addEventListener("lostpointercapture", clearHoldTimers);
  });

  gameCanvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    resumeAudio();
    touchMoveDebt = 0;
    touchDropMark = event.clientY;
    touchStart = {
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      moved: false
    };
    if (gameCanvas.setPointerCapture && !gameCanvas.hasPointerCapture?.(event.pointerId)) {
      gameCanvas.setPointerCapture(event.pointerId);
    }
  });

  gameCanvas.addEventListener("pointermove", (event) => {
    if (!touchStart) return;
    event.preventDefault();
    const cellStep = Math.max(18, boardMetrics.cell * 0.62);
    touchMoveDebt += event.clientX - touchStart.lastX;
    touchStart.lastX = event.clientX;

    while (touchMoveDebt >= cellStep) {
      movePlayer(1);
      touchMoveDebt -= cellStep;
      touchStart.moved = true;
    }

    while (touchMoveDebt <= -cellStep) {
      movePlayer(-1);
      touchMoveDebt += cellStep;
      touchStart.moved = true;
    }

    const dropStep = Math.max(22, boardMetrics.cell * 0.82);
    if (event.clientY - touchDropMark >= dropStep) {
      softDrop();
      touchDropMark = event.clientY;
      touchStart.moved = true;
    }
  });

  gameCanvas.addEventListener("pointerup", (event) => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    const wasDrag = touchStart.moved;
    touchStart = null;
    touchMoveDebt = 0;

    if (gameCanvas.releasePointerCapture && gameCanvas.hasPointerCapture?.(event.pointerId)) {
      gameCanvas.releasePointerCapture(event.pointerId);
    }

    if (wasDrag) {
      return;
    }

    if (Math.abs(dx) < 22 && Math.abs(dy) < 22) {
      rotatePlayer();
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      movePlayer(dx > 0 ? 1 : -1);
    } else if (dy > 0) {
      softDrop();
    } else {
      rotatePlayer();
    }
  });

  gameCanvas.addEventListener("pointercancel", () => {
    touchStart = null;
    touchMoveDebt = 0;
  });

  document.addEventListener("click", (event) => {
    if (canToggleSceneryFrom(event.target)) {
      resumeAudio();
      toggleScenery();
    }
  });

  window.addEventListener(
    "pointerdown",
    () => {
      resumeAudio();
    },
    { passive: true }
  );
  window.addEventListener("pointerup", clearHoldTimers);
  window.addEventListener("pointercancel", clearHoldTimers);
  window.addEventListener("blur", clearHoldTimers);

  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "Enter"].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === "ArrowLeft") movePlayer(-1);
    if (event.key === "ArrowRight") movePlayer(1);
    if (event.key === "ArrowDown") softDrop();
    if (event.key === "ArrowUp") rotatePlayer();
    if (event.key === " ") hardDrop();
    if (event.key.toLowerCase() === "p" || event.key === "Escape") togglePause();
    if (event.key === "Enter" && (!running || gameOver)) newGame();
  });

  startButton.addEventListener("click", newGame);
  restartButton.addEventListener("click", newGame);
  newGameButton.addEventListener("click", newGame);
  resumeButton.addEventListener("click", () => togglePause(false));
  pauseButton.addEventListener("click", () => togglePause());
  muteButton.addEventListener("click", toggleSound);
  window.addEventListener("resize", () => {
    resizeAll();
    drawNext();
  });
}

function clearHoldTimers() {
  if (softDropTimer) {
    clearInterval(softDropTimer);
    softDropTimer = 0;
  }
  if (horizontalTimer) {
    clearInterval(horizontalTimer);
    horizontalTimer = 0;
  }
}

function init() {
  nextPiece = makePiece(nextType());
  renderRoute();
  setTheme();
  updateHud();
  updateSoundButton();
  pauseButton.disabled = true;
  resizeAll();
  drawNext();
  bindControls();
  requestAnimationFrame(update);
}

init();
