import { ethers } from 'ethers'
import { PairAbi } from "../ContractAction/ABI/PairAbi";
import { ERC20TokenAbi } from "../ContractAction/ABI/ERC20Token";
import { getSignerIfConnected,getProvider } from "../ContractAction/ContractDependency";
export const isLpToken = async (tokenAddress) => {
    const signer = await getSignerIfConnected();
    const tokenContract = new ethers.Contract(tokenAddress, PairAbi, signer);
    try {
        await tokenContract.token0(); // If this succeeds, it's an LP token
        await tokenContract.token1();
        return true;
    } catch (error) {
        return false;
    }
}
export async function getPairDetails(pairAddress) {
    try {
        const provider = await getProvider();
        const pairContract = new ethers.Contract(pairAddress, PairAbi, provider);
        const token0 = await pairContract.token0();
        const token1 = await pairContract.token1();
        const token0Contract = new ethers.Contract(token0, ERC20TokenAbi, provider);
        const token1Contract = new ethers.Contract(token1, ERC20TokenAbi, provider);
        const token0Symbol = await token0Contract.symbol();
        const token1Symbol = await token1Contract.symbol();
        console.log(`Pair Name: ${token0Symbol}/${token1Symbol}`);
        console.log(`Token: ${token0} (${token0Symbol})`);
        console.log(`Quote Token: ${token1} (${token1Symbol})`);
        return {
            name: `${token0Symbol}/${token1Symbol}`,
            token: {
                address: token0,
                symbol: token0Symbol
            },
            quoteToken: {
                address: token1,
                symbol: token1Symbol
            }
        };
    } catch (error) {
        console.error("Error fetching pair details:", error);
        return null; // Return null to handle errors properly
    }
}