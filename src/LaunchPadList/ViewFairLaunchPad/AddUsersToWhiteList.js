import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { fairAddBatchToWhitelistHandler } from "../../ContractAction/FairLaunchPadAction";
import toast from "react-hot-toast";
import { isAddress } from "ethers";

const AddUsersToWhiteList = ({
  open,
  handleClose,
  poolAddr,
  setUpdate,
  update,
}) => {
  const [walletInput, setWalletInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      const trimmed = walletInput.trim();
      if (trimmed && !walletInput.endsWith("\n")) {
        e.preventDefault();
        setWalletInput(walletInput + "\n");
      }
    }
  };

const handleSave = async () => {
  const rawAddresses = walletInput
    .split(/\s+/) // split by any whitespace: space, newline, tab
    .map((addr) => addr.trim())
    .filter((addr) => addr); // remove empty strings

  if (rawAddresses.length === 0) {
    setSnackbar({
      open: true,
      message: "Please enter at least one wallet address.",
      severity: "warning",
    });
    toast.error("Please enter at least one wallet address.");
    return;
  }

  // Validate all addresses
  const invalidAddresses = rawAddresses.filter((addr) => !isAddress(addr));
  if (invalidAddresses.length > 0) {
    setSnackbar({
      open: true,
      message: "Some addresses are invalid.",
      severity: "error",
    });
    toast.error("Some addresses are invalid.");
    return;
  }

  // Deduplicate addresses (case-insensitive)
  const uniqueAddresses = Array.from(new Set(rawAddresses.map((a) => a.toLowerCase())));

  if (uniqueAddresses.length < rawAddresses.length) {
    setSnackbar({
      open: true,
      message: "Duplicate addresses found. Only unique addresses will be added.",
      severity: "warning",
    });
    toast.error("Duplicate addresses found. Only unique addresses will be added.");
    return;
  }

  try {
    setLoading(true);
    const tx = await fairAddBatchToWhitelistHandler(poolAddr, true, uniqueAddresses);

    if (tx) {
      setSnackbar({
        open: true,
        message: "Wallets added successfully!",
        severity: "success",
      });
      toast.success("Wallets added successfully!");
      setWalletInput("");
      handleClose();
      setUpdate((prev) => !prev);
    }
  } catch (error) {
    console.error("Whitelist error:", error);
    setSnackbar({
      open: true,
      message: "Failed to add wallets.",
      severity: "error",
    });
    toast.error("Failed to add wallets.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: (theme) => theme.palette.background.paper,
            color: "white",
          },
        }}
      >
        <DialogTitle>Add Wallets To Whitelist</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            minRows={6}
            fullWidth
            placeholder="Type wallet address and press space"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{ color: "#fff" }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              minWidth: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
};

export default AddUsersToWhiteList;
