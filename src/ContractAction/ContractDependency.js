import { ethers } from "ethers";
import { fairgetBuyBackDetails } from "../ContractAction/FairLaunchPadAction";
import { routerAdd } from "../utils/routerAddresses";
import { currencyData } from "../utils/currency";
import { routerInfo } from "../utils/routerNames";
import { ERC20TokenAbi } from "../ContractAction/ABI/ERC20Token";
import { config } from "../wagmiConfig";
import {
  getAccount,
  getChainId,
  getPublicClient,
  getWalletClient,
} from "@wagmi/core";

export const BASE_URL = "https://trendpad.io/api";

/**
 * Adapter to convert a Viem Public Client to an Ethers.js v6 Provider.
 */
export function clientToProvider(client) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new ethers.FallbackProvider(
      transport.transports.map(
        ({ value }) => new ethers.JsonRpcProvider(value?.url, network)
      )
    );
  return new ethers.JsonRpcProvider(transport.url, network);
}

/**
 * Adapter to convert a Viem Wallet Client to an Ethers.js v6 Signer.
 */
export function clientToSigner(client) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  const signer = new ethers.JsonRpcSigner(provider, account.address);
  return signer;
}

export const getSignerIfConnected = async () => {
  try {
    const { isConnected } = getAccount(config);
    if (!isConnected) {
      console.warn("No wallet connected.");
      return null;
    }
    const walletClient = await getWalletClient(config);
    if (!walletClient) return null;
    return clientToSigner(walletClient);
  } catch (error) {
    console.error("Error fetching signer:", error);
    return null;
  }
};

export const getChainInfo = async () => {
  try {
    const chainId = getChainId(config);
    if (!chainId) return null;
    // We can fetch the chain name from the config chains if needed,
    // but just returning ID is often enough for the logic using this.
    // For compatibility with previous return shape:
    const chain = config.chains.find((c) => c.id === chainId);
    return {
      chainId: Number(chainId),
      chainName: chain?.name || "Unknown",
    };
  } catch (error) {
    console.error("Error fetching chain info:", error);
    return null;
  }
};

export const getProvider = async () => {
  try {
    const publicClient = getPublicClient(config);
    if (!publicClient) {
      // Fallback: try to create a provider from RPC_URL if publicClient fails
      // (though publicClient should be available if config is good)
      const chainInfo = await getNetworkConfig();
      if (chainInfo?.RPC_URL) {
        return new ethers.JsonRpcProvider(chainInfo.RPC_URL);
      }
      throw new Error("No provider available");
    }
    return clientToProvider(publicClient);
  } catch (error) {
    console.error("❌ Failed to connect to RPC provider:", error.message);
    throw error;
  }
};

export const getTokenBalance = async (tokenAddress, walletAddress) => {
  if (!ethers.isAddress(tokenAddress) || !ethers.isAddress(walletAddress)) {
    throw new Error("Invalid token or wallet address");
  }
  try {
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      provider
    );
    const balance = await tokenContract.balanceOf(walletAddress);
    let decimals = 18;
    try {
      decimals = await tokenContract.decimals();
    } catch (decErr) {
      console.warn("Failed to fetch decimals, using default 18:", decErr);
    }
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return null;
  }
};

export const getEthBalance = async (
  walletAddress,
  isNative,
  currencyAddress
) => {
  try {
    console.log("getEthBalance", walletAddress, isNative, currencyAddress);
    const provider = await getProvider();
    if (!ethers.isAddress(walletAddress)) {
      throw new Error("Invalid wallet address");
    }
    if (!isNative && currencyAddress) {
      // Note: getTokenBalance already gets provider internally, but we can pass it if we refactor getTokenBalance too.
      // Current getTokenBalance implementation above calls getProvider() again which is fine.
      const tokenBalance = await getTokenBalance(
        currencyAddress,
        walletAddress
      );
      return parseFloat(tokenBalance).toFixed(4);
    }
    const balanceWei = await provider.getBalance(walletAddress);
    const balanceEth = ethers.formatEther(balanceWei);
    console.log(`Balance of ${walletAddress}: ${balanceEth} ETH`);
    return parseFloat(balanceEth).toFixed(4);
  } catch (error) {
    console.error("Error fetching balance:", error.message);
    return null;
  }
};

export const fairgetBuyBackDetailsHandler = async (currency) => {
  try {
    const details = await fairgetBuyBackDetails(currency);
    console.log("fairgetBuyBackDetails", details);
    return details;
  } catch (error) {}
};

export const getNetworkConfig = async () => {
  // Use Wagmi's chainId so it is reactive/current
  const { chainId } = await getChainInfo();
  const network = routerAdd[chainId];

  // console.log("ChainId from wallet:", chainId); // Optional debug

  if (!network) {
    console.warn(`Chain ID ${chainId} not supported.`);
    return null;
  }
  // Destructure and return explicitly to match previous shape
  const {
    name,
    nativeToken,
    tokens,
    router,
    factory,
    explorer,
    addresses = null,
    nativeTokenAddress,
    routerNames,
    RPC_URL,
  } = network;
  return {
    chainId,
    name,
    nativeToken,
    tokens,
    router,
    factory,
    explorer,
    addresses,
    nativeTokenAddress,
    routerNames,
    RPC_URL,
  };
};

export const getCurrencyAddress = async (selectedCurrency) => {
  const { chainId } = await getChainInfo();
  if (!routerAdd || !chainId || !selectedCurrency) return null;

  const config = routerAdd[chainId];
  if (!config) return null;

  const isNativeToken = selectedCurrency === config.nativeToken;
  if (isNativeToken) {
    return "0x0000000000000000000000000000000000000000";
  }

  return config.tokens?.[selectedCurrency] ?? null;
};

export const getPoolFee = async () => {
  try {
    const { chainId } = await getChainInfo();
    const poolFee = currencyData[chainId]?.poolFeeAmount;

    if (!poolFee) {
      console.warn(`No pool fee found for chain ID: ${chainId}`);
      return null;
    }

    return poolFee;
  } catch (error) {
    console.error("Error fetching pool fee:", error);
    return null;
  }
};

export const isNativeTokenHandler = async (contractAddress) => {
  try {
    console.log("currencyaddr", contractAddress);
    const config = await getNetworkConfig();
    const isNativeToken =
      config.nativeToken?.toLowerCase() === contractAddress.toLowerCase();

    return isNativeToken;
  } catch (error) {
    console.error("Error in isNativeTokenHandler:", error);
    return false;
  }
};

export const getTokenDecimals = async (tokenAddress, chainId) => {
  try {
    if (!ethers.isAddress(tokenAddress)) {
      throw new Error("Invalid token address.");
    }
    let provider = await getProvider();

    // If chainId is provided and valid, use that chain's RPC
    if (chainId && routerAdd[chainId]) {
      const config = routerAdd[chainId];
      if (config.RPC_URL) {
        provider = new ethers.JsonRpcProvider(config.RPC_URL);
      }
    }

    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      provider
    );
    const decimals = await tokenContract.decimals();
    return Number(decimals);
  } catch (error) {
    console.error("Error fetching token decimals:", error);
    return 18;
  }
};

export const getTokenDetails = async (tokenAddress) => {
  try {
    console.log("getTokenDetails", tokenAddress);
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      provider
    );
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.totalSupply(),
    ]);
    return {
      name,
      symbol,
      decimals,
      totalSupply: ethers.formatUnits(totalSupply, decimals),
    };
  } catch (error) {
    console.error("Error fetching token details:", error);
    return null;
  }
};

export const getCurrentAccount = async () => {
  // Use Wagmi to get account
  const { address, isConnected } = getAccount(config);
  if (!isConnected || !address) {
    throw new Error("Wallet not connected.");
  }
  return address;
};

export const getRouterDetails = (dexName, chainId) => {
  try {
    if (!dexName || !chainId) {
      console.warn("Missing dexName or chainId");
      return null;
    }
    const chainConfig = routerInfo[chainId];
    if (!chainConfig) {
      console.warn(`No config found for chain ID: ${chainId}`);
      return null;
    }
    const dexConfig = chainConfig[dexName];
    if (!dexConfig) {
      console.warn(
        `No config found for DEX: ${dexName} on chain ID: ${chainId}`
      );
      return null;
    }
    return dexConfig;
  } catch (error) {
    console.error("Error in getRouterDetails:", error);
    return null;
  }
};

export const chainSwitchNetwork = async (chainId) => {
  // Rely on Wagmi/RainbowKit for switching, but if we must do it manually via the connector:
  // This function is often calling window.ethereum directly in legacy code.
  // Better to use switchChain from @wagmi/core if possible, or use the hook in the UI.
  // For now, let's keep it compatible but use standard request if provider suggests it,
  // or try using Wagmi action if available.

  // NOTE: In strict non-window.ethereum environments, this legacy method fails.
  // We should ideally use `switchChain` from wagmi/core.

  try {
    const { switchChain } = await import("@wagmi/core");
    // Dynamic import to avoid circular dep if any, or just import at top.
    // Actually, let's just use the imported config.
    const result = await switchChain(config, { chainId: Number(chainId) });
    console.log("Switched to chain", result);
  } catch (error) {
    console.error("Error switching network:", error);
    // Fallback to window.ethereum if it exists (desktop)
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const hexChainId = `0x${Number(chainId).toString(16)}`;
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hexChainId }],
        });
      } catch (err) {
        console.error("Fallback switch failed", err);
      }
    }
  }
};

export async function hasEnoughForTx(txParams) {
  try {
    const provider = await getProvider();
    const signer = await getSignerIfConnected();
    if (!signer) return false;

    const fromAddress = await signer.getAddress();
    console.log("From Address:", fromAddress);

    const balanceWei = await provider.getBalance(fromAddress);
    const balanceEth = Number(ethers.formatEther(balanceWei));
    console.log("Wallet Balance (ETH):", balanceEth);

    const gasLimit = await provider.estimateGas({
      from: fromAddress,
      ...txParams,
    });
    console.log("Estimated Gas Limit:", gasLimit.toString());

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    console.log("Current Gas Price (ETH):", ethers.formatEther(gasPrice));

    const gasFeeEth = Number(ethers.formatEther(gasLimit * gasPrice));
    console.log("Estimated Gas Fee (ETH):", gasFeeEth);

    const valueEth = txParams.value
      ? Number(ethers.formatEther(txParams.value))
      : 0;
    console.log("Transaction Value (ETH):", valueEth);

    const totalCostEth = valueEth + gasFeeEth;
    console.log("Total Required (ETH):", totalCostEth);

    const canProceed = balanceEth >= totalCostEth;
    console.log("Has Enough for Transaction?", canProceed);
    return canProceed;
  } catch (error) {
    console.error("Error checking balance for transaction:", error);
    return false;
  }
}
