import * as React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, Typography } from "@mui/material";
import { transferOwnerShip } from "../ContractAction/TrendLockAction";
import toast from "react-hot-toast";

export default function FormDialog({ open, handleClose, lockId, setUpdate }) {
  const [loading, setLoading] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      ownerAddress: "",
    },
    validationSchema: Yup.object({
      ownerAddress: Yup.string()
        .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
        .required("New Owner address is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        console.log(
          "Attempting to transfer ownership to:",
          values.ownerAddress
        );
        const tx = await transferOwnerShip(lockId, values.ownerAddress);
        console.log("Transaction successful:", tx);

        if (tx) {
          toast.success("Ownership transferred successfully");
        }
        setUpdate((prev) => !prev);

        resetForm();
        handleClose();
      } catch (error) {
        console.error("Error transferring ownership:", error);
      } finally {
        setLoading(false);
      }
    },
  });

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
          Transfer Ownership
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "white" }}>
          To transfer ownership, please enter the new owner's wallet address.
        </DialogContentText>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="ownerAddress"
            name="ownerAddress"
            label="New Owner Wallet Address"
            type="text"
            fullWidth
            variant="standard"
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
            value={formik.values.ownerAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.ownerAddress && Boolean(formik.errors.ownerAddress)
            }
            helperText={
              formik.touched.ownerAddress && formik.errors.ownerAddress
            }
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "white" }}>
          Cancel
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={formik.handleSubmit}
          disabled={loading}
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
