import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableBody,
} from "@mui/material";
import { React, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { color } from "framer-motion";
import {
  getNetworkConfig,
  getChainInfo,
} from "../ContractAction/ContractDependency";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";
import { toast } from "react-hot-toast";
import CustomTokenTable from "../Components/CustomTokenTable";

const MultiSenderInfo = ({
  tokenAddress,
  setTokenAddress,
  value,
  setValue,
  handleChange,
  addresses,
  tokenDetails,
  setAmountMode,
  amountMode,
  setFixedAmount,
  fixedAmount,
  setMinAmount,
  minAmount,
  setMaxAmount,
  maxAmount,
  activeStep,
  setActiveStep,
  handleBack,
  handleNext,
  inputValue,
  steps,
}) => {
  const [nativeToken, setNativeToken] = useState();
  // const formik = useFormik({
  //   initialValues: {
  //     tokenAddress: tokenAddress,
  //     allocations: value,
  //   },
  //   validationSchema: Yup.object({
  //     tokenAddress: Yup.string()
  //       .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
  //       .required("Token address is required"),
  //     allocations: Yup.string()
  //       .required("Allocations are required")
  //       .test(
  //         "valid-format-and-no-duplicates",
  //         "Invalid or duplicate allocation format",
  //         (val) => {
  //           if (!val) return false;

  //           const lines = val.split("\n");
  //           const addressSet = new Set();

  //           for (const line of lines) {
  //             const trimmedLine = line.trim();
  //             const match = trimmedLine.match(
  //               /^0x[a-fA-F0-9]{40} (\d+\.?\d*)$/
  //             );
  //             if (!match) return false;

  //             const address = trimmedLine.split(" ")[0].toLowerCase(); // normalize casing
  //             if (addressSet.has(address)) {
  //               return false; // duplicate found
  //             }
  //             addressSet.add(address);
  //           }

  //           return true;
  //         }
  //       ),
  //   }),
  //   onSubmit: (values) => {
  //     // If validation passes, proceed
  //     handleNext();
  //   },

  //   onChange: (e) => {
  //     if (e.target.name === "tokenAddress") {
  //       setTokenAddress(e.target.value);
  //     } else if (e.target.name === "allocations") {
  //       setValue(e.target.value);
  //     }
  //   },
  // });
  const formik = useFormik({
    initialValues: {
      tokenAddress: tokenAddress,
      allocations: value,
      fixedAmount: fixedAmount,
      minAmount: minAmount,
      maxAmount: maxAmount,
      amountMode: amountMode,
    },
    validationSchema: Yup.object({
      tokenAddress: Yup.string()
        .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
        .required("Token address is required"),
      allocations: Yup.string()
        .required("Allocations are required")
        .test(
          "valid-format-and-no-duplicates",
          "Invalid or duplicate allocation format",
          (val) => {
            if (!val) return false;

            const lines = val.split("\n");
            const addressSet = new Set();

            for (const line of lines) {
              const trimmedLine = line.trim();
              const match = trimmedLine.match(
                /^0x[a-fA-F0-9]{40} (\d+\.?\d*)$/
              );
              if (!match) return false;

              const address = trimmedLine.split(" ")[0].toLowerCase();
              if (addressSet.has(address)) {
                return false;
              }
              addressSet.add(address);
            }

            return true;
          }
        ),
      amountMode: Yup.string().required(),

      fixedAmount: Yup.number().when("amountMode", {
        is: "fixed",
        then: (schema) =>
          schema
            .required("Fixed amount is required")
            .positive("Amount must be greater than zero"),
      }),

      minAmount: Yup.number().when("amountMode", {
        is: "random",
        then: (schema) =>
          schema
            .required("Min amount is required")
            .positive("Must be greater than 0"),
      }),

      maxAmount: Yup.number().when("amountMode", {
        is: "random",
        then: (schema) =>
          schema
            .required("Max amount is required")
            .moreThan(Yup.ref("minAmount"), "Must be greater than Min amount"),
      }),
    }),

    onSubmit: (values) => {
      handleNext();
    },
  });
  useEffect(() => {
    formik.setFieldValue("amountMode", amountMode);
  }, [amountMode]);

  // Sync tokenAddress and value to Formik when they change
  useEffect(() => {
    formik.setFieldValue("tokenAddress", tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    formik.setFieldValue("allocations", value);
  }, [value]);

  useEffect(() => {
    const fetchConfig = async () => {
      const { chainId } = await getChainInfo();
      const config = await getNetworkConfig(chainId);
      setNativeToken(config?.nativeToken);
    };

    fetchConfig();

    // Listen to chain change event
    if (window.ethereum) {
      window.ethereum.on("chainChanged", fetchConfig);

      // Cleanup listener on unmount
      return () => {
        window.ethereum.removeListener("chainChanged", fetchConfig);
      };
    }
  }, []);
  console.log("tokenDetails", tokenDetails);

  const textFieldStyle = (theme) => FairLaunchTheme.inputStyle(theme);
  const labelStyle = (theme) => ({
    color: theme.palette.text.primary,
    fontWeight: "bold",
    mb: 1,
  });

  return (
    <Box>
      {/* Token Address Input */}
      <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
        Token Address{" "}
      </Typography>
      <span style={{ color: "#00FFFF" }}>
        A platform fee of 0.01 {nativeToken} is required to perform a batch
        transfer.
      </span>

      <TextField
        variant="outlined"
        placeholder="Ex: 0x......"
        fullWidth
        name="tokenAddress"
        value={formik.values.tokenAddress}
        onChange={(e) => {
          setTokenAddress(e.target.value);
          formik.handleChange(e);
        }}
        onBlur={formik.handleBlur}
        error={
          formik.touched.tokenAddress && Boolean(formik.errors.tokenAddress)
        }
        helperText={formik.touched.tokenAddress && formik.errors.tokenAddress}
        sx={textFieldStyle}
      />
      <Typography
        variant="body2"
        sx={(theme) => ({
          color: theme.palette.text.secondary,
          mt: 1,
          fontSize: "0.875rem",
        })}
      >
        Enter the ERC20 token contract address you want to send. This is the
        token that will be distributed to multiple recipients.
      </Typography>
      <Typography
        variant="h6"
        className="commom-gradiant"
        sx={(theme) => ({
          fontSize: "14px !important",
          marginTop: "8px",
          color: theme.palette.text.secondary,
        })}
      >
        Multi-sender allows you to send ERC20 token in batch by easiest way.
      </Typography>

      {/* Token Details */}
      <Box sx={{ mt: 3 }}>
        <CustomTokenTable
          tokenDetails={tokenDetails}
          tokenAddress={tokenAddress}
          loading={false}
          variant="fairLaunch"
        />
      </Box>

      {/* Amount Generation Section */}
      <Box className="m-8" sx={{ mt: 4 }}>
        <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
          Amount Type
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant={amountMode === "fixed" ? "contained" : "outlined"}
              onClick={() => setAmountMode("fixed")}
              fullWidth
              sx={(theme) =>
                amountMode === "fixed"
                  ? FairLaunchTheme.neonButton(theme)
                  : {
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider,
                    }
              }
            >
              Fixed
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant={amountMode === "random" ? "contained" : "outlined"}
              onClick={() => setAmountMode("random")}
              fullWidth
              sx={(theme) =>
                amountMode === "random"
                  ? FairLaunchTheme.neonButton(theme)
                  : {
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider,
                    }
              }
            >
              Random
            </Button>
          </Grid>
        </Grid>

        {amountMode === "fixed" ? (
          <Box className="m-8" sx={{ mt: 3 }}>
            <TextField
              name="fixedAmount"
              value={formik.values.fixedAmount}
              onChange={(e) => {
                setFixedAmount(e.target.value);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.fixedAmount && Boolean(formik.errors.fixedAmount)
              }
              helperText={
                formik.touched.fixedAmount && formik.errors.fixedAmount
              }
              sx={textFieldStyle}
            />
          </Box>
        ) : (
          <Grid container spacing={2} className="m-4" sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                name="minAmount"
                value={formik.values.minAmount}
                onChange={(e) => {
                  setMinAmount(e.target.value);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.minAmount && Boolean(formik.errors.minAmount)
                }
                helperText={formik.touched.minAmount && formik.errors.minAmount}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                name="maxAmount"
                value={formik.values.maxAmount}
                onChange={(e) => {
                  setMaxAmount(e.target.value);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.maxAmount && Boolean(formik.errors.maxAmount)
                }
                helperText={formik.touched.maxAmount && formik.errors.maxAmount}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>
        )}

        <Box className="m-4" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleChange(null, true)}
            sx={(theme) => FairLaunchTheme.neonButton(theme)}
          >
            Generate Allocations
          </Button>
        </Box>
      </Box>

      {/* Allocations Input */}
      <Box className="mt-16" sx={{ mt: 4 }}>
        <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
          Allocations
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          placeholder={`Insert allocations: separate with line breaks.\nFormat: address amount\nExamples:\n0x0000000000000000000000000000000000000000 13.56\n0x0000000000000000000000000000000000000000 12.67`}
          variant="outlined"
          name="allocations"
          value={formik.values.allocations}
          onChange={(e) => {
            handleChange(e);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          error={
            formik.touched.allocations && Boolean(formik.errors.allocations)
          }
          helperText={formik.touched.allocations && formik.errors.allocations}
          inputProps={{ style: { whiteSpace: "pre-wrap" } }}
          sx={textFieldStyle}
        />
      </Box>

      {/* CSV Upload Section */}
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              id="csv-upload-input"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const csvText = event.target.result;
                    const lines = csvText.trim().split("\n");

                    const formatted = lines
                      .map((line) => line.trim())
                      .filter((line) => line.length > 0)
                      .map((line) => {
                        const parts = line.split(/\s+/);
                        if (parts.length >= 2) {
                          const address = parts[0];
                          const amount = parts[1];

                          // Validate address format
                          if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
                            return null;
                          }

                          // Validate amount
                          if (isNaN(parseFloat(amount))) {
                            return null;
                          }

                          return `${address} ${amount}`;
                        }
                        return null;
                      })
                      .filter((line) => line !== null)
                      .join("\n");

                    if (formatted.length === 0) {
                      toast.error("No valid entries found in CSV file");
                      return;
                    }

                    // Update the input value
                    setValue(formatted);
                    handleChange({ target: { value: formatted } });
                    toast.success(
                      `Successfully loaded ${
                        formatted.split("\n").length
                      } entries from CSV`
                    );
                  } catch (error) {
                    console.error("CSV parsing error:", error);
                    toast.error("Failed to parse CSV file");
                  }
                };
                reader.onerror = () => {
                  toast.error("Failed to read CSV file");
                };
                reader.readAsText(file);

                // Reset input
                e.target.value = "";
              }}
            />
            <Button
              variant="outlined"
              fullWidth
              onClick={() =>
                document.getElementById("csv-upload-input").click()
              }
              sx={(theme) => ({
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  background: "rgba(0, 255, 255, 0.05)",
                },
              })}
            >
              Or choose from CSV
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                // Generate sample CSV content
                const sampleContent = `0x0000000000000000000000000000000000001000 13.45
0x0000000000000000000000000000000000002000 1.049
0x0000000000000000000000000000000000003000 1`;

                // Create blob and download
                const blob = new Blob([sampleContent], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "sample_multisender.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success("Sample CSV downloaded");
              }}
              sx={(theme) => ({
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  background: "rgba(0, 255, 255, 0.1)",
                },
              })}
            >
              Sample CSV
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* <Box className="mt-16">
        <Button variant="outlined">Sample CSV File</Button>
      </Box> */}
      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={(theme) => ({
            ...FairLaunchTheme.neonButton(theme),
            background: "transparent",
            border: `1px solid ${theme.palette.divider}`,
            mr: 2,
            "&:hover": {
              background: "rgba(255, 255, 255, 0.05)",
            },
          })}
        >
          Back
        </Button>

        <form onSubmit={formik.handleSubmit}>
          {!tokenAddress || !inputValue ? (
            <Button
              variant="contained"
              disabled
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                ml: 2,
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.action.disabledBackground,
                  color: theme.palette.text.disabled,
                  opacity: 0.6,
                },
              })}
            >
              Enter Details
            </Button>
          ) : Number(tokenDetails?.balance) <= 0 ? (
            <Button
              variant="contained"
              disabled
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                ml: 2,
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.action.disabledBackground,
                  color: theme.palette.text.disabled,
                  opacity: 0.6,
                },
              })}
            >
              Insufficient Balance
            </Button>
          ) : tokenDetails === null ? (
            <Button
              variant="contained"
              disabled
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                ml: 2,
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.action.disabledBackground,
                  color: theme.palette.text.disabled,
                  opacity: 0.6,
                },
              })}
            >
              Invalid Token
            </Button>
          ) : (
            <Button
              variant="contained"
              type="submit"
              disabled={activeStep === steps.length - 1}
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                ml: 2,
                "&.Mui-disabled": {
                  backgroundColor: "#9e9e9e",
                  color: "#ffffff",
                },
              })}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default MultiSenderInfo;
