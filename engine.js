const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ---------------- INPUT ----------------
let left = false;
let right = false;
let up = false;

window.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "ArrowLeft") left = true;
  if (e.key === "d" || e.key === "ArrowRight") right = true;
  if (e.key === "w" || e.key === "ArrowUp" || e.key === " ") up = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "a" || e.key === "ArrowLeft") left = false;
  if (e.key === "d" || e.key === "ArrowRight") right = false;
  if (e.key === "w" || e.key === "ArrowUp" || e.key === " ") up = false;
});

// ---------------- PLAYER ----------------
const player = {
  x: 200,
  y: 200,
  w: 50,
  h: 50,
  vx: 0,
  vy: 0,
  grounded: false
};

// ---------------- WORLD ----------------
let groundY = 0;
let platforms = [];

let score = 0;
let highestRow = 0;

// ---------------- CAMERA (NEW FIX) ----------------
const camera = {
  x: 0,
  y: 0
};

const gravity = 0.75;
const maxSpeed = 6;

// ---------------- CORE UPDATE ----------------
function updateCore() {

  // movement
  if (left) player.vx -= 0.8;
  if (right) player.vx += 0.8;

  player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
  player.vx *= 0.88;

  if (up && player.grounded) {
    player.vy = -13;
    player.grounded = false;
  }

  player.vy += gravity;

  player.x += player.vx;
  player.y += player.vy;

  player.grounded = false;

  // ground
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.grounded = true;
  }

  // platforms + SCORE FIX
  for (let p of platforms) {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h > p.y &&
      player.y + player.h < p.y + p.h + 10 &&
      player.vy >= 0
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.grounded = true;

      let row = Math.floor((groundY - p.y) / 100);
      if (row > highestRow) {
        highestRow = row;
        score = highestRow * 2;
      }
    }
  }

  // CAMERA FOLLOWS PLAYER (FIXED FEELING)
  camera.x = player.x - canvas.width / 2;
  camera.y = player.y - canvas.height / 2;
}

// ---------------- DRAW HELPERS ----------------
function drawPlayer(color = "#3b82f6") {
  ctx.fillStyle = color;
  ctx.fillRect(
    player.x - camera.x,
    player.y - camera.y,
    player.w,
    player.h
  );
}

function drawPlatforms(color = "#8b5cf6") {
  ctx.fillStyle = color;
  for (let p of platforms) {
    ctx.fillRect(
      p.x - camera.x,
      p.y - camera.y,
      p.w,
      p.h
    );
  }
}

function drawGround(color = "#111") {
  ctx.fillStyle = color;
  ctx.fillRect(
    0,
    groundY - camera.y,
    canvas.width,
    canvas.height
  );
}

// ---------------- HUD ----------------
function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}
