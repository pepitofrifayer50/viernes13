// ======================
// REFERENCIAS
// ======================
const deviceSelect = document.getElementById("deviceSelect");
const pcBtn = document.getElementById("pcBtn");
const mobileBtn = document.getElementById("mobileBtn");

const game = document.getElementById("game");
const player = document.getElementById("player");
const door = document.getElementById("door");
const doorHint = document.getElementById("doorHint");
const hint = document.getElementById("hint");
const path = document.getElementById("path");

const mobileControls = document.getElementById("mobile-controls");
const final = document.getElementById("final");
const music = document.getElementById("music");

// ======================
// ESTADO
// ======================
let x = 0;
let y = 0;
const speed = 8;
let gameStarted = false;
let isMobile = false;

// ======================
// BOTÓN ABRIR (MÓVIL)
// ======================
const openBtn = document.createElement("button");
openBtn.innerText = "💗 Abrir";
openBtn.style.display = "none";
openBtn.style.position = "fixed";
openBtn.style.bottom = "110px";
openBtn.style.left = "50%";
openBtn.style.transform = "translateX(-50%)";
openBtn.style.padding = "12px 22px";
openBtn.style.fontSize = "16px";
openBtn.style.borderRadius = "25px";
openBtn.style.border = "none";
openBtn.style.background = "#ffb6c1";
openBtn.style.color = "#7a3e50";
openBtn.style.zIndex = "999";
document.body.appendChild(openBtn);

openBtn.addEventListener("click", openDoor);

// ======================
// POSICIONES INICIALES
// ======================
function placeDoor() {
  const pathRect = path.getBoundingClientRect();

  door.style.left = pathRect.right - 70 + "px";
  door.style.top = pathRect.bottom - 110 + "px";
}

function resetPlayer() {
  const pathRect = path.getBoundingClientRect();

  x = pathRect.left + 20;
  y = pathRect.top + 20;

  updatePlayer();
  placeDoor();
}

// ======================
// MOVIMIENTO
// ======================
function updatePlayer() {
  const pathRect = path.getBoundingClientRect();

  // 🔒 limitar al camino
  x = Math.max(pathRect.left, Math.min(pathRect.right - 30, x));
  y = Math.max(pathRect.top, Math.min(pathRect.bottom - 30, y));

  player.style.left = x + "px";
  player.style.top = y + "px";

  const touchingDoor = checkDoor();

  doorHint.style.opacity = touchingDoor && !isMobile ? "1" : "0";
  openBtn.style.display = touchingDoor && isMobile ? "block" : "none";
}

// ======================
// COLISIÓN PUERTA
// ======================
function checkDoor() {
  const p = player.getBoundingClientRect();
  const d = door.getBoundingClientRect();

  return (
    p.right > d.left &&
    p.left < d.right &&
    p.bottom > d.top &&
    p.top < d.bottom
  );
}

// ======================
// ABRIR PUERTA
// ======================
function openDoor() {
  if (!checkDoor()) return;

  game.style.display = "none";
  final.classList.remove("hidden");
  music.play();
}

// ======================
// SELECCIÓN DISPOSITIVO
// ======================
pcBtn.addEventListener("click", () => {
  isMobile = false;
  deviceSelect.style.display = "none";
  mobileControls.style.display = "none";
  hint.innerText = "Usa W A S D para moverte — E para abrir";
  gameStarted = true;
  resetPlayer();
});

mobileBtn.addEventListener("click", () => {
  isMobile = true;
  deviceSelect.style.display = "none";
  mobileControls.style.display = "block";
  hint.innerText = "Usa las flechas para moverte";
  gameStarted = true;
  resetPlayer();
});

// ======================
// CONTROLES PC
// ======================
document.addEventListener("keydown", (e) => {
  if (!gameStarted || isMobile) return;

  switch (e.key.toLowerCase()) {
    case "w": y -= speed; break;
    case "s": y += speed; break;
    case "a": x -= speed; break;
    case "d": x += speed; break;
    case "e":
      if (checkDoor()) openDoor();
      return;
    default:
      return;
  }

  updatePlayer();
});

// ======================
// CONTROLES MÓVIL
// ======================
document.querySelectorAll("#mobile-controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!gameStarted || !isMobile) return;

    const dir = btn.dataset.dir;
    if (dir === "up") y -= speed;
    if (dir === "down") y += speed;
    if (dir === "left") x -= speed;
    if (dir === "right") x += speed;

    updatePlayer();
  });
});

// ======================
// REAJUSTE AL REDIMENSIONAR
// ======================
window.addEventListener("resize", () => {
  if (gameStarted) {
    resetPlayer();
  }
});
