import axios from "axios";
import {
  getChainInfo,
  getCurrentAccount,
  getTokenDetails,
} from "../../ContractAction/ContractDependency";
import { ethers } from "ethers";
export const notifyBackendAfterFairCreation = async (
  stepData,
  liquidityToken,
  poolId,
  hash,
  affilationRate,
  currencyAddress,
  decimals,
  formateUnit,
  dexName,
  buyBackPercentage,
  affilateStatus
) => {
  const { chainId, chainName } = await getChainInfo();
  const account = await getCurrentAccount();
  const tokenDetails = await getTokenDetails(stepData?.tokenAddress);
  console.log("chainIdchainName", chainId, chainName);
  console.log(
    "notifyBackendAfterFairCreation",
    stepData,
    liquidityToken,
    poolId
  );
  try {
    const saleData = {
      Token_name: tokenDetails?.name,
      Symbol: tokenDetails?.symbol,
      Decimal: Number(tokenDetails?.decimals),
      Total_supply: Number(tokenDetails?.totalSupply),
      ChainId: chainId,
      Sale_type: "Fairlaunch",
      token: stepData?.tokenAddress,
      pool_id: poolId,
      chain_name: chainName,
      Currency: stepData?.currency,
      Listing_Option: stepData?.listingOption,
      Listing_rate: 0,
      Liquidity_percentage: Number(stepData?.liquidity),
      Outer: dexName,
      Liquidity_Lockup_time: Number(stepData?.liquidityLockup),
      Presale_rate: 0,
      White_List: Boolean(stepData?.whitelistEnabled),
      Soft_cap: Number(
        ethers.parseUnits(stepData?.softCap || "0", formateUnit ?? 0)
      ),
      Hard_cap: 0,
      Total_Raised: 0,
      Min_buy: 0,
      Max_buy: Number(
        ethers.parseUnits(stepData?.maxBuy || "0", formateUnit ?? 0)
      ),
      Refund_type: stepData?.refundType || "Auto",
      Start_time: Math.floor(new Date(stepData?.startTime).getTime() / 1000),
      End_time: Math.floor(new Date(stepData?.endTime).getTime() / 1000),
      Vesting_contract: Boolean(stepData?.vestingEnabled || false),
      First_release_vesting: Number(stepData?.firstRelease || "0"),
      Vesting_period: Number(stepData?.vestingPeriod || "0"),
      Token_release: Number(stepData?.tokenRelease || "0"),
      Logo: stepData?.additionalInfo?.logoUrl || "",
      Website: stepData?.additionalInfo?.website || "",
      Banner: stepData?.additionalInfo?.banner || "",
      Facebook_Page: stepData?.additionalInfo?.facebook || "",
      Twitter: stepData?.additionalInfo?.twitter || "",
      Github: stepData?.additionalInfo?.github || "",
      Instagram: stepData?.additionalInfo?.instagram || "",
      Discord: stepData?.additionalInfo?.discord || "",
      Reddit: stepData?.additionalInfo?.reddit || "",
      Youtube: stepData?.additionalInfo?.youtube || "",
      Whitelist_Link: stepData?.additionalInfo?.website || "",
      Pool_Description: stepData?.additionalInfo?.description || "",
      token_for_sale: Number(stepData?.totalSellingAmount || "0"),
      token_for_liquidity: Number(liquidityToken || "0"),
      Transaction_hash: hash,
      Affiliate_percentage: affilationRate,
      Affilation_Status: affilateStatus,
      Currency_address: currencyAddress,
      Buy_back_percentage: buyBackPercentage,
      Buy_back_info: stepData?.hawsBuyBack || false,
      Owner_Address: account,
      Currency_Decimal: formateUnit,
    };
    console.log("saleData", saleData);
    const response = await axios.post("https://trendpad.io/api/pool", saleData);
    return response.data;
  } catch (error) {
    console.error("Failed to notify backend:", error);
    return null;
  }
};
export const fetchFairTokenStatus = async (token) => {
  try {
    const { chainId, chainName } = await getChainInfo();
    const response = await axios.get(
      `https://trendpad.io/api/token/status/${token}/${chainId}`
    );
    console.log("fetchTokenStatus", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching token status:", err);
  }
};
