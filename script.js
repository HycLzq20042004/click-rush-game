const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const timeEl = document.querySelector("#time");
const bestEl = document.querySelector("#best");
const overlay = document.querySelector("#overlay");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const leaderboardList = document.querySelector("#leaderboardList");
const clearLeaderboardButton = document.querySelector("#clearLeaderboardButton");
const playerNameInput = document.querySelector("#playerNameInput");
const soundToggle = document.querySelector("#soundToggle");
const soundButton = document.querySelector("#soundButton");
const difficultyButtons = [...document.querySelectorAll("[data-difficulty]")];
const resultPanel = document.querySelector("#resultPanel");
const resultPlayer = document.querySelector("#resultPlayer");
const resultScore = document.querySelector("#resultScore");
const resultBosses = document.querySelector("#resultBosses");
const resultCombo = document.querySelector("#resultCombo");
const resultDifficulty = document.querySelector("#resultDifficulty");
const bossIcon = document.querySelector("#bossIcon");
const bossStage = document.querySelector("#bossStage");
const bossName = document.querySelector("#bossName");
const bossHealthText = document.querySelector("#bossHealthText");
const bossHealthFill = document.querySelector("#bossHealthFill");
const bossDamageText = document.querySelector("#bossDamageText");

const difficulties = {
  easy: {
    label: "Easy",
    duration: 35,
    radiusMin: 24,
    radiusRange: 24,
    missPenalty: 1,
    hpMultiplier: 0.75,
    damageMultiplier: 2.15,
    scoreMultiplier: 0.9,
  },
  normal: {
    label: "Normal",
    duration: 30,
    radiusMin: 18,
    radiusRange: 30,
    missPenalty: 2,
    hpMultiplier: 1,
    damageMultiplier: 1.8,
    scoreMultiplier: 1,
  },
  hard: {
    label: "Hard",
    duration: 25,
    radiusMin: 14,
    radiusRange: 24,
    missPenalty: 4,
    hpMultiplier: 1.25,
    damageMultiplier: 1.55,
    scoreMultiplier: 1.25,
  },
};

const bosses = [
  { name: "Scarlet Fox", icon: "FOX", baseHp: 360, className: "fox" },
  { name: "Moss Bear", icon: "BEAR", baseHp: 620, className: "bear" },
  { name: "Thunder Tiger", icon: "TIGER", baseHp: 900, className: "tiger" },
];

const game = {
  running: false,
  score: 0,
  timeLeft: difficulties.normal.duration,
  target: null,
  difficulty: "normal",
  playerName: "Player",
  combo: 0,
  bestCombo: 0,
  bossIndex: 0,
  bossHp: 0,
  bossesDefeated: 0,
  timerId: null,
  animationId: null,
  audioContext: null,
};

const bestKey = "click-rush-best";
const leaderboardKey = "click-rush-leaderboard";
const playerNameKey = "click-rush-player-name";
const difficultyKey = "click-rush-difficulty";
const soundKey = "click-rush-sound-enabled";

function getDifficulty() {
  return difficulties[game.difficulty];
}

function bossMaxHp(index = game.bossIndex) {
  const boss = bosses[Math.min(index, bosses.length - 1)];
  return Math.round(boss.baseHp * getDifficulty().hpMultiplier);
}

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(leaderboardKey)) || [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(leaderboardKey, JSON.stringify(entries));
}

function updateBestScore() {
  const scores = getLeaderboard().map((entry) => entry.score);
  const storedBest = Number(localStorage.getItem(bestKey) || 0);
  bestEl.textContent = Math.max(storedBest, ...scores, 0);
}

function renderLeaderboard() {
  const entries = getLeaderboard();
  leaderboardList.innerHTML = "";

  if (entries.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-rank";
    emptyItem.textContent = "No scores yet. Play a round to set the pace.";
    leaderboardList.appendChild(emptyItem);
    updateBestScore();
    return;
  }

  entries.forEach((entry, index) => {
    const item = document.createElement("li");
    const name = entry.name || "Player";
    const difficulty = entry.difficulty || "Normal";
    item.innerHTML = `<span>#${index + 1} <strong>${name}</strong> ${entry.score} pts</span><span>${difficulty} · ${entry.date}</span>`;
    leaderboardList.appendChild(item);
  });

  updateBestScore();
}

function addLeaderboardEntry(score) {
  const entry = {
    name: game.playerName,
    score,
    difficulty: getDifficulty().label,
    bosses: game.bossesDefeated,
    combo: game.bestCombo,
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  const entries = [...getLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  saveLeaderboard(entries);
  return entries.findIndex((rankedEntry) => rankedEntry === entry) + 1;
}

function currentBoss() {
  return bosses[Math.min(game.bossIndex, bosses.length - 1)];
}

function renderBoss() {
  const boss = currentBoss();
  const hp = Math.max(0, game.bossHp);
  const maxHp = bossMaxHp();
  const hpPercent = boss ? (hp / maxHp) * 100 : 0;

  bossIcon.className = `boss-icon ${game.bossIndex >= bosses.length ? "cleared" : boss.className}`;
  bossIcon.textContent = game.bossIndex >= bosses.length ? "KO" : boss.icon;
  bossStage.textContent = game.bossIndex >= bosses.length
    ? "All clear"
    : `Boss ${game.bossIndex + 1} / ${bosses.length}`;
  bossName.textContent = game.bossIndex >= bosses.length ? "Boss Rush Cleared" : boss.name;
  bossHealthText.textContent = game.bossIndex >= bosses.length
    ? `${game.bossesDefeated} defeated`
    : `${hp} / ${maxHp} HP`;
  bossHealthFill.style.width = `${Math.max(0, Math.min(100, hpPercent))}%`;
}

function resetBosses() {
  game.bossIndex = 0;
  game.bossesDefeated = 0;
  game.bossHp = bossMaxHp(0);
  bossDamageText.textContent = "";
  renderBoss();
}

function showBossDamage(damage) {
  bossDamageText.textContent = `-${damage} HP`;
  bossDamageText.classList.remove("pop");
  bossIcon.classList.add("hit");
  bossHealthFill.classList.add("hit");

  requestAnimationFrame(() => bossDamageText.classList.add("pop"));
  setTimeout(() => {
    bossIcon.classList.remove("hit");
    bossHealthFill.classList.remove("hit");
  }, 160);
}

function damageBoss(points) {
  if (game.bossIndex >= bosses.length) return;

  const comboBoost = Math.min(0.75, game.combo * 0.04);
  const damage = Math.max(12, Math.round(points * getDifficulty().damageMultiplier * (1 + comboBoost)));
  game.bossHp = Math.max(0, game.bossHp - damage);
  showBossDamage(damage);
  playSound("hit");

  if (game.bossHp === 0) {
    game.bossesDefeated += 1;
    game.score += 75 + game.bossIndex * 50;
    scoreEl.textContent = game.score;
    game.bossIndex += 1;
    playSound("boss");

    if (game.bossIndex < bosses.length) {
      game.bossHp = bossMaxHp(game.bossIndex);
    }
  }

  renderBoss();
}

function getPlayerName() {
  const trimmedName = playerNameInput.value.trim().slice(0, 14);
  return trimmedName || "Player";
}

function setDifficulty(difficulty) {
  if (!difficulties[difficulty]) return;
  game.difficulty = difficulty;
  localStorage.setItem(difficultyKey, difficulty);
  difficultyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.difficulty === difficulty);
  });

  if (!game.running) {
    game.timeLeft = getDifficulty().duration;
    timeEl.textContent = game.timeLeft;
    resetBosses();
  }
}

function setSoundEnabled(enabled) {
  soundToggle.checked = enabled;
  soundButton.textContent = enabled ? "Sound On" : "Sound Off";
  localStorage.setItem(soundKey, enabled ? "true" : "false");
}

function playSound(type) {
  if (!soundToggle.checked) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!game.audioContext) game.audioContext = new AudioContext();

  const settings = {
    hit: { frequency: 520, duration: 0.05, gain: 0.045 },
    miss: { frequency: 160, duration: 0.08, gain: 0.035 },
    boss: { frequency: 760, duration: 0.16, gain: 0.055 },
    start: { frequency: 420, duration: 0.1, gain: 0.04 },
  }[type];

  const oscillator = game.audioContext.createOscillator();
  const gainNode = game.audioContext.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.value = settings.frequency;
  gainNode.gain.setValueAtTime(settings.gain, game.audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, game.audioContext.currentTime + settings.duration);
  oscillator.connect(gainNode);
  gainNode.connect(game.audioContext.destination);
  oscillator.start();
  oscillator.stop(game.audioContext.currentTime + settings.duration);
}

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
  const difficulty = getDifficulty();
  const radius = Math.floor(difficulty.radiusMin + Math.random() * difficulty.radiusRange);
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
  game.playerName = getPlayerName();
  game.score = 0;
  game.combo = 0;
  game.bestCombo = 0;
  game.timeLeft = getDifficulty().duration;
  game.target = randomTarget();
  localStorage.setItem(playerNameKey, game.playerName);
  resetBosses();
  scoreEl.textContent = game.score;
  timeEl.textContent = game.timeLeft;
  resultPanel.classList.add("hidden");
  overlay.classList.add("hidden");
  playSound("start");

  game.timerId = setInterval(() => {
    game.timeLeft -= 1;
    timeEl.textContent = game.timeLeft;
    if (game.timeLeft <= 0) endGame();
  }, 1000);

  loop();
}

function renderResults(rank) {
  resultPlayer.textContent = game.playerName;
  resultScore.textContent = game.score;
  resultBosses.textContent = `${game.bossesDefeated} / ${bosses.length}`;
  resultCombo.textContent = `x${game.bestCombo}`;
  resultDifficulty.textContent = getDifficulty().label;
  resultPanel.classList.remove("hidden");

  overlay.querySelector("h1").textContent = rank === 1 ? "New Top Score" : "Time Up";
  overlay.querySelector("p").textContent = rank
    ? `${game.playerName}, you reached #${rank} on the local leaderboard.`
    : `${game.playerName}, try another run to beat your best.`;
  startButton.textContent = "Play Again";
}

function endGame() {
  if (!game.running) return;
  game.running = false;
  clearInterval(game.timerId);
  cancelAnimationFrame(game.animationId);

  const rank = addLeaderboardEntry(game.score);
  const best = Number(localStorage.getItem(bestKey) || 0);
  if (game.score > best) {
    localStorage.setItem(bestKey, String(game.score));
  }
  renderLeaderboard();
  renderResults(rank);
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

function drawCombo() {
  if (!game.running || game.combo < 2) return;

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 22px Arial";
  ctx.fillText(`Combo x${game.combo}`, 18, 34);
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  drawBackground(rect.width, rect.height);
  drawCombo();

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
    const difficulty = getDifficulty();
    const basePoints = Math.max(1, Math.round(55 - game.target.radius));
    const points = Math.round(basePoints * difficulty.scoreMultiplier);
    game.combo += 1;
    game.bestCombo = Math.max(game.bestCombo, game.combo);
    game.score += points;
    damageBoss(points);
    scoreEl.textContent = game.score;
    game.target = randomTarget();
  } else {
    game.combo = 0;
    game.score = Math.max(0, game.score - getDifficulty().missPenalty);
    scoreEl.textContent = game.score;
    playSound("miss");
  }
}

function restoreSettings() {
  playerNameInput.value = localStorage.getItem(playerNameKey) || "";
  const savedDifficulty = localStorage.getItem(difficultyKey) || "normal";
  const savedSound = localStorage.getItem(soundKey);
  setSoundEnabled(savedSound !== "false");
  setDifficulty(savedDifficulty);
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
canvas.addEventListener("click", clickTarget);
window.addEventListener("resize", resizeCanvas);
clearLeaderboardButton.addEventListener("click", () => {
  localStorage.removeItem(leaderboardKey);
  localStorage.removeItem(bestKey);
  renderLeaderboard();
});
soundToggle.addEventListener("change", () => setSoundEnabled(soundToggle.checked));
soundButton.addEventListener("click", () => setSoundEnabled(!soundToggle.checked));
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
});

restoreSettings();
renderLeaderboard();
renderBoss();
resizeCanvas();
