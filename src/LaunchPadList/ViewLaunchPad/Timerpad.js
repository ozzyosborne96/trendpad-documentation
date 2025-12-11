import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Divider } from "@mui/material";
import Timer from "../../Components/Timer";
import ProgressBar from "../../Components/Progressbar";
import { InputAdornment } from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  contributeHandler,
  getClaimableTokenAmountHandler,
  distributedHandler,
  getCliamHandler,
  isPoolUserHandler,
  withdrawContributionHandler,
  approvePoolToken,
} from "../../ContractAction/LaunchPadAction";
import { useCurrentAccountAddress } from "../../Hooks/AccountAddress";
import {
  isNativeTokenHandler,
  getEthBalance,
} from "../../ContractAction/ContractDependency";
import toast from "react-hot-toast";
import { FairLaunchTheme } from "../../LaunchPad/CeateFairLaunch/FairLaunchTheme";
const Timerpad = ({
  poolDetails,
  tokenDetails,
  poolAddr,
  timeDetails,
  saleStatus,
  eth,
  setUpdate,
  update,
  purchased,
  currencySymbol,
  decimals,
  isNative,
  currencyAddress,
  isSoftCapStatus,
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const refId = queryParams.get("refId");
  console.log("Referrer ID:", refId);
  const [amount, setAmount] = useState(poolDetails?.max);
  const [isfinalize, setIsFinalize] = useState(false);
  const [getClaimAmount, setGetClaimAmount] = useState();
  const [isPoolUser, setIsPoolUser] = useState(false);
  const [balance, setBalance] = useState();
  const [textValue, setTextValue] = useState();
  const [lockDate, setLockDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for buy button
  const account = useCurrentAccountAddress();
  console.log("timeDetails", timeDetails);
  const contiHandler = async () => {
    if (isLoading) return; // Prevent double-clicks

    try {
      setIsLoading(true);
      const data = refId ? refId : "0x0000000000000000000000000000000000000000";

      // Validation
      if (!amount) {
        toast.error("Please enter the Buy Amount");
        setIsLoading(false);
        return;
      }
      if (amount <= 0) {
        toast.error("Max Buy must be greater than 0");
        setIsLoading(false);
        return;
      }

      if (amount > balance) {
        toast.error(
          `Amount should be less than ${balance} ${""}${currencySymbol}`
        );
        setIsLoading(false);
        return;
      }

      // Show loading toast
      const toastId = toast.loading("Processing your purchase...");

      // Approve if not native token
      if (!isNative) {
        toast.loading("Approving tokens...", { id: toastId });
        await approvePoolToken(poolDetails?.currencyAddress, amount, poolAddr);
      }

      // Execute purchase
      toast.loading("Confirming transaction...", { id: toastId });
      const tx = await contributeHandler(
        poolAddr,
        data,
        amount,
        account,
        isNative,
        poolDetails?.currencyAddress
      );

      console.log("tx", tx);

      if (tx) {
        toast.success("🎉 Purchase Successful! Data is refreshing...", {
          id: toastId,
          duration: 4000,
        });

        // Refresh data after successful purchase
        setUpdate((prev) => !prev);

        // Optional: Reload page after a short delay for full refresh
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Transaction failed. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.error("Purchase error:", error);

      // Handle specific error messages
      if (error?.message?.includes("user rejected")) {
        toast.error("Transaction cancelled by user");
      } else if (error?.message?.includes("insufficient funds")) {
        toast.error("Insufficient funds for transaction");
      } else {
        toast.error(error?.message || "Purchase failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Consolidated effect: Fetch all user-related data in parallel
  useEffect(() => {
    if (!poolAddr || !account) return;

    const fetchUserData = async () => {
      try {
        // Fetch all data in parallel to reduce sequential delays
        const [isfinalize, getClaimAmount, isPoolUser, balance] =
          await Promise.all([
            distributedHandler(poolAddr),
            decimals
              ? getClaimableTokenAmountHandler(poolAddr, account, decimals)
              : Promise.resolve(null),
            isPoolUserHandler(poolAddr, account),
            getEthBalance(account, isNative, currencyAddress),
          ]);

        setIsFinalize(isfinalize);
        setGetClaimAmount(getClaimAmount);
        setIsPoolUser(isPoolUser);
        setBalance(balance);

        console.log("User data fetched:", {
          isfinalize,
          getClaimAmount,
          isPoolUser,
          balance,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [poolAddr, account, update, decimals, isNative, currencyAddress]); // Removed poolDetails

  const getClaimHandleClick = async () => {
    const tx = await getCliamHandler(poolAddr);
    if (tx) {
      toast.success("Claim successful");
    }
    setUpdate((prev) => !prev);
  };
  const withDrawContribution = async () => {
    try {
      const tx = await withdrawContributionHandler(poolAddr);
      setUpdate((prev) => !prev);
      if (tx) {
        toast.success("Contribution withdrawn successfully");
      }
    } catch (error) {}
  };
  const calculateTokenAmount = (amount) => {
    if (!amount || !poolDetails?.presaleRate) return 0;
    return (amount * poolDetails.presaleRate).toFixed(2);
  };

  // Calculate token amount when amount or presale rate changes
  useEffect(() => {
    const result = calculateTokenAmount(amount);
    setTextValue(result);
  }, [poolDetails?.presaleRate, amount]); // Only depend on specific property

  // Set lock date based on sale status
  useEffect(() => {
    if (!timeDetails) return;
    const calculatedDate =
      saleStatus === "Upcoming" ? timeDetails.startTime : timeDetails.endTime;
    setLockDate(calculatedDate);
  }, [saleStatus, timeDetails]); // Remove console.log to reduce noise
  return (
    <Box
      sx={(theme) => ({
        ...FairLaunchTheme.cardStyle(theme),
        marginBottom: "20px",
      })}
    >
      <div className="text-center">
        <Typography
          variant="subtitle1"
          sx={{ color: "#C0BEBE", fontWeight: "700" }}
        >
          {saleStatus === "Upcoming"
            ? "Presale starts in ..."
            : saleStatus === "Live"
            ? "Presale ends in ..."
            : saleStatus === "Filled"
            ? "Presale is filled"
            : ""}
        </Typography>
        <div className="flex-col gap-16 mt-4">
          <>
            {saleStatus !== "Cancelled" && saleStatus !== "Filled" && (
              <Timer LockDate={lockDate} />
            )}
            <ProgressBar start={0} end={poolDetails?.hardCap} current={eth} />
          </>
          {isfinalize === true && isPoolUser === true && getClaimAmount > 0 && (
            <>
              <div>
                <Button
                  variant="contained"
                  onClick={getClaimHandleClick}
                  sx={(theme) => FairLaunchTheme.neonButton(theme)}
                >{`Claim ${getClaimAmount}`}</Button>
              </div>
              <Divider color="#ffff" />
            </>
          )}
          {(purchased > 0 &&
            isPoolUser === true &&
            saleStatus === "Cancelled") ||
          (!isSoftCapStatus &&
            isPoolUser === true &&
            saleStatus === "Ended") ? (
            <div>
              <Button
                variant="contained"
                onClick={withDrawContribution}
                sx={(theme) => FairLaunchTheme.neonButton(theme)}
              >
                Withdraw Contribution
              </Button>
            </div>
          ) : saleStatus === "Live" ? (
            <div>
              <Typography>
                Amount (MAX : {balance} {currencySymbol})
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={`Ex: 0.4 ${currencySymbol}`}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                sx={(theme) => FairLaunchTheme.inputStyle(theme)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => {
                          if (balance) {
                            setAmount(balance);
                          }
                        }}
                        size="small"
                        variant="outlined"
                      >
                        Max
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography>
                You will receive {textValue} {tokenDetails?.symbol}
              </Typography>
              <Button
                style={{ textTransform: "none", marginTop: "8px" }}
                onClick={contiHandler}
                disabled={isLoading}
                sx={(theme) => ({
                  ...FairLaunchTheme.neonButton(theme),
                  width: "100%",
                  mt: 2,
                })}
              >
                {isLoading ? "Processing..." : `Buy with ${currencySymbol}`}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Box>
  );
};

export default Timerpad;
