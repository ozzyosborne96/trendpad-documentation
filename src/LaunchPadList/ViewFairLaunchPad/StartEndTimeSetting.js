import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../../Components/DatePicker";
import { fairSetEndAndStartTimeHandler } from "../../ContractAction/FairLaunchPadAction";
import { toast } from "react-hot-toast";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const StartEndTimeSetting = ({ open, handleClose, poolAddr, setUpdate, update }) => {
  const validationSchema = Yup.object().shape({
    startTime: Yup.date().required("Start time is required"),
    endTime: Yup.date()
      .required("End time is required")
      .min(Yup.ref("startTime"), "End time must be after start time"),
  });

  const initialValues = {
    startTime: null,
    endTime: null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await fairSetEndAndStartTimeHandler(
        poolAddr,
        values.startTime,
        values.endTime
      );
      if (result) {
        toast.success("Start and End time set successfully ✅");
        handleClose();
        setUpdate((prev) => !prev);
      } else {
        toast.error("Failed to set times ❌");
      }
    } catch (error) {
      console.error("Error setting times:", error);
      toast.error("Error occurred ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { backgroundColor: (theme) => theme.palette.background.paper, borderRadius: 2 } }}
    >
      <DialogTitle sx={{ color: "white" }}>Set Start and End Time</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <CustomDatePicker
                label="Start Time"
                value={values.startTime}
                onChange={(val) => setFieldValue("startTime", val)}
              />
              {touched.startTime && errors.startTime && (
                <Typography color="error" fontSize={13}>
                  {errors.startTime}
                </Typography>
              )}

              <CustomDatePicker
                label="End Time"
                value={values.endTime}
                onChange={(val) => setFieldValue("endTime", val)}
              />
              {touched.endTime && errors.endTime && (
                <Typography color="error" fontSize={13}>
                  {errors.endTime}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: "white" }} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#1976d2" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default StartEndTimeSetting;
