export const FairLaunchERC20PoolAbi =  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "AddressEmptyCode",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "ERC1967InvalidImplementation",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ERC1967NonPayable",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "FailedCall",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInitialization",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotInitializing",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "SafeERC20FailedOperation",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UUPSUnauthorizedCallContext",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "slot",
          "type": "bytes32"
        }
      ],
      "name": "UUPSUnsupportedProxiableUUID",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "rate",
          "type": "uint8"
        }
      ],
      "name": "AffiliateUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "buybackPercentage",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyBackMangerAddrress",
          "type": "address"
        }
      ],
      "name": "BuyBackUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ContributionRefunded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTimestamp",
          "type": "uint256"
        }
      ],
      "name": "EndTimeUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "version",
          "type": "uint64"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "PoolCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "pool",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "PoolFinalized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        }
      ],
      "name": "SaleTypeChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sponsor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "SponsorRewardClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sponsor",
          "type": "address"
        }
      ],
      "name": "SponsorSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTimestamp",
          "type": "uint256"
        }
      ],
      "name": "TimestampsUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "holder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "currencyAmount",
          "type": "uint256"
        }
      ],
      "name": "TokensDebt",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensRefunded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "holder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "Upgraded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "TGEPercent",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "cycleTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "releasePercent",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        }
      ],
      "name": "VestingUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        }
      ],
      "name": "WhitelistUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "claimTimestamp",
          "type": "uint256"
        }
      ],
      "name": "claimTimeUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "RefundToContributor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "UPGRADE_INTERFACE_VERSION",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_addresses",
          "type": "address[]"
        }
      ],
      "name": "addBatchToWhitelist",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "affiliateInfo",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "poolRefCount",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "RewardPercentage",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "currentReward",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalReferredAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalRewardAmount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "buyBackInfo",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "buybackPercentage",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "buyBackMangerAddrress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancelSale",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimSponsorReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sponser",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "contribute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentTokenRate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dexInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "router",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "factory",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "weth",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "distributeTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "distributed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "distributedTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "factory",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        }
      ],
      "name": "doesLiquidityExist",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "_rate",
          "type": "uint8"
        }
      ],
      "name": "enableAffilate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feePercent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeWallet",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "finalize",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAffilateInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "poolRefCount",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "RewardPercentage",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "currentReward",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalReferredAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalRewardAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.AffiliateInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAffilationPercentage",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllParticipant",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sponsor",
          "type": "address"
        }
      ],
      "name": "getClaimableSponsorReward",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getClaimableTokenAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getClaimedTokenAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sponser",
          "type": "address"
        }
      ],
      "name": "getIsSponsorClaimed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSaleInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "currency",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "saleToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "liquidityToken",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "softCap",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxPay",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lpPercent",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isAffiliatationEnabled",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isEnableWhitelist",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isBuyBackEnabled",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isVestingEnabled",
              "type": "bool"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.SaleInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSaleStatus",
      "outputs": [
        {
          "internalType": "enum TrendFairlaunchERC20PoolV2.SaleStatus",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSaleType",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSponserAddress",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sponser",
          "type": "address"
        }
      ],
      "name": "getSponserReferalAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sponser",
          "type": "address"
        }
      ],
      "name": "getSponserRewardAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTimeStampInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "startTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "claimTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "unlockTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.Timestamps",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_userContribution",
          "type": "uint256"
        }
      ],
      "name": "getTokenPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalInvested",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalParticipantCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getUserInvesmentAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_totalAmount",
          "type": "uint256"
        }
      ],
      "name": "getVestedAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVestingInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "TGEPercent",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "cycleTime",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "releasePercent",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.VestingInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "currency",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "saleToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "liquidityToken",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "softCap",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxPay",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lpPercent",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isAffiliatationEnabled",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isEnableWhitelist",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isBuyBackEnabled",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isVestingEnabled",
              "type": "bool"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.SaleInfo",
          "name": "_saleInfo",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "startTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "claimTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "unlockTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.Timestamps",
          "name": "_timestamps",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "router",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "factory",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "weth",
              "type": "address"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.DEXInfo",
          "name": "_dexInfo",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "_locker",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_feeWallet",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_feePercent",
          "type": "uint256"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isClaimTimeSet",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isPoolCancelled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isPoolFinalize",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "isPoolUser",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isSoftcapReached",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "isUserRefunded",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "locker",
      "outputs": [
        {
          "internalType": "contract ITrendLock",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "participants",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        }
      ],
      "name": "proccessClaim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proxiableUUID",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "publicSaleEanble",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "removeAllWhitelist",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "saleInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "saleToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "liquidityToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "softCap",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxPay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lpPercent",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isAffiliatationEnabled",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isEnableWhitelist",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isBuyBackEnabled",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isVestingEnabled",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "buybackPercentage",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "buyBackMangerAddrress",
              "type": "address"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.BuyBackInfo",
          "name": "_buyBackInfo",
          "type": "tuple"
        }
      ],
      "name": "setBuyBack",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_claimTimestamp",
          "type": "uint256"
        }
      ],
      "name": "setClaimTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_newStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_newEndTime",
          "type": "uint256"
        }
      ],
      "name": "setEndAndStartTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_endTimestamp",
          "type": "uint256"
        }
      ],
      "name": "setPoolEndTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "TGEPercent",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "cycleTime",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "releasePercent",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct TrendFairlaunchERC20PoolV2.VestingInfo",
          "name": "_vestingInfo",
          "type": "tuple"
        }
      ],
      "name": "setVesting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sponeserAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "sponserReward",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "sponsorClaimed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "sponsorReferralSum",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "timestamps",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "claimTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenDecimals",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalInvested",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "upgradeToAndCall",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "debt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "claimed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalInvested",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isRefunded",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vestingInfo",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "TGEPercent",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "cycleTime",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "releasePercent",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "whitelistEnabled",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "whitelistList",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "whitelistedAddresses",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawContribution",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];