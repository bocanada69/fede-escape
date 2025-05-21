const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajustar el canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Cargar imágenes
const imgFede = new Image();
imgFede.src = 'fede.png';

const imgPlataforma = new Image();
imgPlataforma.src = 'plataforma.png';

const imgEstrella = new Image();
imgEstrella.src = 'estrella.png';

// Variables del juego
let fede = {
  x: 100,
  y: canvas.height - 150,
  width: 50,
  height: 50,
  vy: 0,
  jumpStrength: 15,
  gravity: 0.8,
  onGround: false
};

let plataformas = [];
let estrellas = [];
let score = 0;
let gameSpeed = 5;

// Generar plataformas iniciales
for (let i = 0; i < 5; i++) {
  plataformas.push({
    x: i * 200,
    y: canvas.height - 100,
    width: 200,
    height: 20
  });
}

// Manejar entrada táctil y teclado
let touchStartY = 0;

function handleJump() {
  if (fede.onGround) {
    fede.vy = -fede.jumpStrength;
    fede.onGround = false;
  }
}

canvas.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
  let touchEndY = e.changedTouches[0].clientY;
  if (touchStartY - touchEndY > 30 || touchStartY === touchEndY) {
    handleJump();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    handleJump();
  }
});

// Generar estrellas
function generarEstrella(x, y) {
  estrellas.push({
    x: x,
    y: y - 50,
    width: 30,
    height: 30
  });
}

// Bucle principal del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar y mover plataformas
  plataformas.forEach((plat, i) => {
    plat.x -= gameSpeed;
    ctx.drawImage(imgPlataforma, plat.x, plat.y, plat.width, plat.height);

    // Generar nueva plataforma si es necesario
    if (plat.x + plat.width < 0) {
      let nuevaX = plataformas[plataformas.length - 1].x + 200;
      let nuevaY = canvas.height - 100 - Math.random() * 100;
      plataformas.push({
        x: nuevaX,
        y: nuevaY,
        width: 200,
        height: 20
      });
      plataformas.shift();

      // Generar estrella con probabilidad
      if (Math.random() < 0.5) {
        generarEstrella(nuevaX + 100, nuevaY);
      }
    }
  });

  // Dibujar y mover estrellas
  estrellas.forEach((est, i) => {
    est.x -= gameSpeed;
    ctx.drawImage(imgEstrella, est.x, est.y, est.width, est.height);

    // Colisión con Fede
    if (
      fede.x < est.x + est.width &&
      fede.x + fede.width > est.x &&
      fede.y < est.y + est.height &&
      fede.y + fede.height > est.y
    ) {
      estrellas.splice(i, 1);
      score += 10;
    }
  });

  // Aplicar gravedad a Fede
  fede.vy += fede.gravity;
  fede.y += fede.vy;

  // Verificar colisión con plataformas
  fede.onGround = false;
  plataformas.forEach((plat) => {
    if (
      fede.x < plat.x + plat.width &&
      fede.x + fede.width > plat.x &&
      fede.y + fede.height > plat.y &&
      fede.y + fede.height < plat.y + plat.height
    ) {
      fede.y = plat.y - fede.height;
      fede.vy = 0;
      fede.onGround = true;
    }
  });

  // Dibujar a Fede
  ctx.drawImage(imgFede, fede.x, fede.y, fede.width, fede.height);

  // Dibujar puntuación
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText('Puntuación: ' + score, 20, 30);

  requestAnimationFrame(gameLoop);
}

// Iniciar el juego cuando las imágenes estén cargadas
window.onload = function () {
  gameLoop();
};