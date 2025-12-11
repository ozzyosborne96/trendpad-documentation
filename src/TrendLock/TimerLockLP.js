import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { Container, Box, Typography, Button } from "@mui/material";
import Timer from "../Components/Timer";
import Disclaimer from "../Components/Disclaimer";
import {
  UnLockHandler,
  getLockDetailsById,
  withDrawAbleTokenHandler,
  identifyDEXName,
} from "../ContractAction/TrendLockAction";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import useGetTokenDetails from "../Hooks/GetTokenDetails";
import { useNavigate, useLocation } from "react-router-dom";
import FormDialog from "../Components/DialogueBoxLock";
import FormRenounceDialog from "../Components/boxRenounceTransOwner";
import FormEditTitleDialog from "../Components/boxEditLockTittle";
import { useGlobalState } from "../Context/GlobalStateContext";
import { getPairDetails } from "../ContractAction/DexContractActionData";
import TradingChart from "../Components/TradingViewWidget";
import toast from "react-hot-toast";
import {
  getTokenDecimals,
  getChainInfo,
} from "../ContractAction/ContractDependency";
import { useUnlockValue } from "../Hooks/useUnlockValue";
import TokenAddressLink from "../Components/TokenAddressLink";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const TimerLockLP = () => {
  const account = useCurrentAccountAddress();
  const fetchTokenDetails = useGetTokenDetails();
  const { timeUp } = useGlobalState();
  const [tokenDetails, setTokenDetails] = useState(null);
  const [tokenDetails1, setTokenDetails1] = useState(null);

  const location = useLocation();
  const tokenAddress = location?.state?.data;
  const isLpToken = location?.state?.isTokenLp || false;
  const lockId = location?.state?.lockId;
  console.log("lockId", lockId);
  console.log("isLpToken", isLpToken);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openRe, setOpenRe] = React.useState(false);
  const [openReTitle, setOpenReTitle] = React.useState(false);
  const [vestingData, setVestingData] = React.useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [pairDetails, setPairDetails] = useState();
  const [unlock, setUnlock] = useState(false);
  const [withdrawamount, setWithdrawamount] = useState();
  const [futureDate, setFutureDate] = useState();
  const [lockDate, setLockDate] = useState(null);
  const [update, setUpdate] = useState(false);
  const [decimals, setDecimals] = useState();
  const [dexName, setDexName] = useState();

  // useEffect(() => {
  //   const duration = Math.round(tokenDetails?.cycle || 0);
  //   const type = tokenDetails?.cycleType?.toLowerCase();
  //   let futureDate = new Date();

  //   switch (type) {
  //     case "weeks":
  //       futureDate = new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000);
  //       break;
  //     case "days":
  //       futureDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
  //       break;
  //     case "hours":
  //       futureDate = new Date(Date.now() + duration * 60 * 60 * 1000);
  //       break;
  //     case "minutes":
  //       futureDate = new Date(Date.now() + duration * 60 * 1000);
  //       break;
  //     case "seconds":
  //       futureDate = new Date(Date.now() + duration * 1000);
  //       break;
  //     case "months":
  //       futureDate = new Date();
  //       futureDate.setMonth(futureDate.getMonth() + duration);
  //       break;
  //     case "years":
  //       futureDate = new Date();
  //       futureDate.setFullYear(futureDate.getFullYear() + duration);
  //       break;
  //     default:
  //       futureDate = new Date(); // fallback to current date
  //   }

  //   const tgeDate = tokenDetails?.tgedate
  //     ? new Date(tokenDetails.tgedate)
  //     : null;
  //   const now = new Date();

  //   if (tgeDate && tgeDate > now) {
  //     setLockDate(tgeDate);
  //   } else if (futureDate) {
  //     setLockDate(futureDate);
  //   }

  //   console.log("futureDate", futureDate.toLocaleString("en-US")); // e.g. 5/6/2025, 12:00:00 AM
  //   setFutureDate(futureDate.toLocaleString("en-US"));
  // }, [
  //   tokenDetails?.cycle,
  //   tokenDetails?.cycleType,
  //   tokenDetails?.tgedate,
  //   timeUp,
  // ]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickReOpen = () => {
    setOpenRe(true);
  };
  const handleClickReOpenTitle = () => {
    setOpenReTitle(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickReClose = () => {
    setOpenRe(false);
  };
  const handleClickReCloseTitle = () => {
    setOpenReTitle(false);
  };
  const { data: unLockValue, isLoading } = useUnlockValue(lockId, 18);

  const fetchData = async () => {
    try {
      const { chainId } = await getChainInfo();
      const decimals = await getTokenDecimals(tokenAddress);
      console.log("jdvkdsgfilds", decimals);
      setDecimals(decimals);
      if (!account) return; // Prevent running if account is null
      let tokenLockDetails;
      if (isLpToken) {
        tokenLockDetails = await getLockDetailsById(lockId, decimals);
      } else {
        tokenLockDetails = await getLockDetailsById(lockId, decimals);
      }
      setTokenDetails(tokenLockDetails);
      console.log("Updated tokenDetails:", tokenLockDetails);
      if (tokenAddress) {
        if (isLpToken) {
          const pairInfo = await getPairDetails(tokenAddress);
          setPairDetails(pairInfo);
          console.log("Updated pairDetails:", pairInfo);
        } else {
          const tokenInfo = await fetchTokenDetails(tokenAddress);
          setTokenDetails1(tokenInfo);
          console.log("Updated tokenDetails1:", tokenInfo);
        }
      }
      const unLockValue = await withDrawAbleTokenHandler(lockId);
      console.log("unLockValue", unLockValue);
      const formattedAmount = ethers.formatUnits(
        unLockValue.toString(),
        decimals
      );
      setWithdrawamount(formattedAmount);
      console.log("withdrawamount", withdrawamount);
      const dexName = await identifyDEXName(tokenAddress, chainId);
      console.log("dexName", dexName);
      setDexName(dexName);
      if (
        unLockValue > 0 ||
        (tokenDetails.unLockAmount === "0.0" && tokenDetails.cycle === 0) //first condition for vesting and secand for normal lock
      ) {
        setUnlock(false);
      } else {
        setUnlock(true);
      }
    } catch (error) {
      console.error("Error fetching token details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLpToken, tokenAddress, lockId, timeUp, update, unLockValue]);
  console.log("timeUp", timeUp, unlock, update);

  const handleUnlock = async () => {
    const tx = await UnLockHandler(tokenDetails?.lockId);
    if (tx) {
      toast.success("Token Unlocked successfully", {
        icon: "✅",
      });
    }
    await fetchData();
    console.log("Transaction", tx);
  };
  // const vestingInfo = (tgeDate, tgePercentage, cycleMinutes, cyclePercentage) => {
  //     console.log("vestinginfo", tgeDate, tgePercentage, cycleMinutes, cyclePercentage);
  //     let totalUnlocked = tgePercentage; // Start with TGE percentage
  //     const vestingSchedule = [];
  //     let unlockTime = new Date(tgeDate * 1000); // Convert UNIX timestamp to Date
  //     vestingSchedule.push({
  //         unlockNumber: 1,
  //         timeUTC: unlockTime.toISOString().replace("T", " ").substring(0, 16), // Format: YYYY-MM-DD HH:mm
  //         unlockedTokens: `${tgePercentage} (${tgePercentage}%)`
  //     });
  //     let unlockNumber = 2; // Start from second unlock
  //     while (totalUnlocked < 100) {
  //         unlockTime.setMinutes(unlockTime.getMinutes() + cycleMinutes);
  //         let remainingPercentage = Math.min(cyclePercentage, 100 - totalUnlocked);
  //         totalUnlocked += remainingPercentage;
  //         vestingSchedule.push({
  //             unlockNumber: unlockNumber++,
  //             timeUTC: unlockTime.toISOString().replace("T", " ").substring(0, 16),
  //             unlockedTokens: `${remainingPercentage} (${remainingPercentage}%)`
  //         });
  //     }
  //     return vestingSchedule;
  // };

  // useEffect(() => {
  //     const fetchVestingInfo = () => {
  //         const tgeDate = new Date(tokenDetails?.tgedate).getTime() / 1000; // Convert to UNIX timestamp (seconds)
  //         if (isNaN(tgeDate) || tgeDate <= 0) {
  //             console.error("Invalid TGE date:", tokenDetails?.tgedate);
  //             return;
  //         }
  //         const vestingInfoData = vestingInfo(
  //             tgeDate,
  //             Number(tokenDetails?.tgePercent),
  //             Number(tokenDetails?.cycle),
  //             Number(tokenDetails?.cycleRelease)
  //         );
  //         setVestingData(vestingInfoData);
  //     };
  //     fetchVestingInfo();
  // }, [tokenDetails]);

  const InfoRow = ({ label, value, isLink, address }) => (
    <div
      className="flex justify-between items-center owner-zone-text"
      style={{ padding: "12px 0", borderBottom: "1px solid #333" }}
    >
      <Typography
        variant="body1"
        sx={{ color: (theme) => theme.palette.text.secondary }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: "700", color: (theme) => theme.palette.text.primary }}
      >
        {isLink ? (
          <TokenAddressLink
            address={address || tokenAddress}
            color="#1D64FA"
            truncate={true}
            showCopyIcon={true}
          />
        ) : (
          value || "--"
        )}
      </Typography>
    </div>
  );

  return (
    <Container>
      <Box
        className="flex-col justify-center items-center"
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          padding: "20px 32px",
          marginBottom: "24px",
          marginTop: "16px",
        })}
      >
        <Typography
          variant="h6"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            fontWeight: "700",
          })}
        >
          Unlock In
        </Typography>
        <div mt={4}>
          {/* <Timer LockDate={lockDate} /> */}
          <Timer LockDate={tokenDetails?.tgedate} />
        </div>
      </Box>
      <Box mt={4}>
        {tokenDetails1?.symbol && (
          <TradingChart symbol={tokenDetails1?.symbol} />
        )}
        {/* <img src='/images/container.png' alt="" height={700} width={"100%"} /> */}
      </Box>
      {isLpToken ? (
        <Box
          className="flex-col gap-24"
          mt={4}
          sx={(theme) => ({
            ...FairLaunchTheme.cardStyle(theme),
            padding: "20px 32px",
          })}
        >
          <div className="owner-zone-text">
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                fontWeight: "700",
                mb: 2,
              })}
            >
              Pair Info
            </Typography>
          </div>
          <InfoRow label="Pair Address" isLink={true} address={tokenAddress} />
          <InfoRow label="Pair Name" value={pairDetails?.name} />
          <InfoRow label="Token" value={pairDetails?.token?.symbol} />
          <InfoRow
            label="Quote Token"
            value={pairDetails?.quoteToken?.symbol}
          />
          <InfoRow label="Dex" value={dexName} />
        </Box>
      ) : (
        <Box
          className="flex-col gap-24"
          mt={4}
          sx={(theme) => ({
            ...FairLaunchTheme.cardStyle(theme),
            padding: "20px 32px",
          })}
        >
          <div className="owner-zone-text">
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                fontWeight: "700",
                mb: 2,
              })}
            >
              Token Info
            </Typography>
          </div>
          <InfoRow label="Token Address" isLink={true} address={tokenAddress} />
          <InfoRow label="Token Name" value={tokenDetails1?.name} />
          <InfoRow label="Token Symbol" value={tokenDetails1?.symbol} />
          <InfoRow label="Token Decimals" value={tokenDetails1?.decimals} />
        </Box>
      )}

      <Box
        className="flex-col gap-24"
        mt={4}
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          padding: "20px 32px",
        })}
      >
        <div className="owner-zone-text">
          <Typography
            variant="h6"
            sx={(theme) => ({
              ...FairLaunchTheme.gradientText(theme),
              fontWeight: "700",
              mb: 2,
            })}
          >
            Lock Info
          </Typography>
        </div>
        <InfoRow label="Title" value={tokenDetails?.logDescription} />
        <InfoRow
          label="Token Amount Locked"
          value={tokenDetails?.amountLocked}
        />
        <InfoRow label="Token Values Locked" value="$0" />
        <InfoRow
          label="Owner"
          isLink={true}
          address={tokenDetails?.ownerAddress}
        />
        <InfoRow label="Lock Date" value={tokenDetails?.unlockDate} />
        <InfoRow label="TGE Date" value={tokenDetails?.tgedate} />
        <InfoRow
          label="TGE Release %"
          value={`${tokenDetails?.tgePercent} %`}
        />
        <InfoRow
          label="Unlock Schedule"
          value={`${Math.round(tokenDetails?.cycle || 0)} ${
            tokenDetails?.cycleType
          }`}
        />
        <InfoRow
          label="Unlock Rate %"
          value={`${tokenDetails?.cycleRelease} %`}
        />
        <InfoRow label="Unlocked Amount" value={tokenDetails?.unLockAmount} />
      </Box>
      {/* {vestingData && (<Box className="flex justify-center">
                <Box mt={4} sx={{ padding: "20px 32px", background: (theme) => theme.palette.background.paper, width: "60%" }} >
                    <TableContainer sx={{ background: "transparent", boxShadow: "none" }}>
                        <Table>
                            <TableHead >
                                <TableRow >
                                    <TableCell sx={{ border: 0, textAlign: "center" }} ><b>Unlock Number</b></TableCell>
                                    <TableCell sx={{ border: 0, textAlign: "center" }}><b>Unlocked Tokens</b></TableCell>
                                    <TableCell sx={{ border: 0, textAlign: "center" }}><b>Time(UTC)</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vestingData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell sx={{ border: 0, textAlign: "center" }}>{row.unlockNumber}</TableCell>
                                        <TableCell sx={{ border: 0, textAlign: "center" }}>{row.unlockedTokens}</TableCell>
                                        <TableCell sx={{ border: 0, textAlign: "center" }}>{row.timeUTC}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box className="flex justify-center"
                        >
                            <TablePagination
                                rowsPerPageOptions={[3, 5, 10]}
                                count={vestingData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                            />
                        </Box>
                    </TableContainer>
                </Box>
            </Box>)} */}
      {tokenDetails?.ownerAddress === account && (
        <Box
          className="flex-col gap-24"
          mt={4}
          sx={(theme) => ({
            ...FairLaunchTheme.cardStyle(theme),
            padding: "20px 32px",
          })}
        >
          <div>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                fontWeight: "700",
                mb: 2,
              })}
            >
              Actions
            </Typography>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              variant="outlined"
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                padding: "10px",
                fontSize: "14px",
                width: "100%",
                "&.Mui-disabled": {
                  color: "gray !important",
                  borderColor: "gray !important",
                  opacity: 0.5,
                },
              })}
              onClick={() =>
                navigate("/trendlock/edit-lock-lp", {
                  state: { lockId: tokenDetails?.lockId, tokenAddress },
                })
              }
              disabled={timeUp}
            >
              Update Lock
            </Button>

            <Button
              variant="outlined"
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                padding: "10px",
                fontSize: "14px",
                width: "100%",
                "&.Mui-disabled": {
                  color: "gray !important",
                  borderColor: "gray !important",
                  opacity: 0.5,
                },
              })}
              onClick={handleClickOpen}
              disabled={timeUp}
            >
              Transfer Lock Ownership
            </Button>

            <Button
              variant="outlined"
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                padding: "10px",
                fontSize: "14px",
                width: "100%",
                "&.Mui-disabled": {
                  color: "gray !important", // Adjust text color for disabled state
                  borderColor: "gray !important", // Adjust border color
                  opacity: 0.5, // Keep it slightly visible
                },
              })}
              onClick={handleClickReOpen}
              disabled={timeUp}
            >
              Renounce Lock Ownership
            </Button>

            <Button
              variant="outlined"
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                padding: "10px",
                fontSize: "14px",
                width: "100%",
                "&.Mui-disabled": {
                  color: "gray !important", // Adjust text color for disabled state
                  borderColor: "gray !important", // Adjust border color
                  opacity: 0.5, // Keep it slightly visible
                },
              })}
              onClick={handleClickReOpenTitle}
              disabled={timeUp}
            >
              Edit Lock Title
            </Button>

            <Button
              variant="contained"
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                padding: "10px",
                fontSize: "14px",
                width: "100%",
                background: "transparent",
                "&.Mui-disabled": {
                  color: "gray !important",
                  borderColor: "gray !important",
                  opacity: 0.5,
                },
              })}
              disabled={!timeUp || unlock}
              onClick={handleUnlock}
            >
              Unlock(
              {tokenDetails?.tgePercent > 0
                ? unLockValue
                : tokenDetails?.amountLocked}{" "}
              {tokenDetails1?.symbol})
            </Button>
          </div>
        </Box>
      )}
      <Disclaimer />
      <FormDialog
        open={open}
        setOpen={setOpen}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        lockId={tokenDetails?.lockId}
        setUpdate={setUpdate}
      />
      <FormRenounceDialog
        open={openRe}
        setOpen={setOpenRe}
        handleClickOpen={handleClickReOpen}
        handleClose={handleClickReClose}
        lockId={tokenDetails?.lockId}
        setUpdate={setUpdate}
      />
      <FormEditTitleDialog
        open={openReTitle}
        setOpen={setOpenReTitle}
        handleClickOpen={handleClickReOpenTitle}
        handleClose={handleClickReCloseTitle}
        lockId={tokenDetails?.lockId}
        setUpdate={setUpdate}
      />
    </Container>
  );
};

export default TimerLockLP;
