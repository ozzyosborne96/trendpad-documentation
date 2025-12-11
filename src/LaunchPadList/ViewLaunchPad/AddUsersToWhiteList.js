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
import { addBatchToWhitelistHandler } from "../../ContractAction/LaunchPadAction";
import { isAddress } from "ethers";
import toast from "react-hot-toast";
import { FairLaunchTheme } from "../../LaunchPad/CeateFairLaunch/FairLaunchTheme";
const AddUsersToWhiteList = ({
  open,
  handleClose,
  poolAddr,
  setUpdate,
  update,
}) => {
  console.log("AddUsersToWhiteList rendered, open:", open);
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
    const rawAddresses = walletInput.split(/\s+/).filter(Boolean);

    // Normalize and deduplicate
    const lowerCased = rawAddresses.map((addr) => addr.toLowerCase().trim());
    const uniqueSet = new Set(lowerCased);
    const invalid = rawAddresses.filter((addr) => !isAddress(addr));
    if (invalid.length) {
      setSnackbar({
        open: true,
        message: "Some addresses are invalid.",
        severity: "error",
      });
      toast.error("Some addresses are invalid.");
      return;
    }
    if (uniqueSet.size === 0) {
      setSnackbar({
        open: true,
        message: "Please enter at least one valid wallet address.",
        severity: "warning",
      });
      toast.error("Please enter at least one valid wallet address.");
      return;
    }

    if (uniqueSet.size < rawAddresses.length) {
      setSnackbar({
        open: true,
        message:
          "Duplicate addresses found. Only unique addresses will be added.",
        severity: "warning",
      });
      toast.error(
        "Duplicate addresses found. Only unique addresses will be added."
      );
      return;
    }

    try {
      setLoading(true);
      const addresses = Array.from(uniqueSet);
      const tx = await addBatchToWhitelistHandler(poolAddr, true, addresses);

      if (tx) {
        setSnackbar({
          open: true,
          message: "Wallets added successfully!",
          severity: "success",
        });
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
          sx: (theme) => ({
            ...FairLaunchTheme.cardStyle(theme),
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 20px rgba(0,0,0,0.1)"
                : "0 0 30px rgba(0, 255, 255, 0.2)",
          }),
        }}
      >
        <DialogTitle
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            textAlign: "center",
            fontSize: "1.5rem",
          })}
        >
          Add Wallets To Whitelist
        </DialogTitle>
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
            InputProps={{
              style: { color: (theme) => theme.palette.text.primary },
            }}
            sx={(theme) => ({
              ...FairLaunchTheme.inputStyle(theme),
              "& .MuiInputBase-root": {
                padding: "16px",
              },
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{ color: (theme) => theme.palette.text.secondary }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              minWidth: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
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
