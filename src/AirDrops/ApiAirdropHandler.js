import axios from "axios";
import { ethers } from "ethers";
import { getChainInfo } from "../ContractAction/ContractDependency";
export const createAirDropAPI = async (airdropData) => {
  try {
    console.log("airdropData", airdropData);
    const response = await axios.post(
      "https://trendpad.io/api/create/airdrop",
      {
        Pool_Address: airdropData.Pool_Address,
        Owner_Address: airdropData.Owner_Address,
        Token_Address: airdropData.Token_Address,
        Token_Name: airdropData.Token_Name,
        Symbol: airdropData.Symbol,
        Decimal: Number(airdropData.Decimal),
        ChainId: airdropData.ChainId,
        AirDrop_Tittle: airdropData.AirDrop_Tittle,
        WebSite: airdropData.WebSite,
        Facebook: airdropData.Facebook,
        Twitter: airdropData.Twitter,
        Github: airdropData.Github,
        Telegram: airdropData.Telegram,
        Discord: airdropData.Discord,
        Instagram: airdropData.Instagram,
        Reddit: airdropData.Reddit,
        Description: airdropData.Description,
        LogoURL: airdropData?.LogoURL,
        YouTubeURL: airdropData?.YouTubeURL,
        //   TotalAllocation: 0,
        //   Total_Claimed: 0,
        //   Start_Time: 0,
        //   Is_Canceled: 0,
        //   TGE_release_percentage: 0,
        //   Cycle: 0,
        //   Cycle_release_Percentage: 0,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Error creating airdrop:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const setAllocationApiHandler = async (Allocation_Address, PoolId) => {
  try {
    console.log("Allocation_Address", Allocation_Address, PoolId);
    const response = await axios.post(
      "https://trendpad.io/api/set/allocation",
      {
        Allocation_Address,
        PoolId,
      }
    );

    return response.data; // handle or return the response
  } catch (error) {
    console.error("Error setting allocation:", error);
    throw error; // rethrow if you want to handle it in the UI
  }
};

export const startAirdropApi = async (poolAddress, startTime) => {
  try {
    const response = await axios.put(
      `https://trendpad.io/api/launch/airdrop/${poolAddress}`,
      {
        Start_Time: startTime, // this will be part of req.body
      }
    );

    console.log("Airdrop started successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error starting airdrop:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const cancelPoolApiHandler = async (poolId) => {
  try {
    const response = await axios.put(
      `https://trendpad.io/api/cancel/pool/${poolId}`
    );
    console.log("Cancel Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Cancel Failed:", error.response?.data || error.message);
    throw error;
  }
};


export const claimAirdropHandler = async (poolId, allocationAddress, claimAmount) => {
  try {
    console.log("claimAmount", claimAmount)
    const claim = ethers.parseUnits(claimAmount, 18);
    const response = await axios.put(
      `https://trendpad.io/api/airdrop/claim/${poolId}/${allocationAddress}`,
      {
        claim_amount: claim.toString(),
      }
    );
    console.log("Claim Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Claim Failed:", error.response?.data || error.message);
    throw error;
  }
};


export const removeAllocationApiHandler = async (poolId) => {
  try {
    const response = await axios.put(
      `https://trendpad.io/api/remove/allocation/${poolId}`
    );
    console.log("Allocation Removed:", response.data);
    return response.data;
  } catch (error) {
    console.error("Remove Allocation Failed:", error.response?.data || error.message);
    throw error;
  }
};



export const getAllAirDropHandler = async (limit = 10, page = 1, ChainId) => {
  try {
    const response = await axios.post(
      `https://trendpad.io/api/get/air_drop/?limit=${limit}&page=${page}&ChainId=${ChainId}`
    );
    console.log("Airdrop Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Airdrop Failed:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchParticipantCount = async () => {
  try {
    const response = await axios.get("https://trendpad.io/api/get/participent/count");
    console.log("response.data.count", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch participant count:", error);
  }
}

export const getMyAllPoolsHandler = async (ownerAddress) => {
  try {
    const { chainId } = await getChainInfo();
    const response = await axios.get(`https://trendpad.io/api/get/airdrop/participent/${ownerAddress}/${chainId}`);
    return response.data; // Adjust based on your backend response structure
  } catch (error) {
    console.error("Error fetching pools for owner:", error);
    throw error;
  }
};
export const getParticipantAirdropsHandler = async (userId) => {
  try {
    const { chainId } = await getChainInfo();
    const response = await axios.get(
      `https://trendpad.io/api/get/my_pool/${userId}/${chainId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching participant airdrops:", error);
    throw error;
  }
};