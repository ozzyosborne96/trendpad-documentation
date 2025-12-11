import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Radio,
  TextField,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import CustomDatePicker from "../Components/DatePicker";
import {
  startAirDropHandler,
  getTotalAllocation,
  checkAllowance,
  approveToken,
} from "../ContractAction/AirDropContractAction";
import toast from "react-hot-toast";
import { ethers } from "ethers";
const MuiDialog = ({
  timeOpen,
  handleClose,
  addr,
  tokenDetails,
  tokenAddress,
  bal,
  setUpdate,
  update,
}) => {
  const [selectedOption, setSelectedOption] = useState("start_now");
  const [lockUntil, setLockUntil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenAllowance, setTokenAllowance] = useState(false);
  const provider = new ethers.BrowserProvider(window.ethereum);

  const handleRadioChange = (event) => setSelectedOption(event.target.value);
  useEffect(() => {
    if (bal > 0 && tokenAddress) {
      checkAllowance(tokenAddress, bal, addr)
        .then(setTokenAllowance)
        .catch((error) => console.error("Error checking allowance:", error));
    }
  }, [bal, tokenAddress]);

  const timeHandler = async () => {
    try {
      if (!tokenAllowance) {
        const txHash = await approveToken(tokenAddress, bal, addr);
        if (txHash) {
          toast.success("Approved! ✅");
          const updatedAllowance = await checkAllowance(
            tokenAddress,
            bal,
            addr
          );
          setTokenAllowance(updatedAllowance);
        } else {
          toast.error("Approval failed ❌");
          return;
        }
      } else {
        let timeInMillis;
        if (selectedOption === "start_now") {
          const currentBlock = await provider.getBlock("latest");
          timeInMillis = currentBlock.timestamp + 20;
          console.log("timeInMillis1234", timeInMillis);

          // timeInMillis = Math.floor(Date.now() / 1000) + 5;
        } else {
          if (!lockUntil) {
            toast.error("Please select a valid lock time! ❌");
            return;
          }
          const tgeDateTime = new Date(lockUntil);
          timeInMillis = Math.floor(tgeDateTime.getTime() / 1000); // e.g., 1748586202
          console.log("timeInMillis1234", timeInMillis);
        }
        const tx = await startAirDropHandler(
          timeInMillis,
          addr,
          bal,
          tokenAddress
        );
        if (tx) {
          toast.success("Airdrop started successfully! 🚀");
          setUpdate(prev => !prev);
          handleClose();
        }
        handleClose();
      }
    } catch (error) {
      console.error("Error in timeHandler:", error);
      toast.error(`Error: ${error.message || "Something went wrong"} ❌`);
    } finally {
    }
  };
  console.log("tokenAllowance", tokenAllowance);
  return (
    <Dialog
      open={timeOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: (theme) => theme.palette.background.paper,
          color: "white",
          maxWidth: "50%",
          width: "100%",
          padding: "20px",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h4">Setting Time To Start</Typography>
      </DialogTitle>

      <DialogContent>
        <Box>
          <FormControl>
            <FormLabel id="airdrop-time-label">
              <Typography variant="h6">
                Setting time to start airdrop
              </Typography>
            </FormLabel>
            <RadioGroup
              aria-labelledby="airdrop-time-label"
              value={selectedOption}
              onChange={handleRadioChange}
              name="airdrop-time-options"
            >
              {/* <FormControlLabel
                value="start_now"
                control={<Radio />}
                label="Start now"
              /> */}
              <FormControlLabel
                value="start_later"
                control={<Radio />}
                label="Start after specific time"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {selectedOption === "start_later" && (
          <Box mt={2}>
            <Typography variant="h6">Lock Until (UTC time)*</Typography>
            <CustomDatePicker value={lockUntil} onChange={setLockUntil} />
            {/* <TextField
              type="datetime-local"
              fullWidth
              value={lockUntil}
              helperText="Lock Until Date & Time"
              onChange={(e) => setLockUntil(e.target.value)}
              margin="normal"
            /> */}
          </Box>
        )}

        <Box
          mt={2}
          sx={{
            border: "1px solid #E5B649",
            textAlign: "center",
            padding: "10px",
          }}
        >
          <Typography variant="body1" sx={{ color: "#E5B649" }}>
            You need at least {bal} {tokenDetails?.symbol} to start airdrop.
            Your balance: {tokenDetails?.balance || 0} {tokenDetails?.symbol}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        {bal > 0 ? (
          <Button onClick={timeHandler} color="primary" variant="contained">
            {tokenAllowance ? "Start Airdrop" : "Approve"}
          </Button>
        ) : (
          <Typography color="error">Insufficient balance</Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MuiDialog;
