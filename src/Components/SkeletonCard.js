import React from "react";
import { Box, Skeleton } from "@mui/material";

const SkeletonCard = ({ variant = "default" }) => {
  if (variant === "token") {
    return (
      <Box
        sx={{
          width: "270px",
          height: "280px",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          borderRadius: "16px",
          border: (theme) =>
            `2px solid ${
              theme.palette.mode === "light" ? "#E0E0E0" : "#292929"
            }`,
          background: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "#0D0D0F",
        }}
        role="status"
        aria-label="Loading card"
      >
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="90%" height={60} />
      </Box>
    );
  }

  if (variant === "launchpad") {
    return (
      <Box
        sx={{
          padding: "32px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          borderRadius: "16px",
          border: (theme) =>
            `2px solid ${
              theme.palette.mode === "light" ? "#E0E0E0" : "#2b2b33"
            }`,
          background: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "#121212",
          minWidth: "270px",
        }}
        role="status"
        aria-label="Loading launchpad"
      >
        <Skeleton variant="circular" width={60} height={60} />
        <Skeleton variant="text" width="70%" height={25} />
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={36} />
      </Box>
    );
  }

  // Default card skeleton
  return (
    <Box
      sx={{
        padding: "24px",
        borderRadius: "8px",
        border: (theme) =>
          `1px solid ${theme.palette.mode === "light" ? "#E0E0E0" : "#3A3A3A"}`,
      }}
      role="status"
      aria-label="Loading"
    >
      <Skeleton variant="text" width="60%" height={30} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={100}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default SkeletonCard;
