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
import { getParticipantPool } from "./ApiLaunchpadlisthandler"; // adjust path
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import ProgressBar from "../Components/Progressbar";
import LauncnchpadTimer from "../Components/LauncnchpadTimer";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { getTokenDecimals } from "../ContractAction/ContractDependency";
import { ethers } from "ethers";
import { chainSwitchNetwork } from "../ContractAction/ContractDependency";
import { FaKey } from "react-icons/fa";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const ContributionTable = ({ address }) => {
  const [pool, setPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const account = useCurrentAccountAddress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!account) return;
    const fetchPool = async () => {
      try {
        const data = await getParticipantPool(account);
        const poolData = data?.Allpool;
        if (!poolData) {
          console.warn("No pool data found for participant.");
          return;
        }
        console.log("data", poolData);
        setPool(poolData);
      } catch (err) {
        console.error("Failed to fetch participant pool:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPool();
  }, [account]);

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
      <Grid container spacing={3} mt={4}>
        {pool.length > 0 ? (
          pool?.map((pad, index) => (
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
                  width: "100%",
                  padding: "20px",
                  borderRadius: "20px",
                  border: `1px solid ${theme.palette.divider}`,
                })}
              >
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
                    {" "}
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={(theme) => ({ color: theme.palette.text.primary })}
                    >
                      {pad?.title || "Launchpad Title"}
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
                      ? `${pad?.StepOne?.Liquidity_percentage}${" "}%`
                      : "Manual Listing"}
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
                    {pad?.StepOne?.Liquidity_Lockup_time || "Unlocked"}
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

export default ContributionTable;
