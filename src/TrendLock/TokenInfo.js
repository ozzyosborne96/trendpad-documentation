import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import useGetTokenDetails from "../Hooks/GetTokenDetails";
import {
  lockInfoForLock,
  lockInfoForLockForLp,
  totalLockCountforUserHandler,
  identifyDEXName,
} from "../ContractAction/TrendLockAction";
import { isLpToken } from "../ContractAction/DexContractActionData";
import { getChainInfo } from "../ContractAction/ContractDependency";
import Disclaimer from "../Components/Disclaimer";
import { useLocation, useNavigate } from "react-router-dom";
import TradingChart from "../Components/TradingViewWidget";
import TokenAddressLink from "../Components/TokenAddressLink";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const TokenInfo = () => {
  const fetchTokenDetails = useGetTokenDetails();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLp, setIsLp] = useState(false);
  const indexLock = location?.state?.index;
  console.log("indexLock", indexLock);
  const tokenAddress = location?.state?.data;
  console.log("location?.state?.data", location?.state?.data);
  const chainIdState = location?.state?.chainId;

  // State Management
  const [tokenDetails, setTokenDetails] = useState(null);
  const [tokenDetails1, setTokenDetails1] = useState(null);
  const [dexName, setDexName] = useState();
  const [loadingToken, setLoadingToken] = useState(true);
  const [loadingLock, setLoadingLock] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [lockRecord, setLockRecord] = useState([]);

  useEffect(() => {
    async function fetchLockDetails() {
      try {
        let chainId = chainIdState;
        if (!chainId) {
          const info = await getChainInfo();
          chainId = info.chainId;
        }
        const tokenInfo = await fetchTokenDetails(tokenAddress, chainId);
        setTokenDetails(tokenInfo);
        const dexName = await identifyDEXName(tokenAddress, chainId);
        console.log("dexName", dexName);
        setDexName(dexName);
      } catch (error) {
        console.error("Error fetching token details:", error);
      } finally {
        setLoadingToken(false);
      }
      let lockData;
      try {
        const isLpTokenValue = await isLpToken(tokenAddress);
        setIsLp(isLpTokenValue);
        if (isLpTokenValue) {
          lockData = await lockInfoForLockForLp(indexLock, chainIdState);
        } else {
          lockData = await lockInfoForLock(indexLock, chainIdState);
        }
        setTokenDetails1((prev) => ({ ...prev, lockData }));
      } catch (error) {
        console.error("Error fetching lock details:", error);
      } finally {
        setLoadingLock(false);
      }

      try {
        const lockRecords = await totalLockCountforUserHandler(
          tokenAddress,
          chainIdState
        );
        setLockRecord(lockRecords);
      } catch (error) {
        console.error("Error fetching lock records:", error);
      } finally {
        setLoadingRecords(false);
      }
    }

    fetchLockDetails();
  }, [indexLock, tokenAddress]);

  const lockInfo = [
    {
      label: "Current Locked Amount",
      value: tokenDetails1?.lockData?.amount || "-",
    },
    { label: "Current Values Locked", value: "$0" },
    {
      label: "Token Address",
      value: (
        <TokenAddressLink
          address={tokenAddress}
          color="#1D64FA"
          truncate={true}
          showCopyIcon={true}
        />
      ),
      isLink: false,
    },
    { label: "Token Name", value: tokenDetails?.name || "-" },
    { label: "Token Symbol", value: tokenDetails?.symbol || "-" },
    { label: "Token Decimals", value: tokenDetails?.decimals || "-" },
    ...(isLp ? [{ label: "DexName", value: dexName || "-" }] : []),
  ];

  const handleNavigate = (lockId, tokenAddress) => {
    navigate("/trendlock/timer-lock", {
      state: { data: tokenAddress, lockId, chainId: chainIdState },
    });
  };

  // Card component for mobile view of Lock Records
  const MobileLockRecordCard = ({ row }) => (
    <Box
      sx={(theme) => ({
        ...FairLaunchTheme.cardStyle(theme),
        padding: "16px",
        marginBottom: "12px",
      })}
    >
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          Wallet
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 600 }}
        >
          <TokenAddressLink
            address={row.wallet}
            color={(theme) =>
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : "#fff"
            }
            truncate={true}
            showCopyIcon={true}
          />
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          Amount
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 600 }}
        >
          {row.amount}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          Unlock Time
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 600 }}
        >
          {row.unLockDate}
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          Action
        </Typography>
        <Box
          onClick={() => handleNavigate(row.lockId, row.tokenAddress)}
          sx={{
            color: "#1D64FA",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          View &gt;
        </Box>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        {loadingToken ? (
          <CircularProgress />
        ) : (
          tokenDetails?.symbol && (
            <TradingChart symbol={tokenDetails.symbol} isLp={isLp} />
          )
        )}
      </Box>

      {/* Lock Info Section */}
      <Box mt={4} sx={(theme) => FairLaunchTheme.cardStyle(theme)}>
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            marginBottom: "24px",
          })}
        >
          Lock Info
        </Typography>

        {loadingLock ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {lockInfo.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingY: "12px",
                  borderBottom: (theme) =>
                    index !== lockInfo.length - 1
                      ? `1px solid ${
                          theme.palette.mode === "light"
                            ? theme.palette.divider
                            : "#333"
                        }`
                      : "none",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    fontSize: { xs: "14px", md: "16px" },
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: (theme) =>
                      item.isLink ? "#1D64FA" : theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: { xs: "14px", md: "16px" },
                    textAlign: "right",
                  }}
                >
                  {item.isLink ? item.value : item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Lock Records Section */}
      <Box mt={4} mb={4} sx={(theme) => FairLaunchTheme.cardStyle(theme)}>
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            marginBottom: "20px",
          })}
        >
          Lock Records
        </Typography>

        {loadingRecords ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Desktop View: Table */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[
                        "Wallet",
                        "Amount",
                        "Unlock Schedule (minutes)",
                        "Unlock Rate (%)",
                        "TGE (%)",
                        "Unlock Time (UTC)",
                        "Actions",
                      ].map((header, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            borderBottom: (theme) =>
                              `1px solid ${theme.palette.divider}`,
                            color: (theme) => theme.palette.text.secondary,
                            paddingY: "16px",
                            fontWeight: 600,
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lockRecord
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow
                          key={index}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                              borderColor: (theme) => theme.palette.divider,
                            }}
                          >
                            <TokenAddressLink
                              address={row.wallet}
                              color={(theme) =>
                                theme.palette.mode === "light"
                                  ? theme.palette.primary.main
                                  : "#F3F4F6"
                              }
                              truncate={true}
                              showCopyIcon={true}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                              borderColor: (theme) => theme.palette.divider,
                            }}
                          >
                            {row.amount}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                              borderColor: (theme) => theme.palette.divider,
                            }}
                          >
                            {row.cycleRelease}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                              borderColor: (theme) => theme.palette.divider,
                            }}
                          >
                            {row.tgeDate}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                              borderColor: (theme) => theme.palette.divider,
                            }}
                          >
                            {row.cycle}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                              borderColor: (theme) => theme.palette.divider,
                            }}
                          >
                            {row.unLockDate}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#1D64FA",
                              borderColor: (theme) => theme.palette.divider,
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                            onClick={() =>
                              handleNavigate(row.lockId, row.tokenAddress)
                            }
                          >
                            View
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile View: Cards */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {lockRecord
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <MobileLockRecordCard key={index} row={row} />
                ))}
              {lockRecord.length === 0 && (
                <Typography
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    textAlign: "center",
                    py: 4,
                  }}
                >
                  No records found
                </Typography>
              )}
            </Box>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={lockRecord.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) =>
                setRowsPerPage(parseInt(event.target.value, 10))
              }
              sx={{
                color: (theme) => theme.palette.text.primary,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
          </>
        )}
      </Box>

      <Disclaimer />
    </Container>
  );
};

export default TokenInfo;
