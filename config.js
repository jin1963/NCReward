"use strict";

/* =========================
   NETWORK
========================= */

const APP_CONFIG = {
  APP_NAME: "NC Reward",

  CHAIN_ID: 56,
  CHAIN_ID_HEX: "0x38",
  CHAIN_NAME: "BNB Smart Chain",

  RPC_URLS: [
    "https://bsc-dataseed.binance.org/",
    "https://bsc-dataseed1.defibit.io/",
    "https://bsc-dataseed1.ninicoin.io/"
  ],

  BLOCK_EXPLORER: "https://bscscan.com",

  NATIVE_CURRENCY: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
  },

  TOKEN_DECIMALS: 18,

  REFRESH_INTERVAL_MS: 3000,
  STAKE_PAGE_SIZE: 5,
  HISTORY_PAGE_SIZE: 10
};


/* =========================
   CONTRACT ADDRESSES
========================= */

const CONTRACTS = {
  NC_TOKEN:
    "0xA0db9B043EA0387BA0f7480189F0392EdAA72108",

  LEGACY_CORE:
    "0xAE2523dE8eD5EcE8e160EDEB157CAc108F9E163e",

  REWARD_CORE:
    "0x1e60dE14dD2FE30082124bCf44637c1C91ea548F",

  REWARD_VAULT:
    "0x56572E98F8992634bA20680222E9788Df7B55A61",

  REWARD_STAKING:
    "0x9c441A269526B57A9a2C98e31f64CEB485b8886b"
};


/* =========================
   DEFAULT DISPLAY VALUES
========================= */

const DEFAULTS = {
  CLAIM_STEP_NC: 20000,
  ORGANIZATION_TARGET_NC: 20000,
  REWARD_BPS: 10000,
  LOCK_DAYS: 365,
  REQUIRED_RANK: 3
};


/* =========================
   RANK NAMES
========================= */

const RANK_NAMES = {
  0: "None",
  1: "Bronze",
  2: "Silver",
  3: "Gold"
};


/* =========================
   GLOBAL EXPORT
========================= */

window.APP_CONFIG = APP_CONFIG;
window.CONTRACTS = CONTRACTS;
window.DEFAULTS = DEFAULTS;
window.RANK_NAMES = RANK_NAMES;
