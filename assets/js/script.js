/**
 * Melia Winisa | Detective Assistant Portfolio
 * Visual Novel Dialogue Engine, Audio Synthesizer & Interactive Stage
 */

(function () {
    'use strict';

    const isInvestigatePage = Boolean(document.getElementById('investigateStage'));

    // ==========================================
    // Dialogue Script (Melia's Lines)
    // ==========================================
    const dialogueLines = [
        {
            text: "Hello! I'm Melia Winisa, a Visual Communication Design student at UPH.",
            curious: false
        },
        {
            text: "All my design projects and experience are tucked away in here!",
            curious: true
        },
        {
            text: "Press START to step into the investigation room, or click 'Recruiter Mode' if you just want the quick version!",
            curious: false
        }
    ];

    let currentLineIndex = 0;
    let isTyping = false;
    let typeTimeout = null;
    let activeText = "";

    // DOM Elements
    const dialogueBox = document.getElementById('dialogueBox');
    const typedContent = document.getElementById('typedContent');
    const dialoguePrompt = document.getElementById('dialoguePrompt');
    const spriteHappy = document.getElementById('spriteHappy');
    const spriteCurios = document.getElementById('spriteCurios');
    const characterContainer = document.getElementById('characterContainer');
    const startBtn = document.getElementById('startBtn');
    const homeTabLink = document.getElementById('homeTabLink');
    const investigateTabLink = document.getElementById('investigateTabLink');
    const folderInvestigateLayer = document.getElementById('folderInvestigateLayer');
    const folderHomeLayer = document.getElementById('folderHomeLayer');
    const investigateNavButtons = document.getElementById('investigateNavButtons');
    const tapeNavButtons = document.querySelectorAll('.tape-nav-btn');
    const investigateView = document.getElementById('investigateView');
    const landingStage = document.getElementById('landingStage');
    const bgmSlider = document.getElementById('bgmSlider');
    const sfxSlider = document.getElementById('sfxSlider');
    const folderOverlay = document.getElementById('mainFolderNav') ||
        document.getElementById('sideFolderNav') ||
        document.querySelector('.folder-overlay');

    const subviews = {
        'case-file': document.getElementById('caseFileView'),
        'corkboard': document.getElementById('corkboardView'),
        'contact': document.getElementById('contactView'),
        'phone': document.getElementById('phoneView'),
        'chess': document.getElementById('chessView')
    };

    const ALL_VIEW_CLASSES = [
        'view-investigate',
        'view-investigate-docked',
        'view-case-file',
        'view-corkboard',
        'view-contact',
        'view-phone',
        'view-chess',
        'room-transitioning-to-subpage',
        'page-exit-to-room'
    ];

    function getViewFromHash(hash) {
        const clean = (hash || window.location.hash || '').replace(/^#/, '').toLowerCase();
        if (clean === 'investigate') return 'investigate';
        if (clean === 'case-file' || clean === 'casefile' || clean === 'about') return 'case-file';
        if (clean === 'corkboard' || clean === 'projects') return 'corkboard';
        if (clean === 'contact') return 'contact';
        if (clean === 'phone' || clean === 'messages') return 'phone';
        if (clean === 'chess') return 'chess';
        return 'home';
    }

    let currentActiveView = 'home';
    let startGlareAnimation = () => { };
    let stopGlareAnimation = () => { };

    function navigateToView(viewName, pushHistory = true) {
        currentActiveView = viewName;

        // Reset document scroll
        window.scrollTo(0, 0);

        // Remove all view-specific classes from body
        document.body.classList.remove(...ALL_VIEW_CLASSES);

        if (folderOverlay) {
            folderOverlay.classList.remove('peek-home-tab', 'pull-investigate-tab', 'reveal-investigate-buttons');
        }

        if (viewName === 'home') {
            if (landingStage) landingStage.setAttribute('aria-hidden', 'false');
            if (investigateView) investigateView.setAttribute('aria-hidden', 'true');
            Object.values(subviews).forEach((v) => {
                if (v) {
                    v.setAttribute('aria-hidden', 'true');
                    v.scrollTop = 0;
                }
            });

            if (pushHistory && window.location.hash !== '' && window.location.hash !== '#home') {
                history.pushState({ view: 'home' }, '', window.location.pathname);
            }
        } else {
            if (landingStage) landingStage.setAttribute('aria-hidden', 'true');
            document.body.classList.add('view-investigate-docked');

            if (viewName === 'investigate') {
                document.body.classList.add('view-investigate');
                if (investigateView) {
                    investigateView.setAttribute('aria-hidden', 'false');
                    investigateView.classList.add('room-return-entrance');
                    setTimeout(() => {
                        investigateView.classList.remove('room-return-entrance');
                    }, 400);
                }
                Object.values(subviews).forEach((v) => {
                    if (v) {
                        v.setAttribute('aria-hidden', 'true');
                        v.scrollTop = 0;
                    }
                });

                if (pushHistory && window.location.hash !== '#investigate') {
                    history.pushState({ view: 'investigate' }, '', '#investigate');
                }
            } else {
                // A desk subview is active
                document.body.classList.add(`view-${viewName}`);
                if (investigateView) investigateView.setAttribute('aria-hidden', 'true');

                Object.entries(subviews).forEach(([k, v]) => {
                    if (!v) return;
                    if (k === viewName) {
                        v.setAttribute('aria-hidden', 'false');
                        v.scrollTop = 0;
                    } else {
                        v.setAttribute('aria-hidden', 'true');
                    }
                });

                if (viewName === 'corkboard' && typeof window.updateCorkboardStrings === 'function') {
                    requestAnimationFrame(() => {
                        window.updateCorkboardStrings();
                        setTimeout(window.updateCorkboardStrings, 100);
                    });
                } else if (viewName === 'case-file' && typeof window.spreadDossierPages === 'function') {
                    requestAnimationFrame(() => {
                        window.spreadDossierPages(false);
                    });
                }

                if (pushHistory && window.location.hash !== `#${viewName}`) {
                    history.pushState({ view: viewName }, '', `#${viewName}`);
                }
            }
        }

        if (viewName === 'investigate') {
            startGlareAnimation();
        } else {
            stopGlareAnimation();
        }

        // Release the immediate preload lock cleanly after styles take effect
        if (document.documentElement.classList.contains('preload-investigate')) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    document.documentElement.classList.remove('preload-investigate', 'preload-subview');
                });
            });
        }
    }

    // Listen to hash change and browser Back/Forward history buttons
    window.addEventListener('popstate', () => {
        navigateToView(getViewFromHash(window.location.hash), false);
    });

    window.addEventListener('hashchange', () => {
        navigateToView(getViewFromHash(window.location.hash), false);
    });

    // Handle initial hash on page load
    const initialView = getViewFromHash(window.location.hash);
    if (initialView !== 'home') {
        navigateToView(initialView, false);
    }

    // Stored audio preferences (defaulting to BGM 88, and upgraded loud SFX 78)
    let bgmVolume = parseFloat(localStorage.getItem('melia_bgm_vol') ?? '88');
    const storedSfx = localStorage.getItem('melia_sfx_vol');
    // Upgrade existing stored 28 or unconfigured volume to the louder 78 default
    let sfxVolume = (storedSfx === null || storedSfx === '28') ? 78 : parseFloat(storedSfx);
    localStorage.setItem('melia_sfx_vol', String(sfxVolume));

    if (bgmSlider) bgmSlider.value = String(bgmVolume);
    if (sfxSlider) sfxSlider.value = String(sfxVolume);

    // ==========================================
    // Audio Engine (BGM Track + SFX Synthesizer)
    // ==========================================
    const BGM_START_SECONDS = 0;
    let audioCtx = null;
    let sfxGainNode = null;
    let lastSfxPreviewTime = 0;

    // Background Music Audio Element (assets/audio/bgm.mp3)
    const bgmAudio = new Audio('assets/audio/bgm.mp3');
    bgmAudio.loop = true;
    bgmAudio.preload = 'auto';
    bgmAudio.volume = Math.max(0, Math.min(1, bgmVolume / 100));

    const savedBgmTime = parseFloat(sessionStorage.getItem('melia_bgm_time') ?? '');
    // Ignore legacy session times if saved time exceeds track length (~272s)
    const initialBgmTime = (!Number.isNaN(savedBgmTime) && savedBgmTime > 0 && savedBgmTime < 270)
        ? savedBgmTime
        : BGM_START_SECONDS;
    let bgmHasSeekedToInitial = false;

    function applyInitialBgmTime() {
        if (bgmHasSeekedToInitial) return;
        try {
            if (bgmAudio.duration && initialBgmTime < bgmAudio.duration) {
                bgmAudio.currentTime = initialBgmTime;
            } else {
                bgmAudio.currentTime = 0;
            }
            bgmHasSeekedToInitial = true;
        } catch (e) { }
    }

    if (bgmAudio.readyState >= 1) {
        applyInitialBgmTime();
    } else {
        bgmAudio.addEventListener('loadedmetadata', applyInitialBgmTime, { once: true });
    }

    bgmAudio.addEventListener('timeupdate', () => {
        if (bgmHasSeekedToInitial && !bgmAudio.paused) {
            sessionStorage.setItem('melia_bgm_time', String(bgmAudio.currentTime));
        }
    });

    function startBgmPlayback() {
        bgmAudio.volume = Math.max(0, Math.min(1, bgmVolume / 100));
        if (bgmVolume <= 0) {
            if (!bgmAudio.paused) bgmAudio.pause();
            return;
        }
        if (bgmAudio.paused) {
            bgmAudio.play().catch(() => {
                // Browser autoplay policy blocked initial play; will start on first interaction
            });
        }
    }

    function initAudio() {
        startBgmPlayback();

        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            audioCtx = new AudioContextClass();
            sfxGainNode = audioCtx.createGain();
            sfxGainNode.gain.value = (sfxVolume / 100) * 0.95;
            sfxGainNode.connect(audioCtx.destination);
        } else if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play tactile typewriter click sound
    function playTypewriterSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(620 + Math.random() * 220, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1400, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(sfxGainNode);

            osc.start(now);
            osc.stop(now + 0.045);
        } catch (e) { }
    }

    // Play UI button chime sound
    function playButtonSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.09); // E5

            gain.gain.setValueAtTime(0.24, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(sfxGainNode);

            osc.start(now);
            osc.stop(now + 0.24);
        } catch (e) { }
    }

    // Play realistic crisp paper flip / folder slide sound effect (for full folder movements)
    function playPaperSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;
            const sampleRate = audioCtx.sampleRate;

            // Layer 1: Crisp initial paper crinkle / thumb catch (short high-frequency burst)
            const crinkleLength = Math.floor(sampleRate * 0.085);
            const crinkleBuffer = audioCtx.createBuffer(1, crinkleLength, sampleRate);
            const crinkleData = crinkleBuffer.getChannelData(0);
            for (let i = 0; i < crinkleLength; i++) {
                const env = Math.sin((i / crinkleLength) * Math.PI);
                const grain = Math.random() > 0.65 ? (Math.random() * 2 - 1) * 1.4 : (Math.random() * 2 - 1) * 0.45;
                crinkleData[i] = grain * env;
            }

            const crinkleSrc = audioCtx.createBufferSource();
            crinkleSrc.buffer = crinkleBuffer;

            const crinkleFilter = audioCtx.createBiquadFilter();
            crinkleFilter.type = 'bandpass';
            crinkleFilter.frequency.setValueAtTime(2400, now);
            crinkleFilter.frequency.exponentialRampToValueAtTime(3400, now + 0.08);
            crinkleFilter.Q.setValueAtTime(1.4, now);

            const crinkleGain = audioCtx.createGain();
            crinkleGain.gain.setValueAtTime(0.75, now);
            crinkleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.085);

            crinkleSrc.connect(crinkleFilter);
            crinkleFilter.connect(crinkleGain);
            crinkleGain.connect(sfxGainNode);

            // Layer 2: Smooth manila folder / paper page slide across desk
            const slideDuration = 0.36;
            const slideLength = Math.floor(sampleRate * slideDuration);
            const slideBuffer = audioCtx.createBuffer(1, slideLength, sampleRate);
            const slideData = slideBuffer.getChannelData(0);

            // Pink-ish noise shaping for warm paper friction
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < slideLength; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.997 * b0 + white * 0.029;
                b1 = 0.985 * b1 + white * 0.032;
                b2 = 0.950 * b2 + white * 0.048;
                const pink = (b0 + b1 + b2 + white * 0.18) * 1.6;

                const t = i / slideLength;
                const env = Math.pow(Math.sin(t * Math.PI), 1.25) * (1 - 0.25 * Math.cos(t * 4 * Math.PI));
                slideData[i] = pink * env;
            }

            const slideSrc = audioCtx.createBufferSource();
            slideSrc.buffer = slideBuffer;

            const slideBandpass = audioCtx.createBiquadFilter();
            slideBandpass.type = 'bandpass';
            slideBandpass.frequency.setValueAtTime(950, now + 0.02);
            slideBandpass.frequency.exponentialRampToValueAtTime(2100, now + 0.16);
            slideBandpass.frequency.exponentialRampToValueAtTime(1150, now + slideDuration);
            slideBandpass.Q.setValueAtTime(0.9, now);

            const slideHighpass = audioCtx.createBiquadFilter();
            slideHighpass.type = 'highpass';
            slideHighpass.frequency.setValueAtTime(420, now);

            const slideGain = audioCtx.createGain();
            slideGain.gain.setValueAtTime(0.01, now);
            slideGain.gain.linearRampToValueAtTime(0.9, now + 0.05);
            slideGain.gain.exponentialRampToValueAtTime(0.008, now + slideDuration);

            slideSrc.connect(slideBandpass);
            slideBandpass.connect(slideHighpass);
            slideHighpass.connect(slideGain);
            slideGain.connect(sfxGainNode);

            crinkleSrc.start(now);
            slideSrc.start(now + 0.015);
        } catch (e) { }
    }

    // Play light, realistic single paper sheet lift / pick-up sound
    function playSinglePaperLiftSfx(delaySec = 0) {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime + delaySec;
            const sampleRate = audioCtx.sampleRate;
            const pitchShift = 1 + (Math.random() * 0.14 - 0.07);

            // Layer 1: Delicate corner peel & finger release flick (very light, crisp paper edge)
            const peelDuration = 0.042;
            const peelLength = Math.floor(sampleRate * peelDuration);
            const peelBuffer = audioCtx.createBuffer(1, peelLength, sampleRate);
            const peelData = peelBuffer.getChannelData(0);
            for (let i = 0; i < peelLength; i++) {
                const t = i / peelLength;
                const env = Math.sin(t * Math.PI) * Math.pow(1 - t, 1.4);
                const grain = (Math.random() * 2 - 1) * (Math.random() > 0.55 ? 1.2 : 0.4);
                peelData[i] = grain * env;
            }

            const peelSrc = audioCtx.createBufferSource();
            peelSrc.buffer = peelBuffer;

            const peelFilter = audioCtx.createBiquadFilter();
            peelFilter.type = 'bandpass';
            peelFilter.frequency.setValueAtTime(3200 * pitchShift, now);
            peelFilter.Q.setValueAtTime(1.6, now);

            const peelGain = audioCtx.createGain();
            peelGain.gain.setValueAtTime(0.48, now);
            peelGain.gain.exponentialRampToValueAtTime(0.001, now + peelDuration);

            peelSrc.connect(peelFilter);
            peelFilter.connect(peelGain);
            peelGain.connect(sfxGainNode);

            peelSrc.start(now);

            // Layer 2: Light airy whoosh of a single sheet lifting through the air
            const liftDuration = 0.11;
            const liftLength = Math.floor(sampleRate * liftDuration);
            const liftBuffer = audioCtx.createBuffer(1, liftLength, sampleRate);
            const liftData = liftBuffer.getChannelData(0);

            let b0 = 0, b1 = 0;
            for (let i = 0; i < liftLength; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.92 * b0 + white * 0.08;
                b1 = 0.85 * b1 + white * 0.15;
                const pink = (b0 + b1) * 1.1;

                const t = i / liftLength;
                const env = Math.sin(t * Math.PI) * Math.pow(1 - t * 0.5, 1.2);
                liftData[i] = pink * env;
            }

            const liftSrc = audioCtx.createBufferSource();
            liftSrc.buffer = liftBuffer;

            const liftBandpass = audioCtx.createBiquadFilter();
            liftBandpass.type = 'bandpass';
            liftBandpass.frequency.setValueAtTime(1750 * pitchShift, now);
            liftBandpass.frequency.exponentialRampToValueAtTime(2950 * pitchShift, now + liftDuration);
            liftBandpass.Q.setValueAtTime(1.1, now);

            const liftHighpass = audioCtx.createBiquadFilter();
            liftHighpass.type = 'highpass';
            liftHighpass.frequency.setValueAtTime(650, now);

            const liftGain = audioCtx.createGain();
            liftGain.gain.setValueAtTime(0.01, now);
            liftGain.gain.linearRampToValueAtTime(0.55, now + 0.025);
            liftGain.gain.exponentialRampToValueAtTime(0.001, now + liftDuration);

            liftSrc.connect(liftBandpass);
            liftBandpass.connect(liftHighpass);
            liftHighpass.connect(liftGain);
            liftGain.connect(sfxGainNode);

            liftSrc.start(now + 0.006);
        } catch (e) { }
    }

    // Play gentle single paper settling / landing back onto the desk
    function playSinglePaperDropSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;
            const sampleRate = audioCtx.sampleRate;

            const dropDur = 0.065;
            const dropLen = Math.floor(sampleRate * dropDur);
            const dropBuffer = audioCtx.createBuffer(1, dropLen, sampleRate);
            const dropData = dropBuffer.getChannelData(0);
            for (let i = 0; i < dropLen; i++) {
                const t = i / dropLen;
                const env = Math.pow(1 - t, 2.0);
                dropData[i] = (Math.random() * 2 - 1) * env;
            }

            const dropSrc = audioCtx.createBufferSource();
            dropSrc.buffer = dropBuffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1450, now);
            filter.Q.setValueAtTime(1.2, now);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.42, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dropDur);

            dropSrc.connect(filter);
            filter.connect(gain);
            gain.connect(sfxGainNode);

            dropSrc.start(now);
        } catch (e) { }
    }

    // Play vintage telephone electric double-bell ringing ("drrr-ring! drrr-ring!")
    function playRotaryRingSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;

            // Authentic mechanical bells: twin brass gongs at 1050Hz & 1250Hz
            // hammered by an alternating clapper at 22 Hz modulation
            function createRingBurst(startTime, duration) {
                const strikeRate = 22; // 22 strikes per second
                const numStrikes = Math.floor(duration * strikeRate);

                for (let i = 0; i < numStrikes; i++) {
                    const strikeTime = startTime + (i / strikeRate);
                    const isGongA = (i % 2 === 0);
                    const freq = isGongA ? 1046.50 : 1244.51; // Dual tuned bell frequencies

                    const bellOsc = audioCtx.createOscillator();
                    const bellGain = audioCtx.createGain();

                    bellOsc.type = 'sine';
                    bellOsc.frequency.setValueAtTime(freq, strikeTime);

                    bellGain.gain.setValueAtTime(0.48, strikeTime);
                    bellGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.08);

                    bellOsc.connect(bellGain);
                    bellGain.connect(sfxGainNode);

                    bellOsc.start(strikeTime);
                    bellOsc.stop(strikeTime + 0.085);

                    // High metallic gong harmonic
                    if (i % 2 === 0) {
                        const metalOsc = audioCtx.createOscillator();
                        const metalGain = audioCtx.createGain();
                        metalOsc.type = 'triangle';
                        metalOsc.frequency.setValueAtTime(freq * 2.85, strikeTime);
                        metalGain.gain.setValueAtTime(0.16, strikeTime);
                        metalGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.045);
                        metalOsc.connect(metalGain);
                        metalGain.connect(sfxGainNode);
                        metalOsc.start(strikeTime);
                        metalOsc.stop(strikeTime + 0.05);
                    }
                }
            }

            // Burst 1: First energetic bell ring
            createRingBurst(now, 0.22);
            // Gap between rings
            // Burst 2: Second echoing bell ring
            createRingBurst(now + 0.26, 0.24);

            // Bakelite receiver lift & switch click at the tail
            const clickOsc = audioCtx.createOscillator();
            const clickGain = audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(220, now + 0.48);
            clickOsc.frequency.exponentialRampToValueAtTime(480, now + 0.54);
            clickGain.gain.setValueAtTime(0.52, now + 0.48);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.56);
            clickOsc.connect(clickGain);
            clickGain.connect(sfxGainNode);
            clickOsc.start(now + 0.48);
            clickOsc.stop(now + 0.57);
        } catch (e) { }
    }

    // Play modern smartphone notification chime (bright marimba arpeggio + haptic vibration)
    function playPhoneNotifSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;

            // 1. Phone haptic motor pulse rumble
            const hapticOsc = audioCtx.createOscillator();
            const hapticGain = audioCtx.createGain();
            hapticOsc.type = 'sine';
            hapticOsc.frequency.setValueAtTime(165, now);
            hapticGain.gain.setValueAtTime(0.52, now);
            hapticGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            hapticOsc.connect(hapticGain);
            hapticGain.connect(sfxGainNode);
            hapticOsc.start(now);
            hapticOsc.stop(now + 0.08);

            // 2. Bright, cheerful 3-tone notification chime (F#5 -> B5 -> E6)
            const notes = [
                { freq: 739.99, time: 0.00, dur: 0.16 }, // F#5
                { freq: 987.77, time: 0.07, dur: 0.18 }, // B5
                { freq: 1318.51, time: 0.15, dur: 0.28 } // E6
            ];

            notes.forEach(({ freq, time, dur }) => {
                const start = now + time;

                // Fundamental tone (pure crystal bell)
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, start);

                gain.gain.setValueAtTime(0.001, start);
                gain.gain.linearRampToValueAtTime(0.44, start + 0.015);
                gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

                osc.connect(gain);
                gain.connect(sfxGainNode);
                osc.start(start);
                osc.stop(start + dur + 0.02);

                // Harmonic shimmer (sparkling marimba overtone)
                const overtone = audioCtx.createOscillator();
                const overGain = audioCtx.createGain();
                overtone.type = 'triangle';
                overtone.frequency.setValueAtTime(freq * 2, start);

                overGain.gain.setValueAtTime(0.001, start);
                overGain.gain.linearRampToValueAtTime(0.16, start + 0.01);
                overGain.gain.exponentialRampToValueAtTime(0.001, start + (dur * 0.55));

                overtone.connect(overGain);
                overGain.connect(sfxGainNode);
                overtone.start(start);
                overtone.stop(start + (dur * 0.55) + 0.02);
            });
        } catch (e) { }
    }

    // Play crisp wooden chess piece placed down on solid wooden chessboard
    function playChessPieceSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;
            const sampleRate = audioCtx.sampleRate;

            // 1. Sharp wood-on-wood contact click
            const clickLen = Math.floor(sampleRate * 0.035);
            const clickBuffer = audioCtx.createBuffer(1, clickLen, sampleRate);
            const clickData = clickBuffer.getChannelData(0);
            for (let i = 0; i < clickLen; i++) {
                const env = Math.pow(1 - (i / clickLen), 2.5);
                clickData[i] = (Math.random() * 2 - 1) * env;
            }
            const clickSrc = audioCtx.createBufferSource();
            clickSrc.buffer = clickBuffer;
            const clickFilter = audioCtx.createBiquadFilter();
            clickFilter.type = 'bandpass';
            clickFilter.frequency.setValueAtTime(2100, now);
            clickFilter.Q.setValueAtTime(2.0, now);
            const clickGain = audioCtx.createGain();
            clickGain.gain.setValueAtTime(0.72, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
            clickSrc.connect(clickFilter);
            clickFilter.connect(clickGain);
            clickGain.connect(sfxGainNode);
            clickSrc.start(now);

            // 2. Hard piece body drop knock (pitch drop)
            const knockOsc = audioCtx.createOscillator();
            const knockGain = audioCtx.createGain();
            knockOsc.type = 'triangle';
            knockOsc.frequency.setValueAtTime(540, now);
            knockOsc.frequency.exponentialRampToValueAtTime(130, now + 0.055);
            knockGain.gain.setValueAtTime(0.68, now);
            knockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            knockOsc.connect(knockGain);
            knockGain.connect(sfxGainNode);
            knockOsc.start(now);
            knockOsc.stop(now + 0.065);

            // 3. Wooden board cavity resonance
            const boardOsc = audioCtx.createOscillator();
            const boardGain = audioCtx.createGain();
            boardOsc.type = 'sine';
            boardOsc.frequency.setValueAtTime(220, now + 0.01);
            boardGain.gain.setValueAtTime(0.48, now + 0.01);
            boardGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
            boardOsc.connect(boardGain);
            boardGain.connect(sfxGainNode);
            boardOsc.start(now + 0.01);
            boardOsc.stop(now + 0.17);
        } catch (e) { }
    }

    // Play tactile pushpin / thumbtack pressed into cork board
    function playCorkboardPinSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;
            const sampleRate = audioCtx.sampleRate;

            // 1. Sharp metal pin puncture click
            const pinOsc = audioCtx.createOscillator();
            const pinGain = audioCtx.createGain();
            pinOsc.type = 'sine';
            pinOsc.frequency.setValueAtTime(3200, now);
            pinOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.025);
            pinGain.gain.setValueAtTime(0.62, now);
            pinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            pinOsc.connect(pinGain);
            pinGain.connect(sfxGainNode);
            pinOsc.start(now);
            pinOsc.stop(now + 0.035);

            // 2. Fibrous cork cushion thud
            const corkLen = Math.floor(sampleRate * 0.075);
            const corkBuffer = audioCtx.createBuffer(1, corkLen, sampleRate);
            const corkData = corkBuffer.getChannelData(0);
            for (let i = 0; i < corkLen; i++) {
                const env = Math.pow(1 - (i / corkLen), 1.8);
                corkData[i] = (Math.random() * 2 - 1) * env;
            }
            const corkSrc = audioCtx.createBufferSource();
            corkSrc.buffer = corkBuffer;
            const corkFilter = audioCtx.createBiquadFilter();
            corkFilter.type = 'bandpass';
            corkFilter.frequency.setValueAtTime(680, now + 0.005);
            corkFilter.Q.setValueAtTime(1.5, now + 0.005);
            const corkGain = audioCtx.createGain();
            corkGain.gain.setValueAtTime(0.75, now + 0.005);
            corkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
            corkSrc.connect(corkFilter);
            corkFilter.connect(corkGain);
            corkGain.connect(sfxGainNode);
            corkSrc.start(now + 0.005);

            // 3. Backing board wooden solid tap
            const tapOsc = audioCtx.createOscillator();
            const tapGain = audioCtx.createGain();
            tapOsc.type = 'triangle';
            tapOsc.frequency.setValueAtTime(180, now + 0.015);
            tapGain.gain.setValueAtTime(0.42, now + 0.015);
            tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            tapOsc.connect(tapGain);
            tapGain.connect(sfxGainNode);
            tapOsc.start(now + 0.015);
            tapOsc.stop(now + 0.075);
        } catch (e) { }
    }

    // Play case dossier inspection (light single paper sheet lift)
    function playCaseFileSfx() {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            playSinglePaperLiftSfx();
        } catch (e) { }
    }

    // Play distinctive, variative SFX based on the item pressed
    function playItemPressSfx(itemKey) {
        switch (itemKey) {
            case 'phone':
                playPhoneNotifSfx();
                break;
            case 'rotary-phone':
                playRotaryRingSfx();
                break;
            case 'chess':
                playChessPieceSfx();
                break;
            case 'corkboard':
                playCorkboardPinSfx();
                break;
            case 'case-files':
                playCaseFileSfx();
                break;
            default:
                playButtonSfx();
                break;
        }
    }

    // Subtle, variative hover sound for room items
    function playItemHoverSfx(itemKey) {
        if (!audioCtx || !sfxGainNode || sfxVolume <= 0.5) return;
        try {
            const now = audioCtx.currentTime;

            if (itemKey === 'phone') {
                // Subtle glassy smartphone touch blip
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1580, now);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
                osc.connect(gain);
                gain.connect(sfxGainNode);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (itemKey === 'rotary-phone') {
                // Subtle brass bell ting
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1244.5, now);
                gain.gain.setValueAtTime(0.16, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.connect(gain);
                gain.connect(sfxGainNode);
                osc.start(now);
                osc.stop(now + 0.055);
            } else if (itemKey === 'chess') {
                // Light wooden piece touch
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(320, now);
                gain.gain.setValueAtTime(0.20, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.connect(gain);
                gain.connect(sfxGainNode);
                osc.start(now);
                osc.stop(now + 0.045);
            } else if (itemKey === 'corkboard') {
                // Subtle cork/pin brush
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(740, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.connect(gain);
                gain.connect(sfxGainNode);
                osc.start(now);
                osc.stop(now + 0.035);
            } else if (itemKey === 'case-files') {
                // Subtle single paper edge touch
                playSinglePaperLiftSfx();
            } else {
                playTypewriterSfx();
            }
        } catch (e) { }
    }

    // Play vintage rotary telephone bell ting + receiver pickup sound when pressing the rotary phone
    function playRotaryPickupSfx() {
        playRotaryRingSfx();
    }

    // ==========================================
    // Character Expression Controller
    // ==========================================
    function setExpression(isCurious) {
        if (!spriteHappy || !spriteCurios) return;
        if (isCurious) {
            spriteHappy.classList.remove('active');
            spriteCurios.classList.add('active');
        } else {
            spriteCurios.classList.remove('active');
            spriteHappy.classList.add('active');
        }
    }

    // ==========================================
    // Typewriter Dialogue Engine
    // ==========================================
    function typeSentence(sentence, useCurious = false, callback = null) {
        if (!typedContent) return;
        if (typeTimeout) clearTimeout(typeTimeout);
        isTyping = true;
        activeText = sentence;
        typedContent.textContent = "";
        if (dialoguePrompt) dialoguePrompt.style.opacity = "0.3";

        setExpression(useCurious);

        let charIdx = 0;
        const speed = 26;

        function nextChar() {
            if (charIdx < sentence.length) {
                typedContent.textContent += sentence.charAt(charIdx);
                if (charIdx % 3 === 0) {
                    playTypewriterSfx();
                }
                charIdx++;
                typeTimeout = setTimeout(nextChar, speed);
            } else {
                isTyping = false;
                if (dialoguePrompt) dialoguePrompt.style.opacity = "1";
                if (callback) callback();
            }
        }

        nextChar();
    }

    function advanceDialogue() {
        initAudio();

        if (isTyping) {
            clearTimeout(typeTimeout);
            typedContent.textContent = activeText;
            isTyping = false;
            if (dialoguePrompt) dialoguePrompt.style.opacity = "1";
            return;
        }

        if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
            // On Step 3 (Press START), force the user to click the actual START button on the notepad!
            if (currentTutorialStep === 3) {
                playButtonSfx();
                if (tutorialSpotlight) {
                    tutorialSpotlight.style.transform = 'scale(1.06)';
                    setTimeout(() => {
                        if (tutorialSpotlight) tutorialSpotlight.style.transform = '';
                    }, 180);
                }
                return;
            }
            if (typeof nextTutorialStep === 'function') {
                nextTutorialStep();
            }
            return;
        }

        currentLineIndex = (currentLineIndex + 1) % dialogueLines.length;
        playButtonSfx();
        const entry = dialogueLines[currentLineIndex];
        typeSentence(entry.text, entry.curious);
    }

    // ==========================================
    // Event Listeners
    // ==========================================
    if (dialogueBox) {
        dialogueBox.addEventListener('click', () => {
            advanceDialogue();
        });
        dialogueBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                advanceDialogue();
            }
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            initAudio();
            playPaperSfx();
            const continueTutorialInOffice = (typeof isTutorialActive !== 'undefined' && isTutorialActive && currentTutorialStep === 3);
            if (folderOverlay) {
                folderOverlay.classList.remove('peek-home-tab', 'pull-investigate-tab', 'reveal-investigate-buttons');
            }
            navigateToView('investigate', true);
            if (continueTutorialInOffice && typeof openGameTutorial === 'function') {
                setTimeout(() => openGameTutorial(4), 260);
            }
        });
    }

    // ==========================================
    // Global Manila Folder Navigation Controller
    // ==========================================
    let investigateHoverTimer = null;

    // 1. HOME Tab Hotspot
    // 2. INVESTIGATE Tab Hotspot & Pop-Out Quick Links Drawer
    // Buttons pop out ONLY when hovering the INVESTIGATE tab/drawer on docked pages
    let hideInvestigateTimer = null;

    function openInvestigateDrawer() {
        if (hideInvestigateTimer) {
            clearTimeout(hideInvestigateTimer);
            hideInvestigateTimer = null;
        }
        if (folderOverlay) {
            folderOverlay.classList.remove('peek-home-tab');
            folderOverlay.classList.add('pull-investigate-tab', 'reveal-investigate-buttons');
        }
    }

    function closeInvestigateDrawer(immediate = false) {
        if (typeof isTutorialActive !== 'undefined' && isTutorialActive && currentTutorialStep === 4 && !immediate) {
            return;
        }
        if (hideInvestigateTimer) {
            clearTimeout(hideInvestigateTimer);
            hideInvestigateTimer = null;
        }
        if (immediate) {
            if (folderOverlay) {
                folderOverlay.classList.remove('pull-investigate-tab', 'reveal-investigate-buttons');
            }
        } else {
            hideInvestigateTimer = setTimeout(() => {
                if (typeof isTutorialActive !== 'undefined' && isTutorialActive && currentTutorialStep === 4) {
                    return;
                }
                if (folderOverlay) {
                    folderOverlay.classList.remove('pull-investigate-tab', 'reveal-investigate-buttons');
                }
            }, 360);
        }
    }

    if (investigateTabLink) {
        investigateTabLink.addEventListener('mouseenter', openInvestigateDrawer);
        investigateTabLink.addEventListener('mousemove', openInvestigateDrawer);
        investigateTabLink.addEventListener('mouseleave', () => closeInvestigateDrawer(false));

        investigateTabLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
                // Block navigation during tutorial until tutorial is finished
                return;
            }
            initAudio();
            playPaperSfx();
            closeInvestigateDrawer(true);
            navigateToView('investigate', true);
        });
    }

    // Hovering the buttons container or buttons themselves keeps the drawer open
    if (investigateNavButtons) {
        investigateNavButtons.addEventListener('mouseenter', openInvestigateDrawer);
        investigateNavButtons.addEventListener('mousemove', openInvestigateDrawer);
        investigateNavButtons.addEventListener('mouseleave', () => closeInvestigateDrawer(false));
    }

    // 1. HOME Tab Hotspot
    if (homeTabLink) {
        homeTabLink.addEventListener('mouseenter', () => {
            if (typeof isTutorialActive !== 'undefined' && isTutorialActive && currentTutorialStep === 4) {
                if (folderOverlay) {
                    folderOverlay.classList.add('peek-home-tab');
                }
                return;
            }
            closeInvestigateDrawer(true); // Close investigate drawer immediately when hovering HOME
            if (folderOverlay) {
                folderOverlay.classList.add('peek-home-tab');
            }
        });

        homeTabLink.addEventListener('mouseleave', () => {
            if (folderOverlay) {
                folderOverlay.classList.remove('peek-home-tab');
            }
        });

        homeTabLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
                if (currentTutorialStep === 5) {
                    closeGameTutorial();
                } else {
                    // Block navigation during tutorial until tutorial is finished
                    playTypewriterSfx();
                    return;
                }
            }
            initAudio();
            playPaperSfx();
            closeInvestigateDrawer(true);
            if (folderOverlay) {
                folderOverlay.classList.remove('peek-home-tab');
            }
            navigateToView('home', true);
        });
    }

    // 3. The 5 Quick-Jump Navigation Buttons
    if (tapeNavButtons && tapeNavButtons.length > 0) {
        tapeNavButtons.forEach((btn) => {
            btn.addEventListener('mouseenter', () => {
                openInvestigateDrawer();
                playTypewriterSfx(); // crisp tactile tick
            });
            btn.addEventListener('mousemove', openInvestigateDrawer);
            btn.addEventListener('mouseleave', () => closeInvestigateDrawer(false));

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
                    if (currentTutorialStep === 5) {
                        closeGameTutorial();
                    } else {
                        // Tactile click feedback while blocking navigation until tutorial is over
                        playTypewriterSfx();
                        return;
                    }
                }
                initAudio();
                playPaperSfx();
                const targetView = btn.dataset.target || btn.getAttribute('href').replace(/^#/, '');
                closeInvestigateDrawer(true);
                navigateToView(targetView, true);
            });
        });
    }

    if (bgmSlider) {
        bgmSlider.addEventListener('input', (e) => {
            bgmVolume = parseFloat(e.target.value);
            localStorage.setItem('melia_bgm_vol', String(bgmVolume));
            initAudio();
        });
    }

    if (sfxSlider) {
        sfxSlider.addEventListener('input', (e) => {
            initAudio();
            sfxVolume = parseFloat(e.target.value);
            localStorage.setItem('melia_sfx_vol', String(sfxVolume));
            if (sfxGainNode && audioCtx) {
                sfxGainNode.gain.setTargetAtTime((sfxVolume / 100) * 0.95, audioCtx.currentTime, 0.02);
            }
            const now = performance.now();
            if (now - lastSfxPreviewTime > 70) {
                lastSfxPreviewTime = now;
                playTypewriterSfx();
            }
        });
    }

    // ==========================================
    // Subtle 3D Mouse-Follow Parallax (Background, Sprite & Dialogue Box + Investigate Scene)
    // ==========================================
    const investigateScene = document.getElementById('investigateScene');

    if (landingStage || investigateScene) {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId = null;

        function updateParallax() {
            currentX += (targetX - currentX) * 0.075;
            currentY += (targetY - currentY) * 0.075;

            if (landingStage && !document.body.classList.contains('view-investigate')) {
                landingStage.style.setProperty('--mx', currentX.toFixed(4));
                landingStage.style.setProperty('--my', currentY.toFixed(4));
            }
            if (investigateScene) {
                investigateScene.style.setProperty('--imx', currentX.toFixed(4));
                investigateScene.style.setProperty('--imy', currentY.toFixed(4));
            }

            if (Math.abs(targetX - currentX) > 0.0005 || Math.abs(targetY - currentY) > 0.0005) {
                rafId = requestAnimationFrame(updateParallax);
            } else {
                rafId = null;
            }
        }

        window.addEventListener('pointermove', (e) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            targetX = Math.max(-1, Math.min(1, nx));
            targetY = Math.max(-1, Math.min(1, ny));

            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        }, { passive: true });

        window.addEventListener('pointerleave', () => {
            targetX = 0;
            targetY = 0;
            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        });
    }

    // ==========================================
    // Investigate Room: Item Shine / Light-Up & Floating Popup Controller
    // ==========================================
    const investigatePopup = document.getElementById('investigatePopup');
    const popupItemTitle = document.getElementById('popupItemTitle');
    const popupItemDest = document.getElementById('popupItemDest');
    const popupItemDesc = document.getElementById('popupItemDesc');
    const hotspots = document.querySelectorAll('.investigate-hotspot');
    const itemLayers = document.querySelectorAll('.investigate-item-img');

    function positionInvestigatePopup(clientX, clientY, fallbackEl) {
        if (!investigatePopup) return;
        const pad = 16;
        const popupWidth = 280;
        const popupHeight = investigatePopup.offsetHeight || 152;

        let x = clientX + 20;
        let y = clientY - popupHeight - 14;

        if ((!clientX && !clientY) && fallbackEl) {
            const rect = fallbackEl.getBoundingClientRect();
            x = rect.left + rect.width / 2 - popupWidth / 2;
            y = rect.top - popupHeight - 14;
        }

        // Keep popup cleanly inside the viewport
        const maxRight = window.innerWidth - popupWidth - pad;
        if (x > maxRight) x = Math.max(pad, clientX - popupWidth - 20);
        if (x < pad) x = pad;
        if (y < pad) y = clientY + 24;
        if (y + popupHeight > window.innerHeight - pad) {
            y = window.innerHeight - popupHeight - pad;
        }

        investigatePopup.style.left = `${Math.round(x)}px`;
        investigatePopup.style.top = `${Math.round(y)}px`;
    }

    function activateRoomItem(hotspot, clientX = 0, clientY = 0) {
        const itemKey = hotspot.getAttribute('data-item');
        if (!itemKey) return;

        if (investigateScene) {
            investigateScene.classList.add('has-hovered-item');
        }

        itemLayers.forEach((img) => {
            if (img.getAttribute('data-item-layer') === itemKey) {
                img.classList.add('is-active');
            } else {
                img.classList.remove('is-active');
            }
        });

        if (investigatePopup) {
            if (popupItemTitle) popupItemTitle.textContent = hotspot.getAttribute('data-title') || '';
            if (popupItemDest) popupItemDest.textContent = hotspot.getAttribute('data-destination') || '';
            if (popupItemDesc) popupItemDesc.textContent = hotspot.getAttribute('data-desc') || '';
            investigatePopup.hidden = false;
            positionInvestigatePopup(clientX, clientY, hotspot);
            requestAnimationFrame(() => {
                investigatePopup.classList.add('is-visible');
            });
        }
    }

    function deactivateRoomItems() {
        if (investigateScene) {
            investigateScene.classList.remove('has-hovered-item');
        }
        itemLayers.forEach((img) => img.classList.remove('is-active'));
        if (investigatePopup) {
            investigatePopup.classList.remove('is-visible');
            investigatePopup.hidden = true;
        }
    }

    hotspots.forEach((hotspot) => {
        hotspot.addEventListener('pointerenter', (e) => {
            initAudio();
            const itemKey = hotspot.getAttribute('data-item') || '';
            playItemHoverSfx(itemKey);
            activateRoomItem(hotspot, e.clientX, e.clientY);
        });

        hotspot.addEventListener('pointermove', (e) => {
            positionInvestigatePopup(e.clientX, e.clientY, hotspot);
        });

        hotspot.addEventListener('pointerleave', () => {
            deactivateRoomItems();
        });

        hotspot.addEventListener('focus', () => {
            const itemKey = hotspot.getAttribute('data-item') || '';
            playItemHoverSfx(itemKey);
            activateRoomItem(hotspot, 0, 0);
        });

        hotspot.addEventListener('blur', () => {
            deactivateRoomItems();
        });

        hotspot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
                if (currentTutorialStep === 5) {
                    // Step 5 briefing invites user to click any object to begin investigating!
                    closeGameTutorial();
                } else {
                    return;
                }
            }
            initAudio();
            const itemKey = hotspot.getAttribute('data-item') || '';
            const targetHash = hotspot.getAttribute('href') || '';
            const targetView = targetHash.replace(/^#/, '') || 'investigate';
            playItemPressSfx(itemKey);

            document.body.classList.add('room-transitioning-to-subpage');

            // Allow the distinct, variative SFX enough time to play out cleanly before navigating
            const delays = {
                'rotary-phone': 480,
                'phone': 400,
                'case-files': 280,
                'chess': 240,
                'corkboard': 240
            };
            const navDelay = delays[itemKey] || 220;

            setTimeout(() => {
                document.body.classList.remove('room-transitioning-to-subpage');
                navigateToView(targetView, true);
            }, navDelay);
        });
    });

    // ==========================================
    // Investigation Room Specular Glare Canvas Controller
    // Conforms strictly to non-transparent pixels of each clue object
    // Calm, slow, infrequent sweeps (14.5s cycle, ~2.1-2.8s sweep per item, ~12s calm rest)
    // ==========================================
    const glareCanvas = document.getElementById('investigateGlareCanvas');
    if (glareCanvas) {
        const glareCtx = glareCanvas.getContext('2d');
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 1672;
        offCanvas.height = 941;
        const offCtx = offCanvas.getContext('2d');

        const glareItems = [
            {
                key: 'corkboard',
                src: 'assets/image/rooms/room-investigate-corkboard.png',
                getImg: () => document.querySelector('.investigate-item-img[data-item-layer="corkboard"]'),
                bbox: [569, 64, 1263, 572],
                start: 0.0,
                duration: 5.5,
                beamHalfWidth: 150
            },
            {
                key: 'rotary-phone',
                src: 'assets/image/rooms/room-investigate-rotaryphone.png',
                getImg: () => document.querySelector('.investigate-item-img[data-item-layer="rotary-phone"]'),
                bbox: [543, 649, 824, 839],
                start: 1.2,
                duration: 4.8,
                beamHalfWidth: 80
            },
            {
                key: 'case-files',
                src: 'assets/image/rooms/room-investigate-casefiles.png',
                getImg: () => document.querySelector('.investigate-item-img[data-item-layer="case-files"]'),
                bbox: [247, 781, 694, 930],
                start: 3.0,
                duration: 5.0,
                beamHalfWidth: 100
            },
            {
                key: 'phone',
                src: 'assets/image/rooms/room-investigate-cellphone.png',
                getImg: () => document.querySelector('.investigate-item-img[data-item-layer="phone"]'),
                bbox: [772, 838, 940, 893],
                start: 4.6,
                duration: 4.4,
                beamHalfWidth: 65
            },
            {
                key: 'chess',
                src: 'assets/image/rooms/room-investigate-chess.png',
                getImg: () => document.querySelector('.investigate-item-img[data-item-layer="chess"]'),
                bbox: [1397, 736, 1672, 880],
                start: 6.0,
                duration: 5.2,
                beamHalfWidth: 90
            }
        ];

        // Ensure each item has a loaded image instance
        glareItems.forEach((it) => {
            const domEl = it.getImg();
            if (domEl && domEl.complete && domEl.naturalWidth > 0) {
                it.img = domEl;
            } else {
                const img = new Image();
                img.src = it.src;
                it.img = img;
            }
        });

        const GLARE_CYCLE = 9.6;
        let glareRafId = null;
        let glareStartTime = null;

        const urlParams = new URLSearchParams(window.location.search);
        const fixedGlareTime = urlParams.has('glareTime') ? parseFloat(urlParams.get('glareTime')) : null;

        function renderGlareFrame(timestamp) {
            if (fixedGlareTime !== null) {
                timestamp = fixedGlareTime * 1000;
                glareStartTime = 0;
            } else if (!glareStartTime) {
                glareStartTime = timestamp;
            }
            const elapsed = (timestamp - glareStartTime) / 1000;
            const loopT = elapsed % GLARE_CYCLE;

            glareCtx.clearRect(0, 0, 1672, 941);

            for (let i = 0; i < glareItems.length; i++) {
                const item = glareItems[i];
                let relT = loopT - item.start;
                if (relT < 0) relT += GLARE_CYCLE;

                if (relT <= item.duration) {
                    const img = (item.img && item.img.complete && item.img.naturalWidth > 0)
                        ? item.img
                        : item.getImg();
                    if (!img || !img.complete || !img.naturalWidth) continue;

                    const p = relT / item.duration;
                    // Smooth sinusoidal ease
                    const ease = (1 - Math.cos(p * Math.PI)) / 2;

                    const [x1, y1, x2, y2] = item.bbox;
                    const w = x2 - x1;
                    const h = y2 - y1;
                    const pad = item.beamHalfWidth * 1.5;

                    const curX = (x1 - pad) + ((x2 + pad) - (x1 - pad)) * ease;
                    const curY = (y1 - pad) + ((y2 + pad) - (y1 - pad)) * ease;

                    let alpha = 1.0;
                    if (p < 0.20) alpha = p / 0.20;
                    else if (p > 0.80) alpha = (1.0 - p) / 0.20;

                    // Clear offscreen buffer
                    offCtx.clearRect(0, 0, 1672, 941);

                    // 1. Draw cutout image
                    offCtx.drawImage(img, 0, 0);

                    // 2. Clip strictly to non-transparent pixels
                    offCtx.globalCompositeOperation = 'source-in';

                    // 3. Specular linear gradient (gentle, soft-edged ambient glint)
                    const bw = item.beamHalfWidth;
                    const grad = offCtx.createLinearGradient(curX - bw, curY - bw, curX + bw, curY + bw);
                    grad.addColorStop(0.00, 'rgba(255, 255, 255, 0)');
                    grad.addColorStop(0.24, 'rgba(255, 255, 255, 0)');
                    grad.addColorStop(0.42, `rgba(255, 255, 255, ${0.35 * alpha})`);
                    grad.addColorStop(0.50, `rgba(255, 255, 255, ${0.80 * alpha})`);
                    grad.addColorStop(0.58, `rgba(255, 255, 255, ${0.35 * alpha})`);
                    grad.addColorStop(0.76, 'rgba(255, 255, 255, 0)');
                    grad.addColorStop(1.00, 'rgba(255, 255, 255, 0)');

                    offCtx.fillStyle = grad;
                    offCtx.fillRect(x1 - pad, y1 - pad, w + pad * 2, h + pad * 2);

                    offCtx.globalCompositeOperation = 'source-over';

                    // 4. Paint to main canvas (no break: allows multiple concurrent subtle glints)
                    glareCtx.drawImage(offCanvas, 0, 0);
                }
            }

            if (currentActiveView === 'investigate') {
                glareRafId = requestAnimationFrame(renderGlareFrame);
            } else {
                glareRafId = null;
            }
        }

        startGlareAnimation = function () {
            if (!glareRafId) {
                glareStartTime = null;
                glareRafId = requestAnimationFrame(renderGlareFrame);
            }
        };

        stopGlareAnimation = function () {
            if (glareRafId) {
                cancelAnimationFrame(glareRafId);
                glareRafId = null;
            }
            if (glareCtx) {
                glareCtx.clearRect(0, 0, 1672, 941);
            }
        };

        window.renderGlareAt = function (seconds) {
            glareStartTime = 0;
            renderGlareFrame((seconds || 0) * 1000);
        };

        if (currentActiveView === 'investigate') {
            startGlareAnimation();
        }
    }

    // Subpage "Back to Investigation Room" buttons
    document.querySelectorAll('.back-to-room-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            initAudio();
            playSinglePaperLiftSfx();
            navigateToView('investigate', true);
        });
    });

    // ==========================================
    // Suspect Case File / About Me Dossier Controller (case-file.html)
    // ==========================================
    const dossierDesk = document.getElementById('dossierDesk');
    if (dossierDesk) {
        const sheets = Array.from(dossierDesk.querySelectorAll('.dossier-sheet'));
        const focusTabs = Array.from(document.querySelectorAll('.dossier-tab[data-focus-sheet]'));
        const spreadBtn = document.getElementById('spreadPagesBtn');
        const stackBtn = document.getElementById('stackPagesBtn');

        let topSheetZ = 20;

        function setFrontSheet(activeSheet) {
            if (!activeSheet) return;
            topSheetZ += 1;
            if (topSheetZ > 500) {
                sheets.forEach((s) => {
                    const z = parseInt(s.style.zIndex, 10) || 12;
                    s.style.zIndex = String(Math.max(12, z - 300));
                });
                topSheetZ -= 300;
            }
            activeSheet.style.zIndex = String(topSheetZ);
            sheets.forEach((s) => s.classList.toggle('is-front', s === activeSheet));

            const id = activeSheet.id;
            focusTabs.forEach((tab) => {
                tab.classList.toggle('is-active', tab.getAttribute('data-focus-sheet') === id);
            });
        }

        function spreadDossierPages(animateSound = false) {
            if (animateSound) {
                initAudio();
                playSinglePaperLiftSfx(0);
                playSinglePaperLiftSfx(0.07);
            }
            const deskRect = dossierDesk.getBoundingClientRect();
            const deskW = deskRect.width || window.innerWidth;
            const deskH = deskRect.height || (window.innerHeight - 54);
            const leftPad = 36;
            const rightClearance = 128;
            const usableW = Math.max(320, deskW - leftPad - rightClearance);

            // Dynamically calculate the vertical center of the desk stage
            // so the spread is nicely centered in the middle of the screen without overflowing the bottom
            const baseCenterTop = Math.max(22, Math.min(Math.round(deskH - 565), Math.round((deskH - 535) / 2)));

            // Subtle vertical offsets to preserve the natural, organic fanned spread
            const verticalOffsets = {
                'sheet-profile': -8,
                'sheet-experience': 8,
                'sheet-committee': 12,
                'sheet-skills': -8,
                'sheet-education': -6,
                'sheet-tools': 6,
                'sheet-note': -4
            };

            sheets.forEach((sheet, idx) => {
                const pctX = parseFloat(sheet.getAttribute('data-default-x') || '5');
                const rot = parseFloat(sheet.getAttribute('data-default-rot') || '0');
                const sheetW = sheet.offsetWidth || (sheet.id === 'sheet-profile' ? 440 : sheet.id === 'sheet-note' ? 295 : sheet.id === 'sheet-tools' ? 310 : 390);
                const maxAllowedLeft = Math.max(leftPad, Math.round(deskW - rightClearance - sheetW));

                const rawLeft = leftPad + Math.round((pctX / 100) * usableW);
                const pxLeft = Math.max(leftPad, Math.min(maxAllowedLeft, rawLeft));
                const stagger = verticalOffsets[sheet.id] !== undefined ? verticalOffsets[sheet.id] : 0;
                const pxTop = Math.max(18, baseCenterTop + stagger);

                sheet.style.left = `${pxLeft}px`;
                sheet.style.top = `${pxTop}px`;
                sheet.style.setProperty('--sheet-rot', `${rot}deg`);
                sheet.style.zIndex = String(12 + (sheets.length - idx));
            });
            topSheetZ = 12 + sheets.length + 2;
            setFrontSheet(document.getElementById('sheet-profile') || sheets[0]);
        }

        function stackDossierPages() {
            initAudio();
            playSinglePaperLiftSfx();
            const deskRect = dossierDesk.getBoundingClientRect();
            // Unified top position to center the stack vertically in the desk stage
            const stackTop = Math.max(44, Math.round((deskRect.height - 500) / 2));

            sheets.forEach((sheet, idx) => {
                const sheetW = sheet.offsetWidth || (sheet.id === 'sheet-profile' ? 470 : sheet.id === 'sheet-note' ? 295 : sheet.id === 'sheet-tools' ? 320 : 415);
                const centerX = Math.round((deskRect.width - sheetW) / 2);
                const sheetTop = sheet.id === 'sheet-note' ? stackTop + 24 : stackTop;

                sheet.style.left = `${centerX}px`;
                sheet.style.top = `${sheetTop}px`;
                sheet.style.setProperty('--sheet-rot', '0deg');
                sheet.style.zIndex = String(20 + (sheets.length - idx));
            });
            topSheetZ = 20 + sheets.length + 2;
            setFrontSheet(sheets[0]);
        }

        // Initialize page positions
        spreadDossierPages(false);
        window.spreadDossierPages = spreadDossierPages;
        window.stackDossierPages = stackDossierPages;

        // Keep sheets bounded on window resize so they never scroll completely off screen
        window.addEventListener('resize', () => {
            const deskRect = dossierDesk.getBoundingClientRect();
            sheets.forEach((sheet) => {
                const sheetW = sheet.offsetWidth || 380;
                const curL = parseFloat(sheet.style.left) || 0;
                const curT = parseFloat(sheet.style.top) || 0;
                const minL = -Math.round(sheetW * 0.78);
                const maxL = Math.max(200, Math.round(deskRect.width - 50));
                const minT = sheet.id === 'sheet-profile' ? 16 : 6;
                const maxT = Math.max(300, Math.round(deskRect.height + 160));
                if (curL < minL) sheet.style.left = `${minL}px`;
                if (curL > maxL) sheet.style.left = `${maxL}px`;
                if (curT < minT) sheet.style.top = `${minT}px`;
                if (curT > maxT) sheet.style.top = `${maxT}px`;
            });
        });

        // Pointer drag handling for each dossier sheet
        sheets.forEach((sheet) => {
            let dragging = false;
            let startPointerX = 0;
            let startPointerY = 0;
            let startLeft = 0;
            let startTop = 0;

            sheet.addEventListener('pointerdown', (e) => {
                if (e.target.closest('button, a')) return;
                if (window.innerWidth <= 900 || window.innerHeight <= 560) return;

                initAudio();
                playSinglePaperLiftSfx();
                setFrontSheet(sheet);

                dragging = true;
                startPointerX = e.clientX;
                startPointerY = e.clientY;
                startLeft = parseFloat(sheet.style.left) || sheet.offsetLeft;
                startTop = parseFloat(sheet.style.top) || sheet.offsetTop;

                sheet.classList.add('is-dragging');
                if (sheet.setPointerCapture) {
                    try { sheet.setPointerCapture(e.pointerId); } catch (_) { }
                }
            });

            sheet.addEventListener('pointermove', (e) => {
                if (!dragging) return;
                const dx = e.clientX - startPointerX;
                const dy = e.clientY - startPointerY;

                const deskRect = dossierDesk.getBoundingClientRect();
                const sheetW = sheet.offsetWidth || 380;

                // Expanded drag boundaries: allow moving papers much further outside the manila folder box
                const minLeft = -Math.round(sheetW * 0.78);
                const maxLeft = Math.max(200, Math.round(deskRect.width - 50));
                const minTop = sheet.id === 'sheet-profile' ? 16 : 6;
                const maxTop = Math.max(300, Math.round(deskRect.height + 160));

                const nextLeft = Math.max(minLeft, Math.min(maxLeft, startLeft + dx));
                const nextTop = Math.max(minTop, Math.min(maxTop, startTop + dy));

                sheet.style.left = `${Math.round(nextLeft)}px`;
                sheet.style.top = `${Math.round(nextTop)}px`;
            });

            function endDrag(e) {
                if (!dragging) return;
                dragging = false;
                sheet.classList.remove('is-dragging');
                if (sheet.releasePointerCapture && e && e.pointerId !== undefined) {
                    try { sheet.releasePointerCapture(e.pointerId); } catch (_) { }
                }
                playSinglePaperDropSfx();
            }

            sheet.addEventListener('pointerup', endDrag);
            sheet.addEventListener('pointercancel', endDrag);
        });

        // Quick Focus Tabs
        focusTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-focus-sheet');
                const targetSheet = targetId ? document.getElementById(targetId) : null;
                if (!targetSheet) return;

                initAudio();
                playSinglePaperLiftSfx();
                setFrontSheet(targetSheet);

                if (window.innerWidth <= 900 || window.innerHeight <= 560) {
                    targetSheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                targetSheet.classList.remove('sheet-pulse');
                void targetSheet.offsetWidth;
                targetSheet.classList.add('sheet-pulse');
            });
        });

        if (spreadBtn) {
            spreadBtn.addEventListener('click', () => spreadDossierPages(true));
        }
        if (stackBtn) {
            stackBtn.addEventListener('click', stackDossierPages);
        }

        const topbarCvBtn = document.getElementById('topbarCvBtn');
        const profileCvBtn = document.getElementById('profileCvBtn');
        const profileContactBtn = document.getElementById('profileContactBtn');
        [topbarCvBtn, profileCvBtn, profileContactBtn].forEach((btn) => {
            if (btn) {
                btn.addEventListener('click', () => {
                    initAudio();
                    playSinglePaperLiftSfx();
                });
            }
        });
    }

    function unlockAudioOnInteraction() {
        initAudio();
        if (!bgmAudio.paused || bgmVolume <= 0) {
            window.removeEventListener('pointerdown', unlockAudioOnInteraction);
            window.removeEventListener('click', unlockAudioOnInteraction);
            window.removeEventListener('keydown', unlockAudioOnInteraction);
        }
    }

    window.addEventListener('pointerdown', unlockAudioOnInteraction);
    window.addEventListener('click', unlockAudioOnInteraction);
    window.addEventListener('keydown', unlockAudioOnInteraction);

    // ==========================================
    // Recruiter / Fast-Track Mode Dialog Controller
    // ==========================================
    const recruiterModal = document.getElementById('recruiterModal');
    const openRecruiterBtn = document.getElementById('openRecruiterModeBtn');
    const dossierRecruiterBtn = document.getElementById('dossierRecruiterBtn');
    const corkboardRecruiterBtn = document.getElementById('corkboardRecruiterBtn');
    const closeRecruiterBtn = document.getElementById('closeRecruiterModalBtn');
    const recruiterTabs = recruiterModal ? recruiterModal.querySelectorAll('.dossier-folder-tab') : [];
    const recruiterPanels = recruiterModal ? recruiterModal.querySelectorAll('.dossier-page-panel') : [];

    function switchRecruiterTab(targetKey) {
        if (!targetKey) return;
        recruiterTabs.forEach((tab) => {
            const isMatch = tab.getAttribute('data-tab-target') === targetKey;
            tab.classList.toggle('is-active', isMatch);
            tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
        recruiterPanels.forEach((panel) => {
            const isMatch = panel.getAttribute('data-page-panel') === targetKey;
            panel.classList.toggle('is-active', isMatch);
            if (isMatch) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });
        const viewport = recruiterModal ? recruiterModal.querySelector('.dossier-body-viewport') : null;
        if (viewport) {
            viewport.scrollTop = 0;
        }
        if (typeof playPaperSfx === 'function') {
            playPaperSfx();
        }
    }

    recruiterTabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = tab.getAttribute('data-tab-target');
            switchRecruiterTab(target);
        });
    });

    function openRecruiterModal() {
        if (!recruiterModal) return;
        switchRecruiterTab('about'); // Always start on Page 1: About Me
        recruiterModal.hidden = false;
        requestAnimationFrame(() => {
            recruiterModal.classList.add('is-open');
        });
        document.body.classList.add('modal-open');
        if (openRecruiterBtn) openRecruiterBtn.setAttribute('aria-expanded', 'true');
        playPaperSfx();
    }

    function closeRecruiterModal() {
        if (!recruiterModal) return;
        recruiterModal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        if (openRecruiterBtn) openRecruiterBtn.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            if (!recruiterModal.classList.contains('is-open')) {
                recruiterModal.hidden = true;
            }
        }, 250);

        // If tutorial is active, smoothly resume spotlight and tutorial guidance
        if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
            if (typeof positionTutorialElements === 'function') {
                positionTutorialElements();
            }
            if (typeof startTutorialSpotlightLoop === 'function') {
                startTutorialSpotlightLoop();
            }
        }
    }

    [openRecruiterBtn, dossierRecruiterBtn, corkboardRecruiterBtn].forEach((btn) => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openRecruiterModal();
            });
        }
    });

    if (closeRecruiterBtn) {
        closeRecruiterBtn.addEventListener('click', closeRecruiterModal);
    }

    if (recruiterModal) {
        recruiterModal.addEventListener('click', (e) => {
            if (e.target === recruiterModal) {
                closeRecruiterModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (deviceDisclaimerModal && !deviceDisclaimerModal.hidden) {
                closeDeviceDisclaimer();
            } else if (recruiterModal && !recruiterModal.hidden) {
                closeRecruiterModal();
            } else if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
                closeGameTutorial();
            }
        }
    });

    // View Jump buttons inside Recruiter Modal
    document.querySelectorAll('[data-jump-view]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-jump-view');
            if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
                closeGameTutorial();
            }
            closeRecruiterModal();
            playButtonSfx();
            if (target) {
                navigateToView(target);
            }
        });
    });

    // Project exhibit cards inside Recruiter Modal (Direct 1-Click to corkboard + lightbox)
    document.querySelectorAll('[data-open-project]').forEach((card) => {
        card.addEventListener('click', () => {
            const projId = card.getAttribute('data-open-project');
            if (typeof isTutorialActive !== 'undefined' && isTutorialActive) {
                closeGameTutorial();
            }
            closeRecruiterModal();
            playButtonSfx();
            navigateToView('corkboard');
            setTimeout(() => {
                if (typeof window.openEvidenceModal === 'function') {
                    window.openEvidenceModal(projId);
                }
            }, 250);
        });
    });

    // Copy helpers in Contact panel (Email, WhatsApp, Instagram)
    document.querySelectorAll('[data-recruiter-copy]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = btn.getAttribute('data-recruiter-copy');
            if (!val) return;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(val).then(() => {
                    const originalHtml = btn.innerHTML;
                    btn.innerHTML = '<span>Copied!</span>';
                    playButtonSfx();
                    setTimeout(() => {
                        btn.innerHTML = originalHtml;
                    }, 2000);
                }).catch(() => {
                    prompt('Copy contact info:', val);
                });
            } else {
                prompt('Copy contact info:', val);
            }
        });
    });

    window.openRecruiterModal = openRecruiterModal;
    window.closeRecruiterModal = closeRecruiterModal;

    /* ==========================================================================
       Device & Orientation Field Advisory Modal Controller
       ========================================================================== */
    const deviceDisclaimerModal = document.getElementById('deviceDisclaimerModal');
    const deviceDisclaimerCard = document.getElementById('deviceDisclaimerCard');
    const closeDeviceDisclaimerBtn = document.getElementById('closeDeviceDisclaimerBtn');
    const confirmDeviceDisclaimerBtn = document.getElementById('confirmDeviceDisclaimerBtn');
    const disclaimerOrientationStatus = document.getElementById('disclaimerOrientationStatus');
    const disclaimerOrientationText = document.getElementById('disclaimerOrientationText');
    const portraitRotatePill = document.getElementById('portraitRotatePill');
    const closeRotatePillBtn = document.getElementById('closeRotatePillBtn');

    const STORAGE_KEY_DEVICE_DISCLAIMER = 'melia_device_disclaimer_seen';

    function isMobileDevice() {
        const ua = navigator.userAgent || navigator.vendor || window.opera || '';
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
        const isTouchMobile = (navigator.maxTouchPoints > 1 && window.matchMedia && window.matchMedia('(pointer: coarse)').matches && window.innerWidth <= 1024);
        return isMobileUA || isTouchMobile;
    }

    function updateOrientationStatus() {
        const isMobile = isMobileDevice();
        const isLandscape = window.innerWidth > window.innerHeight;
        const isNarrow = window.innerWidth < 850 || window.innerHeight < 600;

        if (!isMobile && deviceDisclaimerModal && !deviceDisclaimerModal.hidden) {
            deviceDisclaimerModal.hidden = true;
            deviceDisclaimerModal.classList.remove('is-closing');
            if (portraitRotatePill) portraitRotatePill.hidden = true;
            checkAndTriggerGameTutorial();
            return;
        }

        if (disclaimerOrientationStatus && disclaimerOrientationText) {
            disclaimerOrientationStatus.classList.remove('is-portrait', 'is-landscape', 'is-desktop');

            if (!isLandscape && (isNarrow || isMobile)) {
                disclaimerOrientationStatus.classList.add('is-portrait');
                disclaimerOrientationText.textContent = '⚠️ Portrait Mode detected — Rotate your device sideways for the best view!';
            } else if (isLandscape && (isNarrow || isMobile)) {
                disclaimerOrientationStatus.classList.add('is-landscape');
                disclaimerOrientationText.textContent = '✓ Landscape Mode active — Screen ready for detective inspection!';
            } else {
                disclaimerOrientationStatus.classList.add('is-desktop');
                disclaimerOrientationText.textContent = '✓ Desktop Screen detected — Optimal viewing layout ready!';
            }
        }

        // Manage floating reminder pill on mobile portrait only
        if (portraitRotatePill && !portraitRotatePill.hasAttribute('data-user-closed')) {
            if (isMobile && !isLandscape && deviceDisclaimerModal && deviceDisclaimerModal.hidden) {
                portraitRotatePill.hidden = false;
            } else {
                portraitRotatePill.hidden = true;
            }
        }
    }

    function openDeviceDisclaimer(force = false) {
        if (!deviceDisclaimerModal) return;
        // Only show the device disclaimer modal when visiting on a mobile device
        if (!force && !isMobileDevice()) {
            deviceDisclaimerModal.hidden = true;
            if (portraitRotatePill) portraitRotatePill.hidden = true;
            checkAndTriggerGameTutorial();
            return;
        }
        if (!force) {
            try {
                if (sessionStorage.getItem(STORAGE_KEY_DEVICE_DISCLAIMER) === 'true') {
                    // Already acknowledged this session
                    updateOrientationStatus();
                    checkAndTriggerGameTutorial();
                    return;
                }
            } catch (e) {
                // Ignore storage restrictions
            }
        }

        updateOrientationStatus();
        deviceDisclaimerModal.classList.remove('is-closing');
        deviceDisclaimerModal.hidden = false;
        if (portraitRotatePill) portraitRotatePill.hidden = true;
    }

    function closeDeviceDisclaimer() {
        if (!deviceDisclaimerModal || deviceDisclaimerModal.hidden) return;
        deviceDisclaimerModal.classList.add('is-closing');

        try {
            sessionStorage.setItem(STORAGE_KEY_DEVICE_DISCLAIMER, 'true');
        } catch (e) {
            // Ignore storage restrictions
        }

        playPaperSfx();

        setTimeout(() => {
            deviceDisclaimerModal.hidden = true;
            deviceDisclaimerModal.classList.remove('is-closing');
            updateOrientationStatus();
            checkAndTriggerGameTutorial();
        }, 280);
    }

    if (confirmDeviceDisclaimerBtn) {
        confirmDeviceDisclaimerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeDeviceDisclaimer();
        });
    }

    if (closeDeviceDisclaimerBtn) {
        closeDeviceDisclaimerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeDeviceDisclaimer();
        });
    }

    if (deviceDisclaimerModal) {
        deviceDisclaimerModal.addEventListener('click', (e) => {
            if (e.target === deviceDisclaimerModal) {
                closeDeviceDisclaimer();
            }
        });
    }

    if (portraitRotatePill) {
        portraitRotatePill.addEventListener('click', (e) => {
            if (e.target === closeRotatePillBtn) return;
            openDeviceDisclaimer(true);
        });
    }

    if (closeRotatePillBtn) {
        closeRotatePillBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (portraitRotatePill) {
                portraitRotatePill.hidden = true;
                portraitRotatePill.setAttribute('data-user-closed', 'true');
            }
        });
    }

    window.addEventListener('resize', updateOrientationStatus);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateOrientationStatus, 150);
    });

    window.openDeviceDisclaimer = openDeviceDisclaimer;
    window.closeDeviceDisclaimer = closeDeviceDisclaimer;

    /* ==========================================================================
       Interactive Character-Dialogue Connected Tutorial Controller
       Melia guides visitors through Home (Intro -> Fast-Track -> Settings -> Start)
       and into the Detective Office (Easy Nav -> Hover & Click Room Objects).
       Forces visitors to follow directions step-by-step with zero extra buttons.
       ========================================================================== */
    const gameTutorialOverlay = document.getElementById('gameTutorialOverlay');
    const tutorialSpotlight = document.getElementById('tutorialSpotlight');
    const spotlightPointer = document.getElementById('spotlightPointer');
    const pointerArrow = document.getElementById('pointerArrow');
    const pointerBadgeText = document.getElementById('pointerBadgeText');
    const tutorialSkipBtn = document.getElementById('tutorialSkipBtn');

    if (tutorialSkipBtn) {
        tutorialSkipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeGameTutorial();
        });
    }

    const STORAGE_KEY_TUTORIAL_COMPLETED = 'melia_tutorial_completed';
    let currentTutorialStep = 0;
    let isTutorialActive = false;
    let hasCompletedTutorialThisVisit = false;
    try {
        hasCompletedTutorialThisVisit = (sessionStorage.getItem(STORAGE_KEY_TUTORIAL_COMPLETED) === 'true');
    } catch (e) {
        hasCompletedTutorialThisVisit = false;
    }
    let tutorialStepTimers = [];
    let tutorialRafId = null;

    function clearTutorialStepTimers() {
        while (tutorialStepTimers.length > 0) {
            clearTimeout(tutorialStepTimers.pop());
        }
    }

    function startTutorialSpotlightLoop() {
        if (tutorialRafId) cancelAnimationFrame(tutorialRafId);
        function loop() {
            if (!isTutorialActive) {
                tutorialRafId = null;
                return;
            }
            positionTutorialElements();
            tutorialRafId = requestAnimationFrame(loop);
        }
        tutorialRafId = requestAnimationFrame(loop);
    }

    let step4StaticRect = null;
    let step4Settled = false;

    const tutorialSteps = [
        {
            view: 'home',
            badge: "",
            arrow: "",
            pointerPos: "center",
            curious: false,
            text: "Hi there! I'm Melia, your detective assistant. Welcome to my little agency! Let me give you a quick tour before we head into the office.",
            getTarget: () => null,
            padding: 0
        },
        {
            view: 'home',
            badge: "FAST-TRACK DOSSIER",
            arrow: "◄",
            pointerPos: "right",
            curious: true,
            text: "See the RECRUITER MODE button at the top-left? If you're in a hurry, click it anytime to see all my projects, case files, and my CV in one place!",
            getTarget: () => document.getElementById('openRecruiterModeBtn'),
            padding: 8
        },
        {
            view: 'home',
            badge: "AUDIO SETTINGS",
            arrow: "▼",
            pointerPos: "top",
            curious: false,
            text: "Over here on the folder is your Settings note! You can slide the BGM and SFX controls anytime to adjust the background music and sound effects to your liking.",
            getTarget: () => {
                const note = document.getElementById('settingsNoteContainer');
                if (note) {
                    const r = note.getBoundingClientRect();
                    return {
                        getBoundingClientRect: () => ({
                            top: r.top + r.height * 0.12,
                            left: r.left + r.width * 0.08,
                            width: r.width * 0.84,
                            height: r.height * 0.73
                        })
                    };
                }
                return null;
            },
            padding: 6
        },
        {
            view: 'home',
            badge: "CLICK START",
            arrow: "▼",
            pointerPos: "top",
            curious: false,
            text: "Now we're ready! Click the START button on the 'Let's investigate!' notepad right now to step inside my Detective Office!",
            getTarget: () => document.getElementById('startBtn') || document.getElementById('startNoteContainer'),
            padding: 10
        },
        {
            view: 'investigate',
            badge: "EASY NAVIGATION",
            arrow: "►",
            pointerPos: "left",
            curious: true,
            text: "Welcome to the Detective Office! On the right edge is your Easy Navigation folder. Hover over the tape strips to see them slide out! Once our briefing is complete, you can click them anytime to jump anywhere.",
            getTarget: () => {
                if (step4StaticRect) {
                    return step4StaticRect;
                }
                const folder = document.getElementById('mainFolderNav');
                const homeTab = document.getElementById('homeTabLink');
                const officeTab = document.getElementById('investigateTabLink');
                const tapeBtns = Array.from(document.querySelectorAll('#investigateNavButtons .tape-nav-btn'));

                if (folder && tapeBtns.length > 0) {
                    let top = Infinity, bottom = -Infinity, left = Infinity;
                    if (homeTab) {
                        const r = homeTab.getBoundingClientRect();
                        if (r.height > 0) {
                            top = Math.min(top, r.top);
                            bottom = Math.max(bottom, r.bottom);
                        }
                    }
                    if (officeTab) {
                        const r = officeTab.getBoundingClientRect();
                        if (r.height > 0) {
                            top = Math.min(top, r.top);
                            bottom = Math.max(bottom, r.bottom);
                        }
                    }
                    tapeBtns.forEach((btn) => {
                        const r = btn.getBoundingClientRect();
                        if (r.height > 0) {
                            top = Math.min(top, r.top);
                            bottom = Math.max(bottom, r.bottom);
                            let btnLeft = r.left;
                            // If user is currently hovering/pressing this button, compensate so base position is used
                            if (btn.matches(':hover') || btn.matches(':active')) {
                                btnLeft += 11;
                            }
                            left = Math.min(left, btnLeft);
                        }
                    });

                    if (isFinite(top) && isFinite(bottom) && isFinite(left)) {
                        // Comfortable bounds: 20px padding on the left so buttons glide freely without clipping,
                        // height extending from top of tabs down below CONTACT ME,
                        // and width spanning all the way to the right screen edge
                        const staticLeft = Math.max(6, Math.floor(left - 20));
                        const staticTop = Math.max(4, Math.floor(top - 8));
                        const staticWidth = Math.max(80, Math.ceil(window.innerWidth - staticLeft - 6));
                        const staticHeight = Math.max(120, Math.ceil(bottom - staticTop + 16));

                        const rect = {
                            getBoundingClientRect: () => ({
                                top: staticTop,
                                left: staticLeft,
                                width: staticWidth,
                                height: staticHeight
                            })
                        };

                        // Only lock once the drawer slide-out animation has settled into place
                        if (step4Settled && folder.classList.contains('reveal-investigate-buttons')) {
                            step4StaticRect = rect;
                        }
                        return rect;
                    }
                }
                return document.getElementById('mainFolderNav');
            },
            padding: 0
        },
        {
            view: 'investigate',
            badge: "",
            arrow: "",
            pointerPos: "center",
            curious: false,
            text: "Take a look around my office! Hover over each object to see descriptions of what you can investigate, then click on it to begin your investigation!",
            getTarget: () => document.getElementById('investigateScene'),
            padding: 14
        }
    ];

    function positionTutorialElements() {
        if (!isTutorialActive || !gameTutorialOverlay || gameTutorialOverlay.hidden) return;
        const step = tutorialSteps[currentTutorialStep];
        if (!step || !tutorialSpotlight) return;

        const targetEl = step.getTarget ? step.getTarget() : null;

        if (targetEl && targetEl.getBoundingClientRect) {
            const rect = targetEl.getBoundingClientRect();
            const pad = (typeof step.padding === 'number') ? step.padding : 8;
            const top = Math.max(6, rect.top - pad);
            const left = Math.max(6, rect.left - pad);
            const width = Math.min(window.innerWidth - left - 6, rect.width + pad * 2);
            const height = Math.min(window.innerHeight - top - 6, rect.height + pad * 2);

            tutorialSpotlight.style.display = 'block';
            tutorialSpotlight.style.top = `${Math.round(top)}px`;
            tutorialSpotlight.style.left = `${Math.round(left)}px`;
            tutorialSpotlight.style.width = `${Math.round(width)}px`;
            tutorialSpotlight.style.height = `${Math.round(height)}px`;
            tutorialSpotlight.style.borderRadius = currentTutorialStep === 5 ? '18px' : '12px';
        } else {
            tutorialSpotlight.style.display = 'block';
            tutorialSpotlight.style.top = '0px';
            tutorialSpotlight.style.left = '0px';
            tutorialSpotlight.style.width = '0px';
            tutorialSpotlight.style.height = '0px';
        }
    }

    function updateTutorialUI() {
        if (!isTutorialActive) return;
        const step = tutorialSteps[currentTutorialStep];
        if (!step) return;

        clearTutorialStepTimers();

        // Ensure we are on the right view for this tutorial step
        const isInOffice = document.body.classList.contains('view-investigate');
        if (step.view === 'investigate' && !isInOffice) {
            navigateToView('investigate', true);
        } else if (step.view === 'home' && document.body.classList.contains('view-investigate-docked')) {
            navigateToView('home', true);
        }

        document.body.classList.add('tutorial-active');
        for (let i = 0; i <= 5; i++) {
            document.body.classList.toggle(`tutorial-step-${i}`, currentTutorialStep === i);
        }
        document.body.classList.toggle('tutorial-step-objects', currentTutorialStep === 5);

        if (pointerBadgeText) pointerBadgeText.textContent = step.badge;
        if (pointerArrow) pointerArrow.textContent = step.arrow;

        if (spotlightPointer) {
            spotlightPointer.className = `spotlight-pointer pos-${step.pointerPos}`;
            spotlightPointer.style.display = step.pointerPos === 'center' ? 'none' : 'inline-flex';
        }

        // Have Melia speak this tutorial step in her visual novel dialogue box
        typeSentence(step.text, Boolean(step.curious));

        // Step-specific scene interactions
        if (currentTutorialStep === 4) {
            // Office Step 1/2: Pull out Easy Nav drawer so the 5 brown quick-jump strips are visible
            deactivateRoomItems();
            openInvestigateDrawer();
            step4Settled = false;
            tutorialStepTimers.push(setTimeout(() => {
                if (isTutorialActive && currentTutorialStep === 4) {
                    step4Settled = true;
                }
            }, 550));
        } else if (currentTutorialStep === 5) {
            step4Settled = false;
            step4StaticRect = null;
            // Office Step 2/2: Tuck Easy Nav back in, highlight all 5 objects & show a sample hover info card over the Corkboard
            closeInvestigateDrawer(true);
            tutorialStepTimers.push(setTimeout(() => {
                if (isTutorialActive && currentTutorialStep === 5) {
                    const sampleHotspot = document.querySelector('.hotspot-corkboard');
                    if (sampleHotspot) {
                        activateRoomItem(sampleHotspot, 0, 0);
                        if (investigatePopup) {
                            const r = sampleHotspot.getBoundingClientRect();
                            investigatePopup.style.left = `${Math.round(r.left + r.width * 0.25)}px`;
                            investigatePopup.style.top = `${Math.round(Math.max(20, r.top + r.height * 0.18))}px`;
                        }
                    }
                }
            }, 180));
        } else {
            step4Settled = false;
            step4StaticRect = null;
            closeInvestigateDrawer(true);
            deactivateRoomItems();
        }

        positionTutorialElements();
        startTutorialSpotlightLoop();
    }

    function openGameTutorial(step = 0) {
        step4StaticRect = null;
        if (!gameTutorialOverlay) return;
        currentTutorialStep = Math.max(0, Math.min(tutorialSteps.length - 1, step));
        isTutorialActive = true;
        gameTutorialOverlay.classList.remove('is-closing');
        gameTutorialOverlay.hidden = false;
        updateTutorialUI();
        playPaperSfx();
    }

    function closeGameTutorial() {
        step4StaticRect = null;
        if (!gameTutorialOverlay || gameTutorialOverlay.hidden) return;
        clearTutorialStepTimers();
        if (tutorialRafId) {
            cancelAnimationFrame(tutorialRafId);
            tutorialRafId = null;
        }
        gameTutorialOverlay.classList.add('is-closing');
        isTutorialActive = false;
        hasCompletedTutorialThisVisit = true;
        try {
            sessionStorage.setItem(STORAGE_KEY_TUTORIAL_COMPLETED, 'true');
        } catch (e) {
            // Ignore storage restrictions
        }

        document.body.classList.remove(
            'tutorial-active',
            'tutorial-step-0',
            'tutorial-step-1',
            'tutorial-step-2',
            'tutorial-step-3',
            'tutorial-step-4',
            'tutorial-step-5',
            'tutorial-step-objects'
        );

        closeInvestigateDrawer(true);
        deactivateRoomItems();

        // Restore Melia's normal Home idle dialogue text if on Home
        if (!document.body.classList.contains('view-investigate-docked')) {
            const entry = dialogueLines[currentLineIndex] || dialogueLines[0];
            if (entry) {
                if (typeTimeout) clearTimeout(typeTimeout);
                isTyping = false;
                activeText = entry.text;
                if (typedContent) typedContent.textContent = entry.text;
                setExpression(entry.curious);
                if (dialoguePrompt) dialoguePrompt.style.opacity = "1";
            }
        }

        playPaperSfx();
        setTimeout(() => {
            gameTutorialOverlay.hidden = true;
            gameTutorialOverlay.classList.remove('is-closing');
        }, 280);
    }

    function nextTutorialStep() {
        if (currentTutorialStep === 3) {
            // Step 3 requires clicking the actual START button
            return;
        }
        if (currentTutorialStep < tutorialSteps.length - 1) {
            currentTutorialStep++;
            playButtonSfx();
            updateTutorialUI();
        } else {
            closeGameTutorial();
        }
    }

    function checkAndTriggerGameTutorial() {
        if (isTutorialActive || hasCompletedTutorialThisVisit) return;
        try {
            if (sessionStorage.getItem(STORAGE_KEY_TUTORIAL_COMPLETED) === 'true') {
                hasCompletedTutorialThisVisit = true;
                return;
            }
        } catch (e) { }

        const hash = (window.location.hash || '').replace(/^#/, '');

        // Never trigger tutorial when visitor is on or navigating to investigate or subviews
        if (hash && hash !== 'home') return;
        if (document.body.classList.contains('view-investigate') || document.body.classList.contains('view-investigate-docked')) {
            return;
        }

        if (!document.body.classList.contains('view-investigate-docked') &&
            (!hash || hash === 'home')) {
            setTimeout(() => {
                if (!isTutorialActive && !hasCompletedTutorialThisVisit) {
                    openGameTutorial(0);
                }
            }, 300);
        }
    }

    function triggerOfficeTutorialIfNeeded() {
        // Disabled to prevent unintended tutorial triggers when visiting the office
    }

    window.addEventListener('resize', () => {
        step4StaticRect = null;
        if (isTutorialActive) positionTutorialElements();
    });

    window.openGameTutorial = openGameTutorial;
    window.closeGameTutorial = closeGameTutorial;

    window.MeliaAudio = {
        init: initAudio,
        playTypewriter: playTypewriterSfx,
        playButton: playButtonSfx,
        playPaper: playPaperSfx,
        playSinglePaperLift: playSinglePaperLiftSfx,
        playSinglePaperDrop: playSinglePaperDropSfx,
        playRotaryRing: playRotaryRingSfx,
        playPhoneNotif: playPhoneNotifSfx,
        playChessPiece: playChessPieceSfx,
        playCorkboardPin: playCorkboardPinSfx,
        playCaseFile: playCaseFileSfx,
        playItemPress: playItemPressSfx,
        playItemHover: playItemHoverSfx
    };

    window.navigateToView = navigateToView;

    window.addEventListener('DOMContentLoaded', () => {
        startBgmPlayback();

        const params = new URLSearchParams(window.location.search);
        if (params.has('tutstep')) {
            const stepNum = parseInt(params.get('tutstep') || '0', 10);
            if (deviceDisclaimerModal) deviceDisclaimerModal.hidden = true;
            openGameTutorial(stepNum);
            setTimeout(() => {
                if (isTyping && typedContent) {
                    clearTimeout(typeTimeout);
                    typedContent.textContent = activeText;
                    isTyping = false;
                    if (dialoguePrompt) dialoguePrompt.style.opacity = "1";
                }
                positionTutorialElements();
            }, 300);
            return;
        }

        setTimeout(() => {
            if (!isMobileDevice() || sessionStorage.getItem('melia_device_disclaimer_seen') === 'true') {
                if (deviceDisclaimerModal) deviceDisclaimerModal.hidden = true;
                if (portraitRotatePill) portraitRotatePill.hidden = true;
                checkAndTriggerGameTutorial();
            } else {
                openDeviceDisclaimer();
            }
        }, 250);
    });

})();
