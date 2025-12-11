import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const MultiSenderSuccess = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <Box
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          padding: "40px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          margin: "20px",
        })}
      >
        <CheckCircleIcon sx={{ fontSize: 80, color: "#4CAF50", mb: 2 }} />
        <Typography
          variant="h4"
          gutterBottom
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            fontWeight: "bold",
          })}
        >
          MultiSender Transaction
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: (theme) => theme.palette.text.secondary, mb: 4 }}
        >
          Done Successfully!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/others/Multisender")}
          sx={(theme) => FairLaunchTheme.neonButton(theme)}
        >
          Send More
        </Button>
      </Box>
    </Box>
  );
};

export default MultiSenderSuccess;
