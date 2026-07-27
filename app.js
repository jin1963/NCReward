"use strict";

/* =========================================================
   NC REWARD DAPP — APP.JS
   Generic Wallet Provider Version

   ใช้ร่วมกับ:
   - ethers.js v6
   - config.js
   - abi.js
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let provider = null;
let signer = null;
let userAddress = null;

let ncToken = null;
let rewardCore = null;
let rewardStaking = null;

let countdownTimer = null;
let isRefreshing = false;


/* =========================================================
   ELEMENT HELPERS
========================================================= */

function findElement(...ids) {
  for (const id of ids) {
    const element = document.getElementById(id);

    if (element) {
      return element;
    }
  }

  return null;
}

function setText(ids, value) {
  const element = findElement(...ids);

  if (element) {
    element.textContent = value;
  }
}

function setDisabled(ids, disabled) {
  const element = findElement(...ids);

  if (element) {
    element.disabled = disabled;
  }
}


/* =========================================================
   WALLET STATUS UI
========================================================= */

function findWalletStatusElement() {
  const elementById = findElement(
    "walletStatus",
    "walletStatusText",
    "connectionStatus",
    "walletConnectionStatus",
    "connectStatus"
  );

  if (elementById) {
    return elementById;
  }

  const elementBySelector = document.querySelector(
    "[data-wallet-status], .wallet-status-value"
  );

  if (elementBySelector) {
    return elementBySelector;
  }

  const possibleElements = document.querySelectorAll(
    "span, strong, b, div"
  );

  for (const element of possibleElements) {
    if (element.children.length > 0) {
      continue;
    }

    const text = element.textContent.trim();

    if (
      text === "Not Connected" ||
      text === "Connected"
    ) {
      return element;
    }
  }

  return null;
}

function updateWalletConnectionUI(connected) {
  const walletStatus = findWalletStatusElement();

  if (walletStatus) {
    walletStatus.textContent = connected
      ? "Connected"
      : "Not Connected";

    walletStatus.classList.toggle(
      "connected",
      connected
    );

    walletStatus.classList.toggle(
      "disconnected",
      !connected
    );

    walletStatus.style.color = connected
      ? "#22c55e"
      : "#ff5c6c";
  }

  const connectWalletText = findElement(
    "connectWalletText"
  );

  if (connectWalletText) {
    connectWalletText.textContent =
      connected && userAddress
        ? shortAddress(userAddress)
        : "Connect Wallet";
  }
}

function resetWalletUI() {
  setText(
    [
      "walletAddress",
      "connectedWallet",
      "walletText"
    ],
    "-"
  );

  setText(
    [
      "networkName",
      "networkStatus"
    ],
    "-"
  );

  setText(
    [
      "ncBalance",
      "walletNCBalance"
    ],
    "0 NC"
  );

  setText(
    [
      "personalVolume",
      "personalRewardVolume"
    ],
    "0 NC"
  );

  setText(
    [
      "organizationVolume",
      "orgVolume"
    ],
    "0 NC"
  );

  setText(
    [
      "totalRewardEarned",
      "rewardEarned"
    ],
    "0 NC"
  );

  setText(
    [
      "totalRewardStaked",
      "rewardStaked"
    ],
    "0 NC"
  );

  setText(
    [
      "pendingReward",
      "rewardPending"
    ],
    "0 NC"
  );

  setText(
    [
      "claimableReward",
      "claimableAmount"
    ],
    "0 NC"
  );

  setText(
    [
      "remainingReward",
      "remainingAfterClaim"
    ],
    "0 NC"
  );

  setText(
    [
      "currentRank",
      "rank"
    ],
    "-"
  );

  setText(
    [
      "goldStatus",
      "goldQualified"
    ],
    "-"
  );

  setText(
    [
      "organizationStatus",
      "orgQualified"
    ],
    "-"
  );

  setText(
    [
      "totalLots",
      "stakeTotalLots"
    ],
    "0"
  );

  setText(
    [
      "activeLots",
      "stakeActiveLots"
    ],
    "0"
  );

  setText(
    [
      "withdrawnLots",
      "stakeWithdrawnLots"
    ],
    "0"
  );

  setText(
    [
      "activePrincipal",
      "stakeActivePrincipal"
    ],
    "0 NC"
  );

  setText(
    [
      "maturedPrincipal",
      "stakeMaturedPrincipal"
    ],
    "0 NC"
  );

  setText(
    [
      "withdrawableAmount",
      "stakeWithdrawable"
    ],
    "0 NC"
  );

  const claimButton = findElement(
    "claimBtn",
    "btnClaim",
    "claimAndStakeBtn"
  );

  if (claimButton) {
    claimButton.disabled = true;
    claimButton.textContent =
      "ยังไม่สามารถ Claim ได้";
  }

  const withdrawButton = findElement(
    "withdrawMaturedBtn",
    "btnWithdrawMatured"
  );

  if (withdrawButton) {
    withdrawButton.disabled = true;
  }

  const stakeLotsContainer = findElement(
    "stakeLots",
    "stakeLotsList",
    "lotsContainer"
  );

  if (stakeLotsContainer) {
    stakeLotsContainer.innerHTML = `
      <div class="empty-state">
        กรุณาเชื่อมกระเป๋า
      </div>
    `;
  }

  const progressBar = findElement(
    "progressBar",
    "rewardProgressBar",
    "progressFill"
  );

  if (progressBar) {
    progressBar.style.width = "0%";
  }

  setText(
    [
      "progressText",
      "rewardProgressText"
    ],
    "0.00%"
  );

  updateWalletConnectionUI(false);
}

function resetWalletConnection() {
  provider = null;
  signer = null;
  userAddress = null;

  ncToken = null;
  rewardCore = null;
  rewardStaking = null;

  stopCountdown();
  resetWalletUI();
}


/* =========================================================
   CONFIG HELPERS
========================================================= */

function getAddress(...keys) {
  for (const key of keys) {
    if (window.CONTRACTS?.[key]) {
      return window.CONTRACTS[key];
    }

    if (window.APP_CONFIG?.contracts?.[key]) {
      return window.APP_CONFIG.contracts[key];
    }

    if (window.APP_CONFIG?.[key]) {
      return window.APP_CONFIG[key];
    }
  }

  return null;
}

function getNCAddress() {
  return getAddress(
    "NC_TOKEN",
    "NC",
    "ncToken",
    "ncTokenAddress"
  );
}

function getRewardCoreAddress() {
  return getAddress(
    "REWARD_CORE",
    "REWARD_CORE_V7",
    "rewardCore",
    "rewardCoreAddress"
  );
}

function getRewardStakingAddress() {
  return getAddress(
    "REWARD_STAKING",
    "REWARD_STAKING_V1",
    "rewardStaking",
    "rewardStakingAddress"
  );
}


/* =========================================================
   FORMATTERS
========================================================= */

function formatNC(value, decimals = 2) {
  try {
    const formatted = ethers.formatUnits(
      value ?? 0n,
      18
    );

    const number = Number(formatted);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  } catch (error) {
    console.warn("formatNC error:", error);
    return "0";
  }
}

function shortAddress(address) {
  if (!address) {
    return "-";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function rankName(rank) {
  const rankNumber = Number(rank);

  if (
    window.RANK_NAMES?.[rankNumber] !== undefined
  ) {
    return window.RANK_NAMES[rankNumber];
  }

  const fallbackRanks = [
    "Member",
    "Bronze",
    "Silver",
    "Gold"
  ];

  return (
    fallbackRanks[rankNumber] ||
    `Rank ${rankNumber}`
  );
}

function formatDate(timestamp) {
  const value = Number(timestamp);

  if (!value) {
    return "-";
  }

  return new Date(
    value * 1000
  ).toLocaleString("th-TH");
}

function formatCountdown(seconds) {
  let remaining = Math.max(
    0,
    Math.floor(Number(seconds))
  );

  const days = Math.floor(
    remaining / 86400
  );

  remaining %= 86400;

  const hours = Math.floor(
    remaining / 3600
  );

  remaining %= 3600;

  const minutes = Math.floor(
    remaining / 60
  );

  const secs = remaining % 60;

  if (days > 0) {
    return (
      `${days} วัน ` +
      `${hours} ชม. ` +
      `${minutes} นาที`
    );
  }

  return (
    `${hours} ชม. ` +
    `${minutes} นาที ` +
    `${secs} วินาที`
  );
}

function getErrorMessage(error) {
  console.error(error);

  const message =
    error?.shortMessage ||
    error?.reason ||
    error?.info?.error?.message ||
    error?.error?.message ||
    error?.message ||
    "Transaction failed";

  const lowerMessage =
    String(message).toLowerCase();

  if (
    lowerMessage.includes("user rejected") ||
    lowerMessage.includes("user denied") ||
    lowerMessage.includes("rejected the request")
  ) {
    return "ผู้ใช้ยกเลิกรายการ";
  }

  if (
    lowerMessage.includes("insufficient funds")
  ) {
    return "BNB ไม่เพียงพอสำหรับค่า Gas";
  }

  if (
    lowerMessage.includes("execution reverted")
  ) {
    return String(message)
      .replace("execution reverted:", "")
      .trim();
  }

  return String(message);
}


/* =========================================================
   STATUS
========================================================= */

function setStatus(message, type = "") {
  const status = findElement(
    "status",
    "appStatus",
    "transactionStatus",
    "claimStatus"
  );

  if (!status) {
    console.log(
      `[${type || "status"}] ${message}`
    );

    return;
  }

  status.textContent = message;
  status.className =
    `status ${type}`.trim();
}

function setLoading(loading) {
  setDisabled(
    [
      "connectWalletBtn",
      "connectBtn",
      "btnConnect"
    ],
    loading
  );

  setDisabled(
    [
      "refreshBtn",
      "btnRefresh"
    ],
    loading
  );
}


/* =========================================================
   BSC NETWORK
========================================================= */

async function ensureBSCNetwork() {
  if (!window.ethereum) {
    throw new Error(
      "กรุณาเปิดเว็บไซต์ผ่าน Wallet DApp Browser"
    );
  }

  const chainId =
    await window.ethereum.request({
      method: "eth_chainId"
    });

  if (
    String(chainId).toLowerCase() === "0x38"
  ) {
    return true;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x38"
        }
      ]
    });

    return true;
  } catch (switchError) {
    if (
      switchError.code !== 4902 &&
      switchError.code !== -32603
    ) {
      throw switchError;
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x38",
          chainName: "BNB Smart Chain",
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18
          },
          rpcUrls: [
            "https://bsc-dataseed.binance.org/"
          ],
          blockExplorerUrls: [
            "https://bscscan.com"
          ]
        }
      ]
    });

    return true;
  }
}


/* =========================================================
   CREATE CONTRACTS
========================================================= */

function createContracts() {
  const ncAddress = getNCAddress();
  const coreAddress = getRewardCoreAddress();
  const stakingAddress =
    getRewardStakingAddress();

  if (!ncAddress) {
    throw new Error(
      "ไม่พบ NC Token Address ใน config.js"
    );
  }

  if (!coreAddress) {
    throw new Error(
      "ไม่พบ Reward Core Address ใน config.js"
    );
  }

  if (!stakingAddress) {
    throw new Error(
      "ไม่พบ Reward Staking Address ใน config.js"
    );
  }

  if (!window.NC_TOKEN_ABI) {
    throw new Error(
      "ไม่พบ NC_TOKEN_ABI ใน abi.js"
    );
  }

  if (!window.REWARD_CORE_ABI) {
    throw new Error(
      "ไม่พบ REWARD_CORE_ABI ใน abi.js"
    );
  }

  if (!window.REWARD_STAKING_ABI) {
    throw new Error(
      "ไม่พบ REWARD_STAKING_ABI ใน abi.js"
    );
  }

  ncToken = new ethers.Contract(
    ncAddress,
    window.NC_TOKEN_ABI,
    signer
  );

  rewardCore = new ethers.Contract(
    coreAddress,
    window.REWARD_CORE_ABI,
    signer
  );

  rewardStaking = new ethers.Contract(
    stakingAddress,
    window.REWARD_STAKING_ABI,
    signer
  );
}


/* =========================================================
   SET ACTIVE ACCOUNT
========================================================= */

async function setActiveAccount(address) {
  if (!window.ethereum) {
    throw new Error(
      "ไม่พบ Wallet Provider"
    );
  }

  if (!address) {
    throw new Error(
      "ไม่พบบัญชีกระเป๋า"
    );
  }

  const selectedAddress =
    ethers.getAddress(address);

  provider = new ethers.BrowserProvider(
    window.ethereum,
    "any"
  );

  signer = await provider.getSigner(
    selectedAddress
  );

  const signerAddress = ethers.getAddress(
    await signer.getAddress()
  );

  if (
    signerAddress.toLowerCase() !==
    selectedAddress.toLowerCase()
  ) {
    throw new Error(
      "บัญชี Wallet ไม่ตรงกับบัญชีที่เลือก"
    );
  }

  userAddress = signerAddress;

  createContracts();

  setText(
    [
      "walletAddress",
      "connectedWallet",
      "walletText"
    ],
    shortAddress(userAddress)
  );

  setText(
    [
      "networkName",
      "networkStatus"
    ],
    "BNB Smart Chain"
  );

  updateWalletConnectionUI(true);
}


/* =========================================================
   CONNECT WALLET
========================================================= */

async function connectWallet() {
  try {
    setLoading(true);

    setStatus(
      "กำลังเชื่อมกระเป๋า..."
    );

    resetWalletConnection();

    if (!window.ethereum) {
      throw new Error(
        "กรุณาเปิดเว็บไซต์ผ่าน Wallet DApp Browser"
      );
    }

    await ensureBSCNetwork();

    const accounts =
      await window.ethereum.request({
        method: "eth_requestAccounts"
      });

    if (
      !Array.isArray(accounts) ||
      accounts.length === 0
    ) {
      throw new Error(
        "ไม่พบบัญชีกระเป๋าที่เชื่อมต่อ"
      );
    }

    /*
      ใช้บัญชีปัจจุบันที่ Wallet ส่งกลับมา
      ไม่ใช้เลขกระเป๋าที่เก็บไว้ก่อนหน้า
    */

    await setActiveAccount(accounts[0]);

    setStatus(
      `เชื่อมกระเป๋า ${shortAddress(userAddress)} สำเร็จ`,
      "success"
    );

    await refreshAll();
  } catch (error) {
    resetWalletConnection();

    setStatus(
      getErrorMessage(error),
      "error"
    );
  } finally {
    setLoading(false);
  }
}


/* =========================================================
   LOAD REWARD
========================================================= */

async function loadRewardInfo() {
  if (
    !rewardCore ||
    !userAddress
  ) {
    return;
  }

  const info =
    await rewardCore.getUserRewardInfo(
      userAddress
    );

  const personalVolume =
    info.personalVolume ?? info[0];

  const orgVolume =
    info.orgVolume ?? info[1];

  const totalRewardEarned =
    info.totalRewardEarned ?? info[2];

  const totalRewardStaked =
    info.totalRewardStaked ?? info[3];

  const pending =
    info.pending ?? info[4];

  const claimable =
    info.claimable ?? info[5];

  const remainingAfterClaim =
    info.remainingAfterClaim ?? info[6];

  const currentRank =
    info.currentRank ?? info[7];

  const goldQualified =
    info.goldQualified ?? info[8];

  const orgQualified =
    info.orgQualified ?? info[9];

  const claimQualified =
    info.claimQualified ?? info[10];

  setText(
    [
      "personalVolume",
      "personalRewardVolume"
    ],
    `${formatNC(personalVolume)} NC`
  );

  setText(
    [
      "organizationVolume",
      "orgVolume"
    ],
    `${formatNC(orgVolume)} NC`
  );

  setText(
    [
      "totalRewardEarned",
      "rewardEarned"
    ],
    `${formatNC(totalRewardEarned)} NC`
  );

  setText(
    [
      "totalRewardStaked",
      "rewardStaked"
    ],
    `${formatNC(totalRewardStaked)} NC`
  );

  setText(
    [
      "pendingReward",
      "rewardPending"
    ],
    `${formatNC(pending)} NC`
  );

  setText(
    [
      "claimableReward",
      "claimableAmount"
    ],
    `${formatNC(claimable)} NC`
  );

  setText(
    [
      "remainingReward",
      "remainingAfterClaim"
    ],
    `${formatNC(remainingAfterClaim)} NC`
  );

  setText(
    [
      "currentRank",
      "rank"
    ],
    rankName(currentRank)
  );

  setText(
    [
      "goldStatus",
      "goldQualified"
    ],
    goldQualified
      ? "ผ่านเงื่อนไข Gold"
      : "ยังไม่ถึง Gold"
  );

  setText(
    [
      "organizationStatus",
      "orgQualified"
    ],
    orgQualified
      ? "ยอดองค์กรถึงเป้าหมาย"
      : "ยอดองค์กรยังไม่ถึงเป้าหมาย"
  );

  const claimButton = findElement(
    "claimBtn",
    "btnClaim",
    "claimAndStakeBtn"
  );

  if (claimButton) {
    claimButton.disabled =
      !claimQualified;

    claimButton.textContent =
      claimQualified
        ? `Claim ${formatNC(claimable)} NC & Auto Stake`
        : "ยังไม่สามารถ Claim ได้";
  }

  await updateRewardProgress(
    orgVolume
  );
}


/* =========================================================
   REWARD PROGRESS
========================================================= */

async function updateRewardProgress(
  orgVolume
) {
  let target;

  try {
    target =
      await rewardCore
        .requiredOrganizationVolume();
  } catch (error) {
    console.warn(
      "Cannot read organization target:",
      error
    );

    target = ethers.parseUnits(
      "20000",
      18
    );
  }

  const currentNumber = Number(
    ethers.formatUnits(
      orgVolume,
      18
    )
  );

  const targetNumber = Number(
    ethers.formatUnits(
      target,
      18
    )
  );

  const percentage =
    targetNumber > 0
      ? Math.min(
          100,
          (
            currentNumber /
            targetNumber
          ) * 100
        )
      : 0;

  setText(
    [
      "organizationTarget",
      "rewardTarget"
    ],
    `${formatNC(target)} NC`
  );

  setText(
    [
      "progressText",
      "rewardProgressText"
    ],
    `${percentage.toFixed(2)}%`
  );

  const progressBar = findElement(
    "progressBar",
    "rewardProgressBar",
    "progressFill"
  );

  if (progressBar) {
    progressBar.style.width =
      `${percentage}%`;
  }
}


/* =========================================================
   LOAD NC BALANCE
========================================================= */

async function loadNCBalance() {
  if (
    !ncToken ||
    !userAddress
  ) {
    return;
  }

  const balance =
    await ncToken.balanceOf(
      userAddress
    );

  setText(
    [
      "ncBalance",
      "walletNCBalance"
    ],
    `${formatNC(balance)} NC`
  );
}


/* =========================================================
   LOAD STAKE SUMMARY
========================================================= */

async function loadStakeSummary() {
  if (
    !rewardStaking ||
    !userAddress
  ) {
    return;
  }

  const summary =
    await rewardStaking.userStakeSummary(
      userAddress
    );

  const totalLots =
    summary.totalLots ?? summary[0];

  const activeLots =
    summary.activeLots ?? summary[1];

  const withdrawnLots =
    summary.withdrawnLots ?? summary[2];

  const activePrincipal =
    summary.activePrincipal ?? summary[3];

  const maturedPrincipal =
    summary.maturedPrincipal ?? summary[4];

  setText(
    [
      "totalLots",
      "stakeTotalLots"
    ],
    totalLots.toString()
  );

  setText(
    [
      "activeLots",
      "stakeActiveLots"
    ],
    activeLots.toString()
  );

  setText(
    [
      "withdrawnLots",
      "stakeWithdrawnLots"
    ],
    withdrawnLots.toString()
  );

  setText(
    [
      "activePrincipal",
      "stakeActivePrincipal"
    ],
    `${formatNC(activePrincipal)} NC`
  );

  setText(
    [
      "maturedPrincipal",
      "stakeMaturedPrincipal"
    ],
    `${formatNC(maturedPrincipal)} NC`
  );

  const withdrawable =
    await rewardStaking.withdrawableAmount(
      userAddress
    );

  setText(
    [
      "withdrawableAmount",
      "stakeWithdrawable"
    ],
    `${formatNC(withdrawable)} NC`
  );

  const withdrawButton =
    findElement(
      "withdrawMaturedBtn",
      "btnWithdrawMatured"
    );

  if (withdrawButton) {
    withdrawButton.disabled =
      withdrawable === 0n;
  }
}


/* =========================================================
   LOAD STAKE LOTS
========================================================= */

async function loadStakeLots() {
  if (
    !rewardStaking ||
    !userAddress
  ) {
    return;
  }

  const container = findElement(
    "stakeLots",
    "stakeLotsList",
    "lotsContainer"
  );

  if (!container) {
    return;
  }

  const countBigInt =
    await rewardStaking.stakeLotsCount(
      userAddress
    );

  const totalLots =
    Number(countBigInt);

  if (totalLots === 0) {
    container.innerHTML = `
      <div class="empty-state">
        ยังไม่มี Reward Stake
      </div>
    `;

    stopCountdown();
    return;
  }

  const lots = [];

  for (
    let index = 0;
    index < totalLots;
    index++
  ) {
    try {
      const lot =
        await rewardStaking.getStakeLot(
          userAddress,
          index
        );

      lots.push({
        index,

        principal:
          lot.principal ?? lot[0],

        startedAt:
          lot.startedAt ?? lot[1],

        unlockAt:
          lot.unlockAt ?? lot[2],

        withdrawn:
          lot.withdrawn ?? lot[3],

        matured:
          lot.matured ?? lot[4],

        remainingSeconds:
          lot.remainingSeconds ?? lot[5]
      });
    } catch (error) {
      console.warn(
        `Cannot load stake lot ${index}`,
        error
      );
    }
  }

  container.innerHTML = lots
    .map(
      (lot) =>
        createStakeLotHTML(lot)
    )
    .join("");

  startCountdown();
}

function createStakeLotHTML(lot) {
  let statusText = "กำลังล็อก";
  let statusClass = "locked";

  if (lot.withdrawn) {
    statusText = "ถอนแล้ว";
    statusClass = "withdrawn";
  } else if (lot.matured) {
    statusText = "พร้อมถอน";
    statusClass = "matured";
  }

  let buttonHTML;

  if (lot.withdrawn) {
    buttonHTML = `
      <button
        type="button"
        disabled
      >
        ถอนแล้ว
      </button>
    `;
  } else if (lot.matured) {
    buttonHTML = `
      <button
        type="button"
        class="withdraw-lot-btn"
        data-index="${lot.index}"
      >
        Withdraw
      </button>
    `;
  } else {
    buttonHTML = `
      <button
        type="button"
        disabled
      >
        ยังไม่ครบกำหนด
      </button>
    `;
  }

  let countdownText;

  if (lot.withdrawn) {
    countdownText = "ถอนแล้ว";
  } else if (lot.matured) {
    countdownText = "พร้อมถอน";
  } else {
    countdownText =
      formatCountdown(
        lot.remainingSeconds
      );
  }

  return `
    <div class="stake-lot">

      <div class="stake-lot-head">

        <strong>
          Stake #${lot.index + 1}
        </strong>

        <span
          class="stake-status ${statusClass}"
        >
          ${statusText}
        </span>

      </div>

      <div class="stake-lot-grid">

        <div>
          <small>Principal</small>
          <b>
            ${formatNC(lot.principal)} NC
          </b>
        </div>

        <div>
          <small>เริ่ม Stake</small>
          <b>
            ${formatDate(lot.startedAt)}
          </b>
        </div>

        <div>
          <small>วันปลดล็อก</small>
          <b>
            ${formatDate(lot.unlockAt)}
          </b>
        </div>

        <div>
          <small>เวลาคงเหลือ</small>

          <b
            class="lot-countdown"
            data-unlock="${lot.unlockAt.toString()}"
            data-withdrawn="${lot.withdrawn}"
          >
            ${countdownText}
          </b>
        </div>

      </div>

      <div class="stake-lot-action">
        ${buttonHTML}
      </div>

    </div>
  `;
}


/* =========================================================
   COUNTDOWN
========================================================= */

function startCountdown() {
  stopCountdown();

  updateCountdowns();

  countdownTimer = setInterval(
    updateCountdowns,
    3000
  );
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function updateCountdowns() {
  const elements =
    document.querySelectorAll(
      ".lot-countdown"
    );

  const currentTime =
    Math.floor(
      Date.now() / 1000
    );

  elements.forEach(
    (element) => {
      const withdrawn =
        element.dataset.withdrawn ===
        "true";

      if (withdrawn) {
        element.textContent =
          "ถอนแล้ว";

        return;
      }

      const unlockAt = Number(
        element.dataset.unlock
      );

      const remaining =
        unlockAt - currentTime;

      if (remaining <= 0) {
        element.textContent =
          "พร้อมถอน";

        return;
      }

      element.textContent =
        formatCountdown(
          remaining
        );
    }
  );
}


/* =========================================================
   CLAIM REWARD & AUTO STAKE
========================================================= */

async function claimReward() {
  if (
    !rewardCore ||
    !userAddress
  ) {
    await connectWallet();
    return;
  }

  const button = findElement(
    "claimBtn",
    "btnClaim",
    "claimAndStakeBtn"
  );

  try {
    if (button) {
      button.disabled = true;
    }

    setStatus(
      "กำลังตรวจสอบสิทธิ์ Claim..."
    );

    const canClaim =
      await rewardCore.canClaim(
        userAddress
      );

    if (!canClaim) {
      throw new Error(
        "ยังไม่ผ่านเงื่อนไข Claim กรุณาตรวจสอบ Rank และยอด Reward"
      );
    }

    setStatus(
      "กำลังส่งคำสั่ง Claim และ Auto Stake..."
    );

    const transaction =
      await rewardCore.claimAndStake();

    setStatus(
      "ส่งรายการแล้ว กำลังรอยืนยันบน Blockchain..."
    );

    await transaction.wait();

    setStatus(
      "Claim และ Auto Stake สำเร็จ",
      "success"
    );

    await refreshAll();
  } catch (error) {
    setStatus(
      getErrorMessage(error),
      "error"
    );
  } finally {
    if (button) {
      button.disabled = false;
    }
  }
}


/* =========================================================
   WITHDRAW ONE LOT
========================================================= */

async function withdrawLot(lotIndex) {
  if (
    !rewardStaking ||
    !userAddress
  ) {
    await connectWallet();
    return;
  }

  try {
    setStatus(
      `กำลังถอน Stake #${Number(lotIndex) + 1}...`
    );

    const transaction =
      await rewardStaking.withdraw(
        lotIndex
      );

    setStatus(
      "ส่งรายการแล้ว กำลังรอยืนยัน..."
    );

    await transaction.wait();

    setStatus(
      "ถอน NC สำเร็จ",
      "success"
    );

    await refreshAll();
  } catch (error) {
    setStatus(
      getErrorMessage(error),
      "error"
    );
  }
}


/* =========================================================
   WITHDRAW MATURED LOTS
========================================================= */

async function withdrawMaturedLots() {
  if (
    !rewardStaking ||
    !userAddress
  ) {
    await connectWallet();
    return;
  }

  const button = findElement(
    "withdrawMaturedBtn",
    "btnWithdrawMatured"
  );

  try {
    if (button) {
      button.disabled = true;
    }

    const totalLots =
      await rewardStaking.stakeLotsCount(
        userAddress
      );

    if (totalLots === 0n) {
      throw new Error(
        "ยังไม่มี Stake"
      );
    }

    const withdrawable =
      await rewardStaking.withdrawableAmount(
        userAddress
      );

    if (withdrawable === 0n) {
      throw new Error(
        "ยังไม่มี Stake ที่ครบกำหนดถอน"
      );
    }

    setStatus(
      "กำลังถอน Stake ที่ครบกำหนด..."
    );

    const transaction =
      await rewardStaking.withdrawMatured(
        0,
        totalLots
      );

    setStatus(
      "ส่งรายการแล้ว กำลังรอยืนยัน..."
    );

    await transaction.wait();

    setStatus(
      "ถอน Stake สำเร็จ",
      "success"
    );

    await refreshAll();
  } catch (error) {
    setStatus(
      getErrorMessage(error),
      "error"
    );
  } finally {
    if (button) {
      button.disabled = false;
    }
  }
}


/* =========================================================
   REFRESH
========================================================= */

async function refreshAll() {
  if (
    !userAddress ||
    !ncToken ||
    !rewardCore ||
    !rewardStaking
  ) {
    return;
  }

  if (isRefreshing) {
    return;
  }

  isRefreshing = true;

  try {
    setDisabled(
      [
        "refreshBtn",
        "btnRefresh"
      ],
      true
    );

    await Promise.all([
      loadNCBalance(),
      loadRewardInfo(),
      loadStakeSummary()
    ]);

    await loadStakeLots();
  } catch (error) {
    setStatus(
      `โหลดข้อมูลไม่สำเร็จ: ${getErrorMessage(error)}`,
      "error"
    );
  } finally {
    setDisabled(
      [
        "refreshBtn",
        "btnRefresh"
      ],
      false
    );

    isRefreshing = false;
  }
}


/* =========================================================
   PAGE EVENTS
========================================================= */

function bindEvents() {
  const connectButton =
    findElement(
      "connectWalletBtn",
      "connectBtn",
      "btnConnect"
    );

  const refreshButton =
    findElement(
      "refreshBtn",
      "btnRefresh"
    );

  const claimButton =
    findElement(
      "claimBtn",
      "btnClaim",
      "claimAndStakeBtn"
    );

  const withdrawButton =
    findElement(
      "withdrawMaturedBtn",
      "btnWithdrawMatured"
    );

  connectButton?.addEventListener(
    "click",
    connectWallet
  );

  refreshButton?.addEventListener(
    "click",
    async () => {
      if (!userAddress) {
        await connectWallet();
        return;
      }

      await refreshAll();
    }
  );

  claimButton?.addEventListener(
    "click",
    claimReward
  );

  withdrawButton?.addEventListener(
    "click",
    withdrawMaturedLots
  );

  document.addEventListener(
    "click",
    async (event) => {
      const button =
        event.target.closest(
          ".withdraw-lot-btn"
        );

      if (!button) {
        return;
      }

      const lotIndex =
        button.dataset.index;

      button.disabled = true;

      try {
        await withdrawLot(
          lotIndex
        );
      } finally {
        button.disabled = false;
      }
    }
  );
}


/* =========================================================
   WALLET EVENTS
========================================================= */

function bindWalletEvents() {
  if (!window.ethereum) {
    return;
  }

  window.ethereum.on?.(
    "accountsChanged",
    async (accounts) => {
      resetWalletConnection();

      if (
        !Array.isArray(accounts) ||
        accounts.length === 0
      ) {
        setStatus(
          "กระเป๋าถูกตัดการเชื่อมต่อ"
        );

        return;
      }

      try {
        setLoading(true);

        await ensureBSCNetwork();

        /*
          ใช้บัญชีใหม่ที่ Wallet แจ้งมาโดยตรง
        */

        await setActiveAccount(
          accounts[0]
        );

        setStatus(
          `เปลี่ยนเป็นกระเป๋า ${shortAddress(userAddress)} แล้ว`,
          "success"
        );

        await refreshAll();
      } catch (error) {
        resetWalletConnection();

        setStatus(
          getErrorMessage(error),
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  );

  window.ethereum.on?.(
    "chainChanged",
    () => {
      resetWalletConnection();

      setStatus(
        "เครือข่ายถูกเปลี่ยน กรุณากด Connect Wallet"
      );
    }
  );
}


/* =========================================================
   AUTO CONNECT DISABLED
========================================================= */

async function autoConnect() {
  /*
    ไม่เชื่อมบัญชีเก่าโดยอัตโนมัติ
    ผู้ใช้ต้องกด Connect Wallet เอง
  */

  resetWalletConnection();

  if (!window.ethereum) {
    setStatus(
      "กรุณาเปิดผ่าน Wallet DApp Browser",
      "error"
    );

    return;
  }

  setStatus(
    "กรุณากด Connect Wallet"
  );
}


/* =========================================================
   START APP
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    bindEvents();
    bindWalletEvents();
    await autoConnect();
  }
);
