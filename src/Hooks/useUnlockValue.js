import { useQuery } from "@tanstack/react-query";
import { withDrawAbleTokenHandler } from "../ContractAction/TrendLockAction"; // adjust path accordingly
import { ethers } from "ethers";

export const useUnlockValue = (lockId, decimals = 18) => {
  return useQuery({
    queryKey: ["unlockValue", lockId],
    queryFn: async () => {
      const rawValue = await withDrawAbleTokenHandler(lockId);
      const formatted = ethers.formatUnits(rawValue.toString(), decimals);
      return formatted; // formatted value returned directly
    },
    enabled: !!lockId,
    refetchInterval: 10000, // optional
    staleTime: 5000,
  });
};
