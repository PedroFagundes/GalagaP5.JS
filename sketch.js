// --- Constantes de Configuração ---
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const ENEMY_SPAWN_RATE = 45; 

// --- Variáveis para os Assets ---
let imgPlayer;
let imgEnemy;
let imgBullet;
let imgFundo;

// --- Variáveis do Jogo ---
let player;
let enemies = [];
let bullets = [];
let score = 0;
let gameState = "START"; // Estados: START, PLAY, GAMEOVER

// --- Carregamento de Mídia ---
function preload() {
  // Carregamento preventivo para evitar bugs de renderização
  imgPlayer = loadImage('assets/image/starship.png'); 
  imgEnemy = loadImage('assets/image/starshipdark.png');
  imgBullet = loadImage('assets/image/intruderShot.png');
  imgFundo = loadImage('assets/image/space.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Inicialização do objeto jogador
  player = {
    x: width / 2,
    y: height - 60,
    w: 50,
    h: 50,
    speed: 6
  };
}

function draw() {
  // Máquina de Estados para controlar as telas do jogo
  if (gameState === "START") {
    displayStartScreen();
  } else if (gameState === "PLAY") {
    playGame();
  } else if (gameState === "GAMEOVER") {
    displayGameOver();
  }
}

// --- Lógica Principal do Jogo ---
function playGame() {
  // 1. Fundo 
  imageMode(CORNER);
  image(imgFundo, 0, 0, width, height);

  // 2. HUD: Pontuação
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);

  // 3. Jogador: Desenho e Movimento
  imageMode(CENTER);
  image(imgPlayer, player.x, player.y, player.w, player.h);

  if (keyIsDown(LEFT_ARROW) && player.x > player.w/2) {
    player.x -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) && player.x < width - player.w/2) {
    player.x += player.speed;
  }

  // 4. Gerenciar Projéteis (Arrays e Loops)
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y -= 8;
    image(imgBullet, b.x, b.y, 15, 30); 

    if (b.y < 0) {
      bullets.splice(i, 1); // Remoção para otimizar memória
    }
  }

  // 5. Inimigos: Criação e Colisão
  if (frameCount % ENEMY_SPAWN_RATE === 0) {
    spawnEnemy();
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.y += 3;
    
    // Desenha inimigo rotacionado para vir de cima
    push();
    translate(e.x, e.y);
    rotate(PI); 
    image(imgEnemy, 0, 0, 40, 40);
    pop();

    // Checar Colisão entre Tiro e Inimigo
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      if (dist(b.x, b.y, e.x, e.y) < 25) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        break;
      }
    }

    // Checar Condições de Game Over
    if (e.y > height || dist(e.x, e.y, player.x, player.y) < 35) {
      gameState = "GAMEOVER";
    }
  }
}

// --- Funções de Suporte ---

function spawnEnemy() {
  enemies.push({
    x: random(30, width - 30),
    y: -30
  });
}

function keyPressed() {
  if (gameState === "START" && key === ' ') {
    gameState = "PLAY";
  } else if (gameState === "PLAY" && (key === 'x' || key === 'X')) {
    bullets.push({ x: player.x, y: player.y - 20 });
  } else if (gameState === "GAMEOVER" && keyCode === ENTER) {
    restartGame();
  }
}

function restartGame() {
  score = 0;
  enemies = [];
  bullets = [];
  player.x = width / 2;
  gameState = "PLAY";
}

function displayStartScreen() {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("GALAGA: SPACE INTRUDER", width / 2, height / 2);
  textSize(16);
  text("Pressione ESPAÇO para iniciar", width / 2, height / 2 + 40);
  text("Use SETAS para mover e 'X' para atirar", width / 2, height / 2 + 70);
}

function displayGameOver() {
  fill(255, 0, 0);
  textAlign(CENTER);
  textSize(40);
  text("NAVE DESTRUÍDA", width / 2, height / 2);
  fill(255);
  textSize(20);
  text("Pontuação Final: " + score, width / 2, height / 2 + 40);
  text("Pressione ENTER para recomeçar", width / 2, height / 2 + 80);
}
