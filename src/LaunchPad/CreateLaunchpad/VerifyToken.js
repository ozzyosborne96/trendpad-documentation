import { React, useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import useGetTokenDetails from "../../Hooks/GetTokenDetails";
import { debounce } from "lodash";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTokenTable from "../../Components/CustomTokenTable";
import { currencyData } from "../../utils/currency";
import { useChainId } from "wagmi";
import { FairLaunchTheme } from "../CeateFairLaunch/FairLaunchTheme";

const VerifyToken = ({
  handleNext,
  activeStep,
  steps,
  stepData,
  setStepData,
}) => {
  const chainId = useChainId();
  const [currency, setCurrency] = useState(stepData.currency || "BNB");
  const [feeOptions, setFeeOptions] = useState(() => {
    const defaultCurrency = stepData?.currency || "BNB";
    return (
      stepData?.feeOptions || `3% ${defaultCurrency} raised only (Recommended)`
    );
  });

  const [listingOptions, setListingOptions] = useState(
    stepData.listingOptions || "Auto Listing"
  );
  const [affiliate, setAffiliate] = useState(
    stepData.affiliate || "Disable Affiliate"
  );
  const [loading, setLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState();
  const [affilationRate, setAffilationRate] = useState();
  const [currencyDetails, setCurrencyDetails] = useState();

  const fetchTokenDetails = useGetTokenDetails();

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      tokenAddress: stepData.tokenAddress || "",
      affiliate: stepData.affiliate || "Disable Affiliate",
      affilationRate: stepData.affilationRate || "",
      currency: stepData?.currency || currencyData[chainId]?.tokens[0] || "", // fallback empty
    },
    validationSchema: Yup.object({
      tokenAddress: Yup.string()
        .required("Token Address is required")
        .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
      affiliate: Yup.string().required(),
      affilationRate: Yup.number()
        .transform((value, originalValue) =>
          typeof originalValue === "string"
            ? parseFloat(originalValue.replace(/[^0-9.]/g, ""))
            : value
        )
        .when("affiliate", {
          is: "Enable Affiliate",
          then: (schema) =>
            schema
              .typeError("Must be a valid number")
              .integer("Only whole numbers are allowed")
              .moreThan(0, "Value must be greater than 0")
              .max(5, "Maximum allowed is 5%")
              .required("Affiliate rate is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
    }),
    onSubmit: () => handleNextClick(),
  });
  useEffect(() => {
    const newFee = `3% ${formik.values.currency} raised only (Recommended)`;
    setFeeOptions((prev) => (prev === "Other" ? "Other" : newFee));
  }, [formik.values.currency]);

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
    if (chainId) {
      if (currencyData.hasOwnProperty(chainId)) {
        setCurrencyDetails(currencyData[chainId]);
      } else {
        setCurrencyDetails(null);
      }
    }
  }, [chainId]);
  const handleNextClick = () => {
    const newStepData = {
      tokenAddress: formik.values.tokenAddress.trim(),
      currency: formik.values.currency,
      feeOptions,
      listingOptions,
      affiliate: formik.values.affiliate,
      affilationRate: formik.values.affilationRate,
      tokenBalance: tokenDetails?.balance,
      tokenSymbol: tokenDetails?.symbol,
      poolFee: currencyDetails?.poolFeeAmount,
    };

    setStepData((prev) => ({
      ...prev,
      ...newStepData,
    }));

    handleNext(newStepData);
  };
  console.log("tokenDetails?.balance", tokenDetails);
  return (
    <Box sx={(theme) => FairLaunchTheme.cardStyle(theme)}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={(theme) => ({ color: theme.palette.text.secondary, mb: 1 })}
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
              variant="outlined"
              placeholder="Ex: TokenMoon"
              value={formik.values.tokenAddress}
              onChange={formik.handleChange}
              name="tokenAddress"
              error={
                formik.touched.tokenAddress &&
                Boolean(formik.errors.tokenAddress)
              }
              helperText={
                formik.touched.tokenAddress && formik.errors.tokenAddress
              }
              fullWidth
              sx={(theme) => FairLaunchTheme.inputStyle(theme)}
            />
            <Typography
              variant="body2"
              sx={(theme) => ({ mt: 1, color: theme.palette.primary.main })}
            >
              Pool creation fee is {currencyDetails?.poolFee}{" "}
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
            <FormControl sx={{ width: "100%" }}>
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
                        sx={(theme) => ({
                          color: theme.palette.primary.main,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        })}
                      />
                    }
                    label={
                      <Typography
                        sx={(theme) => ({ color: theme.palette.text.primary })}
                      >
                        {item}
                      </Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Typography
              variant="caption"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                display: "block",
                mt: 1,
              })}
            >
              User will pay with{" "}
              <span style={{ color: "#00FFFF" }}>{formik.values.currency}</span>{" "}
              for your token
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Fee Options
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <RadioGroup
                name="feeOptions"
                value={feeOptions}
                onChange={(e) => setFeeOptions(e.target.value)}
              >
                <FormControlLabel
                  value={`3% ${formik.values.currency} raised only (Recommended)`}
                  control={
                    <Radio
                      sx={(theme) => ({
                        color: theme.palette.primary.main,
                        "&.Mui-checked": { color: theme.palette.primary.main },
                      })}
                    />
                  }
                  label={
                    <Typography
                      sx={(theme) => ({ color: theme.palette.text.primary })}
                    >{`3% ${formik.values.currency} raised only (Recommended)`}</Typography>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1.5,
                })}
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
                        sx={(theme) => ({
                          color: theme.palette.primary.main,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        })}
                      />
                    }
                    label={
                      <Typography
                        sx={(theme) => ({ color: theme.palette.text.primary })}
                      >
                        Disable Affiliate
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="Enable Affiliate"
                    control={
                      <Radio
                        sx={(theme) => ({
                          color: theme.palette.primary.main,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        })}
                      />
                    }
                    label={
                      <Typography
                        sx={(theme) => ({ color: theme.palette.text.primary })}
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
            <FormControl sx={{ width: "100%" }}>
              <RadioGroup
                value={listingOptions}
                onChange={(e) => setListingOptions(e.target.value)}
              >
                <FormControlLabel
                  value="Auto Listing"
                  control={
                    <Radio
                      sx={(theme) => ({
                        color: theme.palette.primary.main,
                        "&.Mui-checked": { color: theme.palette.primary.main },
                      })}
                    />
                  }
                  label={
                    <Typography
                      sx={(theme) => ({ color: theme.palette.text.primary })}
                    >
                      Auto Listing
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="Manual Listing (Recommended for Seed/Private Sale)"
                  control={
                    <Radio
                      sx={(theme) => ({
                        color: theme.palette.primary.main,
                        "&.Mui-checked": { color: theme.palette.primary.main },
                      })}
                    />
                  }
                  label={
                    <Typography
                      sx={(theme) => ({ color: theme.palette.text.primary })}
                    >
                      Manual Listing (Recommended for Seed/Private Sale)
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={(theme) => ({
                borderRadius: "12px",
                background:
                  theme.palette.mode === "light"
                    ? theme.palette.primary.light
                    : "rgba(0, 255, 255, 0.05)",
                border: `1px solid ${theme.palette.divider}`,
                backdropFilter: "blur(10px)",
                textAlign: "center",
                padding: { xs: "12px 16px", sm: "16px 24px" },
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                  borderColor: theme.palette.primary.main,
                },
              })}
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
                  sx={(theme) => ({
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    lineHeight: 1.6,
                  })}
                >
                  {listingOptions === "Auto Listing"
                    ? "For auto listing, after you finalize the pool your token will be auto listed on DEX"
                    : "For manual listing, Trendpad won't charge tokens for liquidity. You may withdraw ETH after the pool ends then do DEX listing yourself."}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "center", mt: 2 }}
          >
            <Box>
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
                    minWidth: "200px",
                    maxWidth: "400px",
                  })}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default VerifyToken;
