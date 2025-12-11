import { useWalletClient } from "wagmi";
import { ethers } from "ethers";

const useGetProvider = () => {
  const { data: walletClient } = useWalletClient(); // Get the wallet client

  if (!walletClient) return null;

  // Convert WalletClient to an Ethers v6 signer
  const provider = new ethers.BrowserProvider(walletClient, "any");
  return provider;
};

export default useGetProvider;
