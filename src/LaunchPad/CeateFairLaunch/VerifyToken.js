import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import useGetTokenDetails from "../../Hooks/GetTokenDetails";
import { debounce } from "lodash";
import CustomTokenTable from "../../Components/CustomTokenTable";
import { getChainInfo } from "../../ContractAction/ContractDependency";
import { currencyData } from "../../utils/currency";
const validationSchema = Yup.object({
  tokenAddress: Yup.string()
    .required("Token Address is required")
    .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  currency: Yup.string().required("Currency is required"),
  feeOption: Yup.string().required("Fee option is required"),
  affiliate: Yup.string().required("Affiliate selection is required"),
  listingOption: Yup.string().required("Listing option is required"),
  affilationRate: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const parsed = parseFloat(originalValue.replace(/[^0-9.]/g, ""));
        return isNaN(parsed) ? undefined : parsed;
      }
      return value;
    })
    .nullable()
    .when("affiliate", {
      is: "Enable Affiliate",
      then: (schema) =>
        schema
          .typeError("Must be a valid number")
          .required("Affiliate rate is required")
          .moreThan(0, "Value must be greater than 0")
          .max(5, "Maximum allowed is 5%"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

import { FairLaunchTheme } from "./FairLaunchTheme";

const VerifyToken = ({
  handleNext,
  activeStep,
  steps,
  stepData,
  setStepData,
}) => {
  const [tokenDetails, setTokenDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [currencyDetails, setCurrencyDetails] = useState();
  const [chainId, setChainId] = useState(null);

  const fetchTokenDetails = useGetTokenDetails();
  const initialCurrency =
    stepData?.currency || currencyData[chainId]?.tokens[0] || "";
  console.log("initialCurrency", initialCurrency);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      tokenAddress: stepData.tokenAddress || "",
      currency: stepData?.currency || currencyData[chainId]?.tokens[0] || "", // fallback empty
      feeOption:
        stepData?.feeOption ||
        `3% ${initialCurrency} raised only (Recommended)`,
      affiliate: stepData?.affiliate || "Disable Affiliate",
      listingOption: stepData?.listingOption || "Auto Listing",
      affilationRate: stepData?.affilationRate || "", // empty string
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form values:", values);
      handleNextClick(values); // proceed to the next step
    },
  });
  const handleNextClick = (values) => {
    const newStepData = {
      tokenAddress: values.tokenAddress.trim(),
      currency: values.currency,
      feeOption: values.feeOption,
      listingOption: values.listingOption,
      affiliate: values.affiliate,
      affilationRate: values.affilationRate,
      tokenBalance: tokenDetails?.balance,
      tokenSymbol: tokenDetails?.symbol,
    };
    setStepData((prev) => ({
      ...prev,
      ...newStepData,
    }));
    handleNext(newStepData);
  };
  const debouncedFetchTokenDetails = debounce((address) => {
    setLoading(true);
    fetchTokenDetails(address)
      .then(setTokenDetails)
      .finally(() => setLoading(false));
  }, 500);
  useEffect(() => {
    const trimmed = formik.values.tokenAddress.trim();
    if (trimmed) {
      debouncedFetchTokenDetails(trimmed);
    } else {
      setTokenDetails(null);
      setLoading(false);
    }
  }, [formik.values.tokenAddress]);

  useEffect(() => {
    const fetchChainId = async () => {
      const data = await getChainInfo();
      if (data) setChainId(data.chainId);
    };
    fetchChainId();
    if (typeof window !== "undefined" && window.ethereum) {
      const handleChainChanged = () => {
        fetchChainId();
      };
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  useEffect(() => {
    if (chainId) {
      if (currencyData.hasOwnProperty(chainId)) {
        setCurrencyDetails(currencyData[chainId]);
      } else {
        setCurrencyDetails(null);
      }
    }
  }, [chainId]);
  console.log("currencyDetails?.tokens[0]", currencyDetails?.tokens[0]);
  return (
    <Box sx={(theme) => FairLaunchTheme.cardStyle(theme)}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={{ color: (theme) => theme.palette.text.secondary, mb: 1 }}
            >
              (*) is required field
            </Typography>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Token address*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: TokenMoon"
              name="tokenAddress"
              value={formik.values.tokenAddress}
              onChange={formik.handleChange}
              sx={FairLaunchTheme.inputStyle}
              error={
                formik.touched.tokenAddress &&
                Boolean(formik.errors.tokenAddress)
              }
              helperText={
                formik.touched.tokenAddress && formik.errors.tokenAddress
              }
            />
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.primary.main
                    : FairLaunchTheme.colors.accentCyan,
              }}
            >
              Pool creation fee is {currencyDetails?.poolFee}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <CustomTokenTable
                tokenDetails={tokenDetails}
                tokenAddress={formik.values.tokenAddress.trim()}
                loading={loading}
                variant="fairLaunch"
              />
            </Box>
          </Grid>
          {/* Currency */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Currency
            </Typography>
            <FormControl
              error={formik.touched.currency && Boolean(formik.errors.currency)}
              sx={{ width: "100%" }}
            >
              <RadioGroup
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
              >
                {currencyDetails?.tokens.map((item) => (
                  <FormControlLabel
                    key={item}
                    value={item}
                    control={
                      <Radio
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.primary.main
                              : "#00FFFF",
                          "&.Mui-checked": {
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? theme.palette.primary.main
                                : "#00FFFF",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        {item}
                      </Typography>
                    }
                  />
                ))}
              </RadioGroup>
              <FormHelperText>
                {formik.touched.currency && formik.errors.currency}
              </FormHelperText>
            </FormControl>
            <Typography
              variant="caption"
              sx={{
                color: (theme) => theme.palette.text.secondary,
                display: "block",
                mt: 1,
              }}
            >
              User will pay with{" "}
              <Box
                component="span"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.primary.main
                      : "#00FFFF",
                }}
              >
                {formik.values.currency}
              </Box>{" "}
              for your token
            </Typography>
          </Grid>
          {/* Fee Options + Affiliate */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{ ...FairLaunchTheme.gradientText, mb: 1.5 }}
            >
              Fee Options
            </Typography>
            <FormControl
              error={
                formik.touched.feeOption && Boolean(formik.errors.feeOption)
              }
              sx={{ width: "100%" }}
            >
              <RadioGroup
                name="feeOption"
                value={formik.values.feeOption}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value={`3% ${formik.values.currency} raised only (Recommended)`}
                  control={
                    <Radio
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? theme.palette.primary.main
                            : "#00FFFF",
                        "&.Mui-checked": {
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.primary.main
                              : "#00FFFF",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{ color: (theme) => theme.palette.text.primary }}
                    >{`3% ${formik.values.currency} raised only (Recommended)`}</Typography>
                  }
                />
              </RadioGroup>
              <FormHelperText>
                {formik.touched.feeOption && formik.errors.feeOption}
              </FormHelperText>
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                sx={{ ...FairLaunchTheme.gradientText, mb: 1.5 }}
              >
                Affiliate Program
              </Typography>
              <FormControl sx={{ width: "100%" }}>
                <RadioGroup
                  value={formik.values.affiliate}
                  onChange={(e) =>
                    formik.setFieldValue("affiliate", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="Disable Affiliate"
                    control={
                      <Radio
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.primary.main
                              : "#00FFFF",
                          "&.Mui-checked": {
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? theme.palette.primary.main
                                : "#00FFFF",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        Disable Affiliate
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="Enable Affiliate"
                    control={
                      <Radio
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.primary.main
                              : "#00FFFF",
                          "&.Mui-checked": {
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? theme.palette.primary.main
                                : "#00FFFF",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        Enable Affiliate
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
              {formik.values.affiliate === "Enable Affiliate" && (
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Percentage max 5%"
                  name="affilationRate"
                  value={formik.values.affilationRate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={(theme) => ({
                    ...FairLaunchTheme.inputStyle(theme),
                    mt: 2,
                  })}
                  error={
                    formik.touched.affilationRate &&
                    Boolean(formik.errors.affilationRate)
                  }
                  helperText={
                    formik.touched.affilationRate &&
                    formik.errors.affilationRate
                  }
                />
              )}
            </Box>
          </Grid>

          {/* Listing Options */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Listing Options
            </Typography>
            <FormControl
              error={
                formik.touched.listingOption &&
                Boolean(formik.errors.listingOption)
              }
              sx={{ width: "100%" }}
            >
              <RadioGroup
                name="listingOption"
                value={formik.values.listingOption}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="Auto Listing"
                  control={
                    <Radio
                      sx={{
                        color: "#00FFFF",
                        "&.Mui-checked": { color: "#00FFFF" },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{ color: (theme) => theme.palette.text.primary }}
                    >
                      Auto Listing
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="Manual Listing (Recommended for Seed/Private Sale)"
                  control={
                    <Radio
                      sx={{
                        color: "#00FFFF",
                        "&.Mui-checked": { color: "#00FFFF" },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{ color: (theme) => theme.palette.text.primary }}
                    >
                      Manual Listing (Recommended for Seed/Private Sale)
                    </Typography>
                  }
                />
              </RadioGroup>
              <FormHelperText>
                {formik.touched.listingOption && formik.errors.listingOption}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                borderRadius: "12px",
                background: "rgba(0, 255, 255, 0.05)",
                border: "1px solid rgba(0, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                padding: { xs: "12px 16px", sm: "16px 24px" },
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 20px rgba(0, 255, 255, 0.1)",
                  borderColor: "#00FFFF",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>ℹ️</Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    lineHeight: 1.6,
                  }}
                >
                  {formik.values.listingOption === "Auto Listing"
                    ? "For auto listing, after you finalize the pool your token will be auto listed on DEX"
                    : "For manual listing, Trendpad won't charge tokens for liquidity. You may withdraw ETH after the pool ends then do DEX listing yourself."}
                </Typography>
              </Box>
            </Box>
          </Grid>
          {/* Submit Button */}
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "center", mt: 2 }}
          >
            {formik.values.tokenAddress &&
            (tokenDetails === null || tokenDetails?.balance <= 0) ? (
              <Typography color="error">Insufficient balance</Typography>
            ) : (
              <Button
                type="submit"
                variant="contained"
                sx={(theme) => ({
                  ...FairLaunchTheme.neonButton(theme),
                  width: "100%",
                  maxWidth: "400px",
                })}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default VerifyToken;
