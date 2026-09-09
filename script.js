const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');

let animationProgress = 0;
let animationId = null;

// Configuração do Buquê
const bouquet = {
  leaves: [
    { x: 190, y: 190, rx: 65, ry: 30, rotation: -0.6, color: '#88d812', stroke: '#5fa005' },
    { x: 180, y: 260, rx: 70, ry: 32, rotation: -0.2, color: '#88d812', stroke: '#5fa005' },
    { x: 195, y: 135, rx: 60, ry: 28, rotation: -0.9, color: '#a2e825', stroke: '#5fa005' },
    { x: 230, y: 110, rx: 55, ry: 26, rotation: -1.2, color: '#88d812', stroke: '#5fa005' }
  ],
  flowers: [
    {
      cx: 285, cy: 195, petalRadius: 30, centerRadius: 22,
      petalColor: '#ff7139', centerColor: '#fcd328', stroke: '#d64210',
      petals: [0, 60, 120, 180, 240, 300]
    },
    {
      cx: 375, cy: 155, petalRadius: 32, centerRadius: 24,
      petalColor: '#a76eff', centerColor: '#fcd328', stroke: '#733bc4',
      petals: [0, 60, 120, 180, 240, 300]
    },
    {
      cx: 460, cy: 190, petalRadius: 30, centerRadius: 22,
      petalColor: '#ff3b30', centerColor: '#fcd328', stroke: '#b81910',
      petals: [0, 60, 120, 180, 240, 300]
    },
    {
      cx: 310, cy: 260, petalRadius: 31, centerRadius: 23,
      petalColor: '#ff8fb3', centerColor: '#fcd328', stroke: '#d85880',
      petals: [0, 60, 120, 180, 240, 300]
    },
    {
      cx: 415, cy: 245, petalRadius: 31, centerRadius: 23,
      petalColor: '#53baff', centerColor: '#fcd328', stroke: '#1f85cc',
      petals: [0, 60, 120, 180, 240, 300]
    }
  ]
};

let floatingParticles = [];

function initParticles() {
  floatingParticles = [];
  for (let i = 0; i < 25; i++) {
    floatingParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 0.8 + 0.2,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      type: Math.random() > 0.4 ? 'heart' : 'sparkle'
    });
  }
}

function drawHeart(x, y, size, color, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  ctx.fill();
  ctx.restore();
}

function updateAndDrawParticles() {
  floatingParticles.forEach(p => {
    p.y -= p.speedY;
    p.x += p.speedX;

    if (p.y < -20) {
      p.y = canvas.height + 20;
      p.x = Math.random() * canvas.width;
    }

    if (p.type === 'heart') {
      drawHeart(p.x, p.y, p.size, '#ffb6c1', p.opacity);
    } else {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
}

function drawBouquet(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#5d2875';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updateAndDrawParticles();

  // 1. Folhas
  const leafProg = Math.min(1, Math.max(0, progress / 0.25));
  if (leafProg > 0) {
    bouquet.leaves.forEach(leaf => {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.scale(leafProg, leafProg);

      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.rx, leaf.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = leaf.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = leaf.stroke;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-leaf.rx + 5, 0);
      ctx.lineTo(leaf.rx - 5, 0);
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    });
  }

  // 2. Embrulho
  const wrapProg = Math.min(1, Math.max(0, (progress - 0.25) / 0.25));
  if (wrapProg > 0) {
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(300, 480);
    
    const lx = 300 - 105 * wrapProg;
    const ly = 480 - 210 * wrapProg;
    ctx.quadraticCurveTo(240, 380, lx, ly);
    ctx.quadraticCurveTo(300, 310, 300 + 105 * wrapProg, ly);
    ctx.quadraticCurveTo(360, 380, 300, 480);

    ctx.fillStyle = '#e2ab6f';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#a86f38';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(300, 480);
    ctx.lineTo(250, 310);
    ctx.moveTo(300, 480);
    ctx.lineTo(350, 310);
    ctx.strokeStyle = '#c68d52';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // 3. Flores
  const flowerProg = Math.min(1, Math.max(0, (progress - 0.50) / 0.30));
  if (flowerProg > 0) {
    bouquet.flowers.forEach((flower, fIndex) => {
      const delay = fIndex * 0.15;
      const individualProg = Math.min(1, Math.max(0, (flowerProg - delay) / 0.4));

      if (individualProg > 0) {
        ctx.save();
        ctx.translate(flower.cx, flower.cy);
        
        const scale = individualProg < 0.8 ? individualProg * 1.1 : 1;
        ctx.scale(scale, scale);

        flower.petals.forEach(angle => {
          const rad = (angle * Math.PI) / 180;
          const px = Math.cos(rad) * flower.petalRadius;
          const py = Math.sin(rad) * flower.petalRadius;

          ctx.beginPath();
          ctx.arc(px, py, flower.petalRadius * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = flower.petalColor;
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = flower.stroke;
          ctx.stroke();
        });

        ctx.beginPath();
        ctx.arc(0, 0, flower.centerRadius, 0, Math.PI * 2);
        ctx.fillStyle = flower.centerColor;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#d4a100';
        ctx.stroke();

        ctx.restore();
      }
    });
  }

  // 4. Laço
  const bowProg = Math.min(1, Math.max(0, (progress - 0.80) / 0.10));
  if (bowProg > 0) {
    ctx.save();
    ctx.translate(300, 450);
    ctx.scale(bowProg, bowProg);

    ctx.beginPath();
    ctx.moveTo(-10, 10);
    ctx.quadraticCurveTo(-25, 40, -35, 70);
    ctx.quadraticCurveTo(-15, 65, 0, 15);
    ctx.fillStyle = '#ff5388';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.quadraticCurveTo(25, 40, 35, 70);
    ctx.quadraticCurveTo(15, 65, 0, 15);
    ctx.fillStyle = '#ff5388';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(-30, -5, 32, 22, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b9a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#c42858';
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(30, -5, 32, 22, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b9a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#c42858';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -3, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3370';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#a3103c';
    ctx.stroke();

    ctx.restore();
  }

  // 5. Mensagem personalizada "t + a = <3"
  const textProg = Math.min(1, Math.max(0, (progress - 0.90) / 0.10));
  if (textProg > 0) {
    ctx.save();
    ctx.font = 'bold 52px "Fredoka", "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fullText = "teamo ";
    const charsToDraw = Math.floor(fullText.length * textProg);
    const currentText = fullText.substring(0, charsToDraw);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    ctx.fillStyle = '#fce2db';
    ctx.fillText(currentText, 300, 565);

    ctx.restore;
  }
}

function animate() {
  animationProgress += 0.005;

  if (animationProgress > 1) {
    animationProgress = 1;
    drawBouquet(1);
    return;
  }

  drawBouquet(animationProgress);
  animationId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (animationId) cancelAnimationFrame(animationId);
  animationProgress = 0;
  initParticles();
  animate();
}

window.onload = startAnimation;

