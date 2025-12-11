import { ethers } from "ethers";
import {
  aproveTokenHandlerforFairLaunch,
  createFairLaunchHandlerContract,
  getFairLaunchTokenAmount1,
} from "../../ContractAction/LaunchPadAction";
import {
  getCurrencyAddress,
  getRouterDetails,
  getTokenDecimals,
  getPoolFee,
  isNativeTokenHandler,
  getNetworkConfig,
  getCurrentAccount,
  hasEnoughForTx,
} from "../../ContractAction/ContractDependency";
import toast from "react-hot-toast";
export const getTokenAmountHandler = async (stepData) => {
  try {
    const decimal = await getTokenDecimals(stepData?.tokenAddress);
    const isNativeToken = await isNativeTokenHandler(stepData?.currency);
    const currencyAddress = await getCurrencyAddress(stepData.currency);
    const formateUnit = isNativeToken
      ? 18
      : await getTokenDecimals(currencyAddress);
    console.log("All Data from fairLaunch", stepData);
    const totalSellingAmountStr =
      stepData?.totalSellingAmount?.toString() || "0";
    const totalSellingAmountWei = ethers.parseUnits(
      totalSellingAmountStr,
      decimal
    ); // Convert to wei
    console.log("CCCCCCC", totalSellingAmountWei, formateUnit);
    if (stepData?.listingOption === "Auto Listing") {
      const liquidity = stepData?.liquidity ?? 0;
      const liquidityAmountWei = await getFairLaunchTokenAmount1(
        totalSellingAmountStr,
        liquidity,
        decimal,
        formateUnit,
        isNativeToken
      );
      console.log("liquidityAmount (wei):", liquidityAmountWei.toString());
      console.log(
        "totalSellingAmount (wei):",
        totalSellingAmountWei.toString()
      );
      const totalRequiredAmount = liquidityAmountWei + totalSellingAmountWei;
      return totalRequiredAmount;
    } else {
      return totalSellingAmountWei;
    }
  } catch (error) {
    console.error("Error in getTokenAmountHandler:", error);
    return ethers.parseUnits("0", 18);
  }
};

export const getTokenLiquidityAmountHandler = async (stepData) => {
  try {
    const decimal = await getTokenDecimals(stepData?.tokenAddress);
    const isNativeToken = await isNativeTokenHandler(stepData?.currency);
    const currencyAddress = await getCurrencyAddress(stepData.currency);
    const formateUnit = isNativeToken
      ? 18
      : await getTokenDecimals(currencyAddress);
    console.log("All Data from fairLaunch", stepData);
    const totalSellingAmountStr =
      stepData?.totalSellingAmount?.toString() || "0";
    const totalSellingAmountWei = ethers.parseUnits(
      totalSellingAmountStr,
      decimal
    ); // Convert to wei
    console.log("CCCCCCC", totalSellingAmountWei, formateUnit);
    if (stepData?.listingOption === "Auto Listing") {
      const liquidity = stepData?.liquidity ?? 0;
      const liquidityAmountWei = await getFairLaunchTokenAmount1(
        totalSellingAmountStr,
        liquidity,
        decimal,
        formateUnit,
        isNativeToken
      );
      console.log("liquidityAmount (wei):", liquidityAmountWei.toString());
      console.log(
        "totalSellingAmount (wei):",
        totalSellingAmountWei.toString()
      );
      const totalRequiredAmount = liquidityAmountWei;
      return totalRequiredAmount;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error in getTokenAmountHandler:", error);
    return ethers.parseUnits("0", 18);
  }
};

export const ApproveFairLAunchHandler = async (stepData) => {
  try {
    const totalTokensWithBuffer = await getTokenAmountHandler(stepData);
    console.log("inappamun", totalTokensWithBuffer);
    console.log("Total tokens required:", totalTokensWithBuffer);
    const approvalTx = await aproveTokenHandlerforFairLaunch(
      stepData?.tokenAddress,
      totalTokensWithBuffer
    );
    console.log("approveAmount", approvalTx);
    const receipt = await approvalTx.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error in ApproveFairLAunchHandler:", error);
    return null;
  }
};

export const createFairLaunchHandler = async (stepData) => {
  try {
    const config = await getNetworkConfig();
    const account = await getCurrentAccount();
    console.log("getNetworkConfig", config.nativeToken, stepData?.currency);
    // const canProceed = await hasEnoughForTx({
    //   to: account,
    //   value: ethers.parseEther(stepData?.poolFee || "0"),
    // });
    // if (!canProceed) {
    //   toast.error(`You do not have enough ${config?.nativeToken} to cover the transaction and gas fee.`);
    //   return;
    // }
    const tokenAddress = stepData?.tokenAddress;
    const isNativeToken = await isNativeTokenHandler(stepData?.currency);
    const currencyAddress = await getCurrencyAddress(stepData.currency);
    console.log("currencyAddress", currencyAddress);
    const formateUnit = isNativeToken
      ? 18
      : await getTokenDecimals(currencyAddress);
    console.log("formateUnit12", isNativeToken);
    const amt = await getPoolFee();
    console.log("amt", typeof amt);
    const poolFee = ethers.parseEther(amt);
    console.log("poolFee", poolFee);
    const dexInfoData = await getRouterDetails(
      stepData?.router,
      config?.chainId
    );
    console.log("dexInfoData", dexInfoData);
    const unitToSeconds = {
      Minute: 60,
      Hours: 60 * 60,
      Day: 24 * 60 * 60,
      Week: 7 * 24 * 60 * 60,
      Month: 30 * 24 * 60 * 60,
      Quarter: 3 * 30 * 24 * 60 * 60,
      Year: 365 * 24 * 60 * 60,
    };
    const getLockupDuration = () => {
      const unit = stepData?.lockupUnit || "Minute";
      const value = Number(stepData?.liquidityLockup || 0);
      const multiplier = unitToSeconds[unit] || 0;
      return value * multiplier;
    };
    console.log("All Data from fair", stepData);
    const metadataURL = JSON.stringify(stepData?.additionalInfo || "");
    const decimals = await getTokenDecimals(tokenAddress);
    const saleToken = stepData?.tokenAddress;
    const dexName =
      stepData?.listingOption ===
      "Manual Listing (Recommended for Seed/Private Sale)"
        ? "Outer"
        : stepData?.router;
    const isAffiliatationEnabled = stepData?.affiliate !== "Disable Affiliate";
    const softCap = ethers.parseUnits(stepData?.softCap || "0", formateUnit);
    console.log("softCap123", softCap);
    const tokenAmount = ethers.parseUnits(
      stepData?.totalSellingAmount?.toString() || "0",
      decimals
    );
    const autoListing = stepData?.listingOption === "Auto Listing";
    const lpPercent = autoListing ? parseInt(stepData?.liquidity || "0") : 0;
    const unlockTimestamp = autoListing ? getLockupDuration() : 0;
    const startTimestamp = stepData?.startTime
      ? Math.floor(Number(stepData.startTime) / 1000)
      : 0;
    const endTimestamp = stepData?.endTime
      ? Math.floor(Number(stepData.endTime) / 1000)
      : 0;
    const liquidityToken = autoListing
      ? await getTokenLiquidityAmountHandler(stepData)
      : 0;
    console.log("liquidityToken", liquidityToken);
    const maxPay = stepData?.hasMaxBuy
      ? ethers.parseUnits((stepData.maxBuy || "0").toString(), formateUnit)
      : ethers.parseUnits("0", formateUnit);
    const affilationRate =
      stepData?.affiliate !== "Disable Affiliate"
        ? stepData?.affilationRate
        : "0";
    const isBuyBackEnabled = stepData?.hawsBuyBack;
    const isVestingEnabled = false;
    const saleInfo = {
      currency: currencyAddress,
      saleToken,
      tokenAmount,
      liquidityToken,
      softCap,
      maxPay,
      lpPercent,
      isAffiliatationEnabled,
      isEnableWhitelist: stepData?.whitelistEnabled,
      isBuyBackEnabled,
      isVestingEnabled,
    };
    const timestamps = {
      startTimestamp,
      endTimestamp,
      claimTimestamp: 0,
      unlockTime: unlockTimestamp,
    };
    const dexInfo =
      dexInfoData === null
        ? {
            router: "0x0000000000000000000000000000000000000000",
            factory: "0x0000000000000000000000000000000000000000",
            weth: "0x0000000000000000000000000000000000000000",
          }
        : dexInfoData;
    console.log("dexInfo", dexInfo);
    const vestingInfo = {
      TGEPercent: 0,
      cycleTime: 0,
      releasePercent: 0,
      startTime: 0,
    };

    const lockeraddress = config?.addresses?.LockTokenContractAddress;

    const buyBackPercentage = Number(stepData?.buyBack) ?? 0;
    const { txHash, poolId } = await createFairLaunchHandlerContract(
      saleInfo,
      timestamps,
      dexInfo,
      vestingInfo,
      lockeraddress,
      stepData,
      liquidityToken,
      affilationRate,
      buyBackPercentage,
      isNativeToken,
      poolFee,
      decimals,
      formateUnit,
      dexName
    );
    console.log("Presale created, tx hash:", txHash, poolId);
    return {
      txHash: txHash,
      poolId: poolId,
      tokenAddress: tokenAddress,
      currencyAddress: currencyAddress,
    };
  } catch (error) {
    console.error("Error in createFairLaunchHandler:", error);
    throw error;
  }
};
