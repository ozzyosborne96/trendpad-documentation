import React from "react";
import { CircularProgress, Box } from "@mui/material";

const LoadingSpinner = ({
  size = 40,
  color = "primary",
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          width: "100%",
        }}
        role="status"
        aria-label="Loading content"
      >
        <CircularProgress size={size} color={color} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "inline-flex" }} role="status" aria-label="Loading">
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default LoadingSpinner;
