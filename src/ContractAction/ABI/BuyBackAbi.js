export const BuybackAbi = [
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
        "indexed": true,
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "BuybackAndBurn",
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
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "allowed",
        "type": "bool"
      }
    ],
    "name": "PermissionUpdated",
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
        "indexed": true,
        "internalType": "address",
        "name": "tokenA",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "percentage",
        "type": "uint8"
      }
    ],
    "name": "PoolConfigured",
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
        "name": "amount",
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
    "name": "amountPerBuyBackForNative",
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
    "name": "amountPerBuyBackForStable",
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
    "name": "authorizedAddress",
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
    "name": "buyBackAmount",
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
        "name": "_pool",
        "type": "address"
      }
    ],
    "name": "buybackAndBurn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "demo",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_pool",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "finalizeBuyBackConfig",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBuyBackDefaultInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_amountPerBuyBack",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amountPerBuyBackForStable",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minBuyBackDeley",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxBuyBackDeley",
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
        "name": "_pool",
        "type": "address"
      }
    ],
    "name": "getBuyBackRemainAmount",
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
        "name": "_pool",
        "type": "address"
      }
    ],
    "name": "getPoolBuyBackInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenBAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "routerAddress",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "percentage",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "totalBuyBackAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "boughtBackAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "AmountPerBuyBack",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minBuyBackDeley",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxBuyBackDeley",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nextbuyBackTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastbuyBackTime",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isConfigured",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isNative",
            "type": "bool"
          }
        ],
        "internalType": "struct BuyBackManagerV2.BuyBackConfig",
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
        "name": "_amountPerBuyBackNative",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amountPerBuyBackStable",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minBuyBackDeley",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxBuyBackDeley",
        "type": "uint256"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "name": "isAllowed",
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
    "name": "maxBuyBackDeley",
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
    "name": "minBuyBackDeley",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "poolConfig",
    "outputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenBAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "routerAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "percentage",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "totalBuyBackAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "boughtBackAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "AmountPerBuyBack",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minBuyBackDeley",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxBuyBackDeley",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nextbuyBackTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastbuyBackTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isConfigured",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isNative",
        "type": "bool"
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
        "internalType": "uint256",
        "name": "_count",
        "type": "uint256"
      }
    ],
    "name": "setBuyBackCount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_pool",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenAAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenBAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_routerAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_percentage",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "_totalBuyBackAmount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isNativeStatus",
        "type": "bool"
      },
      {
        "internalType": "uint8",
        "name": "decimals",
        "type": "uint8"
      }
    ],
    "name": "setBuybackConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amountPerBuyBackNative",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amountPerBuyBackStable",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minBuyBackDeley",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxBuyBackDeley",
        "type": "uint256"
      }
    ],
    "name": "setGlobalBuyBackParams",
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
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];
