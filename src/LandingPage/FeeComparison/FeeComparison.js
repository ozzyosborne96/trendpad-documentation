import React from "react";
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
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const comparisonData = [
  {
    network: "BSC Mainnet",
    trendpadLaunch: "0.5 BNB + 3%",
    pinkSalePresale: "1 BNB + 5%",
    trendpadMulti: "0.01 BNB",
    pinkSaleAir: "0.5 BNB + 1%",
    trendLock: "Free",
    pinkLock: "Free",
  },
  {
    network: "Polygon (POL)",
    trendpadLaunch: "50 POL + 3%",
    pinkSalePresale: "100 POL + 5%",
    trendpadMulti: "0.01 POL",
    pinkSaleAir: "50 POL + 1%",
    trendLock: "Free",
    pinkLock: "Free",
  },
  {
    network: "Celo",
    trendpadLaunch: "300 CELO + 3%",
    pinkSalePresale: "—",
    trendpadMulti: "0.01 CELO",
    pinkSaleAir: "—",
    trendLock: "Free",
    pinkLock: "Free",
  },
  {
    network: "Ethereum",
    trendpadLaunch: "0.1 ETH + 3%",
    pinkSalePresale: "0.2 ETH + 5%",
    trendpadMulti: "0.01 ETH",
    pinkSaleAir: "0.1 ETH + 1%",
    trendLock: "Free",
    pinkLock: "Free",
  },
  {
    network: "Avalanche",
    trendpadLaunch: "5 AVAX + 3%",
    pinkSalePresale: "10 AVAX + 5%",
    trendpadMulti: "0.01 AVAX",
    pinkSaleAir: "5 AVAX + 1%",
    trendLock: "Free",
    pinkLock: "Free",
  },
  {
    network: "Arbitrum",
    trendpadLaunch: "0.1 ETH + 3%",
    pinkSalePresale: "0.2 ETH + 5%",
    trendpadMulti: "0.01 ETH",
    pinkSaleAir: "0.1 ETH + 1%",
    trendLock: "Free",
    pinkLock: "Free",
  },
  {
    network: "Optimism",
    trendpadLaunch: "0.1 ETH + 3%",
    pinkSalePresale: "0.2 ETH + 5%",
    trendpadMulti: "0.01 ETH",
    pinkSaleAir: "0.1 ETH + 1%",
    trendLock: "Free",
    pinkLock: "Free",
  },
  {
    network: "Base",
    trendpadLaunch: "0.1 ETH + 3%",
    pinkSalePresale: "0.2 ETH + 5%",
    trendpadMulti: "0.01 ETH",
    pinkSaleAir: "0.1 ETH + 1%",
    trendLock: "Free",
    pinkLock: "Free",
  },
  {
    network: "Fantom",
    trendpadLaunch: "300 FTM + 3%",
    pinkSalePresale: "300 FTM + 5%",
    trendpadMulti: "0.01 FTM",
    pinkSaleAir: "—",
    trendLock: "Free",
    pinkLock: "Free",
  },
];

const FeeComparison = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const headerStyle = {
    background:
      theme.palette.mode === "light"
        ? "linear-gradient(90deg, #2299b7 0%, #1A1C66 100%)"
        : "linear-gradient(90deg, #00FFFF 0%, #A855F7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    mb: 4,
    textAlign: "center",
  };

  const tableHeaderCellStyle = (isTrendPad = false) => ({
    background:
      theme.palette.mode === "light"
        ? isTrendPad
          ? "rgba(34, 153, 183, 0.1)"
          : "#f5f5f5"
        : isTrendPad
        ? "rgba(0, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.05)",
    color:
      theme.palette.mode === "light"
        ? isTrendPad
          ? "#1A1C66"
          : "#666"
        : isTrendPad
        ? "#00FFFF"
        : "#aaa",
    fontWeight: "bold",
    borderBottom: `1px solid ${
      theme.palette.mode === "light"
        ? "rgba(0,0,0,0.1)"
        : "rgba(255,255,255,0.1)"
    }`,
    whiteSpace: "nowrap",
    textAlign: "center",
    fontSize: "0.9rem",
    padding: "16px",
    verticalAlign: "bottom",
  });

  // Specifically to group headers
  const groupHeaderStyle = (isTrendPad) => ({
    ...tableHeaderCellStyle(isTrendPad),
    borderBottom: "none",
    fontSize: "1rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
  });

  const cellStyle = (isTrendPad = false) => ({
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${
      theme.palette.mode === "light"
        ? "rgba(0,0,0,0.05)"
        : "rgba(255,255,255,0.05)"
    }`,
    background:
      theme.palette.mode === "light"
        ? isTrendPad
          ? "rgba(34, 153, 183, 0.03)"
          : "transparent"
        : isTrendPad
        ? "rgba(0, 255, 255, 0.03)"
        : "transparent",
    textAlign: "center",
    fontWeight: isTrendPad ? 600 : 400,
    fontSize: "0.875rem",
    padding: "12px 16px",
  });

  return (
    <Box section id="fee-comparison" sx={{ py: 6 }}>
      <Container>
        <Typography variant="h3" sx={headerStyle}>
          Competitive Fee Structure
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: theme.palette.text.secondary,
            mb: 4,
            fontWeight: 400,
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          Save up to 50% on launch fees across 11+ networks. Compare our
          transparent pricing with competitors and see why projects choose
          TrendPad for their token launches, airdrops, and liquidity locking.
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "16px",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 8px 32px rgba(0,0,0,0.05)"
                : "0 8px 32px rgba(0,0,0,0.3)",
            background:
              theme.palette.mode === "light"
                ? "#fff"
                : "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
            border: `1px solid ${
              theme.palette.mode === "light"
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.05)"
            }`,
            overflowX: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  rowSpan={2}
                  sx={{
                    ...tableHeaderCellStyle(false),
                    textAlign: "left",
                    minWidth: "150px",
                    position: "sticky",
                    left: 0,
                    zIndex: 10,
                    background:
                      theme.palette.mode === "light" ? "#fff" : "#1a1a2e", // Opaque for sticky
                    borderRight: `1px solid ${
                      theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)"
                    }`,
                  }}
                >
                  Network
                </TableCell>
                <TableCell colSpan={2} sx={groupHeaderStyle(true)}>
                  Launchpad / Presale
                </TableCell>
                <TableCell colSpan={2} sx={groupHeaderStyle(false)}>
                  Airdrop / MultiSend
                </TableCell>
                <TableCell colSpan={2} sx={groupHeaderStyle(true)}>
                  Locking Fees
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableHeaderCellStyle(true)}>TrendPad</TableCell>
                <TableCell sx={tableHeaderCellStyle(false)}>PinkSale</TableCell>
                <TableCell sx={tableHeaderCellStyle(true)}>
                  TrendPad (Multi)
                </TableCell>
                <TableCell sx={tableHeaderCellStyle(false)}>
                  PinkSale (Air)
                </TableCell>
                <TableCell sx={tableHeaderCellStyle(true)}>TrendLock</TableCell>
                <TableCell sx={tableHeaderCellStyle(false)}>PinkLock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.02) !important"
                          : "rgba(255,255,255,0.02) !important",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      ...cellStyle(false),
                      textAlign: "left",
                      fontWeight: 600,
                      position: "sticky",
                      left: 0,
                      zIndex: 5,
                      background:
                        theme.palette.mode === "light" ? "#fff" : "#1a1a2e", // Opaque for sticky
                      borderRight: `1px solid ${
                        theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.05)"
                      }`,
                    }}
                  >
                    {row.network}
                  </TableCell>
                  <TableCell sx={cellStyle(true)}>
                    {row.trendpadLaunch}
                  </TableCell>
                  <TableCell sx={cellStyle(false)}>
                    {row.pinkSalePresale}
                  </TableCell>
                  <TableCell sx={cellStyle(true)}>
                    {row.trendpadMulti}
                  </TableCell>
                  <TableCell sx={cellStyle(false)}>{row.pinkSaleAir}</TableCell>
                  <TableCell
                    sx={{
                      ...cellStyle(true),
                      color:
                        theme.palette.mode === "light" ? "#10B981" : "#34D399",
                    }}
                  >
                    {row.trendLock}
                  </TableCell>
                  <TableCell sx={cellStyle(false)}>{row.pinkLock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default FeeComparison;
