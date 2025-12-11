import { ethers } from "ethers";
import { MultiSenderAbi } from "../ContractAction/ABI/MultiSenderAbi";
import { ERC20TokenAbi } from "../ContractAction/ABI/ERC20Token";
import { toast } from "react-hot-toast";
import {
  getSignerIfConnected,
  getNetworkConfig,
  getTokenDecimals,
} from "../ContractAction/ContractDependency";

export const approveToken = async (tokenAddress, amount) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const decimals = await getTokenDecimals(tokenAddress);
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const num = ethers.parseUnits(amount.toString(), decimals);
    const tx = await tokenContract.approve(
      config?.addresses?.MultiSenderContractAddress,
      num
    );
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
export const checkAllowance = async (tokenAddress, amount) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    console.error("Invalid amount:", amount);
    return false;
  }
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const decimals = await getTokenDecimals(tokenAddress);
    if (!signer) throw new Error("Signer is required!");
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20TokenAbi,
      signer
    );
    const num = ethers.parseUnits(amount.toString(), decimals);
    const allowance = await tokenContract.allowance(
      await signer.getAddress(),
      config?.addresses?.MultiSenderContractAddress
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
export const multisenderHandler = async (
  tokenAddress,
  addresses,
  selectedOption
) => {
  try {
    const signer = await getSignerIfConnected();
    const config = await getNetworkConfig();
    const decimals = await getTokenDecimals(tokenAddress);
    if (!signer)
      throw new Error("Signer is required for contract interaction.");
    if (!tokenAddress) throw new Error("Token address is missing.");
    if (!addresses || addresses.length === 0)
      throw new Error("No addresses provided.");
    const addr = addresses.map((item) => item?.address?.trim()).filter(Boolean);
    const amount = addresses.map((item) => {
      if (!item?.amount || isNaN(item?.amount))
        throw new Error("Invalid amount entered.");
      return ethers.parseUnits(item.amount.toString(), decimals); // Converts to smallest unit (wei)
    });
    const totalAmount = await addresses.reduce((sum, item) => {
      return sum + (parseFloat(item?.amount) || 0);
    }, 0);
    const num = ethers.parseUnits(totalAmount.toString(), decimals);
    console.log("Total amount", num, tokenAddress);
    const totalPayable = ethers.parseEther("0.01"); // If the function needs some ETH for gas or other reasons.
    console.log(
      "Addresses:",
      addr,
      "Amounts:",
      amount,
      "Token Address:",
      tokenAddress,
      "Selected Option:",
      selectedOption
    );
    const tokenContract = new ethers.Contract(
      config?.addresses?.MultiSenderContractAddress,
      MultiSenderAbi,
      signer
    );
    const txReceipt = await tokenContract.multisendToken(
      tokenAddress,
      selectedOption,
      addr,
      amount,
      { value: totalPayable }
    );
    const tx = await txReceipt.wait();
    return tx;
  } catch (error) {
    console.error("Transaction error:", error);
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
      toast(
        `Something went wrong! Please try again. ${
          error.message || "Unknown reason"
        }`,
        {
          icon: "❌",
          type: "error",
        }
      );
    }
  }
};
