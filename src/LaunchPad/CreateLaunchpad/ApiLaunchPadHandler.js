import axios from "axios";
import { getChainInfo } from "../../ContractAction/ContractDependency";
import { ethers } from "ethers";
import {
  getCurrentAccount,
  getTokenDetails,
} from "../../ContractAction/ContractDependency";
export const notifyBackendAfterPresaleCreation = async (
  stepData,
  liquidityToken,
  poolId,
  presaleToken,
  hash,
  affilationRate,
  currencyAddress,
  formateUnit,
  decimals,
  dexName,
  affilationStatus
) => {
  const { chainId, chainName } = await getChainInfo();
  const account = await getCurrentAccount();
  const tokenDetails = await getTokenDetails(stepData?.tokenAddress);
  console.log("chainIdchainName", chainId, chainName);
  console.log(
    "notifyBackendAfterPresaleCreation",
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
      Sale_type: "Presale",
      ChainId: chainId,
      token: stepData?.tokenAddress,
      pool_id: poolId,
      chain_name: chainName,
      Currency: stepData?.currency,
      Listing_Option: stepData?.listingOptions,
      Listing_rate: Number(
        ethers.parseUnits(stepData?.listingRate || "0", decimals)
      ),
      Liquidity_percentage: Number(stepData?.liquidity),
      Outer: dexName,
      Liquidity_Lockup_time: Number(stepData?.liquidityLockup),
      Presale_rate: Number(
        ethers.parseUnits(stepData?.presaleRate || "0", decimals)
      ),
      White_List: Boolean(stepData?.whitelistEnabled),
      Soft_cap: Number(
        ethers.parseUnits(stepData?.softcap || "0", formateUnit)
      ),
      Hard_cap: Number(
        ethers.parseUnits(stepData?.hardcap || "0", formateUnit)
      ),
      Total_Raised: Number(stepData?.totalRaised || 0),
      Min_buy: Number(ethers.parseUnits(stepData?.minBuy || "0", formateUnit)),
      Max_buy: Number(ethers.parseUnits(stepData?.maxBuy || "0", formateUnit)),
      Refund_type: stepData?.refundType || "Auto",
      Start_time: Math.floor(new Date(stepData?.startTime).getTime() / 1000),
      End_time: Math.floor(new Date(stepData?.endTime).getTime() / 1000),
      Vesting_status: Boolean(stepData?.usingVesting || false),
      First_release_vesting: Number(stepData?.firstRelease || 0),
      Vesting_period: Number(stepData?.vestingPeriod || 0),
      Token_release: Number(stepData?.tokenRelease || 0),
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
      token_for_sale: Number(presaleToken || "0"),
      token_for_liquidity: Number(liquidityToken || "0"),
      Transaction_hash: hash,
      Affiliate_percentage: affilationRate,
      Currency_address: currencyAddress,
      Buy_back_percentage: 0,
      Owner_Address: account,
      Currency_Decimal: formateUnit,
      Affilation_Status: affilationStatus,
      Buy_back_info: false,
    };
    const response = await axios.post("https://trendpad.io/api/pool", saleData);
    return response.data;
  } catch (error) {
    console.error("Failed to notify backend:", error);
    return null;
  }
};

export const fetchTokenStatus = async (token) => {
  try {
    const response = await axios.get(
      `https://trendpad.io/api/token/status/${token}`
    );
    console.log("fetchTokenStatus", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching token status:", err);
  }
};
