import { ethers } from "ethers";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import { ERC20TokenAbi } from "../ContractAction/ABI/ERC20Token";
import { usePublicClient } from "wagmi";
import { getProvider } from "../ContractAction/ContractDependency";
import { routerAdd } from "../utils/routerAddresses";

const useGetTokenDetails = () => {
  const publicClient = usePublicClient();
  const accountAddress = useCurrentAccountAddress();

  // Function to fetch token details
  const fetchTokenDetails = async (tokenContractAddress, chainId) => {
    if (!tokenContractAddress) {
      console.error("Missing token contract address.");
      return null;
    }

    try {
      let provider = await getProvider();

      // If chainId is provided and valid, use that chain's RPC
      if (chainId && routerAdd[chainId]) {
        const config = routerAdd[chainId];
        if (config.RPC_URL) {
          provider = new ethers.JsonRpcProvider(config.RPC_URL);
        }
      }

      if (!provider) {
        // Fallback to browser provider from wagmi client if simple provider fails
        provider = new ethers.BrowserProvider({
          request: async ({ method, params }) => {
            if (method === "eth_chainId") {
              return `0x${publicClient.chain.id.toString(16)}`;
            }
            return await publicClient.request({ method, params });
          },
        });
      }

      const contract = new ethers.Contract(
        tokenContractAddress,
        ERC20TokenAbi,
        provider
      );

      // Use a default account address if not connected, just for reading basic info
      const targetAddress = accountAddress || ethers.ZeroAddress;

      // Helper to safely execute contract calls
      const safeCall = async (callName, promise, fallbackValue) => {
        try {
          return await promise;
        } catch (error) {
          console.warn(`Failed to fetch ${callName}:`, error);
          return fallbackValue;
        }
      };

      const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
        safeCall("name", contract.name(), "Unknown Token"),
        safeCall("symbol", contract.symbol(), "???"),
        safeCall("decimals", contract.decimals(), 18n), // Default to BigInt 18
        safeCall("totalSupply", contract.totalSupply(), 0n),
        safeCall("balance", contract.balanceOf(targetAddress), 0n),
      ]);

      return {
        name,
        symbol,
        decimals: Number(decimals), // contract.decimals returns bigint usually
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        balance: Number(ethers.formatUnits(balance, decimals)).toFixed(3),
      };
    } catch (error) {
      console.error("Error fetching token details:", error);
      return null;
    }
  };

  return fetchTokenDetails;
};

export default useGetTokenDetails;
