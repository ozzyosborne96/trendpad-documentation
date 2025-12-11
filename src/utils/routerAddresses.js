export const routerAdd = {
  56: {
    name: "BSC Mainnet",
    nativeToken: "BNB",
    routerNames: ["PancakeSwap"],
    tokens: {
      BUSD: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      USDT: "0x55d398326f99059fF775485246999027B3197955",
      USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    explorer: "https://bscscan.com",
    RPC_URL: `https://bnb-mainnet.g.alchemy.com/v2/R52TUu0rvkJjox_lAAYqf`,
    addresses: {
      AirDropFactoryContractAddress:
        "0xffbfd16cecdf19946af2a1f45d020558675ad361",
      FAIRLAUNCHFACTORYDDRESS: "0x7fb4b7872be0a7b44c9796b28165e29b4fd45716",
      LAUNCHPADCONTRACTADDRESSFACTORY:
        "0x814431eB4527337b3A2559fa16E21a566A99d9dc",
      MultiSenderContractAddress: "0x311533d8403dcead2bb38cf84d1fc891103f3b21",
      LockTokenContractAddress: "0x2226016e0b77a90c5ab35faeb8d395000ecc6876",
      BUYBACKADDRESS: "0xced7d9948737814fa935e6762312d9dd1fa95ba8",
    },
  },
  97: {
    name: "BSC Testnet",
    nativeToken: "tBNB",
    nativeTokenAddress: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    routerNames: ["PancakeSwap"],
    tokens: {
      BUSD: "0xCC965d76976345D6765CFE9181AFf5BdA1272aAB",
      USDT: "0xdBc5a5edF4E43553023C9a5B5b35c0ce410459B6",
      USDC: "0xC790e1b37B00dac056Ad92De1E14FcecE8ed77Dd",
      WBNB: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    },
    router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
    factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
    explorer: "https://testnet.bscscan.com/address",
    RPC_URL: "https://bnb-testnet.g.alchemy.com/v2/R52TUu0rvkJjox_lAAYqf",
    addresses: {
      AirDropFactoryContractAddress:
        "0xaED15e74124240577Fc6DD2944F2cFC360C2f49B",
      FAIRLAUNCHFACTORYDDRESS: "0x7fb4b7872be0a7b44c9796b28165e29b4fd45716",
      LAUNCHPADCONTRACTADDRESSFACTORY:
        "0xfb49Ae650f86EF7EE375B86C9ef31A29338980c0",
      MultiSenderContractAddress: "0x3b4feE1d95532c508b03C133cabd985231630FA1",
      LockTokenContractAddress: "0x880674380d2818dE6B0b642Ca4D995C20A51D7B3",
      BUYBACKADDRESS: "0xced7d9948737814fa935e6762312d9dd1fa95ba8",
    },
  },
  1: {
    name: "Ethereum Mainnet",
    nativeToken: "ETH",
    routerNames: ["UniSwap"],
    tokens: {
      USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    router: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    factory: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    explorer: "https://etherscan.io",
    RPC_URL: "https://eth.llamarpc.com",
  },
  137: {
    name: "Polygon Mainnet",
    nativeToken: "POL",
    routerNames: ["UniSwap", "QuickSwap"],
    tokens: {
      USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    factory: "0x5757371414417b8c6caad45baef941abc7d3ab32",
    explorer: "https://polygonscan.com",
    RPC_URL: `https://polygon-mainnet.infura.io/v3/493da47ef9894c898ed91c1c55930cb9`,
    addresses: {
      AirDropFactoryContractAddress:
        "0x4442CD42c5C715A95455964E3C027A9F369a019F",
      FAIRLAUNCHFACTORYDDRESS: "0x2226016e0B77a90C5Ab35FaeB8d395000ECC6876",
      LAUNCHPADCONTRACTADDRESSFACTORY:
        "0x4C63BbcC40b72116F6d779AFc093fbB1ac3FDe9b",
      MultiSenderContractAddress: "0x99CcACAb7Bd014fb675277A37fC8A2907c59Fd08",
      LockTokenContractAddress: "0x1C4D309454714C0799EEeA042fDdb9A6100C68C3",
      BUYBACKADDRESS: "0x51CbB68173fB0c6740ce7336A3aE7cFE8C12F1a6",
    },
  },
  43114: {
    name: "Avalanche Mainnet",
    nativeToken: "AVAX",
    routerNames: ["UniSwap", "Traderjoexyz"],

    tokens: {
      USDT: "0xc7198437980c041c805a1edcba50c1ce5db95118",
      USDC: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      WAVAX: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    },
    router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
    factory: "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10",
    explorer: "https://snowtrace.io",
    RPC_URL: "https://api.avax.network/ext/bc/C/rpc",
  },
  42161: {
    name: "Arbitrum One",
    nativeToken: "ETH",
    routerNames: ["UniSwap", "SushiSwap"],

    tokens: {
      USDT: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      WETH: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    },
    router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
    factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
    explorer: "https://arbiscan.io",
    RPC_URL: "https://arb1.arbitrum.io/rpc",
  },
  10: {
    name: "Optimism",
    nativeToken: "ETH",
    routerNames: ["UniSwap"],

    tokens: {
      USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      USDC: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      WETH: "0x4200000000000000000000000000000000000006",
    },
    router: "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2",
    factory: "0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf",
    explorer: "https://optimistic.etherscan.io",
    RPC_URL: "https://mainnet.optimism.io",
    addresses: {
      AirDropFactoryContractAddress:
        "0x19c6b0d50A37224781029AD7419CbC6084F33433",
      FAIRLAUNCHFACTORYDDRESS: "0x97115a16D396dCeabF3185C76f78e7079001edE2",
      LAUNCHPADCONTRACTADDRESSFACTORY:
        "0x9d2e92011BdD304500635b21D4f7278ecB0CB8B2", // ✅ Auto-deployed 2025-12-11
      MultiSenderContractAddress: "0x1B525d81B899De587cba87814Aab053a47981cC1",
      LockTokenContractAddress: "0x09f21A77589dD28D3E42d932D065D6FC753f05c5",
      BUYBACKADDRESS: "0x5Ad6522aae0C6f15d4cE04CccB89f6F782c09918",
    },
  },
  8453: {
    name: "Base",
    nativeToken: "ETH",
    routerNames: ["UniSwap", "QuickSwap"],

    tokens: {
      USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      WETH: "0x4200000000000000000000000000000000000006",
    },
    router: "0x0000000000000000000000000000000000000000",
    factory: "0x0000000000000000000000000000000000000000",
    explorer: "https://basescan.org",
    RPC_URL: "https://mainnet.base.org",
  },
  42220: {
    name: "Celo",
    nativeToken: "CELO",
    routerNames: ["Ubeswap", "SushiSwap"],

    tokens: {
      USDT: "0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e",
      USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      CUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
      WETH: "0xD221812de1BD094f35587EE8E174B07B6167D9Af",
    },
    router: "0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121",
    factory: "0x62d5b84bE28a183aBB507E125B384122D2C25fAE",
    explorer: "https://celoscan.io",
    RPC_URL: `https://celo-mainnet.g.alchemy.com/v2/x5ZY1vXAt0hIYJRz5sGBh`,
    addresses: {
      AirDropFactoryContractAddress:
        "0xb38C59466878fD5b64D3C22198082EABd35c9d9B",
      FAIRLAUNCHFACTORYDDRESS: "0x4C63BbcC40b72116F6d779AFc093fbB1ac3FDe9b",
      LAUNCHPADCONTRACTADDRESSFACTORY:
        "0x1C4D309454714C0799EEeA042fDdb9A6100C68C3",
      MultiSenderContractAddress: "0xf302042aB2A6F7954eF17f39b937D2f3B728922c",
      LockTokenContractAddress: "0x51cbb68173fb0c6740ce7336a3ae7cfe8c12f1a6",
      BUYBACKADDRESS: "0xF3FdAf02bf47f9b0C1FcFecFCAa71107CdB919Dd",
    },
  },
  250: {
    name: "Fantom Opera",
    nativeToken: "FTM",
    routerNames: ["UniSwap", "QuickSwap"],

    tokens: {
      USDT: "0x049d68029688eabf473097a2fc38ef61633a3c7a",
      USDC: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
      WFTM: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    },
    router: "0xf491e7b69e4244ad4002bc14e878a34207e38c29",
    factory: "0xbc2F16B2e101B2e7C71b3e0f83cdaC5dc915F6f3",
    explorer: "https://ftmscan.com",
    RPC_URL: "https://rpc.ftm.tools",
  },
  11155111: {
    name: "Sepolia Testnet",
    nativeToken: "ETH",
    nativeTokenAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    routerNames: ["UniSwap", "QuickSwap"],

    tokens: {
      USDT: "0x9a79ABcaaD66B4407B56B4F588cbd2Eeba9b1Dfe",
      USDC: "0xe2F141d58656d3270F80902eefE4cA37913C51A9",
      WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    },
    router: "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3",
    factory: "0xF62c03E08ada871A0bEb309762E260a7a6a880E6 ",
    explorer: "https://sepolia.etherscan.io/address",
    RPC_URL:
      "https://eth-sepolia.g.alchemy.com/v2/r87ZFPUelTc_ijvvMrq9yMKQxAfph5LK",
    addresses: {
      AirDropFactoryContractAddress:
        "0x8C8063c20a7938153758691f4786DB23b6edbC63", // ✅ Auto-deployed 2025-12-10
      FAIRLAUNCHFACTORYDDRESS: "0x0eBf33D49939A3b91D7089747aC44D7649296dD6", // ✅ Fixed on 2025-12-10
      LAUNCHPADCONTRACTADDRESSFACTORY:
        "0x87817ADf3Ff7829007031cA09B8BEADC884d6caD", // ✅ Auto-deployed 2025-12-10
      MultiSenderContractAddress: "0x41d735bEa1B390E562376dAa3DcD0384971Be769", // ✅ Deployed on 2025-12-10 16:26
      LockTokenContractAddress: "0x90209037F59Ed14704Fed8733758325e35FaaBc3", // ✅ Deployed on 2025-12-10 16:26
      BUYBACKADDRESS: "0x39B3aDbbC28899Bac687A7C184461730CDDa081e", // ✅ Deployed on 2025-12-10 16:26
    },
  },
  80002: {
    name: "Polygon Amoy Testnet",
    nativeToken: "MATIC",
    routerNames: ["UniSwap", "QuickSwap"],

    tokens: {
      USDT: "0x0000000000000000000000000000000000001010",
      USDC: "0x0000000000000000000000000000000000000000",
      WMATIC: "0x0000000000000000000000000000000000001010",
    },
    router: "0x0000000000000000000000000000000000000000",
    factory: "0x0000000000000000000000000000000000000000",
    explorer: "https://amoy.polygonscan.com",
    RPC_URL: "https://rpc-amoy.polygon.technology",
  },
};
