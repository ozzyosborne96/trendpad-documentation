import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import { Button, InputAdornment, List, ListItem } from "@mui/material";
import Select from "@mui/material/Select";
import CustomDatePicker from "../../Components/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getNetworkConfig,
  chainSwitchNetwork,
} from "../../ContractAction/ContractDependency";
import { fetchTokenStatus } from "./ApiLaunchPadHandler";
import { useNavigate } from "react-router-dom";
import { color } from "framer-motion";
import toast from "react-hot-toast";
import { FairLaunchTheme } from "../CeateFairLaunch/FairLaunchTheme";

const DefiLaunchpadInfo = ({
  handleNext,
  activeStep,
  steps,
  handleBack,
  stepData,
  setStepData,
}) => {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const label1 = { inputProps: { "aria-label": "Checkbox demo" } };
  const [config, setConfig] = useState(null);
  const [factoryAdd, setFactoryAdd] = useState();
  const [presaleRate, setPresaleRate] = useState(stepData.presaleRate || "");
  const [whitelistEnabled, setWhitelistEnabled] = useState(
    stepData.whitelistEnabled || false
  );
  const [softcap, setSoftcap] = useState(stepData.softcap || "");
  const [hardcap, setHardcap] = useState(stepData.hardcap || "");
  const [minBuy, setMinBuy] = useState(stepData.minBuy || "");
  const [maxBuy, setMaxBuy] = useState(stepData.maxBuy || "");
  const [refundType, setRefundType] = useState(stepData.refundType || "Burn");
  const [router, setRouter] = useState(
    stepData.router || "---Select Router Exchange---"
  );
  const [liquidity, setLiquidity] = useState(stepData.liquidity || "");
  const [listingRate, setListingRate] = useState(stepData.listingRate || "");
  const [startTime, setStartTime] = useState(stepData.startTime);
  const [endTime, setEndTime] = useState(stepData.endTime);
  const [tokenAmount, setTokenAmount] = useState();
  const [liquidityLockup, setLiquidityLockup] = useState(
    stepData.liquidityLockup || ""
  );
  const [tgeDate, setTgeDate] = useState(stepData.tgeDate);
  const [usingVesting, setUsingVesting] = useState(
    stepData.usingVesting || false
  );
  const [lockupUnit, setLockupUnit] = useState("Minute");
  const [poolStatus, setPoolStatus] = useState();
  console.log("stepData", stepData);
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    presaleRate: Yup.number()
      .required("Presale rate is required")
      .positive("Presale rate must be greater than 0")
      .test(
        "max-18-decimals",
        "Value must have at most 18 decimal places",
        function (value) {
          const str = this.originalValue?.toString() || "";
          const decimalPart = str.split(".")[1];
          return !decimalPart || decimalPart.length <= 18;
        }
      )
      .test(
        "not-greater-than-balance",
        "Presale rate must not be greater than your token balance",
        function (value) {
          const tokenBalance = this.options?.context?.stepData?.tokenBalance;
          if (!value || typeof tokenBalance !== "number") return true;
          return value <= tokenBalance;
        }
      ),
    softcap: Yup.number()
      .required("Softcap is required")
      .positive("Softcap must be positive")
      .test(
        "softcap-vs-hardcap",
        "Softcap must be greater than or equal to 25% of Hardcap",
        function (value) {
          const { hardcap } = this.parent;
          if (!value || !hardcap) return true;
          return value >= hardcap * 0.25;
        }
      )
      .test(
        "max-18-decimals",
        "Value must have at most 18 decimal places",
        function (value) {
          const str = this.originalValue?.toString() || "";
          const decimalPart = str.split(".")[1];
          return !decimalPart || decimalPart.length <= 18;
        }
      )
      .test(
        "only-one-decimal-point",
        "Value must not contain more than one decimal point",
        function (value) {
          const str = this.originalValue?.toString() || "";
          return (str.match(/\./g) || []).length <= 1;
        }
      ),
    hardcap: Yup.number().required("Hardcap is required").positive(),
    minBuy: Yup.number()
      .required("Minimum Buy is required")
      .positive("Minimum Buy must be greater than 0")
      .test(
        "minBuy-vs-maxBuy",
        "Minimum Buy must be less than Maximum Buy",
        function (value) {
          const { maxBuy } = this.parent;
          if (!value || !maxBuy) return true;
          return value < maxBuy;
        }
      )
      // .test(
      //   "minBuy-vs-softcap",
      //   "Minimum Buy must be greater than or equal to Softcap",
      //   function (value) {
      //     const { softcap } = this.parent;
      //     if (!value || !softcap) return true;
      //     return value >= softcap;
      //   }
      // )
      .test(
        "minBuy-vs-hardcap",
        "Minimum Buy must be less than or equal to Hardcap",
        function (value) {
          const { hardcap } = this.parent;
          if (!value || !hardcap) return true;
          return value <= hardcap;
        }
      )
      .test(
        "only-one-decimal-point",
        "Value must not contain more than one decimal point",
        function (value) {
          const str = this.originalValue?.toString() || "";
          return (str.match(/\./g) || []).length <= 1;
        }
      )
      .test(
        "max-18-decimals",
        "Value must have at most 18 decimal places",
        function (value) {
          const str = this.originalValue?.toString() || "";
          const decimalPart = str.split(".")[1];
          return !decimalPart || decimalPart.length <= 18;
        }
      ),
    maxBuy: Yup.number()
      .required("Maximum Buy is required")
      .positive("Maximum Buy must be greater than 0")
      .when("hardcap", (hardcap, schema) =>
        schema.max(hardcap, "Maximum Buy must be less than or equal to Hardcap")
      ),
    refundType: Yup.string().required("Refund type is required"),
    router: Yup.string().when([], {
      is: () =>
        stepData?.listingOptions !==
        "Manual Listing (Recommended for Seed/Private Sale)",
      then: (schema) =>
        schema
          .notOneOf(["---Select Router Exchange---"], "Router is required")
          .required("Router is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    liquidity: Yup.number()
      .typeError("Liquidity must be a valid number")
      .required("Liquidity is required")
      .test(
        "only-one-decimal-point",
        "Value must not contain more than one decimal point",
        function (value) {
          return (String(value).match(/\./g) || []).length <= 1;
        }
      )
      .min(51, "Liquidity must be at least 51%")
      .max(100, "Liquidity must be less than or equal to 100%")
      .when([], {
        is: () =>
          stepData?.listingOptions !==
          "Manual Listing (Recommended for Seed/Private Sale)",
        then: (schema) => schema.required("Liquidity is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    listingRate: Yup.number().when([], {
      is: () =>
        stepData?.listingOptions !==
        "Manual Listing (Recommended for Seed/Private Sale)",
      then: (schema) =>
        schema
          .required("Listing rate is required")
          .positive("Listing rate must be positive"),
      otherwise: (schema) => schema.notRequired(),
    }),
    startTime: Yup.date()
      .typeError("Start time is required")
      .required("Start time is required"),

    endTime: Yup.date()
      .typeError("End time is required")
      .required("End time is required")
      .test(
        "is-after-start",
        "End time must be after start time",
        function (value) {
          const { startTime } = this.parent;
          return (
            value &&
            startTime &&
            new Date(value).getTime() > new Date(startTime).getTime()
          );
        }
      ),
    liquidityLockup: Yup.number().when([], {
      is: () =>
        stepData?.listingOptions !==
        "Manual Listing (Recommended for Seed/Private Sale)",
      then: (schema) =>
        schema
          .required("Liquidity lockup is required")
          .positive("Liquidity lockup must be positive")
          .min(11, "Liquidity lockup must be more than 10")
          .integer("Liquidity lockup must be a whole number"),
      otherwise: (schema) => schema.notRequired(),
    }),

    tgeDate: Yup.date().when("usingVesting", {
      is: true,
      then: Yup.date().required("TGE date is required"),
    }),
    tgePercent: Yup.number().when("usingVesting", {
      is: true,
      then: Yup.number().required("TGE percent is required").positive(),
    }),
    cycle: Yup.string().when("usingVesting", {
      is: true,
      then: Yup.string().required("Cycle is required"),
    }),
    cyReleasePer: Yup.number().when("usingVesting", {
      is: true,
      then: Yup.number()
        .required("Cycle release percent is required")
        .positive(),
    }),
  });
  const formik = useFormik({
    initialValues: {
      presaleRate: stepData.presaleRate || "",
      whitelistEnabled: stepData.whitelistEnabled || false,
      softcap: stepData.softcap || "",
      hardcap: stepData.hardcap || "",
      minBuy: stepData.minBuy || "",
      maxBuy: stepData.maxBuy || "",
      refundType: stepData.refundType || "Burn",
      router: stepData.router || "---Select Router Exchange---",
      liquidity: stepData.liquidity || "",
      listingRate: stepData.listingRate || "",
      startTime: stepData.startTime || null,
      endTime: stepData.endTime || null,
      liquidityLockup: stepData.liquidityLockup || "",
      usingVesting: stepData.usingVesting || false,
      tgeDate: stepData.tgeDate || "",
      tgePercent: "",
      cycle: "",
      cyReleasePer: "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    context: {
      stepData: { ...stepData, tokenBalance: stepData?.tokenBalance || 0 },
    },
    onSubmit: () => handleNextClick(),
  });

  const handleNextClick = () => {
    console.log(
      "tokenAmount",
      Number(tokenAmount),
      Number(stepData.tokenBalance)
    );

    if (Number(tokenAmount) >= Number(stepData.tokenBalance)) {
      toast.error(
        "Token amount must be less than your available token balance."
      );
      return;
    }

    const newStepData = {
      presaleRate,
      whitelistEnabled,
      softcap,
      hardcap,
      minBuy,
      maxBuy,
      refundType,
      router,
      liquidity,
      listingRate,
      startTime,
      endTime,
      liquidityLockup,
      usingVesting,
      lockupUnit,
      tokenAmount,
    };

    setStepData((prev) => ({
      ...prev,
      ...newStepData,
    }));

    handleNext(newStepData);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const result = await getNetworkConfig();
      setConfig(result?.routerNames);
      setFactoryAdd(result?.addresses?.LAUNCHPADCONTRACTADDRESSFACTORY);
      console.log("result", result?.routerNames);
    };

    fetchConfig();
  }, []);
  useEffect(() => {
    const fetchStatus = async () => {
      const poolStatus = await fetchTokenStatus(stepData?.tokenAddress);
      console.log("poolStatus", poolStatus);
      setPoolStatus(poolStatus);
    };

    fetchStatus();
  }, [stepData?.tokenAddress]);
  useEffect(() => {
    if (listingRate || presaleRate || hardcap || liquidity) {
      console.log(
        "Types:",
        typeof listingRate,
        typeof presaleRate,
        typeof hardcap,
        typeof liquidity
      );
      const hardcapNum = Number(hardcap);
      const presaleRateNum = Number(presaleRate);
      const listingRateNum = Number(listingRate);
      const liquidityPercent = Number(liquidity);
      const presaleToken = hardcapNum * presaleRateNum;
      console.log(
        "skfheogh345",
        hardcapNum,
        presaleRateNum,
        listingRateNum,
        liquidityPercent
      );
      if (
        hardcapNum > 0 &&
        presaleRateNum > 0 &&
        listingRateNum > 0 &&
        liquidityPercent > 0
      ) {
        const liquidityEth = (hardcapNum * liquidityPercent) / 100;
        const liquidityToken = liquidityEth * listingRateNum;
        const totalTokenAmount = presaleToken + liquidityToken;
        setTokenAmount(totalTokenAmount);
      } else {
        setTokenAmount(presaleToken);
      }
    }
  }, [listingRate, presaleRate, hardcap, liquidity]);

  // Reuse input style from theme
  const neonInputStyle = FairLaunchTheme.inputStyle;

  return (
    <Box
      className="flex flex-col gap-16"
      sx={(theme) => FairLaunchTheme.cardStyle(theme)}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <div>
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
                Presale Rate*
              </Typography>
              <TextField
                variant="outlined"
                onChange={(e) => {
                  setPresaleRate(e.target.value);
                  formik.handleChange(e);
                }}
                type="number"
                placeholder="Enter presale rate (e.g., 422)"
                value={formik.values.presaleRate}
                name="presaleRate"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.presaleRate &&
                  Boolean(formik.errors.presaleRate)
                }
                helperText={
                  formik.touched.presaleRate && formik.errors.presaleRate
                }
                sx={neonInputStyle}
                fullWidth
              />
              <Typography
                variant="body2"
                sx={(theme) => ({ mt: 1, color: theme.palette.primary.main })}
              >
                If the user spends 1 {stepData?.currency}, how many tokens will
                they receive?
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <div style={{ marginTop: "25px" }}>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1.5,
                })}
              >
                Whitelist
              </Typography>
              <Switch
                {...label}
                checked={whitelistEnabled}
                onChange={(e) => setWhitelistEnabled(e.target.checked)}
                sx={(theme) => ({
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: theme.palette.primary.main,
                  },
                })}
              />
              <Typography
                variant="body2"
                sx={(theme) => ({ color: theme.palette.text.secondary })}
              >
                You can Enable/Disable whitelist anytime
              </Typography>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1.5,
                })}
              >
                Softcap ({stepData?.currency})*
              </Typography>
              <TextField
                variant="outlined"
                onChange={(e) => {
                  setSoftcap(e.target.value);
                  formik.handleChange(e);
                }}
                type="number"
                placeholder="Enter softcap amount (e.g., 0.5 BNB)"
                value={formik.values.softcap}
                name="softcap"
                error={formik.touched.softcap && Boolean(formik.errors.softcap)}
                helperText={formik.touched.softcap && formik.errors.softcap}
                fullWidth
                sx={neonInputStyle}
              />
              <Typography
                variant="body2"
                sx={(theme) => ({ mt: 1, color: theme.palette.primary.main })}
              >
                Softcap must be {">"}= 25% of Hardcap!
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1.5,
                })}
              >
                Hardcap ({stepData?.currency})*
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter Hardcap Amount"
                value={formik.values.hardcap}
                onChange={(e) => {
                  setHardcap(e.target.value);
                  formik.handleChange(e);
                }}
                name="hardcap"
                error={formik.touched.hardcap && Boolean(formik.errors.hardcap)}
                helperText={formik.touched.hardcap && formik.errors.hardcap}
                fullWidth
                sx={neonInputStyle}
              />
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1.5,
                })}
              >
                Minimum Buy Amount ({stepData?.currency})*
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter Minimum Buy Amount"
                type="number"
                value={formik.values.minBuy}
                onChange={(e) => {
                  setMinBuy(e.target.value);
                  formik.handleChange(e);
                }}
                name="minBuy"
                error={formik.touched.minBuy && Boolean(formik.errors.minBuy)}
                helperText={formik.touched.minBuy && formik.errors.minBuy}
                fullWidth
                sx={neonInputStyle}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1.5,
                })}
              >
                Maximum Buy Amount ({stepData?.currency})*
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter Minimum Buy Amount"
                type="number"
                value={formik.values.maxBuy}
                onChange={(e) => {
                  setMaxBuy(e.target.value);
                  formik.handleChange(e);
                }}
                name="maxBuy"
                error={formik.touched.maxBuy && Boolean(formik.errors.maxBuy)}
                helperText={formik.touched.maxBuy && formik.errors.maxBuy}
                fullWidth
                sx={neonInputStyle}
              />
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1.5,
                })}
              >
                UnSold Token*
              </Typography>
              <FormControl fullWidth sx={neonInputStyle}>
                <Select
                  labelId="refund-select-label"
                  id="refund-select"
                  displayEmpty
                  onChange={(e) => {
                    setRefundType(e.target.value);
                    formik.handleChange(e);
                  }}
                  name="refundType"
                  value={formik.values.refundType}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.refundType &&
                    Boolean(formik.errors.refundType)
                  }
                  sx={(theme) => ({ color: theme.palette.text.primary })}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: (theme) => theme.palette.background.paper,
                        color: (theme) => theme.palette.text.primary,
                      },
                    },
                  }}
                >
                  <MenuItem value="Burn">Burn</MenuItem>
                  <MenuItem value="Refund">Refund</MenuItem>
                  {/* <MenuItem value="Token">Token</MenuItem> */}
                </Select>
                {formik.touched.refundType && formik.errors.refundType && (
                  <Typography color="error" variant="caption">
                    {formik.errors.refundType}
                  </Typography>
                )}
              </FormControl>
            </div>
          </Grid>
          {stepData?.listingOptions !==
            "Manual Listing (Recommended for Seed/Private Sale)" && (
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <div>
                <Typography
                  variant="h6"
                  sx={(theme) => ({
                    ...FairLaunchTheme.gradientText(theme),
                    mb: 1.5,
                  })}
                >
                  Router*
                </Typography>
                <FormControl fullWidth sx={neonInputStyle}>
                  <Select
                    labelId="router-select-label"
                    id="router-select"
                    displayEmpty
                    onChange={(e) => {
                      setRouter(e.target.value);
                      formik.handleChange(e);
                    }}
                    name="router"
                    value={formik.values.router}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.router && Boolean(formik.errors.router)
                    }
                    sx={(theme) => ({ color: theme.palette.text.primary })}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: (theme) => theme.palette.background.paper,
                          color: (theme) => theme.palette.text.primary,
                        },
                      },
                    }}
                  >
                    <MenuItem value="---Select Router Exchange---">
                      ---Select Router Exchange---
                    </MenuItem>
                    {config?.length > 0 &&
                      config.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    {/* <MenuItem value="Uniswap">Uniswap</MenuItem>
                <MenuItem value="SushiSwap">SushiSwap</MenuItem> */}
                  </Select>
                  {formik.touched.router && formik.errors.router && (
                    <Typography color="error" variant="caption">
                      {formik.errors.router}
                    </Typography>
                  )}
                </FormControl>
              </div>
            </Grid>
          )}
        </Grid>

        {stepData?.listingOptions !==
          "Manual Listing (Recommended for Seed/Private Sale)" && (
          <Grid container spacing={4} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <div>
                <Typography
                  variant="h6"
                  sx={(theme) => ({
                    ...FairLaunchTheme.gradientText(theme),
                    mb: 1.5,
                  })}
                >
                  Liquidity (%)*
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter liquidity percentage"
                  value={formik.values.liquidity}
                  onChange={(e) => {
                    setLiquidity(e.target.value);
                    formik.handleChange(e);
                  }}
                  type="number"
                  name="liquidity"
                  error={
                    formik.touched.liquidity && Boolean(formik.errors.liquidity)
                  }
                  helperText={
                    formik.touched.liquidity && formik.errors.liquidity
                  }
                  fullWidth
                  sx={neonInputStyle}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <div>
                <Typography
                  variant="h6"
                  sx={(theme) => ({
                    ...FairLaunchTheme.gradientText(theme),
                    mb: 1.5,
                  })}
                >
                  Listing Rate*
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter Listing Rate"
                  type="number"
                  value={formik.values.listingRate}
                  onChange={(e) => {
                    setListingRate(e.target.value);
                    formik.handleChange(e);
                  }}
                  name="listingRate"
                  error={
                    formik.touched.listingRate &&
                    Boolean(formik.errors.listingRate)
                  }
                  helperText={
                    formik.touched.listingRate && formik.errors.listingRate
                  }
                  fullWidth
                  sx={neonInputStyle}
                />
                <Typography
                  variant="body2"
                  sx={(theme) => ({ mt: 1, color: theme.palette.primary.main })}
                >
                  If a user spends 1 {stepData?.currency}, how many tokens will
                  they receive? 1 {stepData?.currency} = 8000
                </Typography>
              </div>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              sx={(theme) => ({ color: theme.palette.info.main })}
            >
              Enter the percentage of raised funds to allocate to liquidity on
              DEX (Min 51%, Max 100%). If I spend 1 {stepData?.currency} on DEX,
              how many tokens will I receive?
            </Typography>
          </Grid>
        </Grid>

        <Typography
          variant="h6"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            mt: 4,
            mb: 2,
          })}
        >
          Select start time & end time (UTC)
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Start Time (UTC)*
            </Typography>
            <CustomDatePicker
              value={formik.values.startTime}
              onChange={(val) => {
                setStartTime(val);
                formik.setFieldValue("startTime", val);
              }}
              onBlur={() => formik.setFieldTouched("startTime", true)}
              sx={neonInputStyle}
            />
            {formik.touched.startTime && formik.errors.startTime && (
              <Typography color="error" variant="caption">
                {formik.errors.startTime}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              End Time (UTC)*
            </Typography>
            <CustomDatePicker
              value={formik.values.endTime}
              onChange={(val) => {
                setEndTime(val);
                formik.setFieldValue("endTime", val);
              }}
              onBlur={() => formik.setFieldTouched("endTime", true)}
              sx={neonInputStyle}
            />
            {formik.touched.endTime && formik.errors.endTime && (
              <Typography color="error" variant="caption">
                {formik.errors.endTime}
              </Typography>
            )}
          </Grid>
        </Grid>

        {stepData?.listingOptions !==
          "Manual Listing (Recommended for Seed/Private Sale)" && (
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1.5,
                })}
              >
                Liquidity Lockup ({lockupUnit}s)*
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter Liquidity lockup period"
                type="number"
                value={formik.values.liquidityLockup}
                onChange={(e) => {
                  setLiquidityLockup(e.target.value);
                  formik.handleChange(e);
                }}
                name="liquidityLockup"
                error={
                  formik.touched.liquidityLockup &&
                  Boolean(formik.errors.liquidityLockup)
                }
                helperText={
                  formik.touched.liquidityLockup &&
                  formik.errors.liquidityLockup
                }
                sx={neonInputStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={lockupUnit}
                        onChange={(e) => setLockupUnit(e.target.value)}
                        displayEmpty
                        variant="standard"
                        disableUnderline
                        sx={(theme) => ({
                          ml: 1,
                          color: theme.palette.text.primary,
                        })}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: (theme) =>
                                theme.palette.background.paper,
                              color: (theme) => theme.palette.text.primary,
                            },
                          },
                        }}
                      >
                        <MenuItem value="Minute">Minutes</MenuItem>
                        <MenuItem value="Hours">Hours</MenuItem>
                        <MenuItem value="Day">Days</MenuItem>
                        <MenuItem value="Week">Weeks</MenuItem>
                        <MenuItem value="Month">Months</MenuItem>
                        <MenuItem value="Quarter">Quarters</MenuItem>
                        <MenuItem value="Year">Years</MenuItem>
                      </Select>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        )}

        {/* Important Notes and Warnings */}
        <Box className="flex flex-col gap-8" sx={{ pt: 4 }}>
          <Box
            sx={(theme) => ({
              borderRadius: "16px",
              background:
                theme.palette.mode === "light"
                  ? theme.palette.primary.light
                  : "rgba(0, 255, 255, 0.05)",
              border: `1px solid ${theme.palette.divider}`,
              backdropFilter: "blur(10px)",
              p: { xs: 2.5, sm: 3 },
              // boxShadow removed as per user request
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: theme.palette.primary.main,
              },
            })}
          >
            <Box
              sx={{ display: "flex", gap: 1.5, mb: 1.5, alignItems: "center" }}
            >
              <Typography sx={{ fontSize: "1.4rem" }}>📌</Typography>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                })}
              >
                Important Notes:
              </Typography>
            </Box>
            <List sx={{ listStyleType: "decimal", pl: 3 }}>
              <ListItem
                sx={(theme) => ({
                  display: "list-item",
                  color: theme.palette.text.secondary,
                })}
              >
                Trend creation is currently unavailable via Ledger devices. If
                you connected using Ledger, please disconnect your Ledger wallet
                and reconnect using a supported wallet method.
              </ListItem>
              <ListItem
                sx={(theme) => ({
                  display: "list-item",
                  color: theme.palette.text.secondary,
                })}
              >
                {stepData?.listingOptions ===
                "Manual Listing (Recommended for Seed/Private Sale)"
                  ? "For manual listing, Trendpad won't charge tokens for liquidity. You may withdraw ETH after the pool ends then do DEX listing yourself."
                  : "For auto listing, after you finalize the pool your token will be auto listed on DEX."}
              </ListItem>
              {Number(tokenAmount) > 0 &&
                Number(stepData?.tokenBalance) >= 0 && (
                  <ListItem
                    sx={(theme) => ({
                      display: "list-item",
                      color: theme.palette.text.secondary,
                    })}
                  >
                    {Number(tokenAmount) > Number(stepData.tokenBalance) ? (
                      "Not enough balance in your wallet."
                    ) : (
                      <>
                        You need{" "}
                        <strong style={{ color: "#00FFFF" }}>
                          {Number(tokenAmount).toLocaleString()}{" "}
                          {stepData.tokenSymbol}
                        </strong>{" "}
                        to create launchpad. (Your balance:{" "}
                        <strong style={{ color: "#00FFFF" }}>
                          {Number(stepData.tokenBalance).toLocaleString()}{" "}
                          {stepData.tokenSymbol}
                        </strong>
                        ).
                      </>
                    )}
                  </ListItem>
                )}
            </List>
          </Box>
          {poolStatus?.status === true && (
            <Box
              sx={(theme) => ({
                background: "rgba(255, 68, 68, 0.1)",
                border: "1px solid #FF4444",
                borderRadius: "16px",
                p: 3,
              })}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#FF4444",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                  fontWeight: 600,
                }}
              >
                ⛔ Pool Already Exists
              </Typography>
              <Typography
                variant="body1"
                sx={(theme) => ({ color: theme.palette.text.primary })}
              >
                A pool with this token already exists.{" "}
                <strong
                  onClick={async () => {
                    try {
                      await chainSwitchNetwork(poolStatus?.ChainId);
                      const path =
                        poolStatus?.Sale_type === "Fairlaunch"
                          ? `/FairLaunchpad/View/${poolStatus.pool_id}`
                          : `/Launchpad/View/${poolStatus.pool_id}`;
                      const fullPath = `${path}?id=${poolStatus.pool_id}`;
                      window.open(fullPath, "_blank");
                    } catch (error) {
                      console.error("Network switch failed:", error);
                    }
                  }}
                  style={{
                    color: "#00FFFF",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Click here
                </strong>{" "}
                to view. You can use another wallet to create a new launchpad.
              </Typography>
            </Box>
          )}

          <Box
            sx={(theme) => ({
              borderRadius: "16px",
              background:
                theme.palette.mode === "light"
                  ? theme.palette.secondary.light
                  : "rgba(168, 85, 247, 0.05)",
              border: `1px solid ${theme.palette.secondary.main}`,
              backdropFilter: "blur(10px)",
              p: { xs: 2.5, sm: 3 },
              marginTop: 4, // Added spacing
              // boxShadow removed as per user request
            })}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
                wordBreak: "break-word",
              }}
            >
              <Typography
                variant="body1"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  lineHeight: 1.6,
                })}
              >
                Please exclude{" "}
                <strong style={{ color: "#A855F7", wordBreak: "break-all" }}>
                  Trendpad Factory address {factoryAdd}
                </strong>{" "}
                from fees, rewards, and max transaction limits before creating
                pools.
              </Typography>
            </Box>
          </Box>
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
          <Button
            type="submit"
            variant="contained"
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              minWidth: "200px",
            })}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
export default DefiLaunchpadInfo;
