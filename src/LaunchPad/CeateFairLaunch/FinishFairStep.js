import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getTokenAmountHandler } from "./createfairLaunchHandler";
import { checkAllowanceforFairLaunch } from "../../ContractAction/LaunchPadAction";
import { getNetworkConfig } from "../../ContractAction/ContractDependency";
import {
  createFairLaunchHandler,
  ApproveFairLAunchHandler,
} from "./createfairLaunchHandler";
import { toast } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { ethers } from "ethers";
import { notifyBackendAfterFairCreation } from "../../LaunchPad/CeateFairLaunch/ApiFairLaunchPadHandler";
import { FairLaunchTheme } from "./FairLaunchTheme";

const FinishFairStep = ({
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
  const navigate = useNavigate();
  const factoryAddress = getNetworkConfig();
  console.log("AlldatafairLaunch", stepData);

  // Renders the summary list items as styled rows instead of Buttons
  const buttons = [
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
      label: "Total Selling Token",
      value: stepData?.totalSellingAmount || "--",
    },
    {
      label: "Whitelisting",
      value: stepData?.whitelistEnabled ? "Enabled" : "Disabled",
    },
    {
      label: "Softcap",
      value: stepData?.softCap || "--",
    },
    {
      label: "Max Buy",
      value: stepData?.maxBuy || "--",
    },
    {
      label: "Router",
      value:
        stepData?.router === "---Select Router---" ? "--" : stepData?.router,
    },
    {
      label: "Liquidity (%)",
      value: stepData?.liquidity || "--",
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
    {
      label: "Affiliation Rate",
      value: stepData?.affilationRate || "--",
    },
    {
      label: "Buy Back %",
      value: stepData?.buyBack || "--",
    },
  ].map((item, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "16px",
        borderBottom: "1px solid rgba(0, 255, 255, 0.1)",
        alignItems: "center",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Typography sx={(theme) => ({ color: theme.palette.text.primary, fontWeight: 500 })}>
        {item.label}
      </Typography>
      <Typography sx={(theme) => ({ color: theme.palette.mode === 'light' ? theme.palette.primary.main : "#00FFFF", fontWeight: 600 })}>
        {item.value}
      </Typography>
    </Box>
  ));

  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        setLoading(true);
        const amount = await getTokenAmountHandler(stepData);
        console.log("getTokenAmountHandler", amount);
        if (amount && stepData?.tokenAddress) {
          const allowance = await checkAllowanceforFairLaunch(
            stepData.tokenAddress,
            amount
          );
          // console.log("Allowance:", allowance.toString());
          setTokenAllowance(allowance);
        }
      } catch (error) {
        console.error("Error checking allowance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (stepData?.tokenAddress) {
      fetchAllowance();
    }
  }, [stepData, checkAllow]);

  const handleClickPresale = async () => {
    try {
      setLoading(true);
      const { txHash, poolId, tokenAddress, currencyAddress } =
        await createFairLaunchHandler(stepData);
      if (txHash) {
        toast.success("LaunchPad Created successfully ✅");
        setLoading(false);
        navigate(`/FairLaunchpad/View/${poolId}`, {
          state: {
            data: poolId,
            tokenAddress: tokenAddress,
            currencyAddress: currencyAddress,
          },
        });
        handleNext();
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
      const tx = await ApproveFairLAunchHandler(stepData);
      if (tx) {
        toast.success("Token approved successfully ✅");
      } else {
        console.error("Transaction failed or returned undefined.");
      }
      setCheckAllow(!checkAllow);
      setLoading(false);
    } catch (error) {
      console.error("Error creating presale:", error);
      setLoading(false);
    }
  };

  return (
    <Box className="flex flex-col  gap-16" sx={(theme) => ({ ...FairLaunchTheme.cardStyle(theme) })}>
      <Box
        sx={(theme) => ({
          border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : "1px solid rgba(0, 255, 255, 0.2)",
          borderRadius: "12px",
          overflow: "hidden", // for children borders
        })}
      >
        {buttons}
      </Box>

      <Box
        className="flex justify-center items-center gap-16 flex-wrap "
        sx={(theme) => ({
          borderRadius: "12px",
          border: `1px solid ${theme.palette.warning.main}`,
          background: theme.palette.mode === 'light' ? theme.palette.warning.light : "rgba(255, 200, 0, 0.05)",
          padding: "16px",
          width: "100%",
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
          <strong style={{ color: "#FFF" }}>
            {factoryAddress?.addresses?.FAIRLAUNCHFACTORYDDRESS}
          </strong>
        </Typography>

        <img src="/images/copy.png" alt="" style={{ opacity: 0.8 }} />
        <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.primary })}>
          from fees, rewards, max tx amount to start creating pools
        </Typography>
      </Box>

      <Box
        className="flex justify-center items-center gap-16"
        sx={(theme) => ({
          borderRadius: "12px",
          border: `1px solid ${theme.palette.warning.main}`,
          background: theme.palette.mode === 'light' ? theme.palette.warning.light : "rgba(255, 200, 0, 0.05)",
          padding: "16px",
          width: "100%",
          "@media (max-width: 600px)": {
            flexDirection: "column",
            gap: "8px",
            padding: "16px",
          },
        })}
      >
        <img src="/images/exclaimation.png" alt="" style={{ opacity: 0.8 }} />
        <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.primary })}>
          For tokens with burns, rebase or other special transfer please ensure
          that you have a way to whitelist multiple addresses or turn off the
          special transfer events (BY setting fees to 0 for example for the
          duration of the presale)
        </Typography>
      </Box>

      <Box className="flex items-center justify-center gap-2" sx={{ pt: 2 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={(theme) => ({
            ...FairLaunchTheme.neonButton(theme),
            width: "300px",
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.text.primary,
              color: theme.palette.text.primary,
            },
          })}
          variant="outlined"
        >
          Back
        </Button>

        {loading ? (
          <CircularProgress color="inherit" sx={(theme) => ({ color: theme.palette.primary.main })} />
        ) : tokenAllowance ? (
          <Button
            onClick={handleClickPresale}
            variant="contained"
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              width: "300px",
              background: theme.palette.mode === 'light' ? theme.palette.primary.light : "rgba(0, 255, 255, 0.1)",
            })}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        ) : (
          <Button
            onClick={ApproveClickHandler}
            variant="contained"
            sx={{
              ...FairLaunchTheme.neonButton,
              width: "300px",
              background: "rgba(0, 255, 255, 0.1)",
            }}
          >
            Approve {stepData?.tokenAmount}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FinishFairStep;
