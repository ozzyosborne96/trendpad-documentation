import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import toast from "react-hot-toast";
import { rnounceLockOwnerShip } from "../ContractAction/TrendLockAction"; // Corrected function name

export default function FormRenounceDialog({
  open,
  handleClose,
  lockId,
  setUpdate,
}) {
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    console.log("Dialog open state:", open);
    console.log("Lock ID received:", lockId);
  }, [open, lockId]);

  const handleTransferOwnership = async () => {
    setLoading(true);
    console.log("handleTransferOwnership function called!");
    try {
      const tx = await rnounceLockOwnerShip(lockId); // Corrected function name
      console.log("Transaction successful:", tx);
      if (tx) {
        toast.success("Ownership transferred successfully");
      }
      setUpdate((prev) => !prev);

      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error transferring ownership:", error);
      toast.error("Error transferring ownership");
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { backgroundColor: (theme) => theme.palette.background.paper, color: "white" },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ color: "white" }}>
          Transfer Renounce Ownership
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "white" }}>
          Are you sure you want to renounce ownership?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            console.log("Cancel button clicked");
            handleClose();
          }}
          sx={{ color: "white" }}
        >
          Cancel
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            console.log("Transfer button clicked");
            handleTransferOwnership();
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Transfer"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
