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
import {
  fairwithdrawContributionHandler,
  fairdistributedHandler,
  FairgetCliamHandler,
  fairGetClaimableTokenAmountHandler,
  FairisPoolUserHandler,
  FairgetClaimedTokenAmountHandler,
  FaircontributeHandler,
} from "../../ContractAction/FairLaunchPadAction";
import { useCurrentAccountAddress } from "../../Hooks/AccountAddress";
import { getEthBalance } from "../../ContractAction/ContractDependency";
import { useAccount } from "wagmi";
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
  decimals,
  currencySymbol,
  isNative,
  currencyAddress,
  isSoftCapStatus,
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const refId = queryParams.get("refId");
  console.log("1246", isNative);
  const [amount, setAmount] = useState(poolDetails?.max);
  const [isfinalize, setIsFinalize] = useState(false);
  const [getClaimAmount, setGetClaimAmount] = useState();
  const [isPoolUser, setIsPoolUser] = useState(false);
  const [balance, setBalance] = useState();
  const [claimamount, setClaimamount] = useState();
  const account = useCurrentAccountAddress();
  const contiHandler = async () => {
    try {
      const data = refId ? refId : "0x0000000000000000000000000000000000000000";
      console.log("amountpoolDetails?.max", amount, balance);
      if (!amount) {
        toast.error("Please enter the Buy Amount");
        return;
      }
      if (amount <= 0) {
        toast.error("Max Buy must be greater than 0");
        return;
      }
      if (amount > balance) {
        toast.error(
          `Amount should be less than ${balance} ${" "}${currencySymbol}`
        );
        return;
      }
      if (!isNative) {
        await approvePoolToken(poolDetails?.currencyAddress, amount, poolAddr);
      }
      const tx = await FaircontributeHandler(
        poolAddr,
        data,
        amount,
        account,
        isNative,
        currencyAddress
      );
      if (tx) {
        toast.success("Token bought successfully");
      }
      console.log("tx", tx);
      setUpdate((prev) => !prev);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getEthBalance(account, isNative, currencyAddress);
      console.log("typeOf(balance)", typeof balance);
      setBalance(balance);
    };

    if (account) {
      fetchBalance();
    }
  }, [account, update, isNative, currencyAddress]);

  useEffect(() => {
    (async () => {
      const isfinalize = await fairdistributedHandler(poolAddr);
      setIsFinalize(isfinalize);
      console.log("isfinalize", isfinalize);
      const getClaimAmount = await fairGetClaimableTokenAmountHandler(
        poolAddr,
        account,
        decimals
      );
      console.log("getClaimAmount", getClaimAmount);
      setGetClaimAmount(getClaimAmount);
      const isPoolUser = await FairisPoolUserHandler(poolAddr, account);
      console.log("isPoolUser", isPoolUser);
      setIsPoolUser(isPoolUser);
      const claimamount = await FairgetClaimedTokenAmountHandler(
        poolAddr,
        account,
        decimals
      );
      console.log("claimamount", claimamount);
      setClaimamount(claimamount);
    })();
  }, [poolAddr, account, update]);

  const getClaimHandleClick = async () => {
    const tx = await FairgetCliamHandler(poolAddr);
    if (tx) {
      toast.success("Claim successful");
    }
    setUpdate((prev) => !prev);
  };
  const withDrawContribution = async () => {
    try {
      const tx = await fairwithdrawContributionHandler(poolAddr);
      if (tx) {
        toast.success("Contribution withdrawn successfully");
      }
      setUpdate((prev) => !prev);
    } catch (error) {}
  };

  const lockDate =
    saleStatus === "Upcoming" ? timeDetails?.startTime : timeDetails?.endTime;

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
            <Timer LockDate={lockDate} />
            <ProgressBar start={0} end={poolDetails?.softCap} current={eth} />
          </>
          {isfinalize === true && isPoolUser === true && getClaimAmount > 0 ? (
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
          ) : isfinalize === true && isPoolUser === true && claimamount > 0 ? (
            <>
              <div>
                <Button
                  variant="contained"
                  sx={(theme) => FairLaunchTheme.neonButton(theme)}
                  disabled
                  // onClick={getClaimHandleClick}
                >{`Claimed ${claimamount}`}</Button>
              </div>
              <Divider color="#ffff" />
            </>
          ) : (
            ""
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
                        sx={{ color: "#2299b7" }}
                      >
                        Max
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={(theme) => ({
                  ...FairLaunchTheme.inputStyle(theme),
                  marginTop: "8px",
                })}
              />
              <Button
                variant="contained"
                style={{
                  textTransform: "none",
                  marginTop: "16px",
                  width: "100%",
                }}
                onClick={contiHandler}
                sx={(theme) => FairLaunchTheme.neonButton(theme)}
              >
                Buy with {currencySymbol}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Box>
  );
};

export default Timerpad;
