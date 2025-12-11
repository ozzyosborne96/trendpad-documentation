import axios from "axios";
import { getNetworkConfig } from "../../ContractAction/ContractDependency";
const BASE_URL = "https://trendpad.io";
export const notifyBuyApiAction = async (account, amount, poolId) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/pool/buy`, {
      address: account,
      buying_amount: Number(amount),
      pool_id: poolId,
    });
    console.log("notifyBuyApiAction Response:", response.data);
  } catch (error) {
    console.error("Error in notifyBuyApiAction:", error.message);
  }
};

export const notifyCancelSaleApiAction = async (poolId) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/pool/cancel/${poolId}`);
    console.log("notifyCancelSaleApiAction response:", response.data);
  } catch (error) {
    console.error("Error in notifyCancelSaleApiAction:", error.message);
  }
};

export const addAffiliate = async (poolAddr, rate) => {
  try {
    console.log("addAffiliate", addAffiliate);
    const response = await axios.put(`${BASE_URL}/api/add/affiliate`, {
      poolId: poolAddr,
      Affiliate_percentage: rate,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding affiliate:", error);
    throw error;
  }
};

export const updateTimer = async (poolId, startTime, endTime) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/update/timer/${poolId}`, {
      Start_time: startTime,
      End_time: endTime,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating timer:", error);
    throw error;
  }
};

export const updatePoolType = async (poolId, whiteListStatus) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/update/pool/type/${poolId}`, {
      White_List: whiteListStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating pool type:", error);
    throw error;
  }
};

export const updateWhitelist = async (poolId, status, address) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/update/white_list/${poolId}/${status}`, {
      address,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating whitelist:", error);
    throw error;
  }
};

export const removeWhitelist = async (poolId, status) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/update/white_list/${poolId}/${status}`, {
      address: ["0x"]
    });
    return response.data;
  } catch (error) {
    console.error("Error updating whitelist:", error);
    throw error;
  }
};

export const getPoolDetails = async (poolId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/pool/details/${poolId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pool details:", error);
    throw error;
  }
};


export async function calculateFairBNBInvestmentInUSD(bnbAmount) {
  try {
    const config = await getNetworkConfig();
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${config?.nativeToken}USDT`);
    const bnbPrice = parseFloat(response.data.price);

    const usdValue = bnbAmount * bnbPrice;

    // Format to USD currency (e.g., $574.21)
    const formattedUSD = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4, // at least 4
      maximumFractionDigits: 6  // you can increase if needed
    }).format(usdValue);

    console.log(formattedUSD);


    return formattedUSD;
  } catch (error) {
    console.error('Error fetching BNB price:', error.message);
    return 'Error fetching BNB price';
  }
}