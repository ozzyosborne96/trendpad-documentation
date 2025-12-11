import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Avatar,
  Box,
  Grid,
  Typography,
  Button,
  Container,
  Pagination,
  Stack,
} from "@mui/material";
import ProgressBar from "../Components/Progressbar";
import Disclaimer from "../Components/Disclaimer";
import Timer from "../Components/Timer";
import { useLocation } from "react-router-dom";
import {
  getPoolDetailsHandler,
  getAllAllocationHandler,
  getUserAllocationHandler,
  getOwnerHandler,
  cancelAirdropHandler,
  getClaimedAllocationHandler,
  getTotalAllocation,
  withdrawableTokensHandler,
  claimHandler,
  getAirdropState,
  removeAllocationHandler,
  nextClaimTimeHandler,
} from "../ContractAction/AirDropContractAction";
import useGetTokenDetails from "../Hooks/GetTokenDetails";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import MuiDialog from "../Components/TimeStart";
import VestMuiDialog from "../Components/VestingDialogue";
import AllocationMuiDialog from "../Components/AllocationDialogue";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { FaReddit } from "react-icons/fa6";
import { FaSquareYoutube } from "react-icons/fa6";
import { getTokenDecimals } from "../ContractAction/ContractDependency";
import TokenAddressLink from "../Components/TokenAddressLink";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";
const MyDrop = () => {
  const [progress, setProgress] = useState(0);
  const [poolDetails, setPoolDetails] = useState();
  const [tokenDetails, setTokenDetails] = useState(null);
  const location = useLocation();
  const [owner, setOwner] = useState(false);
  const fetchTokenDetails = useGetTokenDetails();
  const [timeOpen, setTimeOpen] = useState(false);
  const [vesting, setVesting] = useState(false);
  const [allocation, setAllocation] = useState(false);
  const [alloctDeta, setAlloctDeta] = useState();
  const [allocateUser, setAllocateUser] = useState();
  const [allocateClaimed, setAllocateClaimed] = useState();
  const [allocaeAmountData, setAllocaeAmountData] = useState();
  const [bal, setBal] = useState(0);
  const [withdraw, setWithdraw] = useState();
  const [update, setUpdate] = useState(false);
  const [status, setStatus] = useState();
  const [decimals, setDecimals] = useState();
  const [nextClaim, setNextClaim] = useState();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedData = allocaeAmountData?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(allocaeAmountData?.length / itemsPerPage);
  const addr = location?.state?.data;
  const account = useCurrentAccountAddress();
  console.log("addr", addr);
  useEffect(() => {
    async function fetchAlocation() {
      let details;
      details = await getPoolDetailsHandler(addr, null);
      console.log("first details", details);
      setPoolDetails(details);
      const tokenAddress = details?.poolDetails?.tokenAddress;
      if (tokenAddress) {
        fetchTokenDetails(tokenAddress)
          .then((res) => setTokenDetails(res))
          .catch(() => setTokenDetails(null));
      } else {
        setTokenDetails(null);
      }
      console.log("tokenAddress", tokenAddress);
      const decimals1 = await getTokenDecimals(tokenAddress);
      console.log("decimals1234", decimals1);
      setDecimals(decimals1);
      details = await getPoolDetailsHandler(addr, decimals1);
      console.log("first details", details);
      setPoolDetails(details);
      const alloctDetails = await getAllAllocationHandler(addr);
      console.log("Fetching allocation", alloctDetails);
      setAlloctDeta(alloctDetails);
      const allocateUser = await getUserAllocationHandler(
        addr,
        account,
        decimals1
      );
      console.log("allocateUser", allocateUser);
      setAllocateUser(allocateUser);
      const allocateClaimed = await getClaimedAllocationHandler(
        addr,
        account,
        decimals1
      );
      console.log("Allocating user", allocateClaimed);
      setAllocateClaimed(allocateClaimed);
      const withDreav = await withdrawableTokensHandler(
        addr,
        account,
        decimals1
      );
      console.log("withDreav", withDreav);
      setWithdraw(withDreav);
      const nextCliam = await nextClaimTimeHandler(addr, account);
      console.log("nextCliam", nextCliam);
      setNextClaim(nextCliam);

      const owner = await getOwnerHandler(addr);
      console.log("owner", owner);
      if (owner === account) {
        setOwner(true);
      } else {
        setOwner(false);
      }
      try {
        const balance = await getTotalAllocation(addr, decimals1);
        setBal(balance);
      } catch (error) {
        console.error("Error fetching allocation:", error);
      }

      const status = await getAirdropState(addr);
      setStatus(status);
    }
    fetchAlocation();
  }, [addr, account, update]);
  const cancelAirdrop = async () => {
    try {
      const tx = await cancelAirdropHandler(addr);
      setUpdate((prev) => !prev); // This ensures the latest state is toggled
    } catch (err) {
      console.error("Airdrop cancellation failed", err);
    }
  };

  const claim = async () => {
    if (!withdraw) return;
    const allocateionUsers = await claimHandler(addr, account, withdraw);
    setUpdate((prev) => !prev);
    console.log("claim", allocateionUsers);
  };
  const RemoveAllocationHandler = async () => {
    const txHash = await removeAllocationHandler(addr);
    setUpdate((prev) => !prev);
    console.log("txHash", txHash);
  };
  console.log("first token", tokenDetails);
  console.log("ugfufg", poolDetails?.poolDetails?.metaData?.logoURL);
  console.log("timeOpen, vesting, allocation", timeOpen, vesting, allocation);

  const allocationDataHandler = async () => {
    try {
      const data = await Promise.all(
        alloctDeta?.map(async (item) => {
          try {
            const amount = await getUserAllocationHandler(addr, item, decimals); // pass (contractAddress, account)
            console.log("Success:", item, amount);
            return {
              amount: amount?.toString?.() || "0",
              address: item,
            };
          } catch (err) {
            console.error("Failed on contract:", item, err);
            return null; // return null if error
          }
        })
      );
      const filteredData = data.filter(Boolean);
      setAllocaeAmountData(filteredData);
      console.log("Final Allocation Data:", filteredData);
    } catch (error) {
      console.error("Top-level error in allocationDataHandler:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await allocationDataHandler();
    };
    fetchData();
  }, [alloctDeta, account]);
  console.log("hfdogdfig", poolDetails?.poolDetails?.startTime);
  return (
    <Container className="mt-40" minHeight="100vh">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={8} lg={8}>
          <Box sx={(theme) => FairLaunchTheme.cardStyle(theme)}>
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-16">
                <Avatar
                  alt="User Avatar"
                  src={poolDetails?.poolDetails?.metaData?.logoURL}
                />
                <Typography
                  variant="h4"
                  sx={(theme) => ({
                    fontWeight: "700",
                    ...FairLaunchTheme.gradientText(theme),
                  })}
                >
                  {/* {poolDetails?.poolDetails?.metaData?.airdropTitle}{" "} */}
                  {(poolDetails?.poolDetails?.metaData?.airdropTitle?.length >
                  15
                    ? poolDetails?.poolDetails?.metaData?.airdropTitle.slice(
                        0,
                        8
                      ) + "..."
                    : poolDetails?.poolDetails?.metaData?.airdropTitle) ||
                    "Untitled Airdrop"}
                </Typography>
              </div>
              <div>
                {status === 0 ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ borderRadius: "20px" }}
                  >
                    Upcoming
                  </Button>
                ) : status === 1 ? (
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ borderRadius: "20px" }}
                  >
                    Live
                  </Button>
                ) : status === 2 ? (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ borderRadius: "20px" }}
                  >
                    Ended
                  </Button>
                ) : status === 3 ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: "20px" }}
                  >
                    Cancelled
                  </Button>
                ) : (
                  "--"
                )}
              </div>
            </div>

            <div className="flex gap-8 mt-16" style={{ marginLeft: "55px" }}>
              {poolDetails?.poolDetails?.metaData?.facebook && (
                <a
                  href={poolDetails.poolDetails.metaData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  <FaFacebookSquare fontSize="20px" />
                </a>
              )}
              {poolDetails?.poolDetails?.metaData?.twitter && (
                <a
                  href={poolDetails.poolDetails.metaData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  <FaTwitterSquare fontSize="20px" />
                </a>
              )}
              {poolDetails?.poolDetails?.metaData?.github && (
                <a
                  href={poolDetails.poolDetails.metaData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  <FaGithub fontSize="20px" />
                </a>
              )}
              {poolDetails?.poolDetails?.metaData?.telegram && (
                <a
                  href={poolDetails.poolDetails.metaData.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  <FaTelegram fontSize="20px" />
                </a>
              )}
              {poolDetails?.poolDetails?.metaData?.instagram && (
                <a
                  href={poolDetails.poolDetails.metaData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  <FaInstagram fontSize="20px" />
                </a>
              )}
              {poolDetails?.poolDetails?.metaData?.discord && (
                <a
                  href={poolDetails.poolDetails.metaData.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  <FaDiscord fontSize="20px" />
                </a>
              )}
              {poolDetails?.poolDetails?.metaData?.reddit && (
                <a
                  href={poolDetails.poolDetails.metaData.reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  <FaReddit fontSize="20px" />
                </a>
              )}
              {poolDetails?.poolDetails?.metaData?.youtube && (
                <a
                  href={poolDetails.poolDetails.metaData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  <FaSquareYoutube fontSize="20px" />
                </a>
              )}
            </div>
            <div className="mt-16">
              <Typography
                variant="h6"
                sx={{ color: (theme) => theme.palette.text.secondary }}
              >
                {poolDetails?.poolDetails?.metaData?.description}
              </Typography>
            </div>
            <div className="flex-col gap-16 mt-40">
              <div className="flex justify-between items-center owner-zone-text">
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Airdrop Address
                </Typography>
                <Typography variant="h6" sx={{ color: "#1D64FA" }}>
                  <TokenAddressLink
                    address={addr}
                    color="#1D64FA"
                    truncate={true}
                    showCopyIcon={true}
                  />
                </Typography>
              </div>
              <div className="flex justify-between items-center owner-zone-text">
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Token Address
                </Typography>
                <Typography variant="h6" sx={{ color: "#1D64FA" }}>
                  {/* {poolDetails?.poolDetails?.tokenAddress} */}
                  <TokenAddressLink
                    address={poolDetails?.poolDetails?.tokenAddress}
                    color="#1D64FA"
                    truncate={true}
                    showCopyIcon={true}
                  />
                </Typography>
              </div>
              <div className="flex justify-between items-center owner-zone-text">
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Name
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.primary }}
                >
                  {tokenDetails?.name}
                </Typography>
              </div>
              <div className="flex justify-between items-center owner-zone-text">
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Symbol
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.primary }}
                >
                  {tokenDetails?.symbol}
                </Typography>
              </div>
              <div className="flex justify-between items-center ">
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Total Tokens
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.primary }}
                >
                  {poolDetails?.poolDetails?.allocations}{" "}
                </Typography>
              </div>
              {poolDetails?.poolDetails?.tgePercent !== 0 &&
                poolDetails?.poolDetails?.cyclePercent !== 0 && (
                  <>
                    <div className="flex justify-between items-center ">
                      <Typography
                        variant="h6"
                        sx={{ color: (theme) => theme.palette.text.secondary }}
                      >
                        TGE Release Percent
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        {poolDetails?.poolDetails?.tgePercent}{" "}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center ">
                      <Typography
                        variant="h6"
                        sx={{ color: (theme) => theme.palette.text.secondary }}
                      >
                        Unlock Schedule
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        {poolDetails?.poolDetails?.cycleTime} minutes
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center ">
                      <Typography
                        variant="h6"
                        sx={{ color: (theme) => theme.palette.text.secondary }}
                      >
                        Unlock Release %
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        {poolDetails?.poolDetails?.cyclePercent}{" "}
                      </Typography>
                    </div>
                  </>
                )}
            </div>
          </Box>
          <Box
            sx={(theme) => ({
              ...FairLaunchTheme.cardStyle(theme),
              mt: 2,
            })}
          >
            <div>
              <Typography
                variant="h5"
                sx={{ color: (theme) => theme.palette.text.primary }}
              >
                Allocations ({poolDetails?.poolDetails?.totalParticipants})
              </Typography>
            </div>
            <>
              {poolDetails?.poolDetails?.totalParticipants > 0 ? (
                <>
                  {paginatedData?.map((item, index) => (
                    <div className="flex-col gap-16 mt-4" key={index}>
                      <div className="flex justify-between items-center owner-zone-text">
                        <Typography variant="h6" sx={{ color: "#1D64FA" }}>
                          {item?.address}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: (theme) => theme.palette.text.secondary,
                          }}
                        >
                          {item?.amount} {tokenDetails?.symbol}
                        </Typography>
                      </div>
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <Stack spacing={2} alignItems="center" mt={3}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{
                          "& .MuiPaginationItem-root": {
                            color: (theme) => theme.palette.text.primary,
                          },
                        }}
                      />
                    </Stack>
                  )}
                </>
              ) : (
                <div>
                  <Typography
                    variant="h6"
                    sx={{ color: (theme) => theme.palette.text.secondary }}
                  >
                    No allocations available
                  </Typography>
                </div>
              )}
            </>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Box sx={(theme) => FairLaunchTheme.cardStyle(theme)}>
            <div className="text-center">
              <Typography
                variant="subtitle1"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontWeight: "700",
                }}
              >
                {status === 1
                  ? "Airdrop is now live"
                  : status === 2
                  ? "Airdrop has been ended "
                  : status === 3
                  ? "Airdrop has been cancelled"
                  : "Waiting for Airdrop to start..."}
              </Typography>
              <div className="flex-col gap-16 mt-4">
                {(status === 0 || status === 1 || status === 2) &&
                  poolDetails?.poolDetails?.startTime !==
                    "1/1/1970, 5:30:00 AM" && (
                    <>
                      <Timer LockDate={poolDetails?.poolDetails?.startTime} />
                      <ProgressBar
                        start={0}
                        end={poolDetails?.poolDetails?.allocations}
                        current={poolDetails?.poolDetails?.totalClaimed}
                      />
                    </>
                  )}{" "}
                {/* <button
                  onClick={() =>
                    setProgress((prev) => (prev < 100 ? prev + 10 : 0))
                  }
                >
                  Increase Progress
                </button> */}
                {status === 1 && poolDetails?.poolDetails?.startTime ? (
                  <>
                    {withdraw > 0 && (
                      <div>
                        <Button
                          variant="contained"
                          disabled={allocateUser === allocateClaimed}
                          sx={(theme) => ({
                            ...FairLaunchTheme.neonButton(theme),
                            width: "100%",
                            mb: 2,
                            textTransform: "none",
                          })}
                          onClick={claim}
                        >
                          {`Claim (${withdraw})`}
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-between items-center owner-zone-text">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.secondary,
                          fontWeight: "700",
                        }}
                      >
                        Start Time
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.primary,
                          fontWeight: "700",
                        }}
                      >
                        {poolDetails?.poolDetails?.startTime}{" "}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center owner-zone-text">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.secondary,
                          fontWeight: "700",
                        }}
                      >
                        Your Allocation{" "}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.primary,
                          fontWeight: "700",
                        }}
                      >
                        {allocateUser}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center owner-zone-text">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.secondary,
                          fontWeight: "700",
                        }}
                      >
                        Your Claimed{" "}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.primary,
                          fontWeight: "700",
                        }}
                      >
                        {allocateClaimed}
                      </Typography>
                    </div>
                    {nextClaim !== 0 && (
                      <div className="flex justify-between items-center owner-zone-text">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: (theme) => theme.palette.text.secondary,
                            fontWeight: "700",
                          }}
                        >
                          Next Claim Time{" "}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: "700",
                          }}
                        >
                          {nextClaim}
                        </Typography>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center owner-zone-text">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.secondary,
                          fontWeight: "700",
                        }}
                      >
                        Your Allocation{" "}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.primary,
                          fontWeight: "700",
                        }}
                      >
                        {allocateUser}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center owner-zone-text">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.secondary,
                          fontWeight: "700",
                        }}
                      >
                        Your Claimed{" "}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: (theme) => theme.palette.text.primary,
                          fontWeight: "700",
                        }}
                      >
                        {allocateClaimed}
                      </Typography>
                    </div>
                    {nextClaim !== 0 && (
                      <div className="flex justify-between items-center owner-zone-text">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: (theme) => theme.palette.text.secondary,
                            fontWeight: "700",
                          }}
                        >
                          Next Claim Time{" "}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: "700",
                          }}
                        >
                          {nextClaim}
                        </Typography>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Box>
          {owner && poolDetails?.poolDetails?.startTime === 0 && (
            <Box
              sx={(theme) => ({
                ...FairLaunchTheme.cardStyle(theme),
                mt: 2,
              })}
            >
              <div className="owner-zone-text">
                <Typography
                  variant="subtitle1"
                  sx={(theme) => ({
                    ...FairLaunchTheme.gradientText(theme),
                  })}
                >
                  Owner Zone
                </Typography>
              </div>
              <div
                style={{
                  border: "1px solid #E5B649",
                  textAlign: "center",
                  borderRadius: "8px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <Typography variant="body1" sx={{ color: "#E5B649" }}>
                  Please don't start the airdrop before you finalize the presale
                  pool
                </Typography>
              </div>
              <div
                style={{
                  border: "1px solid #E5B649",
                  textAlign: "center",
                  marginTop: "10px",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <Typography variant="body1" sx={{ color: "#E5B649" }}>
                  You must exclude fees, dividends, and max transaction limits
                  for the airdrop address to start the airdrop{" "}
                </Typography>
              </div>
              {status !== 1 && status !== 2 && status !== 3 && (
                <div className="flex-col gap-16" style={{ marginTop: "30px" }}>
                  <Button
                    variant="contained"
                    sx={(theme) => ({
                      ...FairLaunchTheme.neonButton(theme),
                      width: "100%",
                    })}
                    onClick={() => setTimeOpen(true)}
                  >
                    Start Airdrop{" "}
                  </Button>
                  <Button
                    variant="contained"
                    sx={(theme) => ({
                      ...FairLaunchTheme.neonButton(theme),
                      width: "100%",
                      mt: 2,
                      background: "rgba(255, 68, 68, 0.1)",
                      borderColor: "#FF4444",
                      color: "#FF4444",
                      "&:hover": {
                        background: "rgba(255, 68, 68, 0.2)",
                        borderColor: "#FF4444",
                      },
                    })}
                    onClick={() => cancelAirdrop()}
                  >
                    Cancel Airdrop{" "}
                  </Button>
                </div>
              )}
              {owner && (
                <>
                  <div style={{ marginTop: "20px" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: (theme) => theme.palette.text.primary,
                        fontWeight: "700",
                      }}
                    >
                      Allocation Actions
                    </Typography>
                  </div>
                  <div
                    className="flex-col gap-16"
                    style={{ marginTop: "30px" }}
                  >
                    {status !== 1 && status !== 2 && status !== 3 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={(theme) => ({
                            ...FairLaunchTheme.neonButton(theme),
                            width: "100%",
                          })}
                          onClick={() => setAllocation(true)}
                        >
                          Set Allocations{" "}
                        </Button>
                        <Button
                          variant="contained"
                          sx={(theme) => ({
                            ...FairLaunchTheme.neonButton(theme),
                            width: "100%",
                          })}
                          onClick={() => setVesting(true)}
                        >
                          Set Vesting{" "}
                        </Button>
                      </Box>
                    )}
                    {status !== 1 && status !== 2 && status !== 3 && (
                      <Button
                        variant="contained"
                        sx={(theme) => ({
                          ...FairLaunchTheme.neonButton(theme),
                          width: "100%",
                          mt: 2,
                          background: "rgba(255, 68, 68, 0.1)",
                          borderColor: "#FF4444",
                          color: "#FF4444",
                          "&:hover": {
                            background: "rgba(255, 68, 68, 0.2)",
                            borderColor: "#FF4444",
                          },
                        })}
                        onClick={() => RemoveAllocationHandler()}
                      >
                        Remove All Allocations{" "}
                      </Button>
                    )}
                    {/* <Button variant="contained" sx={{ color: "#C0BEBE" }}>
                  Disable Exact Amount{" "}
                </Button> */}
                  </div>
                </>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      <Disclaimer />
      <MuiDialog
        timeOpen={timeOpen}
        handleClose={() => setTimeOpen(false)}
        addr={addr}
        tokenDetails={tokenDetails}
        tokenAddress={poolDetails?.poolDetails?.tokenAddress}
        bal={bal}
        setUpdate={setUpdate}
        update={update}
      />
      <VestMuiDialog
        timeOpen={vesting}
        handleClose={() => setVesting(false)}
        addr={addr}
        setUpdate={setUpdate}
        update={update}
      />
      <AllocationMuiDialog
        timeOpen={allocation}
        handleClose={() => setAllocation(false)}
        addr={addr}
        setUpdate={setUpdate}
        update={update}
        decimals={decimals}
      />
    </Container>
  );
};

export default MyDrop;
