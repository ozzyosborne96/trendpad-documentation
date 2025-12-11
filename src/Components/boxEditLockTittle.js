import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, Typography } from "@mui/material";
import { editTittleLockHandeler } from "../ContractAction/TrendLockAction"; // Corrected function name
import toast from "react-hot-toast";

export default function FormEditTitleDialog({
  open,
  handleClose,
  lockId,
  setUpdate,
}) {
  const [title, setTitle] = useState(""); // Renamed state to title
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    console.log("Dialog open state:", open);
    console.log("Lock ID received:", lockId);
  }, [open, lockId]);

  const handleEditTitle = async () => {
    setLoading(true);
    console.log("handleEditTitle function called!");
    if (!title) {
      toast.error("Title is required");
      console.log("Title is missing!");
      setLoading(false);
      return;
    }
    if (title.length > 100) {
      toast.error("Title cannot exceed 100 characters");
      setLoading(false);
      return;
    }
    try {
      console.log("Attempting to update title to:", title);
      const tx = await editTittleLockHandeler(lockId, title); // Corrected function name
      console.log("Transaction successful:", tx);
      if (tx) {
        toast.success("Title updated successfully");
        setTitle(""); // Reset the title input
      }
      setUpdate((prev) => !prev);

      handleClose();
      setLoading(false);
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Error updating title");
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
          Edit Lock Title
        </Typography>{" "}
        {/* Corrected label */}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "white" }}>
          To edit the title, please enter the new title.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="title"
          name="title" // Updated name to match the label
          label="Title" // Corrected the label from "Tittle" to "Title"
          type="text"
          fullWidth
          variant="standard"
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
          value={title} // Renamed state to title
          onChange={(e) => {
            console.log("Title Updated:", e.target.value);
            setTitle(e.target.value); // Updated to setTitle
          }}
        />
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
            handleEditTitle(); // Corrected function name
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Update"
          )}{" "}
          {/* Button text updated */}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
