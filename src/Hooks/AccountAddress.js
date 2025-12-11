import { useAccount } from "wagmi";

export const useCurrentAccountAddress = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected) return "Not Connected";
  return address || "Loading...";
};
