import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setVestingHandler } from "../ContractAction/AirDropContractAction";

const VestMuiDialog = ({ timeOpen, handleClose, addr, setUpdate, update }) => {
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      tgeReleasePercent: "",
      cycleReleasePercent: "",
      cycleDuration: "",
    },
    validationSchema: Yup.object({
      tgeReleasePercent: Yup.number()
        .min(0, "Must be at least 0%")
        .max(100, "Cannot exceed 100%")
        .required("TGE release percent is required"),
      cycleReleasePercent: Yup.number()
        .min(0, "Must be at least 0%")
        .max(100, "Cannot exceed 100%")
        .required("Cycle release percent is required"),
      cycleDuration: Yup.number()
        .typeError("Cycle duration must be a number")
        .integer("Cycle duration must be a whole number")
        .min(1, "Must be at least 1 minute")
        .required("Cycle duration is required"),
    }),
    onSubmit: async (values) => {
      if (!addr) {
        console.error("Missing address!");
        return;
      }

      try {
        setLoading(true);
        const tx = await setVestingHandler(
          addr,
          values.tgeReleasePercent,
          values.cycleReleasePercent,
          values.cycleDuration
        );
        if (tx) {
          console.log("Vesting Set Successfully:", tx);
          setUpdate(prev => !prev);
          handleClose();
        }
      } catch (error) {
        console.error("Error in setVest:", error);
      } finally {
        setLoading(false);
      }
    },
  });

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
        <Typography variant="h4">Set Vesting</Typography>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <Typography variant="h6">TGE Release Percent (%)</Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                name="tgeReleasePercent"
                value={formik.values.tgeReleasePercent}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tgeReleasePercent &&
                  Boolean(formik.errors.tgeReleasePercent)
                }
                helperText={
                  formik.touched.tgeReleasePercent &&
                  formik.errors.tgeReleasePercent
                }
                sx={{ mt: 1 }}
              />
            </div>
            <div>
              <Typography variant="h6">Unlock Release Percent (%)</Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                name="cycleReleasePercent"
                value={formik.values.cycleReleasePercent}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.cycleReleasePercent &&
                  Boolean(formik.errors.cycleReleasePercent)
                }
                helperText={
                  formik.touched.cycleReleasePercent &&
                  formik.errors.cycleReleasePercent
                }
                sx={{ mt: 1 }}
              />
            </div>
            <div>
              <Typography variant="h6">Unlock Schedule (minutes)</Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                name="cycleDuration"
                value={formik.values.cycleDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.cycleDuration &&
                  Boolean(formik.errors.cycleDuration)
                }
                helperText={
                  formik.touched.cycleDuration && formik.errors.cycleDuration
                }
                sx={{ mt: 1 }}
              />
            </div>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VestMuiDialog;
