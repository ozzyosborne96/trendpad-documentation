import { ethers } from "ethers"; // Default ethers import
import { ERC20TokenAbi } from "../ContractAction/ABI/ERC20Token";
import { TrendLockAbi } from "../ContractAction/ABI/TrendLockABI";
import { DexNameAbi } from "../ContractAction/ABI/DexNameAbi";
import {
  getSignerIfConnected,
  getProvider,
  getNetworkConfig,
  getTokenDecimals,
} from "../ContractAction/ContractDependency";
import {
  createLock,
  createVestingLock,
} from "../TrendLock/ApiTrendLockHandler";
import { routerInfo } from "../utils/routerNames";
import { routerAdd } from "../utils/routerAddresses";
import toast from "react-hot-toast";

export const checkAllowance = async (tokenAddress, amount) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    console.error("Invalid amount:", amount);
    return false;
  }
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    if (!signer) throw new Error("Signer is required!");
    const decimals = await getTokenDecimals(tokenAddress);
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const num = ethers.parseUnits(amount.toString(), decimals);
    const allowance = await tokenContract.allowance(
      await signer.getAddress(),
      config?.addresses?.LockTokenContractAddress
    );
    console.log("allowance", allowance, num, allowance >= num);
    return allowance >= num;
  } catch (error) {
    // if (error.code === "ACTION_REJECTED") {
    //   toast("Transaction rejected by user.", {
    //     icon: "❌",
    //     type: "error",
    //   });
    // } else if (error.code === "CALL_EXCEPTION") {
    //   toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
    //     icon: "❌",
    //     type: "error",
    //   });
    // } else {
    //   toast("Something went wrong! Please try again.", {
    //     icon: "❌",
    //     type: "error",
    //   });
    // }
  }
};

export const approveToken = async (tokenAddress, amount) => {
  try {
    const signer = await getSignerIfConnected();
    const decimals = await getTokenDecimals(tokenAddress);
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const num = ethers.parseUnits(amount.toString(), decimals);
    const config = await getNetworkConfig();
    const tx = await tokenContract.approve(
      config?.addresses?.LockTokenContractAddress,
      num
    );
    await tx.wait();
    console.log("Transaction Hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", {
        icon: "❌",
        type: "error",
      });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast("Something went wrong! Please try again.", {
        icon: "❌",
        type: "error",
      });
    }
  }
};

export const lockToken = async (
  tokenAddress,
  account,
  isLpToken,
  amount,
  lockUntil,
  description
) => {
  try {
    const signer = await getSignerIfConnected();
    console.log("In lock Token function");
    const date = new Date(lockUntil);
    const config = await getNetworkConfig();
    const contract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const decimals = await getTokenDecimals(tokenAddress);
    const num = ethers.parseUnits(amount.toString(), decimals);
    const blockTimestamp = Math.floor(date.getTime() / 1000);
    const tx = await contract.lock(
      account,
      tokenAddress,
      isLpToken,
      num,
      blockTimestamp,
      description
    );
    const receipt = await tx.wait();
    console.log("Transaction Hash:", receipt.hash);
    console.log("Events in Receipt:", receipt.events);
    console.log("Full Receipt:", receipt);
    let lockId = null;
    const iface = new ethers.Interface(TrendLockAbi);
    receipt.logs.forEach((log) => {
      try {
        const parsedLog = iface.parseLog(log);
        console.log("Parsed Log:", parsedLog);
        if (parsedLog.name === "LockAdded") {
          console.log("🎉 LockAdded event detected!");
          lockId = parsedLog.args[0].toString();
          console.log("Lock ID:", lockId);
          console.log("Token Address:", parsedLog.args[1]);
          console.log("Owner Address:", parsedLog.args[2]);
          console.log("Amount:", parsedLog.args[3].toString());
          console.log("Unlock Date:", parsedLog.args[4].toString());
        }
      } catch (error) {
        console.log("Error parsing log:", error);
      }
    });
    const data = {
      Lock_Id: lockId,
      tokenAddress,
      account,
      isLpToken,
      amount,
      blockTimestamp,
      description,
    };
    if (lockId) {
      await createLock(data);
    }
    return {
      txHash: receipt.hash,
      lockId: lockId,
    };
  } catch (error) {
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again.${
          error.reason || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
    return { txHash: null, lockId: null };
  }
};

export const vestingLock = async (
  account,
  tokenAddress,
  isLpToken,
  amount,
  tgeDate,
  tgePercent,
  cycle,
  cyReleasePer,
  description
) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const tgeDateTime = new Date(tgeDate);
    const blockTimestamp = Math.floor(tgeDateTime.getTime() / 1000);
    const tgePerHundred = tgePercent * 100;
    const cyReleasePerHundred = cyReleasePer * 100;
    const decimals = await getTokenDecimals(tokenAddress);
    const num = ethers.parseUnits(amount.toString(), decimals);
    console.log(
      "Vesting Params:",

      cycle
    );
    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const tx = await tokenContract.vestingLock(
      account,
      tokenAddress,
      isLpToken,
      num,
      blockTimestamp,
      tgePerHundred,
      cycle,
      cyReleasePerHundred,
      description
    );
    const receipt = await tx.wait();
    console.log("Transaction Hash:", receipt.hash);
    console.log("Events in Receipt:", receipt.events);
    console.log("Full Receipt:", receipt);
    let lockId = null;
    const iface = new ethers.Interface(TrendLockAbi);
    receipt.logs.forEach((log) => {
      try {
        const parsedLog = iface.parseLog(log);
        console.log("Parsed Log:", parsedLog);
        if (parsedLog.name === "LockAdded") {
          console.log("🎉 LockAdded event detected!");
          lockId = parsedLog.args[0].toString();
          console.log("Lock ID:", lockId);
          console.log("Token Address:", parsedLog.args[1]);
          console.log("Owner Address:", parsedLog.args[2]);
          console.log("Amount:", parsedLog.args[3].toString());
          console.log("Unlock Date:", parsedLog.args[4].toString());
        }
      } catch (error) {
        console.log("Error parsing log:", error);
      }
    });
    const data = {
      Lock_Id: lockId,
      account,
      tokenAddress,
      isLpToken,
      amount,
      blockTimestamp,
      tgePerHundred,
      cycle,
      cyReleasePerHundred,
      description,
    };
    if (lockId) {
      await createVestingLock(data);
    }
    return {
      txHash: receipt.hash,
      lockId: lockId,
    };
  } catch (error) {
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.reason || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
    return { txHash: null, lockId: null };
  }
};

export const tokenTrendLockDetails = async (account) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();

    if (!config?.addresses?.LockTokenContractAddress) {
      console.warn("LockTokenContractAddress not found for this network.");
      return [];
    }

    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const lockDetails = await tokenContract.normalLocksForUser(account);
    console.log("Lock details", lockDetails, account);
    return lockDetails.map((lock) => ({
      lockId: lock[0].toString(),
      tokenAddress: lock[1],
      ownerAddress: lock[2],
      amountLocked: lock[3], // Convert BigInt to Ether string
      unlockDate: new Date(Number(lock[4]) * 1000).toLocaleString(), // Convert BigInt to Number
      // lockExpireDate: new Date(Number(lock[5]) * 1000).toLocaleString(), // Convert BigInt to Number
      logDescription: lock[10],
      tgedate: new Date(Number(lock[5]) * 1000).toLocaleString(),
      tgePercent: Number(lock[6]),
      cycle: Number(lock[7]),
      cycleRelease: Number(lock[8]),
      unLockAmount: ethers.formatUnits(lock[9]),
    }));
  } catch (error) {
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
  }
};

export const tokenLpLockDetails = async (account) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();

    if (!config?.addresses?.LockTokenContractAddress) {
      console.warn("LockTokenContractAddress not found for this network.");
      return [];
    }

    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const lockDetails = await tokenContract.lpLocksForUser(account);
    console.log("Lock details", lockDetails, account);
    return lockDetails.map((lock) => ({
      lockId: lock[0].toString(),
      tokenAddress: lock[1],
      ownerAddress: lock[2],
      amountLocked: ethers.formatUnits(lock[3]), // Convert BigInt to Ether string
      unlockDate: new Date(Number(lock[4]) * 1000).toLocaleString(), // Convert BigInt to Number
      // lockExpireDate: new Date(Number(lock[5]) * 1000).toLocaleString(), // Convert BigInt to Number
      logDescription: lock[10],
      tgedate: new Date(Number(lock[5]) * 1000).toLocaleString(),
      tgePercent: Number(lock[6]),
      cycle: Number(lock[7]),
      cycleRelease: Number(lock[8]),
      unLockAmount: ethers.formatUnits(lock[9]),
    }));
  } catch (error) {
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
  }
};

export const getLockDetailsById = async (lockId, decimals, chainId) => {
  try {
    console.log("getLockDetailsByIdArguments", lockId, decimals, chainId);
    let provider = await getProvider();
    let config = await getNetworkConfig();

    // If chainId is provided and valid, use that chain's RPC
    if (chainId && routerAdd[chainId]) {
      config = routerAdd[chainId];
      provider = new ethers.JsonRpcProvider(config.RPC_URL);
    }

    console.log("getLockDetailsById", provider);

    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      provider
    );
    const lockDetails = await tokenContract.getLockById(lockId);
    console.log("getLockDetailsById Response:", lockDetails);
    const cycleDurationSec = Number(lockDetails[7]);
    // Convert seconds to nearest unit and get the corresponding type
    let cycleType = "Seconds";
    let cycle = cycleDurationSec;
    if (cycleDurationSec < 60) {
      cycleType = "Seconds";
      cycle = cycleDurationSec;
    } else if (cycleDurationSec < 3600) {
      cycleType = "Minutes";
      cycle = cycleDurationSec / 60;
    } else if (cycleDurationSec < 86400) {
      cycleType = "Hours";
      cycle = cycleDurationSec / 3600;
    } else if (cycleDurationSec < 604800) {
      cycleType = "Days";
      cycle = cycleDurationSec / 86400;
    } else if (cycleDurationSec < 2628000) {
      cycleType = "Weeks";
      cycle = cycleDurationSec / 604800;
    } else if (cycleDurationSec < 31536000) {
      cycleType = "Months";
      cycle = cycleDurationSec / 2628000;
    } else {
      cycleType = "Years";
      cycle = cycleDurationSec / 31536000;
    }

    const mappedLockDetails = {
      lockId: lockDetails[0].toString(),
      tokenAddress: lockDetails[1],
      ownerAddress: lockDetails[2],
      amountLocked: ethers.formatUnits(lockDetails[3], decimals),
      unlockDate: new Date(Number(lockDetails[4]) * 1000).toLocaleString(),
      unlockDateRaw: Number(lockDetails[4]) * 1000, // Raw timestamp for Timer
      logDescription: lockDetails[10],
      tgedate: new Date(Number(lockDetails[5]) * 1000).toLocaleString(),
      tgeDateRaw: Number(lockDetails[5]) * 1000, // Raw timestamp for Timer
      tgePercent: Number(lockDetails[6]) / 100,
      cycle: cycle,
      cycleRelease: Number(lockDetails[8]) / 100,
      unLockAmount: ethers.formatUnits(lockDetails[9], decimals),
      cycleType: cycleType,
    };

    return mappedLockDetails;
  } catch (error) {
    console.error("Error fetching lock details:", error);
    return null;
  }
};

export const updateLockHandler = async (
  amountLocked,
  unLoclDate,
  lockId,
  tokenAddress
) => {
  try {
    const signer = await getSignerIfConnected();
    const decimals = await getTokenDecimals(tokenAddress);
    const num = ethers.parseUnits(amountLocked.toString(), decimals);
    const timestamp = Math.floor(new Date(unLoclDate).getTime() / 1000);
    const config = await getNetworkConfig();

    await approveToken(tokenAddress, amountLocked);
    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const updateLock = await tokenContract.editLock(lockId, num, timestamp);
    const updateLockReceipt = await updateLock.wait();
    return updateLockReceipt.hash;
  } catch (error) {
    // Handle specific errors
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
  }
};

export const transferOwnerShip = async (lockId, ownerAddress) => {
  try {
    const signer = await getSignerIfConnected();
    console.log("transferOwnerShip", lockId, ownerAddress);
    const config = await getNetworkConfig();

    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const txReceipt = await tokenContract.transferLockOwnership(
      lockId,
      ownerAddress
    );
    const receipt = await txReceipt.wait();
    console.log("ownerreceipt", receipt);
    return receipt.hash;
  } catch (error) {
    // Handle specific errors
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
  }
};

export const rnounceLockOwnerShip = async (lockId) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const contractInst = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const txReceipt = await contractInst.renounceLockOwnership(lockId);
    const receipt = await txReceipt.wait();
    return receipt.hash;
  } catch (error) {
    // Handle specific errors
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
  }
};

export const editTittleLockHandeler = async (lockId, tittle) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const contractInst = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const txReceipt = await contractInst.editLockDescription(lockId, tittle);
    const receipt = await txReceipt.wait();
    return receipt.hash;
  } catch (error) {
    // Handle specific errors
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
  }
};

export const UnLockHandler = async (tokenId) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();

    const contractInst = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      signer
    );
    const txReceipt = await contractInst.unlock(tokenId);
    const receipt = txReceipt.wait();
    return receipt.hash;
  } catch (error) {
    // Handle specific errors
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
  }
};

export const TokenMyLockDetails = async (account) => {
  try {
    const provider = await getProvider();
    const config = await getNetworkConfig();
    if (!config?.addresses?.LockTokenContractAddress) {
      console.warn("LockTokenContractAddress not found for this network.");
      return [];
    }

    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      provider
    );

    const lockDetails = await tokenContract.normalLocksForUser(account);

    const rawData = lockDetails.map((lock) => ({
      lockId: lock[0].toString(),
      tokenAddress: lock[1],
      ownerAddress: lock[2],
      rawAmount: lock[3].toString(), // unformatted
    }));

    const enrichedData = await Promise.all(
      rawData.map(async (item) => {
        try {
          const contract = new ethers.Contract(
            item.tokenAddress,
            ERC20TokenAbi,
            provider
          );

          const [name, symbol, decimals, totalSupply, balance] =
            await Promise.all([
              contract.name(),
              contract.symbol(),
              contract.decimals(),
              contract.totalSupply(),
              contract.balanceOf(account),
            ]);

          const formattedAmount = ethers.formatUnits(item.rawAmount, decimals);

          return {
            ...item,
            amountLocked: formattedAmount,
            name: name.toString(),
            symbol: symbol.toString(),
            decimals: decimals.toString(),
            totalSupply: totalSupply.toString(),
            balance: balance.toString(),
          };
        } catch (error) {
          console.error(
            `Error fetching token details for ${item.tokenAddress}:`,
            error
          );
          return {
            ...item,
            amountLocked: "0",
            name: "Unknown",
            symbol: "Unknown",
            decimals: "0",
            totalSupply: "0",
            balance: "0",
          };
        }
      })
    );

    return enrichedData;
  } catch (error) {
    console.error("Error fetching lock details:", error);
    return [];
  }
};

export const TokenMyLpDetails = async (account) => {
  try {
    const provider = await getProvider();
    const config = await getNetworkConfig();

    if (!config?.addresses?.LockTokenContractAddress) {
      console.warn("LockTokenContractAddress not found for this network.");
      return [];
    }

    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      provider
    );

    const lockDetails = await tokenContract.lpLocksForUser(account);
    console.log(lockDetails[0]);

    const data = lockDetails.map((lock) => ({
      lockId: lock[0].toString(),
      tokenAddress: lock[1],
      ownerAddress: lock[2],
      amountLocked: lock[3], // raw BigNumber for now
    }));

    const enrichedData = await Promise.all(
      data.map(async (item) => {
        try {
          const contract = new ethers.Contract(
            item.tokenAddress,
            ERC20TokenAbi,
            provider
          );

          const [name, symbol, decimals, totalSupply, balance] =
            await Promise.all([
              contract.name(),
              contract.symbol(),
              contract.decimals(),
              contract.totalSupply(),
              contract.balanceOf(account),
            ]);

          return {
            ...item,
            name,
            symbol,
            decimals: decimals.toString(),
            totalSupply: ethers.formatUnits(totalSupply, decimals),
            balance: ethers.formatUnits(balance, decimals),
            amountLocked: ethers.formatUnits(item.amountLocked, decimals),
          };
        } catch (error) {
          console.error(
            `Error fetching token details for ${item.tokenAddress}:`,
            error
          );
          return {
            ...item,
            name: "Unknown",
            symbol: "Unknown",
            decimals: "0",
            totalSupply: "0",
            balance: "0",
            amountLocked: "0",
          };
        }
      })
    );

    return enrichedData;
  } catch (error) {
    console.error("Error fetching lock details:", error);
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }
    return [];
  }
};

export const allLockDetailsHandler = async (account) => {
  try {
    console.log("Fetching All Lock Details from ALL networks...");
    const validChains = Object.entries(routerAdd).filter(
      ([chainId, config]) => {
        // Filter chains that have a LockTokenContractAddress and RPC_URL
        return (
          config.addresses &&
          config.addresses.LockTokenContractAddress &&
          config.RPC_URL
        );
      }
    );

    const results = await Promise.all(
      validChains.map(async ([chainId, config]) => {
        try {
          const provider = new ethers.JsonRpcProvider(config.RPC_URL);
          const lockAddress = config.addresses.LockTokenContractAddress;

          const tokenCountContract = new ethers.Contract(
            lockAddress,
            TrendLockAbi,
            provider
          );

          const tokenCount =
            await tokenCountContract.allNormalTokenLockedCount();
          const totalLocks = Number(tokenCount.toString());
          if (totalLocks === 0) return [];

          let allLocksRaw = [];
          try {
            const lockData =
              await tokenCountContract.getCumulativeNormalTokenLockInfo(
                0,
                totalLocks
              );
            lockData.map((item, idx) => {
              allLocksRaw.push({
                tokenAddress: item[0],
                rawAmount: item[2].toString(),
                chainId: chainId,
                networkName: config.name,
                originalIndex: idx, // Store the contract-level index
              });
            });
          } catch (error) {
            console.warn(
              `Error fetching cumulative locks for chain ${chainId}:`,
              error
            );
            return [];
          }

          // Fetch token details for this chain's locks
          const chunkSize = 5; // Throttling for this specific chain
          const enrichedChainData = [];

          for (let i = 0; i < allLocksRaw.length; i += chunkSize) {
            const chunk = allLocksRaw.slice(i, i + chunkSize);
            const chunkResults = await Promise.all(
              chunk.map(async (item) => {
                try {
                  const contract = new ethers.Contract(
                    item.tokenAddress,
                    ERC20TokenAbi,
                    provider
                  );

                  // We might not have account balance on this chain if user not connected to it,
                  // so balancOf might fail or return 0 if we just pass 'account'.
                  // 'account' is usually correct wallet address, so it's fine.
                  const [name, symbol, decimals, totalSupply, balance] =
                    await Promise.all([
                      contract.name(),
                      contract.symbol(),
                      contract.decimals(),
                      contract.totalSupply(),
                      contract.balanceOf(account).catch(() => 0), // Handle potential error if not correct chain for user?
                    ]);

                  const formattedAmount = ethers.formatUnits(
                    item.rawAmount,
                    decimals
                  );

                  return {
                    tokenAddress: item.tokenAddress,
                    amount: formattedAmount,
                    name: name.toString(),
                    symbol: symbol.toString(),
                    decimals: decimals.toString(),
                    totalSupply: totalSupply.toString(),
                    balance: balance.toString(),
                    chainId: item.chainId,
                    networkName: item.networkName,
                    originalIndex: item.originalIndex,
                  };
                } catch (error) {
                  return {
                    tokenAddress: item.tokenAddress,
                    amount: "0",
                    name: "Unknown",
                    symbol: "Unknown",
                    decimals: "0",
                    totalSupply: "0",
                    balance: "0",
                    chainId: item.chainId,
                    networkName: item.networkName,
                    originalIndex: item.originalIndex,
                  };
                }
              })
            );
            enrichedChainData.push(...chunkResults);
          }
          return enrichedChainData;
        } catch (error) {
          console.warn(`Failed to fetch locks for chain ${chainId}:`, error);
          return [];
        }
      })
    );

    // Flatten results from all chains
    const aggregatedData = results.flat();
    console.log("Aggregated All Locks:", aggregatedData);
    return aggregatedData;
  } catch (error) {
    console.error("Error fetching lock details:", error);
    return [];
  }
};

export const LiquidityAllLockDetailsHandler = async (account) => {
  try {
    console.log("Fetching Liquidity Locks from ALL networks...");
    const validChains = Object.entries(routerAdd).filter(
      ([chainId, config]) => {
        // Filter chains that have a LockTokenContractAddress and RPC_URL
        return (
          config.addresses &&
          config.addresses.LockTokenContractAddress &&
          config.RPC_URL
        );
      }
    );

    const results = await Promise.all(
      validChains.map(async ([chainId, config]) => {
        try {
          const provider = new ethers.JsonRpcProvider(config.RPC_URL);
          const lockAddress = config.addresses.LockTokenContractAddress;

          const tokenCountContract = new ethers.Contract(
            lockAddress,
            TrendLockAbi,
            provider
          );

          const tokenCount = await tokenCountContract.allLpTokenLockedCount();
          const totalLocks = Number(tokenCount.toString());
          if (totalLocks === 0) return [];

          let allLocks = [];
          try {
            const lockData =
              await tokenCountContract.getCumulativeLpTokenLockInfo(
                0,
                totalLocks
              );
            lockData.map((item, idx) => {
              allLocks.push({
                tokenAddress: item[0],
                amount: item[2],
                chainId: chainId,
                networkName: config.name,
                originalIndex: idx,
              });
            });
          } catch (error) {
            console.warn(
              `Error fetching cumulative LP locks for chain ${chainId}:`,
              error
            );
            return [];
          }

          const enrichedChainData = [];
          const chunkSize = 5;
          for (let i = 0; i < allLocks.length; i += chunkSize) {
            const chunk = allLocks.slice(i, i + chunkSize);
            const chunkResults = await Promise.all(
              chunk.map(async (item) => {
                try {
                  const contract = new ethers.Contract(
                    item.tokenAddress,
                    ERC20TokenAbi,
                    provider
                  );

                  // We might not have account balance on this chain if user not connected to it,
                  // so balancOf might fail or return 0 if we just pass 'account'.
                  const [name, symbol, decimals, totalSupply, balance] =
                    await Promise.all([
                      contract.name(),
                      contract.symbol(),
                      contract.decimals(),
                      contract.totalSupply(),
                      contract.balanceOf(account).catch(() => 0),
                    ]);

                  return {
                    ...item,
                    name: name.toString(),
                    symbol: symbol.toString(),
                    decimals: decimals.toString(),
                    totalSupply: ethers.formatUnits(totalSupply, decimals),
                    balance: ethers.formatUnits(balance, decimals),
                    amount: ethers.formatUnits(item.amount, decimals),
                    chainId: item.chainId,
                    networkName: item.networkName,
                    originalIndex: item.originalIndex,
                  };
                } catch (error) {
                  return {
                    ...item,
                    name: "Unknown",
                    symbol: "Unknown",
                    decimals: "0",
                    totalSupply: "0",
                    balance: "0",
                    amount: "0",
                    chainId: item.chainId,
                    networkName: item.networkName,
                    originalIndex: item.originalIndex,
                  };
                }
              })
            );
            enrichedChainData.push(...chunkResults);
          }
          return enrichedChainData;
        } catch (error) {
          console.warn(`Failed to fetch LP locks for chain ${chainId}:`, error);
          return [];
        }
      })
    );

    const aggregatedData = results.flat();
    console.log("Aggregated Liquidity Locks:", aggregatedData);
    return aggregatedData;
  } catch (error) {
    console.error("Error fetching lock details:", error);
    return [];
  }
};

export function vestingInfo(
  tgeDate,
  tgePercentage,
  cycleMinutes,
  cyclePercentage
) {
  console.log(
    "vesting info",
    tgeDate,
    tgePercentage,
    cycleMinutes,
    cyclePercentage
  );

  const totalUnlocks = Math.ceil(100 / cyclePercentage); // Total unlock rounds
  const vestingSchedule = [];

  let unlockTime = new Date(tgeDate * 1000); // Convert UNIX timestamp to Date
  for (let i = 0; i < totalUnlocks; i++) {
    vestingSchedule.push({
      unlockNumber: i + 1,
      timeUTC: unlockTime.toISOString().replace("T", " ").substring(0, 16), // Format: YYYY-MM-DD HH:mm
      unlockedTokens: `${cyclePercentage} (${cyclePercentage}%)`,
    });

    unlockTime.setMinutes(unlockTime.getMinutes() + cycleMinutes);
  }
  return vestingSchedule;
}

export const lockInfoForLock = async (index, chainId) => {
  try {
    let provider = await getProvider();
    let config = await getNetworkConfig();

    if (chainId && routerAdd[chainId]) {
      config = routerAdd[chainId];
      provider = new ethers.JsonRpcProvider(config.RPC_URL);
    }

    console.log("lockInfoForLock", index, chainId);

    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      provider
    );

    const lockData = await tokenContract.getCumulativeNormalTokenLockInfoAt(
      index
    );
    const tokenAddress = lockData[0];
    const rawAmount = lockData[2].toString();

    // ✅ Fetch correct decimals for token
    const erc20 = new ethers.Contract(tokenAddress, ERC20TokenAbi, provider);
    const decimals = await erc20.decimals();

    const formattedAmount = ethers.formatUnits(rawAmount, decimals);

    console.log("Lock Data:", {
      tokenAddress,
      amount: formattedAmount,
    });

    return {
      tokenAddress,
      amount: formattedAmount,
    };
  } catch (error) {
    console.error("Error fetching lock details:", error);

    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }

    return null;
  }
};

export const lockInfoForLockForLp = async (index, chainId) => {
  try {
    let provider = await getProvider();
    let config = await getNetworkConfig();

    if (chainId && routerAdd[chainId]) {
      config = routerAdd[chainId];
      provider = new ethers.JsonRpcProvider(config.RPC_URL);
    }

    console.log("lockInfoForLockForLp", index, chainId);

    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      provider
    );

    const lockData = await tokenContract.getCumulativeLpTokenLockInfoAt(index);
    const tokenAddress = lockData[0];
    const rawAmount = lockData[2].toString();

    // ✅ Fetch correct decimals for token
    const erc20 = new ethers.Contract(tokenAddress, ERC20TokenAbi, provider);
    const decimals = await erc20.decimals();

    const formattedAmount = ethers.formatUnits(rawAmount, decimals);

    console.log("Lock Data:", {
      tokenAddress,
      amount: formattedAmount,
    });

    return {
      tokenAddress,
      amount: formattedAmount,
    };
  } catch (error) {
    console.error("Error fetching lock details:", error);

    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }

    return null;
  }
};

export const totalLockCountforUserHandler = async (tokenAddress, chainId) => {
  try {
    let provider = await getProvider();
    let config = await getNetworkConfig();

    if (chainId && routerAdd[chainId]) {
      config = routerAdd[chainId];
      provider = new ethers.JsonRpcProvider(config.RPC_URL);
    }

    console.log("Fetching total lock count for user...", tokenAddress, chainId);
    const tokenContract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      provider
    );
    const lockCount = await tokenContract.totalLockCountForToken(tokenAddress);
    console.log("LockCount1234:", lockCount.toString());
    const recordData = await tokenContract.getLocksForToken(
      tokenAddress,
      0,
      lockCount
    );
    console.log("Raw Lock Data:", recordData);
    const erc20 = new ethers.Contract(tokenAddress, ERC20TokenAbi, provider);
    const decimals = await erc20.decimals();
    const recordDataArray = recordData.map((item, index) => ({
      index: index,
      tokenAddress: item[1],
      lockId: Number(item[0].toString()),
      wallet: item[2],
      cycle: Number(item[6].toString()) / 100,
      cycleRelease: Number(item[7].toString()) / 60,
      tgeDate: Number(item[8].toString()) / 100,
      unLockDate: new Date(Number(item[5]) * 1000).toLocaleString(),
      amount: ethers.formatUnits(item[3].toString(), decimals),
    }));
    console.log("Processed Lock Data:", recordDataArray);
    return recordDataArray;
  } catch (error) {
    console.error("Error fetching lock details:", error);
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
    } else if (error.code === "CALL_EXCEPTION") {
      toast(`Transaction failed: ${error.reason || "Unknown reason"}`, {
        icon: "❌",
        type: "error",
      });
    } else {
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        { icon: "❌", type: "error" }
      );
    }

    return [];
  }
};

export const withDrawAbleTokenHandler = async (lockId) => {
  try {
    const provider = await getProvider();
    const config = await getNetworkConfig();
    const contract = new ethers.Contract(
      config?.addresses?.LockTokenContractAddress,
      TrendLockAbi,
      provider
    );
    const withdrawAbleToken = await contract.withdrawableTokens(lockId);
    return withdrawAbleToken;
  } catch (error) {
    console.error("Error fetching lock details:", error);
    return [];
  }
};

export async function identifyDEXName(lpTokenAddress, chainId) {
  try {
    console.log("identifyDEXName", lpTokenAddress, chainId);
    let provider = await getProvider();
    let config = await getNetworkConfig();

    if (chainId && routerAdd[chainId]) {
      config = routerAdd[chainId];
      provider = new ethers.JsonRpcProvider(config.RPC_URL);
    }

    // Safety check: ensure provider is ready
    await provider.getNetwork();

    const lpToken = new ethers.Contract(lpTokenAddress, DexNameAbi, provider);
    const factoryAddr = (await lpToken.factory()).toLowerCase();
    const chainRouters = routerInfo[chainId];
    if (!chainRouters) return "Unknown chain";
    for (const dexName in chainRouters) {
      const knownFactory = chainRouters[dexName].factory.toLowerCase();
      if (factoryAddr === knownFactory) {
        return dexName;
      }
    }
    return "Unknown DEX";
  } catch (err) {
    console.error("Error fetching LP factory:", err);
    return "Invalid LP token";
  }
}
