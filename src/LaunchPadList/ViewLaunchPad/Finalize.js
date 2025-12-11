import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Divider,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  setClaimTimeHandler,
  finalizeHandler,
} from "../../ContractAction/LaunchPadAction";
import CustomDatePicker from "../../Components/DatePicker";
import {dayjs} from "dayjs";
const Finalize = ({ open, onClose, poolAddr, setUpdate,
  update }) => {
  const [claimTime, setClaimTime] = useState();
  const [error, setError] = useState("");
  const [enableFinalize, setEnableFinalize] = useState(true);
  const [loading, setLoading] = useState({
    claimNow: false,
    saveSetting: false,
    finalize: false,
  });
    console.log("claimTime",claimTime);

  const formatDateToLocalInput = (date) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  const handleSetTime = async () => {
    if (!claimTime || new Date(claimTime) <= new Date()) {
      setError("Claim time needs to be after now.");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, saveSetting: true }));
      const tx = await setClaimTimeHandler(poolAddr, claimTime);
      if (tx) {
        setEnableFinalize(false);
        setError("");
      }
      setUpdate(prev => !prev);
    } catch (e) {
      console.error("Error setting claim time:", e);
    } finally {
      setLoading((prev) => ({ ...prev, saveSetting: false }));
    }
  };

  const handleClaimNow = async () => {
    const now = Math.floor(Date.now() / 1000) + 10; // current time in seconds + 10

    try {
      console.log("formattedTime (unix timestamp)", now);
      setLoading((prev) => ({ ...prev, claimNow: true }));
      const tx = await setClaimTimeHandler(poolAddr, now); // pass as number or BigInt
      if (tx) {
        setClaimTime(now); // store as number
        setEnableFinalize(false);
        setError("");
      }
      setUpdate(prev => !prev);
    } catch (e) {
      console.error("Error in Claim Now:", e);
    } finally {
      setLoading((prev) => ({ ...prev, claimNow: false }));
    }
  };


  const finalizeHandlerClick = async () => {
    try {
      setLoading((prev) => ({ ...prev, finalize: true }));
      const tx = await finalizeHandler(poolAddr);
      // Optional: handle success/failure state
      setUpdate(prev => !prev);
    } catch (e) {
      console.error("Error finalizing:", e);
    } finally {
      setLoading((prev) => ({ ...prev, finalize: false }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: (theme) => theme.palette.background.paper,
        }}
      >
        Finalize
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ background: (theme) => theme.palette.background.paper }}>
        <Box mb={3}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold" }}
          >
            1. Set time
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Claim time (UTC)
          </Typography>
          <CustomDatePicker label="Set Time" value={claimTime}
            // onChange={(newValue) => setClaimTime(newValue)}
             onChange={(newValue) => setClaimTime(newValue)}
          />

          {/* <TextField
            type="datetime-local"
            fullWidth
            value={claimTime}
            onChange={(e) => setClaimTime(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error}
          /> */}

          <Box display="flex" gap={1}>
            {/* <Button
              variant="contained"
              onClick={handleClaimNow}
              disabled={loading.claimNow}
            >
              {loading.claimNow ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Claim Right Now"
              )}
            </Button> */}
            <Button
              variant="outlined"
              onClick={handleSetTime}
              disabled={loading.saveSetting}
            >
              {loading.saveSetting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save Setting"
              )}
            </Button>
          </Box>
        </Box>

        <Divider />

        <Box mt={3}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#aaa" }}
          >
            2. Finalize
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", mt: 1 }}
          >
            Click the button below to finalize the pool.
          </Typography>

          <Button
            variant="contained"
            disabled={enableFinalize || loading.finalize}
            onClick={finalizeHandlerClick}
            sx={{
              mt: 2,
              "&.Mui-disabled": {
                backgroundColor: "#9e9e9e",
                color: "#ffffff",
              },
            }}
          >
            {loading.finalize ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Finalize"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Finalize;
