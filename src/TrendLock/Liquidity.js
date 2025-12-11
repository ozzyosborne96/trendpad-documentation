import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Button,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Disclaimer from "../Components/Disclaimer";
import {
  LiquidityAllLockDetailsHandler,
  TokenMyLpDetails,
} from "../ContractAction/TrendLockAction";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import { getTokenDecimals } from "../ContractAction/ContractDependency";
import { ethers } from "ethers";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const Liquidity = () => {
  // Sample data for the table
  const rows = [
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0x123...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0x456...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0x789...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0xabc...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0xdef...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0xghi...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0x123...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0x456...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0x789...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0xabc...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0xdef...",
    },
    {
      name: "PEPEBRO/Wrapped BNB",
      symbol: "10,000,000 EGGY",
      address: "0xghi...",
    },
  ];
  const navigate = useNavigate(); // Get the navigate function from useNavigate

  // Pagination state
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [lockDetails, setLockDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [decimals, setDecimals] = useState(); // default to 18

  const account = useCurrentAccountAddress();

  // Handle change in page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page is changed
  };
  const handleNavigate = (tokenAddress, lockId, index, chainId) => {
    if (activeTab === "my-lock") {
      navigate("/trendlock/timer-lock-lp", {
        state: {
          data: tokenAddress,
          isTokenLp: false,
          lockId: lockId,
        },
      });
    } else if (activeTab === "all") {
      navigate(`/TrendLock/TokenInfo`, {
        state: {
          data: tokenAddress,
          isTokenLp: true,
          lockId: lockId,
          index: index,
          chainId: chainId,
        },
      });
    }
  };
  useEffect(() => {
    const fetchLockDetails = async () => {
      if (activeTab === "my-lock") {
        setLoading(true); // ✅ Start loading
        try {
          const lockdetails = await TokenMyLpDetails(account);
          console.log("LpD", lockdetails);
          setLockDetails(lockdetails);
        } catch (error) {
          console.error("Error fetching lock details:", error);
        }
        setLoading(false); // ✅ Stop loading
      } else if (activeTab === "all") {
        setLoading(true); // ✅ Start loading
        try {
          const lockdetails = await LiquidityAllLockDetailsHandler(account);
          console.log("farworld", lockdetails);
          setLockDetails(lockdetails);
        } catch (error) {
          console.error("Error fetching lock details:", error);
        }
        setLoading(false); // ✅ Stop loading
      }
    };
    fetchLockDetails();
  }, [activeTab]);
  useEffect(() => {
    const fetchTokenDecimals = async () => {
      if (lockDetails?.tokenAddress) {
        const decimals = await getTokenDecimals(lockDetails?.tokenAddress);
        setDecimals(decimals);
      }
    };
    fetchTokenDecimals();
  }, [lockDetails?.tokenAddress]);
  // Card component for mobile view
  const MobileLiquidityCard = ({ row }) => (
    <Box
      sx={{
        backgroundColor: "#111",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
        border: "1px solid #333",
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar alt={row.name} src="" />
        <Box>
          <Typography variant="body1" sx={{ color: "#fff", fontWeight: 600 }}>
            {row.symbol}
          </Typography>
          <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
            {row.name}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
          Amount
        </Typography>
        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
          {activeTab === "all" ? row?.amount : row?.amountLocked}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          onClick={() =>
            handleNavigate(
              row?.tokenAddress,
              row?.lockId,
              row?.originalIndex,
              row?.chainId
            )
          }
          sx={{
            color: "#1D64FA",
            textTransform: "none",
            fontWeight: "bold",
            padding: 0,
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          View Details &gt;
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      {/* Search Box */}
      <Box
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme), // Use shared card style
          marginBottom: "32px",
        })}
      >
        <Box mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by token address"
            sx={FairLaunchTheme.inputStyle}
          />
        </Box>
        {/* Table */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              sx={(theme) => {
                const isLight = theme.palette.mode === "light";
                const baseStyle = FairLaunchTheme.neonButton(theme);
                const isActive = activeTab === "all";
                // Colors
                const activeBg = isLight
                  ? "rgba(34, 153, 183, 0.1)"
                  : "rgba(0, 255, 255, 0.1)";
                const activeColor = isLight ? "#2299b7" : "#00FFFF";
                const activeBorder = isLight
                  ? "1px solid #2299b7"
                  : "1px solid #00FFFF";
                const inactiveBorder = isLight
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : "1px solid rgba(255, 255, 255, 0.1)";
                const inactiveColor = isLight
                  ? "#6B7280"
                  : "rgba(255, 255, 255, 0.6)";

                return {
                  ...baseStyle,
                  padding: "8px 24px",
                  background: isActive ? activeBg : "transparent",
                  boxShadow: isActive
                    ? isLight
                      ? "0 4px 10px rgba(34, 153, 183, 0.2)"
                      : "0 0 20px rgba(0, 255, 255, 0.3)"
                    : "none",
                  color: isActive
                    ? isLight
                      ? "#2299b7"
                      : "#00FFFF"
                    : inactiveColor,
                  border: isActive ? activeBorder : inactiveBorder,
                  "&:hover": {
                    background: isLight
                      ? "rgba(34, 153, 183, 0.2)"
                      : "rgba(0, 255, 255, 0.2)",
                    boxShadow: isLight
                      ? "0 6px 15px rgba(34, 153, 183, 0.3)"
                      : "0 0 25px rgba(0, 255, 255, 0.4)",
                    transform: "translateY(-2px)",
                  },
                };
              }}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>
            <Button
              sx={{
                ...FairLaunchTheme.neonButton,
                padding: "8px 24px",
                background:
                  activeTab === "my-lock"
                    ? "rgba(0, 255, 255, 0.1)"
                    : "transparent",
                boxShadow:
                  activeTab === "my-lock"
                    ? "0 0 20px rgba(0, 255, 255, 0.3)"
                    : "none",
                color:
                  activeTab === "my-lock"
                    ? "#00FFFF"
                    : "rgba(255, 255, 255, 0.6)",
                border:
                  activeTab === "my-lock"
                    ? "1px solid #00FFFF"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  background: "rgba(0, 255, 255, 0.2)",
                  boxShadow: "0 0 25px rgba(0, 255, 255, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => setActiveTab("my-lock")}
            >
              My Lock
            </Button>
          </div>
        </Box>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress sx={{ color: "#1D64FA" }} />
          </Box>
        ) : (
          <>
            {/* Desktop View: Table */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <TableContainer
                component={Paper}
                sx={{ background: "transparent", boxShadow: "none" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      {["Token", "Amount", ""].map((header, index) => (
                        <TableCell
                          key={index}
                          sx={(theme) => ({
                            borderBottom:
                              theme.palette.mode === "light"
                                ? "1px solid #E5E7EB"
                                : "1px solid #333",
                            color:
                              theme.palette.mode === "light"
                                ? "#6B7280"
                                : "#9CA3AF",
                            paddingY: "16px",
                            fontWeight: 600,
                          })}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lockDetails
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, i) => {
                        const actualIndex = page * rowsPerPage + i;
                        return (
                          <TableRow
                            key={actualIndex}
                            hover
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              sx={(theme) => ({
                                borderBottom:
                                  theme.palette.mode === "light"
                                    ? "1px solid #E5E7EB"
                                    : "1px solid #333",
                                color: theme.palette.text.primary,
                                paddingY: "16px",
                              })}
                            >
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar alt={row.name} src="" />
                                <Box>
                                  <Typography
                                    fontWeight={600}
                                    sx={{
                                      color: (theme) =>
                                        theme.palette.text.primary,
                                    }}
                                  >
                                    {row.symbol}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#9CA3AF" }}
                                  >
                                    {row.name}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={(theme) => ({
                                borderBottom:
                                  theme.palette.mode === "light"
                                    ? "1px solid #E5E7EB"
                                    : "1px solid #333",
                                color: theme.palette.text.primary,
                                paddingY: "16px",
                                fontWeight: 500,
                              })}
                            >
                              {activeTab === "all"
                                ? row?.amount
                                : row?.amountLocked}
                            </TableCell>
                            <TableCell
                              sx={(theme) => ({
                                borderBottom:
                                  theme.palette.mode === "light"
                                    ? "1px solid #E5E7EB"
                                    : "1px solid #333",
                                textAlign: "right",
                                paddingY: "16px",
                              })}
                            >
                              <Button
                                onClick={() =>
                                  handleNavigate(
                                    row?.tokenAddress,
                                    row?.lockId,
                                    row?.originalIndex,
                                    row?.chainId
                                  )
                                }
                                sx={{
                                  color: "#1D64FA",
                                  fontWeight: "bold",
                                  textTransform: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                    backgroundColor: "transparent",
                                  },
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile View: Cards */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {lockDetails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  const actualIndex = page * rowsPerPage + i;
                  return <MobileLiquidityCard key={actualIndex} row={row} />;
                })}
              {lockDetails.length === 0 && (
                <Typography sx={{ color: "#666", textAlign: "center", py: 4 }}>
                  No locks found
                </Typography>
              )}
            </Box>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={lockDetails.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={(theme) => ({
                color: theme.palette.mode === "light" ? "#1F2937" : "white",
                backgroundColor: "transparent",
                borderTop:
                  theme.palette.mode === "light"
                    ? "1px solid #E5E7EB"
                    : "1px solid #333",
              })}
            />
          </>
        )}
      </Box>

      {/* Disclaimer */}
      <Disclaimer />
    </Container>
  );
};

export default Liquidity;
