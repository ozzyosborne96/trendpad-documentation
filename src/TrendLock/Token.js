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
  TokenMyLockDetails,
  allLockDetailsHandler,
} from "../ContractAction/TrendLockAction";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import { ethers } from "ethers";
import { getTokenDecimals } from "../ContractAction/ContractDependency";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const Token = () => {
  const [activeTab, setActiveTab] = useState("all");
  const account = useCurrentAccountAddress();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [lockDetails, setLockDetails] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Loader state
  const [decimals, setDecimals] = useState();
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          index: index, // This should be originalIndex from recent update
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
          const lockdetails = await TokenMyLockDetails(account);
          setLockDetails(lockdetails);
          console.log("lockdetails", lockdetails);
        } catch (error) {
          console.error("Error fetching lock details:", error);
        }
        setLoading(false); // ✅ Stop loading
      } else if (activeTab === "all") {
        setLoading(true); // ✅ Start loading
        try {
          const lockdetails = await allLockDetailsHandler(account);
          console.log("lockdetails", lockdetails);
          setLockDetails(lockdetails);
        } catch (error) {
          console.error("Error fetching lock details:", error);
        }
        setLoading(false); // ✅ Stop loading
      }
    };
    fetchLockDetails();
  }, [activeTab, account]);
  const startIndex = page * rowsPerPage;

  // Card component for mobile view
  const MobileTokenCard = ({ row }) => (
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

        {/* ✅ Show Loader when fetching data */}
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
                      .map((row, index) => (
                        <TableRow
                          key={startIndex + index}
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
                              color:
                                theme.palette.mode === "light"
                                  ? "#1F2937"
                                  : "white",
                              paddingY: "16px",
                            })}
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar alt={row.name} src="" />
                              <Box>
                                <Typography
                                  fontWeight={600}
                                  sx={(theme) => ({
                                    color:
                                      theme.palette.mode === "light"
                                        ? "#1F2937"
                                        : "#fff",
                                  })}
                                >
                                  {row.symbol}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={(theme) => ({
                                    color:
                                      theme.palette.mode === "light"
                                        ? "#6B7280"
                                        : "#9CA3AF",
                                  })}
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
                              color:
                                theme.palette.mode === "light"
                                  ? "#4B5563"
                                  : "#F3F4F6",
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
                                textDecoration: "none",
                                fontWeight: "bold",
                                textTransform: "none",
                                "&:hover": {
                                  textDecoration: "underline",
                                  color: "#1D64FA",
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile View: Cards */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {lockDetails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <MobileTokenCard key={startIndex + index} row={row} />
                ))}
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

      <Disclaimer />
    </Container>
  );
};

export default Token;
