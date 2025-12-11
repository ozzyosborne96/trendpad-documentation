import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import VerifyToken from "./VerifyToken";
import DefiFairLaunchpadInfo from "./DefiFairLaunchInfo";
import AdditionalFairInfo from "./AdditionalFairInfo";
import FinishFairStep from "./FinishFairStep";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Step labels
const steps = [
  "Verify Token",
  "DeFi Fair-launch  Info",
  "Add Additional Info",
  "Finish",
];

// Step descriptions
const optionalTexts = [
  "Enter the token address and verify",
  "Enter the launchpad information that you want to raise, that should be enter all details about your Fair-launch",
  "Let people know who you are",
  "Review your information",
];

// Step Components

import { FairLaunchTheme } from "./FairLaunchTheme";

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isStepSkipped = (step) => skipped.has(step);
  const [stepData, setStepData] = React.useState({});
  const handleNext = (newData) => {
    setStepData((prev) => {
      const updatedData = { ...prev, ...newData };
      if (prev === updatedData) {
        return prev;
      }
      return updatedData;
    });
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setStepData({});
  };
  // Function to render step component based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <VerifyToken
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 1:
        return (
          <DefiFairLaunchpadInfo
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
            handleBack={handleBack}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 2:
        return (
          <AdditionalFairInfo
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
            handleBack={handleBack}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 3:
        return (
          <FinishFairStep
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
            handleBack={handleBack}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.background.default
            : FairLaunchTheme.colors.bgDark,
        backgroundImage: (theme) =>
          theme.palette.mode === "light"
            ? "none"
            : `radial-gradient(circle at 10% 20%, rgba(0, 255, 255, 0.05) 0%, transparent 40%),
               radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 40%)`,
        px: isSmallScreen ? 2 : 4,
        py: 3,
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <Stepper
        activeStep={activeStep}
        orientation={isSmallScreen ? "vertical" : "horizontal"}
        sx={{
          "& .MuiStepLabel-label": {
            color: (theme) => theme.palette.text.secondary,
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : "#00FFFF !important",
            fontWeight: "bold",
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : "#00FFFF !important",
          },
          "& .MuiStepIcon-root": {
            color: (theme) =>
              theme.palette.mode === "light" ? theme.palette.grey[400] : "#333",
          },
          "& .MuiStepIcon-text": {
            fill: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.common.white
                : "#fff",
          },
          "& .MuiStepIcon-root.Mui-active": {
            color: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : "#00FFFF",
            "& .MuiStepIcon-text": {
              fill: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.common.white
                  : "#000",
            },
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : "#00FFFF",
          },
        }}
      >
        {steps.map((label, index) => (
          <Step
            key={label}
            {...(isStepSkipped(index) ? { completed: false } : {})}
          >
            <StepLabel>
              <Typography
                variant="body1"
                sx={{ color: (theme) => theme.palette.text.primary }}
              >
                {label}
              </Typography>
              {!isSmallScreen && (
                <Typography sx={{ fontSize: "12px", maxWidth: "200px" }}>
                  {optionalTexts[index]}
                </Typography>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Render the component based on the active step */}
      <Box sx={{ mt: 4, mb: 2 }}>{getStepContent(activeStep)}</Box>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button  onClick={handleNext} >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box> */}
        </React.Fragment>
      )}
    </Box>
  );
}
