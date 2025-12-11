import { ethers } from "ethers";
import {
  aproveTokenHandler,
  createPresaleActionHandler,
} from "../../ContractAction/LaunchPadAction";
import {
  getPoolFee,
  getNetworkConfig,
  getCurrencyAddress,
  getRouterDetails,
  isNativeTokenHandler,
  getTokenDecimals,
  hasEnoughForTx,
  getCurrentAccount,
} from "../../ContractAction/ContractDependency";
import toast from "react-hot-toast";
export const getTokenAmountHandler = async (stepData) => {
  try {
    console.log("All Data from presale", stepData);
    const isNativeToken = await isNativeTokenHandler(stepData?.currency);
    const currencyAddress = await getCurrencyAddress(stepData.currency);
    const formateUnit = isNativeToken
      ? 18
      : await getTokenDecimals(currencyAddress);

    const tokenAddress = stepData?.tokenAddress;
    const decimals = await getTokenDecimals(tokenAddress);

    const hardCap = ethers.parseUnits(
      stepData?.hardcap?.toString() || "0",
      formateUnit
    );
    const presaleRate = ethers.parseUnits(
      stepData?.presaleRate?.toString() || "0",
      decimals
    );
    const denominator = ethers.parseUnits("1", formateUnit);
    const presaleTokens = (hardCap * presaleRate) / denominator;

    const listingRate = ethers.parseUnits(
      stepData?.listingRate?.toString() || "0",
      decimals
    );
    let lpTokenAmount = 0n;
    if (stepData?.listingRate && stepData?.liquidity > 0) {
      const liquidityPercentage = ethers.toBigInt(
        Math.floor(Number(stepData?.liquidity))
      );
      const amountForLiquidity = (hardCap * liquidityPercentage) / 100n;
      lpTokenAmount = (amountForLiquidity * listingRate) / denominator;
    }
    console.log("presaleTokens", presaleTokens);
    console.log("lpTokenAmount", lpTokenAmount);
    const totalTokensWithBuffer = presaleTokens + lpTokenAmount;
    console.log("getTokenAmountHandler", totalTokensWithBuffer);
    return totalTokensWithBuffer;
  } catch (error) {
    console.error("Error in getTokenAmountHandler:", error);
  }
};
export const ApprovePresaleHandler = async (stepData) => {
  try {
    console.log("All Data from presale", stepData);
    const config = await getNetworkConfig();
    const isNativeToken = await isNativeTokenHandler(stepData?.currency);
    const currencyAddress = await getCurrencyAddress(stepData.currency);
    const formateUnit = isNativeToken
      ? 18
      : await getTokenDecimals(currencyAddress);
    const tokenAddress = stepData?.tokenAddress;
    const decimals = await getTokenDecimals(tokenAddress);
    const hardCap = ethers.parseUnits(
      stepData?.hardcap?.toString() || "0",
      formateUnit
    );
    const presaleRate = ethers.parseUnits(
      stepData?.presaleRate?.toString() || "0",
      decimals
    );
    const denominator = ethers.parseUnits("1", formateUnit);
    console.log("denominator", denominator);
    const presaleTokens = (hardCap * presaleRate) / denominator;
    console.log("Presale Token:", presaleTokens.toString());

    const listingRate = ethers.parseUnits(
      stepData?.listingRate?.toString() || "0",
      decimals
    );
    let lpTokenAmount = 0n;

    if (stepData?.listingRate && stepData?.liquidity > 0) {
      const liquidityPercentage = ethers.toBigInt(
        Math.floor(Number(stepData?.liquidity))
      );
      const amountForLiquidity = (hardCap * liquidityPercentage) / 100n;
      lpTokenAmount = (amountForLiquidity * listingRate) / denominator;
      console.log("Liquidity Token:", lpTokenAmount.toString());
    }

    console.log("presaleTokens", presaleTokens);
    console.log("lpTokenAmount", lpTokenAmount);
    const totalTokensWithBuffer = presaleTokens + lpTokenAmount;
    console.log("Total tokens required:", totalTokensWithBuffer);
    const approvalTx = await aproveTokenHandler(
      tokenAddress,
      totalTokensWithBuffer,
      config.addresses
    );
    console.log("approveAmount", approvalTx);
    return approvalTx;
  } catch (error) {
    console.error("Error in createPresaleHandler:", error);
    return null;
  }
};

export const createPresaleHandler = async (stepData) => {
  try {
    const config = await getNetworkConfig();
    const account = await getCurrentAccount();
    // const canProceed = await hasEnoughForTx({
    //   to: account,
    //   value: ethers.parseEther(stepData?.poolFee || "0"),
    // });
    // if (!canProceed) {
    //   toast.error(`You do not have enough ${config?.nativeToken} to cover the transaction and gas fee.`);
    //   return;
    // }
    console.log("getNetworkConfig", stepData);
    const tokenAddress = stepData?.tokenAddress;
    const isNativeToken = await isNativeTokenHandler(stepData?.currency);
    const currencyAddress = await getCurrencyAddress(stepData.currency);
    const formateUnit = isNativeToken
      ? 18
      : await getTokenDecimals(currencyAddress);
    const dexName =
      stepData?.listingOptions ===
      "Manual Listing (Recommended for Seed/Private Sale)"
        ? "Outer"
        : stepData?.router;
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

    const getLockupDuration = (stepData) => {
      const unit = stepData?.lockupUnit || "Minute";
      const value = Number(stepData?.liquidityLockup || 0);
      const multiplier = unitToSeconds[unit] || 0;
      return value * multiplier;
    };

    console.log("thanos", getLockupDuration);

    const metadataURL = JSON.stringify(stepData?.additionalInfo || "");
    const decimals = await getTokenDecimals(stepData?.tokenAddress);

    const rewardToken = stepData?.tokenAddress;
    const burnType = stepData?.refundType === "Burn" ? true : false;
    const isEnableWhiteList = stepData?.whitelistEnabled === true;
    const affiliation = stepData?.affiliate !== "Disable Affiliate";
    const isVestingEnabled = false;

    const hardCap = ethers.parseUnits(
      stepData?.hardcap?.toString() || "0",
      formateUnit
    );
    const softCap = ethers.parseUnits(
      stepData?.softcap?.toString() || "0",
      formateUnit
    );
    const presaleRate = ethers.parseUnits(
      stepData?.presaleRate?.toString() || "0",
      decimals
    );
    const listingPrice =
      stepData?.listingOptions !==
      "Manual Listing (Recommended for Seed/Private Sale)"
        ? ethers.parseUnits(stepData?.listingRate?.toString() || "0", decimals)
        : 0n;

    const minEthPayment = ethers.parseUnits(
      stepData?.minBuy?.toString() || "0",
      formateUnit
    );
    const maxEthPayment = ethers.parseUnits(
      stepData?.maxBuy?.toString() || "0",
      formateUnit
    );
    const denominator = ethers.parseUnits("1", formateUnit);

    const presaleToken = (hardCap * presaleRate) / denominator;
    console.log("Presale Token:", presaleToken.toString());

    const lpInterestRate =
      stepData?.listingOptions !==
      "Manual Listing (Recommended for Seed/Private Sale)"
        ? parseInt(stepData?.liquidity)
        : 0;

    const unlockTimestamp =
      stepData?.listingOptions !==
      "Manual Listing (Recommended for Seed/Private Sale)"
        ? getLockupDuration(stepData)
        : 0;

    const startTimestamp = stepData?.startTime
      ? Math.floor(Number(stepData.startTime) / 1000)
      : 0;

    const endTimestamp = stepData?.endTime
      ? Math.floor(Number(stepData.endTime) / 1000)
      : 0;

    let liquidityToken = 0n;

    const listingRate = ethers.parseUnits(
      stepData?.listingRate?.toString() || "0",
      decimals
    );

    if (stepData?.listingRate && stepData?.liquidity > 0) {
      const liquidityPercentage = ethers.toBigInt(
        Math.floor(Number(stepData?.liquidity))
      );
      const amountForLiquidity = (hardCap * liquidityPercentage) / 100n;
      const lpTokenAmount = (amountForLiquidity * listingRate) / denominator;
      liquidityToken = lpTokenAmount;

      console.log("Liquidity Token:", liquidityToken.toString());
    }

    const affilationRate = stepData?.affilationRate
      ? stepData?.affilationRate
      : 0;

    const saleInfo = {
      Currency: currencyAddress,
      rewardToken,
      presaleToken,
      liquidityToken,
      tokenPrice: presaleRate,
      softCap,
      hardCap,
      minEthPayment,
      maxEthPayment,
      listingPrice,
      lpInterestRate,
      burnType,
      metadataURL,
      affiliation,
      isEnableWhiteList,
      isVestingEnabled,
    };

    const timestamps = {
      startTimestamp,
      endTimestamp,
      claimTimestamp: 0,
      unlockTime: unlockTimestamp,
    };

    const vestingInfo = {
      TGEPercent: 0,
      cycleTime: 0,
      releasePercent: 0,
      startTime: 0,
    };

    // const dexInfo = {
    //   router: config.router,
    //   factory: config.factory,
    //   weth: config.nativeTokenAddress,
    // };

    const dexInfo =
      dexInfoData === null
        ? {
            router: "0x0000000000000000000000000000000000000000",
            factory: "0x0000000000000000000000000000000000000000",
            weth: "0x0000000000000000000000000000000000000000",
          }
        : dexInfoData;
    console.log("dexInfo", dexInfo);
    console.log("unlockTimestamp", unlockTimestamp);
    const lockeraddress = config?.addresses?.LockTokenContractAddress;

    const tx = await createPresaleActionHandler(
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
      config.addresses,
      isNativeToken,
      poolFee,
      formateUnit,
      decimals,
      dexName
    );

    console.log("Presale created, tx hash:", tx);
    return {
      txHash: tx.hash,
      poolId: tx.poolId,
      tokenAddress: tokenAddress,
      currencyAddress: currencyAddress,
    };
  } catch (error) {
    console.error("Error in createPresaleHandler:", error);
  }
};
