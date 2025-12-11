import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getTrendPoolsDetailsListHandler } from "../ContractAction/LaunchPadAction";
import { fetchPools } from "./ApiLaunchpadlisthandler";
import ProgressBar from "../Components/Progressbar";
import LauncnchpadTimer from "../Components/LauncnchpadTimer";
import { CircularProgress } from "@mui/material";
import { getTokenDecimals } from "../ContractAction/ContractDependency";
import { ethers } from "ethers";
import { chainSwitchNetwork } from "../ContractAction/ContractDependency";
import { FaKey } from "react-icons/fa";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";
import {
  mainnet,
  optimism,
  polygon,
  avalanche,
  bsc,
  arbitrum,
  celo,
  base,
  fantom,
  bscTestnet,
  sepolia,
} from "wagmi/chains";

const AllLaunchPad = () => {
  const [chain, setChain] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [listDetails, setListDetails] = useState([]);
  const [search, setSearch] = useState();
  const navigate = useNavigate();
  const account = useCurrentAccountAddress();
  useEffect(() => {
    async function fetchLaunchpadListDetails() {
      try {
        const details = await fetchPools(type, sort, status, chain, search);
        console.log("ListDetails", details);
        setListDetails(details || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching launchpad list details:", error);
        setListDetails([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLaunchpadListDetails();
  }, [type, sort, status, chain, search]);

  const textFieldStyle = (theme) => FairLaunchTheme.inputStyle(theme);
  const labelStyle = (theme) => ({
    marginBottom: "8px",
    fontWeight: "bold",
    color: theme.palette.text.primary,
    display: "block",
  });
  const selectStyle = (theme) => ({
    color: theme.palette.text.primary,
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.divider,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    ".MuiSvgIcon-root": {
      color: theme.palette.text.secondary,
    },
  });

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <Typography component="label" sx={labelStyle}>
            Search
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Enter Token Address"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            sx={textFieldStyle}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth>
            <Typography component="label" sx={labelStyle}>
              Chains
            </Typography>
            <Select
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              displayEmpty
              sx={selectStyle}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: (theme) => theme.palette.background.paper,
                    color: (theme) => theme.palette.text.primary,
                  },
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Ethereum">Ethereum (Mainnet)</MenuItem>
              <MenuItem value="Optimism">Optimism</MenuItem>
              <MenuItem value="Polygon">Polygon</MenuItem>
              <MenuItem value="Avalanche">Avalanche</MenuItem>
              <MenuItem value="BNB Chain">BNB Chain</MenuItem>
              <MenuItem value="Arbitrum">Arbitrum</MenuItem>
              <MenuItem value="Celo">Celo</MenuItem>
              <MenuItem value="Base">Base</MenuItem>
              <MenuItem value="Fantom">Fantom</MenuItem>
              <MenuItem value="BNB Testnet">BNB Testnet</MenuItem>
              <MenuItem value="Sepolia">Sepolia</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth>
            <Typography component="label" sx={labelStyle}>
              All Status
            </Typography>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
              sx={selectStyle}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: (theme) => theme.palette.background.paper,
                    color: (theme) => theme.palette.text.primary,
                  },
                },
              }}
            >
              <MenuItem value="">All Status</MenuItem>

              <MenuItem value="upcomming">Upcoming</MenuItem>
              <MenuItem value="inprogress">Live</MenuItem>
              <MenuItem value="filled">Filled</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="whitelist">Whitelist</MenuItem>
              <MenuItem value="ended">Ended</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth>
            <Typography component="label" sx={labelStyle}>
              No Sort
            </Typography>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              displayEmpty
              sx={selectStyle}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: (theme) => theme.palette.background.paper,
                    color: (theme) => theme.palette.text.primary,
                  },
                },
              }}
            >
              <MenuItem value="">No Sort</MenuItem>
              <MenuItem value="hardcap">Hard Cap</MenuItem>
              <MenuItem value="softcap">Soft Cap</MenuItem>
              <MenuItem value="lppercent">LP Percent</MenuItem>
              {/* <MenuItem value="desc">Start Time</MenuItem>
              <MenuItem value="desc">End Time</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth>
            <Typography component="label" sx={labelStyle}>
              Types
            </Typography>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              sx={selectStyle}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: (theme) => theme.palette.background.paper,
                    color: (theme) => theme.palette.text.primary,
                  },
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="fairlaunch">Fair-launch</MenuItem>
              <MenuItem value="presale">Presale</MenuItem>
              <MenuItem value="manuallist">ManualList</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={4}>
        {listDetails.length > 0 ? (
          listDetails?.map((pad, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              key={pad?.poolAddress || index}
            >
              <Box
                sx={(theme) => ({
                  ...FairLaunchTheme.cardStyle(theme),
                  position: "relative",
                  width: "100%",
                  padding: "20px",
                  borderRadius: "20px",
                  border: pad?.Affilation_Status
                    ? "4px solid gold"
                    : `1px solid ${theme.palette.divider}`,
                  boxShadow: pad?.Affilation_Status
                    ? "0 0 15px rgba(255, 215, 0, 0.4)"
                    : FairLaunchTheme.cardStyle(theme).boxShadow,
                })}
              >
                {/* Animated Affiliate Badge */}
                {pad?.StepTwo?.Affilation_Status && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-8px",
                      right: "140px",
                      background: "gold",
                      color: "#000",
                      px: 2,
                      py: "2px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      fontSize: "12px",
                      animation: "blinker 1.5s linear infinite",
                      zIndex: 99999,
                    }}
                  >
                    Affiliate {pad?.Affiliate_percentage || 0}%
                  </Box>
                )}
                <Box className="flex justify-between items-center">
                  <img
                    src={
                      pad?.StepThree?.Logo || "/images/tabler_brand-react.png"
                    }
                    alt="logo"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={(theme) => ({
                      borderRadius: "20px",
                      textTransform: "capitalize",
                      background:
                        pad?.status === "Live"
                          ? theme.palette.success.main
                          : pad?.status === "Upcomming"
                          ? theme.palette.warning.main
                          : theme.palette.grey[700],
                      color: "#fff",
                      boxShadow: "none",
                    })}
                  >
                    {pad?.status}
                  </Button>
                </Box>

                <Box mt={4} className="flex justify-between">
                  <div>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={(theme) => ({ color: theme.palette.text.primary })}
                    >
                      {pad?.Token_name || "Launchpad Title"} - {pad?.Sale_type}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={(theme) => ({ color: theme.palette.text.secondary })}
                    >
                      {pad?.Sale_type === "Fairlaunch"
                        ? pad?.StepTwo?.Max_buy === 0
                          ? "Fair Launch"
                          : `Fair Launch - Max buy ${ethers.formatUnits(
                              pad?.StepTwo?.Max_buy.toString() || "0",
                              pad?.Currency_Decimal
                            )} ${pad?.StepOne?.Currency}`
                        : `${ethers.formatUnits(
                            pad?.StepTwo?.Soft_cap.toString() || "0",
                            pad?.Currency_Decimal
                          )} - ${ethers.formatUnits(
                            pad?.StepTwo?.Hard_cap.toString() || "0",
                            pad?.Currency_Decimal
                          )} ${pad?.StepOne?.Currency}`}
                    </Typography>
                  </div>
                  <div>
                    {pad?.Owner_Address === account && (
                      <FaKey
                        style={{ color: "#FFD700" }}
                        title="You are the owner of this launchpad"
                      />
                    )}
                  </div>
                </Box>

                <Box mt={4}>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    {pad?.Sale_type === "Fairlaunch" ? "Soft" : "Soft/Hard"}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.primary.main })}
                  >
                    {pad?.Sale_type === "Fairlaunch"
                      ? pad?.StepTwo?.Soft_cap
                        ? `${ethers.formatUnits(
                            pad?.StepTwo?.Soft_cap.toString() || "0",
                            pad?.Currency_Decimal
                          )}`
                        : "N/A"
                      : pad?.StepTwo?.Soft_cap && pad?.StepTwo?.Hard_cap
                      ? `${ethers.formatUnits(
                          pad?.StepTwo?.Soft_cap.toString() || "0",
                          pad?.Currency_Decimal
                        )} / ${ethers.formatUnits(
                          pad?.StepTwo?.Hard_cap.toString() || "0",
                          pad?.Currency_Decimal
                        )}`
                      : "N/A"}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    Progress (
                    {(() => {
                      try {
                        const totalRaised = parseFloat(
                          ethers.formatUnits(
                            pad?.StepTwo?.Total_Raised?.toString() || "0",
                            pad?.Currency_Decimal
                          )
                        );
                        const cap =
                          pad?.Sale_type === "Fairlaunch"
                            ? parseFloat(
                                ethers.formatUnits(
                                  pad?.StepTwo?.Soft_cap?.toString() || "1",
                                  pad?.Currency_Decimal
                                )
                              )
                            : parseFloat(
                                ethers.formatUnits(
                                  pad?.StepTwo?.Hard_cap?.toString() || "1",
                                  pad?.Currency_Decimal
                                )
                              );
                        const progress = (totalRaised / cap) * 100;
                        return `${progress.toFixed(2)}%`;
                      } catch (e) {
                        return "0%";
                      }
                    })()}
                    )
                  </Typography>

                  <ProgressBar
                    start={0}
                    end={parseFloat(
                      ethers.formatUnits(
                        (pad?.Sale_type === "Fairlaunch"
                          ? pad?.StepTwo?.Soft_cap
                          : pad?.StepTwo?.Hard_cap
                        )?.toString() || "1",
                        pad?.Currency_Decimal
                      )
                    )}
                    current={parseFloat(
                      ethers.formatUnits(
                        pad?.StepTwo?.Total_Raised?.toString() || "0",
                        pad?.Currency_Decimal
                      )
                    )}
                  />
                </Box>

                <Box
                  className="flex justify-between items-center"
                  sx={{ marginLeft: "10px", marginRight: "10px" }}
                >
                  <Typography
                    variant="body2"
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    {" "}
                    {pad?.StepOne?.Currency}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    {pad?.StepOne?.Currency}{" "}
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    Total Raised (
                    {(() => {
                      try {
                        return `${ethers.formatUnits(
                          pad?.StepTwo?.Total_Raised?.toString() || "0",
                          pad?.Currency_Decimal
                        )} ${pad?.StepOne?.Currency}`;
                      } catch {
                        return `0 ${pad?.StepOne?.Currency}`;
                      }
                    })()}
                    )
                  </Typography>
                </Box>

                <Box mt={2} className="flex justify-between items-center">
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    Liquidity %
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    {pad?.StepOne?.Listing_Option === "Auto Listing"
                      ? `${pad?.StepOne?.Liquidity_percentage} %`
                      : "Manual Listing"}{" "}
                    {pad?.Buy_back_percentage > 0 && (
                      <span style={{ color: "#ecb91fff" }}>
                        ({pad?.Buy_back_percentage}% Buyback)
                      </span>
                    )}
                  </Typography>
                </Box>

                <Box className="flex justify-between items-center">
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    Lockup Time
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    {pad?.StepOne?.Liquidity_Lockup_time || "Unlocked"} min
                  </Typography>
                </Box>

                <Box mt={5} className="flex justify-between items-center">
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={(theme) => ({ color: theme.palette.text.secondary })}
                  >
                    {pad?.status === "Upcomming"
                      ? "Sale Starts In"
                      : pad?.status === "Live"
                      ? "Sale Ends In:"
                      : pad?.status === "Ended"
                      ? "Ended"
                      : "Cancelled"}{" "}
                  </Typography>
                  {pad?.status !== "Ended" && pad?.status !== "Cancelled" && (
                    <LauncnchpadTimer
                      LockDate={new Date(
                        ((pad?.status === "Upcomming"
                          ? pad?.StepTwo?.Start_time
                          : pad?.StepTwo?.End_time) || 0) * 1000
                      ).toLocaleString()}
                    />
                  )}
                  {/* <Button
                  variant="outlined"
                  onClick={() => {
                    const path =
                      pad?.Sale_type === "Fairlaunch"
                        ? `/FairLaunchpad/View/${pad.pool_id}`
                        : `/Launchpad/View/${pad.pool_id}`;
                    navigate(path, { state: { data: pad.pool_id } });
                  }}
                >
                  View Pool
                </Button> */}
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      try {
                        await chainSwitchNetwork(pad?.ChainId);
                        const path =
                          pad?.Sale_type === "Fairlaunch"
                            ? `/FairLaunchpad/View/${pad.pool_id}`
                            : `/Launchpad/View/${pad.pool_id}`;
                        navigate(path, { state: { data: pad.pool_id } });
                      } catch (error) {
                        console.error("Network switch failed:", error);
                      }
                    }}
                    sx={(theme) => ({
                      ...FairLaunchTheme.neonButton(theme),
                      background: "transparent",
                      padding: "8px 20px",
                      fontSize: "14px",
                      height: "auto",
                      minWidth: "auto",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.05)",
                      },
                    })}
                  >
                    View Pool
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Data Not Found
              </Typography>
            </Box>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default AllLaunchPad;
