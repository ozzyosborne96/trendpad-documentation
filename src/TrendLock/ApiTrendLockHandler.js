import axios from 'axios';
import { getChainInfo } from "../ContractAction/ContractDependency";
import { getCurrentAccount, getTokenDetails } from "../ContractAction/ContractDependency";
export const createLock = async (data) => {
    const { chainId, chainName } = await getChainInfo();
    const { name, symbol, decimals, totalSupply } = await getTokenDetails(data.tokenAddress);
    console.log("createLock", data, name, symbol, decimals, totalSupply);
    const account = await getCurrentAccount();
    try {
        const response = await axios.post('https://trendpad.io/api/create/lock', {
            Lock_Id: data.Lock_Id,
            Chain_Id: chainId,
            Token_add: data.tokenAddress,
            Title: data.description,
            Lock_Owner: data?.account,
            Lock_Amount: data.amount,
            Is_Vesting: false,
            UnLock_Date: data.blockTimestamp,
            Is_LP: data.isLpToken,
            Total_value_Locked: 0,
            Token_Name: name,
            Token_Symbol: symbol,
            Token_Decimal: Number(decimals),
            Total_Supply: totalSupply
        });
        console.log('Lock created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating lock:', error.response?.data || error.message);
        throw error;
    }
};


export const createVestingLock = async (data) => {
    const { chainId, chainName } = await getChainInfo();
    const { name, symbol, decimals, totalSupply } = await getTokenDetails(data.tokenAddress);
    const account = await getCurrentAccount();
    console.log("createVestingLock", data, name, symbol, decimals, totalSupply);
    try {
        const response = await axios.post('https://trendpad.io/api/create/lock', {
            Lock_Id: data.Lock_Id,
            Chain_Id: chainId,
            Token_add: data.tokenAddress,
            Title: data.description,
            Lock_Owner: data?.account,
            Lock_Amount: data?.amount,
            Is_Vesting: true,
            UnLock_Date: data.blockTimestamp,
            TGE_Percentage: data.tgePerHundred,
            Cycle: data.cycle,
            Cycle_release_Percentage: data.cyReleasePerHundred,
            Is_LP: data.isLpToken,
            Total_value_Locked: 0,
            Token_Name: name,
            Token_Symbol: symbol,
            Token_Decimal: Number(decimals),
            Total_Supply: totalSupply
        });
        console.log('Lock created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating lock:', error.response?.data || error.message);
        throw error;
    }
};