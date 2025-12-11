import axios from "axios";

export const fetchPools = async (type, sort, status, chain,search) => {
  try {
    const response = await axios.get(
      "https://trendpad.io/api/pool/search",
      {
        params: {
          limit: 50,
          page: 1,
          search: search,
          chain: chain,
          status: status,
          sort: sort,
          types: type,
        },
      }
    );
    console.log("API Response:", response?.data?.Allpool);
    return response?.data?.Allpool;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getAdvancedSections = async (filters) => {
  try {
    const response = await axios.put("https://trendpad.io/api/get/advance/sections", {
      limit: filters.limit || 10,
      page: filters.page || 1,
      chain: filters.chain,
      hardcap: filters.hardcap,
      Currency: filters.Currency,
      Sale_type: filters.Sale_type,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching advanced sections:", error);
    throw error;
  }
};



export const getParticipantPool = async (address) => {
  try {
    const response = await axios.get(`https://trendpad.io/api/get/participent/pool/${address}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching participant pool:", error);
    throw error;
  }
};
