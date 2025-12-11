import { ethers } from "ethers";
import { PresaleAbi } from "../ContractAction/ABI/PresaleAbi";
import { ERC20TokenAbi } from "../ContractAction/ABI/ERC20Token";
import { TrendpoolAbi } from "../ContractAction/ABI/TrendPoolAbi";
import {
  getSignerIfConnected,
  getProvider,
  getNetworkConfig,
  getTokenDecimals,
} from "../ContractAction/ContractDependency";
import { parseEther } from "ethers";
import { FairLaunchFactory } from "../ContractAction/ABI/FairLaunchFactory";
import toast from "react-hot-toast";
import { notifyBackendAfterFairCreation } from "../LaunchPad/CeateFairLaunch/ApiFairLaunchPadHandler";
import { cachedContractCall } from "../utils/rpcCache";
import { notifyBackendAfterPresaleCreation } from "../LaunchPad/CreateLaunchpad/ApiLaunchPadHandler";
import {
  notifyBuyApiAction,
  notifyCancelSaleApiAction,
  addAffiliate,
  updateTimer,
  updatePoolType,
  updateWhitelist,
  removeWhitelist,
  calculateBNBInvestmentInUSD,
} from "../LaunchPadList/ViewLaunchPad/ApiViewLaunchpadAction";
import { TrendPoolErc20Abi } from "../ContractAction/ABI/TrendPoolErc20Abi";
export const getTokenAmountHandler = async (
  ethAmount,
  oneTokenInWei,
  decimals
) => {
  try {
    const signer = await getSignerIfConnected();
    console.log(
      "ethAmount, oneTokenInWei, decimals, signer:",
      ethAmount,
      oneTokenInWei,
      decimals,
      signer
    );
    const config = await getNetworkConfig();
    const contract = new ethers.Contract(
      config?.addresses?.LAUNCHPADCONTRACTADDRESSFACTORY,
      PresaleAbi,
      signer
    );
    const amount = await contract.getTokenAmount(
      ethAmount,
      oneTokenInWei,
      decimals
    );
    return Number(amount);
  } catch (error) {
    console.error("Error in getTokenAmountHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${
          error.message || "Unknown error"
        } ❌`
      );
    }
    return null;
  }
};
export const aproveTokenHandler = async (
  tokenAddress,
  amount,
  contractAddress
) => {
  try {
    const signer = await getSignerIfConnected();
    console.log(
      "Approving token:",
      tokenAddress,
      "Amount:",
      amount.toString(),
      signer
    );
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    console.log("rtew", contractAddress?.LAUNCHPADCONTRACTADDRESSFACTORY);
    const tx = await tokenContract.approve(
      contractAddress?.LAUNCHPADCONTRACTADDRESSFACTORY,
      amount
    );
    const receipt = await tx.wait();

    console.log("Transaction Hash:", receipt.hash);
    return receipt.hash;
  } catch (error) {
    console.error("Error in aproveTokenHandler:", error);

    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }

    return null;
  }
};

export const createPresaleActionHandler = async (
  metadataURL,
  saleInfo,
  timestamps,
  dexInfo,
  vestingInfo,
  lockeraddress,
  affilationRate,
  stepData,
  liquidityToken,
  presaleToken,
  contractAddresses,
  isNativeToken,
  poolFee,
  formateUnit,
  decimals,
  dexName
) => {
  try {
    const signer = await getSignerIfConnected();
    console.log(
      "createPresaleActionHandler",
      // metadataURL,
      saleInfo
      // timestamps,
      // dexInfo,
      // vestingInfo,
      // lockeraddress,
      // affilationRate,
      // stepData,
      // liquidityToken,
      // presaleToken,
      // contractAddresses,
      // isNativeToken
    );

    console.log(
      "saleInfo",
      isNativeToken,
      contractAddresses?.LAUNCHPADCONTRACTADDRESSFACTORY
    );
    const contract = new ethers.Contract(
      contractAddresses?.LAUNCHPADCONTRACTADDRESSFACTORY,
      PresaleAbi,
      signer
    );
    let txResponse = null;
    if (isNativeToken) {
      alert("Creation with Native Token");
      txResponse = await contract.createIDO(
        saleInfo,
        timestamps,
        dexInfo,
        vestingInfo,
        lockeraddress,
        affilationRate,
        {
          value: poolFee, // sending 0.01 ETH/BNB/etc as native token
        }
      );
    } else {
      alert("Creation with Stable Coin");
      txResponse = await contract.createIDOERC20(
        saleInfo,
        timestamps,
        dexInfo,
        vestingInfo,
        lockeraddress,
        affilationRate,
        {
          value: poolFee, // sending 0.01 ETH/BNB/etc as native token
        }
      );
    }

    const txReceipt = await txResponse.wait();
    console.log("txReceipt", txReceipt);
    console.log("Transaction Hash:", txReceipt.hash);
    let poolId = null;
    const iface = new ethers.Interface(PresaleAbi);
    console.log("Tx Logs Length:", txReceipt.logs.length);
    for (const log of txReceipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (!parsedLog) {
          console.log("Could not parse log (null result)", log);
          continue;
        }
        console.log("parsedLog Name:", parsedLog.name);
        if (parsedLog.name === "IDOCreated") {
          console.log("🎉 IDOCreated event detected!");
          poolId = parsedLog.args[1].toString();
          console.log("Pool ID:", poolId);
          console.log("Token Address:", parsedLog.args[1]);
          console.log("Owner Address:", parsedLog.args[2]);
          if (poolId) break;
        }
      } catch (error) {
        console.log("Error parsing log:", error.message, log);
      }
    }
    if (txReceipt && poolId) {
      await notifyBackendAfterPresaleCreation(
        stepData,
        liquidityToken,
        poolId,
        presaleToken,
        txReceipt.hash,
        affilationRate,
        saleInfo?.Currency,
        formateUnit,
        decimals,
        dexName,
        saleInfo.affiliation
      );
    }
    return {
      txHash: txReceipt.hash,
      poolId,
    };
  } catch (error) {
    console.error("Error in createPresaleActionHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }

    return null;
  }
};

export const LaunchPadDetailsHandler = async (
  poolAddr,
  decimals,
  currencyDecimal
) => {
  try {
    console.log("poolAddr", poolAddr);
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const poolDetailsReceipt = await contract.getSaleInfo();
    console.log("poolDetailsReceipt", poolDetailsReceipt);
    return {
      currencyAddress: poolDetailsReceipt[0],
      tokenAddress: poolDetailsReceipt[1],
      presaleToken: ethers.formatUnits(poolDetailsReceipt[2], decimals),
      liquidityToken: ethers.formatUnits(poolDetailsReceipt[3], decimals),
      presaleRate: ethers.formatUnits(poolDetailsReceipt[4], decimals),
      softCap: ethers.formatUnits(poolDetailsReceipt[5], currencyDecimal),
      hardCap: ethers.formatUnits(poolDetailsReceipt[6], currencyDecimal),
      min: ethers.formatUnits(poolDetailsReceipt[7], currencyDecimal),
      max: ethers.formatUnits(poolDetailsReceipt[8], currencyDecimal),
      liquidityRate: ethers.formatUnits(poolDetailsReceipt[9], decimals),
      liquidityPercentage: Number(poolDetailsReceipt[10], decimals),
      burnType: poolDetailsReceipt[11],
      // metaData: JSON.parse(poolDetailsReceipt[11]),
      affiliate: poolDetailsReceipt[12],
      whiteList: poolDetailsReceipt[13],
    };
  } catch (error) {
    console.error("Error in LaunchPadDetailsHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }
    return null;
  }
};
export const timestampsHandler = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const timestampDetails = await cachedContractCall(
      contract,
      "getTimesatmpInfo",
      []
    );
    const formatTime = (value) => {
      const timestamp = Number(value.toString());
      return timestamp === 0 ? 0 : new Date(timestamp * 1000).toLocaleString();
    };
    return {
      startTime: formatTime(timestampDetails[0]),
      endTime: formatTime(timestampDetails[1]),
      claimTime: formatTime(timestampDetails[2]),
      unlockTime: (Number(timestampDetails[3]) / 60).toFixed(2),
    };
  } catch (error) {
    console.error("Error in timestampsHandler:", error);
    return null;
  }
};

export const getTotalParticipantCountHAndler = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const participent = await cachedContractCall(
      contract,
      "getTotalParticipantCount",
      []
    );
    return Number(participent);
  } catch (error) {
    console.error("Error in getTotalParticipantCountHAndler:", error);
    return null;
  }
};

export const getSaleStatusHandler = async (poolAddr) => {
  try {
    // const signer = await getSignerIfConnected();
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const saleStatus = await cachedContractCall(contract, "getSaleStatus", []);
    console.log("participent123", saleStatus);
    return Number(saleStatus);
  } catch (error) {
    console.error("Error in getSaleStatusHandler:", error);

    // if (error.code === "ACTION_REJECTED") {
    //   toast.error("Transaction rejected by user ❌");
    // } else if (error.code === "CALL_EXCEPTION") {
    //   toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    // } else {
    //   toast.error(
    //     `Something went wrong: ${error.message || "Unknown error"} ❌`
    //   );
    // }

    return null;
  }
};

export const getUnsoldTokensHandler = async (poolAddr, decimals) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const tokens = await cachedContractCall(contract, "getUnsoldTokens", []);
    return ethers.formatUnits(tokens, decimals);
  } catch (error) {
    console.error("Error in getUnsoldTokensHandler:", error);
    return null;
  }
};

export const totalInvestedETHHandler = async (poolAddr, currencyDecimal) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const tokens = await cachedContractCall(contract, "getTotalInvesment", []);
    return ethers.formatUnits(tokens, currencyDecimal);
  } catch (error) {
    console.error("Error in totalInvestedETHHandler:", error);
    return null;
  }
};

export const contributeHandler = async (
  poolAddr,
  data,
  amount,
  account,
  isNative,
  currencyAddress
) => {
  try {
    console.log("amountConto", isNative);
    const signer = await getSignerIfConnected();
    let receipt;
    let amtApi;
    if (isNative) {
      const ethValue = parseEther(amount.toString()); // amount like "0.1
      amtApi = ethValue;
      console.log("ethValue", ethValue, poolAddr);
      const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
      receipt = await contract.contribute(data, {
        value: ethValue,
      });
    } else {
      const amtDecimal = await getTokenDecimals(currencyAddress);
      const formateAmount = ethers.parseUnits(amount.toString(), amtDecimal);
      amtApi = formateAmount;
      const contract = new ethers.Contract(poolAddr, TrendPoolErc20Abi, signer);
      console.log("formateAmount", formateAmount);
      receipt = await contract.contribute(data, formateAmount);
    }
    if (receipt) {
      await notifyBuyApiAction(account, amtApi, poolAddr);
    }
    const tx = await receipt.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error in contributeHandler:", error);

    if (error?.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error?.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${
          error?.message || error?.data?.message || "Unknown error"
        } ❌`
      );
    }

    return null;
  }
};

export const whitelistEnabledHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const isEnabled = await contract.whitelistEnabled();
    const receipt = await isEnabled.wait();
    if (receipt) {
      await updatePoolType(poolAddr, true);
    }
    const tx = receipt.hash;
    return tx;
  } catch (error) {
    console.error("Error in whitelistEnabledHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }

    return null;
  }
};

export const addBatchToWhitelistHandler = async (
  poolAddr,
  status,
  addresses
) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const adduser = await contract.addBatchToWhitelist(addresses);
    const receipt = await adduser.wait();
    if (receipt) {
      await updateWhitelist(poolAddr, status, addresses);
    }
    return receipt.hash;
  } catch (error) {
    console.error("Error in whitelistEnabledHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }

    return null;
  }
};
export const removeBatchFromWhitelistHandler = async (poolAddr, status) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const adduser = await contract.removeAllWhitelist();
    const receipt = await adduser.wait();
    if (receipt) {
      await removeWhitelist(poolAddr, status);
    }
    return receipt.hash;
  } catch (error) {
    console.error("Error in whitelistEnabledHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }

    return null;
  }
};

export const setClaimTimeHandler = async (poolAddr, claimTime) => {
  try {
    console.log("claimTimer", claimTime);
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const timestampInSeconds = Math.floor(new Date(claimTime).getTime() / 1000);
    console.log("secandTimer", timestampInSeconds);

    const setClaim = await contract.setClaimTime(timestampInSeconds);
    const receipt = await setClaim.wait();
    const tx = receipt.hash;
    return tx;
  } catch (error) {
    console.error("Error in setClaimTimeHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }
    return null;
  }
};

export const finalizeHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const setClaim = await contract.finalize();
    const receipt = await setClaim.wait();
    const tx = receipt.hash;
    return tx;
  } catch (error) {
    console.error("Error in finalizeHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }
    return null;
  }
};

export const setEndAndStartTimeHandler = async (poolAddr, start, end) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const startInSeconds = Math.floor(new Date(start).getTime() / 1000);
    const endInSeconds = Math.floor(new Date(end).getTime() / 1000);
    const setClaim = await contract.setEndAndStartTime(
      startInSeconds,
      endInSeconds
    );
    const receipt = await setClaim.wait();
    if (receipt) {
      await updateTimer(poolAddr, startInSeconds, endInSeconds);
    }
    const tx = receipt.hash;
    return tx;
  } catch (error) {
    console.error("Error in setEndAndStartTimeHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }
    return null;
  }
};

export const checkAllowance = async (tokenAddress, amount) => {
  try {
    const config = await getNetworkConfig();
    console.log("tokenAddress, amount", tokenAddress, amount);
    const signer = await getSignerIfConnected();
    if (!signer) throw new Error("Signer is required!");
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const allowance = await tokenContract.allowance(
      await signer.getAddress(),
      config?.addresses?.LAUNCHPADCONTRACTADDRESSFACTORY
    );
    console.log("allowance", allowance, amount, allowance >= amount);
    return allowance >= amount;
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

export const enableAffilateHandler = async (poolAddr, rate) => {
  try {
    console.log("enableAffilateHandler", poolAddr, rate);
    const baal = true;
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const receipt = await contract.enableAffilate(baal, rate);
    if (receipt) {
      await addAffiliate(poolAddr, rate);
    }
    const tx = await receipt.wait();
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

export const cancelSaleHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const cancel = await contract.cancelSale();
    const receipt = await cancel.wait();
    if (receipt) {
      await notifyCancelSaleApiAction(poolAddr);
    }
    const tx = receipt.hash;
    return tx;
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

export const distributedHandler = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const isfinalize = await cachedContractCall(contract, "isPoolFinalize", []);
    return isfinalize;
  } catch (error) {
    console.log("Error in distributedHandler:", error);
    return false;
  }
};

export const getClaimableTokenAmountHandler = async (
  poolAddr,
  account,
  decimals
) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const getClaim = await cachedContractCall(
      contract,
      "getClaimableTokenAmount",
      [account]
    );
    const claimableAmount = ethers.formatUnits(getClaim, decimals);
    return claimableAmount;
  } catch (error) {
    console.error("Error in getClaimableTokenAmountHandler:", error);
    return null;
  }
};

export const getCliamHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const txResponse = await contract.claim();
    const receipt = await txResponse.wait();
    const txHash = receipt.hash;
    return txHash;
  } catch (error) {
    console.error("Error in getClaimableTokenAmountHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null; // Always return something
  }
};

export const isPoolUserHandler = async (poolAddr, account) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const getClaim = await cachedContractCall(contract, "isPoolUser", [
      account,
    ]);
    return getClaim;
  } catch (error) {
    console.error("Error in isPoolUserHandler:", error);
    return null;
  }
};

export const withdrawContributionHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const getClaim = await contract.withdrawContribution();
    const receipt = await getClaim.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error in getClaimableTokenAmountHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null; // Always return something
  }
};

export const withDrawCancelledTokensHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const witheth = await contract.refundTokens();
    const receipt = await witheth.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error in getClaimableTokenAmountHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null; // Always return something
  }
};

export const publicEnableHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const witheth = await contract.publicSaleEanble();
    const receipt = await witheth.wait();
    if (receipt) {
      await updatePoolType(poolAddr, false);
    }
    return receipt.hash;
  } catch (error) {
    console.error("Error in getClaimableTokenAmountHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null; // Always return something
  }
};

export const contributerDetailHandler = async (
  poolAddr,
  particip,
  currencyDecimal
) => {
  try {
    console.log("poolAddr,particip", poolAddr, particip);
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const addressList = await contract.getAllParticipant();
    console.log("addressList", addressList);

    const userDetails = [];

    for (const address of addressList) {
      const amount = await contract.getUserInvesmentAmount(address);
      const formattedAmount = ethers.formatUnits(amount, currencyDecimal); // e.g. 0.5 BNB

      // ✅ Calculate USD value using your utility function
      const marketValue = await calculateBNBInvestmentInUSD(formattedAmount);

      userDetails.push({
        address,
        amount: formattedAmount,
        marketValue, // e.g. 0.5 BNB ≈ $145.27
      });
    }

    return userDetails; // [{ address, amount, marketValue }]
  } catch (error) {
    console.error("Error in contributerDetailHandler:", error);
    return null;
  }
};

//LaunchPadDetailsHandler
export const getTrendPoolsDetailsListHandler = async () => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const contract = new ethers.Contract(
      config?.addresses?.LAUNCHPADCONTRACTADDRESSFACTORY,
      PresaleAbi,
      signer
    );
    const addresses = await contract.getTrendPools();
    console.log("Fetched addresses:", addresses);
    const launchDetailsRaw = await Promise.all(
      addresses.map(async (address) => {
        try {
          const data = await LaunchPadDetailsHandler(address);
          return data || null; // Explicitly return null if undefined
        } catch (err) {
          console.warn(
            `Failed to fetch launchpad details for ${address}:`,
            err
          );
          return null;
        }
      })
    );
    // Filter out null or undefined results
    const launchDetails = launchDetailsRaw.filter(Boolean);
    console.log("launchDetails", launchDetails);
    return launchDetails;
  } catch (error) {
    console.error("Error in getTrendPoolsDetailsListHandler:", error);
  }
};

export const affiliateInfoHandler = async (poolAddr, currencyDecimal) => {
  try {
    console.log("d,fgdslig", currencyDecimal);
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const details = await contract.getAffiliateInfo();
    console.log("Affiliate Info:", details);

    return {
      poolReferalCount: Number(details[0]),
      realTimerewardPercentage: Number(details[1]),
      currentReward: ethers.formatUnits(details[2], currencyDecimal),
      maxReward: ethers.formatUnits(details[3], currencyDecimal),
      totalReferred: ethers.formatUnits(details[4], currencyDecimal),
      totalRewardAmount: ethers.formatUnits(details[5], currencyDecimal),
    };
  } catch (error) {
    console.error("Error fetching affiliate info:", error);
    return null;
  }
};

export const getAllSponesersHandler = async (poolAddr, account, decimals) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    console.log("Wallet Address123", account);
    const details = await contract.getSponsorReferralSum(account);
    console.log("getAllSponesersHandler", details);
    return ethers.formatUnits(details, decimals);
  } catch (error) {
    console.error("Error fetching affiliate info:", error);
    return null;
  }
};

export const sponserRewardHandler = async (
  poolAddr,
  account,
  currencyDecimal
) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const rewards = await contract.getSponserRewardAmount(account);
    console.log("rewards", rewards);
    return ethers.formatUnits(rewards, currencyDecimal);
  } catch (error) {
    console.error("rewards", error);
  }
};
export const getUserInvesmentAmountHandler = async (
  poolAddr,
  account,
  decimals
) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const purchasedvalure = await contract.getUserInvesmentAmount(account);
    return ethers.formatUnits(purchasedvalure, decimals);
  } catch (error) {}
};

export const getFairLaunchTokenAmount1 = async (
  tokenAmount,
  lpInterestRate,
  decimals,
  formateUnits,
  isNative
) => {
  console.log(
    "getFairLaunchTokenAmount1",
    tokenAmount,
    lpInterestRate,
    decimals,
    formateUnits
  );
  try {
    const provider = await getProvider();
    const tokenAmountInWei = ethers.parseUnits(
      tokenAmount.toString(),
      decimals
    );
    const config = await getNetworkConfig();
    const contract = new ethers.Contract(
      config?.addresses?.FAIRLAUNCHFACTORYDDRESS,
      FairLaunchFactory,
      provider
    );
    const amount = await contract.getFairLaunchTokenAmount(
      tokenAmountInWei,
      lpInterestRate,
      formateUnits
    );

    console.log("INside Amount", amount);
    return amount;
  } catch (error) {
    console.error("Error in getFairLaunchTokenAmount1:", error);
    throw error;
  }
};

export const createFairLaunchHandlerContract = async (
  saleInfo,
  timestamps,
  dexInfo,
  vestingInfo,
  lockerAddress,
  stepData,
  liquidityToken,
  affilationRate,
  buyBackPercentage,
  isNativeToken,
  poolFee,
  decimals,
  formateUnit,
  dexName
) => {
  try {
    console.log(
      "createFairLaunchHandlerContract",
      // saleInfo,
      timestamps
      // dexInfo,
      // vestingInfo,
      // lockerAddress,
      // stepData,
      // liquidityToken,
      // affilationRate,
      // buyBackPercentage,
      // isNativeToken,
      // poolFee
    );
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const contract = new ethers.Contract(
      config?.addresses?.FAIRLAUNCHFACTORYDDRESS,
      FairLaunchFactory,
      signer
    );
    let txResponse = null;

    if (isNativeToken) {
      alert("Creation with Native Token");
      txResponse = await contract.createFairLaunch(
        saleInfo,
        timestamps,
        dexInfo,
        vestingInfo,
        lockerAddress,
        affilationRate,
        buyBackPercentage,
        {
          value: poolFee, // sending 0.01 ETH/BNB/etc as native token
        }
      );
    } else {
      alert("Creation with Stable Coin");
      txResponse = await contract.createFairLaunchERC20(
        saleInfo,
        timestamps,
        dexInfo,
        vestingInfo,
        lockerAddress,
        affilationRate,
        buyBackPercentage,
        {
          value: poolFee,
        }
      );
    }
    const txReceipt = await txResponse.wait();
    let poolId = null;
    const iface = new ethers.Interface(FairLaunchFactory);
    for (const log of txReceipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        console.log("Parsed Log:", parsedLog);
        if (parsedLog.name === "IDOCreated") {
          console.log("🎉 IDOCreated event detected!");
          poolId = parsedLog.args[1].toString();
          console.log("Pool ID:", poolId);
        }
      } catch (error) {
        console.log("Irrelevant log or parse error:", error.message);
      }
    }
    if (txReceipt && poolId) {
      await notifyBackendAfterFairCreation(
        stepData,
        liquidityToken,
        poolId,
        txReceipt.hash,
        affilationRate,
        saleInfo?.currency,
        decimals,
        formateUnit,
        dexName,
        buyBackPercentage,
        saleInfo.isAffiliatationEnabled
      );
    }
    console.log("Transaction Receipt:", txReceipt.hash, poolId);

    return {
      txHash: txReceipt.hash,
      poolId,
    };
  } catch (error) {
    console.error("Error in createFairLaunchHandlerContract:", error);
    if (error.code === "ACTION_REJECTED") {
      toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null;
  }
};

export const checkAllowanceforFairLaunch = async (tokenAddress, amount) => {
  try {
    console.log("tokenAddress, amount", tokenAddress, amount);
    const signer = await getSignerIfConnected();
    if (!signer) throw new Error("Signer is required!");
    const config = await getNetworkConfig();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const allowance = await tokenContract.allowance(
      await signer.getAddress(),
      config?.addresses?.FAIRLAUNCHFACTORYDDRESS
    );
    console.log("allowance", allowance, amount, allowance >= amount);
    return allowance >= amount;
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

export const aproveTokenHandlerforFairLaunch = async (tokenAddress, amount) => {
  try {
    const signer = await getSignerIfConnected();
    console.log(
      "Approving token:",
      tokenAddress,
      "Amount:",
      amount.toString(),
      signer
    );
    const config = await getNetworkConfig();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const tx = await tokenContract.approve(
      config?.addresses?.FAIRLAUNCHFACTORYDDRESS,
      amount
    );
    const receipt = await tx.wait();

    console.log("Transaction Hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error in aproveTokenHandler:", error);

    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }

    return null;
  }
};

export const approvePoolToken = async (tokenAddress, amount, addr) => {
  try {
    const signer = await getSignerIfConnected();
    console.log("Approval token", tokenAddress, amount);
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const amtDecimal = await getTokenDecimals(tokenAddress);
    const num = ethers.parseUnits(amount.toString(), amtDecimal);
    console.log("amtDecimal", amtDecimal, num);
    const tx = await tokenContract.approve(addr, num);
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
export const claimSponsorRewardHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, signer);
    const claim = await contract.claimSponsorReward();
    const receipt = await claim.wait();
    const tx = receipt.hash;
    return tx;
  } catch (error) {
    console.error("Error in aproveTokenHandler:", error);

    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong: ${error.message || "Unknown error"} ❌`
      );
    }

    return null;
  }
};

export const getIsSponsorClaimedHandler = async (poolAddr, account) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const isClaimed = await contract.getIsSponsorClaimed(account);

    console.log("getIsSponsorClaimedHandler response:", isClaimed);
    return isClaimed;
  } catch (error) {
    console.error("Error in getIsSponsorClaimedHandler:", error);
    return false; // or null, depending on how you want to handle failure
  }
};

export const TopRewardHandler = async (poolAddr, currencyDecimal) => {
  console.log("currencyDecimal1234", currencyDecimal);
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const sponsorAddresses = await contract.getAllSponesers();
    console.log("Sponsor addresses:", sponsorAddresses);
    const results = await Promise.all(
      sponsorAddresses.map(async (sponsorAddress) => {
        if (!sponsorAddress) return null;
        const referralAmountRaw = await contract.getSponserRewardAmount(
          sponsorAddress
        );
        const rewardAmountRaw = await contract.getSponsorReferralSum(
          sponsorAddress
        );
        const referralAmount = ethers.formatUnits(
          referralAmountRaw,
          currencyDecimal
        );
        const rewardAmount = ethers.formatUnits(
          rewardAmountRaw,
          currencyDecimal
        );
        return {
          address: sponsorAddress,
          referralAmount,
          rewardAmount,
        };
      })
    );
    const filteredResults = results.filter(Boolean); // remove nulls
    console.log("Referral Rewards:", filteredResults);
    return filteredResults;
  } catch (error) {
    console.error("Error in TopRewardHandler:", error);
    return null;
  }
};

export const isSoftcapReachedAction = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, TrendpoolAbi, provider);
    const statusSoftcap = await cachedContractCall(
      contract,
      "isSoftcapReached",
      []
    );
    return statusSoftcap;
  } catch (error) {
    console.error("Error checking softcap status:", error);
    return null;
  }
};
