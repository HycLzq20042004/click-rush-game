const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const timeEl = document.querySelector("#time");
const bestEl = document.querySelector("#best");
const overlay = document.querySelector("#overlay");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");

const game = {
  running: false,
  score: 0,
  timeLeft: 30,
  target: null,
  timerId: null,
  animationId: null,
};

const bestKey = "click-rush-best";
bestEl.textContent = localStorage.getItem(bestKey) || "0";

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  draw();
}

function randomTarget() {
  const rect = canvas.getBoundingClientRect();
  const radius = Math.floor(18 + Math.random() * 30);
  return {
    x: radius + Math.random() * (rect.width - radius * 2),
    y: radius + Math.random() * (rect.height - radius * 2),
    radius,
    pulse: 0,
    color: Math.random() > 0.45 ? "#e23d52" : "#0f9f9a",
  };
}

function startGame() {
  clearInterval(game.timerId);
  cancelAnimationFrame(game.animationId);

  game.running = true;
  game.score = 0;
  game.timeLeft = 30;
  game.target = randomTarget();
  scoreEl.textContent = game.score;
  timeEl.textContent = game.timeLeft;
  overlay.classList.add("hidden");

  game.timerId = setInterval(() => {
    game.timeLeft -= 1;
    timeEl.textContent = game.timeLeft;
    if (game.timeLeft <= 0) endGame();
  }, 1000);

  loop();
}

function endGame() {
  game.running = false;
  clearInterval(game.timerId);
  cancelAnimationFrame(game.animationId);

  const best = Number(localStorage.getItem(bestKey) || 0);
  if (game.score > best) {
    localStorage.setItem(bestKey, String(game.score));
    bestEl.textContent = game.score;
  }

  overlay.querySelector("h1").textContent = "Time Up";
  overlay.querySelector("p").textContent = `Final score: ${game.score}. Try to beat your best.`;
  startButton.textContent = "Play Again";
  overlay.classList.remove("hidden");
  draw();
}

function drawBackground(width, height) {
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  drawBackground(rect.width, rect.height);

  if (!game.target) return;

  const target = game.target;
  const glow = 8 + Math.sin(target.pulse) * 4;
  ctx.shadowBlur = 24 + glow;
  ctx.shadowColor = target.color;
  ctx.fillStyle = target.color;
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(target.x, target.y, Math.max(6, target.radius - 8), 0, Math.PI * 2);
  ctx.stroke();
}

function loop() {
  if (!game.running) return;
  game.target.pulse += 0.08;
  draw();
  game.animationId = requestAnimationFrame(loop);
}

function clickTarget(event) {
  if (!game.running || !game.target) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const dx = x - game.target.x;
  const dy = y - game.target.y;
  const distance = Math.hypot(dx, dy);

  if (distance <= game.target.radius) {
    const points = Math.max(1, Math.round(55 - game.target.radius));
    game.score += points;
    scoreEl.textContent = game.score;
    game.target = randomTarget();
  } else {
    game.score = Math.max(0, game.score - 2);
    scoreEl.textContent = game.score;
  }
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
canvas.addEventListener("click", clickTarget);
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
