import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { connectWallet } from "../Wallet/connect"; // Adjust path to your wallet connect function

const ConnectWalletPrompt = () => {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        backgroundColor: "#1e1e1e",
        color: "#fff",
        borderRadius: "20px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Please connect your wallet to access the dashboard.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={connectWallet}
        sx={{ mt: 2 }}
      >
        Connect Wallet
      </Button>
    </Box>
  );
};

export default ConnectWalletPrompt;
