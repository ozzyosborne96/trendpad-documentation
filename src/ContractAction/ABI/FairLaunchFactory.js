export const FairLaunchFactory = [
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
        "internalType": "address",
        "name": "newFeeWallet",
        "type": "address"
      }
    ],
    "name": "FeeWalletUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "TrendPool",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "rewardToken",
        "type": "address"
      }
    ],
    "name": "IDOCreated",
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
        "internalType": "uint256",
        "name": "newfeePercent",
        "type": "uint256"
      }
    ],
    "name": "feePercentUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "TrendPools",
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
    "inputs": [],
    "name": "buyBackManagerAddress",
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
        "internalType": "struct ITrendFairLaunchPool.SaleInfo",
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
        "internalType": "struct ITrendFairLaunchPool.Timestamps",
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
        "internalType": "struct ITrendFairLaunchPool.DEXInfo",
        "name": "_dexInfo",
        "type": "tuple"
      },
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
        "internalType": "struct ITrendFairLaunchPool.VestingInfo",
        "name": "_vestingInfo",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_lokerFactoryAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_affiliateRate",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_buyBackPercent",
        "type": "uint8"
      }
    ],
    "name": "createFairLaunch",
    "outputs": [],
    "stateMutability": "payable",
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
        "internalType": "struct ITrendFairLaunchPool.SaleInfo",
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
        "internalType": "struct ITrendFairLaunchPool.Timestamps",
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
        "internalType": "struct ITrendFairLaunchPool.DEXInfo",
        "name": "_dexInfo",
        "type": "tuple"
      },
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
        "internalType": "struct ITrendFairLaunchPool.VestingInfo",
        "name": "_vestingInfo",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_lokerFactoryAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_affiliateRate",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_buyBackPercent",
        "type": "uint8"
      }
    ],
    "name": "createFairLaunchERC20",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fairLaunchERC20TrendPoolImplementation",
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
    "name": "fairLaunchTrendPoolImplementation",
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
    "name": "getBuyBackManagerAddress",
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
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lpPercent",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "decimals",
        "type": "uint8"
      }
    ],
    "name": "getFairLaunchTokenAmount",
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
    "name": "getFairLaunchTrendPoolImplementation",
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
    "name": "getFeePercent",
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
    "name": "getFeeWallet",
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
    "name": "getTrendPools",
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
    "inputs": [],
    "name": "getTrendPoolsCount",
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
    "name": "getUserPoolCount",
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
    "name": "getUserPools",
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
        "internalType": "uint256",
        "name": "_feePercent",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_feeWallet",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_platformFee",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_fairLaunchPoolAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_fairLaunchERC20PoolAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_buyBackManagerAddress",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "inputs": [],
    "name": "platformFee",
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
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_buyBackManagerAddress",
        "type": "address"
      }
    ],
    "name": "setBuyBackManagerAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newfeePercent",
        "type": "uint256"
      }
    ],
    "name": "setFeePercent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newFeeWallet",
        "type": "address"
      }
    ],
    "name": "setFeeWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_platformFee",
        "type": "uint256"
      }
    ],
    "name": "setPlatformFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_implementation",
        "type": "address"
      }
    ],
    "name": "setTrendERC20PoolImplementation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_implementation",
        "type": "address"
      }
    ],
    "name": "setTrendPoolImplementation",
    "outputs": [],
    "stateMutability": "nonpayable",
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
  }
];
