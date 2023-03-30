const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const spaceship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    vx: 0,
    vy: 0,
    speed: 0.5,
    drag: 0.99,
    rotation: 0,
  };

function createAsteroid() {
    const size = 10 + Math.random() * 30;
    const vertexCount = 6 + Math.floor(Math.random() * 5);
    const vertices = [];
    const safeZoneRadius = spaceship.size * 3;
  
    for (let i = 0; i < vertexCount; i++) {
      const angle = (Math.PI * 2) * (i / vertexCount);
      const distance = size + Math.random() * size * 0.3;
      vertices.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    }
  
    let x, y;
    do {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    } while (Math.sqrt((spaceship.x - x) ** 2 + (spaceship.y - y) ** 2) < size + safeZoneRadius);
  
    return {
      x,
      y,
      size,
      vertices,
    };
  }  

const asteroids = [];
const asteroidCount = 50;

for (let i = 0; i < asteroidCount; i++) {
  asteroids.push(createAsteroid());
}

function drawSpaceshipShape() {
  ctx.save();
  ctx.translate(spaceship.x, spaceship.y);
  ctx.rotate(spaceship.rotation);

  // Draw the main body of the spaceship (saucer section)
  ctx.beginPath();
  ctx.ellipse(0, 0, spaceship.size * 0.8, spaceship.size, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Draw the ship's body (engineering section)
  ctx.beginPath();
  ctx.moveTo(-spaceship.size * 0.5, spaceship.size * 0.5);
  ctx.lineTo(spaceship.size * 0.5, spaceship.size * 0.5);
  ctx.lineTo(spaceship.size * 0.3, spaceship.size * 1.5);
  ctx.lineTo(-spaceship.size * 0.3, spaceship.size * 1.5);
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();

  // Draw the ship's nacelles
  ctx.beginPath();
  ctx.rect(-spaceship.size * 0.8, spaceship.size * 1.3, spaceship.size * 0.3, spaceship.size * 0.3);
  ctx.rect(spaceship.size * 0.5, spaceship.size * 1.3, spaceship.size * 0.3, spaceship.size * 0.3);
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.fill();

  ctx.restore();
}
  
function drawSpaceship() {
    ctx.fillStyle = 'white';
    drawSpaceshipShape();
    ctx.fill();
  }

function drawAsteroids() {
  ctx.fillStyle = 'gray';

  for (const asteroid of asteroids) {
    if (asteroid.vertices.length > 0) {
      ctx.beginPath();
      ctx.moveTo(asteroid.x + asteroid.vertices[0].x, asteroid.y + asteroid.vertices[0].y);

      for (const vertex of asteroid.vertices) {
        ctx.lineTo(asteroid.x + vertex.x, asteroid.y + vertex.y);
      }

      ctx.closePath();
      ctx.fill();
    }
  }
}

function isCollision(asteroid) {
  const dx = spaceship.x - asteroid.x;
  const dy = spaceship.y - asteroid.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < spaceship.size + asteroid.size;
}

function resetSpaceship() {
  spaceship.x = canvas.width / 2;
  spaceship.y = canvas.height / 2;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update spaceship position and velocity
  spaceship.x += spaceship.vx;
  spaceship.y += spaceship.vy;
  spaceship.vx *= spaceship.drag;
  spaceship.vy *= spaceship.drag;

  // Keep the spaceship within the canvas boundaries
  if (spaceship.x < 0) spaceship.x = 0;
  if (spaceship.x > canvas.width) spaceship.x = canvas.width;
  if (spaceship.y < 0) spaceship.y = 0;
  if (spaceship.y > canvas.height) spaceship.y = canvas.height;

  drawAsteroids();
  drawSpaceship();

  for (const asteroid of asteroids) {
    if (isCollision(asteroid)) {
      resetSpaceship();
      break;
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', (event) => {
  const rotationSpeed = 0.1;

  switch (event.key) {
    case 'w':
    case 'W':
      spaceship.vx += Math.cos(spaceship.rotation) * spaceship.speed;
      spaceship.vy += Math.sin(spaceship.rotation) * spaceship.speed;
      break;
    case 'ArrowUp':
      break;
    case 'ArrowDown':
      break;
    case 'ArrowLeft':
      spaceship.rotation -= rotationSpeed;
      break;
    case 'ArrowRight':
      spaceship.rotation += rotationSpeed;
      break;
    case ' ':
      spaceship.vx *= 0.8;
      spaceship.vy *= 0.8;
      break;
  }
});


  