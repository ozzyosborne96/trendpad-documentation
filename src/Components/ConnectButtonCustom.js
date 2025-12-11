import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Typography, Button, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const ConnectButtonCustom = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant="outlined"
                    aria-label="Connect your cryptocurrency wallet to TrendPad"
                    sx={{
                      borderRadius: "17px",
                      border: "2px solid #2299b7",
                      textTransform: "none",
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      padding: { xs: "8px 12px", md: "10px 20px" },
                      color: "text.primary",
                      gap: 1,
                      width: "100%",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        border: "2px solid #2299b7",
                        background: "rgba(34, 153, 183, 0.1)",
                      },
                    }}
                  >
                    Connect Wallet
                    <img
                      src="/images/fluent_wallet-credit-card-16-regular.png"
                      alt="Wallet"
                      style={{ width: 20, height: 20 }}
                    />
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="contained"
                    color="error"
                    sx={{
                      borderRadius: "17px",
                      textTransform: "none",
                      fontSize: { xs: "0.9rem", md: "1.1rem" },
                      padding: { xs: "8px 12px", md: "10px 20px" },
                      width: "100%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Wrong Network
                  </Button>
                );
              }

              return (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Button
                    onClick={openChainModal}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                      color: "text.primary",
                      textTransform: "none",
                      minWidth: "auto",
                      padding: "8px",
                      "&:hover": { background: "rgba(255, 255, 255, 0.05)" },
                    }}
                  >
                    {chain.hasIcon && (
                      <Box
                        component="img"
                        src={chain.iconUrl}
                        alt={chain.name ?? "Chain icon"}
                        sx={{ width: 28, height: 28, borderRadius: 999 }}
                      />
                    )}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    variant="outlined"
                    aria-label={`View wallet details for ${account.displayName}`}
                    sx={{
                      borderRadius: "17px",
                      border: "2px solid #2299b7",
                      textTransform: "none",
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      padding: { xs: "8px 12px", md: "10px 20px" },
                      color: "text.primary",
                      gap: 1,
                      width: "100%",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        border: "2px solid #2299b7",
                        background: "rgba(34, 153, 183, 0.1)",
                      },
                    }}
                  >
                    {account.displayName}
                    <img
                      src="/images/fluent_wallet-credit-card-16-regular.png"
                      alt="Wallet"
                      style={{ width: 20, height: 20 }}
                    />
                  </Button>
                </Box>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectButtonCustom;
