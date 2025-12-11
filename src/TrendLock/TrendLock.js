import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  Grid,
  Tooltip,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";
import { React, useEffect, useState } from "react";
import Disclaimer from "../Components/Disclaimer";
import useGetTokenDetails from "../Hooks/GetTokenDetails";
import { lockToken } from "../ContractAction/TrendLockAction";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import CustomDatePicker from "../Components/DatePicker";
import {
  checkAllowance,
  approveToken,
  vestingLock,
} from "../ContractAction/TrendLockAction";
import {
  getChainInfo,
  getNetworkConfig,
} from "../ContractAction/ContractDependency";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isLpToken } from "../ContractAction/DexContractActionData";
import CustomTokenTable from "../Components/CustomTokenTable";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  tokenAddress: Yup.string()
    .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid token address")
    .required("Token address is required"),
  description: Yup.string()
    .required("Title is required")
    .max(100, "Title must be at most 100 characters")
    .test(
      "valid-description",
      "Title must be at least 3 non-space characters",
      (value) => {
        if (!value) return false;
        const trimmed = value.trim();
        return trimmed.length >= 3;
      }
    ),
  amount: Yup.number()
    .typeError("Invalid Amount")
    .positive("Amount must be greater than zero")
    .required("Amount is required")
    .test(
      "max-decimals",
      "Amount can have up to 2 decimal places",
      (value) =>
        value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  tgePercent: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const trimmed = originalValue.trim().replace(/^0+(?=\d)/, ""); // remove leading zeros
        return Number(trimmed);
      }
      return value;
    })
    .nullable()
    .when("useVesting", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "TGE Percent must be greater than 0")
          .max(100, "TGE Percent cannot be greater than 100")
          .test(
            "max-2-decimals",
            "TGE Percent can have up to 2 decimal places",
            (value) =>
              value === undefined || /^\d+(\.\d{1,2})?$/.test(String(value))
          )
          .required("TGE Release Percent is required"),
    }),

  cycle: Yup.number()
    .nullable()
    .when("useVesting", {
      is: true,
      then: (schema) =>
        schema
          .typeError(" Unlock Schedule must be a number")
          .positive(" Unlock Schedule must be greater than zero")
          .max(100, " Unlock Schedule cannot be greater than 100")
          .required(" Unlock Schedule is required"),
    }),
  cyReleasePer: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const trimmed = originalValue.trim();
        return trimmed === "" ? null : Number(trimmed);
      }
      return value;
    })
    .nullable()
    .when("useVesting", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "TGE Percent must be greater than 0")
          .max(100, "TGE Percent cannot be greater than 100")
          .required("Unlock Rate Percentage is required"),
    }),

  ownerAddress: Yup.string().when("useAnotherOwner", {
    is: true,
    then: (schema) =>
      schema
        .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid address")
        .required("Owner address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const TrendLock = () => {
  const navigate = useNavigate();
  const [showTextField, setShowTextField] = useState(false);
  const [showLavestingCheckBox, setShowLavestingCheckBox] = useState();
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDetails, setTokenDetails] = useState();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState();
  const [lockUntil, setLockUntil] = useState();
  const [tokenAllowance, setTokenAllowance] = useState();
  const [loading, setLoading] = useState(false);
  const [tgeDate, setTgeDate] = useState();
  const [tgePercent, setTgePercent] = useState();
  const [cycle, setCycle] = useState();
  const [cyReleasePer, setCyReleasePer] = useState();
  const [isTokenLp, setIsTokenLp] = useState(false);
  const account = useCurrentAccountAddress();
  const [zone, setZone] = useState("Minute");
  const [antowner, setAntowner] = useState("");
  const [chainId, setChainId] = useState();
  const [lockUpAddress, setLockUpAddress] = useState();
  const handleChange = (event) => {
    setZone(event.target.value);
  };
  const fetchTokenDetails = useGetTokenDetails(); // Get the function, not data
  useEffect(() => {
    if (tokenAddress) {
      setLoading(true);
      fetchTokenDetails(tokenAddress).then(setTokenDetails);
    } else {
      setTokenDetails(null);
      setLoading(false);
    }
    setLoading(false);
  }, [tokenAddress]);
  useEffect(() => {
    const fetchData = async () => {
      if (amount && tokenAddress) {
        setLoading(true);
        // const balance = await getEthBalance(account);
        // if (amount > tokenDetails?.balance) {
        //   toast.error("Amount exceeds the balance");
        //   setLoading(false); // Ensure loading is stopped on error
        //   return;
        // }
        checkAllowance(tokenAddress, amount)
          .then(setTokenAllowance)
          .finally(() => setLoading(false));
      }
    };

    fetchData();
  }, [amount, tokenAddress]);

  const handleCheckboxChange = (event) => {
    setShowTextField(event.target.checked);
  };
  const handleCheckboxChange1 = (event) => {
    setShowLavestingCheckBox(event.target.checked);
  };
  const handleLock = async () => {
    setLoading(true);
    let cycletrans;
    if (zone === "Minute") {
      cycletrans = cycle * 60;
    } else if (zone === "Hours") {
      cycletrans = cycle * 60 * 60;
    } else if (zone === "Day") {
      cycletrans = cycle * 60 * 60 * 24;
    } else if (zone === "Week") {
      cycletrans = cycle * 60 * 60 * 24 * 7;
    } else if (zone === "Month") {
      cycletrans = cycle * 60 * 60 * 24 * 30;
    } else if (zone === "Year") {
      cycletrans = cycle * 60 * 60 * 24 * 30 * 12;
    } else if (zone === "Quarter") {
      cycletrans = cycle * 60 * 60 * 24 * 30 * 3;
    }

    try {
      // const balance = await getEthBalance(account);
      // if (amount > tokenDetails?.balance) {
      //   toast.error("Amount exceeds the balance");
      //   setLoading(false); // Ensure loading is stopped on error
      //   return;
      // }
      let acc = showTextField ? antowner : account;
      if (!tokenAllowance) {
        const txHash = await approveToken(tokenAddress, amount);
        const updatedAllowance = await checkAllowance(tokenAddress, amount);
        setTokenAllowance(updatedAllowance);
        if (txHash) {
          toast("Approved!", {
            icon: "✅",
          });
        }
      } else {
        if (showLavestingCheckBox) {
          const { txHash, lockId } = await vestingLock(
            acc,
            tokenAddress,
            isTokenLp,
            amount,
            tgeDate,
            tgePercent,
            cycletrans,
            cyReleasePer,
            description
          );
          const updatedAllowance = await checkAllowance(tokenAddress, amount);
          setTokenAllowance(updatedAllowance);
          if (txHash) {
            toast("Locked!", {
              icon: "✅",
            });
            navigate("/trendlock/timer-lock-lp", {
              state: {
                data: tokenAddress,
                isTokenLp: isTokenLp,
                lockId: lockId,
              },
            });
          }
        } else {
          const { txHash, lockId } = await lockToken(
            tokenAddress,
            acc,
            isTokenLp,
            amount,
            lockUntil,
            description
          );
          const updatedAllowance = await checkAllowance(tokenAddress, amount);
          setTokenAllowance(updatedAllowance);
          if (txHash) {
            toast("Locked!", {
              icon: "✅",
            });
            navigate("/trendlock/timer-lock-lp", {
              state: {
                data: tokenAddress,
                isTokenLp: isTokenLp,
                lockId: lockId,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function isLpFun() {
      const isLp = await isLpToken(tokenAddress);
      setIsTokenLp(isLp);
    }
    isLpFun();
  }, [tokenAddress]);
  const formik = useFormik({
    initialValues: {
      tokenAddress: "",
      ownerAddress: "",
      description: "",
      amount: "",
      tgePercent: "",
      cycle: "",
      cyReleasePer: "",
      useVesting: false,
      useAnotherOwner: false,
    },
    validationSchema,
    onSubmit: handleLock, // this ensures you can also handle form submit via Formik
  });
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
    const fetchLockAddress = async () => {
      const { addresses } = await getNetworkConfig();
      console.log("tokenDetails?.balance", addresses?.LockTokenContractAddress);
      setLockUpAddress(addresses?.LockTokenContractAddress);
    };
    if (chainId) {
      fetchLockAddress();
    }
  }, [chainId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Container sx={{ minHeight: "100vh" }}>
        {" "}
        <Box className="flex justify-center items-center">
          <Box
            sx={(theme) => ({
              ...FairLaunchTheme.cardStyle(theme),
              padding: "20px 32px",
              textAlign: "center",
              width: "100%",
            })}
          >
            <Typography
              variant="h4"
              sx={(theme) => FairLaunchTheme.gradientText(theme)}
            >
              Create Token Lock
            </Typography>
          </Box>
        </Box>
        <Box
          className="flex flex-col gap-8"
          sx={(theme) => ({
            ...FairLaunchTheme.cardStyle(theme),
            marginTop: "24px",
          })}
        >
          <div>
            <Tooltip
              title="Enter a valid ERC-20 token address starting with 0x"
              arrow
            >
              <Typography variant="h6">Token or LP token address*</Typography>
              <TextField
                fullWidth
                name="tokenAddress"
                placeholder="Enter token address"
                sx={FairLaunchTheme.inputStyle}
                onChange={(e) => {
                  formik.handleChange(e);
                  setTokenAddress(e.target.value.trim());
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tokenAddress &&
                  Boolean(formik.errors.tokenAddress)
                }
                helperText={
                  formik.touched.tokenAddress && formik.errors.tokenAddress
                }
              />
            </Tooltip>
            <div className="flex items-center">
              <Checkbox
                sx={(theme) => ({
                  color:
                    theme.palette.mode === "light"
                      ? "rgba(34, 153, 183, 0.5)"
                      : "rgba(0, 255, 255, 0.5)",
                  "&.Mui-checked": {
                    color:
                      theme.palette.mode === "light" ? "#2299b7" : "#00FFFF",
                  },
                })}
                checked={formik.values.useAnotherOwner}
                onChange={(e) => {
                  formik.setFieldValue("useAnotherOwner", e.target.checked);
                  setShowTextField(e.target.checked);
                }}
              />
              <Typography
                variant="body1"
                sx={(theme) => ({
                  color: theme.palette.mode === "light" ? "#4B5563" : "#E0E0E0",
                })}
              >
                Use Another Owner
              </Typography>
            </div>
          </div>
          {showTextField && (
            <div>
              <div>
                <Tooltip
                  title="Enter a valid Owner address starting with 0x"
                  arrow
                >
                  <Typography variant="h6">Owner Address*</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    // value={antowner}
                    // name="ownerAddress"
                    // onChange={(e) => setAntowner(e.target.value)}
                    placeholder="Enter Owner Address"
                    // required

                    sx={FairLaunchTheme.inputStyle}
                    value={formik.values.ownerAddress}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("ownerAddress", value);
                      setAntowner(value); // Avoid trimming here
                    }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.ownerAddress &&
                      Boolean(formik.errors.ownerAddress)
                    }
                    helperText={
                      formik.touched.ownerAddress && formik.errors.ownerAddress
                    }
                  />
                </Tooltip>
              </div>
            </div>
          )}
          <div>
            <CustomTokenTable
              tokenDetails={tokenDetails}
              tokenAddress={tokenAddress}
              loading={loading}
            />
          </div>
          <div>
            <Tooltip
              title="A descriptive name for this lock (min 3 characters)"
              arrow
            >
              <Typography variant="h6">Title*</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ex: My lock"
                name="description"
                type="text"
                value={formik.values.description}
                onChange={(e) => {
                  formik.handleChange(e);
                  setDescription(e.target.value);
                }}
                sx={FairLaunchTheme.inputStyle}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title="Enter the amount of tokens to lock (must be greater than 0)"
              arrow
            >
              <Typography variant="h6">Amount*</Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Amount"
                name="amount"
                type="number"
                value={formik.values.amount}
                onChange={(e) => {
                  formik.handleChange(e);
                  setAmount(e.target.value.trim());
                }}
                sx={FairLaunchTheme.inputStyle}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Tooltip>
            <div className="flex items-center">
              <Checkbox
                checked={formik.values.useVesting}
                onChange={(e) => {
                  formik.setFieldValue("useVesting", e.target.checked);
                  setShowLavestingCheckBox(e.target.checked);
                }}
              />

              <Typography
                variant="body1"
                sx={(theme) => ({
                  color: theme.palette.mode === "light" ? "#4B5563" : "#E0E0E0",
                })}
              >
                Use vesting ?
              </Typography>
            </div>
            <div>
              {showLavestingCheckBox && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Tooltip
                      title="The TGE date and time (UTC) when token unlocking will begin."
                      arrow
                    >
                      <Typography variant="h6">TGE Date (UTC Time)*</Typography>
                      <CustomDatePicker value={tgeDate} onChange={setTgeDate} />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Tooltip
                      title="The initial percentage of total tokens released to holders at the moment of the Token Generation Event (TGE)"
                      arrow
                    >
                      <Typography variant="h6">TGE Release %</Typography>

                      <TextField
                        fullWidth
                        variant="outlined"
                        sx={FairLaunchTheme.inputStyle}
                        value={formik.values.tgePercent}
                        placeholder="Enter TGE Release %"
                        name="tgePercent"
                        type="number"
                        onChange={(e) => {
                          const cleanedValue = e.target.value.replace(
                            /^0+(?=\d)/,
                            ""
                          ); // Remove leading zeros
                          formik.setFieldValue("tgePercent", cleanedValue); // Update Formik state with cleaned value
                          setTgePercent(cleanedValue); // Optional: if you're tracking it separately
                        }}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.tgePercent &&
                          Boolean(formik.errors.tgePercent)
                        }
                        helperText={
                          formik.touched.tgePercent && formik.errors.tgePercent
                        }
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {/* Zone Selector */}
                      <Tooltip
                        title="The time interval (e.g., monthly, quarterly) at which vested tokens will be released after the initial TGE release"
                        arrow
                      >
                        <FormControl fullWidth>
                          <Typography variant="h6">Unlock Schedule</Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter Unlock Schedule Ex: 10"
                            name="cycle"
                            type="number"
                            value={formik.values.cycle}
                            onChange={(e) => {
                              formik.handleChange(e);
                              setCycle(e.target.value);
                            }}
                            sx={FairLaunchTheme.inputStyle}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.cycle &&
                              Boolean(formik.errors.cycle)
                            }
                            helperText={
                              formik.touched.cycle && formik.errors.cycle
                            }
                            InputProps={{
                              endAdornment: (
                                <Select
                                  value={zone}
                                  onChange={handleChange}
                                  displayEmpty
                                  variant="standard"
                                  disableUnderline
                                  sx={(theme) => ({
                                    ml: 1,
                                    color:
                                      theme.palette.mode === "light"
                                        ? "#1F2937"
                                        : "white",
                                  })}
                                >
                                  <MenuItem value="Minute">Minute's</MenuItem>
                                  <MenuItem value="Hours">Hour's</MenuItem>
                                  <MenuItem value="Day">Day's</MenuItem>
                                  <MenuItem value="Week">Week's</MenuItem>
                                  <MenuItem value="Month">Month's</MenuItem>
                                  <MenuItem value="Quarter">Quarter's</MenuItem>
                                  <MenuItem value="Year">Year's</MenuItem>
                                </Select>
                              ),
                              sx: {
                                paddingRight: 0, // <-- remove default right padding
                              },
                            }}
                          />
                        </FormControl>
                      </Tooltip>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Tooltip
                      title="Initial percentage of tokens released at TGE (0-100)"
                      arrow
                    >
                      <Typography variant="h6">Unlock Rate %</Typography>

                      <TextField
                        fullWidth
                        variant="outlined"
                        value={formik.values.cyReleasePer}
                        placeholder="Enter Unlock Rate Percentage"
                        name="cyReleasePer"
                        type="number"
                        onChange={(e) => {
                          formik.handleChange(e);
                          setCyReleasePer(e.target.value);
                        }}
                        sx={FairLaunchTheme.inputStyle}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.cyReleasePer &&
                          Boolean(formik.errors.cyReleasePer)
                        }
                        helperText={
                          formik.touched.cyReleasePer &&
                          formik.errors.cyReleasePer
                        }
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              )}
            </div>
          </div>
          {!showLavestingCheckBox && (
            <div>
              <Tooltip
                title="Enter the UTC time until the lock will expire"
                arrow
              >
                <Typography variant="h6">Lock Until (UTC time)*</Typography>
                <CustomDatePicker value={lockUntil} onChange={setLockUntil} />
              </Tooltip>
            </div>
          )}

          <Box
            sx={{
              borderRadius: "16px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(180deg, rgba(16, 30, 50, 0.95) 0%, rgba(8, 15, 25, 0.95) 100%)"
                  : "linear-gradient(180deg, rgba(235, 245, 255, 0.9) 0%, rgba(240, 248, 255, 0.95) 100%)",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(66, 165, 245, 0.3)"
                    : "rgba(33, 150, 243, 0.3)"
                }`,
              backdropFilter: "blur(10px)",
              p: { xs: 2.5, sm: 3 },
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                  : "0 4px 20px rgba(33, 150, 243, 0.1)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "#2196f3" : "#1976d2",
              },
            }}
          >
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Typography sx={{ fontSize: "1.4rem", lineHeight: 1 }}>
                ⚠️
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                }}
              >
                Please exclude trendpad’s lockup address{" "}
                <strong style={{ color: "#2196f3", wordBreak: "break-all" }}>
                  {lockUpAddress}
                </strong>{" "}
                we don't support rebase tokens
              </Typography>
            </Box>
          </Box>
          <div className="flex justify-center items-center">
            {/* {tokenAddress && amount ? (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    width: "100%",
                    maxWidth: "300px",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  {loading ? (
                    <CircularProgress color="inherit" />
                  ) : tokenAllowance ? (
                    "Lock"
                  ) : (
                    "Approve"
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "100%",
                    maxWidth: "300px",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  Enter Details
                </Button>
              )} */}
            <Button
              variant="contained"
              type="submit"
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                width: "100%",
                maxWidth: "400px",
              })}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="inherit" />
              ) : tokenAllowance ? (
                "Lock"
              ) : (
                "Approve"
              )}
            </Button>
          </div>
        </Box>
        <Disclaimer />
      </Container>
    </form>
  );
};

export default TrendLock;
