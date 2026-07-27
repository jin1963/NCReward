"use strict";

/*
  ABI ชุดนี้ใส่เฉพาะฟังก์ชันและ Event
  ที่หน้า NC Reward DApp จำเป็นต้องใช้งาน
*/


/* =====================================================
   NC TOKEN — ERC20
===================================================== */

const NC_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];


/* =====================================================
   LEGACY CORE V6
===================================================== */

const LEGACY_CORE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "users",
    outputs: [
      {
        internalType: "address",
        name: "sponsor",
        type: "address"
      },
      {
        internalType: "address",
        name: "parent",
        type: "address"
      },
      {
        internalType: "bool",
        name: "sideRight",
        type: "bool"
      },
      {
        internalType: "uint8",
        name: "pkg",
        type: "uint8"
      },
      {
        internalType: "uint8",
        name: "rank",
        type: "uint8"
      },
      {
        internalType: "uint32",
        name: "directSmallOrMore",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];


/* =====================================================
   NC REWARD CORE V7
===================================================== */

const REWARD_CORE_ABI = [
  {
    inputs: [],
    name: "BPS_DENOMINATOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "MAX_REWARD_BPS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "legacyCore",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "rewardVault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "rewardBps",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "claimStep",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "requiredOrganizationVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "goldRank",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "maxUpline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "claimPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "syncPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "getLegacyUser",
    outputs: [
      {
        internalType: "address",
        name: "sponsor",
        type: "address"
      },
      {
        internalType: "address",
        name: "parent",
        type: "address"
      },
      {
        internalType: "bool",
        name: "sideRight",
        type: "bool"
      },
      {
        internalType: "uint8",
        name: "pkg",
        type: "uint8"
      },
      {
        internalType: "uint8",
        name: "rank",
        type: "uint8"
      },
      {
        internalType: "uint32",
        name: "directCount",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "getUserRewardInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "personalVolume",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "orgVolume",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalRewardEarned",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalRewardStaked",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "pending",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "claimable",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "remainingAfterClaim",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "currentRank",
        type: "uint8"
      },
      {
        internalType: "bool",
        name: "goldQualified",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "orgQualified",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "claimQualified",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "canClaim",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "claimableReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "pendingReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "isGold",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "organizationTargetReached",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "organizationVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "personalPurchaseVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "rewardEarned",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "rewardStaked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "rewardHistoryCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256"
      }
    ],
    name: "rewardHistoryAt",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "purchaseId",
            type: "bytes32"
          },
          {
            internalType: "uint256",
            name: "purchaseAmount",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "rewardBps",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "rewardAmount",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "recordedAt",
            type: "uint256"
          }
        ],
        internalType: "struct NCRewardCoreV7.RewardRecord",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "claimAndStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "newRewardBps",
        type: "uint256"
      }
    ],
    name: "setRewardBps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "newClaimStep",
        type: "uint256"
      }
    ],
    name: "setClaimStep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "newVolume",
        type: "uint256"
      }
    ],
    name: "setRequiredOrganizationVolume",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "bool",
        name: "paused",
        type: "bool"
      }
    ],
    name: "setClaimPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "bool",
        name: "paused",
        type: "bool"
      }
    ],
    name: "setSyncPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint8",
        name: "newGoldRank",
        type: "uint8"
      }
    ],
    name: "setGoldRank",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "newMaxUpline",
        type: "uint256"
      }
    ],
    name: "setMaxUpline",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "bool",
        name: "blocked",
        type: "bool"
      }
    ],
    name: "setUserBlocked",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "syncer",
        type: "address"
      },
      {
        internalType: "bool",
        name: "allowed",
        type: "bool"
      }
    ],
    name: "setSyncer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "remainingReward",
        type: "uint256"
      }
    ],
    name: "RewardClaimedAndStaked",
    type: "event"
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "paused",
        type: "bool"
      }
    ],
    name: "ClaimPauseUpdated",
    type: "event"
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "paused",
        type: "bool"
      }
    ],
    name: "SyncPauseUpdated",
    type: "event"
  }
];


/* =====================================================
   NC REWARD VAULT V1
===================================================== */

const REWARD_VAULT_ABI = [
  {
    inputs: [],
    name: "NC",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "rewardCore",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "rewardStaking",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "availableRewardBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "distributionPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "totalRewardDistributed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "totalStakeTransactions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "userRewardDistributed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "getVaultInfo",
    outputs: [
      {
        internalType: "address",
        name: "ncToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "core",
        type: "address"
      },
      {
        internalType: "address",
        name: "staking",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "ncBalance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "distributed",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "stakeTransactions",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "paused",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "canFundReward",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "fundReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "bool",
        name: "paused",
        type: "bool"
      }
    ],
    name: "setDistributionPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "withdrawNC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "withdrawAllNC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "paused",
        type: "bool"
      }
    ],
    name: "DistributionPauseUpdated",
    type: "event"
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "RewardFunded",
    type: "event"
  }
];


/* =====================================================
   NC REWARD STAKING V1
===================================================== */

const REWARD_STAKING_ABI = [
  {
    inputs: [],
    name: "NC",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "rewardVault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "lockDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "totalPrincipalLocked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "totalPrincipalStaked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "totalWithdrawn",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [],
    name: "surplusNC",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "stakeLotsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "lotIndex",
        type: "uint256"
      }
    ],
    name: "getStakeLot",
    outputs: [
      {
        internalType: "uint256",
        name: "principal",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "unlockAt",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "withdrawn",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "matured",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "remainingSeconds",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "startIndex",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256"
      }
    ],
    name: "getStakeLots",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "principal",
            type: "uint256"
          },
          {
            internalType: "uint64",
            name: "startedAt",
            type: "uint64"
          },
          {
            internalType: "uint64",
            name: "unlockAt",
            type: "uint64"
          },
          {
            internalType: "bool",
            name: "withdrawn",
            type: "bool"
          }
        ],
        internalType: "struct NCRewardStakingV1.StakeLot[]",
        name: "lots",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "userStakeSummary",
    outputs: [
      {
        internalType: "uint256",
        name: "totalLots",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "activeLots",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "withdrawnLots",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "activePrincipal",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "maturedPrincipal",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "withdrawableAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "lotIndex",
        type: "uint256"
      }
    ],
    name: "timeUntilUnlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "lotIndex",
        type: "uint256"
      }
    ],
    name: "isMatured",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "lotIndex",
        type: "uint256"
      }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "lotIndices",
        type: "uint256[]"
      }
    ],
    name: "withdrawMany",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "startIndex",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "maxLots",
        type: "uint256"
      }
    ],
    name: "withdrawMatured",
    outputs: [
      {
        internalType: "uint256",
        name: "withdrawnAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "processedLots",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "newDuration",
        type: "uint256"
      }
    ],
    name: "setLockDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "withdrawSurplusNC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "lotIndex",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "principal",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlockAt",
        type: "uint256"
      }
    ],
    name: "RewardStaked",
    type: "event"
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "lotIndex",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "StakeWithdrawn",
    type: "event"
  }
];


/* =====================================================
   GLOBAL EXPORT
===================================================== */

window.NC_TOKEN_ABI = NC_TOKEN_ABI;
window.LEGACY_CORE_ABI = LEGACY_CORE_ABI;
window.REWARD_CORE_ABI = REWARD_CORE_ABI;
window.REWARD_VAULT_ABI = REWARD_VAULT_ABI;
window.REWARD_STAKING_ABI = REWARD_STAKING_ABI;
