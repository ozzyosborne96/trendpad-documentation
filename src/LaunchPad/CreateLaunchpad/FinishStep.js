import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { CircularProgress, Typography, Grid } from "@mui/material";
import {
  ApprovePresaleHandler,
  createPresaleHandler,
  getTokenAmountHandler,
} from "./createPresaleHandler";
import { getNetworkConfig } from "../../ContractAction/ContractDependency";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { checkAllowance } from "../../ContractAction/LaunchPadAction";
import { FairLaunchTheme } from "../CeateFairLaunch/FairLaunchTheme";

const FinishStep = ({
  handleNext,
  activeStep,
  steps,
  handleBack,
  stepData,
  setStepData,
}) => {
  const [loading, setLoading] = useState();
  const [loading1, setLoading1] = useState();
  const [tokenAllowance, setTokenAllowance] = useState();
  const [checkAllow, setCheckAllow] = useState(false);
  const factoryAddress = getNetworkConfig();
  const navigate = useNavigate();
  console.log("AllDatatillFinishStep", stepData);

  const summaryItems = [
    {
      label: "Title",
      value: stepData?.additionalInfo?.description
        ? stepData.additionalInfo.description.substring(0, 100) +
          (stepData.additionalInfo.description.length > 100 ? "..." : "")
        : "--",
    },
    {
      label: "Affiliate",
      value: stepData?.affiliate || "--",
    },
    {
      label: "Currency",
      value: stepData?.currency || "--",
    },
    {
      label: "Presale Rate",
      value: stepData?.presaleRate || "--",
    },
    {
      label: "Whitelisting",
      value: stepData?.whitelistEnabled ? "Enabled" : "Disabled",
    },
    {
      label: "Softcap",
      value: stepData?.softcap || "--",
    },
    {
      label: "Hardcap",
      value: stepData?.hardcap || "--",
    },
    {
      label: "Min Buy",
      value: stepData?.minBuy || "--",
    },
    {
      label: "Max Buy",
      value: stepData?.maxBuy || "--",
    },
    {
      label: "UnSold Token",
      value: stepData?.refundType || "--",
    },
    {
      label: "Router",
      value:
        stepData?.router === "---Select Router Exchange---"
          ? "--"
          : stepData?.router,
    },
    {
      label: "Liquidity (%)",
      value: stepData?.liquidity || "--",
    },
    {
      label: "Listing Rate",
      value: stepData?.listingRate || "--",
    },
    {
      label: "Start Time",
      value: stepData?.startTime
        ? new Date(stepData.startTime).toLocaleString()
        : "--",
    },
    {
      label: "End Time",
      value: stepData?.endTime
        ? new Date(stepData.endTime).toLocaleString()
        : "--",
    },
    {
      label: `Liquidity Lockup ${stepData?.lockupUnit}`,
      value: stepData?.liquidityLockup || "--",
    },
  ];

  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        setLoading(true);
        const amount = await getTokenAmountHandler(stepData);
        console.log("amount", amount);
        if (amount && stepData?.tokenAddress) {
          const allowance = await checkAllowance(stepData.tokenAddress, amount);
          // console.log("Allowance:", allowance.toString());
          setTokenAllowance(allowance);
        }
      } catch (error) {
        console.error("Error checking allowance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (stepData?.tokenAddress && stepData?.hardcap && stepData?.presaleRate) {
      fetchAllowance();
    }
  }, [stepData, checkAllow]);

  const handleClickPresale = async () => {
    try {
      setLoading(true);
      const tx = await createPresaleHandler(stepData);
      if (tx) {
        toast.success("LaunchPad Created successfully ✅");
        setLoading(false);
        if (tx.poolId) {
          navigate(`/Launchpad/View/${tx.poolId}`, {
            state: {
              data: tx.poolId,
              tokenAddress: tx.tokenAddress,
              currencyAddress: tx.currencyAddress,
            },
          });
          handleNext();
        } else {
          toast.error("LaunchPad created but failed to retrieve Pool ID.");
        }
      } else {
        console.error("Transaction failed or returned undefined.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating presale:", error);
      setLoading(false);
    }
  };

  const ApproveClickHandler = async () => {
    try {
      setLoading(true);
      const tx = await ApprovePresaleHandler(stepData);
      if (tx) {
        toast.success("Token approved successfully ✅");
      } else {
        console.error("Transaction failed or returned undefined.");
      }
      setCheckAllow((prev) => !prev);
      setLoading(false);
    } catch (error) {
      console.error("Error creating presale:", error);
      setLoading(false)(false);
    }
  };

  return (
    <Box className="flex flex-col gap-8" sx={FairLaunchTheme.cardStyle}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ ...FairLaunchTheme.gradientText, mb: 3 }}
        >
          Summary
        </Typography>
        <Grid container spacing={2}>
          {summaryItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#00FFFF", fontWeight: 500 }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={(theme) => ({
          borderRadius: "16px",
          background:
            theme.palette.mode === "light"
              ? theme.palette.warning.light
              : "rgba(229, 182, 73, 0.05)",
          border: `1px solid ${theme.palette.warning.main}`,
          backdropFilter: "blur(10px)",
          p: { xs: 2.5, sm: 3 },
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
          boxShadow: `0 0 20px ${theme.palette.warning.main}`,
        })}
      >
        <Typography
          variant="body1"
          sx={(theme) => ({
            color: theme.palette.text.primary,
            textAlign: "center",
          })}
        >
          Please exclude TrendpadFactory address{" "}
          <strong
            style={{
              color: "#FFF",
              backgroundColor: "#000",
              padding: "2px 4px",
              borderRadius: "4px",
            }}
          >
            {factoryAddress?.addresses?.LAUNCHPADCONTRACTADDRESSFACTORY}
          </strong>{" "}
          from fees, rewards, max tx amount to start creating pools.
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          borderRadius: "16px",
          background:
            theme.palette.mode === "light"
              ? theme.palette.warning.light
              : "rgba(229, 182, 73, 0.05)",
          border: `1px solid ${theme.palette.warning.main}`,
          backdropFilter: "blur(10px)",
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          textAlign: "center",
          mt: 4,
        })}
      >
        <Typography
          variant="body1"
          sx={(theme) => ({ color: theme.palette.text.primary })}
        >
          For tokens with burns, rebase or other special transfer please ensure
          that you have a way to whitelist multiple addresses or turn off the
          special transfer events (BY setting fees to 0 for example for the
          duration of the presale)
        </Typography>
      </Box>

      <Box className="flex items-center justify-center gap-4" sx={{ pt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={(theme) => ({
            ...FairLaunchTheme.neonButton(theme),
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.text.primary,
              color: theme.palette.text.primary,
              background: "rgba(255, 255, 255, 0.05)",
            },
          })}
        >
          Back
        </Button>

        {loading ? (
          <CircularProgress
            sx={(theme) => ({ color: theme.palette.primary.main })}
          />
        ) : tokenAllowance ? (
          <Button
            onClick={handleClickPresale}
            variant="contained"
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              minWidth: "200px",
            })}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        ) : (
          <Button
            onClick={ApproveClickHandler}
            variant="contained"
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              minWidth: "200px",
            })}
          >
            Approve {stepData?.tokenAmount}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FinishStep;
