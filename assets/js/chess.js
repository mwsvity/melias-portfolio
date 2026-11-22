/**
 * Melia Winisa | Detective Assistant Portfolio
 * Detective Chess vs. Bots Engine (Full FIDE Rules, Alpha-Beta AI, SVG Pieces & Audio)
 */

(function () {
    'use strict';

    const boardEl = document.getElementById('chessBoard');
    if (!boardEl) return;

    // ==========================================
    // Custom SVG Chess Piece Artwork (Cozy Detective Palette)
    // ==========================================
    const PIECE_SVGS = {
        wP: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-white"><g fill="#fff9f0" stroke="#472005" stroke-width="2" stroke-linecap="round"><path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17,21 15,24.5 15,29 L 30,29 C 30,24.5 28,21 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z"/><path d="M 11.5,37 L 33.5,37 C 33.5,33.5 31,31 28,31 L 17,31 C 14,31 11.5,33.5 11.5,37 z"/></g></svg>`,
        wR: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-white"><g fill="#fff9f0" stroke="#472005" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/><path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/><path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z"/><path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z"/><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"/><path d="M 12,32 L 14,29.5 L 31,29.5 L 33,32 L 12,32 z"/></g></svg>`,
        wN: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-white"><g fill="none" stroke="#472005" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#fff9f0"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="#fff9f0"/><circle cx="15.5" cy="14.5" r="1.2" fill="#472005"/></g></svg>`,
        wB: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-white"><g fill="none" stroke="#472005" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff9f0"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/><circle cx="22.5" cy="8" r="2.2"/></g><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"/></g></svg>`,
        wQ: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-white"><g fill="#fff9f0" stroke="#472005" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"/><circle cx="6" cy="12" r="1.8"/><circle cx="14" cy="9" r="1.8"/><circle cx="22.5" cy="8" r="1.8"/><circle cx="31" cy="9" r="1.8"/><circle cx="39" cy="12" r="1.8"/></g></svg>`,
        wK: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-white"><g fill="none" stroke="#472005" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6"/><path d="M 20,8 L 25,8"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" fill="#fff9f0"/><path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z" fill="#fff9f0"/><path d="M 11.5,30 C 17,27 27,27 32.5,30"/><path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5"/><path d="M 11.5,37 C 17,34 27,34 32.5,37"/></g></svg>`,

        bP: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-black"><g fill="#4a2109" stroke="#240f03" stroke-width="2" stroke-linecap="round"><path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17,21 15,24.5 15,29 L 30,29 C 30,24.5 28,21 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z"/><path d="M 11.5,37 L 33.5,37 C 33.5,33.5 31,31 28,31 L 17,31 C 14,31 11.5,33.5 11.5,37 z"/></g></svg>`,
        bR: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-black"><g fill="#4a2109" stroke="#240f03" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/><path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/><path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z"/><path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z"/><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"/><path d="M 12,32 L 14,29.5 L 31,29.5 L 33,32 L 12,32 z"/><path d="M 14,16.5 L 31,16.5" stroke="#e8c39e" stroke-width="1.2"/><path d="M 12,32 L 33,32" stroke="#e8c39e" stroke-width="1.2"/></g></svg>`,
        bN: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-black"><g fill="none" stroke="#240f03" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#4a2109"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="#4a2109"/><circle cx="15.5" cy="14.5" r="1.3" fill="#f6efe6" stroke="none"/></g></svg>`,
        bB: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-black"><g fill="none" stroke="#240f03" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="#4a2109"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/><circle cx="22.5" cy="8" r="2.2"/></g><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke="#e8c39e" stroke-width="1.4"/></g></svg>`,
        bQ: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-black"><g fill="#4a2109" stroke="#240f03" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"/><circle cx="6" cy="12" r="1.8"/><circle cx="14" cy="9" r="1.8"/><circle cx="22.5" cy="8" r="1.8"/><circle cx="31" cy="9" r="1.8"/><circle cx="39" cy="12" r="1.8"/><path d="M 11.5,30 C 20,28.5 25,28.5 33.5,30" stroke="#e8c39e" stroke-width="1.3"/><path d="M 12,33.5 C 20,32 25,32 33,33.5" stroke="#e8c39e" stroke-width="1.3"/></g></svg>`,
        bK: `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-black"><g fill="none" stroke="#240f03" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6"/><path d="M 20,8 L 25,8"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" fill="#4a2109"/><path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z" fill="#4a2109"/><path d="M 11.5,30 C 17,27 27,27 32.5,30" stroke="#e8c39e" stroke-width="1.3"/><path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" stroke="#e8c39e" stroke-width="1.3"/><path d="M 11.5,37 C 17,34 27,34 32.5,37" stroke="#e8c39e" stroke-width="1.3"/></g></svg>`
    };

    const UNICODE_PIECES = {
        wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
        bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
    };

    const PIECE_VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

    // ==========================================
    // Assistant Detective Difficulty Profiles & Dialogue Lines
    // ==========================================
    const BOTS = {
        easy: {
            id: 'easy',
            name: 'Assistant Detective',
            title: 'Melia Winisa • Easy',
            elo: '650',
            badge: 'EASY',
            avatarType: 'image',
            avatarHappy: 'assets/image/characters/profile-avatar.png',
            avatarCurious: 'assets/image/characters/profile-avatar.png',
            depth: 1,
            blunderChance: 0.42,
            randomSpread: 90,
            desc: 'Casual warm-up match with your Assistant Detective. Relaxed pace and forgiving play.',
            lines: {
                greeting: "Detective, let's start with a relaxed warm-up game over coffee!",
                playerCapture: "Ooh, wait—did I leave that piece unguarded?! Let me jot that down in my notes!",
                botCapture: "Aha! Spotted a loose clue on that square, Detective!",
                check: "Check! Did I actually catch your King off guard, Detective?",
                inCheck: "Eek! My King is under questioning! Let me find a safe square...",
                win: "Wait... checkmate?! Looks like the warm-up went my way this time, Detective~",
                loss: "Checkmate! You solved that position effortlessly, Detective!",
                draw: "A stalemate! Let's call this warm-up case a friendly tie!",
                hint: "Need a quick pointer, Detective? Take a look at the glowing squares!"
            }
        },
        medium: {
            id: 'medium',
            name: 'Assistant Detective',
            title: 'Melia Winisa • Medium',
            elo: '1150',
            badge: 'MEDIUM',
            avatarType: 'image',
            avatarHappy: 'assets/image/characters/profile-avatar.png',
            avatarCurious: 'assets/image/characters/profile-avatar.png',
            depth: 2,
            blunderChance: 0.12,
            randomSpread: 30,
            desc: 'Balanced match against your Assistant Detective with active development and tactical traps.',
            lines: {
                greeting: "Detective! Let's see how sharp your tactical deductions are over the board today!",
                playerCapture: "Ooh, clever move, Detective! You saw right through my defense.",
                botCapture: "I'll be filing this piece into the evidence locker, Detective!",
                check: "Check! Careful now, Detective—your King has nowhere to hide!",
                inCheck: "Hmm, a bold line of questioning! Let me rethink my alibi...",
                win: "Checkmate! Looks like your assistant solved the case first this time~",
                loss: "Checkmate! Brilliant deduction as always, Detective! Want a rematch?",
                draw: "A draw! Our deductions canceled each other out to the very last clue.",
                hint: "Need a clue from your assistant? Check the highlighted squares on the board!"
            }
        },
        hard: {
            id: 'hard',
            name: 'Assistant Detective',
            title: 'Melia Winisa • Hard',
            elo: '1550',
            badge: 'HARD',
            avatarType: 'image',
            avatarHappy: 'assets/image/characters/profile-avatar.png',
            avatarCurious: 'assets/image/characters/profile-avatar.png',
            depth: 3,
            blunderChance: 0.02,
            randomSpread: 10,
            desc: 'Serious investigation mode! Melia calculates multi-move combinations and punishes loose squares.',
            lines: {
                greeting: "I've studied all the case files for this match, Detective. I won't hold back!",
                playerCapture: "Hmm, a calculated exchange... you really planned that sequence ahead!",
                botCapture: "Gotcha! That square was left unguarded in your testimony, Detective!",
                check: "Check! The investigation net is closing in on your King!",
                inCheck: "Sharp tactical pressure, Detective! Let me cross-examine my options...",
                win: "Checkmate! All those late nights studying endgames in the office paid off!",
                loss: "Checkmate! Even when I play seriously, your deductions are one step ahead!",
                draw: "A hard-fought draw! Neither of us gave an inch on the board.",
                hint: "Here is my sharpest tactical read on the position—inspect the highlighted squares!"
            }
        },
        'extremely-hard': {
            id: 'extremely-hard',
            name: 'Assistant Detective',
            title: 'Melia Winisa • Extremely Hard',
            elo: '1950',
            badge: 'EXTREMELY HARD',
            avatarType: 'image',
            avatarHappy: 'assets/image/characters/profile-avatar.png',
            avatarCurious: 'assets/image/characters/profile-avatar.png',
            depth: 4,
            blunderChance: 0,
            randomSpread: 0,
            desc: 'Full deduction mode! Deep tactical calculation, opening book mastery, and ruthless endgame precision.',
            lines: {
                greeting: "Full deduction mode activated! Show me your very best strategy, Detective!",
                playerCapture: "Impressive! Finding a capture through my deepest calculation is no easy feat.",
                botCapture: "Every piece on the board is part of the chain of evidence—and I'm claiming this one!",
                check: "Check! Every escape route has been accounted for, Detective!",
                inCheck: "Fascinating! You found a forcing line right into my King's defense!",
                win: "Checkmate! Your Assistant Detective takes the crown at full deduction power!",
                loss: "Unbelievable... Checkmate?! You outcalculated my deepest analysis, Detective!",
                draw: "A master-level draw! Our investigative instincts are completely matched.",
                hint: "Looking for the deepest continuation? Follow the highlighted clue on the board!"
            }
        }
    };

    // ==========================================
    // Piece-Square Tables (from White's perspective; rank 0 = 8th rank, rank 7 = 1st rank)
    // ==========================================
    const PST = {
        P: [
            [  0,  0,  0,  0,  0,  0,  0,  0],
            [ 50, 50, 50, 50, 50, 50, 50, 50],
            [ 10, 10, 20, 30, 30, 20, 10, 10],
            [  5,  5, 10, 25, 25, 10,  5,  5],
            [  0,  0,  0, 20, 20,  0,  0,  0],
            [  5, -5,-10,  0,  0,-10, -5,  5],
            [  5, 10, 10,-20,-20, 10, 10,  5],
            [  0,  0,  0,  0,  0,  0,  0,  0]
        ],
        N: [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ],
        B: [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ],
        R: [
            [  0,  0,  0,  0,  0,  0,  0,  0],
            [  5, 10, 10, 10, 10, 10, 10,  5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [  0,  0,  0,  5,  5,  0,  0,  0]
        ],
        Q: [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [ -5,  0,  5,  5,  5,  5,  0, -5],
            [  0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ],
        K: [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [ 20, 20,  0,  0,  0,  0, 20, 20],
            [ 20, 30, 10,  0,  0, 10, 30, 20]
        ],
        K_END: [
            [-50,-40,-30,-20,-20,-30,-40,-50],
            [-30,-20,-10,  0,  0,-10,-20,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-30,  0,  0,  0,  0,-30,-30],
            [-50,-30,-30,-30,-30,-30,-30,-50]
        ]
    };

    // Small Opening Book (keyed by space-separated coordinate moves e.g. "e2e4 e7e5")
    const OPENING_BOOK = {
        "": ["e2e4", "d2d4", "c2c4", "g1f3"],
        "e2e4": ["e7e5", "c7c5", "e7e6", "c7c6"],
        "d2d4": ["d7d5", "g8f6", "e7e6"],
        "c2c4": ["e7e5", "c7c5", "g8f6"],
        "g1f3": ["d7d5", "g8f6", "c7c5"],
        "e2e4 e7e5": ["g1f3", "f1c4", "b1c3"],
        "e2e4 c7c5": ["g1f3", "b1c3"],
        "e2e4 e7e6": ["d2d4", "b1c3"],
        "e2e4 c7c6": ["d2d4", "b1c3"],
        "e2e4 e7e5 g1f3": ["b8c6", "g8f6"],
        "e2e4 e7e5 g1f3 b8c6": ["f1b5", "f1c4", "d2d4"],
        "e2e4 e7e5 g1f3 b8c6 f1c4": ["f8c5", "g8f6"],
        "e2e4 e7e5 g1f3 b8c6 f1b5": ["a7a6", "g8f6"],
        "d2d4 d7d5": ["c2c4", "g1f3", "c1f4"],
        "d2d4 d7d5 c2c4": ["e7e6", "c7c6"],
        "d2d4 g8f6": ["c2c4", "g1f3", "c1f4"],
        "d2d4 g8f6 c2c4": ["e7e6", "g7g6"]
    };

    // ==========================================
    // Sound Synthesizer (Tactile Wooden Chess SFX)
    // ==========================================
    let chessAudioCtx = null;

    function playChessSfx(type) {
        const stored = localStorage.getItem('melia_sfx_vol');
        const sfxVol = (stored === null || stored === '28') ? 78 : parseFloat(stored);
        if (sfxVol <= 0.5) return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            if (!chessAudioCtx) chessAudioCtx = new AudioContextClass();
            if (chessAudioCtx.state === 'suspended') chessAudioCtx.resume();

            const now = chessAudioCtx.currentTime;
            const masterGain = chessAudioCtx.createGain();
            masterGain.gain.value = (sfxVol / 100) * 0.95;
            masterGain.connect(chessAudioCtx.destination);

            if (type === 'move' || type === 'capture') {
                // Warm wooden thud
                const osc = chessAudioCtx.createOscillator();
                const gain = chessAudioCtx.createGain();
                osc.type = 'triangle';
                const startFreq = type === 'capture' ? 195 : 145;
                osc.frequency.setValueAtTime(startFreq, now);
                osc.frequency.exponentialRampToValueAtTime(48, now + 0.075);

                gain.gain.setValueAtTime(type === 'capture' ? 0.72 : 0.55, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 0.09);

                if (type === 'capture') {
                    // Extra crisp clack for piece capture
                    const clickOsc = chessAudioCtx.createOscillator();
                    const clickGain = chessAudioCtx.createGain();
                    clickOsc.type = 'sine';
                    clickOsc.frequency.setValueAtTime(520, now);
                    clickOsc.frequency.exponentialRampToValueAtTime(160, now + 0.045);
                    clickGain.gain.setValueAtTime(0.48, now);
                    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    clickOsc.connect(clickGain);
                    clickGain.connect(masterGain);
                    clickOsc.start(now);
                    clickOsc.stop(now + 0.055);
                }
            } else if (type === 'check') {
                const osc = chessAudioCtx.createOscillator();
                const gain = chessAudioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.setValueAtTime(880, now + 0.07); // A5
                gain.gain.setValueAtTime(0.45, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'gameover') {
                [523.25, 659.25, 783.99].forEach((freq, idx) => {
                    const osc = chessAudioCtx.createOscillator();
                    const gain = chessAudioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.09);
                    gain.gain.setValueAtTime(0.42, now + idx * 0.09);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
                    osc.connect(gain);
                    gain.connect(masterGain);
                    osc.start(now + idx * 0.09);
                    osc.stop(now + idx * 0.09 + 0.36);
                });
            }
        } catch (e) {}
    }

    // ==========================================
    // Game State
    // ==========================================
    let currentBotKey = 'medium';
    let playerColor = 'w'; // 'w' or 'b'
    let boardFlipped = false;
    let board = [];
    let turn = 'w';
    let castling = { wK: true, wQ: true, bK: true, bQ: true };
    let enPassant = null; // { r, c } target square
    let halfMoveClock = 0;
    let fullMoveNumber = 1;
    let stateHistory = [];
    let moveHistory = []; // Array of move records { san, uci, color, piece, captured }
    let positionCounts = {};

    let selectedSquare = null; // { r, c }
    let legalMovesFromSelected = [];
    let lastMove = null; // { from: {r,c}, to: {r,c} }
    let hintMove = null; // { from: {r,c}, to: {r,c} }
    let pendingPromotionMove = null;
    let isGameOver = false;
    let isBotThinking = false;
    let botTimer = null;
    let dragSourceSquare = null;

    // DOM References
    const botCards = document.querySelectorAll('.bot-select-card');
    const colorBtns = document.querySelectorAll('.color-choice-btn');
    const newGameBtn = document.getElementById('newGameBtn');
    const undoBtn = document.getElementById('undoMoveBtn');
    const hintBtn = document.getElementById('hintMoveBtn');
    const flipBtn = document.getElementById('flipBoardBtn');
    const resignBtn = document.getElementById('resignGameBtn');

    const botAvatarContainer = document.getElementById('activeBotAvatar');
    const botNameEl = document.getElementById('activeBotName');
    const botMetaEl = document.getElementById('activeBotMeta');
    const botStatusPill = document.getElementById('botStatusPill');
    const botDialogueText = document.getElementById('botDialogueText');

    const topPlayerName = document.getElementById('topPlayerName');
    const topPlayerBadge = document.getElementById('topPlayerBadge');
    const topCapturedEl = document.getElementById('topCapturedPieces');
    const topMaterialAdvEl = document.getElementById('topMaterialAdv');

    const bottomPlayerName = document.getElementById('bottomPlayerName');
    const bottomPlayerBadge = document.getElementById('bottomPlayerBadge');
    const bottomCapturedEl = document.getElementById('bottomCapturedPieces');
    const bottomMaterialAdvEl = document.getElementById('bottomMaterialAdv');

    const moveListEl = document.getElementById('moveLogList');
    const gameStatusBanner = document.getElementById('chessStatusBanner');
    const evalFillEl = document.getElementById('evalBarFill');
    const evalScoreEl = document.getElementById('evalBarScore');

    const promotionModal = document.getElementById('promotionModal');
    const promotionChoices = document.getElementById('promotionChoices');
    const resultModal = document.getElementById('chessResultModal');
    const resultStamp = document.getElementById('resultStampText');
    const resultTitle = document.getElementById('resultTitleText');
    const resultDesc = document.getElementById('resultDescText');
    const resultRematchBtn = document.getElementById('resultRematchBtn');
    const resultCloseBtn = document.getElementById('resultCloseBtn');

    // ==========================================
    // Board Utilities & Coordinate Conversion
    // ==========================================
    const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    function toCoord(r, c) {
        return FILES[c] + (8 - r);
    }

    function fromUci(uci) {
        const fc = FILES.indexOf(uci[0]);
        const fr = 8 - parseInt(uci[1], 10);
        const tc = FILES.indexOf(uci[2]);
        const tr = 8 - parseInt(uci[3], 10);
        const promo = uci[4] ? uci[4].toUpperCase() : null;
        return { from: { r: fr, c: fc }, to: { r: tr, c: tc }, promotion: promo };
    }

    function cloneBoard(b) {
        return b.map(row => row.slice());
    }

    function getPositionKey(b, activeTurn, castle, ep) {
        let rows = [];
        for (let r = 0; r < 8; r++) {
            let s = '';
            for (let c = 0; c < 8; c++) {
                s += b[r][c] || '--';
            }
            rows.push(s);
        }
        const cKey = `${castle.wK ? 'K' : ''}${castle.wQ ? 'Q' : ''}${castle.bK ? 'k' : ''}${castle.bQ ? 'q' : ''}`;
        const epKey = ep ? `${ep.r},${ep.c}` : '-';
        return `${rows.join('/')}_${activeTurn}_${cKey}_${epKey}`;
    }

    function createInitialBoard() {
        return [
            ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
            ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
            ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
        ];
    }

    // ==========================================
    // Move Generation & Attack Detection
    // ==========================================
    function inBounds(r, c) {
        return r >= 0 && r < 8 && c >= 0 && c < 8;
    }

    function findKing(b, color) {
        const target = color + 'K';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (b[r][c] === target) return { r, c };
            }
        }
        return null;
    }

    function isSquareAttacked(b, targetR, targetC, attackerColor) {
        // 1. Pawn attacks
        const pawnDir = attackerColor === 'w' ? 1 : -1; // row where attacker pawn stands relative to target
        const pawnRow = targetR + pawnDir;
        if (pawnRow >= 0 && pawnRow < 8) {
            if (targetC - 1 >= 0 && b[pawnRow][targetC - 1] === attackerColor + 'P') return true;
            if (targetC + 1 < 8 && b[pawnRow][targetC + 1] === attackerColor + 'P') return true;
        }

        // 2. Knight attacks
        const knightJumps = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        for (let i = 0; i < 8; i++) {
            const nr = targetR + knightJumps[i][0];
            const nc = targetC + knightJumps[i][1];
            if (inBounds(nr, nc) && b[nr][nc] === attackerColor + 'N') return true;
        }

        // 3. King attacks
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const kr = targetR + dr;
                const kc = targetC + dc;
                if (inBounds(kr, kc) && b[kr][kc] === attackerColor + 'K') return true;
            }
        }

        // 4. Orthogonal sliders (Rook / Queen)
        const orthoDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let d = 0; d < 4; d++) {
            let nr = targetR + orthoDirs[d][0];
            let nc = targetC + orthoDirs[d][1];
            while (inBounds(nr, nc)) {
                const sq = b[nr][nc];
                if (sq) {
                    if (sq === attackerColor + 'R' || sq === attackerColor + 'Q') return true;
                    break;
                }
                nr += orthoDirs[d][0];
                nc += orthoDirs[d][1];
            }
        }

        // 5. Diagonal sliders (Bishop / Queen)
        const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (let d = 0; d < 4; d++) {
            let nr = targetR + diagDirs[d][0];
            let nc = targetC + diagDirs[d][1];
            while (inBounds(nr, nc)) {
                const sq = b[nr][nc];
                if (sq) {
                    if (sq === attackerColor + 'B' || sq === attackerColor + 'Q') return true;
                    break;
                }
                nr += diagDirs[d][0];
                nc += diagDirs[d][1];
            }
        }

        return false;
    }

    function isInCheck(b, color) {
        const kingPos = findKing(b, color);
        if (!kingPos) return false;
        const enemy = color === 'w' ? 'b' : 'w';
        return isSquareAttacked(b, kingPos.r, kingPos.c, enemy);
    }

    function applyMoveToState(b, castle, ep, move) {
        const nb = cloneBoard(b);
        const nCastle = { ...castle };
        let nEp = null;

        const piece = nb[move.from.r][move.from.c];
        const color = piece[0];
        const type = piece[1];
        let captured = nb[move.to.r][move.to.c];

        // En Passant capture
        if (move.isEnPassant) {
            const capRow = color === 'w' ? move.to.r + 1 : move.to.r - 1;
            captured = nb[capRow][move.to.c];
            nb[capRow][move.to.c] = null;
        }

        // Move piece (or promote)
        nb[move.from.r][move.from.c] = null;
        nb[move.to.r][move.to.c] = move.promotion ? (color + move.promotion) : piece;

        // Castling rook movement
        if (move.isCastle === 'K') {
            nb[move.from.r][5] = nb[move.from.r][7];
            nb[move.from.r][7] = null;
        } else if (move.isCastle === 'Q') {
            nb[move.from.r][3] = nb[move.from.r][0];
            nb[move.from.r][0] = null;
        }

        // Double pawn push sets En Passant square
        if (type === 'P' && Math.abs(move.to.r - move.from.r) === 2) {
            nEp = { r: (move.from.r + move.to.r) / 2, c: move.from.c };
        }

        // Update castling rights
        if (piece === 'wK') { nCastle.wK = false; nCastle.wQ = false; }
        if (piece === 'bK') { nCastle.bK = false; nCastle.bQ = false; }
        if (move.from.r === 7 && move.from.c === 0) nCastle.wQ = false;
        if (move.from.r === 7 && move.from.c === 7) nCastle.wK = false;
        if (move.from.r === 0 && move.from.c === 0) nCastle.bQ = false;
        if (move.from.r === 0 && move.from.c === 7) nCastle.bK = false;
        if (move.to.r === 7 && move.to.c === 0) nCastle.wQ = false;
        if (move.to.r === 7 && move.to.c === 7) nCastle.wK = false;
        if (move.to.r === 0 && move.to.c === 0) nCastle.bQ = false;
        if (move.to.r === 0 && move.to.c === 7) nCastle.bK = false;

        return { board: nb, castling: nCastle, enPassant: nEp, captured };
    }

    function generateLegalMoves(b, activeColor, castle, ep) {
        const pseudo = [];
        const enemy = activeColor === 'w' ? 'b' : 'w';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = b[r][c];
                if (!p || p[0] !== activeColor) continue;
                const type = p[1];

                if (type === 'P') {
                    const dir = activeColor === 'w' ? -1 : 1;
                    const startRow = activeColor === 'w' ? 6 : 1;
                    const promoRow = activeColor === 'w' ? 0 : 7;

                    // 1 step forward
                    const r1 = r + dir;
                    if (inBounds(r1, c) && !b[r1][c]) {
                        if (r1 === promoRow) {
                            ['Q', 'R', 'B', 'N'].forEach(pr => {
                                pseudo.push({ from: { r, c }, to: { r: r1, c }, promotion: pr });
                            });
                        } else {
                            pseudo.push({ from: { r, c }, to: { r: r1, c } });
                            // 2 steps forward
                            const r2 = r + dir * 2;
                            if (r === startRow && !b[r2][c]) {
                                pseudo.push({ from: { r, c }, to: { r: r2, c } });
                            }
                        }
                    }

                    // Captures
                    [-1, 1].forEach(dc => {
                        const nc = c + dc;
                        if (!inBounds(r1, nc)) return;
                        const target = b[r1][nc];
                        if (target && target[0] === enemy) {
                            if (r1 === promoRow) {
                                ['Q', 'R', 'B', 'N'].forEach(pr => {
                                    pseudo.push({ from: { r, c }, to: { r: r1, c: nc }, promotion: pr, captured: target });
                                });
                            } else {
                                pseudo.push({ from: { r, c }, to: { r: r1, c: nc }, captured: target });
                            }
                        } else if (ep && ep.r === r1 && ep.c === nc) {
                            pseudo.push({ from: { r, c }, to: { r: r1, c: nc }, isEnPassant: true, captured: enemy + 'P' });
                        }
                    });
                } else if (type === 'N') {
                    const jumps = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
                    for (let i = 0; i < 8; i++) {
                        const nr = r + jumps[i][0];
                        const nc = c + jumps[i][1];
                        if (!inBounds(nr, nc)) continue;
                        const target = b[nr][nc];
                        if (!target || target[0] === enemy) {
                            pseudo.push({ from: { r, c }, to: { r: nr, c: nc }, captured: target || null });
                        }
                    }
                } else if (type === 'K') {
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            const nr = r + dr;
                            const nc = c + dc;
                            if (!inBounds(nr, nc)) continue;
                            const target = b[nr][nc];
                            if (!target || target[0] === enemy) {
                                pseudo.push({ from: { r, c }, to: { r: nr, c: nc }, captured: target || null });
                            }
                        }
                    }
                    // Castling
                    const homeRow = activeColor === 'w' ? 7 : 0;
                    if (r === homeRow && c === 4 && !isSquareAttacked(b, homeRow, 4, enemy)) {
                        const canK = activeColor === 'w' ? castle.wK : castle.bK;
                        const canQ = activeColor === 'w' ? castle.wQ : castle.bQ;
                        if (
                            canK &&
                            !b[homeRow][5] &&
                            !b[homeRow][6] &&
                            b[homeRow][7] === activeColor + 'R' &&
                            !isSquareAttacked(b, homeRow, 5, enemy) &&
                            !isSquareAttacked(b, homeRow, 6, enemy)
                        ) {
                            pseudo.push({ from: { r, c }, to: { r: homeRow, c: 6 }, isCastle: 'K' });
                        }
                        if (
                            canQ &&
                            !b[homeRow][3] &&
                            !b[homeRow][2] &&
                            !b[homeRow][1] &&
                            b[homeRow][0] === activeColor + 'R' &&
                            !isSquareAttacked(b, homeRow, 3, enemy) &&
                            !isSquareAttacked(b, homeRow, 2, enemy)
                        ) {
                            pseudo.push({ from: { r, c }, to: { r: homeRow, c: 2 }, isCastle: 'Q' });
                        }
                    }
                } else {
                    const dirs = [];
                    if (type === 'R' || type === 'Q') dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
                    if (type === 'B' || type === 'Q') dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);

                    for (let d = 0; d < dirs.length; d++) {
                        let nr = r + dirs[d][0];
                        let nc = c + dirs[d][1];
                        while (inBounds(nr, nc)) {
                            const target = b[nr][nc];
                            if (!target) {
                                pseudo.push({ from: { r, c }, to: { r: nr, c: nc } });
                            } else {
                                if (target[0] === enemy) {
                                    pseudo.push({ from: { r, c }, to: { r: nr, c: nc }, captured: target });
                                }
                                break;
                            }
                            nr += dirs[d][0];
                            nc += dirs[d][1];
                        }
                    }
                }
            }
        }

        // Filter out moves that leave own King in check
        const legal = [];
        for (let i = 0; i < pseudo.length; i++) {
            const m = pseudo[i];
            const next = applyMoveToState(b, castle, ep, m);
            if (!isInCheck(next.board, activeColor)) {
                legal.push(m);
            }
        }
        return legal;
    }

    // Format Standard Algebraic Notation (SAN)
    function toSan(b, castle, ep, move, allLegalMoves) {
        if (move.isCastle === 'K') return 'O-O';
        if (move.isCastle === 'Q') return 'O-O-O';

        const piece = b[move.from.r][move.from.c];
        const color = piece[0];
        const type = piece[1];
        const isCapture = Boolean(b[move.to.r][move.to.c] || move.isEnPassant);

        let san = '';
        if (type === 'P') {
            if (isCapture) san += FILES[move.from.c] + 'x';
            san += toCoord(move.to.r, move.to.c);
            if (move.promotion) san += '=' + move.promotion;
        } else {
            san += type;
            // Disambiguate if another same-type piece can reach same square
            const ambiguous = allLegalMoves.filter(
                m =>
                    (m.from.r !== move.from.r || m.from.c !== move.from.c) &&
                    m.to.r === move.to.r &&
                    m.to.c === move.to.c &&
                    b[m.from.r][m.from.c] === piece
            );
            if (ambiguous.length > 0) {
                const sameFile = ambiguous.some(m => m.from.c === move.from.c);
                const sameRank = ambiguous.some(m => m.from.r === move.from.r);
                if (!sameFile) {
                    san += FILES[move.from.c];
                } else if (!sameRank) {
                    san += (8 - move.from.r);
                } else {
                    san += toCoord(move.from.r, move.from.c);
                }
            }
            if (isCapture) san += 'x';
            san += toCoord(move.to.r, move.to.c);
        }

        // Check / Checkmate suffix
        const next = applyMoveToState(b, castle, ep, move);
        const enemy = color === 'w' ? 'b' : 'w';
        if (isInCheck(next.board, enemy)) {
            const enemyMoves = generateLegalMoves(next.board, enemy, next.castling, next.enPassant);
            san += enemyMoves.length === 0 ? '#' : '+';
        }
        return san;
    }

    function hasInsufficientMaterial(b) {
        const pieces = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = b[r][c];
                if (p && p[1] !== 'K') {
                    pieces.push({ p, r, c });
                }
            }
        }
        if (pieces.length === 0) return true; // K vs K
        if (pieces.length === 1 && (pieces[0].p[1] === 'N' || pieces[0].p[1] === 'B')) return true; // K+N vs K or K+B vs K
        if (
            pieces.length === 2 &&
            pieces[0].p[1] === 'B' &&
            pieces[1].p[1] === 'B' &&
            ((pieces[0].r + pieces[0].c) % 2 === (pieces[1].r + pieces[1].c) % 2)
        ) {
            return true; // Bishops on same color squares
        }
        return false;
    }

    // ==========================================
    // Position Evaluation & Alpha-Beta Search
    // ==========================================
    function evaluateBoard(b) {
        let score = 0;
        let whiteMinorMajor = 0;
        let blackMinorMajor = 0;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = b[r][c];
                if (!p) continue;
                const type = p[1];
                if (type !== 'P' && type !== 'K') {
                    if (p[0] === 'w') whiteMinorMajor += PIECE_VALUES[type];
                    else blackMinorMajor += PIECE_VALUES[type];
                }
            }
        }

        const isEndgame = whiteMinorMajor <= 1300 && blackMinorMajor <= 1300;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = b[r][c];
                if (!p) continue;
                const color = p[0];
                const type = p[1];
                const base = PIECE_VALUES[type];
                const table = (type === 'K' && isEndgame) ? PST.K_END : PST[type];
                const pstRow = color === 'w' ? r : (7 - r);
                const positional = table[pstRow][c];

                if (color === 'w') {
                    score += base + positional;
                } else {
                    score -= (base + positional);
                }
            }
        }
        return score; // Positive favors White, Negative favors Black
    }

    function scoreMoveForOrdering(b, m) {
        let s = 0;
        const attacker = b[m.from.r][m.from.c];
        const victim = b[m.to.r][m.to.c] || (m.isEnPassant ? 'wP' : null);
        if (victim) {
            s += 10 * PIECE_VALUES[victim[1]] - (PIECE_VALUES[attacker[1]] / 10);
        }
        if (m.promotion) {
            s += PIECE_VALUES[m.promotion];
        }
        if (m.isCastle) {
            s += 60;
        }
        return s;
    }

    function minimax(b, castle, ep, depth, alpha, beta, maximizingWhite) {
        const activeColor = maximizingWhite ? 'w' : 'b';
        const legal = generateLegalMoves(b, activeColor, castle, ep);

        if (legal.length === 0) {
            if (isInCheck(b, activeColor)) {
                return maximizingWhite ? (-19000 - depth * 20) : (19000 + depth * 20);
            }
            return 0; // Stalemate
        }

        if (depth === 0) {
            return evaluateBoard(b);
        }

        legal.sort((a, m2) => scoreMoveForOrdering(b, m2) - scoreMoveForOrdering(b, a));

        if (maximizingWhite) {
            let maxEval = -Infinity;
            for (let i = 0; i < legal.length; i++) {
                const next = applyMoveToState(b, castle, ep, legal[i]);
                const ev = minimax(next.board, next.castling, next.enPassant, depth - 1, alpha, beta, false);
                if (ev > maxEval) maxEval = ev;
                if (ev > alpha) alpha = ev;
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < legal.length; i++) {
                const next = applyMoveToState(b, castle, ep, legal[i]);
                const ev = minimax(next.board, next.castling, next.enPassant, depth - 1, alpha, beta, true);
                if (ev < minEval) minEval = ev;
                if (ev < beta) beta = ev;
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    function chooseBestMoveForColor(forColor, botProfile) {
        const legal = generateLegalMoves(board, forColor, castling, enPassant);
        if (legal.length === 0) return null;
        if (legal.length === 1) return legal[0];

        // 1. Check Opening Book for Extremely Hard / Hard / Medium bots in first 6 plies
        if (moveHistory.length <= 6 && botProfile.id !== 'easy') {
            const historyKey = moveHistory.map(m => m.uci).join(' ');
            const bookReplies = OPENING_BOOK[historyKey];
            if (bookReplies && bookReplies.length > 0) {
                const shuffled = bookReplies.slice().sort(() => Math.random() - 0.5);
                for (let i = 0; i < shuffled.length; i++) {
                    const parsed = fromUci(shuffled[i]);
                    const found = legal.find(
                        m =>
                            m.from.r === parsed.from.r &&
                            m.from.c === parsed.from.c &&
                            m.to.r === parsed.to.r &&
                            m.to.c === parsed.to.c
                    );
                    if (found) return found;
                }
            }
        }

        // 2. Occasional rookie blunder for Cadet Pip / slight imperfection for lower bots
        if (botProfile.blunderChance > 0 && Math.random() < botProfile.blunderChance) {
            const nonQueenPromosFiltered = legal.filter(m => !m.promotion || m.promotion === 'Q');
            return nonQueenPromosFiltered[Math.floor(Math.random() * nonQueenPromosFiltered.length)];
        }

        const maximizing = forColor === 'w';
        legal.sort((a, m2) => scoreMoveForOrdering(board, m2) - scoreMoveForOrdering(board, a));

        let bestMove = legal[0];
        let bestScore = maximizing ? -Infinity : Infinity;
        const depth = botProfile.depth;

        for (let i = 0; i < legal.length; i++) {
            const m = legal[i];
            if (m.promotion && m.promotion !== 'Q') continue; // Prefer Queen promotions in search

            const next = applyMoveToState(board, castling, enPassant, m);
            let score = minimax(next.board, next.castling, next.enPassant, depth - 1, -Infinity, Infinity, !maximizing);

            // Add controlled human-like variance for lower/medium bots
            if (botProfile.randomSpread > 0) {
                score += (Math.random() * 2 - 1) * botProfile.randomSpread;
            }

            if (maximizing) {
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = m;
                }
            } else {
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = m;
                }
            }
        }

        return bestMove;
    }

    // ==========================================
    // Bot Dialogue & Expression Helper
    // ==========================================
    function setBotSpeech(text, curiousExpression = false) {
        if (botDialogueText) {
            botDialogueText.textContent = `"${text}"`;
        }
        const bot = BOTS[currentBotKey];
        if (bot && bot.avatarType === 'image' && botAvatarContainer) {
            const img = botAvatarContainer.querySelector('img');
            if (img) {
                img.src = curiousExpression ? bot.avatarCurious : bot.avatarHappy;
            }
        }
    }

    function updateBotHeaderUI() {
        const bot = BOTS[currentBotKey];
        if (!bot) return;

        if (botNameEl) botNameEl.textContent = bot.name;
        if (botMetaEl) botMetaEl.textContent = `${bot.title} • ELO ${bot.elo}`;

        if (botAvatarContainer) {
            if (bot.avatarType === 'image') {
                botAvatarContainer.innerHTML = `<img src="${bot.avatarHappy}" alt="${bot.name}" class="bot-portrait-img">`;
            } else {
                botAvatarContainer.innerHTML = `<span class="bot-portrait-emoji" aria-hidden="true">${bot.avatar}</span>`;
            }
        }

        botCards.forEach(card => {
            card.classList.toggle('is-selected', card.getAttribute('data-bot') === currentBotKey);
        });

        updatePlayerBarsUI();
    }

    function updatePlayerBarsUI() {
        const bot = BOTS[currentBotKey];
        const botIsTop = (playerColor === 'w' && !boardFlipped) || (playerColor === 'b' && boardFlipped);

        if (botIsTop) {
            if (topPlayerName) topPlayerName.textContent = `${bot.name} (${bot.elo})`;
            if (topPlayerBadge) topPlayerBadge.textContent = bot.badge;
            if (bottomPlayerName) bottomPlayerName.textContent = 'Detective (You)';
            if (bottomPlayerBadge) bottomPlayerBadge.textContent = playerColor === 'w' ? 'PLAYING WHITE' : 'PLAYING BLACK';
        } else {
            if (bottomPlayerName) bottomPlayerName.textContent = `${bot.name} (${bot.elo})`;
            if (bottomPlayerBadge) bottomPlayerBadge.textContent = bot.badge;
            if (topPlayerName) topPlayerName.textContent = 'Detective (You)';
            if (topPlayerBadge) topPlayerBadge.textContent = playerColor === 'w' ? 'PLAYING WHITE' : 'PLAYING BLACK';
        }
    }

    // ==========================================
    // Captured Pieces, Material & Eval Bar
    // ==========================================
    function updateMaterialAndEvalUI() {
        const startCounts = { wP: 8, wN: 2, wB: 2, wR: 2, wQ: 1, bP: 8, bN: 2, bB: 2, bR: 2, bQ: 1 };
        const currentCounts = { wP: 0, wN: 0, wB: 0, wR: 0, wQ: 0, bP: 0, bN: 0, bB: 0, bR: 0, bQ: 0 };

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p && currentCounts[p] !== undefined) {
                    currentCounts[p]++;
                }
            }
        }

        // Pieces captured BY White (missing Black pieces)
        const capturedByWhite = [];
        ['bQ', 'bR', 'bB', 'bN', 'bP'].forEach(code => {
            const missing = Math.max(0, startCounts[code] - currentCounts[code]);
            for (let i = 0; i < missing; i++) capturedByWhite.push(UNICODE_PIECES[code]);
        });

        // Pieces captured BY Black (missing White pieces)
        const capturedByBlack = [];
        ['wQ', 'wR', 'wB', 'wN', 'wP'].forEach(code => {
            const missing = Math.max(0, startCounts[code] - currentCounts[code]);
            for (let i = 0; i < missing; i++) capturedByBlack.push(UNICODE_PIECES[code]);
        });

        const whiteMat =
            currentCounts.wP * 1 +
            currentCounts.wN * 3 +
            currentCounts.wB * 3 +
            currentCounts.wR * 5 +
            currentCounts.wQ * 9;
        const blackMat =
            currentCounts.bP * 1 +
            currentCounts.bN * 3 +
            currentCounts.bB * 3 +
            currentCounts.bR * 5 +
            currentCounts.bQ * 9;
        const diff = whiteMat - blackMat;

        const whiteOnBottom = !boardFlipped;
        if (whiteOnBottom) {
            if (bottomCapturedEl) bottomCapturedEl.textContent = capturedByWhite.join(' ');
            if (topCapturedEl) topCapturedEl.textContent = capturedByBlack.join(' ');
            if (bottomMaterialAdvEl) bottomMaterialAdvEl.textContent = diff > 0 ? `+${diff}` : '';
            if (topMaterialAdvEl) topMaterialAdvEl.textContent = diff < 0 ? `+${Math.abs(diff)}` : '';
        } else {
            if (topCapturedEl) topCapturedEl.textContent = capturedByWhite.join(' ');
            if (bottomCapturedEl) bottomCapturedEl.textContent = capturedByBlack.join(' ');
            if (topMaterialAdvEl) topMaterialAdvEl.textContent = diff > 0 ? `+${diff}` : '';
            if (bottomMaterialAdvEl) bottomMaterialAdvEl.textContent = diff < 0 ? `+${Math.abs(diff)}` : '';
        }

        // Evaluation Bar
        const rawScore = evaluateBoard(board) / 100; // in pawns
        const clampedPawns = Math.max(-10, Math.min(10, rawScore));
        const whitePercent = 50 + (clampedPawns / 10) * 45;
        if (evalFillEl) {
            evalFillEl.style.height = `${whitePercent}%`;
        }
        if (evalScoreEl) {
            const formatted = (rawScore >= 0 ? '+' : '') + rawScore.toFixed(1);
            evalScoreEl.textContent = formatted;
        }
    }

    function updateMoveLogUI() {
        if (!moveListEl) return;
        moveListEl.innerHTML = '';

        if (moveHistory.length === 0) {
            moveListEl.innerHTML = `<div class="move-log-empty">No moves recorded yet. Make your opening deduction on the board!</div>`;
            return;
        }

        for (let i = 0; i < moveHistory.length; i += 2) {
            const moveNum = Math.floor(i / 2) + 1;
            const whiteMove = moveHistory[i];
            const blackMove = moveHistory[i + 1];

            const row = document.createElement('div');
            row.className = 'move-log-row';
            row.innerHTML = `
                <span class="move-num">${moveNum}.</span>
                <span class="move-san ${i === moveHistory.length - 1 ? 'latest' : ''}">${whiteMove.san}</span>
                <span class="move-san ${i + 1 === moveHistory.length - 1 ? 'latest' : ''}">${blackMove ? blackMove.san : ''}</span>
            `;
            moveListEl.appendChild(row);
        }
        moveListEl.scrollTop = moveListEl.scrollHeight;
    }

    // ==========================================
    // Render Board DOM
    // ==========================================
    function renderBoard() {
        boardEl.innerHTML = '';
        const kingInCheckPos = isInCheck(board, turn) ? findKing(board, turn) : null;

        for (let viewR = 0; viewR < 8; viewR++) {
            for (let viewC = 0; viewC < 8; viewC++) {
                const r = boardFlipped ? (7 - viewR) : viewR;
                const c = boardFlipped ? (7 - viewC) : viewC;

                const sq = document.createElement('div');
                const isLight = (r + c) % 2 === 0;
                sq.className = `chess-square ${isLight ? 'sq-light' : 'sq-dark'}`;
                sq.dataset.r = String(r);
                sq.dataset.c = String(c);

                // Coordinate labels on edges
                if (viewC === 0) {
                    const rankSpan = document.createElement('span');
                    rankSpan.className = 'sq-coord sq-coord-rank';
                    rankSpan.textContent = String(8 - r);
                    sq.appendChild(rankSpan);
                }
                if (viewR === 7) {
                    const fileSpan = document.createElement('span');
                    fileSpan.className = 'sq-coord sq-coord-file';
                    fileSpan.textContent = FILES[c];
                    sq.appendChild(fileSpan);
                }

                // Highlights
                if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                    sq.classList.add('sq-selected');
                }
                if (lastMove && ((lastMove.from.r === r && lastMove.from.c === c) || (lastMove.to.r === r && lastMove.to.c === c))) {
                    sq.classList.add('sq-last-move');
                }
                if (hintMove && ((hintMove.from.r === r && hintMove.from.c === c) || (hintMove.to.r === r && hintMove.to.c === c))) {
                    sq.classList.add('sq-hint');
                }
                if (kingInCheckPos && kingInCheckPos.r === r && kingInCheckPos.c === c) {
                    sq.classList.add('sq-in-check');
                }

                // Legal move target indicators
                const legalTarget = legalMovesFromSelected.find(m => m.to.r === r && m.to.c === c);
                if (legalTarget) {
                    const isCapture = Boolean(board[r][c] || legalTarget.isEnPassant);
                    sq.classList.add(isCapture ? 'sq-legal-capture' : 'sq-legal-move');
                }

                // Render piece
                const pieceCode = board[r][c];
                if (pieceCode && PIECE_SVGS[pieceCode]) {
                    const pieceWrap = document.createElement('div');
                    pieceWrap.className = 'chess-piece';
                    pieceWrap.innerHTML = PIECE_SVGS[pieceCode];

                    const canInteract = !isGameOver && !isBotThinking && turn === playerColor && pieceCode[0] === playerColor;
                    if (canInteract) {
                        pieceWrap.draggable = true;
                        pieceWrap.addEventListener('dragstart', (e) => {
                            dragSourceSquare = { r, c };
                            selectSquare(r, c);
                            if (e.dataTransfer) {
                                e.dataTransfer.setData('text/plain', `${r},${c}`);
                            }
                        });
                    }
                    sq.appendChild(pieceWrap);
                }

                // Click & Drop handlers
                sq.addEventListener('click', () => handleSquareClick(r, c));
                sq.addEventListener('dragover', (e) => e.preventDefault());
                sq.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (dragSourceSquare) {
                        handleSquareClick(r, c);
                        dragSourceSquare = null;
                    }
                });

                boardEl.appendChild(sq);
            }
        }
    }

    // ==========================================
    // Player Interaction & Move Execution
    // ==========================================
    function selectSquare(r, c) {
        selectedSquare = { r, c };
        const allLegal = generateLegalMoves(board, turn, castling, enPassant);
        legalMovesFromSelected = allLegal.filter(m => m.from.r === r && m.from.c === c);
        renderBoard();
    }

    function clearSelection() {
        selectedSquare = null;
        legalMovesFromSelected = [];
    }

    function handleSquareClick(r, c) {
        if (isGameOver || isBotThinking || turn !== playerColor) return;

        // Check if clicking a legal destination square for the currently selected piece
        const candidateMoves = legalMovesFromSelected.filter(m => m.to.r === r && m.to.c === c);
        if (candidateMoves.length > 0) {
            if (candidateMoves[0].promotion) {
                openPromotionModal(candidateMoves);
            } else {
                executeMove(candidateMoves[0]);
            }
            return;
        }

        // Otherwise, if clicking own piece, select it
        const clickedPiece = board[r][c];
        if (clickedPiece && clickedPiece[0] === playerColor) {
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                clearSelection();
                renderBoard();
            } else {
                selectSquare(r, c);
            }
        } else {
            clearSelection();
            renderBoard();
        }
    }

    function openPromotionModal(promoMoves) {
        if (!promotionModal || !promotionChoices) {
            executeMove(promoMoves[0]);
            return;
        }
        pendingPromotionMove = promoMoves;
        promotionChoices.innerHTML = '';

        ['Q', 'R', 'B', 'N'].forEach(type => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'promo-piece-btn';
            btn.innerHTML = PIECE_SVGS[playerColor + type];
            btn.title = `Promote to ${type}`;
            btn.addEventListener('click', () => {
                const chosen = promoMoves.find(m => m.promotion === type) || promoMoves[0];
                promotionModal.hidden = true;
                pendingPromotionMove = null;
                executeMove(chosen);
            });
            promotionChoices.appendChild(btn);
        });

        promotionModal.hidden = false;
    }

    function executeMove(move) {
        // Save state snapshot for Undo
        stateHistory.push({
            board: cloneBoard(board),
            turn,
            castling: { ...castling },
            enPassant: enPassant ? { ...enPassant } : null,
            halfMoveClock,
            fullMoveNumber,
            lastMove: lastMove ? { from: { ...lastMove.from }, to: { ...lastMove.to } } : null,
            moveHistory: moveHistory.map(m => ({ ...m })),
            positionCounts: { ...positionCounts }
        });

        const allLegal = generateLegalMoves(board, turn, castling, enPassant);
        const san = toSan(board, castling, enPassant, move, allLegal);
        const uci = toCoord(move.from.r, move.from.c) + toCoord(move.to.r, move.to.c) + (move.promotion ? move.promotion.toLowerCase() : '');
        const movingPiece = board[move.from.r][move.from.c];

        const next = applyMoveToState(board, castling, enPassant, move);
        board = next.board;
        castling = next.castling;
        enPassant = next.enPassant;

        if (movingPiece[1] === 'P' || next.captured) {
            halfMoveClock = 0;
        } else {
            halfMoveClock++;
        }

        if (turn === 'b') {
            fullMoveNumber++;
        }

        moveHistory.push({
            san,
            uci,
            color: turn,
            piece: movingPiece,
            captured: next.captured
        });

        lastMove = { from: { ...move.from }, to: { ...move.to } };
        hintMove = null;
        clearSelection();

        const moverWasPlayer = turn === playerColor;
        turn = turn === 'w' ? 'b' : 'w';

        const posKey = getPositionKey(board, turn, castling, enPassant);
        positionCounts[posKey] = (positionCounts[posKey] || 0) + 1;

        // Audio & Banter
        const nowInCheck = isInCheck(board, turn);
        if (nowInCheck) {
            playChessSfx('check');
        } else if (next.captured) {
            playChessSfx('capture');
        } else {
            playChessSfx('move');
        }

        updateMaterialAndEvalUI();
        updateMoveLogUI();
        renderBoard();

        // Check game termination
        if (checkAndHandleGameEnd(moverWasPlayer, Boolean(next.captured), nowInCheck)) {
            return;
        }

        // Trigger Bot turn if it is now the bot's move
        if (turn !== playerColor) {
            triggerBotMove();
        }
    }

    function checkAndHandleGameEnd(moverWasPlayer, wasCapture, nowInCheck) {
        const bot = BOTS[currentBotKey];
        const legal = generateLegalMoves(board, turn, castling, enPassant);

        if (legal.length === 0) {
            isGameOver = true;
            isBotThinking = false;
            if (botStatusPill) {
                botStatusPill.textContent = 'CASE CLOSED';
                botStatusPill.classList.remove('is-thinking');
            }
            playChessSfx('gameover');

            if (nowInCheck) {
                const playerWon = moverWasPlayer;
                if (playerWon) {
                    setBotSpeech(bot.lines.loss, true);
                    updateStatusBanner(`Checkmate! Detective wins the case against ${bot.name}!`, 'win');
                    showResultModal('CASE SOLVED', 'Victory by Checkmate!', `You outmaneuvered ${bot.name} in ${moveHistory.length} plies.`);
                } else {
                    setBotSpeech(bot.lines.win, false);
                    updateStatusBanner(`Checkmate! ${bot.name} wins the match.`, 'loss');
                    showResultModal('COLD CASE', `Defeated by ${bot.name}`, `${bot.name} delivered checkmate. Inspect the board or start a rematch!`);
                }
            } else {
                setBotSpeech(bot.lines.draw, true);
                updateStatusBanner('Draw by Stalemate — No legal moves remain.', 'draw');
                showResultModal('DEADLOCKED', 'Draw by Stalemate', 'Neither side could break through the final defense.');
            }
            return true;
        }

        const posKey = getPositionKey(board, turn, castling, enPassant);
        if (positionCounts[posKey] >= 3) {
            isGameOver = true;
            playChessSfx('gameover');
            setBotSpeech(bot.lines.draw, true);
            updateStatusBanner('Draw by Threefold Repetition.', 'draw');
            showResultModal('DEADLOCKED', 'Draw by Repetition', 'The exact same board position was repeated three times.');
            return true;
        }

        if (halfMoveClock >= 100) {
            isGameOver = true;
            playChessSfx('gameover');
            setBotSpeech(bot.lines.draw, true);
            updateStatusBanner('Draw by 50-Move Rule.', 'draw');
            showResultModal('DEADLOCKED', 'Draw by 50-Move Rule', 'Fifty consecutive moves occurred without a pawn advance or capture.');
            return true;
        }

        if (hasInsufficientMaterial(board)) {
            isGameOver = true;
            playChessSfx('gameover');
            setBotSpeech(bot.lines.draw, true);
            updateStatusBanner('Draw by Insufficient Material.', 'draw');
            showResultModal('DEADLOCKED', 'Insufficient Material', 'Neither player has enough pieces remaining to force checkmate.');
            return true;
        }

        // Ongoing game banter updates
        if (nowInCheck) {
            if (moverWasPlayer) {
                setBotSpeech(bot.lines.inCheck, true);
                updateStatusBanner(`${bot.name}'s King is in Check!`, 'check');
            } else {
                setBotSpeech(bot.lines.check, false);
                updateStatusBanner('Warning: Your King is in Check! Defend your King.', 'check');
            }
        } else if (wasCapture) {
            if (moverWasPlayer) {
                setBotSpeech(bot.lines.playerCapture, true);
            } else {
                setBotSpeech(bot.lines.botCapture, false);
            }
            updateStatusBanner(turn === playerColor ? 'Your turn to move, Detective.' : `${bot.name} is analyzing the board...`, 'normal');
        } else {
            updateStatusBanner(turn === playerColor ? 'Your turn to move, Detective.' : `${bot.name} is analyzing the board...`, 'normal');
        }

        return false;
    }

    function triggerBotMove() {
        if (isGameOver || turn === playerColor) return;
        isBotThinking = true;
        const bot = BOTS[currentBotKey];

        if (botStatusPill) {
            botStatusPill.textContent = 'DEDUCTING...';
            botStatusPill.classList.add('is-thinking');
        }

        const delay = 360 + Math.floor(Math.random() * 280);
        if (botTimer) clearTimeout(botTimer);

        botTimer = setTimeout(() => {
            if (isGameOver) return;
            const chosen = chooseBestMoveForColor(turn, bot);
            isBotThinking = false;
            if (botStatusPill) {
                botStatusPill.textContent = 'YOUR TURN';
                botStatusPill.classList.remove('is-thinking');
            }
            if (chosen) {
                executeMove(chosen);
            }
        }, delay);
    }

    // ==========================================
    // Status Banner & Result Modal
    // ==========================================
    function updateStatusBanner(text, stateClass = 'normal') {
        if (!gameStatusBanner) return;
        gameStatusBanner.textContent = text;
        gameStatusBanner.className = `chess-status-banner status-${stateClass}`;
    }

    function showResultModal(stamp, title, desc) {
        if (!resultModal) return;
        if (resultStamp) resultStamp.textContent = stamp;
        if (resultTitle) resultTitle.textContent = title;
        if (resultDesc) resultDesc.textContent = desc;
        resultModal.hidden = false;
    }

    // ==========================================
    // Game Control Actions (New Game, Undo, Hint, Flip, Resign)
    // ==========================================
    function startNewGame() {
        if (botTimer) clearTimeout(botTimer);
        isBotThinking = false;
        isGameOver = false;
        pendingPromotionMove = null;
        if (promotionModal) promotionModal.hidden = true;
        if (resultModal) resultModal.hidden = true;

        board = createInitialBoard();
        turn = 'w';
        castling = { wK: true, wQ: true, bK: true, bQ: true };
        enPassant = null;
        halfMoveClock = 0;
        fullMoveNumber = 1;
        stateHistory = [];
        moveHistory = [];
        positionCounts = {};
        lastMove = null;
        hintMove = null;
        clearSelection();

        boardFlipped = (playerColor === 'b');
        const initialKey = getPositionKey(board, turn, castling, enPassant);
        positionCounts[initialKey] = 1;

        const bot = BOTS[currentBotKey];
        updateBotHeaderUI();
        setBotSpeech(bot.lines.greeting, false);
        updateMaterialAndEvalUI();
        updateMoveLogUI();
        renderBoard();

        if (botStatusPill) {
            botStatusPill.textContent = playerColor === 'w' ? 'YOUR TURN' : 'BOT OPENS';
            botStatusPill.classList.remove('is-thinking');
        }

        if (playerColor === 'w') {
            updateStatusBanner(`Case opened vs. ${bot.name}. Make your opening move as White!`, 'normal');
        } else {
            updateStatusBanner(`Case opened vs. ${bot.name}. Awaiting ${bot.name}'s opening move...`, 'normal');
            triggerBotMove();
        }
    }

    function undoLastTurn() {
        if (isBotThinking || stateHistory.length === 0) return;
        if (resultModal) resultModal.hidden = true;
        isGameOver = false;

        // Pop states until it's the player's turn again (usually 2 plies, or 1 if bot hasn't moved yet)
        let targetState = stateHistory.pop();
        if (targetState && targetState.turn !== playerColor && stateHistory.length > 0) {
            targetState = stateHistory.pop();
        }

        if (!targetState) return;

        board = cloneBoard(targetState.board);
        turn = targetState.turn;
        castling = { ...targetState.castling };
        enPassant = targetState.enPassant ? { ...targetState.enPassant } : null;
        halfMoveClock = targetState.halfMoveClock;
        fullMoveNumber = targetState.fullMoveNumber;
        lastMove = targetState.lastMove;
        moveHistory = targetState.moveHistory.map(m => ({ ...m }));
        positionCounts = { ...targetState.positionCounts };
        hintMove = null;
        clearSelection();

        playChessSfx('move');
        updateMaterialAndEvalUI();
        updateMoveLogUI();
        renderBoard();
        updateStatusBanner('Move retracted. Re-examine the position, Detective!', 'normal');
    }

    function requestClueHint() {
        if (isGameOver || isBotThinking || turn !== playerColor) return;
        // Use Hard depth-3 tactical search to give the player a reliable clue
        const best = chooseBestMoveForColor(playerColor, BOTS.hard);
        if (!best) return;

        hintMove = { from: { ...best.from }, to: { ...best.to } };
        selectSquare(best.from.r, best.from.c);

        const bot = BOTS[currentBotKey];
        setBotSpeech(bot.lines.hint, true);
        const coordText = `${toCoord(best.from.r, best.from.c).toUpperCase()} → ${toCoord(best.to.r, best.to.c).toUpperCase()}`;
        updateStatusBanner(`Detective Clue: Consider moving ${coordText}`, 'check');
    }

    function flipBoardOrientation() {
        boardFlipped = !boardFlipped;
        updatePlayerBarsUI();
        updateMaterialAndEvalUI();
        renderBoard();
    }

    function resignMatch() {
        if (isGameOver || moveHistory.length === 0) return;
        if (botTimer) clearTimeout(botTimer);
        isBotThinking = false;
        isGameOver = true;

        const bot = BOTS[currentBotKey];
        playChessSfx('gameover');
        setBotSpeech(bot.lines.win, false);
        updateStatusBanner(`You resigned the case. ${bot.name} claims victory.`, 'loss');
        showResultModal('CASE CLOSED', 'Match Resigned', `You conceded the game to ${bot.name}. Ready to set up the pieces for another round?`);
    }

    // ==========================================
    // Wire Up Event Listeners
    // ==========================================
    botCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-bot');
            if (!key || !BOTS[key]) return;
            currentBotKey = key;
            startNewGame();
        });
    });

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.getAttribute('data-color');
            colorBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            if (choice === 'random') {
                playerColor = Math.random() < 0.5 ? 'w' : 'b';
            } else {
                playerColor = choice === 'b' ? 'b' : 'w';
            }
            startNewGame();
        });
    });

    if (newGameBtn) newGameBtn.addEventListener('click', startNewGame);
    if (undoBtn) undoBtn.addEventListener('click', undoLastTurn);
    if (hintBtn) hintBtn.addEventListener('click', requestClueHint);
    if (flipBtn) flipBtn.addEventListener('click', flipBoardOrientation);
    if (resignBtn) resignBtn.addEventListener('click', resignMatch);

    if (resultRematchBtn) {
        resultRematchBtn.addEventListener('click', () => {
            if (resultModal) resultModal.hidden = true;
            startNewGame();
        });
    }
    if (resultCloseBtn) {
        resultCloseBtn.addEventListener('click', () => {
            if (resultModal) resultModal.hidden = true;
        });
    }

    // Initialize first game on load
    startNewGame();
})();

