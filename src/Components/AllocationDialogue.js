import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import { setAllocationHandler } from "../ContractAction/AirDropContractAction";
import { toast } from "react-hot-toast";
const AllocationMuiDialog = ({
  timeOpen,
  handleClose,
  addr,
  setUpdate,
  update,
  decimals
}) => {
  const [inputValue, setInputValue] = useState("");
  const [amountMode, setAmountMode] = useState("fixed");
  const [fixedAmount, setFixedAmount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState();

  const handleChange = (event, generate = false) => {
    let input = typeof event?.target?.value === "string" ? event.target.value : inputValue;
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
          amount = fixedAmount || "0";
        } else {
          const min = parseFloat(minAmount || "0");
          const max = parseFloat(maxAmount || "0");
          amount = (Math.random() * (max - min) + min).toFixed(0);
        }
        return `${address} ${amount}`;
      });
      input = newAllocations.join("\n");
      setInputValue(input);
    }
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
          const numAmount = parseFloat(amount.trim());
          if (!isNaN(numAmount) && numAmount > 0) {
            return { address: address.trim(), amount: amount.trim() };
          }
        }
        return null;
      })
      .filter((entry) => entry !== null);


    setEntries(entryList);
  };


  console.log("entries", entries);
  const setAllocationHandlerFunction = async () => {
    console.log("!addr && !entries", addr, entries);

    if (!addr || !Array.isArray(entries) || entries.length === 0) {
      toast.error("Please enter allocations or amount should be greater than 0");
      return;
    }

    setLoading(true);
    const tx = await setAllocationHandler(addr, entries, decimals);
    if (tx) {
      setUpdate(prev => !prev);
      setLoading(false);
      handleClose();
    }
  };
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
        <Typography variant="h4">Set Allocations</Typography>
      </DialogTitle>
      {/* Amount Generation Section */}
      <Box className="m-8">
        <Typography variant="h6">Amount Type</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant={amountMode === "fixed" ? "contained" : "outlined"}
              onClick={() => setAmountMode("fixed")}
              fullWidth
            >
              Fixed
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant={amountMode === "random" ? "contained" : "outlined"}
              onClick={() => setAmountMode("random")}
              fullWidth
            >
              Random
            </Button>
          </Grid>
        </Grid>

        {amountMode === "fixed" ? (
          <Box className="mt-4">
            <TextField
              variant="outlined"
              fullWidth
              value={fixedAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,18}$/.test(value)) {
                  setFixedAmount(value);
                }
              }}
              type="number"
            />
          </Box>
        ) : (
          <Grid container spacing={2} className="m-4">
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                fullWidth
                value={minAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,18}$/.test(value)) {
                    setMinAmount(value);
                  }
                }}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                fullWidth
                value={maxAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,18}$/.test(value)) {
                    setMaxAmount(value);
                  }
                }}
                type="number"
              />
            </Grid>
          </Grid>
        )}

        <Box className="mt-4">
          <Button variant="contained" onClick={() => handleChange(null, true)}>
            Generate Allocations
          </Button>
        </Box>
      </Box>

      <DialogContent>
        <Box className="flex-col gap-4">
          <div>
            <Typography variant="h6">Users Allocation</Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              placeholder={`Insert allocations: separate with line breaks.\nFormat: address,amount or address amount\nExamples:\n0x0000000000000000000000000000000000000000 13.56\n0x0000000000000000000000000000000000000000 12.67`}
              variant="outlined"
              name="allocations"
              value={inputValue}
              onChange={handleChange}
              inputProps={{ style: { whiteSpace: "pre-wrap" } }}
            />
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={setAllocationHandlerFunction}
          color="primary"
          variant="contained"
        >
          Submit{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllocationMuiDialog;
