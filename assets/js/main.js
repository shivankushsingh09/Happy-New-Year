// --- CONSTANTS & SETUP ---
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
let width, height;

const STATE = {
    INTRO: 0,
    COUNTDOWN: 1,
    CELEBRATION: 2
};
let currentState = STATE.INTRO;

// Resize
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- CLASSES ---

// 1. STARFIELD (Background)
class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = (Math.random() - 0.5) * width;
        this.y = (Math.random() - 0.5) * height;
        this.z = Math.random() * width; // Depth
        this.pz = this.z;
    }
    update(speed) {
        this.z = this.z - speed;
        if (this.z < 1) {
            this.reset();
            this.z = width;
            this.pz = this.z;
        }
    }
    draw() {
        // Perspective projection
        const sx = (this.x / this.z) * width / 2 + width / 2;
        const sy = (this.y / this.z) * height / 2 + height / 2;

        const r = (width - this.z) / width * 2.5; // Size based on depth

        // Trail effect (optional, simple line for speed)
        /*
        const px = (this.x / this.pz) * width/2 + width/2;
        const py = (this.y / this.pz) * height/2 + height/2;
        this.pz = this.z;
        
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r/2})`;
        ctx.stroke();
        */

        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

// 2. FIREWORKS (Physics Based)
class Particle {
    constructor(x, y, hue, fireworkRef) {
        this.x = x;
        this.y = y;
        this.fireworkRef = fireworkRef;

        // Random spread
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.hue = hue;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        this.gravity = 0.05;
        this.friction = 0.96;
    }
    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class Firework {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = height;
        this.targetY = Math.random() * (height * 0.4) + height * 0.1;
        this.speed = Math.random() * 3 + 8;
        this.hue = Math.random() * 360;
        this.particles = [];
        this.exploded = false;
        this.dead = false;
    }
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            this.speed *= 0.98; // Drag

            if (this.y <= this.targetY || this.speed < 1) {
                this.explode();
            }
        } else {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) this.particles.splice(i, 1);
            }
            if (this.particles.length === 0) this.dead = true;
        }
    }
    explode() {
        this.exploded = true;
        for (let i = 0; i < 80; i++) {
            this.particles.push(new Particle(this.x, this.y, this.hue, this));
        }
    }
    draw() {
        if (!this.exploded) {
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.particles.forEach(p => p.draw());
        }
    }
}

// --- MANAGERS ---
const stars = Array(400).fill().map(() => new Star());
let fireworks = [];
let warpSpeed = 2; // Speed of stars

// --- LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // Cleanup & Background
    // Trail effect for fireworks, but we want clean stars.
    // So we partially clear with low opacity black
    ctx.fillStyle = `rgba(3, 3, 10, 0.2)`;
    ctx.fillRect(0, 0, width, height);

    // Stars
    let currentWarp = (currentState === STATE.COUNTDOWN) ? 20 : (currentState === STATE.CELEBRATION ? 0.5 : 2);
    // Smooth transition of warp speed
    warpSpeed += (currentWarp - warpSpeed) * 0.05;

    stars.forEach(star => {
        star.update(warpSpeed);
        star.draw();
    });

    // Fireworks (Only in Celebration)
    if (currentState === STATE.CELEBRATION) {
        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].dead) fireworks.splice(i, 1);
        }
    }
}
animate();


// --- LOGIC ---
const openBtn = document.getElementById('open-btn');
const introDiv = document.getElementById('intro');
const countdownDiv = document.getElementById('countdown-display');
const celebrationCard = document.getElementById('celebration-card');
const audio = document.getElementById('bg-music');

openBtn.addEventListener('click', () => {
    // 1. Play Audio
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio issue:", e));

    // 2. Transition to Countdown
    introDiv.classList.add('fade-out');
    setTimeout(() => {
        introDiv.style.display = 'none';
        startCountdown();
    }, 500);
});

function startCountdown() {
    currentState = STATE.COUNTDOWN;
    countdownDiv.style.display = 'block';

    let count = 3;
    countdownDiv.innerText = count;
    countdownDiv.classList.add('countdown-animate');

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            // Reset animation
            countdownDiv.classList.remove('countdown-animate');
            void countdownDiv.offsetWidth; // Trigger reflow
            countdownDiv.classList.add('countdown-animate');
            countdownDiv.innerText = count;
        } else {
            clearInterval(timer);
            startCelebration();
        }
    }, 1000);
}

function startCelebration() {
    countdownDiv.style.display = 'none';
    currentState = STATE.CELEBRATION;

    celebrationCard.style.display = 'block';
    // Simple pop-in animation via CSS is handled, but let's ensure it starts fresh
    // Add parallax mouse effect
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        celebrationCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}
