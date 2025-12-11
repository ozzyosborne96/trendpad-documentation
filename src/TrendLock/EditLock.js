import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  Grid,
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableBody,
  CircularProgress,
} from "@mui/material";
import useGetTokenDetails from "../Hooks/GetTokenDetails";
import CustomDatePicker from "../Components/DatePicker";
import Disclaimer from "../Components/Disclaimer";
import { useLocation } from "react-router-dom";
import {
  getLockDetailsById,
  updateLockHandler,
} from "../ContractAction/TrendLockAction";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getTokenDecimals } from "../ContractAction/ContractDependency";
const EditLock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tokenAddress = location.state.tokenAddress; // Extract tokenAddress from the location state
  const lockId = location.state.lockId;
  console.log("tokenAddress_lockId", tokenAddress, lockId);
  const [tokenDetails, setTokenDetails] = useState();
  const [lockDetails, setLockDetails] = useState();
  const [amountLocked, setAmountLocked] = useState();
  const [unLoclDate, setUnLoclDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [hasDecimalError, setHasDecimalError] = useState(false);
  const [decimals, setDecimals] = useState(18); // default to 18

    useEffect(() => {
    const fetchTokenDecimals = async () => {
      if (tokenAddress) {
        const decimals = await getTokenDecimals(tokenAddress);
        setDecimals(decimals);
      }
    };

    fetchTokenDecimals();
  }, [tokenAddress]);
  const fetchTokenDetails = useGetTokenDetails(); // Get the function, not data
  useEffect(() => {
    if (tokenAddress) {
      fetchTokenDetails(tokenAddress).then(setTokenDetails);
    } else {
      setTokenDetails(null);
    }
  }, [tokenAddress]);
  useEffect(() => {
    async function fetchDetails() {
      try {
        const lockDetails = await getLockDetailsById(lockId,decimals);
        console.log("12345", lockDetails);
        setLockDetails(lockDetails);
        setAmountLocked(lockDetails?.amountLocked);
        setUnLoclDate(dayjs(lockDetails?.tgedate)); // Convert to Dayjs
      } catch (error) {
        console.error("Error fetching lock details:", error);
      }
    }
    fetchDetails();
  }, [lockId,decimals]);



  const UpdateLockClick = async () => {
    try {
      if (!amountLocked) {
        toast.error("Enter amount");
      } else {
        setIsLoading(true);
        const tx = await updateLockHandler(
          amountLocked,
          unLoclDate,
          lockDetails?.lockId,
          tokenAddress
        );
        console.log("Transaction", tx);

        // Check if the transaction is successful
        if (tx) {
          toast("Lock Updated!", {
            icon: "✅",
            type: "success",
          });
          navigate(-1);
        } else {
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating lock:", error);
      setIsLoading(false);
    }
  };
  const handleAmountChange = (e) => {
    const input = e.target.value;
    if (input === "" || input <= 0) {
      setAmountLocked("");
      setHasDecimalError(false);
      return;
    }
    if (!/^\d*\.?\d*$/.test(input)) return;
    const [intPart, decimalPart] = input.split(".");
    if (decimalPart && decimalPart.length > 18) {
      setHasDecimalError(true);
    } else {
      setHasDecimalError(false);
    }
    setAmountLocked(input);
  };
  return (
    <Container>
      <Box
        className="flex-col gap-16"
        sx={{ padding: "20px 32px", background: (theme) => theme.palette.background.paper }}
      >
        <div>
          <Typography variant="h5">Edit Your Lock</Typography>
        </div>
        <div sx={{ padding: "20px 32px", background: (theme) => theme.palette.background.paper }}>
          <Grid item xs={12}>
            <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
              <TableContainer
                component={Paper}
                sx={{
                  background: "transparent",
                  borderRadius: "8px",
                  minWidth: "700px",
                }}
              >
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow sx={{ borderBottom: "2px solid #ccc" }}>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          padding: "12px",
                        }}
                      >
                        Property
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          padding: "12px",
                        }}
                      >
                        Value
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { label: "Token Name", value: tokenDetails?.name },
                      { label: "Token Symbol", value: tokenDetails?.symbol },
                      { label: "Decimals", value: tokenDetails?.decimals },
                      {
                        label: "Total Supply",
                        value: tokenDetails?.totalSupply,
                      },
                      { label: "Balance", value: tokenDetails?.balance },
                    ].map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ borderBottom: "1px solid #ddd" }}
                      >
                        <TableCell
                          sx={{ textAlign: "center", padding: "12px" }}
                        >
                          {row.label}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: "center",
                            padding: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {row.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </div>
        <div>
          <Typography variant="h6">Amount</Typography>
          <TextField
            variant="outlined"
            value={amountLocked}
            onChange={handleAmountChange}
            placeholder="0"
            error={hasDecimalError}
            helperText={
              hasDecimalError ? "Maximum 18 decimal places allowed" : ""
            }
            fullWidth
          />
        </div>
        <div>
          <Typography variant="h6">Unlock Date</Typography>
          <CustomDatePicker
            value={unLoclDate}
            onChange={(newValue) => setUnLoclDate(dayjs(newValue))}
          />
        </div>
        <div className="flex justify-center items-center">
          <Button
            variant="contained"
            sx={{
              padding: "10px 30px",
              fontSize: "14px",
              fontWeight: "700",
              width: "150px",
              height: "50px",
            }}
            onClick={isLoading ? null : UpdateLockClick}
          >
            {isLoading ? (
              <CircularProgress sx={{ color: "#ffff" }} />
            ) : (
              "Update Lock"
            )}
          </Button>
        </div>
      </Box>
      <Disclaimer />
    </Container>
  );
};

export default EditLock;
