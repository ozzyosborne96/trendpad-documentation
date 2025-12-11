import { ethers } from "ethers";
import { getSignerIfConnected } from "../ContractAction/ContractDependency";
import { FairLaunchFactory } from "../ContractAction/ABI/FairLaunchFactory";
import { FairLaunchPoolAbi } from "../ContractAction/ABI/FairLaunchPool";
import { FairLaunchERC20PoolAbi } from "../ContractAction/ABI/FairLaunchERC20PoolAbi";
import {
  getTokenDecimals,
  getNetworkConfig,
  getProvider,
  isNativeTokenHandler,
} from "../ContractAction/ContractDependency";
import toast from "react-hot-toast";
import { parseEther } from "ethers";
import {
  notifyBuyApiAction,
  notifyCancelSaleApiAction,
} from "../LaunchPadList/ViewFairLaunchPad/ApiViewfairLaunchHandler";
import { BuybackAbi } from "./ABI/BuyBackAbi";
import { cachedContractCall } from "../utils/rpcCache";
import {
  addAffiliate,
  updatePoolType,
  updateWhitelist,
  updateTimer,
  removeWhitelist,
  calculateFairBNBInvestmentInUSD,
} from "../LaunchPadList/ViewFairLaunchPad/ApiViewfairLaunchHandler";
export const FairLaunchPadDetailsHandler = async (
  poolAddr,
  decimals,
  currencyDecimal
) => {
  try {
    console.log("poolAddr", poolAddr);
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const poolDetailsReceipt = await contract.getSaleInfo();
    console.log("fairpoolDetailsReceipt", poolDetailsReceipt);
    return {
      currencyAddress: poolDetailsReceipt[0],
      tokenAddress: poolDetailsReceipt[1],
      tokenSellingAmount: ethers.formatUnits(poolDetailsReceipt[2], decimals),
      liquidityTokenAmount: ethers.formatUnits(poolDetailsReceipt[3], decimals),
      softCap: ethers.formatUnits(poolDetailsReceipt[4], currencyDecimal),
      maxBuy: ethers.formatUnits(poolDetailsReceipt[5], currencyDecimal),
      liquidityPercentage: Number(poolDetailsReceipt[6]),
      affiliate: poolDetailsReceipt[7],
      whiteList: poolDetailsReceipt[8],
      isBuyBackEnabled: poolDetailsReceipt[9],
    };
  } catch (error) {
    console.error("Error in FairLaunchPadDetailsHandler:", error);
    return null;
  }
};

export const FairtimestampsHandler = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const timestampDetails = await cachedContractCall(
      contract,
      "getTimeStampInfo",
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
      unlockTime: Number(timestampDetails[3]) / 60,
    };
  } catch (error) {
    console.error("Error in FairtimestampsHandler:", error);
    return null;
  }
};

export const fairAffiliateInfoHandler = async (poolAddr, decimals) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const details = await contract.getAffilateInfo();
    console.log("FairAffiliateInfo:", details);

    return {
      poolReferalCount: Number(details[0]),
      realTimerewardPercentage: Number(details[1]),
      currentReward: ethers.formatUnits(details[2], decimals),
      totalReferred: ethers.formatUnits(details[3], decimals),
      totalRewardAmount: ethers.formatUnits(details[4], decimals),
    };
  } catch (error) {
    console.error("Error fetching affiliate info:", error);
    return null;
  }
};

export const fairGetTotalParticipantCountHAndler = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const participent = await cachedContractCall(
      contract,
      "getTotalParticipantCount",
      []
    );
    return Number(participent);
  } catch (error) {
    console.error("Error in fairGetTotalParticipantCountHAndler:", error);
    return null;
  }
};

export const fairWhitelistEnabledHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
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

export const fairAddBatchToWhitelistHandler = async (
  poolAddr,
  status,
  addresses
) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
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
export const fairRemoveBatchFromWhitelistHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
    const adduser = await contract.removeAllWhitelist();
    const receipt = await adduser.wait();
    if (receipt) {
      await removeWhitelist(poolAddr, false);
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

export const fairContributerDetailHandler = async (
  poolAddr,
  particip,
  decimals
) => {
  try {
    console.log("poolAddr,particip", poolAddr, particip);
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const addressList = await contract.getAllParticipant();
    console.log("addressList", addressList);

    const userDetails = [];

    for (const address of addressList) {
      const amount = await contract.getUserInvesmentAmount(address);
      const formattedAmount = ethers.formatUnits(amount, decimals);

      // ✅ Fetch USD market value using your API
      const marketValue = await calculateFairBNBInvestmentInUSD(
        formattedAmount
      );
      console.log("marketValue", marketValue);
      userDetails.push({
        address,
        amount: formattedAmount,
        marketValue, // market value in USD
      });
    }

    return userDetails; // [{ address, amount, marketValue }]
  } catch (error) {
    console.error("Error in contributerDetailHandler:", error);
    // if (error.code === "ACTION_REJECTED") {
    //   toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null;
  }
};

export const getSponsorAddr = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
    const sponsor = await contract.getSponserAddress(); // Make sure this is the correct method name in your ABI
    const sponsorArray = sponsor.map((addr) => addr);
    console.log("sponsorAddress", sponsorArray);
    return sponsorArray;
  } catch (error) {
    console.error("Error in getSponsorAddr:", error);

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

export const getSponserReferalAmountContract = async (
  poolAddr,
  sponserAddress,
  currencyDecimal
) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const amount = await contract.getSponserReferalAmount(sponserAddress);
    return ethers.formatUnits(amount, currencyDecimal);
  } catch (error) {
    console.error("Error in getSponserReferalAmountContract:", error);
    // if (error.code === "ACTION_REJECTED") {
    //   toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null;
  }
};

export const fairgetSponserRewardAmountAction = async (
  poolAddr,
  sponserAddress,
  currencyDecimal
) => {
  try {
    console.log(
      "fairgetSponserRewardAmountAction",
      poolAddr,
      sponserAddress,
      currencyDecimal
    );
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const amount = await contract.getSponserRewardAmount(sponserAddress);
    console.log("getSponserRewardAmount1234", amount);
    return ethers.formatUnits(amount, currencyDecimal); // ✅ Return the result
  } catch (error) {
    console.error("Error in getSponserRewardAmountAction:", error);
    // if (error.code === "ACTION_REJECTED") {
    //   toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null;
  }
};

export const FairtotalInvestedETHHandler = async (poolAddr, decimals) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const tokens = await cachedContractCall(contract, "getTotalInvested", []);
    return ethers.formatUnits(tokens, decimals);
  } catch (error) {
    console.error("Error in FairtotalInvestedETHHandler:", error);
    return null;
  }
};
export const FairgetSaleStatusHandler = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const saleStatus = await cachedContractCall(contract, "getSaleStatus", []);
    return Number(saleStatus);
  } catch (error) {
    console.error("Error in FairgetSaleStatusHandler:", error);
    return null;
  }
};

export const FaircancelSaleHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
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
export const fairSetEndAndStartTimeHandler = async (poolAddr, start, end) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
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

export const fairsetClaimTimeHandler = async (poolAddr, claimTime) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
    const timestampInSeconds = Math.floor(new Date(claimTime).getTime() / 1000);
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

export const currentTokenRateHandler = async (poolAddr, decimals) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const rate = await cachedContractCall(contract, "currentTokenRate", []);
    return parseFloat(ethers.formatUnits(rate, decimals)).toFixed(2);
  } catch (error) {
    console.error("Failed to fetch current token rate:", error);
    return null;
  }
};

export const fairGetClaimableTokenAmountHandler = async (
  poolAddr,
  account,
  decimals
) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const getClaim = await cachedContractCall(
      contract,
      "getClaimableTokenAmount",
      [account]
    );
    const claimableAmount = ethers.formatUnits(getClaim, decimals);
    const formatted = parseFloat(claimableAmount).toFixed(3);
    return formatted;
  } catch (error) {
    console.error("Error in fairGetClaimableTokenAmountHandler:", error);
    return null;
  }
};

export const FairisPoolUserHandler = async (poolAddr, account) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const getClaim = await cachedContractCall(contract, "isPoolUser", [
      account,
    ]);
    return getClaim;
  } catch (error) {
    console.error("Error in FairisPoolUserHandler:", error);
    return null;
  }
};

export const FairgetClaimedTokenAmountHandler = async (
  poolAddr,
  account,
  decimals
) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const claimedAmount = await contract.getClaimedTokenAmount(account);
    return Number(ethers.formatUnits(claimedAmount, decimals)).toFixed(2);
  } catch (error) {
    console.error("Error in FairgetClaimedTokenAmountHandler:", error);
    // if (error.code === "ACTION_REJECTED") {
    //   toast("Transaction rejected by user.", { icon: "❌", type: "error" });
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
    return null;
  }
};

export const FairfinalizeHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
    const setClaim = await contract.finalize();
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
export const FairwithDrawCancelledTokensHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
    const witheth = await contract.refundTokens();
    const receipt = await witheth.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error in FairwithDrawCancelledTokensHandler:", error);
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
export const FaircontributeHandler = async (
  poolAddr,
  data,
  amount,
  account,
  isNative,
  currencyAddress
) => {
  try {
    const signer = await getSignerIfConnected();
    let receipt;
    let amtApi;
    if (!isNative) {
      const amtDecimal = await getTokenDecimals(currencyAddress);
      const formattedAmount = ethers.parseUnits(amount.toString(), amtDecimal);
      amtApi = formattedAmount;
      console.log("Formatted Token Amount:", formattedAmount);
      const contract = new ethers.Contract(
        poolAddr,
        FairLaunchERC20PoolAbi,
        signer
      );

      receipt = await contract.contribute(data, formattedAmount);
    } else {
      const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
      const ethValue = parseEther(amount.toString());
      console.log("ETH Amount:", ethValue);
      amtApi = ethValue;
      receipt = await contract.contribute(data, {
        value: ethValue,
      });
    }

    if (receipt) {
      await notifyBuyApiAction(account, amtApi, poolAddr);
      const tx = await receipt.wait();
      return tx.hash;
    }

    return null;
  } catch (error) {
    console.error("Error in FaircontributeHandler:", error);

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

export const FairgetCliamHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
    const tx = await contract.claim();
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error in FairgetCliamHandler:", error);
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

export const FairgetUserInvesmentAmountHandler = async (
  poolAddr,
  account,
  currencyDecimal
) => {
  try {
    console.log("YOurPurchages", currencyDecimal);
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const purchasedvalure = await cachedContractCall(
      contract,
      "getUserInvesmentAmount",
      [account]
    );
    return ethers.formatUnits(purchasedvalure, currencyDecimal);
  } catch (error) {
    console.error("Error in FairgetUserInvesmentAmountHandler:", error);
    return null;
  }
};

export const fairdistributedHandler = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const isfinalize = await cachedContractCall(contract, "isPoolFinalize", []);
    return isfinalize;
  } catch (error) {
    console.log("Error in fairdistributedHandler:", error);
    return false;
  }
};

export const fairwithdrawContributionHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
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

export const fairgettorewardHandler = async (poolAddr, currencyDecimal) => {
  try {
    const sponsorList = await getSponsorAddr(poolAddr);
    console.log("Sponsors:", sponsorList);
    const results = await Promise.all(
      sponsorList.map(async (sponsorAddress) => {
        if (!sponsorAddress) return null; // guard clause
        const referralAmount = await getSponserReferalAmountContract(
          poolAddr,
          sponsorAddress,
          currencyDecimal
        );
        console.log("referralAmount48474646", referralAmount);
        const rewardAmount = await fairgetSponserRewardAmountAction(
          poolAddr,
          sponsorAddress,
          currencyDecimal
        );
        console.log("rewardAmount48474646", rewardAmount);
        return {
          address: sponsorAddress,
          referralAmount: referralAmount,
          rewardAmount: rewardAmount,
        };
      })
    );
    const filteredResults = results; // remove any nulls
    console.log("Referral Rewards:", filteredResults);
    return filteredResults;
  } catch (error) {
    console.error("Error in fairgettorewardHandler:", error);
    return null;
  }
};

export const fairgetBuyBackDetails = async (currency) => {
  try {
    const isNative = await isNativeTokenHandler(currency);
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const BUYBACKADDRESS = config?.addresses?.BUYBACKADDRESS;
    console.log("BUYBACKADDRESS", BUYBACKADDRESS);
    const contract = new ethers.Contract(BUYBACKADDRESS, BuybackAbi, signer);
    const buback = await contract.getBuyBackDefaultInfo();
    console.log("buback1234", buback);
    return {
      buyBackAmount: isNative
        ? ethers.formatEther(buback[0])
        : ethers.formatEther(buback[1]),
      Minimundelay: Number(buback[2]) / 60,
      Maximundelay: Number(buback[3]) / 60,
    };
  } catch (error) {
    console.error("Error fetching buyback details:", error);
    return [];
  }
};

export const fairgetPoolBuyBackInfoHandler = async (poolAddr, decimals) => {
  try {
    console.log("Input Params:", poolAddr, decimals);
    const provider = await getProvider();
    const config = await getNetworkConfig();
    const BUYBACKADDRESS = config?.addresses?.BUYBACKADDRESS;
    const contract = new ethers.Contract(BUYBACKADDRESS, BuybackAbi, provider);
    const details = await contract.getPoolBuyBackInfo(poolAddr);
    console.log("getPoolBuyBackInfo Raw12: ", details, BUYBACKADDRESS);
    const totalBuyBackAmount = ethers.formatUnits(details[4], decimals);
    const boughtBackAmount = ethers.formatUnits(details[5], decimals);
    const amountPerBuyBack = ethers.formatUnits(details[6], decimals);
    const minBuyBackDelay = Number(details[7]) / 60;
    const maxBuyBackDelay = Number(details[8]) / 60;
    const nextBuyBackTime =
      details[9] && Number(details[9]) > 0
        ? new Date(Number(details[9]) * 1000).toLocaleString()
        : 0;

    const lastBuyBackTime =
      details[10] && Number(details[10]) > 0
        ? new Date(Number(details[10]) * 1000).toLocaleString()
        : 0;

    return {
      totalBuyBackAmount: Number(totalBuyBackAmount),
      boughtBackAmount: Number(boughtBackAmount),
      AmountPerBuyBack: Number(amountPerBuyBack),
      minBuyBackDeley: minBuyBackDelay,
      maxBuyBackDeley: maxBuyBackDelay,
      nextbuyBackTime: nextBuyBackTime,
      lastbuyBackTime: lastBuyBackTime,
    };
  } catch (error) {
    console.log("Error in fairgetPoolBuyBackInfoHandler:", error);
    return null;
  }
};

export const fairgetBuyBackRemainAmount = async (poolAddr, decimals) => {
  try {
    const provider = await getProvider();
    const config = await getNetworkConfig();
    const BUYBACKADDRESS = config?.addresses?.BUYBACKADDRESS;
    const contract = new ethers.Contract(BUYBACKADDRESS, BuybackAbi, provider);
    const data = await contract.getBuyBackRemainAmount(poolAddr);
    return Number(ethers.formatUnits(data, decimals));
  } catch (error) {
    console.log("Error in fairgetBuyBackRemainAmount", error);
  }
};

export const fairbuybackAndBurnHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const provider = await getProvider();
    const config = await getNetworkConfig();
    const BUYBACKADDRESS = config?.addresses?.BUYBACKADDRESS;
    const contract = new ethers.Contract(BUYBACKADDRESS, BuybackAbi, signer);
    const tx = await contract.buybackAndBurn(poolAddr);
    const receipt = await tx.wait();
    return receipt.hash; // ✅ CORRECT — `hash` is a property, not a method
  } catch (error) {
    console.error("Error in fairbuybackAndBurnHandler:", error);
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

export const enableFairAffilateHandler = async (poolAddr, rate) => {
  try {
    console.log("enableAffilateHandler", poolAddr, rate);
    const baal = true;
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
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

export const publicFairEnableHandler = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
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

export const FairisSoftcapReachedAction = async (poolAddr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const statusSoftcap = await contract.isSoftcapReached();
    console.log("Softcap reached:", statusSoftcap);
    return statusSoftcap;
  } catch (error) {
    console.error("Error checking softcap status:", error);
    return null;
  }
};

export const claimSponsorRewardAction = async (poolAddr) => {
  try {
    const signer = await getSignerIfConnected();
    if (!signer) {
      throw new Error("Wallet not connected.");
    }
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, signer);
    const isReached = await contract.isSoftcapReached();
    console.log("Softcap reached:", isReached);
    if (!isReached) {
      throw new Error("Softcap not reached yet. Cannot claim reward.");
    }
    const tx = await contract.claimSponsorReward(); // Assuming this is the actual claim method
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error in claimSponsorRewardAction:", error);
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

export const FairgetIsSponsorClaimedHandler = async (poolAddr, account) => {
  try {
    const signer = await getSignerIfConnected();
    const provider = await getProvider();
    const contract = new ethers.Contract(poolAddr, FairLaunchPoolAbi, provider);
    const isClaimed = await contract.getIsSponsorClaimed(account);
    console.log("getIsSponsorClaimedHandler response:", isClaimed);
    return isClaimed;
  } catch (error) {
    console.error("Error in getIsSponsorClaimedHandler:", error);
    return false; // or null, depending on how you want to handle failure
  }
};
