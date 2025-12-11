import { ethers } from "ethers"; // Default ethers import
import toast from "react-hot-toast";
import { AirDropFactoryAbi } from "../ContractAction/ABI/AirDropFactoryAbi";
import { AirDropPoolAbi } from "../ContractAction/ABI/AirDropPoolAbi";
import { ERC20TokenAbi } from "../ContractAction/ABI/ERC20Token";
import { getSignerIfConnected } from "../ContractAction/ContractDependency";
import { getProvider, getNetworkConfig, getTokenDecimals, getCurrentAccount, hasEnoughForTx } from "../ContractAction/ContractDependency";
import { createAirDropAPI } from "../AirDrops/ApiAirdropHandler";
import { getChainInfo } from "../ContractAction/ContractDependency";
import {
  setAllocationApiHandler,
  startAirdropApi,
  cancelPoolApiHandler,
  claimAirdropHandler,
  removeAllocationApiHandler,
} from "../AirDrops/ApiAirdropHandler";
import { currencyData } from "../utils/currency";
import dayjs from "dayjs";

export const checkAllowance = async (tokenAddress, amount, addr) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    console.error("Invalid amount:", amount);
    return false;
  }
  try {
    const signer = await getSignerIfConnected();
    if (!signer) throw new Error("Signer is required!");
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const decimals = await getTokenDecimals(tokenAddress);
    const num = ethers.parseUnits(amount.toString(), decimals);
    const allowance = await tokenContract.allowance(
      await signer.getAddress(),
      addr
    );
    console.log("allowance", allowance, num, allowance >= num);
    return allowance >= num;
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

export const createAirDropHandler = async (
  tokenAddress,
  creatorAddress,
  metaData,
  tokenDetails
) => {
  console.log(
    "**********",
    tokenAddress,
    creatorAddress,
    metaData,
    tokenDetails
  );

  try {
    if (!window.ethereum) {
      throw new Error("MetaMask or Web3 provider is not available.");
    }
    const config = await getNetworkConfig();
    const { chainId } = await getChainInfo();
    const signer = await getSignerIfConnected();
    const metaDataStr = JSON.stringify(metaData);
    const str = JSON.stringify(metaDataStr);
    console.log(
      "createAirDropHandler",
      tokenAddress,
      creatorAddress,
      str,
      chainId
    );
    const contract = new ethers.Contract(
      config?.addresses?.AirDropFactoryContractAddress,
      AirDropFactoryAbi,
      signer
    );
    const platFormFee = await currencyData[chainId]?.airdropFee;
    console.log("platFormFee",platFormFee);
    // get PlatformFees
    const platformFeeInwei =  ethers.parseUnits(platFormFee,18);
    console.log("platformFeeInwei",platformFeeInwei);
    const account = await getCurrentAccount();
    // const canProceed = await hasEnoughForTx({
    //   to: account,
    //   value: ethers.parseEther(platformFeeInwei || "0"),
    // });
    // if (!canProceed) {
    //   toast.error(`You do not have enough ${config?.nativeToken} to cover the transaction and gas fee.`);
    //   return;
    // }
    console.log("Contract Instance:", contract);
    console.log("Available Functions:", Object.keys(contract));
    const txResponse = await contract.createAirdrop(tokenAddress, metaDataStr, {
      value: platformFeeInwei,
    });
    console.log("Transaction response:", txResponse);
    const receipt = await txResponse.wait();
    console.log("Transaction receipt:", receipt);
    let addr = null;
    const iface = new ethers.Interface(AirDropFactoryAbi);
    receipt.logs.forEach((log) => {
      try {
        const parsedLog = iface.parseLog(log);
        console.log("Parsed Log:", parsedLog);
        if (parsedLog.name === "PoolCreated") {
          console.log("🎉 LockAdded event detected!");
          addr = parsedLog.args[0].toString(); // Capture Lock ID
          console.log("Lock ID:", addr);
          console.log("Token Address:", parsedLog.args[1]);
          console.log("Owner Address:", parsedLog.args[2]);
          console.log("Amount:", parsedLog.args[3].toString());
          console.log("Unlock Date:", parsedLog.args[4].toString());
        }
      } catch (error) {
        console.log("Error parsing log:", error);
      }
    });
    const data = {
      Pool_Address: addr,
      Owner_Address: creatorAddress,
      Token_Address: tokenAddress,
      Token_Name: tokenDetails?.name,
      Symbol: tokenDetails?.symbol,
      Decimal: tokenDetails?.decimals,
      ChainId: chainId,
      AirDrop_Tittle: metaData?.airdropTitle,
      WebSite: metaData?.website,
      Facebook: metaData?.facebook,
      Twitter: metaData?.twitter,
      Github: metaData?.github,
      Telegram: metaData?.telegram,
      Discord: metaData?.discord,
      Instagram: metaData?.instagram,
      Reddit: metaData?.reddit,
      Description: metaData?.description,
      LogoURL: metaData?.logoURL,
      YouTubeURL: metaData?.youtube,
      TotalAllocation: 0,
      Total_Claimed: 0,
      Start_Time: 0,
      Is_Canceled: false,
      TGE_release_percentage: 0,
      Cycle: 0,
      Cycle_release_Percentage: 0,
    };
    if (addr) {
      await createAirDropAPI(data);
    }
    return addr;
  } catch (error) {
    console.error("Error in createAirDropHandler:", error);

    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }

    return null;
  }
};
export const getPoolDetailsHandler = async (addrr, decimals1 = 18) => {
  try {
    const provider = await getProvider();
    console.log("getPoolDetailsHandler456986", provider);
    const contract = new ethers.Contract(addrr, AirDropPoolAbi, provider);
    const poolDetails = await contract.getPoolDetails();
    console.log("Pool details", poolDetails);
    return {
      poolDetails: {
        tokenAddress: poolDetails[0],
        startTime: Number(poolDetails[1]) === 0 ? Number(poolDetails[1]) : new Date(Number(poolDetails[1]) * 1000).toLocaleString(
          "en-US"
        ),
        tgePercent: Number(poolDetails[2]),
        cyclePercent: Number(poolDetails[3]),
        cycleTime: Number(poolDetails[4]) / 60,
        totalParticipants: Number(poolDetails[5]),
        allocations: ethers.formatUnits(poolDetails[6], decimals1), // Ensure allocations is a number
        totalClaimed: ethers.formatUnits(poolDetails[7], decimals1),
        // state: Number(poolDetails[8]), // Convert to human-readable state
        metaData: poolDetails[8] ? JSON.parse(poolDetails[8]) : {}, // Parse only if not empty
      },
    };
  } catch (error) {
    console.error("Error in getPoolDetailsHandler:", error);
    return null;
  }
};

export const getOwnerHandler = async (addrr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(addrr, AirDropPoolAbi, provider);
    const owner = await contract.owner();
    console.log("Owner", owner);
    return owner;
  } catch (error) {
    console.error("Error in createAirDropHandler:", error);

    return null;
  }
};

export const approveToken = async (tokenAddress, amount, addr) => {
  try {
    const signer = await getSignerIfConnected();
    console.log("Approval token", tokenAddress, amount);
    const decimals = await getTokenDecimals(tokenAddress);
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const num = ethers.parseUnits(amount.toString(), decimals);
    const tx = await tokenContract.approve(addr, num);
    await tx.wait();

    console.log("Transaction Hash:", tx.hash);
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

export const startAirDropHandler = async (
  timeInMillis,
  addr,
  bal,
  tokenAddress
) => {
  console.log(
    "beforeTyrStartAirDropHandler",
    timeInMillis,
    addr,
    bal,
    tokenAddress
  );

  try {
    const signer = await getSignerIfConnected();
    console.log("StartAirDropHandler", timeInMillis, addr, bal, tokenAddress);
    const contract = new ethers.Contract(addr, AirDropPoolAbi, signer);
    const txResponse = await contract.startAirdrop(timeInMillis);
    const receipt = await txResponse.wait();
    const formatted = dayjs(timeInMillis * 1000).format("YYYY-MM-DD HH:mm:ss");
    if (receipt) {
      await startAirdropApi(addr, timeInMillis);
    }
    console.log("Received", receipt);
    return receipt.hash;
  } catch (error) {
    console.error("Error in createAirDropHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }
    return null;
  }
};

export const getTotalAllocation = async (addr, decimals) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, provider);
    const totalAllocation = await contract.getTotalAllocationAmount();
    console.log("Total allocation", totalAllocation);
    return ethers.formatUnits(totalAllocation, decimals);
  } catch (error) {
    console.error("Error in createAirDropHandler:", error);
    return null;
  }
};

export const getAirdropState = async (addr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, provider);
    const airdropState = await contract.getAirdropState();
    console.log("airdropState", airdropState);
    return Number(airdropState);
  } catch (error) {
    console.error("Error in createAirDropHandler:", error);
    return null;
  }
};

export const setAllocationHandler = async (addr, entries, decimals) => {
  try {
    const signer = await getSignerIfConnected();
    console.log("setAllocationHandler", decimals);
    const amounts = entries.map((e) =>
      ethers.parseUnits(e.amount.toString(), decimals)
    );
    const addresses = entries.map((e) => e.address);
    const contract = new ethers.Contract(addr, AirDropPoolAbi, signer);
    const tx = await contract.setAllocation(addresses, amounts);
    const receipt = await tx.wait();
    const Allocation_Address = entries.map((entry) => {
      const amount = ethers.parseUnits(entry.amount.toString(), decimals).toString();
      return {
        add: entry.address,
        amount,
      };
    });
    console.log("Allocation_Address:", Allocation_Address);
    if (receipt) {
      await setAllocationApiHandler(Allocation_Address, addr);
    }
    return receipt.hash;
  } catch (error) {
    console.error("Error in setAllocationHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }
    return null;
  }
};

export const removeAllocationHandler = async (addr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, signer);
    const removeStatus = await contract.remove_ALL_Allocation();
    const receipt = removeStatus.wait();
    if (receipt) {
      await removeAllocationApiHandler(addr);
    }
    return receipt?.hash;
  } catch (error) {
    console.error("Error in setVestingHandler:", error);

    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }
    return null;
  }
};

export const setVestingHandler = async (
  addr,
  tgePercent,
  cyclePercent,
  cycleTime
) => {
  try {
    const signer = await getSignerIfConnected();
    if (!addr || !tgePercent || !cyclePercent || !cycleTime || !signer) {
      console.error("Missing required parameters!");
      toast.error("Invalid parameters. Please check your inputs. ❌");
      return null;
    }
    const contract = new ethers.Contract(addr, AirDropPoolAbi, signer);
    const tge = Number(tgePercent);
    const cycle = Number(cyclePercent);
    const duration = Number(cycleTime) * 60;
    console.log("Setting Vesting Params:", { addr, tge, cycle, duration });
    const tx = await contract.setVesting(tge, cycle, duration);
    const receipt = await tx.wait();
    console.log("Vesting Set Successfully:", receipt.transactionHash);
    return receipt.hash;
  } catch (error) {
    console.error("Error in setVestingHandler:", error);

    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }
    return null;
  }
};
export const cancelAirdropHandler = async (addr) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, signer);
    const cancelIr = await contract.cancelAirdrop();
    const receipt = cancelIr.wait();
    if (receipt) {
      await cancelPoolApiHandler(addr);
    }
    return receipt?.hash;
  } catch (error) {
    console.error("Error in setVestingHandler:", error);

    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }
    return null;
  }
};

export const getAllAirDropsHandler = async () => {
  try {
    const signer = await getSignerIfConnected();
    if (!signer) {
      console.error("Signer is required!");
      toast.error("Signer is missing! ❌");
      return null;
    }
    const config = await getNetworkConfig()
    const contract = new ethers.Contract(
      config?.addresses?.AirDropFactoryContractAddress,
      AirDropFactoryAbi,
      signer
    );
    const allAirDrops = await contract.getAllPools();
    console.log("Fetched Airdrops:", allAirDrops);
    const newData = allAirDrops?.map((airDrop) => airDrop);
    return newData || [];
  } catch (error) {
    console.error("Error in getAllAirDropsHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }
    return [];
  }
};

export const getAllAllocationHandler = async (addr) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, provider);
    const allocation = await contract.getAllAllocation();
    console.log("Fetched_Allocation:", allocation);
    const addresses = allocation.map((addr) => addr);
    return addresses;
  } catch (error) {
    console.error("Error in getAllAirDropsHandler:", error);
    return [];
  }
};

export const getUserAllocationHandler = async (addr, account, decimals) => {
  try {
    if (!addr || !account) throw new Error("Invalid address or account.");
    if (decimals === undefined || decimals === null) throw new Error("Decimals not provided.");

    console.log("Calling getUserAllocationHandler with decimals:", decimals);

    const provider = await getProvider();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, provider);

    const allocationUser = await contract.getUserAllocation(account);
    console.log("Raw allocation:", allocationUser.toString());

    const formatted = ethers.formatUnits(allocationUser, decimals);
    console.log("formatted", formatted);
    return formatted;
  } catch (error) {
    console.error(`Error in getUserAllocationHandler for ${addr}:`, error);
    return "0";
  }
};

export const getClaimedAllocationHandler = async (addr, account, decimals) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, provider);
    const allocationUser = await contract.getUserClaimed(account);
    return ethers.formatUnits(allocationUser, decimals);
  } catch (error) {
    console.error("Error in getAllAirDropsHandler:", error);
    return [];
  }
};

export const claimHandler = async (addr, account, withdraw) => {
  try {
    const signer = await getSignerIfConnected();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, signer);
    const allocationUser = await contract.claim();
    const receipt = await allocationUser.wait();
    if (receipt) {
      await claimAirdropHandler(addr, account, withdraw);
    }
    return receipt.hash;
  } catch (error) {
    console.error("Error in getAllAirDropsHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }
    return [];
  }
};

export const withdrawableTokensHandler = async (addr, account, decimals) => {
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(addr, AirDropPoolAbi, provider);
    const withdraw = await contract.withdrawableTokens(account);
    console.log("withdra1234w", withdraw);
    return ethers.formatUnits(withdraw, decimals);
  } catch (error) {
    console.error("Error in getAllAirDropsHandler:", error);
    return [];
  }
};

export const getPoolForUserHandler = async (account) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig()
    const contract = new ethers.Contract(
      config?.addresses?.AirDropFactoryContractAddress,
      AirDropFactoryAbi,
      signer
    );
    const details = await contract.getPoolForUser(account);
    console.log("createdbyyou", details);
    const addressess = details.map((item) => item);
    return addressess;
  } catch (error) {
    console.error("Error in getAllAirDropsHandler:", error);
    if (error.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected by user ❌");
    } else if (error.code === "CALL_EXCEPTION") {
      toast.error(`Transaction failed: ${error.reason || "Unknown reason"} ❌`);
    } else {
      toast.error(
        `Something went wrong! Please try again. ${error.message || "Unknown error"
        } ❌`
      );
    }
    return [];
  }
};

export const nextClaimTimeHandler = async (addr, userAddress) => {
  try {
    if (!addr || !userAddress) {
      throw new Error("Invalid address or user address");
    }
    const provider = await getProvider();
    const contract = new ethers.Contract(
      addr,
      AirDropPoolAbi,
      provider
    );
    const nextClaim = await contract.nextClaimTime(userAddress);
    const nextClaimTimestamp = Number(nextClaim);
    return nextClaimTimestamp === 0
      ? 0
      : dayjs(nextClaimTimestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
  } catch (error) {
    console.error("Error in nextClaimTimeHandler:", error);
    return null;
  }
};