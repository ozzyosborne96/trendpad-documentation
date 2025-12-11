import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TableContainer,
  Paper,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { checkAllowance } from "../ContractAction/MultiSenderAction";
import {
  approveToken,
  multisenderHandler,
} from "../ContractAction/MultiSenderAction";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const DeFiFairlaunchInfoMulti = ({ tokenDetails, tokenAddress, addresses }) => {
  console.log("tokenDetails87346396", tokenDetails);
  const [formData, setFormData] = useState({
    tokenAddress: tokenAddress || "",
    totalAmount: tokenDetails?.totalSupply || "",
    noOfTransactions: tokenDetails?.name || "",
    yourBalance: tokenDetails?.balance || "",
    decimals: tokenDetails?.decimals || "",
    symbol: tokenDetails?.symbol || "",
  });
  const navigate = useNavigate();
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const [selectedOption, setSelectedOption] = useState("Safe");
  const [allowance, setAllowance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeRadio = (event) => {
    setSelectedOption(event.target.value);
  };
  console.log("sfduv", addresses);
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!tokenAddress) {
        console.error("Token address is required.");
        return;
      }
      if (!addresses || addresses.length === 0) {
        console.error("At least one address must be provided.");
        return;
      }
      if (!selectedOption) {
        console.error("Please select a send option (Safe/Unsafe).");
        return;
      }
      const isSafe = selectedOption === "Safe";
      const totalAmount = await addresses.reduce((sum, item) => {
        return sum + (parseFloat(item?.amount) || 0);
      }, 0);
      if (totalAmount > formData.yourBalance) {
        toast.error("Insufficient balance");
        setIsLoading(false);
        return;
      }

      if (allowance) {
        const tx = await multisenderHandler(tokenAddress, addresses, isSafe);
        console.log("Transaction Successful:", tx);
        const updatedAllowance = await checkAllowance(
          tokenAddress,
          totalAmount
        );
        setAllowance(updatedAllowance);

        if (tx) {
          toast.success("Multisender transaction done successfully");
          navigate("/Multisender/MultiSenderSuccess");
        }
      } else {
        const tx = await approveToken(tokenAddress, totalAmount);
        console.log("Transaction Successful:", tx);
        const updatedAllowance = await checkAllowance(
          tokenAddress,
          totalAmount
        );
        setAllowance(updatedAllowance);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function checkAllowancefun() {
      const totalAmount = await addresses.reduce((sum, item) => {
        return sum + (parseFloat(item?.amount) || 0);
      }, 0);
      const allowance = await checkAllowance(tokenAddress, totalAmount);
      setAllowance(allowance);
    }
    checkAllowancefun();
  }, []);
  const paginatedAddresses = addresses?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  console.log("allowance", allowance);

  const textFieldStyle = (theme) => FairLaunchTheme.inputStyle(theme);

  return (
    <div style={{ width: "100%" }}>
      <Typography
        variant="h6"
        sx={(theme) => ({
          marginBottom: "20px",
          color: theme.palette.text.primary,
          fontWeight: "bold",
        })}
      >
        Multisender Information
      </Typography>

      <TableContainer
        component={Paper}
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          padding: "20px",
          boxShadow: "none",
        })}
      >
        <Table
          sx={{ minWidth: 650, borderCollapse: "collapse" }}
          aria-label="simple table"
        >
          <TableBody>
            <TableRow>
              <TableCell
                align="center"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontWeight: "600",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                Token Address
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <TextField
                  variant="outlined"
                  name="tokenAddress"
                  value={formData.tokenAddress}
                  // onChange={handleChange}
                  placeholder="Type token symbol or address"
                  fullWidth
                  sx={textFieldStyle}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontWeight: "600",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                Total Supply
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <TextField
                  variant="outlined"
                  name="totalAmount"
                  value={formData.totalAmount}
                  // onChange={handleChange}
                  placeholder="Type amount to send"
                  fullWidth
                  sx={textFieldStyle}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontWeight: "600",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <TextField
                  variant="outlined"
                  name="noOfTransactions"
                  value={formData.noOfTransactions}
                  // onChange={handleChange}
                  placeholder="Enter number of transactions"
                  fullWidth
                  sx={textFieldStyle}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontWeight: "600",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                Your Balance
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <TextField
                  variant="outlined"
                  name="yourBalance"
                  value={formData.yourBalance}
                  // onChange={handleChange}
                  placeholder="Enter your balance"
                  fullWidth
                  sx={textFieldStyle}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontWeight: "600",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                Symbol
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <TextField
                  variant="outlined"
                  name="yourBalance"
                  value={formData.symbol}
                  // onChange={handleChange}
                  placeholder="Enter your balance"
                  fullWidth
                  sx={textFieldStyle}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontWeight: "600",
                  fontSize: "16px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                Address
              </TableCell>
              <TableCell
                align="center"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontWeight: "600",
                  fontSize: "16px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                Amount
              </TableCell>
            </TableRow>

            {paginatedAddresses &&
              paginatedAddresses.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={(theme) => ({
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    })}
                  >
                    {item?.address}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={(theme) => ({
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    })}
                  >
                    {item?.amount}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={addresses?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={(theme) => ({
            color: theme.palette.text.primary,
            borderTop: `1px solid ${theme.palette.divider}`,
          })}
        />
      </TableContainer>

      <Box mt={4} sx={{ color: (theme) => theme.palette.text.primary }}>
        <Typography variant="h6">Send Options</Typography>
        <FormControl component="fieldset" sx={{ marginTop: "10px" }}>
          <RadioGroup
            row
            aria-label="send options"
            name="sendOptions"
            value={selectedOption}
            onChange={handleChangeRadio}
          >
            <FormControlLabel
              value="Safe"
              control={
                <Radio
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    "&.Mui-checked": { color: theme.palette.primary.main },
                  })}
                />
              }
              label="Safe"
              sx={{ color: (theme) => theme.palette.text.primary }}
            />
            <FormControlLabel
              value="Unsafe"
              control={
                <Radio
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    "&.Mui-checked": { color: theme.palette.primary.main },
                  })}
                />
              }
              label="Unsafe"
              sx={{ color: (theme) => theme.palette.text.primary }}
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {isLoading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : allowance ? (
        <Button
          variant="contained"
          sx={(theme) => ({
            ...FairLaunchTheme.neonButton(theme),
            marginTop: "20px",
            width: "100%",
          })}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={(theme) => ({
            ...FairLaunchTheme.neonButton(theme),
            marginTop: "20px",
            width: "100%",
          })}
          onClick={handleSubmit}
        >
          Approve
        </Button>
      )}
    </div>
  );
};

export default DeFiFairlaunchInfoMulti;
