/**
 * ========================================================
 * 🪙 محرك كارت الخربشة الذهبي الاحترافي (Pro Scratch Engine)
 * ========================================================
 */

class ScratchCard {
    constructor(canvasElement, options = {}) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.container = this.canvas.parentElement;

        this.userName = options.userName || 'يا بطل العالمية';
        this.brushSize = options.brushSize || 32;
        this.threshold = options.threshold || 70; // 70% كما طلب المستخدم تماماً
        this.onProgress = options.onProgress || (() => {});
        this.onSuspense = options.onSuspense || (() => {});
        this.onComplete = options.onComplete || (() => {});

        this.isDrawing = false;
        this.isCompleted = false;
        this.lastX = null;
        this.lastY = null;
        this.lastSoundTime = 0;

        // نظام الشظايا الذهبية المتطايرة أثناء الخربشة (Scratch Flakes Physics)
        this.flakes = [];
        this.particleCanvas = null;
        this.pCtx = null;
        this.animFlakesId = null;

        this.init();
    }

    init() {
        this.setupParticleCanvas();
        this.resize();
        this.drawFoil();
        this.bindEvents();
    }

    setupParticleCanvas() {
        // كانفاس مخصص للشظايا الذهبية المتطايرة فوق الكارت
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvas.className = 'scratch-particles-canvas';
        this.particleCanvas.style.position = 'absolute';
        this.particleCanvas.style.inset = '0';
        this.particleCanvas.style.pointerEvents = 'none';
        this.particleCanvas.style.zIndex = '4';
        this.container.appendChild(this.particleCanvas);
        this.pCtx = this.particleCanvas.getContext('2d');
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const dpr = Math.max(window.devicePixelRatio || 1, 2);
        this.dpr = dpr;
        this.width = rect.width || 340;
        this.height = rect.height || 260;

        this.canvas.width = Math.round(this.width * dpr);
        this.canvas.height = Math.round(this.height * dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.particleCanvas.width = Math.round(this.width * dpr);
        this.particleCanvas.height = Math.round(this.height * dpr);
        this.particleCanvas.style.width = `${this.width}px`;
        this.particleCanvas.style.height = `${this.height}px`;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.pCtx.imageSmoothingEnabled = true;
    }

    drawFoil() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';

        // 1. تدرج ذهبي معدني متعدد الطبقات مع لمعان فاخر
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#FFE838');
        grad.addColorStop(0.25, '#FFD000');
        grad.addColorStop(0.5, '#FFF275');
        grad.addColorStop(0.75, '#FFAE00');
        grad.addColorStop(1, '#FFCC00');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // 2. نقوش هولوغرافيك وأمان أصلية شبيهة بكروت اليانصيب الاحترافية
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2.5;
        for (let x = -h; x < w + h; x += 22) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + h, h);
            ctx.stroke();
        }

        // نقوش متقاطعة خفيفة
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
        ctx.lineWidth = 1.5;
        for (let x = w + h; x > -h; x -= 22) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x - h, h);
            ctx.stroke();
        }

        // 3. إطار مسابقة العالمية الفخم
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([10, 6]);
        ctx.strokeRect(12, 12, w - 24, h - 24);
        ctx.setLineDash([]);

        // 4. كتابة اسم البطل والشارات الفانكي بتجاوب تام مع شاشات الموبايل
        const scale = Math.min(1, Math.max(0.72, w / 450));
        const badgeW = Math.min(260, w - 36);
        const badgeH = Math.round(50 * scale);
        const nameSize = Math.round(23 * scale);
        const badgeTextSize = Math.round(18 * scale);
        const hintSize = Math.round(13 * scale);

        ctx.fillStyle = '#18181B';
        ctx.font = `900 ${nameSize}px "Changa", "Cairo", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`يا ${this.userName} 🚀`, w / 2, h / 2 - Math.round(36 * scale));

        // شارة العملة الذهبية في المنتصف
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(w / 2 - badgeW / 2, h / 2 - badgeH / 2 + 10, badgeW, badgeH, Math.round(14 * scale));
        } else {
            ctx.rect(w / 2 - badgeW / 2, h / 2 - badgeH / 2 + 10, badgeW, badgeH);
        }
        ctx.fill();

        ctx.fillStyle = '#FFE500';
        ctx.font = `bold ${badgeTextSize}px "Changa", "Cairo", sans-serif`;
        ctx.fillText('🪙 خربش بالعملة واكشف حظك 🪙', w / 2, h / 2 + 10);

        // تشويق لطيف ومبهج في الأسفل (بدون أي نسب مئوية)
        ctx.fillStyle = '#78350F';
        ctx.font = `700 ${hintSize}px "Cairo", sans-serif`;
        ctx.fillText('✨ امسح بالعملة لتحرير مفاجأة العالمية! ✨', w / 2, h / 2 + Math.round(54 * scale) + 6);

        // أيقونات أركان شيك
        const iconSize = Math.round(28 * scale);
        ctx.font = `${iconSize}px sans-serif`;
        ctx.fillText('🌟', 32, 32);
        ctx.fillText('⚡', w - 32, 32);
        ctx.fillText('🪙', 32, h - 32);
        ctx.fillText('🔥', w - 32, h - 32);

        ctx.restore();
    }

    bindEvents() {
        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const start = (e) => {
            if (this.isCompleted) return;
            this.isDrawing = true;
            const pos = getPos(e);
            this.lastX = pos.x;
            this.lastY = pos.y;
            this.scratchAt(pos.x, pos.y);
            this.spawnFlakes(pos.x, pos.y, 6);
            if (e.cancelable && e.type.startsWith('touch')) {
                e.preventDefault();
            }
        };

        const move = (e) => {
            if (!this.isDrawing || this.isCompleted) return;
            const pos = getPos(e);
            this.scratchSmooth(this.lastX, this.lastY, pos.x, pos.y);
            this.spawnFlakes(pos.x, pos.y, 3);
            this.lastX = pos.x;
            this.lastY = pos.y;

            // صوت احتكاك العملة
            const now = Date.now();
            if (now - this.lastSoundTime > 60) {
                if (typeof soundManager !== 'undefined') {
                    soundManager.playScratch();
                }
                this.lastSoundTime = now;
            }

            this.checkProgress();

            if (e.cancelable && e.type.startsWith('touch')) {
                e.preventDefault();
            }
        };

        const end = () => {
            this.isDrawing = false;
        };

        // الماوس
        this.canvas.addEventListener('mousedown', start);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);

        // اللمس على الموبايل
        this.canvas.addEventListener('touchstart', start, { passive: false });
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', end);
        window.addEventListener('touchcancel', end);

        this._cleanup = () => {
            this.canvas.removeEventListener('mousedown', start);
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', end);
            this.canvas.removeEventListener('touchstart', start);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', end);
            window.removeEventListener('touchcancel', end);
            if (this.particleCanvas && this.particleCanvas.parentElement) {
                this.particleCanvas.parentElement.removeChild(this.particleCanvas);
            }
            if (this.animFlakesId) {
                cancelAnimationFrame(this.animFlakesId);
            }
        };

        this.startFlakesAnimation();
    }

    // خربشة ناعمة مع تدرج وخشونة خفيفة لتبدو كإزالة الفويل الحقيقي
    scratchAt(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
        ctx.fill();

        // نقاط متفرقة عشوائية صغيرة لمحاكاة تفتت البودرة الذهبية
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = this.brushSize + Math.random() * 8;
            ctx.beginPath();
            ctx.arc(x + Math.cos(angle) * r, y + Math.sin(angle) * r, 3 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    scratchSmooth(x1, y1, x2, y2) {
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.max(1, Math.floor(dist / 4)); // خطوات كثيفة لتجنب أي فراغات
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            this.scratchAt(x, y);
        }
    }

    // توليد شظايا الذهب المتطايرة
    spawnFlakes(x, y, count = 4) {
        const colors = ['#FFE500', '#FFD000', '#FFF', '#F59E0B', '#D97706'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1.5;
            this.flakes.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 2,
                alpha: 1,
                decay: Math.random() * 0.04 + 0.02
            });
        }
    }

    startFlakesAnimation() {
        const render = () => {
            if (this.pCtx) {
                this.pCtx.clearRect(0, 0, this.width, this.height);
                for (let i = this.flakes.length - 1; i >= 0; i--) {
                    const f = this.flakes[i];
                    f.x += f.vx;
                    f.y += f.vy;
                    f.vy += 0.18; // جاذبية خفيفة
                    f.alpha -= f.decay;

                    if (f.alpha <= 0) {
                        this.flakes.splice(i, 1);
                        continue;
                    }

                    this.pCtx.save();
                    this.pCtx.globalAlpha = f.alpha;
                    this.pCtx.fillStyle = f.color;
                    this.pCtx.beginPath();
                    this.pCtx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
                    this.pCtx.fill();
                    this.pCtx.restore();
                }
            }
            this.animFlakesId = requestAnimationFrame(render);
        };
        render();
    }

    checkProgress() {
        if (this.isCompleted) return;

        const w = Math.floor(this.canvas.width);
        const h = Math.floor(this.canvas.height);
        const stride = 18;
        let total = 0;
        let cleared = 0;

        try {
            const imgData = this.ctx.getImageData(0, 0, w, h).data;
            for (let i = 3; i < imgData.length; i += 4 * stride) {
                total++;
                if (imgData[i] === 0) {
                    cleared++;
                }
            }

            const percent = Math.min(100, Math.round((cleared / total) * 100));
            this.onProgress(percent);

            // عند وصول الخربشة لـ 70% كما طلب المستخدم
            if (percent >= this.threshold) {
                this.triggerSuspenseAndReveal();
            }
        } catch (e) {
            console.error('Error calculating scratch percentage:', e);
        }
    }

    triggerSuspenseAndReveal() {
        if (this.isCompleted) return;
        this.isCompleted = true;

        // إخفاء الكانفاس الذهبي تدريجياً
        this.canvas.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        this.canvas.style.opacity = '0';
        this.canvas.style.transform = 'scale(1.04)';
        this.canvas.style.pointerEvents = 'none';

        // إطلاق حدث الساسبينس والتشويق
        this.onSuspense();
    }

    destroy() {
        if (this._cleanup) {
            this._cleanup();
        }
    }
}
