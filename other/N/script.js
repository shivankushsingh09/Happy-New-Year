document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');

    let fireworks = [];
    let particles = [];
    let animationId;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Interaction
    openBtn.addEventListener('click', () => {
        introScreen.style.opacity = '0';
        setTimeout(() => {
            introScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.style.opacity = '1';
            
            // Start fireworks
            animate();
            
            // Try playing audio (if file exists)
            bgMusic.volume = 0.5;
            bgMusic.play().catch(e => console.log("Audio play failed (user interaction policy or missing file):", e));
        }, 1000);
    });

    // Fireworks Logic
    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 3;
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.velocities = {
                x: Math.cos(this.angle) * this.speed,
                y: Math.sin(this.angle) * this.speed
            };
            this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
            this.distanceTraveled = 0;
            this.coordinates = [];
            this.coordinateCount = 3;
            while(this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
        }

        update(index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            this.x += this.velocities.x;
            this.y += this.velocities.y;
            this.distanceTraveled = Math.hypot(this.x - this.coordinates[this.coordinates.length - 1][0], this.y - this.coordinates[this.coordinates.length - 1][1]);

            if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < this.distanceTraveled) {
                createParticles(this.targetX, this.targetY);
                fireworks.splice(index, 1);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
            ctx.stroke();
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 5 + 1; // Random speed
            this.friction = 0.95;
            this.gravity = 1;
            this.hue = Math.floor(Math.random() * 360);
            this.brightness = Math.random() * 50 + 50;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.015;
            
            this.velocities = {
                x: Math.cos(this.angle) * this.speed,
                y: Math.sin(this.angle) * this.speed
            }
        }

        update(index) {
            this.velocities.x *= this.friction;
            this.velocities.y *= this.friction;
            this.velocities.y += this.gravity;
            
            this.x += this.velocities.x;
            this.y += this.velocities.y;
            this.alpha -= this.decay;

            if (this.alpha <= 0) {
                particles.splice(index, 1);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
            ctx.fill();
        }
    }

    function createParticles(x, y) {
        let particleCount = 50;
        while (particleCount--) {
            particles.push(new Particle(x, y));
        }
    }

    function animate() {
        animationId = requestAnimationFrame(animate);
        
        // Trail effect
        ctx.fillStyle = 'rgba(5, 5, 16, 0.2)'; // Match bg color with some transparency
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Randomly launch fireworks
        if (Math.random() < 0.03) {
            const startX = Math.random() * canvas.width;
            const targetX = Math.random() * canvas.width;
            const targetY = Math.random() * (canvas.height / 2); // Explode in top half
            fireworks.push(new Firework(startX, canvas.height, targetX, targetY));
        }

        fireworks.forEach((firework, index) => {
            firework.update(index);
            firework.draw();
        });

        particles.forEach((particle, index) => {
            particle.update(index);
            particle.draw();
        });
    }
});
