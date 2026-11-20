/**
 * ========================================================
 * 🎉 محرك الألعاب النارية والكونفيتي (Standalone Confetti)
 * ========================================================
 */

class ConfettiManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animId = null;
    }

    init() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'confetti-canvas';
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '99999';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');

            window.addEventListener('resize', () => this.resize());
        }
        this.resize();
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    burst(count = 120, originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
        this.init();
        const colors = ['#FFE500', '#FFB800', '#FF3B30', '#34C759', '#007AFF', '#AF52DE', '#FF9500', '#FFFFFF'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 12 + 4;
            this.particles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 10 + 6,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 15,
                gravity: 0.28,
                friction: 0.96,
                alpha: 1,
                decay: Math.random() * 0.012 + 0.008,
                shape: Math.random() > 0.4 ? 'rect' : 'circle'
            });
        }

        if (!this.animId) {
            this.render();
        }
    }

    celebrateWin() {
        this.burst(150, window.innerWidth * 0.5, window.innerHeight * 0.4);
        setTimeout(() => {
            this.burst(90, window.innerWidth * 0.2, window.innerHeight * 0.5);
            this.burst(90, window.innerWidth * 0.8, window.innerHeight * 0.5);
        }, 300);
        setTimeout(() => {
            this.burst(120, window.innerWidth * 0.5, window.innerHeight * 0.3);
        }, 700);
    }

    render() {
        if (this.particles.length === 0) {
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            this.animId = null;
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.rotation += p.rotSpeed;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        this.animId = requestAnimationFrame(() => this.render());
    }
}

const confettiManager = new ConfettiManager();
