export const PresaleAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "UUPSUnauthorizedCallContext",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
    ],
    name: "UUPSUnsupportedProxiableUUID",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newFeeWallet",
        type: "address",
      },
    ],
    name: "FeeWalletUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "TrendPool",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "rewardToken",
        type: "address",
      },
    ],
    name: "IDOCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newfeePercent",
        type: "uint256",
      },
    ],
    name: "feePercentUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "TrendPools",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "Currency",
            type: "address",
          },
          {
            internalType: "address",
            name: "rewardToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "presaleToken",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityToken",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "softCap",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hardCap",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minEthPayment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxEthPayment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "listingPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lpInterestRate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "burnType",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "affiliation",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isEnableWhiteList",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isVestingEnabled",
            type: "bool",
          },
        ],
        internalType: "struct ITrendPool.SaleInfo",
        name: "_finInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
        ],
        internalType: "struct ITrendPool.Timestamps",
        name: "_timestamps",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "factory",
            type: "address",
          },
          {
            internalType: "address",
            name: "weth",
            type: "address",
          },
        ],
        internalType: "struct ITrendPool.DEXInfo",
        name: "_dexInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "TGEPercent",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "cycleTime",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "releasePercent",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
        ],
        internalType: "struct ITrendPool.VestingInfo",
        name: "_vestingInfo",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_lockerFactoryAddress",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_affiliateRate",
        type: "uint8",
      },
    ],
    name: "createIDO",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "Currency",
            type: "address",
          },
          {
            internalType: "address",
            name: "rewardToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "presaleToken",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityToken",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "softCap",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hardCap",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minEthPayment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxEthPayment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "listingPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lpInterestRate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "burnType",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "affiliation",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isEnableWhiteList",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isVestingEnabled",
            type: "bool",
          },
        ],
        internalType: "struct ITrendERC20Pool.SaleInfo",
        name: "_finInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
        ],
        internalType: "struct ITrendERC20Pool.Timestamps",
        name: "_timestamps",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "factory",
            type: "address",
          },
          {
            internalType: "address",
            name: "weth",
            type: "address",
          },
        ],
        internalType: "struct ITrendERC20Pool.DEXInfo",
        name: "_dexInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "TGEPercent",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "cycleTime",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "releasePercent",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
        ],
        internalType: "struct ITrendERC20Pool.VestingInfo",
        name: "_vestingInfo",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_lockerFactoryAddress",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_affiliateRate",
        type: "uint8",
      },
    ],
    name: "createIDOERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "feePercent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeWallet",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "oneTokenInWei",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
    ],
    name: "getTokenAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getTrendPools",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserPoolCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserPools",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feePercent",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_feeWallet",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newfeePercent",
        type: "uint256",
      },
    ],
    name: "setFeePercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newFeeWallet",
        type: "address",
      },
    ],
    name: "setFeeWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_implementation",
        type: "address",
      },
    ],
    name: "setTrendERC20PoolImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_implementation",
        type: "address",
      },
    ],
    name: "setTrendPoolImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "trendERC20PoolImplementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "trendPoolImplementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
