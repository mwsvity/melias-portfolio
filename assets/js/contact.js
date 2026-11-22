/**
 * Melia Winisa | Detective Assistant Portfolio
 * Interactive Rotary Telephone Switchboard, Audio Synthesizer & Email Dispatch Controller
 */

(function () {
    'use strict';

    const MELIA_EMAIL = 'meliawinisa14@gmail.com';
    const STORAGE_KEY_DISPATCHES = 'melia_rotary_dispatches_v1';

    // Finger stop is located at ~128deg clockwise from 12 o'clock
    const FINGER_STOP_ANGLE = 128;

    // Rotation travel (clockwise degrees) for each digit to reach the finger stop
    const DIGIT_ROTATION_MAP = {
        '1': 60,
        '2': 88,
        '3': 116,
        '4': 144,
        '5': 172,
        '6': 200,
        '7': 228,
        '8': 256,
        '9': 284,
        '0': 312
    };

    // Extension Directory Metadata & Channel Information
    const EXTENSION_DATA = {
        '1': {
            title: 'Ext. 01 — Primary Email Dispatch',
            badge: 'EXT. #01 // EMAIL',
            status: 'EXT. 01 CONNECTED — DIRECT EMAIL DISPATCH',
            curious: false,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Channel:</strong> Direct Email Dispatch</div>
                <div class="ext-info-line"><strong class="ext-info-label">Address:</strong> meliawinisa14@gmail.com</div>
                <div class="ext-info-line"><strong class="ext-info-label">Best for:</strong> Project inquiries, design &amp; illustration commissions.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Quick Tip:</strong> Use the dispatch slip on the right or copy the email to write directly.</div>
            `
        },
        '2': {
            title: 'Ext. 02 — Instagram Profile',
            badge: 'EXT. #02 // INSTAGRAM',
            status: 'EXT. 02 CONNECTED — INSTAGRAM @MWSVITY',
            curious: false,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Channel:</strong> Instagram Portfolio &amp; Art Feed</div>
                <div class="ext-info-line"><strong class="ext-info-label">Handle:</strong> @mwsvity (instagram.com/mwsvity)</div>
                <div class="ext-info-line"><strong class="ext-info-label">Content:</strong> Character illustrations, sketches &amp; visual updates.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Action:</strong> Click ↗ Open on Card #2 to view the profile.</div>
            `
        },
        '3': {
            title: 'Ext. 03 — Location & Availability',
            badge: 'EXT. #03 // LOCATION',
            status: 'EXT. 03 CONNECTED — LOCATION & AVAILABILITY',
            curious: true,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Location:</strong> Tangerang, Banten &bull; Worldwide Remote</div>
                <div class="ext-info-line"><strong class="ext-info-label">Timezone:</strong> WIB / UTC+7 (Jakarta Time)</div>
                <div class="ext-info-line"><strong class="ext-info-label">Availability:</strong> Open for remote projects &amp; collaborations.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Response:</strong> Typically replies within 24 hours.</div>
            `
        },
        '4': {
            title: 'Ext. 04 — Personnel Case File',
            badge: 'EXT. #04 // DOSSIER',
            status: 'EXT. 04 — PERSONNEL DOSSIER',
            curious: true,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Feature:</strong> Personnel Case File &amp; CV</div>
                <div class="ext-info-line"><strong class="ext-info-label">Location:</strong> Desk folder on the detective desk.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Content:</strong> Background bio, resume credentials &amp; skills.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Action:</strong> Return to room to open the Case File.</div>
            `
        },
        '5': {
            title: 'Ext. 05 — Investigation Corkboard',
            badge: 'EXT. #05 // CORKBOARD',
            status: 'EXT. 05 — INVESTIGATION CORKBOARD',
            curious: false,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Room Feature:</strong> Portfolio Investigation Corkboard</div>
                <div class="ext-info-line"><strong class="ext-info-label">Location:</strong> Main wall in the detective study room.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Content:</strong> Red-string polaroids, case files, tools &amp; deliverables.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Action:</strong> Return to room view to inspect project exhibits.</div>
            `
        },
        '6': {
            title: 'Ext. 06 — Desk Smartphone',
            badge: 'EXT. #06 // SMARTPHONE',
            status: 'EXT. 06 — PUBLIC GUEST FEED',
            curious: false,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Room Feature:</strong> Interactive Desk Smartphone</div>
                <div class="ext-info-line"><strong class="ext-info-label">Location:</strong> Right side of the detective desk.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Features:</strong> ChirpNote guest messages, phone passcode &amp; Brain Trace.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Action:</strong> Click the phone on the desk to interact.</div>
            `
        },
        '7': {
            title: 'Ext. 07 — Detective Chess Corner',
            badge: 'EXT. #07 // CHESS TABLE',
            status: 'EXT. 07 — DETECTIVE CHESS',
            curious: true,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Room Feature:</strong> Playable Chess Corner</div>
                <div class="ext-info-line"><strong class="ext-info-label">Location:</strong> Wooden study side table.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Features:</strong> Interactive chessboard with movable pieces.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Action:</strong> Click the chessboard in the room to play.</div>
            `
        },
        '8': {
            title: 'Ext. 08 — Auxiliary Line 8',
            badge: 'EXT. #08 // LINE 8',
            status: 'EXT. 08 — AUXILIARY LINE',
            curious: false,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Switchboard:</strong> Auxiliary routing channel.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Contact Lines:</strong> Dial 1 (Email), 2 (Instagram), 3 (Location).</div>
                <div class="ext-info-line"><strong class="ext-info-label">Room Features:</strong> Dial 4 (Dossier), 5 (Corkboard), 6 (Phone), 7 (Chess).</div>
            `
        },
        '9': {
            title: 'Ext. 09 — Dispatch Routing 9',
            badge: 'EXT. #09 // LINE 9',
            status: 'EXT. 09 — DISPATCH LINE',
            curious: false,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">Switchboard:</strong> Standby dispatch line.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Action:</strong> Fill out the message slip on the right to transmit an email.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Routing:</strong> Directly opens your email client pre-filled.</div>
            `
        },
        '0': {
            title: 'Ext. 00 — Directory & Routing',
            badge: 'EXT. #00 // DIRECTORY',
            status: 'OPERATOR DIRECTORY ACTIVE',
            curious: false,
            infoHtml: `
                <div class="ext-info-line"><strong class="ext-info-label">System:</strong> Model 500-DA Rotary Switchboard Directory.</div>
                <div class="ext-info-line"><strong class="ext-info-label">Direct Contacts:</strong> 1 (Email) &bull; 2 (Instagram) &bull; 3 (Location).</div>
                <div class="ext-info-line"><strong class="ext-info-label">Room Features:</strong> 4 (Dossier) &bull; 5 (Corkboard) &bull; 6 (Smartphone) &bull; 7 (Chess).</div>
            `
        }
    };

    // ==========================================
    // DOM Elements
    // ==========================================
    const rotaryPhoneUnit = document.getElementById('rotaryPhoneUnit');
    const rotaryHandset = document.getElementById('rotaryHandset');
    const rotaryDialContainer = document.getElementById('rotaryDialContainer');
    const dialFingerWheel = document.getElementById('dialFingerWheel');
    const dialHoles = Array.from(document.querySelectorAll('.dial-hole'));
    const dialedDigitsDisplay = document.getElementById('dialedDigitsDisplay');
    const clearDialBtn = document.getElementById('clearDialBtn');

    const topLineDot = document.getElementById('topLineDot');
    const topLineStatusText = document.getElementById('topLineStatusText');
    const speedDialPills = Array.from(document.querySelectorAll('.speed-dial-pill'));
    const pickupToggleBtn = document.getElementById('pickupToggleBtn');
    const pickupBtnLabel = document.getElementById('pickupBtnLabel');
    const ringBellBtn = document.getElementById('ringBellBtn');
    const quickCopyEmailBtn = document.getElementById('quickCopyEmailBtn');

    const operatorAvatarWrap = document.getElementById('operatorAvatarWrap');
    const operatorMeliaImg = document.getElementById('operatorMeliaImg');
    const operatorCardTitle = document.getElementById('operatorCardTitle');
    const operatorLivePill = document.getElementById('operatorLivePill');
    const operatorExtBadge = document.getElementById('operatorExtBadge');
    const operatorSpeechText = document.getElementById('operatorSpeechText');
    const plaqueStatusBadge = document.getElementById('plaqueStatusBadge');

    const channelCards = Array.from(document.querySelectorAll('.channel-card[data-channel-ext]'));
    const triggerDialBadges = Array.from(document.querySelectorAll('[data-trigger-dial]'));
    const copyButtons = Array.from(document.querySelectorAll('[data-copy-value]'));
    const focusFormFromDirBtn = document.getElementById('focusFormFromDirBtn');
    const liveJakartaTime = document.getElementById('liveJakartaTime');

    const rotaryEmailForm = document.getElementById('rotaryEmailForm');
    const dispatchFormCard = document.getElementById('dispatchFormCard');
    const dispatchStamp = document.getElementById('dispatchStamp');
    const topicPills = Array.from(document.querySelectorAll('.topic-pill'));
    const priorityBtns = Array.from(document.querySelectorAll('.priority-btn'));
    const callerNameInput = document.getElementById('callerNameInput');
    const callerEmailInput = document.getElementById('callerEmailInput');
    const dispatchSubjectInput = document.getElementById('dispatchSubjectInput');
    const dispatchMessageInput = document.getElementById('dispatchMessageInput');
    const msgCharCounter = document.getElementById('msgCharCounter');

    const transmissionReadyPanel = document.getElementById('transmissionReadyPanel');
    const openMailtoAgainBtn = document.getElementById('openMailtoAgainBtn');
    const openGmailWebBtn = document.getElementById('openGmailWebBtn');
    const copyFullDispatchBtn = document.getElementById('copyFullDispatchBtn');

    const sentDispatchesSection = document.getElementById('sentDispatchesSection');
    const sentDispatchesList = document.getElementById('sentDispatchesList');
    const clearDispatchLogBtn = document.getElementById('clearDispatchLogBtn');
    const contactToast = document.getElementById('contactToast');

    // ==========================================
    // State
    // ==========================================
    let isOffHook = false;
    let isDialAnimating = false;
    let dialedHistory = '';
    let selectedTopic = 'Project / Freelance Inquiry';
    let selectedPriority = 'Standard';
    let lastPreparedDispatch = null;
    let isCuriousExpression = false;

    // ==========================================
    // Web Audio API Synthesizer for Vintage Rotary Phone
    // ==========================================
    let rotaryAudioCtx = null;

    function getSfxVolume() {
        const stored = localStorage.getItem('melia_sfx_vol');
        const raw = (stored === null || stored === '28') ? 78 : parseFloat(stored);
        return Math.max(0, Math.min(1, raw / 100));
    }

    function ensureAudioCtx() {
        const vol = getSfxVolume();
        if (vol <= 0.005) return null;
        if (!rotaryAudioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            rotaryAudioCtx = new AudioCtx();
        }
        if (rotaryAudioCtx.state === 'suspended') {
            rotaryAudioCtx.resume().catch(() => { });
        }
        return rotaryAudioCtx;
    }

    // Single mechanical ratchet click (used during clockwise wind and governor return)
    function playRotaryClick(freq = 920, gainMult = 0.55) {
        const ctx = ensureAudioCtx();
        if (!ctx) return;
        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq + (Math.random() * 90 - 45), now);
            osc.frequency.exponentialRampToValueAtTime(260, now + 0.022);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1350, now);
            filter.Q.setValueAtTime(1.8, now);

            const master = getSfxVolume() * gainMult;
            gain.gain.setValueAtTime(master, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.028);
        } catch (e) { }
    }

    // Metallic brass finger-stop clink
    function playFingerStopClink() {
        const ctx = ensureAudioCtx();
        if (!ctx) return;
        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(2150, now);
            osc.frequency.exponentialRampToValueAtTime(1180, now + 0.055);

            const master = getSfxVolume() * 0.45;
            gain.gain.setValueAtTime(master, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.065);
        } catch (e) { }
    }

    // Schedule mechanical click sequence for rotary dial wind + governor return
    function playRotaryDialSequence(digit, forwardMs, returnMs) {
        const pulses = digit === '0' ? 10 : parseInt(digit, 10) || 1;
        const windTicks = Math.max(3, Math.ceil(pulses * 0.7));

        // 1. Winding clockwise ticks
        for (let i = 0; i < windTicks; i++) {
            const delay = Math.round((i / windTicks) * (forwardMs * 0.88));
            setTimeout(() => {
                playRotaryClick(740 + i * 22, 0.42);
            }, delay);
        }

        // 2. Brass finger-stop hit
        setTimeout(() => {
            playFingerStopClink();
        }, forwardMs);

        // 3. Rapid counter-clockwise governor pulse ticks
        const returnStart = forwardMs + 120;
        for (let p = 0; p < pulses; p++) {
            const delay = returnStart + Math.round((p / pulses) * (returnMs * 0.92));
            setTimeout(() => {
                playRotaryClick(1120, 0.58);
            }, delay);
        }
    }

    // Handset lift / hangup plunger clack
    function playHandsetPlungerSfx(lifting) {
        const ctx = ensureAudioCtx();
        if (!ctx) return;
        try {
            const now = ctx.currentTime;
            const master = getSfxVolume() * 0.65;

            // Low Bakelite thud + brass switch click
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(lifting ? 180 : 240, now);
            osc1.frequency.exponentialRampToValueAtTime(lifting ? 390 : 115, now + 0.09);
            gain1.gain.setValueAtTime(master, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.11);

            if (lifting) {
                // Subtle warm dial-tone hum burst when lifting handset
                const dialOsc1 = ctx.createOscillator();
                const dialOsc2 = ctx.createOscillator();
                const dialGain = ctx.createGain();
                dialOsc1.type = 'sine';
                dialOsc2.type = 'sine';
                dialOsc1.frequency.setValueAtTime(350, now + 0.08);
                dialOsc2.frequency.setValueAtTime(440, now + 0.08);

                dialGain.gain.setValueAtTime(0.001, now + 0.08);
                dialGain.gain.linearRampToValueAtTime(master * 0.24, now + 0.12);
                dialGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

                dialOsc1.connect(dialGain);
                dialOsc2.connect(dialGain);
                dialGain.connect(ctx.destination);

                dialOsc1.start(now + 0.08);
                dialOsc2.start(now + 0.08);
                dialOsc1.stop(now + 0.5);
                dialOsc2.stop(now + 0.5);
            }
        } catch (e) { }
    }

    // Classic twin-brass-gong mechanical telephone bell ringer
    function playMechanicalBellRing() {
        const ctx = ensureAudioCtx();
        if (rotaryPhoneUnit) {
            rotaryPhoneUnit.classList.remove('is-ringing');
            void rotaryPhoneUnit.offsetWidth;
            rotaryPhoneUnit.classList.add('is-ringing');
            setTimeout(() => {
                rotaryPhoneUnit.classList.remove('is-ringing');
            }, 720);
        }
        if (!ctx) return;

        try {
            const master = getSfxVolume() * 0.55;
            const strikes = 7;
            for (let i = 0; i < strikes; i++) {
                const start = ctx.currentTime + i * 0.075;
                const gongFreq = i % 2 === 0 ? 1380 : 1720;

                const osc = ctx.createOscillator();
                const overtone = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                overtone.type = 'triangle';
                osc.frequency.setValueAtTime(gongFreq, start);
                overtone.frequency.setValueAtTime(gongFreq * 2.42, start);

                gain.gain.setValueAtTime(master, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

                osc.connect(gain);
                overtone.connect(gain);
                gain.connect(ctx.destination);

                osc.start(start);
                overtone.start(start);
                osc.stop(start + 0.095);
                overtone.stop(start + 0.095);
            }
        } catch (e) { }
    }

    // ==========================================
    // Operator Melia & Directory UI Updates
    // ==========================================
    function setMeliaExpression(curious) {
        isCuriousExpression = Boolean(curious);
        if (!operatorMeliaImg) return;
        operatorMeliaImg.src = 'assets/image/characters/profile-avatar.png';
    }

    if (operatorAvatarWrap) {
        operatorAvatarWrap.addEventListener('click', () => {
            playRotaryClick(860, 0.2);
            setMeliaExpression(!isCuriousExpression);
        });
    }

    let toastTimeout = null;
    function showContactToast(message) {
        if (!contactToast) return;
        contactToast.textContent = message;
        contactToast.hidden = false;
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            contactToast.hidden = true;
        }, 2900);
    }

    function setWheelRotation(deg) {
        const val = `${deg.toFixed(1)}deg`;
        if (rotaryDialContainer) rotaryDialContainer.style.setProperty('--wheel-rot', val);
        if (dialFingerWheel) dialFingerWheel.style.setProperty('--wheel-rot', val);
    }

    function highlightExtension(digit) {
        const strDigit = String(digit);

        // Update Topbar Speed-Dial Pills
        speedDialPills.forEach((pill) => {
            pill.classList.toggle('is-active', pill.getAttribute('data-speed-dial') === strDigit);
        });

        // Update Directory Channel Cards
        channelCards.forEach((card) => {
            const match = card.getAttribute('data-channel-ext') === strDigit;
            card.classList.toggle('is-highlighted', match);
        });

        // Update Dial Hole Active State
        dialHoles.forEach((hole) => {
            hole.classList.toggle('is-active-hole', hole.getAttribute('data-digit') === strDigit);
        });

        // Update Extension Directory Info Card
        const info = EXTENSION_DATA[strDigit];
        if (info) {
            if (operatorCardTitle) operatorCardTitle.textContent = info.title;
            if (operatorExtBadge) operatorExtBadge.textContent = info.badge;
            if (operatorSpeechText) operatorSpeechText.innerHTML = info.infoHtml;
            if (topLineStatusText) topLineStatusText.textContent = `DIRECT ROTARY LINE // ${info.status}`;
            if (operatorLivePill) operatorLivePill.textContent = 'EXT. 0' + strDigit;
            if (plaqueStatusBadge) plaqueStatusBadge.textContent = `EXT. 0${strDigit} CONNECTED`;
            setMeliaExpression(info.curious);
        }

        // Special Easter Egg if user dials 0402
        if (dialedHistory.endsWith('0402')) {
            if (operatorCardTitle) operatorCardTitle.textContent = 'Ext. 0402 — VIP Clearance';
            if (operatorExtBadge) operatorExtBadge.textContent = 'BADGE #0402 // VIP';
            if (operatorSpeechText) {
                operatorSpeechText.innerHTML = `
                    <div class="ext-info-line"><strong class="ext-info-label">Clearance:</strong> Secret extension 0402 unlocked!</div>
                    <div class="ext-info-line"><strong class="ext-info-label">Status:</strong> Priority clearance granted on any email dispatch transmitted from this desk.</div>
                `;
            }
            showContactToast('🕵️‍♀️ Secret Extension 0402 Unlocked!');
        }
    }

    // ==========================================
    // Rotary Dial Animation & Trigger
    // ==========================================
    function dialDigit(digit, onComplete) {
        const strDigit = String(digit);
        if (isDialAnimating || !(strDigit in DIGIT_ROTATION_MAP)) return;

        isDialAnimating = true;
        const rotDeg = DIGIT_ROTATION_MAP[strDigit];
        const forwardMs = 340;
        const returnMs = Math.round(320 + (rotDeg / 312) * 420);

        if (topLineDot) topLineDot.classList.add('is-dialing');

        // Append to dialed readout strip
        dialedHistory = (dialedHistory + strDigit).slice(-8);
        if (dialedDigitsDisplay) {
            dialedDigitsDisplay.textContent = `EXT-${dialedHistory}`;
        }

        // Start mechanical sound sequence
        playRotaryDialSequence(strDigit, forwardMs, returnMs);

        // Rotate clockwise to finger stop
        if (dialFingerWheel) {
            dialFingerWheel.classList.remove('is-returning-wheel', 'is-dragging-wheel');
            dialFingerWheel.classList.add('is-dialing-forward');
        }
        setWheelRotation(rotDeg);

        // Pause briefly at the finger stop, then spring back counter-clockwise
        setTimeout(() => {
            if (dialFingerWheel) {
                dialFingerWheel.classList.remove('is-dialing-forward');
                dialFingerWheel.style.setProperty('--return-duration', `${returnMs}ms`);
                dialFingerWheel.classList.add('is-returning-wheel');
            }
            setWheelRotation(0);

            setTimeout(() => {
                if (dialFingerWheel) {
                    dialFingerWheel.classList.remove('is-returning-wheel');
                }
                if (topLineDot) topLineDot.classList.remove('is-dialing');
                isDialAnimating = false;

                highlightExtension(strDigit);
                if (strDigit === '0') {
                    playMechanicalBellRing();
                }

                if (typeof onComplete === 'function') {
                    onComplete(strDigit);
                }
            }, returnMs);
        }, forwardMs + 115);
    }

    // ==========================================
    // Interactive Pointer Drag-to-Dial Support on the Rotary Wheel
    // ==========================================
    dialHoles.forEach((hole) => {
        const digit = hole.getAttribute('data-digit');
        const maxRot = DIGIT_ROTATION_MAP[digit] || 90;

        let draggingHole = false;
        let dragStartAngle = 0;
        let currentDragRot = 0;
        let lastTickDeg = 0;

        function getPointerAngleDeg(clientX, clientY) {
            const rect = rotaryDialContainer.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const rad = Math.atan2(clientY - cy, clientX - cx);
            // Convert so 12 o'clock is 0deg and clockwise is positive
            return (rad * (180 / Math.PI) + 90 + 360) % 360;
        }

        hole.addEventListener('pointerdown', (e) => {
            if (isDialAnimating) return;
            e.stopPropagation();
            draggingHole = true;
            currentDragRot = 0;
            lastTickDeg = 0;
            dragStartAngle = getPointerAngleDeg(e.clientX, e.clientY);

            if (dialFingerWheel) {
                dialFingerWheel.classList.add('is-dragging-wheel');
            }
            if (hole.setPointerCapture) {
                try { hole.setPointerCapture(e.pointerId); } catch (_) { }
            }
        });

        hole.addEventListener('pointermove', (e) => {
            if (!draggingHole) return;
            const curAngle = getPointerAngleDeg(e.clientX, e.clientY);
            let delta = (curAngle - dragStartAngle + 360) % 360;
            if (delta > 330) delta = 0;
            currentDragRot = Math.max(0, Math.min(maxRot, delta));
            setWheelRotation(currentDragRot);

            if (Math.abs(currentDragRot - lastTickDeg) >= 18) {
                lastTickDeg = currentDragRot;
                playRotaryClick(780 + currentDragRot, 0.16);
                if (currentDragRot >= maxRot - 2) {
                    playFingerStopClink();
                }
            }
        });

        function finishHoleInteraction(e) {
            if (!draggingHole) return;
            draggingHole = false;
            if (hole.releasePointerCapture && e && e.pointerId !== undefined) {
                try { hole.releasePointerCapture(e.pointerId); } catch (_) { }
            }

            if (dialFingerWheel) {
                dialFingerWheel.classList.remove('is-dragging-wheel');
            }

            // If user clicked or dragged less than 12deg, trigger smooth auto-dial
            if (currentDragRot < 12) {
                setWheelRotation(0);
                dialDigit(digit);
                return;
            }

            // Otherwise spring back from dragged position; if dragged >= 55% of travel, register the digit!
            const completed = currentDragRot >= maxRot * 0.55;
            const returnMs = Math.max(220, Math.round((currentDragRot / 312) * 520));
            const pulses = completed ? (digit === '0' ? 10 : parseInt(digit, 10) || 1) : 3;

            isDialAnimating = true;
            if (dialFingerWheel) {
                dialFingerWheel.style.setProperty('--return-duration', `${returnMs}ms`);
                dialFingerWheel.classList.add('is-returning-wheel');
            }
            setWheelRotation(0);

            for (let p = 0; p < pulses; p++) {
                setTimeout(() => {
                    playRotaryClick(1120, 0.24);
                }, Math.round((p / pulses) * (returnMs * 0.9)));
            }

            setTimeout(() => {
                if (dialFingerWheel) {
                    dialFingerWheel.classList.remove('is-returning-wheel');
                }
                isDialAnimating = false;
                if (completed) {
                    dialedHistory = (dialedHistory + digit).slice(-8);
                    if (dialedDigitsDisplay) dialedDigitsDisplay.textContent = `EXT-${dialedHistory}`;
                    highlightExtension(digit);
                    if (digit === '0') playMechanicalBellRing();
                }
            }, returnMs);
        }

        hole.addEventListener('pointerup', finishHoleInteraction);
        hole.addEventListener('pointercancel', finishHoleInteraction);
    });

    // Clear Dialed Readout Button
    if (clearDialBtn) {
        clearDialBtn.addEventListener('click', () => {
            playRotaryClick(640, 0.2);
            dialedHistory = '';
            if (dialedDigitsDisplay) dialedDigitsDisplay.textContent = 'READY';
            if (plaqueStatusBadge) plaqueStatusBadge.textContent = 'STATUS: READY';
            if (operatorCardTitle) operatorCardTitle.textContent = 'Extension Directory Info';
            if (operatorExtBadge) operatorExtBadge.textContent = 'DIAL 1–0 FOR INFO';
            if (operatorLivePill) operatorLivePill.textContent = 'DIRECTORY';
            if (operatorSpeechText) {
                operatorSpeechText.innerHTML = `
                    <div class="ext-overview-grid">
                        <span><strong>1:</strong> Email</span>
                        <span><strong>2:</strong> Instagram</span>
                        <span><strong>3:</strong> Location</span>
                        <span><strong>4:</strong> Dossier</span>
                        <span><strong>5:</strong> Corkboard</span>
                        <span><strong>6:</strong> Phone</span>
                        <span><strong>7:</strong> Chess</span>
                        <span><strong>0:</strong> Overview</span>
                    </div>
                    <div class="ext-overview-hint">Spin or click any number on the rotary wheel to inspect channel details.</div>
                `;
            }
            channelCards.forEach((c) => c.classList.remove('is-highlighted'));
            dialHoles.forEach((h) => h.classList.remove('is-active-hole'));
            speedDialPills.forEach((p) => p.classList.remove('is-active'));
        });
    }

    // Speed-Dial Pills & Directory Dial Badges
    speedDialPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            const d = pill.getAttribute('data-speed-dial');
            if (d !== null) dialDigit(d);
        });
    });

    triggerDialBadges.forEach((badge) => {
        badge.addEventListener('click', () => {
            const d = badge.getAttribute('data-trigger-dial');
            if (d !== null) dialDigit(d);
        });
    });

    // Keyboard Digit Dialing (when not focused inside an input/textarea)
    window.addEventListener('keydown', (e) => {
        if (e.target.closest('input, textarea, select')) return;
        if (/^[0-9]$/.test(e.key)) {
            dialDigit(e.key);
        }
    });

    // ==========================================
    // Handset Receiver Toggle & Mechanical Bell Button
    // ==========================================
    function toggleHandset() {
        isOffHook = !isOffHook;
        playHandsetPlungerSfx(isOffHook);

        if (rotaryPhoneUnit) {
            rotaryPhoneUnit.classList.toggle('is-off-hook', isOffHook);
        }
        if (rotaryHandset) {
            rotaryHandset.setAttribute('aria-pressed', String(isOffHook));
        }
        if (pickupToggleBtn) {
            pickupToggleBtn.classList.toggle('is-off-hook', isOffHook);
        }
        if (pickupBtnLabel) {
            pickupBtnLabel.textContent = isOffHook ? 'Hang Up Receiver' : 'Pick Up Receiver';
        }
        if (topLineDot) {
            topLineDot.classList.toggle('is-off-hook', isOffHook);
        }

        if (isOffHook) {
            if (topLineStatusText) {
                topLineStatusText.textContent = 'RECEIVER OFF THE HOOK // ROTARY LINE ACTIVE';
            }
            if (operatorCardTitle) operatorCardTitle.textContent = 'Rotary Line Active';
            if (operatorExtBadge) operatorExtBadge.textContent = 'OFF HOOK';
            if (operatorSpeechText) {
                operatorSpeechText.innerHTML = `
                    <div class="ext-info-line"><strong class="ext-info-label">Status:</strong> Handset lifted &bull; Switchboard line active.</div>
                    <div class="ext-info-line"><strong class="ext-info-label">Guide:</strong> Spin any number on the wheel (1–4 for contact, 5–7 for room items) to view details.</div>
                `;
            }
        } else {
            if (topLineStatusText) {
                topLineStatusText.textContent = 'DIRECT ROTARY LINE // EXT. 0402 • READY TO DIAL';
            }
            if (operatorCardTitle) operatorCardTitle.textContent = 'Extension Directory Info';
            if (operatorExtBadge) operatorExtBadge.textContent = 'ON CRADLE';
            if (operatorSpeechText) {
                operatorSpeechText.innerHTML = `
                    <div class="ext-overview-grid">
                        <span><strong>1:</strong> Email</span>
                        <span><strong>2:</strong> Instagram</span>
                        <span><strong>3:</strong> Location</span>
                        <span><strong>4:</strong> Dossier</span>
                        <span><strong>5:</strong> Corkboard</span>
                        <span><strong>6:</strong> Phone</span>
                        <span><strong>7:</strong> Chess</span>
                        <span><strong>0:</strong> Overview</span>
                    </div>
                    <div class="ext-overview-hint">Spin or click any number on the rotary wheel to inspect channel details.</div>
                `;
            }
        }
    }

    if (rotaryHandset) {
        rotaryHandset.addEventListener('click', toggleHandset);
        rotaryHandset.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleHandset();
            }
        });
    }

    if (pickupToggleBtn) {
        pickupToggleBtn.addEventListener('click', toggleHandset);
    }

    if (ringBellBtn) {
        ringBellBtn.addEventListener('click', () => {
            playMechanicalBellRing();
            if (operatorCardTitle) operatorCardTitle.textContent = 'Mechanical Bell Test';
            if (operatorExtBadge) operatorExtBadge.textContent = 'BELL RUNG';
            if (operatorSpeechText) {
                operatorSpeechText.innerHTML = `
                    <div class="ext-info-line"><strong class="ext-info-label">Signal:</strong> Mechanical brass bell tested successfully.</div>
                    <div class="ext-info-line"><strong class="ext-info-label">Status:</strong> Audio chime &amp; ringer circuits active.</div>
                `;
            }
        });
    }

    // ==========================================
    // Clipboard Copy Helpers
    // ==========================================
    function copyTextToClipboard(text, label) {
        playRotaryClick(980, 0.22);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showContactToast(`📋 Copied ${label}: ${text}`);
            }).catch(() => {
                fallbackCopy(text, label);
            });
        } else {
            fallbackCopy(text, label);
        }
    }

    function fallbackCopy(text, label) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showContactToast(`📋 Copied ${label}!`);
        } catch (_) { }
        document.body.removeChild(ta);
    }

    copyButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-copy-value') || MELIA_EMAIL;
            const label = btn.getAttribute('data-copy-label') || 'to clipboard';
            copyTextToClipboard(val, label);
        });
    });

    if (quickCopyEmailBtn) {
        quickCopyEmailBtn.addEventListener('click', () => {
            copyTextToClipboard(MELIA_EMAIL, 'Melia\'s Email');
        });
    }

    if (focusFormFromDirBtn) {
        focusFormFromDirBtn.addEventListener('click', (e) => {
            e.preventDefault();
            playRotaryClick(840, 0.2);
            if (dispatchFormCard) {
                dispatchFormCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(() => {
                if (callerNameInput) callerNameInput.focus();
            }, 350);
        });
    }

    // ==========================================
    // Live Indonesia (WIB / UTC+7) Time Display
    // ==========================================
    function updateJakartaClock() {
        if (!liveJakartaTime) return;
        try {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            liveJakartaTime.textContent = `Local Time: ${formatter.format(new Date())} (UTC+7)`;
        } catch (e) {
            liveJakartaTime.textContent = 'Timezone: WIB (UTC+7)';
        }
    }
    updateJakartaClock();
    setInterval(updateJakartaClock, 30000);

    // ==========================================
    // Direct Email Dispatch Form Controller
    // ==========================================
    if (dispatchMessageInput && msgCharCounter) {
        dispatchMessageInput.addEventListener('input', () => {
            const len = dispatchMessageInput.value.length;
            msgCharCounter.textContent = `${len} / 1500 chars`;
        });
    }

    function buildDispatchLinks(data) {
        const finalSubject = data.subject || 'Portfolio Inquiry';
        const formattedBody = [
            `Hello Melia,`,
            ``,
            data.message,
            ``,
            `----------------------------------------`,
            `Caller Name: ${data.name}`,
            `Return Email: ${data.email}`,
            `----------------------------------------`
        ].join('\n');

        const mailtoUrl = `mailto:${MELIA_EMAIL}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(formattedBody)}`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MELIA_EMAIL)}&su=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(formattedBody)}`;

        return {
            finalSubject,
            formattedBody,
            mailtoUrl,
            gmailUrl
        };
    }

    function loadSavedDispatches() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY_DISPATCHES);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveDispatches(list) {
        try {
            sessionStorage.setItem(STORAGE_KEY_DISPATCHES, JSON.stringify(list));
        } catch (e) { }
    }

    function renderSentDispatches() {
        const list = loadSavedDispatches();
        if (!sentDispatchesSection || !sentDispatchesList) return;

        if (!list.length) {
            sentDispatchesSection.hidden = true;
            return;
        }

        sentDispatchesSection.hidden = false;
        sentDispatchesList.innerHTML = '';

        list.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'sent-log-item';

            const infoSpan = document.createElement('span');
            infoSpan.innerHTML = `<strong>${item.subject}</strong> &bull; From: ${item.name} (${item.time})`;

            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'ch-btn';
            copyBtn.textContent = '📋 Copy Text';
            copyBtn.addEventListener('click', () => {
                copyTextToClipboard(item.fullText, 'dispatch message');
            });

            row.appendChild(infoSpan);
            row.appendChild(copyBtn);
            sentDispatchesList.appendChild(row);
        });
    }

    if (clearDispatchLogBtn) {
        clearDispatchLogBtn.addEventListener('click', () => {
            sessionStorage.removeItem(STORAGE_KEY_DISPATCHES);
            renderSentDispatches();
            showContactToast('🗑️ Cleared session dispatch log.');
        });
    }

    if (rotaryEmailForm) {
        rotaryEmailForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = callerNameInput ? callerNameInput.value.trim() : '';
            const email = callerEmailInput ? callerEmailInput.value.trim() : '';
            const subject = dispatchSubjectInput ? dispatchSubjectInput.value.trim() : 'Case Inquiry';
            const message = dispatchMessageInput ? dispatchMessageInput.value.trim() : '';

            if (!name || !email || !message) {
                showContactToast('⚠️ Please fill in your name, email, and message.');
                return;
            }

            const payload = {
                name,
                email,
                subject,
                message
            };

            const links = buildDispatchLinks(payload);
            lastPreparedDispatch = { ...payload, ...links };

            // Update transmission drawer buttons
            if (openMailtoAgainBtn) openMailtoAgainBtn.href = links.mailtoUrl;
            if (openGmailWebBtn) openGmailWebBtn.href = links.gmailUrl;
            if (transmissionReadyPanel) transmissionReadyPanel.hidden = false;

            // Stamp the dispatch slip as SENT
            if (dispatchStamp) {
                dispatchStamp.textContent = 'DISPATCHED // LINE CONNECTED';
                dispatchStamp.classList.add('is-stamped-sent');
            }

            // Save to session log
            const saved = loadSavedDispatches();
            const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            saved.unshift({
                name,
                subject: links.finalSubject,
                time: nowStr,
                fullText: `To: ${MELIA_EMAIL}\nSubject: ${links.finalSubject}\n\n${links.formattedBody}`
            });
            saveDispatches(saved.slice(0, 5));
            renderSentDispatches();

            // Dispatch confirmation
            if (operatorCardTitle) operatorCardTitle.textContent = 'Email Dispatch Prepared';
            if (operatorExtBadge) operatorExtBadge.textContent = 'DISPATCH READY';
            if (operatorSpeechText) {
                operatorSpeechText.innerHTML = `
                    <div class="ext-info-line"><strong class="ext-info-label">Recipient:</strong> ${MELIA_EMAIL}</div>
                    <div class="ext-info-line"><strong class="ext-info-label">Action:</strong> Opening email client pre-filled. Quick options available below form.</div>
                `;
            }

            // Dial '1' on the rotary wheel and trigger the mail client!
            dialDigit('1', () => {
                playMechanicalBellRing();
                showContactToast('☎️ Line connected! Opening your email client...');
                window.location.href = links.mailtoUrl;
            });
        });
    }

    if (copyFullDispatchBtn) {
        copyFullDispatchBtn.addEventListener('click', () => {
            if (!lastPreparedDispatch) return;
            const fullClip = `To: ${MELIA_EMAIL}\nSubject: ${lastPreparedDispatch.finalSubject}\n\n${lastPreparedDispatch.formattedBody}`;
            copyTextToClipboard(fullClip, 'full email dispatch');
        });
    }

    // Initialize session log on load
    renderSentDispatches();

    // ==========================================
    // Responsive Rotary Phone Scale & Full-Viewport Desk Mat Sync
    // ==========================================
    const contactTopbar = document.querySelector('.contact-topbar');
    const contactDeskStage = document.querySelector('.contact-desk-stage');
    const rotaryDeskMat = document.querySelector('.rotary-desk-mat');
    const rotaryBrassPlaque = document.querySelector('.rotary-brass-plaque');

    function syncRotaryPhoneScale() {
        if (!rotaryPhoneUnit || !rotaryDeskMat) return;
        const matRect = rotaryDeskMat.getBoundingClientRect();
        if (matRect.width === 0 || matRect.height === 0) return;

        if (contactTopbar && contactDeskStage) {
            const topbarH = contactTopbar.offsetHeight || 54;
            contactDeskStage.style.setProperty('--contact-topbar-h', `${topbarH}px`);
        }

        const matStyle = window.getComputedStyle(rotaryDeskMat);
        const padLeft = parseFloat(matStyle.paddingLeft) || 16;
        const padRight = parseFloat(matStyle.paddingRight) || 16;
        const padBottom = parseFloat(matStyle.paddingBottom) || 14;
        const gap = parseFloat(matStyle.rowGap || matStyle.gap) || 10;

        const availW = Math.max(200, rotaryDeskMat.clientWidth - padLeft - padRight);
        const plaqueBottom = rotaryBrassPlaque
            ? (rotaryBrassPlaque.offsetTop + rotaryBrassPlaque.offsetHeight)
            : 140;
        const availH = Math.max(220, rotaryDeskMat.clientHeight - plaqueBottom - padBottom - gap);

        const baseW = 374;
        const baseH = rotaryPhoneUnit.offsetHeight || 432;

        const scale = Math.max(0.58, Math.min(1.36, (availW - 4) / baseW, (availH - 2) / baseH));
        const scaledH = baseH * scale;
        const extraH = Math.max(0, availH - scaledH);
        const topSpace = Math.max(2, Math.round(extraH * 0.52));

        rotaryPhoneUnit.style.setProperty('--phone-base-h', `${baseH}px`);
        rotaryPhoneUnit.style.setProperty('--phone-scale', scale.toFixed(4));
        rotaryPhoneUnit.style.setProperty('--phone-top-space', `${topSpace}px`);
    }

    window.syncRotaryPhoneScale = syncRotaryPhoneScale;
    window.addEventListener('resize', syncRotaryPhoneScale);
    window.addEventListener('hashchange', () => {
        requestAnimationFrame(syncRotaryPhoneScale);
        setTimeout(syncRotaryPhoneScale, 120);
    });

    if (typeof ResizeObserver !== 'undefined' && rotaryDeskMat) {
        const ro = new ResizeObserver(() => {
            syncRotaryPhoneScale();
        });
        ro.observe(rotaryDeskMat);
    }

    requestAnimationFrame(syncRotaryPhoneScale);
    setTimeout(syncRotaryPhoneScale, 150);

})();
