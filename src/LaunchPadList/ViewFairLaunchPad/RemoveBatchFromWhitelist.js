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
import { fairRemoveBatchFromWhitelistHandler } from "../../ContractAction/FairLaunchPadAction";
const RemoveBatchFromWhitelist = ({
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
    const addresses = walletInput.split(/\s+/).filter((addr) => addr);

    if (addresses.length === 0) {
      setSnackbar({
        open: true,
        message: "Please enter at least one wallet address.",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const tx = await fairRemoveBatchFromWhitelistHandler(poolAddr, addresses);
      if (tx) {
        setSnackbar({
          open: true,
          message: "Wallets Removed successfully!",
          severity: "success",
        });
        setWalletInput("");
        handleClose();
      }
      setUpdate(prev => !prev);
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
          sx: {
            backgroundColor: (theme) => theme.palette.background.paper,
            color: "white",
          },
        }}
      >
        <DialogTitle>Remove Wallets to Whitelist</DialogTitle>
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

export default RemoveBatchFromWhitelist;
