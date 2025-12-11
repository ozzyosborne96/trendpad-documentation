import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Typography } from "@mui/material";
import ProgressBar from "../../Components/Progressbar";
import { FairLaunchTheme } from "../../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const steps = ["Waiting for pool start", "Pool Start", "Pool Ended"];

const VerticalStepper = ({
  poolDetails,
  tokenDetails,
  poolAddr,
  timeDetails,
  particip,
  saleStatus,
  tokens,
  eth,
  purchased,
  currencySymbol,
}) => {
  return (
    <Box
      sx={(theme) => ({
        ...FairLaunchTheme.cardStyle(theme),
        marginBottom: "20px",
      })}
    >
      {/* <ProgressBar
        start={0}
        end={0}
        current={0}
      /> */}
      <Stepper activeStep={1} orientation="vertical">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className="mt-16">
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Status</Typography>
          <Typography variant="body1">{saleStatus}</Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Sale Type</Typography>
          <Typography variant="body1">
            {poolDetails?.whiteList === false ? "Public" : "White Listing"}
          </Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Current Rate</Typography>
          <Typography variant="body1">
            1 {currencySymbol} = {tokens} {tokenDetails?.symbol}
          </Typography>
        </div>
        {/* <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Min Buy</Typography>
          <Typography variant="body1">{poolDetails?.min}{" "} tBNB</Typography>
        </div> */}
        {poolDetails?.maxBuy > "0.0" && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">Max Buy</Typography>
            <Typography variant="body1">
              {poolDetails?.maxBuy} {currencySymbol}
            </Typography>
          </div>
        )}
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Current Raised</Typography>
          <Typography variant="body1">
            {eth} {currencySymbol}
          </Typography>
        </div>
        {timeDetails?.claimTime !== 0 && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">Claim Time</Typography>
            <Typography variant="body1">{timeDetails?.claimTime} </Typography>
          </div>
        )}
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Total Contributors</Typography>
          <Typography variant="body1">{particip}</Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">You Purchased</Typography>
          <Typography variant="body1">
            {purchased} {currencySymbol}
          </Typography>
        </div>
      </div>
    </Box>
  );
};

export default VerticalStepper;
