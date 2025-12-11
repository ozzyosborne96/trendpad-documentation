import React from "react";
import {
  Box,
  Grid,
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableBody,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
// Import FairLaunchTheme (adjust path if necessary)
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const CustomTokenTable = ({ tokenDetails, tokenAddress, loading, variant }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const hasTokenAddress = !!tokenAddress;
  const hasValidTokenDetails =
    tokenDetails && Object.keys(tokenDetails).length > 0;

  const isFairLaunch = variant === "fairLaunch";

  const tokenRows = [
    {
      label: "Token Name",
      value: tokenDetails?.name,
    },
    {
      label: "Token Symbol",
      value: tokenDetails?.symbol,
    },
    {
      label: "Decimals",
      value: tokenDetails?.decimals,
    },
    {
      label: "Total Supply",
      value: tokenDetails?.totalSupply,
    },
    {
      label: "Balance",
      value: tokenDetails?.balance,
    },
  ];

  // Styles for Fair Launch Variant
  const fairLaunchStyles = {
    container: {
      ...FairLaunchTheme.cardStyle(theme),
      padding: 0, // Reset padding for table
      overflow: "hidden",
      border:
        theme.palette.mode === "light"
          ? "1px solid rgba(0, 0, 0, 0.1)"
          : "1px solid rgba(0, 255, 255, 0.2)",
      boxShadow:
        theme.palette.mode === "light"
          ? "0 4px 20px rgba(0, 0, 0, 0.05)"
          : "0 0 15px rgba(0, 255, 255, 0.05)",
    },
    headerRow: {
      background:
        theme.palette.mode === "light"
          ? "rgba(34, 153, 183, 0.1)"
          : "rgba(0, 0, 0, 0.2)",
      borderBottom:
        theme.palette.mode === "light"
          ? "1px solid rgba(34, 153, 183, 0.2)"
          : "1px solid rgba(0, 255, 255, 0.2)",
    },
    headerCell: {
      color: theme.palette.mode === "light" ? "#2299b7" : "#00FFFF",
      fontWeight: 700,
      fontSize: "1rem",
      borderBottom: "none",
    },
    row: {
      borderBottom:
        theme.palette.mode === "light"
          ? "1px solid rgba(0, 0, 0, 0.05)"
          : "1px solid rgba(255, 255, 255, 0.05)",
      background:
        theme.palette.mode === "light"
          ? "rgba(255,255,255,0.5)"
          : "transparent",
      "&:hover": {
        background:
          theme.palette.mode === "light"
            ? "rgba(34, 153, 183, 0.05)"
            : "rgba(0, 255, 255, 0.05)",
      },
      "&:last-child": {
        borderBottom: "none",
      },
    },
    cellLabel: {
      color: theme.palette.mode === "light" ? "#4B5563" : "#E5E7EB",
      fontWeight: 500,
      borderBottom: "none",
    },
    cellValue: {
      color: theme.palette.mode === "light" ? "#1F2937" : "#E5E7EB",
      fontWeight: 500,
      borderBottom: "none",
    },
  };

  // Mobile Card View
  const MobileView = () => (
    <Box sx={{ width: "100%" }}>
      {tokenRows.map((row, index) => (
        <Card
          key={index}
          sx={
            isFairLaunch
              ? {
                  mb: 1.5,
                  background:
                    theme.palette.mode === "light"
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(0, 0, 0, 0.2)",
                  border:
                    theme.palette.mode === "light"
                      ? "1px solid rgba(34, 153, 183, 0.2)"
                      : "1px solid rgba(0, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  borderRadius: "12px",
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 2px 8px rgba(0,0,0,0.05)"
                      : "none",
                }
              : {
                  mb: 1.5,
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(180deg, rgba(16, 30, 50, 0.95) 0%, rgba(8, 15, 25, 0.95) 100%)"
                      : "linear-gradient(180deg, rgba(235, 245, 255, 0.9) 0%, rgba(240, 248, 255, 0.95) 100%)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(66, 165, 245, 0.3)"
                      : "rgba(33, 150, 243, 0.3)"
                  }`,
                  borderRadius: "12px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 8px 24px rgba(33, 150, 243, 0.15)"
                        : "0 8px 24px rgba(33, 150, 243, 0.1)",
                    borderColor: "#2196f3",
                  },
                }
          }
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={
                  isFairLaunch
                    ? {
                        fontWeight: 600,
                        color:
                          theme.palette.mode === "light"
                            ? "#2299b7"
                            : "#00FFFF", // Neon Cyan for label
                        fontSize: "0.875rem",
                      }
                    : {
                        fontWeight: 600,
                        color:
                          theme.palette.mode === "dark" ? "#64b5f6" : "#1976d2",
                        fontSize: "0.875rem",
                      }
                }
              >
                {row.label}
              </Typography>
              <Typography
                variant="body2"
                sx={
                  isFairLaunch
                    ? {
                        fontWeight: 500,
                        color:
                          theme.palette.mode === "light"
                            ? "#1F2937"
                            : "#E5E7EB", // White/Grey for value
                        fontSize: "0.875rem",
                        textAlign: "right",
                        wordBreak: "break-all",
                        maxWidth: "60%",
                      }
                    : {
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        fontSize: "0.875rem",
                        textAlign: "right",
                        wordBreak: "break-all",
                        maxWidth: "60%",
                      }
                }
              >
                {row.value}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Desktop Table View
  const DesktopView = () => (
    <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
      <TableContainer
        component={Paper}
        sx={
          isFairLaunch
            ? fairLaunchStyles.container
            : {
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(180deg, rgba(16, 30, 50, 0.95) 0%, rgba(8, 15, 25, 0.95) 100%)"
                    : "linear-gradient(180deg, rgba(235, 245, 255, 0.9) 0%, rgba(240, 248, 255, 0.95) 100%)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: `2px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(66, 165, 245, 0.3)"
                    : "rgba(33, 150, 243, 0.3)"
                }`,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                    : "0 8px 32px rgba(33, 150, 243, 0.08)",
                overflow: "hidden",
              }
        }
      >
        <Table>
          <TableHead>
            <TableRow
              sx={
                isFairLaunch
                  ? fairLaunchStyles.headerRow
                  : {
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(33, 150, 243, 0.1)"
                          : "rgba(33, 150, 243, 0.08)",
                      borderBottom: `2px solid ${
                        theme.palette.mode === "dark" ? "#2196f3" : "#1976d2"
                      }`,
                    }
              }
            >
              <TableCell
                sx={
                  isFairLaunch
                    ? {
                        ...fairLaunchStyles.headerCell,
                        width: "40%",
                        textAlign: "center",
                        padding: "16px",
                      }
                    : {
                        color:
                          theme.palette.mode === "dark" ? "#64b5f6" : "#1565c0",
                        fontWeight: 700,
                        fontSize: "1rem",
                        width: "40%",
                        textAlign: "center",
                        padding: "16px",
                        letterSpacing: "0.5px",
                      }
                }
              >
                Property
              </TableCell>
              <TableCell
                sx={
                  isFairLaunch
                    ? {
                        ...fairLaunchStyles.headerCell,
                        width: "60%",
                        textAlign: "center",
                        padding: "16px",
                      }
                    : {
                        color:
                          theme.palette.mode === "dark" ? "#64b5f6" : "#1565c0",
                        fontWeight: 700,
                        fontSize: "1rem",
                        width: "60%",
                        textAlign: "center",
                        padding: "16px",
                        letterSpacing: "0.5px",
                      }
                }
              >
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokenRows.map((row, index) => (
              <TableRow
                key={index}
                sx={
                  isFairLaunch
                    ? fairLaunchStyles.row
                    : {
                        borderBottom: `1px solid ${
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.08)"
                        }`,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background:
                            theme.palette.mode === "dark"
                              ? "rgba(33, 150, 243, 0.08)"
                              : "rgba(33, 150, 243, 0.12)",
                          transform: "scale(1.01)",
                        },
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }
                }
              >
                <TableCell
                  sx={
                    isFairLaunch
                      ? {
                          ...fairLaunchStyles.cellLabel,
                          textAlign: "center",
                          padding: "14px 16px",
                          fontSize: "0.95rem",
                        }
                      : {
                          color: theme.palette.text.primary,
                          textAlign: "center",
                          padding: "14px 16px",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                        }
                  }
                >
                  {row.label}
                </TableCell>
                <TableCell
                  sx={
                    isFairLaunch
                      ? {
                          ...fairLaunchStyles.cellValue,
                          textAlign: "center",
                          padding: "14px 16px",
                          fontSize: "0.95rem",
                        }
                      : {
                          color: theme.palette.text.primary,
                          textAlign: "center",
                          padding: "14px 16px",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }
                  }
                >
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <div>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={
            isFairLaunch
              ? {
                  ...fairLaunchStyles.container,
                  border:
                    theme.palette.mode === "light"
                      ? "1px dashed rgba(34, 153, 183, 0.3)"
                      : "1px dashed rgba(0, 255, 255, 0.3)",
                  boxShadow: "none",
                }
              : {
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.02)"
                      : "rgba(0, 0, 0, 0.02)",
                  borderRadius: "16px",
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)"
                  }`,
                }
          }
        >
          <CircularProgress
            sx={{
              color:
                isFairLaunch && theme.palette.mode === "light"
                  ? "#2299b7"
                  : isFairLaunch
                  ? "#00FFFF"
                  : "#2196f3",
            }}
          />
        </Box>
      ) : !loading && hasTokenAddress ? (
        hasValidTokenDetails ? (
          <Grid item xs={12}>
            {isMobile ? <MobileView /> : <DesktopView />}
          </Grid>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
            sx={
              isFairLaunch
                ? {
                    ...FairLaunchTheme.warningBox(theme),
                    p: 4,
                  }
                : {
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 0, 0, 0.05)"
                        : "rgba(255, 0, 0, 0.08)",
                    borderRadius: "16px",
                    border: `2px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(255, 0, 0, 0.3)"
                        : "rgba(255, 0, 0, 0.4)"
                    }`,
                  }
            }
          >
            <Typography
              variant="h6"
              sx={{
                color: isFairLaunch
                  ? "#FF4444"
                  : theme.palette.mode === "dark"
                  ? "#FF5252"
                  : "#D32F2F",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              ⚠️ Invalid token or token details not found
            </Typography>
          </Box>
        )
      ) : null}
    </div>
  );
};

export default CustomTokenTable;
