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

/**
 * ========================================================
 * 🎶 مشغل موسيقى الفائزين الاحتفالية العشوائية (Winner Music Player)
 * ========================================================
 * - تشغيل عشوائي من باقة أغاني مجلد music/ للفائزين فقط.
 * - تأثير تلاشي للداخل (Fade In) متدرج عند البداية.
 * - دوران وتكرار لا نهائي (Looping) مع تلاشي للخارج (Fade Out) قبل نهاية كل مقطع.
 * - إيقاف موسيقى الخلفية المعتادة أثناء تشغيل أغنية الفوز.
 */
class WinnerMusicPlayer {
    constructor() {
        this.playlist = [
            { id: '1', title: 'الجي بتاعي', path: 'music/winner_1.mp3', fallback: 'music/' + encodeURI('الجي بتاعي.mp3') },
            { id: '2', title: 'انا فايف ستار', path: 'music/winner_2.mp3', fallback: 'music/' + encodeURI('انا فايف ستار.mp3') },
            { id: '3', title: 'سيبك اللي خلع', path: 'music/winner_3.mp3', fallback: 'music/' + encodeURI('سيبك اللي خلع.mp3') },
            { id: '4', title: 'عالدوغري وبرجوله', path: 'music/winner_4.mp3', fallback: 'music/' + encodeURI('عالدوغري وبرجوله.mp3') },
            { id: '5', title: 'عم عمك', path: 'music/winner_5.mp3', fallback: 'music/' + encodeURI('عم عمك.mp3') },
            { id: '6', title: 'نمبر 1', path: 'music/winner_6.mp3', fallback: 'music/' + encodeURI('نمبر 1.mp3') }
        ];

        this.currentAudio = null;
        this.currentTrack = null;
        this.lastPlayedIndex = -1;
        this.isPlaying = false;
        this.targetVolume = 0.85;
        this.fadeTimer = null;
        this.monitorTimer = null;
        this.isFadingOut = false;
        this.muted = false;
    }

    getRandomTrack() {
        if (!this.playlist || this.playlist.length === 0) return null;
        if (this.playlist.length === 1) return this.playlist[0];

        let index;
        let attempts = 0;
        do {
            index = Math.floor(Math.random() * this.playlist.length);
            attempts++;
        } while (index === this.lastPlayedIndex && attempts < 15);

        this.lastPlayedIndex = index;
        return this.playlist[index];
    }

    playRandomWinnerMusic() {
        // إيقاف أي موسيقى فائزين سابقة فوراً
        this.stop(false);

        const track = this.getRandomTrack();
        if (!track) return null;
        this.currentTrack = track;

        // إيقاف موسيقى الخلفية العامة للموقع
        this.pauseBackgroundMusic();

        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = 0; // البداية من صفر لتطبيق الفيد إن
        audio.muted = this.muted;
        this.currentAudio = audio;
        this.isPlaying = true;
        this.isFadingOut = false;

        // معالجة الخطأ والرجوع للرابط البديل فوراً
        audio.onerror = () => {
            if (track.fallback && audio.src !== track.fallback) {
                console.warn('Winner track fallback:', track.title);
                audio.src = track.fallback;
                audio.load();
                audio.play().catch(() => {});
            }
        };

        audio.src = track.path;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // تلاشي صوتي متصاعد للداخل (Fade In)
                this.fadeIn(audio, this.targetVolume, 1800);
                this.startTrackMonitor(audio);
            }).catch(err => {
                console.warn('Autoplay handled for winner music:', err);
            });
        }

        // عند انتهاء المقطع، إعادة تشغيله بفيد إن سلس ولوب مستمر
        audio.onended = () => {
            if (this.currentAudio === audio && this.isPlaying) {
                audio.currentTime = 0;
                audio.volume = 0;
                this.isFadingOut = false;
                const rep = audio.play();
                if (rep !== undefined) {
                    rep.then(() => {
                        this.fadeIn(audio, this.targetVolume, 1800);
                        this.startTrackMonitor(audio);
                    }).catch(() => {});
                }
            }
        };

        return audio;
    }

    startTrackMonitor(audio) {
        if (this.monitorTimer) clearInterval(this.monitorTimer);

        // مراقبة مسار الأغنية لتطبيق تلاشي الصوت للخارج (Fade Out) قبل انتهائها بـ 2.5 ثانية
        this.monitorTimer = setInterval(() => {
            if (!this.isPlaying || this.currentAudio !== audio) {
                clearInterval(this.monitorTimer);
                return;
            }

            if (audio.duration && !isNaN(audio.duration) && audio.duration > 3) {
                const remaining = audio.duration - audio.currentTime;
                if (remaining <= 2.5 && remaining > 0.15 && !this.isFadingOut) {
                    this.isFadingOut = true;
                    this.fadeOut(audio, 2200);
                }
            }
        }, 200);
    }

    fadeIn(audio, targetVol, durationMs = 1800) {
        if (!audio) return;
        if (this.fadeTimer) clearInterval(this.fadeTimer);

        const steps = 30;
        const stepTime = durationMs / steps;
        const volStep = targetVol / steps;
        let cur = 0;
        audio.volume = 0;

        this.fadeTimer = setInterval(() => {
            if (!this.isPlaying || this.currentAudio !== audio) {
                clearInterval(this.fadeTimer);
                return;
            }
            cur += volStep;
            if (cur >= targetVol) {
                audio.volume = targetVol;
                clearInterval(this.fadeTimer);
            } else {
                audio.volume = Math.max(0, Math.min(1, cur));
            }
        }, stepTime);
    }

    fadeOut(audio, durationMs = 2000, callback) {
        if (!audio) {
            if (callback) callback();
            return;
        }

        const steps = 25;
        const stepTime = durationMs / steps;
        const startVol = audio.volume;
        const volStep = startVol / steps;
        let cur = startVol;

        const timer = setInterval(() => {
            cur -= volStep;
            if (cur <= 0.03 || audio.paused) {
                audio.volume = 0;
                clearInterval(timer);
                if (callback) callback();
            } else {
                audio.volume = Math.max(0, cur);
            }
        }, stepTime);
    }

    stop(smooth = true, callback) {
        this.isPlaying = false;
        this.isFadingOut = false;
        if (this.fadeTimer) clearInterval(this.fadeTimer);
        if (this.monitorTimer) clearInterval(this.monitorTimer);

        const audio = this.currentAudio;
        if (!audio) {
            if (callback) callback();
            return;
        }

        if (smooth && !audio.paused && audio.volume > 0.05) {
            this.fadeOut(audio, 800, () => {
                audio.pause();
                audio.currentTime = 0;
                if (this.currentAudio === audio) this.currentAudio = null;
                if (callback) callback();
            });
        } else {
            audio.pause();
            audio.currentTime = 0;
            this.currentAudio = null;
            if (callback) callback();
        }
    }

    pauseBackgroundMusic() {
        const bgAudio = document.getElementById('bgMusic');
        if (bgAudio && !bgAudio.paused) {
            bgAudio.pause();
        }
    }

    setMuted(isMuted) {
        this.muted = isMuted;
        if (this.currentAudio) {
            this.currentAudio.muted = isMuted;
        }
    }
}

const winnerMusicPlayer = new WinnerMusicPlayer();
window.winnerMusicPlayer = winnerMusicPlayer;
