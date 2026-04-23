/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           TRADEFLOW PRO — INSTITUTIONAL ASSETS               ║
 * ╚══════════════════════════════════════════════════════════════╝
 * High-quality SVG assets for a "Royal/Finance" trading platform.
 */

export const TRADEFLOW_ASSETS = {
  
  // ── ROYAL LOGO (Gold & Geometric) ──
  LOGO_SVG: `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5L15 25V75L50 95L85 75V25L50 5Z" stroke="#ffd700" stroke-width="2" />
      <path d="M50 15L25 30V70L50 85L75 70V30L50 15Z" fill="url(#goldGradient)" />
      <path d="M40 45L50 35L60 45M40 55L50 65L60 55" stroke="#0a0a2a" stroke-width="4" stroke-linecap="round" />
      <defs>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stop-color="#ffd700" />
          <stop offset="50%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  `,

  // ── PROFIT BADGE ──
  PROFIT_ICON: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#00ff88" fill-opacity="0.1" />
      <path d="M16 10L12 6L8 10M16 18L12 14L8 18" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,

  // ── LOSS BADGE ──
  LOSS_ICON: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#ff4444" fill-opacity="0.1" />
      <path d="M8 14L12 18L16 14M8 6L12 10L16 6" stroke="#ff4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,

  // ── GOLD WALLET ICON ──
  WALLET_GOLD: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 7V4C19 3.44772 18.5523 3 18 3H4C3.44772 3 3 3.44772 3 4V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="#ffd700" stroke-width="2" />
      <circle cx="17" cy="13.5" r="1.5" fill="#ffd700" />
    </svg>
  `,

  // ── TUTORIAL 1: Trade Logging (Journal) ──
  TUTORIAL_LOG: `
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" rx="20" fill="#16213e" />
      <rect x="50" y="40" width="300" height="220" rx="12" fill="#0a0a2a" stroke="#ffd700" stroke-opacity="0.2" />
      <path d="M70 70H330M70 110H330M70 150H200" stroke="#ffd700" stroke-width="2" stroke-linecap="round" />
      <circle cx="280" cy="190" r="40" fill="#ffd700" fill-opacity="0.1" />
      <path d="M280 170V210M260 190H300" stroke="#ffd700" stroke-width="3" stroke-linecap="round" />
    </svg>
  `,

  // ── TUTORIAL 2: Risk Management (Shield) ──
  TUTORIAL_RISK: `
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" rx="20" fill="#16213e" />
      <path d="M200 60C200 60 280 90 280 150C280 210 200 240 200 240C200 240 120 210 120 150C120 90 200 60 200 60Z" fill="#ff4444" fill-opacity="0.1" stroke="#ff4444" stroke-width="2" />
      <path d="M170 150L190 170L230 130" stroke="#ff4444" stroke-width="4" stroke-linecap="round" />
    </svg>
  `,

  // ── TUTORIAL 3: Analytics (Chart) ──
  TUTORIAL_GROWTH: `
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" rx="20" fill="#16213e" />
      <path d="M50 250L120 180L180 210L260 100L350 40" stroke="#00ff88" stroke-width="4" stroke-linecap="round" filter="blur(1px)"/>
      <circle cx="350" cy="40" r="10" fill="#00ff88" />
    </svg>
  `
};
