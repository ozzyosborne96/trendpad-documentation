import React from "react";
import { Alert, Button, Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const ErrorAlert = ({
  error,
  onRetry,
  severity = "error",
  title = "Something went wrong",
  showRetry = true,
}) => {
  if (!error) return null;

  const getErrorMessage = (err) => {
    if (typeof err === "string") return err;
    if (err?.message) return err.message;
    if (err?.error) return err.error;
    return "An unexpected error occurred. Please try again.";
  };

  return (
    <Box sx={{ my: 2 }} role="alert" aria-live="assertive">
      <Alert
        severity={severity}
        action={
          showRetry && onRetry ? (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
              aria-label="Retry action"
            >
              Retry
            </Button>
          ) : null
        }
      >
        <strong>{title}</strong>
        <br />
        {getErrorMessage(error)}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
