const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const projectsSection = document.getElementById('projects');

// Variables for particle color and speed
const particleColor = '#000';
const particleSpeed = 0.5;

function updateCanvasSize() {
    canvas.width = projectsSection.offsetWidth;
    canvas.height = projectsSection.offsetHeight;
}

updateCanvasSize();

class Particle {
    constructor(x, y, isTemp = false) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.speedX = Math.random() * particleSpeed * 2 - particleSpeed;
        this.speedY = Math.random() * particleSpeed * 2 - particleSpeed;
        this.isTemp = isTemp;
        this.lifespan = isTemp ? Math.random() * 20 + 20 : Infinity; // 0.02 to 0.04 seconds (assuming 60 fps)
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.isTemp) this.lifespan--;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    explode() {
        const explosionParticles = [];
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const tempParticle = new Particle(this.x, this.y, true);
            tempParticle.speedX = Math.cos(angle) * speed;
            tempParticle.speedY = Math.sin(angle) * speed;
            explosionParticles.push(tempParticle);
        }
        return explosionParticles;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = Math.random() * particleSpeed * 2 - particleSpeed;
        this.speedY = Math.random() * particleSpeed * 2 - particleSpeed;
    }
}

const particles = [];
const tempParticles = [];

// Create 41 particles
for (let i = 0; i < 41; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    for (let i = tempParticles.length - 1; i >= 0; i--) {
        const particle = tempParticles[i];
        particle.update();
        particle.draw();
        if (particle.lifespan <= 0) {
            tempParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();

// Handle mouse hover
projectsSection.addEventListener('mousemove', (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    const projectsRect = projectsSection.getBoundingClientRect();
    
    const mouseX = event.clientX - projectsRect.left - (canvasRect.left - projectsRect.left);
    const mouseY = event.clientY - projectsRect.top - (canvasRect.top - projectsRect.top);

    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30) {
            tempParticles.push(...particle.explode());
            particle.reset();
        }
    });
});

// Resize canvas when window is resized
window.addEventListener('resize', updateCanvasSize);