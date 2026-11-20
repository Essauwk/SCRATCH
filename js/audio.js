/**
 * ========================================================
 * 🔊 محرك المؤثرات الصوتية التفاعلي (Web Audio API)
 * ========================================================
 * يعمل في المتصفح أوفلاين بالكامل بدون الحاجة لملفات صوت خارجية.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // صوت ضغطة زرار فانكي مع Pop ناعم
    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.09);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    // صوت الخربشة المعدني الحقيقي (Metallic Coin Scratch)
    playScratch() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // فلتر Bandpass لإعطاء رنين العملة المعدنية على الفويل
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2200 + Math.random() * 800;
        filter.Q.value = 4.5;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
    }

    // نغمة الترحيب الفخمة عند الدخول
    playWelcome() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + (idx * 0.09);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        });
    }

    // صوت الساسبينس والتشويق الناري (Suspense Tension Riser + Heartbeat)
    playSuspense(duration = 2.2) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. ضربات القلب / الطبول المتسارعة (Heartbeat kicks)
        const beats = [0.0, 0.45, 0.85, 1.2, 1.5, 1.75, 1.95, 2.1];
        beats.forEach(bTime => {
            if (bTime > duration) return;
            const t = now + bTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.frequency.setValueAtTime(110, t);
            osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);

            gain.gain.setValueAtTime(0.45, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.12);
        });

        // 2. صوت التردد المتصاعد للساسبينس (Riser)
        const riser = this.ctx.createOscillator();
        const riserGain = this.ctx.createGain();

        riser.type = 'sawtooth';
        riser.frequency.setValueAtTime(180, now);
        riser.frequency.exponentialRampToValueAtTime(1300, now + duration);

        riserGain.gain.setValueAtTime(0.05, now);
        riserGain.gain.linearRampToValueAtTime(0.25, now + duration);
        riserGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.05);

        // فلتر عشان الصوت يكون سينمائي ومثير
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(3500, now + duration);

        riser.connect(filter);
        filter.connect(riserGain);
        riserGain.connect(this.ctx.destination);

        riser.start(now);
        riser.stop(now + duration + 0.05);
    }

    // صوت الانفجار وكشف السر (Impact Reveal Blast)
    playRevealBlast() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // صوت Crash خفيف
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const crash = this.ctx.createBufferSource();
        crash.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        crash.connect(gain);
        gain.connect(this.ctx.destination);
        crash.start(now);
    }

    // نغمة الفوز الأسطورية (Fanfare احتفالي مبهج)
    playWin() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const melody = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.12 }, // G5
            { f: 1046.50, d: 0.25 }, // C6
            { f: 880.00, d: 0.12 }, // A5
            { f: 1046.50, d: 0.50 }  // C6 hold
        ];

        let timeOffset = 0.05;
        melody.forEach(item => {
            const now = this.ctx.currentTime + timeOffset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(item.f, now);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + item.d);

            timeOffset += item.d * 0.85;
        });
    }

    // نغمة الخسارة الكوميدية / الفانكي مع إيموشن العضلات
    playLose() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const notes = [
            { f: 493.88, start: 0, dur: 0.2 },
            { f: 466.16, start: 0.22, dur: 0.2 },
            { f: 440.00, start: 0.44, dur: 0.2 },
            { f: 369.99, start: 0.66, dur: 0.5, slideTo: 220 }
        ];

        notes.forEach(item => {
            const now = this.ctx.currentTime + item.start;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(item.f, now);
            if (item.slideTo) {
                osc.frequency.exponentialRampToValueAtTime(item.slideTo, now + item.dur);
            }

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + item.dur);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + item.dur);
        });
    }

    playSuccessBeep() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }
}

const soundManager = new SoundEngine();
