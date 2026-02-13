const player = document.getElementById("player");
const door = document.getElementById("door");
const doorHint = document.getElementById("doorHint");
const game = document.getElementById("game");
const final = document.getElementById("final");
const music = document.getElementById("music");

const mobileControls = document.getElementById("mobileControls");
const hint = document.getElementById("hint");

const deviceSelect = document.getElementById("deviceSelect");
const pcBtn = document.getElementById("pcBtn");
const mobileBtn = document.getElementById("mobileBtn");

/* =============================
   CONFIGURACIÓN INICIAL
============================= */

let gameStarted = false; // Bloquea el juego hasta elegir dispositivo

let x = 120;
let y = 120;
const speed = 8;

/* Ocultar controles móviles al inicio */
mobileControls.classList.add("hidden");

/* =============================
   SELECCIÓN DE DISPOSITIVO
============================= */

/* PC */
pcBtn.addEventListener("click", () => {
  deviceSelect.style.display = "none";
  mobileControls.classList.add("hidden"); // 👈 CLAVE
  mobileControls.style.display = "none";
  hint.innerText = "Usa W A S D para moverte";
  gameStarted = true;
});

/* MÓVIL */
mobileBtn.addEventListener("click", () => {
  deviceSelect.style.display = "none";
  mobileControls.classList.remove("hidden");
  mobileControls.style.display = "flex";
  hint.innerText = "Usa las flechas para moverte";
  gameStarted = true;
});

/* =============================
   MOVIMIENTO CON TECLADO (PC)
============================= */

document.addEventListener("keydown", e => {
  if (!gameStarted) return;

  const key = e.key.toLowerCase();

  if (key === "w") y -= speed;
  if (key === "s") y += speed;
  if (key === "a") x -= speed;
  if (key === "d") x += speed;

  updatePlayer();

  if (key === "e" && checkDoor()) {
    openDoor();
  }
});

/* =============================
   CONTROLES MÓVILES
============================= */

mobileControls.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    move(btn.dataset.dir);
  });
});

function move(dir) {
  if (!gameStarted) return;

  if (dir === "up") y -= speed;
  if (dir === "down") y += speed;
  if (dir === "left") x -= speed;
  if (dir === "right") x += speed;

  updatePlayer();
}

/* =============================
   ACTUALIZAR POSICIÓN
============================= */

function updatePlayer() {
  x = Math.max(80, Math.min(window.innerWidth - 120, x));
  y = Math.max(80, Math.min(window.innerHeight - 180, y));

  player.style.left = x + "px";
  player.style.top = y + "px";

  doorHint.style.opacity = checkDoor() ? "1" : "0";
}

/* =============================
   COLISIÓN CON PUERTA
============================= */

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

/* =============================
   FINAL DEL JUEGO
============================= */

function openDoor() {
  game.style.display = "none";
  final.classList.remove("hidden");
  music.play();
}

function placeDoor() {
  const path = document.getElementById("path").getBoundingClientRect();
  door.style.left = path.right - 90 + "px";
  door.style.top = path.bottom - 110 + "px";
}

placeDoor();
window.addEventListener("resize", placeDoor);
