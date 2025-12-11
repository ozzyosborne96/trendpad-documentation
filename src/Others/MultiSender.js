import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Disclaimer from "../Components/Disclaimer";
import MultiSenderInfo from "../Others/MultiSenderInfo";
import DeFiFairlaunchInfoMulti from "../Others/DeFiFairlaunchInfoMulti";
import useGetTokenDetails from "../Hooks/GetTokenDetails";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const CustomStepper = styled(Stepper)({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "row-reverse",
  textAlign: "left",
  marginLeft: "10px",
  "& .MuiStepLabel-label": {
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
    "&.Mui-active": {
      color: theme.palette.primary.main,
      fontWeight: "bold",
    },
    "&.Mui-completed": {
      color: theme.palette.text.primary,
    },
  },
  "& .MuiStepIcon-root": {
    color: theme.palette.action.disabled,
    "&.Mui-active": {
      color: theme.palette.primary.main,
    },
    "&.Mui-completed": {
      color: theme.palette.primary.main,
    },
  },
}));

const MultiSender = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [amountMode, setAmountMode] = useState("fixed");
  const [fixedAmount, setFixedAmount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const fetchTokenDetails = useGetTokenDetails();

  const steps = [
    { label: "Verify Token", optional: "Enter the token address and verify" },
    {
      label: "Confirmation",
      optional: "Let review your information",
    },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const [tokenAddress, setTokenAddress] = useState();
  const [tokenDetails, setTokenDetails] = useState("");

  const [entries, setEntries] = useState([]); // Stores [{ address: "", amount: "" }]
  const [inputValue, setInputValue] = useState(""); // Controls TextField UI

  const handleChange = (event, generate = false) => {
    let input = event?.target?.value || inputValue;

    // Step 1: Generate new allocations if needed
    if (generate) {
      const addressList = input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^0x[a-fA-F0-9]{40}/.test(line))
        .map((line) => line.split(" ")[0]);

      if (!addressList.length) return;

      const newAllocations = addressList.map((address) => {
        let amount;
        if (amountMode === "fixed") {
          amount = fixedAmount || "0"; // Use as-is
        } else {
          const min = parseFloat(minAmount || "0");
          const max = parseFloat(maxAmount || "0");
          amount = (Math.random() * (max - min) + min).toFixed(2); // Use raw number as string
        }
        return `${address} ${amount}`;
      });

      input = newAllocations.join("\n");
      setInputValue(input);
    }

    // Step 2: Format input for consistency
    const formattedInput = input
      .split("\n")
      .map((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length === 1) {
          return `${parts[0]} `;
        } else if (parts.length === 2) {
          return `${parts[0].trim()} ${parts[1].trim()}`;
        }
        return line;
      })
      .join("\n");

    setInputValue(formattedInput);

    // Step 3: Parse into address-amount objects
    const entryList = formattedInput
      .split("\n")
      .map((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length === 2) {
          const [address, amount] = parts;
          return { address: address.trim(), amount: amount.trim() };
        }
        return null;
      })
      .filter((entry) => entry && entry.address && entry.amount);

    setEntries(entryList);
  };

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenDetails(tokenAddress).then(setTokenDetails);
    } else {
      setTokenDetails(null);
    }
  }, [tokenAddress]);
  console.log("Address", entries);
  return (
    <Box mt={8}>
      {/* Stepper Container */}
      <Container
        className="mt-60"
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          padding: "20px",
          borderRadius: "12px",
        })}
      >
        <Box className="owner-zone-text">
          <Typography
            variant="h5"
            sx={(theme) => ({
              ...FairLaunchTheme.gradientText(theme),
              fontWeight: "bold",
            })}
          >
            MultiSender
          </Typography>
        </Box>

        {/* Custom Horizontal Stepper */}
        <Box mt={4}>
          <CustomStepper activeStep={activeStep} alternativeLabel>
            {steps.map(({ label, optional }, index) => (
              <Step key={index}>
                <CustomStepLabel
                  optional={
                    <Typography
                      variant="caption"
                      sx={{ color: (theme) => theme.palette.text.secondary }}
                    >
                      {optional}
                    </Typography>
                  }
                >
                  {label}
                </CustomStepLabel>
              </Step>
            ))}
          </CustomStepper>
        </Box>

        {/* Step Content */}
        <Box mt={4}>
          {activeStep === 0 && (
            <MultiSenderInfo
              tokenAddress={tokenAddress}
              setTokenAddress={setTokenAddress}
              value={inputValue}
              setValue={setInputValue}
              handleChange={handleChange}
              addresses={entries}
              tokenDetails={tokenDetails}
              setAmountMode={setAmountMode}
              amountMode={amountMode}
              setFixedAmount={setFixedAmount}
              fixedAmount={fixedAmount}
              setMinAmount={setMinAmount}
              minAmount={minAmount}
              setMaxAmount={setMaxAmount}
              maxAmount={maxAmount}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              handleBack={handleBack}
              handleNext={handleNext}
              inputValue={inputValue}
              steps={steps}
            />
          )}
          {activeStep === 1 && (
            <DeFiFairlaunchInfoMulti
              tokenDetails={tokenDetails}
              tokenAddress={tokenAddress}
              addresses={entries}
            />
          )}
        </Box>

        {/* Stepper Buttons */}
        {/* <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {tokenAddress && inputValue ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          ) : (
            <Button variant="contained">Enter Details</Button>
          )}
        </Box> */}
      </Container>
      <Disclaimer />
    </Box>
  );
};

export default MultiSender;
