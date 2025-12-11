import React, { useEffect, useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import Timer from "../Components/Timer";
import Disclaimer from "../Components/Disclaimer";
import { useLocation } from "react-router-dom";
import useGetTokenDetails from "../Hooks/GetTokenDetails";
import {
  getLockDetailsById,
  identifyDEXName,
} from "../ContractAction/TrendLockAction";
import TradingChart from "../Components/TradingViewWidget";
import {
  getTokenDecimals,
  getChainInfo,
} from "../ContractAction/ContractDependency";
import TokenAddressLink from "../Components/TokenAddressLink";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const TimerLock = () => {
  const [tokenDetails1, setTokenDetails1] = useState(null);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [decimals, setDecimals] = useState();
  const [dexName, setDexName] = useState();
  const location = useLocation();
  const fetchTokenDetails = useGetTokenDetails();
  const tokenAddress = location.state.data;
  const chainIdState = location?.state?.chainId;
  const lockId = location.state.lockId;
  console.log("tokenAddress", tokenAddress);
  useEffect(() => {
    const fetchTokenDetails1 = async () => {
      try {
        // Pass chainId to fetchTokenDetails
        const tokenInfo = await fetchTokenDetails(tokenAddress, chainIdState);
        const tokenDecimals = await getTokenDecimals(
          tokenAddress,
          chainIdState
        );
        setTokenDetails1(tokenInfo);
        setDecimals(tokenDecimals);

        console.log("Updated tokenDetails1:", tokenInfo);
        console.log("decimals", tokenDecimals);
      } catch (err) {
        console.error("Error fetching token info or decimals", err);
      }
    };

    if (tokenAddress) fetchTokenDetails1();
  }, [tokenAddress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let tokenLockDetails;
        let chainId = chainIdState;
        if (!chainId) {
          const info = await getChainInfo();
          chainId = info.chainId;
        }

        // Pass chainId to getLockDetailsById
        tokenLockDetails = await getLockDetailsById(lockId, decimals, chainId);
        setTokenDetails(tokenLockDetails);
        console.log("Updated tokenDetails:", tokenLockDetails);

        // Pass chainId to identifyDEXName
        const dexName = await identifyDEXName(tokenAddress, chainId);
        console.log("dexName", dexName);
        setDexName(dexName);
      } catch (error) {
        console.error("Error fetching token details:", error);
      }
    };
    fetchData();
  }, [tokenAddress, lockId, decimals]);

  const InfoRow = ({ label, value, isLink, address }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingY: "12px",
        borderBottom: (theme) =>
          `1px solid ${
            theme.palette.mode === "light" ? theme.palette.divider : "#333"
          }`,
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Typography
        variant="body1"
        sx={{ color: (theme) => theme.palette.text.secondary }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: (theme) => (isLink ? "#1D64FA" : theme.palette.text.primary),
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {isLink ? (
          <TokenAddressLink
            address={address || tokenAddress}
            color="#1D64FA"
            truncate={true}
            showCopyIcon={true}
          />
        ) : (
          value
        )}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box
        className="flex-col justify-center items-center"
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          marginTop: "16px",
          padding: { xs: "16px", md: "32px" },
          textAlign: "center",
        })}
      >
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            fontWeight: "700",
            marginBottom: "8px",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          })}
        >
          Unlock In
        </Typography>
        <Box mt={1}>
          <Timer
            LockDate={tokenDetails?.unlockDateRaw || tokenDetails?.unlockDate}
          />
        </Box>
      </Box>

      <Box mt={4}>
        {tokenDetails1?.symbol && (
          <TradingChart
            symbol={tokenDetails1?.symbol}
            isLp={
              dexName &&
              dexName !== "Unknown DEX" &&
              dexName !== "Invalid LP token"
            }
          />
        )}
      </Box>

      <Box
        mt={4}
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          padding: { xs: "20px", md: "32px" },
        })}
      >
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            fontWeight: "700",
            marginBottom: "24px",
          })}
        >
          Token Info
        </Typography>

        <InfoRow
          label="Token Address"
          isLink={true}
          address={tokenAddress}
          value={tokenAddress}
        />
        <InfoRow label="Token Name" value={tokenDetails1?.name || "N/A"} />
        <InfoRow label="Token Symbol" value={tokenDetails1?.symbol || "N/A"} />
        <InfoRow
          label="Token Decimals"
          value={tokenDetails1?.decimals ?? "N/A"}
        />
      </Box>

      <Box
        mt={4}
        mb={4}
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          padding: { xs: "20px", md: "32px" },
        })}
      >
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            fontWeight: "700",
            marginBottom: "24px",
          })}
        >
          Lock Info
        </Typography>

        <InfoRow label="Title" value={tokenDetails?.logDescription} />
        <InfoRow
          label="Token Amount Locked"
          value={tokenDetails?.amountLocked}
        />
        <InfoRow label="Token Values Locked" value="$0" />
        <InfoRow
          label="Owner"
          isLink={true}
          address={tokenDetails?.ownerAddress}
          value={tokenDetails?.ownerAddress}
        />
        <InfoRow label="Lock Date" value={tokenDetails?.unlockDate} />
        <InfoRow label="TGE Date" value={tokenDetails?.tgedate} />
        <InfoRow label="TGE Release %" value={tokenDetails?.tgePercent} />
        <InfoRow
          label="Unlock Schedule"
          value={`${tokenDetails?.cycle} ${tokenDetails?.cycleType}`}
        />
        <InfoRow label="Unlock Rate %" value={tokenDetails?.cycleRelease} />
        <InfoRow label="Unlocked Amount" value={tokenDetails?.unLockAmount} />
        <InfoRow label="Dex" value={dexName} />
      </Box>
      <Disclaimer />
    </Container>
  );
};

export default TimerLock;
