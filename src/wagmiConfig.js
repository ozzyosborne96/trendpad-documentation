// import { base, mainnet, optimism,polygon,arbitrum } from 'wagmi/chains'
// import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// export const config = getDefaultConfig({
//   appName: 'My RainbowKit App',
//   projectId: 'YOUR_PROJECT_ID',
//   chains: [mainnet, polygon, optimism, arbitrum, base],
//   ssr: true, // If your dApp uses server side rendering (SSR)
// });

import { http, createConfig } from "wagmi";
import {
  mainnet,
  optimism,
  polygon,
  avalanche,
  bsc,
  arbitrum,
  celo,
  base,
  fantom,
  bscTestnet,
  sepolia,
} from "wagmi/chains"; // ✅ Import BNB Chain
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.error("Missing VITE_WALLETCONNECT_PROJECT_ID environment variable");
}

export const chains = [
  mainnet,
  optimism,
  polygon,
  avalanche,
  bsc,
  arbitrum,
  celo,
  base,
  fantom,
  bscTestnet,
  sepolia,
];

const { connectors } = getDefaultWallets({
  appName: "TrendPad",
  projectId,
  chains: chains,
});

export const config = createConfig({
  chains: chains, // ✅ Add BNB Chain here as well
  connectors,
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [avalanche.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
    [base.id]: http(),
    [fantom.id]: http(),
    [bscTestnet.id]: http(), // ✅ Add transport for BNB Testnet
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/r87ZFPUelTc_ijvvMrq9yMKQxAfph5LK"
    ),
  },
});
