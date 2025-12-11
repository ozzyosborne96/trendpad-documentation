import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid,
  Checkbox,
  InputAdornment,
  Switch,
  List,
  ListItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomDatePicker from "../../Components/DatePicker";
import dayjs from "dayjs";
import {
  fairgetBuyBackDetailsHandler,
  getNetworkConfig,
  chainSwitchNetwork,
} from "../../ContractAction/ContractDependency";
import CustomTable from "../../Components/BuyBackTableData";
import { fetchFairTokenStatus } from "./ApiFairLaunchPadHandler";
import toast from "react-hot-toast";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const buyBackColumns = [
  { key: "buyBackAmount", label: "Buyback Amount" },
  { key: "Minimundelay", label: "Minimum Delay" },
  { key: "Maximundelay", label: "Maximum Delay" },
];
import { FairLaunchTheme } from "./FairLaunchTheme";

const DefiFairLaunchInfo = ({
  handleNext,
  activeStep,
  steps,
  handleBack,
  stepData,
  setStepData,
}) => {
  console.log("stepDefiFairLaunchInfoData", stepData);
  const [config, setConfig] = useState(null);
  const [factoryAdd, setFactoryAdd] = useState();
  const [tokenAmount, setTokenAmount] = useState();
  const [poolStatus, setPoolStatus] = useState();
  const validationSchema = Yup.object({
    totalSellingAmount: Yup.number()
      .required("Required")
      .positive("Presale rate must be greater than 0")
      .test(
        "max-18-decimals",
        "Value must have at most 18 decimal places",
        function (value) {
          const str = this.originalValue?.toString() || "";
          const decimalPart = str.split(".")[1];
          return !decimalPart || decimalPart.length <= 18;
        }
      ),
    softCap: Yup.number().required("Required").positive(),
    router:
      stepData?.listingOption !==
      "Manual Listing (Recommended for Seed/Private Sale)"
        ? Yup.string()
            .notOneOf(["---Select Router---"], "Router is required")
            .required("Router is required")
        : Yup.string().notRequired(),
    liquidity: Yup.number()
      .typeError("Liquidity must be a number")
      .when("hawsBuyBack", (hawsBuyBack, schema) => {
        return hawsBuyBack
          ? schema
              .min(31, "Liquidity must be at least 31% when BuyBack is enabled")
              .max(99.99, "Liquidity must be less than 100%")
          : schema
              .min(
                51,
                "Liquidity must be at least 51% when BuyBack is disabled"
              )
              .max(99.99, "Liquidity must be less than 100%");
      })
      .when([], {
        is: () =>
          stepData?.listingOption !==
          "Manual Listing (Recommended for Seed/Private Sale)",
        then: (schema) => schema.required("Liquidity is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    buyBack: Yup.number().when("hawsBuyBack", {
      is: true,
      then: (schema) =>
        schema
          .required("BuyBack is required when BuyBack is enabled")
          .max(99.99, "Liquidity must be less than 100%")
          .integer("Only whole number values are allowed for BuyBack")
          .test(
            "total-liquidity-buyback",
            "Liquidity + BuyBack must be more than 51%",
            function (value) {
              const { liquidity } = this.parent;
              return (liquidity || 0) + (value || 0) > 51;
            }
          ),
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
        stepData?.listingOption !==
        "Manual Listing (Recommended for Seed/Private Sale)",
      then: (schema) =>
        schema
          .required("Liquidity lockup is required")
          .positive("Liquidity lockup must be positive")
          .min(11, "Liquidity lockup must be more than 10")
          .integer("Liquidity lockup must be a whole number"),
      otherwise: (schema) => schema.notRequired(),
    }),
    lockupUnit: Yup.string().required("Required"),
    hasMaxBuy: Yup.boolean(),
    hawsBuyBack: Yup.boolean(),
    whitelistEnabled: Yup.boolean(),
    // Optional conditional validation
    maxBuy: Yup.number()
      .typeError("Max Buy must be a number")
      .positive("Max Buy must be a positive number")
      .when("hasMaxBuy", {
        is: true,
        then: (schema) => schema.required("Max Buy is required when enabled"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });
  const formik = useFormik({
    initialValues: {
      totalSellingAmount: stepData?.totalSellingAmount || "",
      softCap: stepData?.softCap || "",
      router: stepData?.router,
      liquidity: stepData?.liquidity || "",
      startTime: stepData?.startTime || null,
      endTime: stepData?.endTime || null,
      liquidityLockup: stepData?.liquidityLockup || "",
      lockupUnit: stepData?.lockupUnit || "Minute",
      hasMaxBuy: stepData?.hasMaxBuy || false,
      maxBuy: stepData?.maxBuy || "",
      hawsBuyBack: stepData?.hawsBuyBack || false,
      buyBack: stepData?.buyBack || "",
      whitelistEnabled: false,
    },
    validationSchema,
    onSubmit: (values) => {
      handleNextClick(values);
    },
  });
  console.log("formik.errors", formik.errors);
  const handleNextClick = (values) => {
    if (Number(tokenAmount) >= Number(stepData.tokenBalance)) {
      toast.error(
        "Token amount must be less than your available token balance."
      );
      return;
    }
    const newStepData = {
      totalSellingAmount: values?.totalSellingAmount,
      softCap: values?.softCap,
      router: values?.router || "---Select Router---",
      liquidity: values?.liquidity,
      startTime: values?.startTime,
      endTime: values?.endTime,
      liquidityLockup: values?.liquidityLockup,
      lockupUnit: values?.lockupUnit,
      hasMaxBuy: values?.hasMaxBuy || false,
      maxBuy: values?.maxBuy || "",
      hawsBuyBack: values?.hawsBuyBack || false,
      buyBack: values?.buyBack || "",
      whitelistEnabled: values?.whitelistEnabled,
      tokenAmount: tokenAmount,
    };

    setStepData((prev) => ({
      ...prev,
      ...newStepData,
    }));
    handleNext(newStepData);
  };
  console.log("hawsBuyBack", formik.values.router);
  useEffect(() => {
    const fetchConfig = async () => {
      const result = await getNetworkConfig();
      setConfig(result?.routerNames);
      setFactoryAdd(result?.addresses?.FAIRLAUNCHFACTORYDDRESS);
      console.log("result", result?.routerNames);
    };

    fetchConfig();
  }, []);
  useEffect(() => {
    const fetchStatus = async () => {
      const poolStatus = await fetchFairTokenStatus(stepData?.tokenAddress);
      console.log("poolStatus", poolStatus);
      setPoolStatus(poolStatus);
    };

    fetchStatus();
  }, [stepData?.tokenAddress]);
  useEffect(() => {
    console.log(
      "Types:",
      formik.values.totalSellingAmount,
      formik.values.liquidity
    );
    const presaleToken = Number(formik.values.totalSellingAmount);
    if (formik.values.liquidity !== "") {
      const liquidityPercent = Number(formik.values.liquidity);
      let totalTokenAmount;
      if (liquidityPercent > 0) {
        const platformFeePercent = 3;
        const ethAfterFee = 1 - platformFeePercent / 100; // 0.97

        const ethAmount = (ethAfterFee * liquidityPercent) / 100;
        const tokenForLiquidity = ethAmount * presaleToken;
        totalTokenAmount = tokenForLiquidity + presaleToken;
        setTokenAmount(totalTokenAmount);
      }
    } else {
      setTokenAmount(presaleToken);
    }
  }, [formik.values.liquidity, formik.values.totalSellingAmount]);
  console.log("tokenAmount", tokenAmount);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        className="flex flex-col gap-16"
        sx={(theme) => FairLaunchTheme.cardStyle(theme)}
      >
        <div className="flex items-center justify-between">
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.text.secondary }}
          >
            (*) is required field
          </Typography>
          {/* <Button variant="contained">Create Token</Button> */}
        </div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1,
              })}
            >
              Total selling amount*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              name="totalSellingAmount"
              type="number"
              value={formik.values.totalSellingAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ex: 422"
              sx={(theme) => FairLaunchTheme.inputStyle(theme)}
              error={
                formik.touched.totalSellingAmount &&
                Boolean(formik.errors.totalSellingAmount)
              }
              helperText={
                formik.touched.totalSellingAmount &&
                formik.errors.totalSellingAmount
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <div style={{ marginTop: "25px" }}>
              <Typography
                variant="h6"
                sx={{ color: (theme) => theme.palette.text.primary }}
              >
                Whitelist
              </Typography>
              <Switch
                checked={formik.values.whitelistEnabled}
                onChange={(e) =>
                  formik.setFieldValue("whitelistEnabled", e.target.checked)
                }
                name="whitelistEnabled"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? theme.palette.primary.main
                        : "#00FFFF",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#0072FF",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.primary.main
                      : FairLaunchTheme.colors.accentCyan,
                }}
              >
                You can Enable/Disable whitelist anytime
              </Typography>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1,
              })}
            >
              Softcap ({stepData?.currency})*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              name="softCap"
              // type="number"
              value={formik.values.softCap}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter softcap amount (e.g., 0.5 BNB)"
              sx={(theme) => FairLaunchTheme.inputStyle(theme)}
              error={formik.touched.softCap && Boolean(formik.errors.softCap)}
              helperText={formik.touched.softCap && formik.errors.softCap}
            />
            <div
              className="flex items-center gap-2"
              style={{ marginTop: "10px" }}
            >
              <Checkbox
                name="hasMaxBuy"
                checked={formik.values.hasMaxBuy}
                onChange={(e) =>
                  formik.setFieldValue("hasMaxBuy", e.target.checked)
                }
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
              <Typography
                variant="body1"
                sx={{ color: (theme) => theme.palette.text.primary }}
              >
                Setting max Contributor?
              </Typography>
            </div>

            {formik.values.hasMaxBuy && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mt: 2, color: (theme) => theme.palette.text.primary }}
                >
                  Max Buy ({stepData?.currency})
                </Typography>
                <TextField
                  fullWidth
                  name="maxBuy"
                  value={formik.values.maxBuy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={(theme) => FairLaunchTheme.inputStyle(theme)}
                  error={formik.touched.maxBuy && Boolean(formik.errors.maxBuy)}
                  helperText={formik.touched.maxBuy && formik.errors.maxBuy}
                />
              </>
            )}
          </Grid>

          {stepData?.listingOption !==
            "Manual Listing (Recommended for Seed/Private Sale)" && (
            <>
              {" "}
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Typography
                  variant="h6"
                  sx={(theme) => ({
                    ...FairLaunchTheme.gradientText(theme),
                    mb: 1,
                  })}
                >
                  Router*
                </Typography>
                <FormControl
                  fullWidth
                  error={formik.touched.router && Boolean(formik.errors.router)}
                >
                  <Select
                    displayEmpty
                    name="router"
                    value={formik.values.router}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={(theme) => FairLaunchTheme.inputStyle(theme)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.background.paper
                              : FairLaunchTheme.colors.cardBg,
                          color: (theme) => theme.palette.text.primary,
                          border: (theme) =>
                            theme.palette.mode === "light"
                              ? "1px solid " + theme.palette.divider
                              : "1px solid rgba(0,255,255,0.2)",
                        },
                      },
                    }}
                  >
                    <MenuItem value="---Select Router---">
                      <em>---Select Router---</em>
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
                    <Typography sx={{ color: "red" }}>
                      {formik.errors.router}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    name="hawsBuyBack"
                    checked={formik.values.hawsBuyBack}
                    onChange={(e) =>
                      formik.setFieldValue("hawsBuyBack", e.target.checked)
                    }
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
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "light"
                          ? theme.palette.primary.main
                          : "#00FFFF",
                    }}
                  >
                    Enable Buy Back ?{" "}
                  </Typography>
                </div>

                {formik.values.hawsBuyBack && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 1,
                        color: (theme) => theme.palette.text.primary,
                      }}
                    >
                      Buy Back %
                    </Typography>
                    <TextField
                      fullWidth
                      name="buyBack"
                      value={formik.values.buyBack}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={(theme) => FairLaunchTheme.inputStyle(theme)}
                      error={
                        formik.touched.buyBack && Boolean(formik.errors.buyBack)
                      }
                      helperText={
                        formik.touched.buyBack && formik.errors.buyBack
                      }
                    />
                  </>
                )}
                {formik.values.hawsBuyBack && (
                  <CustomTable
                    title="Buyback Details"
                    fetchData={() =>
                      fairgetBuyBackDetailsHandler(stepData?.currency)
                    }
                    columns={buyBackColumns}
                  />
                )}
              </Grid>
            </>
          )}
        </Grid>

        {stepData?.listingOption !==
          "Manual Listing (Recommended for Seed/Private Sale)" && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Typography
                variant="h6"
                sx={{ ...FairLaunchTheme.gradientText, mb: 1 }}
              >
                Liquidity (%)*
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="liquidity"
                value={formik.values.liquidity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0"
                sx={(theme) => FairLaunchTheme.inputStyle(theme)}
                error={
                  formik.touched.liquidity && Boolean(formik.errors.liquidity)
                }
                helperText={formik.touched.liquidity && formik.errors.liquidity}
              />
              {/* <div className="flex items-center gap-2">
                  <Checkbox {...label} />
                  <Typography variant="h6" className="commom-gradiant">
                    Using vesting Contributor?
                  </Typography>
                </div> */}
            </Grid>
          </Grid>
        )}

        <Typography
          variant="h6"
          sx={{ color: (theme) => theme.palette.text.primary, mt: 2 }}
        >
          Select start time & end time (UTC)
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1,
              })}
            >
              Start time (UTC)*
            </Typography>
            <FormControl
              fullWidth
              error={
                formik.touched.startTime && Boolean(formik.errors.startTime)
              }
            >
              <CustomDatePicker
                value={formik.values.startTime || null}
                onChange={(date) =>
                  formik.setFieldValue("startTime", dayjs(date))
                }
                onBlur={() => formik.setFieldTouched("startTime", true)}
              />
              <Typography sx={{ color: "red" }}>
                {formik.touched.startTime && formik.errors.startTime}
              </Typography>
            </FormControl>

            {/* <div className="flex items-center gap-2">
              <Checkbox {...label} />
              <Typography variant="h6" className="commom-gradiant">
                The duration between start date and end date must be less than 7
                days.
              </Typography>
            </div> */}
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1,
              })}
            >
              End time (UTC)*
            </Typography>
            <FormControl
              fullWidth
              error={formik.touched.endTime && Boolean(formik.errors.endTime)}
            >
              <CustomDatePicker
                value={formik.values.endTime || null}
                onChange={(date) =>
                  formik.setFieldValue("endTime", dayjs(date))
                }
                onBlur={() => formik.setFieldTouched("endTime", true)}
              />
              <Typography sx={{ color: "red" }}>
                {formik.touched.endTime && formik.errors.endTime}
              </Typography>
            </FormControl>
          </Grid>
        </Grid>

        {stepData?.listingOption !==
          "Manual Listing (Recommended for Seed/Private Sale)" && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  ...FairLaunchTheme.gradientText(theme),
                  mb: 1,
                })}
              >
                Liquidity Lockup ({formik.values.lockupUnit}s)*
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                name="liquidityLockup"
                value={formik.values.liquidityLockup}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Liquidity lockup period"
                sx={(theme) => FairLaunchTheme.inputStyle(theme)}
                error={
                  formik.touched.liquidityLockup &&
                  Boolean(formik.errors.liquidityLockup)
                }
                helperText={
                  formik.touched.liquidityLockup &&
                  formik.errors.liquidityLockup
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        name="lockupUnit"
                        value={formik.values.lockupUnit}
                        onChange={(e) =>
                          formik.setFieldValue("lockupUnit", e.target.value)
                        }
                        onBlur={() =>
                          formik.setFieldTouched("lockupUnit", true)
                        }
                        displayEmpty
                        variant="standard"
                        disableUnderline
                        sx={{
                          ml: 1,
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.primary.main
                              : "#00FFFF",
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: (theme) =>
                                theme.palette.mode === "light"
                                  ? theme.palette.background.paper
                                  : FairLaunchTheme.colors.cardBg,
                              color: (theme) => theme.palette.text.primary,
                              border: (theme) =>
                                theme.palette.mode === "light"
                                  ? "1px solid " + theme.palette.divider
                                  : "1px solid rgba(0,255,255,0.2)",
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Unit</em>
                        </MenuItem>
                        <MenuItem value="Minute">Minute</MenuItem>
                        <MenuItem value="Hours">Hours</MenuItem>
                        <MenuItem value="Day">Day</MenuItem>
                        <MenuItem value="Week">Week</MenuItem>
                        <MenuItem value="Month">Month</MenuItem>
                        <MenuItem value="Quarter">Quarter</MenuItem>
                        <MenuItem value="Year">Year</MenuItem>
                      </Select>
                    </InputAdornment>
                  ),
                }}
              />

              {/* <Typography variant="h6" className="commom-gradiant">
                  Pool creation fee is 0.001 {stepData?.currency}
                </Typography> */}
            </Grid>
          </Grid>
        )}

        {/* <div
          className="flex justify-center items-center"
          style={{ marginTop: "30px" }}
        >
          <Typography variant="h6" className="commom-gradiant">
            Need 1,387,300 DFD to create launchpad.
          </Typography>
        </div> */}
        <Box className="flex flex-col gap-8" sx={{ pt: 2 }}>
          <Box
            sx={(theme) => ({
              ...FairLaunchTheme.cardStyle(theme),
              boxShadow: "none",
            })}
          >
            <Box
              sx={{ display: "flex", gap: 1.5, mb: 1.5, alignItems: "center" }}
            >
              <Typography sx={{ fontSize: "1.4rem" }}>📌</Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                Important Notes:
              </Typography>
            </Box>
            <List sx={{ listStyleType: "decimal", pl: 3 }}>
              <ListItem
                sx={{
                  display: "list-item",
                  color: (theme) => theme.palette.text.secondary,
                }}
              >
                Trend creation is currently unavailable via Ledger devices. If
                you connected using Ledger, please disconnect your Ledger wallet
                and reconnect using a supported wallet method.
              </ListItem>
              <ListItem
                sx={{
                  display: "list-item",
                  color: (theme) => theme.palette.text.secondary,
                }}
              >
                {stepData?.listingOption ===
                "Manual Listing (Recommended for Seed/Private Sale)"
                  ? "For manual listing, Trendpad won't charge tokens for liquidity. You may withdraw ETH after the pool ends then do DEX listing yourself."
                  : "After you finalize the pool, your token will be automatically listed on the DEX."}
              </ListItem>
              {Number(tokenAmount) > 0 &&
                Number(stepData?.tokenBalance) >= 0 && (
                  <ListItem
                    sx={{
                      display: "list-item",
                      color: (theme) => theme.palette.text.secondary,
                    }}
                  >
                    {Number(tokenAmount) > Number(stepData.tokenBalance) ? (
                      "Not enough balance in your wallet."
                    ) : (
                      <>
                        You need{" "}
                        <strong style={{ color: "#2196f3" }}>
                          {Number(tokenAmount).toLocaleString()}{" "}
                          {stepData.tokenSymbol}
                        </strong>{" "}
                        to create launchpad. (Your balance:{" "}
                        <strong style={{ color: "#2196f3" }}>
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
            <Box sx={(theme) => FairLaunchTheme.warningBox(theme)}>
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
                sx={{ color: (theme) => theme.palette.text.primary }}
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
                    color: "#00FFFF", // Changed to Cyan to match theme accent
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
              ...FairLaunchTheme.cardStyle(theme),
              boxShadow: "none",
              marginTop: 5,
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
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  lineHeight: 1.6,
                }}
              >
                Please exclude{" "}
                <strong style={{ color: "#2196f3", wordBreak: "break-all" }}>
                  Trendpad Factory address {factoryAdd}
                </strong>{" "}
                from fees, rewards, and max transaction limits before creating
                pools.
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="flex items-center justify-center gap-2" sx={{ pt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              width: "300px",
              borderColor: "#555",
              color: "#BBB",
              "&:hover": {
                borderColor: "#FFF",
                color: "#FFF",
              },
            })}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              width: "300px",
            })}
          >
            Next
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default DefiFairLaunchInfo;
