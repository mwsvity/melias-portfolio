/**
 * Melia Winisa | Detective Assistant Portfolio
 * Evidence Item #04: Interactive Detective Smartphone Terminal & Brain Trace Lab
 * Features: 30-Second Stroop Cognitive Reflex Game, Web Audio Synthesizer,
 * Real-time Scoring & Streaks, LocalStorage High Scores, Day/Night OS Theme.
 */

(function () {
    'use strict';

    const STORAGE_KEY_HIGHSCORE = 'melia_brain_trace_highscore_v1';
    const STORAGE_KEY_STREAK = 'melia_brain_trace_streak_v1';
    const STORAGE_KEY_ROUNDS = 'melia_brain_trace_rounds_v1';
    const STORAGE_KEY_BEST_RANK = 'melia_brain_trace_best_rank_v1';
    const STORAGE_KEY_NIGHT = 'melia_cellphone_night_v1';

    // 4 Distinct Sleuth Accreditation Tiers (Progression System)
    const SLEUTH_TIERS = [
        { tier: 1, code: 'cadet', name: 'Cadet', fullName: 'Cadet Recruit', minScore: 0, targetScore: 1500 },
        { tier: 2, code: 'field_agent', name: 'Field Agent', fullName: 'Field Agent', minScore: 1500, targetScore: 3500 },
        { tier: 3, code: 'senior_det', name: 'Senior Det.', fullName: 'Senior Detective', minScore: 3500, targetScore: 7000 },
        { tier: 4, code: 'inquisitor', name: 'Inquisitor', fullName: 'Chief Inquisitor', minScore: 7000, targetScore: null }
    ];

    // 4 Distinct High-Contrast Designer Colors (DKV Palette)
    // Mapped spatially to QWERTY 2x2 grid: Q (top-left), W (top-right), A (bottom-left), S (bottom-right)
    const COLORS = [
        { key: 'red', label: 'RED', hex: '#ef4444', kbd: ['q', '1'] },
        { key: 'blue', label: 'BLUE', hex: '#3b82f6', kbd: ['w', '2'] },
        { key: 'green', label: 'GREEN', hex: '#10b981', kbd: ['a', '3'] },
        { key: 'gold', label: 'GOLD', hex: '#f59e0b', kbd: ['s', '4'] }
    ];

    // ==========================================
    // DOM Elements
    // ==========================================
    const phoneView = document.getElementById('phoneView');
    const cellphoneHardware = document.getElementById('cellphoneHardware');
    const phoneScreen = document.getElementById('phoneScreen');
    const phoneStatusClock = document.getElementById('phoneStatusClock');
    const phoneThemeIcon = document.getElementById('phoneThemeIcon');
    const phonePushBanner = document.getElementById('phonePushBanner');
    const pushBannerTitle = document.getElementById('pushBannerTitle');
    const pushBannerBody = document.getElementById('pushBannerBody');
    const phoneToast = document.getElementById('phoneToast');
    const buzzPhoneBtn = document.getElementById('buzzPhoneBtn');
    const toggleNightScreenBtn = document.getElementById('toggleNightScreenBtn');
    const quickRestartGameBtn = document.getElementById('quickRestartGameBtn');

    // Stroop Game Elements
    const stroopScoreEl = document.getElementById('stroopScore');
    const hudRankBox = document.getElementById('hudRankBox');
    const stroopLiveRank = document.getElementById('stroopLiveRank');
    const stroopTimerEl = document.getElementById('stroopTimer');
    const stroopStreakEl = document.getElementById('stroopStreak');
    const stroopAccuracyEl = document.getElementById('stroopAccuracy');
    const stroopProgressFill = document.getElementById('stroopProgressFill');
    const stroopProgressTrack = document.getElementById('stroopProgressTrack');
    const hudTimerBox = document.querySelector('.hud-timer-box');
    const stroopPromptPill = document.getElementById('stroopPromptPill');
    const promptPillText = document.getElementById('promptPillText');
    const stroopWordCard = document.getElementById('stroopWordCard');
    const stroopWordKicker = document.getElementById('stroopWordKicker');
    const stroopWordText = document.getElementById('stroopWordText');
    const stroopPopFeedback = document.getElementById('stroopPopFeedback');
    const stroopButtonsGrid = document.getElementById('stroopButtonsGrid');
    const diagSpeedText = document.getElementById('diagSpeedText');
    const diagModeText = document.getElementById('diagModeText');
    const stroopGameOverScreen = document.getElementById('stroopGameOverScreen');
    const finalScoreVal = document.getElementById('finalScoreVal');
    const finalCorrectCount = document.getElementById('finalCorrectCount');
    const finalAccuracy = document.getElementById('finalAccuracy');
    const finalMaxStreak = document.getElementById('finalMaxStreak');
    const finalRankTitle = document.getElementById('finalRankTitle');
    const finalRankDesc = document.getElementById('finalRankDesc');
    const gameOverRestartBtn = document.getElementById('gameOverRestartBtn');

    // Assessment Tiers Board Elements
    const activeTierName = document.getElementById('activeTierName');
    const tierProgressGoalText = document.getElementById('tierProgressGoalText');
    const tierProgressFill = document.getElementById('tierProgressFill');
    const tierProgressSubtext = document.getElementById('tierProgressSubtext');

    // Melia Companion & Desk Elements
    const meliaPhoneSpeech = document.getElementById('meliaPhoneSpeech');
    const meliaPhoneStatusPill = document.getElementById('meliaPhoneStatusPill');
    const statHighScoreEl = document.getElementById('statHighScore');
    const statBestRankEl = document.getElementById('statBestRank');
    const statBestStreakEl = document.getElementById('statBestStreak');
    const statTotalRoundsEl = document.getElementById('statTotalRounds');
    const btnRestartDesk = document.getElementById('btnRestartDesk');
    const btnResetScores = document.getElementById('btnResetScores');

    // ==========================================
    // State
    // ==========================================
    let isNightMode = false;
    let isGameActive = false;
    let currentMode = 'standard'; // 'standard' (30s) or 'hard' (20s)
    let currentTier = SLEUTH_TIERS[0];
    let gameScore = 0;
    let currentStreak = 0;
    let maxStreakInGame = 0;
    let totalAnswered = 0;
    let correctAnswered = 0;
    let timeLeft = 30.0;
    let timerInterval = null;
    let currentWord = '';
    let currentInkColorKey = '';
    let currentExpectedKey = '';
    let hardModeInverted = false;
    let questionStartTime = 0;
    let toastTimeout = null;

    // ==========================================
    // Web Audio API Synthesizer
    // ==========================================
    let audioCtx = null;

    function ensureAudioCtx() {
        if (!audioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            audioCtx = new AudioCtx();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        return audioCtx;
    }

    // Play a single synthesized tone
    function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15, decay = 0.08) {
        const ctx = ensureAudioCtx();
        if (!ctx) return;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio policy fallback
        }
    }

    // Stroop correct answer pop (pitches up with streak)
    function playStroopCorrect(streak) {
        const baseFreq = 700;
        const streakBonus = Math.min(streak * 35, 600);
        playTone(baseFreq + streakBonus, 'sine', 0.12, 0.18, 0.14);
    }

    // Stroop wrong answer drop
    function playStroopWrong() {
        const ctx = ensureAudioCtx();
        if (!ctx) return;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(420, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.22);
        } catch (e) {}
    }

    // Combo streak fanfare
    function playComboFanfare() {
        const notes = [659.25, 830.61, 987.77, 1318.51];
        notes.forEach((f, i) => {
            setTimeout(() => playTone(f, 'sine', 0.16, 0.2, 0.2), i * 50);
        });
    }

    // Game over fanfare
    function playGameOverSound() {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((f, i) => {
            setTimeout(() => playTone(f, 'triangle', 0.22, 0.18, 0.28), i * 80);
        });
    }

    // Demotion descending tone
    function playDemotionSound() {
        const notes = [440, 370, 311, 246];
        notes.forEach((f, i) => {
            setTimeout(() => playTone(f, 'sawtooth', 0.16, 0.18, 0.18), i * 65);
        });
    }

    // Haptic phone buzz sound + physical shake
    function triggerPhoneVibrate() {
        if (!cellphoneHardware) return;
        cellphoneHardware.classList.remove('is-buzzing');
        void cellphoneHardware.offsetWidth;
        cellphoneHardware.classList.add('is-buzzing');
        setTimeout(() => cellphoneHardware.classList.remove('is-buzzing'), 550);

        const ctx = ensureAudioCtx();
        if (!ctx) return;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(95, ctx.currentTime);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.42);
        } catch (e) {}
    }

    // Toast notification
    function showPhoneToast(msg) {
        if (!phoneToast) return;
        phoneToast.textContent = msg;
        phoneToast.hidden = false;
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            phoneToast.hidden = true;
        }, 2600);
    }

    // Push banner
    function showPushBanner(title, body) {
        if (!phonePushBanner) return;
        if (pushBannerTitle) pushBannerTitle.textContent = title;
        if (pushBannerBody) pushBannerBody.textContent = body;
        phonePushBanner.classList.add('is-visible');
        setTimeout(() => {
            phonePushBanner.classList.remove('is-visible');
        }, 3200);
    }

    // ==========================================
    // Sleuth Accreditation Tiers & Progression Engine
    // ==========================================
    function getTierForScore(score) {
        if (score >= 7000) return SLEUTH_TIERS[3];
        if (score >= 3500) return SLEUTH_TIERS[2];
        if (score >= 1500) return SLEUTH_TIERS[1];
        return SLEUTH_TIERS[0];
    }

    function updateRankProgressionUI(announceChange = false) {
        const newTier = getTierForScore(gameScore);

        // Check if promoted or demoted during active gameplay
        if (announceChange && isGameActive) {
            if (newTier.tier > currentTier.tier) {
                triggerTierPromotion(newTier);
            } else if (newTier.tier < currentTier.tier) {
                triggerTierDemotion(newTier);
            }
        }
        currentTier = newTier;

        // 1. Update HUD live rank
        if (stroopLiveRank) {
            stroopLiveRank.textContent = newTier.name.toUpperCase();
        }

        // 2. Update header active rank badge
        if (activeTierName) {
            activeTierName.textContent = newTier.name.toUpperCase();
        }

        // 3. Update progress meter toward next promotion
        if (newTier.targetScore) {
            const rangeStart = newTier.minScore;
            const rangeEnd = newTier.targetScore;
            const currentInTier = Math.max(0, gameScore - rangeStart);
            const neededForTier = rangeEnd - rangeStart;
            const pct = Math.min(100, Math.max(0, (currentInTier / neededForTier) * 100));
            const ptsLeft = Math.max(0, rangeEnd - gameScore);
            const nextTierObj = SLEUTH_TIERS.find((t) => t.tier === newTier.tier + 1);

            if (tierProgressFill) tierProgressFill.style.width = `${pct}%`;
            if (tierProgressGoalText && nextTierObj) {
                tierProgressGoalText.textContent = `Next: ${nextTierObj.name} (${rangeEnd.toLocaleString()} pts)`;
            }
            if (tierProgressSubtext && nextTierObj) {
                tierProgressSubtext.textContent = `${gameScore.toLocaleString()} / ${rangeEnd.toLocaleString()} pts \u2022 ${ptsLeft.toLocaleString()} pts to promote to ${nextTierObj.name}`;
            }
        } else {
            // Maximum clearance tier (Inquisitor)
            if (tierProgressFill) tierProgressFill.style.width = '100%';
            if (tierProgressGoalText) {
                tierProgressGoalText.textContent = 'Max Clearance Achieved!';
            }
            if (tierProgressSubtext) {
                tierProgressSubtext.textContent = `${gameScore.toLocaleString()} pts \u2022 Grand Chief Inquisitor mastery!`;
            }
        }

        // 4. Update 4 Tier Cards (.tier-card)
        SLEUTH_TIERS.forEach((t) => {
            const card = document.getElementById(`tierCard_${t.code}`);
            if (!card) return;

            const isCurrent = (t.code === newTier.code);
            const isUnlocked = (gameScore >= t.minScore);

            card.classList.toggle('is-current-tier', isCurrent);
            card.classList.toggle('is-unlocked-tier', isUnlocked && !isCurrent);
            card.classList.toggle('is-locked-tier', !isUnlocked);

            const statusPill = card.querySelector('.tier-status-pill');
            if (statusPill) {
                if (isCurrent) {
                    statusPill.textContent = 'CURRENT';
                } else if (isUnlocked) {
                    statusPill.textContent = 'UNLOCKED';
                } else {
                    statusPill.textContent = 'LOCKED';
                }
            }
        });
    }

    function triggerTierPromotion(newTier) {
        playComboFanfare();
        triggerPopFeedback(`PROMOTION: ${newTier.name.toUpperCase()}!`, true);
        if (meliaPhoneSpeech) {
            meliaPhoneSpeech.textContent = `"PROMOTION! You have unlocked ${newTier.fullName} clearance! Outstanding reflexes!"`;
        }
        if (hudRankBox) {
            hudRankBox.classList.remove('is-promoted-flash');
            void hudRankBox.offsetWidth;
            hudRankBox.classList.add('is-promoted-flash');
        }
        // Save highest clearance rank reached in personal records
        const savedBestTier = parseInt(localStorage.getItem(STORAGE_KEY_BEST_RANK) || '1', 10);
        if (newTier.tier > savedBestTier) {
            localStorage.setItem(STORAGE_KEY_BEST_RANK, newTier.tier.toString());
            updateStatsUI();
        }
    }

    function triggerTierDemotion(newTier) {
        playDemotionSound();
        triggerPopFeedback(`DEMOTED: ${newTier.name.toUpperCase()}!`, false);
        if (meliaPhoneSpeech) {
            meliaPhoneSpeech.textContent = `"DEMOTION! Clearance fell to ${newTier.fullName}! Concentrate and rebuild your streak!"`;
        }
        if (hudRankBox) {
            hudRankBox.classList.remove('is-demoted-flash');
            void hudRankBox.offsetWidth;
            hudRankBox.classList.add('is-demoted-flash');
        }
        const dossierTiers = document.getElementById('dossierTiersBox');
        if (dossierTiers) {
            dossierTiers.classList.remove('is-demoted-shake');
            void dossierTiers.offsetWidth;
            dossierTiers.classList.add('is-demoted-shake');
        }
    }

    // ==========================================
    // Stroop Effect Game Engine (Brain Trace)
    // ==========================================
    function startStroopGame(keepCurrentQuestion = false) {
        stopStroopTimer();
        isGameActive = true;
        gameScore = 0;
        currentStreak = 0;
        maxStreakInGame = 0;
        totalAnswered = 0;
        correctAnswered = 0;
        hardModeInverted = false;
        const totalDuration = 30.0;
        timeLeft = totalDuration;
        updateRankProgressionUI(false);

        if (stroopGameOverScreen) stroopGameOverScreen.hidden = true;
        if (stroopScoreEl) stroopScoreEl.textContent = '0';
        if (stroopStreakEl) stroopStreakEl.textContent = '0x';
        if (stroopAccuracyEl) stroopAccuracyEl.textContent = '100%';
        if (stroopTimerEl) stroopTimerEl.textContent = `${Math.ceil(timeLeft)}s`;
        if (diagSpeedText) diagSpeedText.textContent = 'Reaction: -- ms';
        if (promptPillText) promptPillText.textContent = 'TAP THE INK COLOR • IGNORE THE WORD';
        if (stroopPromptPill) stroopPromptPill.classList.remove('is-inverted');
        if (diagModeText) diagModeText.textContent = 'TARGET: INK COLOR';
        if (stroopWordKicker) stroopWordKicker.textContent = 'EXHIBIT #04 • INK SPECTRUM STIMULUS';

        if (stroopProgressFill) {
            stroopProgressFill.style.width = '100%';
            stroopProgressFill.classList.remove('is-urgent');
        }
        if (stroopProgressTrack) {
            stroopProgressTrack.classList.remove('is-urgent');
        }
        if (hudTimerBox) {
            hudTimerBox.classList.remove('is-urgent');
        }
        if (meliaPhoneStatusPill) {
            meliaPhoneStatusPill.textContent = 'TEST ACTIVE';
        }
        if (meliaPhoneSpeech) {
            meliaPhoneSpeech.textContent = '"Brain Trace is running! Focus on the color of the ink, not what the word says!"';
        }

        playTone(620, 'sine', 0.15, 0.16, 0.18);

        if (!keepCurrentQuestion || !currentExpectedKey) {
            nextStroopQuestion();
        } else {
            questionStartTime = performance.now();
        }

        // 100ms interval for smooth timer progress
        timerInterval = setInterval(() => {
            timeLeft -= 0.1;
            if (timeLeft <= 0) {
                timeLeft = 0;
                if (stroopTimerEl) stroopTimerEl.textContent = '0s';
                if (stroopProgressFill) {
                    stroopProgressFill.style.width = '0%';
                    stroopProgressFill.classList.remove('is-urgent');
                }
                if (stroopProgressTrack) stroopProgressTrack.classList.remove('is-urgent');
                if (hudTimerBox) hudTimerBox.classList.remove('is-urgent');
                endStroopGame();
                return;
            }
            if (stroopTimerEl) stroopTimerEl.textContent = Math.ceil(timeLeft) + 's';
            const isLowTime = timeLeft <= 6.0;
            if (stroopProgressFill) {
                const pct = Math.min(100, Math.max(0, (timeLeft / totalDuration) * 100));
                stroopProgressFill.style.width = `${pct}%`;
                stroopProgressFill.classList.toggle('is-urgent', isLowTime);
            }
            if (stroopProgressTrack) {
                stroopProgressTrack.classList.toggle('is-urgent', isLowTime);
            }
            if (hudTimerBox) {
                hudTimerBox.classList.toggle('is-urgent', isLowTime);
            }
        }, 100);
    }

    function stopStroopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function nextStroopQuestion() {
        // Pick an ink color at random
        const inkObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        currentInkColorKey = inkObj.key;

        // Dynamic cognitive interference: escalates naturally with player streak
        const conflictRate = currentStreak >= 10 ? 0.92 : (currentStreak >= 5 ? 0.85 : 0.75);
        let wordObj;
        if (Math.random() < conflictRate) {
            const mismatched = COLORS.filter((c) => c.key !== inkObj.key);
            wordObj = mismatched[Math.floor(Math.random() * mismatched.length)];
        } else {
            wordObj = inkObj;
        }
        currentWord = wordObj.label;

        // High streak surprise trap (streak >= 8 has 22% chance of inverted rule)
        if (currentStreak >= 8 && Math.random() < 0.22) {
            hardModeInverted = true;
            currentExpectedKey = wordObj.key;
            if (promptPillText) promptPillText.textContent = 'TRAP! TAP THE WORD MEANING • IGNORE INK';
            if (stroopPromptPill) stroopPromptPill.classList.add('is-inverted');
            if (diagModeText) diagModeText.textContent = 'TARGET: WORD MEANING (TRAP)';
            if (stroopWordKicker) stroopWordKicker.textContent = 'TRAP DETECTED: MATCH WORD MEANING';
        } else {
            hardModeInverted = false;
            currentExpectedKey = inkObj.key;
            if (promptPillText) promptPillText.textContent = 'TAP THE INK COLOR • IGNORE THE WORD';
            if (stroopPromptPill) stroopPromptPill.classList.remove('is-inverted');
            if (diagModeText) diagModeText.textContent = 'TARGET: INK COLOR';
            if (stroopWordKicker) stroopWordKicker.textContent = 'EXHIBIT #04 • INK SPECTRUM STIMULUS';
        }

        if (stroopWordText) {
            stroopWordText.textContent = currentWord;
            stroopWordText.style.color = inkObj.hex;
        }

        if (stroopWordCard) {
            stroopWordCard.classList.remove('is-popping');
            void stroopWordCard.offsetWidth;
            stroopWordCard.classList.add('is-popping');
        }

        questionStartTime = performance.now();
    }

    function triggerPopFeedback(text, isPositive) {
        if (!stroopPopFeedback) return;
        stroopPopFeedback.textContent = text;
        stroopPopFeedback.className = 'stroop-pop-feedback';
        stroopPopFeedback.classList.add(isPositive ? 'show-good' : 'show-bad');
        stroopPopFeedback.classList.add(isPositive ? 'pop-positive' : 'pop-negative');
        void stroopPopFeedback.offsetWidth;
        stroopPopFeedback.classList.add('is-active');
        setTimeout(() => {
            stroopPopFeedback.classList.remove('is-active', 'show-good', 'show-bad');
        }, 550);
    }

    let lastChoiceTime = 0;

    function handleColorChoice(chosenKey) {
        const now = performance.now();
        if (isGameActive && now - lastChoiceTime < 130) {
            // Guard against accidental double-clicks or key bounce bleeding into next question
            return;
        }
        lastChoiceTime = now;

        if (!isGameActive) {
            const isOverlayVisible = stroopGameOverScreen && !stroopGameOverScreen.hidden;
            if (isOverlayVisible) {
                // If game over overlay is showing, dismiss and start fresh test
                startStroopGame(false);
                return;
            }
            // Auto-start game on first color choice while preserving the displayed question
            startStroopGame(true);
        }

        totalAnswered++;

        // Measure reaction time
        const rx = Math.round(performance.now() - questionStartTime);
        if (diagSpeedText) diagSpeedText.textContent = `Reaction: ${rx} ms`;

        if (chosenKey === currentExpectedKey) {
            // Correct!
            correctAnswered++;
            currentStreak++;
            if (currentStreak > maxStreakInGame) maxStreakInGame = currentStreak;

            // Dynamic Time Extension: +0.5s per correct hit
            const timeBonus = 0.5;
            const maxCap = 45.0;
            timeLeft = Math.min(maxCap, timeLeft + timeBonus);

            // Trigger visual timer gain pulse
            if (stroopTimerEl) {
                stroopTimerEl.textContent = `${Math.ceil(timeLeft)}s`;
                const timerBox = stroopTimerEl.closest('.hud-timer-box');
                if (timerBox) {
                    timerBox.classList.remove('timer-gain');
                    void timerBox.offsetWidth;
                    timerBox.classList.add('timer-gain');
                }
            }

            const basePts = 100;
            const streakBonus = (currentStreak - 1) * 25;
            const speedBonus = rx < 400 ? 50 : 0;
            const pts = basePts + streakBonus + speedBonus;
            gameScore += pts;

            if (stroopScoreEl) stroopScoreEl.textContent = gameScore.toLocaleString();
            if (stroopStreakEl) stroopStreakEl.textContent = `${currentStreak}x`;

            updateRankProgressionUI(true);

            const accPct = Math.round((correctAnswered / totalAnswered) * 100);
            if (stroopAccuracyEl) stroopAccuracyEl.textContent = `${accPct}%`;

            playStroopCorrect(currentStreak);
            const bonusStr = `+${timeBonus.toFixed(1)}s`;
            triggerPopFeedback(currentStreak >= 3 ? `+${pts} (${currentStreak}x! ${bonusStr})` : `+${pts} (${bonusStr})`, true);

            // Streak milestone commentary & fanfare
            if (currentStreak === 5) {
                playComboFanfare();
                if (meliaPhoneSpeech) meliaPhoneSpeech.textContent = '"5x Streak! Focus overdrive active!"';
            } else if (currentStreak === 10) {
                playComboFanfare();
                if (meliaPhoneSpeech) meliaPhoneSpeech.textContent = '"10x COMBO! You are dominating the clock!"';
            } else if (currentStreak === 20) {
                playComboFanfare();
                if (meliaPhoneSpeech) meliaPhoneSpeech.textContent = '"20x COMBO! Grand Inquisitor caliber reflexes!"';
            } else if (currentStreak === 35) {
                playComboFanfare();
                if (meliaPhoneSpeech) meliaPhoneSpeech.textContent = '"35x GODLIKE STREAK! Master detective at work!"';
            }

            nextStroopQuestion();

        } else {
            // Wrong! Drastic timer deduction & point penalty; rank can drop!
            currentStreak = 0;
            if (stroopStreakEl) stroopStreakEl.textContent = '0x';

            const timePenalty = 5;
            timeLeft -= timePenalty;

            const scorePenalty = 150;
            const prevScore = gameScore;
            gameScore = Math.max(0, gameScore - scorePenalty);

            if (stroopScoreEl) {
                stroopScoreEl.textContent = gameScore.toLocaleString();
                const scoreBox = stroopScoreEl.closest('.hud-stat-box');
                if (scoreBox) {
                    scoreBox.classList.remove('score-loss');
                    void scoreBox.offsetWidth;
                    scoreBox.classList.add('score-loss');
                }
            }

            // Check if score deduction caused a rank demotion
            const prevTier = currentTier;
            updateRankProgressionUI(true);
            const demoted = currentTier.tier < prevTier.tier;

            // Trigger visual timer loss shake
            if (stroopTimerEl) {
                const timerBox = stroopTimerEl.closest('.hud-timer-box');
                if (timerBox) {
                    timerBox.classList.remove('timer-loss');
                    void timerBox.offsetWidth;
                    timerBox.classList.add('timer-loss');
                }
            }

            const accPct = Math.round((correctAnswered / totalAnswered) * 100);
            if (stroopAccuracyEl) stroopAccuracyEl.textContent = `${accPct}%`;

            playStroopWrong();

            if (stroopWordCard) {
                stroopWordCard.classList.remove('is-shaking');
                void stroopWordCard.offsetWidth;
                stroopWordCard.classList.add('is-shaking');
            }

            if (timeLeft <= 0) {
                timeLeft = 0;
                if (stroopTimerEl) stroopTimerEl.textContent = '0s';
                if (stroopProgressFill) stroopProgressFill.style.width = '0%';
                triggerPopFeedback(`TIMEOUT! -${timePenalty}s`, false);
                endStroopGame();
                return;
            }

            if (stroopTimerEl) stroopTimerEl.textContent = `${Math.ceil(timeLeft)}s`;

            if (!demoted) {
                const ptsLostStr = prevScore > 0 ? `-${Math.min(scorePenalty, prevScore)} pts` : '0 pts';
                triggerPopFeedback(hardModeInverted ? `TRAP! ${ptsLostStr} \u2022 -${timePenalty}s` : `MISS! ${ptsLostStr} \u2022 -${timePenalty}s`, false);
                if (meliaPhoneSpeech) {
                    meliaPhoneSpeech.textContent = `"Careful! Lost ${timePenalty}s and ${scorePenalty} pts! Regain your focus!"`;
                }
            }

            nextStroopQuestion();
        }
    }

    function endStroopGame() {
        stopStroopTimer();
        isGameActive = false;
        playGameOverSound();

        if (stroopProgressFill) stroopProgressFill.classList.remove('is-urgent');
        if (stroopProgressTrack) stroopProgressTrack.classList.remove('is-urgent');
        if (hudTimerBox) hudTimerBox.classList.remove('is-urgent');

        // Save High Scores
        const prevHigh = parseInt(localStorage.getItem(STORAGE_KEY_HIGHSCORE) || '0', 10);
        if (gameScore > prevHigh) {
            localStorage.setItem(STORAGE_KEY_HIGHSCORE, gameScore.toString());
        }
        const prevStreak = parseInt(localStorage.getItem(STORAGE_KEY_STREAK) || '0', 10);
        if (maxStreakInGame > prevStreak) {
            localStorage.setItem(STORAGE_KEY_STREAK, maxStreakInGame.toString());
        }
        const prevRounds = parseInt(localStorage.getItem(STORAGE_KEY_ROUNDS) || '0', 10);
        localStorage.setItem(STORAGE_KEY_ROUNDS, (prevRounds + 1).toString());

        // Save best clearance rank achieved
        const savedBestTier = parseInt(localStorage.getItem(STORAGE_KEY_BEST_RANK) || '1', 10);
        if (currentTier.tier > savedBestTier) {
            localStorage.setItem(STORAGE_KEY_BEST_RANK, currentTier.tier.toString());
        }

        updateStatsUI();

        // Determine Detective Assessment based on final clearance tier achieved
        const rank = currentTier.fullName.toUpperCase();
        let desc = 'The cognitive interference trap caught you early. Keep your timer alive with accuracy!';

        if (currentTier.tier === 4) {
            desc = 'Legendary visual cognitive mastery! You completely dominated the Stroop test in sustained overtime!';
        } else if (currentTier.tier === 3) {
            desc = 'Exceptional reflexes! You sustained high accuracy and streak momentum to keep the timer ticking into high gear.';
        } else if (currentTier.tier === 2) {
            desc = 'Solid focus! You built a reliable time cushion and resisted typography traps under pressure.';
        }

        const acc = totalAnswered > 0 ? Math.round((correctAnswered / totalAnswered) * 100) : 0;

        if (finalScoreVal) finalScoreVal.textContent = gameScore.toLocaleString();
        if (finalCorrectCount) finalCorrectCount.textContent = correctAnswered.toString();
        if (finalAccuracy) finalAccuracy.textContent = `${acc}%`;
        if (finalMaxStreak) finalMaxStreak.textContent = `${maxStreakInGame}x`;
        if (finalRankTitle) finalRankTitle.textContent = rank;
        if (finalRankDesc) finalRankDesc.textContent = desc;

        if (stroopGameOverScreen) stroopGameOverScreen.hidden = false;
        if (meliaPhoneStatusPill) meliaPhoneStatusPill.textContent = rank;
        if (meliaPhoneSpeech) {
            meliaPhoneSpeech.textContent = `"Test complete! Final score: ${gameScore.toLocaleString()} pts (${rank})! Hit Play Again for another round!"`;
        }
    }

    // ==========================================
    // Statistics & Local Storage
    // ==========================================
    function updateStatsUI() {
        const high = localStorage.getItem(STORAGE_KEY_HIGHSCORE) || '0';
        const streak = localStorage.getItem(STORAGE_KEY_STREAK) || '0';
        const rounds = localStorage.getItem(STORAGE_KEY_ROUNDS) || '0';
        const bestTierNum = parseInt(localStorage.getItem(STORAGE_KEY_BEST_RANK) || '1', 10);
        const bestTierObj = SLEUTH_TIERS.find((t) => t.tier === bestTierNum) || SLEUTH_TIERS[0];

        if (statHighScoreEl) statHighScoreEl.textContent = parseInt(high, 10).toLocaleString();
        if (statBestRankEl) statBestRankEl.textContent = bestTierObj.name.toUpperCase();
        if (statBestStreakEl) statBestStreakEl.textContent = `${streak}x`;
        if (statTotalRoundsEl) statTotalRoundsEl.textContent = rounds;
    }

    function resetStats() {
        if (!confirm('Reset all your Brain Trace high scores and statistics?')) return;
        localStorage.removeItem(STORAGE_KEY_HIGHSCORE);
        localStorage.removeItem(STORAGE_KEY_STREAK);
        localStorage.removeItem(STORAGE_KEY_ROUNDS);
        localStorage.removeItem(STORAGE_KEY_BEST_RANK);
        updateStatsUI();
        updateRankProgressionUI(false);
        updateStatsUI();
        showPhoneToast('Brain Trace stats reset.');
        playTone(320, 'sine', 0.1, 0.1);
    }

    // ==========================================
    // Night Mode & Real-time Clock
    // ==========================================
    function setNightMode(enable) {
        isNightMode = enable;
        localStorage.setItem(STORAGE_KEY_NIGHT, enable ? '1' : '0');
        if (phoneScreen) phoneScreen.classList.toggle('is-night-mode', enable);
        if (phoneThemeIcon) phoneThemeIcon.textContent = enable ? 'NIGHT' : 'DAY';
        if (toggleNightScreenBtn) toggleNightScreenBtn.textContent = enable ? 'Day Screen' : 'Night Screen';
    }

    function updateLiveClocks() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hrs}:${mins}`;

        if (phoneStatusClock) phoneStatusClock.textContent = timeStr;
    }

    // ==========================================
    // Event Listeners Wiring
    // ==========================================
    function setupEventListeners() {
        if (buzzPhoneBtn) {
            buzzPhoneBtn.addEventListener('click', () => {
                triggerPhoneVibrate();
                showPushBanner('BUREAU ALERT', 'Vibration test signal received.');
            });
        }

        if (toggleNightScreenBtn) {
            toggleNightScreenBtn.addEventListener('click', () => {
                setNightMode(!isNightMode);
                playTone(isNightMode ? 440 : 880, 'sine', 0.08, 0.1);
            });
        }

        if (quickRestartGameBtn) {
            quickRestartGameBtn.addEventListener('click', () => {
                startStroopGame(false);
            });
        }

        // Stroop Color Choice Buttons
        if (stroopButtonsGrid) {
            stroopButtonsGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('.stroop-color-btn');
                if (!btn) return;
                const color = btn.getAttribute('data-color');
                if (color) handleColorChoice(color);
            });
        }

        // Game Over Buttons
        if (gameOverRestartBtn) {
            gameOverRestartBtn.addEventListener('click', () => startStroopGame(false));
        }

        // Desk Companion Actions
        if (btnRestartDesk) {
            btnRestartDesk.addEventListener('click', () => startStroopGame(false));
        }

        if (btnResetScores) {
            btnResetScores.addEventListener('click', resetStats);
        }

        // Global Physical Keyboard Support
        window.addEventListener('keydown', (e) => {
            // Only capture if phone view is active
            const isPhoneActive = window.location.hash === '#phone' ||
                (phoneView && !phoneView.hasAttribute('aria-hidden') && phoneView.getAttribute('aria-hidden') !== 'true');
            if (!isPhoneActive) return;

            // Ignore auto-repeated keydown events when holding a key down
            if (e.repeat) return;

            // Prevent shortcuts if typing into an input/textarea elsewhere
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

            // Stroop Choice Shortcuts (Q, W, A, S or 1, 2, 3, 4)
            const k = e.key.toLowerCase();
            const matchedColor = COLORS.find((c) => c.kbd.includes(k));
            if (matchedColor) {
                e.preventDefault();
                handleColorChoice(matchedColor.key);
            } else if (!isGameActive && (e.key === ' ' || e.key === 'Enter')) {
                // Restart when idle or game over
                e.preventDefault();
                startStroopGame(false);
            }
        });
    }

    // ==========================================
    // Initialization
    // ==========================================
    function init() {
        updateLiveClocks();
        setInterval(updateLiveClocks, 1000);

        // Load saved theme
        const savedNight = localStorage.getItem(STORAGE_KEY_NIGHT);
        if (savedNight === '1') setNightMode(true);

        updateStatsUI();
        updateRankProgressionUI(false);
        setupEventListeners();

        // Prepare ready state
        if (meliaPhoneStatusPill) meliaPhoneStatusPill.textContent = 'READY';
        if (meliaPhoneSpeech) {
            meliaPhoneSpeech.textContent = '"Welcome to the Cognitive Reflex Lab! Tap the ink color of each word as fast as you can—don\'t let your eyes fall into the typography trap!"';
        }
        nextStroopQuestion();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
