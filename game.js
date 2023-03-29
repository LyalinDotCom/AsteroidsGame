const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const spaceship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    vx: 0,
    vy: 0,
    speed: 0.5,
    drag: 0.99
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
    ctx.beginPath();
    ctx.moveTo(spaceship.x, spaceship.y - spaceship.size);
    ctx.lineTo(spaceship.x + spaceship.size, spaceship.y + spaceship.size);
    ctx.lineTo(spaceship.x - spaceship.size, spaceship.y + spaceship.size);
    ctx.closePath();
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
    switch (event.key) {
      case 'ArrowUp':
        spaceship.vy -= spaceship.speed;
        break;
      case 'ArrowDown':
        spaceship.vy += spaceship.speed;
        break;
      case 'ArrowLeft':
        spaceship.vx -= spaceship.speed;
        break;
      case 'ArrowRight':
        spaceship.vx += spaceship.speed;
        break;
      case ' ':
        spaceship.vx *= 0.8;
        spaceship.vy *= 0.8;
        break;
    }
  });
  