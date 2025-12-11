import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import CustomDatePicker from "../../Components/DatePicker";
import { setEndAndStartTimeHandler } from "../../ContractAction/LaunchPadAction";
import { toast } from "react-hot-toast"; // Make sure you have react-toastify installed

const StartEndTimeSetting = ({ open, handleClose, poolAddr,setUpdate,
  update }) => {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const handlestartend = await setEndAndStartTimeHandler(poolAddr, startTime, endTime);
      if (handlestartend) {
        toast.success("Start and End time set successfully ✅");
        handleClose();
      } else {
        toast.error("Failed to set times ❌");
      }
      setUpdate(prev => !prev);
    } catch (error) {
      console.error("Error setting times:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { backgroundColor: (theme) => theme.palette.background.paper, borderRadius: 2 } }}
    >
      <DialogTitle sx={{ color: "white" }}>Set Start and End Time</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <CustomDatePicker value={startTime} onChange={setStartTime} />
        <CustomDatePicker value={endTime} onChange={setEndTime} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "white" }} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ backgroundColor: "#1976d2" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StartEndTimeSetting;
