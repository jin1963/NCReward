"use strict";

/* =========================================================
   NC REWARD DAPP — SIMPLE MAIN.JS
   ใช้ร่วมกับ:
   config.js
   abi.js
   ethers.js v6
========================================================= */

let provider = null;
let signer = null;
let userAddress = null;

let ncToken = null;
let rewardCore = null;
let rewardStaking = null;

let countdownTimer = null;


/* =========================================================
   ELEMENT HELPERS
   รองรับชื่อ ID หลายแบบ เพื่อให้ใช้กับหน้าเดิมได้ง่าย
========================================================= */

function findElement(...ids) {
  for (const id of ids) {
    const element = document.getElementById(id);
    if (element) return element;
  }

  return null;
}

function setText(ids, value) {
  const element = findElement(...ids);

  if (element) {
    element.textContent = value;
  }
}

function setHTML(ids, value) {
  const element = findElement(...ids);

  if (element) {
    element.innerHTML = value;
  }
}

function setDisabled(ids, disabled) {
  const element = findElement(...ids);

  if (element) {
    element.disabled = disabled;
  }
}

function showElement(ids, show = true) {
  const element = findElement(...ids);

  if (element) {
    element.style.display = show ? "" : "none";
  }
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
    const formatted = ethers.formatUnits(value ?? 0n, 18);
    const number = Number(formatted);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  } catch {
    return "0";
  }
}

function shortAddress(address) {
  if (!address) return "-";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function rankName(rank) {
  const rankNumber = Number(rank);

  if (window.RANK_NAMES?.[rankNumber] !== undefined) {
    return window.RANK_NAMES[rankNumber];
  }

  const fallbackRanks = [
    "Member",
    "Bronze",
    "Silver",
    "Gold"
  ];

  return fallbackRanks[rankNumber] || `Rank ${rankNumber}`;
}

function formatDate(timestamp) {
  const value = Number(timestamp);

  if (!value) return "-";

  return new Date(value * 1000).toLocaleString("th-TH");
}

function formatCountdown(seconds) {
  let remaining = Math.max(0, Number(seconds));

  const days = Math.floor(remaining / 86400);
  remaining %= 86400;

  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  if (days > 0) {
    return `${days} วัน ${hours} ชม. ${minutes} นาที`;
  }

  return `${hours} ชม. ${minutes} นาที ${secs} วินาที`;
}

function getErrorMessage(error) {
  console.error(error);

  const message =
    error?.shortMessage ||
    error?.reason ||
    error?.info?.error?.message ||
    error?.message ||
    "Transaction failed";

  if (message.includes("user rejected")) {
    return "ผู้ใช้ยกเลิกรายการ";
  }

  if (message.includes("insufficient funds")) {
    return "BNB ไม่เพียงพอสำหรับค่า Gas";
  }

  if (message.includes("execution reverted")) {
    return message.replace("execution reverted:", "").trim();
  }

  return message;
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

  if (!status) return;

  status.textContent = message;
  status.className = `status ${type}`.trim();
}

function setLoading(loading) {
  setDisabled(["connectBtn", "btnConnect"], loading);
  setDisabled(["refreshBtn", "btnRefresh"], loading);
}


/* =========================================================
   BSC NETWORK
========================================================= */

async function ensureBSCNetwork() {
  if (!window.ethereum) {
    throw new Error("กรุณาติดตั้ง MetaMask หรือเปิดผ่าน DApp Browser");
  }

  const chainId = await window.ethereum.request({
    method: "eth_chainId"
  });

  if (chainId === "0x38") {
    return true;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }]
    });

    return true;
  } catch (switchError) {
    if (switchError.code !== 4902) {
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
          rpcUrls: ["https://bsc-dataseed.binance.org/"],
          blockExplorerUrls: ["https://bscscan.com"]
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
  const stakingAddress = getRewardStakingAddress();

  if (!ncAddress) {
    throw new Error("ไม่พบ NC Token Address ใน config.js");
  }

  if (!coreAddress) {
    throw new Error("ไม่พบ Reward Core Address ใน config.js");
  }

  if (!stakingAddress) {
    throw new Error("ไม่พบ Reward Staking Address ใน config.js");
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
   CONNECT WALLET
========================================================= */

async function connectWallet() {
  try {
    setLoading(true);
    setStatus("กำลังเชื่อมกระเป๋า...");

    await ensureBSCNetwork();

    provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    userAddress = await signer.getAddress();

    createContracts();

    setText(
      ["walletAddress", "connectedWallet", "walletText"],
      shortAddress(userAddress)
    );

    setText(
      ["networkName", "networkStatus"],
      "BNB Smart Chain"
    );

    const connectButton = findElement("connectBtn", "btnConnect");

    if (connectButton) {
      connectButton.textContent = shortAddress(userAddress);
    }

    setStatus("เชื่อมกระเป๋าสำเร็จ", "success");

    await refreshAll();
  } catch (error) {
    setStatus(getErrorMessage(error), "error");
  } finally {
    setLoading(false);
  }
}


/* =========================================================
   LOAD REWARD
========================================================= */

async function loadRewardInfo() {
  if (!rewardCore || !userAddress) return;

  const info = await rewardCore.getUserRewardInfo(userAddress);

  const personalVolume = info.personalVolume ?? info[0];
  const orgVolume = info.orgVolume ?? info[1];
  const totalRewardEarned = info.totalRewardEarned ?? info[2];
  const totalRewardStaked = info.totalRewardStaked ?? info[3];
  const pending = info.pending ?? info[4];
  const claimable = info.claimable ?? info[5];
  const remainingAfterClaim = info.remainingAfterClaim ?? info[6];
  const currentRank = info.currentRank ?? info[7];
  const goldQualified = info.goldQualified ?? info[8];
  const orgQualified = info.orgQualified ?? info[9];
  const claimQualified = info.claimQualified ?? info[10];

  setText(
    ["personalVolume", "personalRewardVolume"],
    `${formatNC(personalVolume)} NC`
  );

  setText(
    ["organizationVolume", "orgVolume"],
    `${formatNC(orgVolume)} NC`
  );

  setText(
    ["totalRewardEarned", "rewardEarned"],
    `${formatNC(totalRewardEarned)} NC`
  );

  setText(
    ["totalRewardStaked", "rewardStaked"],
    `${formatNC(totalRewardStaked)} NC`
  );

  setText(
    ["pendingReward", "rewardPending"],
    `${formatNC(pending)} NC`
  );

  setText(
    ["claimableReward", "claimableAmount"],
    `${formatNC(claimable)} NC`
  );

  setText(
    ["remainingReward", "remainingAfterClaim"],
    `${formatNC(remainingAfterClaim)} NC`
  );

  setText(
    ["currentRank", "rank"],
    rankName(currentRank)
  );

  setText(
    ["goldStatus", "goldQualified"],
    goldQualified ? "ผ่านเงื่อนไข Gold" : "ยังไม่ถึง Gold"
  );

  setText(
    ["organizationStatus", "orgQualified"],
    orgQualified ? "ยอดองค์กรถึงเป้าหมาย" : "ยอดองค์กรยังไม่ถึงเป้าหมาย"
  );

  const claimButton = findElement(
    "claimBtn",
    "btnClaim",
    "claimAndStakeBtn"
  );

  if (claimButton) {
    claimButton.disabled = !claimQualified;

    claimButton.textContent = claimQualified
      ? `Claim ${formatNC(claimable)} NC & Auto Stake`
      : "ยังไม่สามารถ Claim ได้";
  }

  updateRewardProgress(orgVolume);
}


/* =========================================================
   REWARD PROGRESS
========================================================= */

async function updateRewardProgress(orgVolume) {
  let target;

  try {
    target = await rewardCore.requiredOrganizationVolume();
  } catch {
    target = ethers.parseUnits("20000", 18);
  }

  const currentNumber = Number(ethers.formatUnits(orgVolume, 18));
  const targetNumber = Number(ethers.formatUnits(target, 18));

  const percentage =
    targetNumber > 0
      ? Math.min(100, (currentNumber / targetNumber) * 100)
      : 0;

  setText(
    ["organizationTarget", "rewardTarget"],
    `${formatNC(target)} NC`
  );

  setText(
    ["progressText", "rewardProgressText"],
    `${percentage.toFixed(2)}%`
  );

  const progressBar = findElement(
    "progressBar",
    "rewardProgressBar",
    "progressFill"
  );

  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
}


/* =========================================================
   LOAD NC BALANCE
========================================================= */

async function loadNCBalance() {
  if (!ncToken || !userAddress) return;

  const balance = await ncToken.balanceOf(userAddress);

  setText(
    ["ncBalance", "walletNCBalance"],
    `${formatNC(balance)} NC`
  );
}


/* =========================================================
   LOAD STAKE SUMMARY
========================================================= */

async function loadStakeSummary() {
  if (!rewardStaking || !userAddress) return;

  const summary = await rewardStaking.userStakeSummary(userAddress);

  const totalLots = summary.totalLots ?? summary[0];
  const activeLots = summary.activeLots ?? summary[1];
  const withdrawnLots = summary.withdrawnLots ?? summary[2];
  const activePrincipal = summary.activePrincipal ?? summary[3];
  const maturedPrincipal = summary.maturedPrincipal ?? summary[4];

  setText(
    ["totalLots", "stakeTotalLots"],
    totalLots.toString()
  );

  setText(
    ["activeLots", "stakeActiveLots"],
    activeLots.toString()
  );

  setText(
    ["withdrawnLots", "stakeWithdrawnLots"],
    withdrawnLots.toString()
  );

  setText(
    ["activePrincipal", "stakeActivePrincipal"],
    `${formatNC(activePrincipal)} NC`
  );

  setText(
    ["maturedPrincipal", "stakeMaturedPrincipal"],
    `${formatNC(maturedPrincipal)} NC`
  );

  const withdrawable =
    await rewardStaking.withdrawableAmount(userAddress);

  setText(
    ["withdrawableAmount", "stakeWithdrawable"],
    `${formatNC(withdrawable)} NC`
  );
}


/* =========================================================
   LOAD STAKE LOTS
========================================================= */

async function loadStakeLots() {
  if (!rewardStaking || !userAddress) return;

  const container = findElement(
    "stakeLots",
    "stakeLotsList",
    "lotsContainer"
  );

  if (!container) return;

  const countBigInt =
    await rewardStaking.stakeLotsCount(userAddress);

  const totalLots = Number(countBigInt);

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

  for (let index = 0; index < totalLots; index++) {
    try {
      const lot = await rewardStaking.getStakeLot(
        userAddress,
        index
      );

      lots.push({
        index,
        principal: lot.principal ?? lot[0],
        startedAt: lot.startedAt ?? lot[1],
        unlockAt: lot.unlockAt ?? lot[2],
        withdrawn: lot.withdrawn ?? lot[3],
        matured: lot.matured ?? lot[4],
        remainingSeconds: lot.remainingSeconds ?? lot[5]
      });
    } catch (error) {
      console.warn(`Cannot load stake lot ${index}`, error);
    }
  }

  container.innerHTML = lots
    .map((lot) => createStakeLotHTML(lot))
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
    statusText = "ถอนคืนได้";
    statusClass = "matured";
  }

  const button = lot.withdrawn
    ? `<button disabled>ถอนแล้ว</button>`
    : lot.matured
      ? `
        <button
          class="withdraw-lot-btn"
          data-index="${lot.index}"
        >
          Withdraw
        </button>
      `
      : `<button disabled>ยังไม่ครบกำหนด</button>`;

  return `
    <div class="stake-lot">
      <div class="stake-lot-head">
        <strong>Stake #${lot.index + 1}</strong>
        <span class="stake-status ${statusClass}">
          ${statusText}
        </span>
      </div>

      <div class="stake-lot-grid">
        <div>
          <small>Principal</small>
          <b>${formatNC(lot.principal)} NC</b>
        </div>

        <div>
          <small>เริ่ม Stake</small>
          <b>${formatDate(lot.startedAt)}</b>
        </div>

        <div>
          <small>วันปลดล็อก</small>
          <b>${formatDate(lot.unlockAt)}</b>
        </div>

        <div>
          <small>เวลาคงเหลือ</small>
          <b
            class="lot-countdown"
            data-unlock="${lot.unlockAt.toString()}"
            data-withdrawn="${lot.withdrawn}"
          >
            ${
              lot.withdrawn
                ? "ถอนแล้ว"
                : lot.matured
                  ? "พร้อมถอน"
                  : formatCountdown(lot.remainingSeconds)
            }
          </b>
        </div>
      </div>

      <div class="stake-lot-action">
        ${button}
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
  const countdownElements =
    document.querySelectorAll(".lot-countdown");

  const currentTime = Math.floor(Date.now() / 1000);

  countdownElements.forEach((element) => {
    const withdrawn =
      element.dataset.withdrawn === "true";

    if (withdrawn) {
      element.textContent = "ถอนแล้ว";
      return;
    }

    const unlockAt = Number(element.dataset.unlock);
    const remaining = unlockAt - currentTime;

    if (remaining <= 0) {
      element.textContent = "พร้อมถอน";

      const lotCard = element.closest(".stake-lot");
      const button =
        lotCard?.querySelector(".withdraw-lot-btn");

      if (!button) {
        refreshAll().catch(console.error);
      }

      return;
    }

    element.textContent = formatCountdown(remaining);
  });
}


/* =========================================================
   CLAIM REWARD & AUTO STAKE
========================================================= */

async function claimReward() {
  if (!rewardCore || !userAddress) {
    await connectWallet();
    return;
  }

  const button = findElement(
    "claimBtn",
    "btnClaim",
    "claimAndStakeBtn"
  );

  try {
    if (button) button.disabled = true;

    setStatus(
      "กำลังส่งคำสั่ง Claim และ Auto Stake..."
    );

    const canClaim = await rewardCore.canClaim(userAddress);

    if (!canClaim) {
      throw new Error(
        "ยังไม่ผ่านเงื่อนไข Claim กรุณาตรวจสอบ Rank และยอด Reward"
      );
    }

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
    setStatus(getErrorMessage(error), "error");
  } finally {
    if (button) button.disabled = false;
  }
}


/* =========================================================
   WITHDRAW ONE LOT
========================================================= */

async function withdrawLot(lotIndex) {
  if (!rewardStaking || !userAddress) return;

  try {
    setStatus(
      `กำลังถอน Stake #${Number(lotIndex) + 1}...`
    );

    const transaction =
      await rewardStaking.withdraw(lotIndex);

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
    setStatus(getErrorMessage(error), "error");
  }
}


/* =========================================================
   WITHDRAW ALL MATURED LOTS
========================================================= */

async function withdrawMaturedLots() {
  if (!rewardStaking || !userAddress) {
    await connectWallet();
    return;
  }

  const button = findElement(
    "withdrawMaturedBtn",
    "btnWithdrawMatured"
  );

  try {
    if (button) button.disabled = true;

    const totalLots =
      await rewardStaking.stakeLotsCount(userAddress);

    if (totalLots === 0n) {
      throw new Error("ยังไม่มี Stake");
    }

    const withdrawable =
      await rewardStaking.withdrawableAmount(userAddress);

    if (withdrawable === 0n) {
      throw new Error("ยังไม่มี Stake ที่ครบกำหนดถอน");
    }

    setStatus(
      "กำลังถอน Stake ที่ครบกำหนดทั้งหมด..."
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
      "ถอน Stake ที่ครบกำหนดสำเร็จ",
      "success"
    );

    await refreshAll();
  } catch (error) {
    setStatus(getErrorMessage(error), "error");
  } finally {
    if (button) button.disabled = false;
  }
}


/* =========================================================
   REFRESH
========================================================= */

async function refreshAll() {
  if (!userAddress) return;

  try {
    setDisabled(["refreshBtn", "btnRefresh"], true);

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
    setDisabled(["refreshBtn", "btnRefresh"], false);
  }
}


/* =========================================================
   EVENTS
========================================================= */

function bindEvents() {
  const connectButton =
    findElement("connectBtn", "btnConnect");

  const refreshButton =
    findElement("refreshBtn", "btnRefresh");

  const claimButton = findElement(
    "claimBtn",
    "btnClaim",
    "claimAndStakeBtn"
  );

  const withdrawMaturedButton = findElement(
    "withdrawMaturedBtn",
    "btnWithdrawMatured"
  );

  connectButton?.addEventListener(
    "click",
    connectWallet
  );

  refreshButton?.addEventListener(
    "click",
    refreshAll
  );

  claimButton?.addEventListener(
    "click",
    claimReward
  );

  withdrawMaturedButton?.addEventListener(
    "click",
    withdrawMaturedLots
  );

  document.addEventListener("click", (event) => {
    const button =
      event.target.closest(".withdraw-lot-btn");

    if (!button) return;

    withdrawLot(button.dataset.index);
  });
}


/* =========================================================
   WALLET EVENTS
========================================================= */

function bindWalletEvents() {
  if (!window.ethereum) return;

  window.ethereum.on(
    "accountsChanged",
    async (accounts) => {
      if (!accounts.length) {
        userAddress = null;
        signer = null;

        setText(
          ["walletAddress", "connectedWallet"],
          "Not Connected"
        );

        setStatus("กระเป๋าถูกตัดการเชื่อมต่อ");

        stopCountdown();
        return;
      }

      await connectWallet();
    }
  );

  window.ethereum.on(
    "chainChanged",
    () => {
      window.location.reload();
    }
  );
}


/* =========================================================
   AUTO CONNECT
========================================================= */

async function autoConnect() {
  if (!window.ethereum) {
    setStatus(
      "กรุณาเปิดผ่าน MetaMask หรือ DApp Browser",
      "error"
    );

    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts"
    });

    if (accounts.length > 0) {
      await connectWallet();
    }
  } catch (error) {
    console.warn("Auto connect failed", error);
  }
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
