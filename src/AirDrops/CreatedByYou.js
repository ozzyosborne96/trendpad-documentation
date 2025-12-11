import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getParticipantAirdropsHandler } from "../AirDrops/ApiAirdropHandler";
import { ethers } from "ethers";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const CreatedByYou = () => {
  const navigate = useNavigate();
  const [poolInfo, setPoolInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const account = useCurrentAccountAddress();

  const renderCard = (pool, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Box
        sx={(theme) => ({
          ...FairLaunchTheme.cardStyle(theme),
          width: "100%",
          padding: "20px",
          borderRadius: "20px",
          border: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Avatar alt="Token Logo" src={pool?.LogoURL || ""} />
          <Button
            variant="contained"
            sx={(theme) => ({
              borderRadius: "20px",
              textTransform: "capitalize",
              background:
                pool?.status === "Live"
                  ? theme.palette.success.main
                  : pool?.status === "Upcoming"
                  ? theme.palette.warning.main
                  : pool?.status === "Ended"
                  ? theme.palette.error.main
                  : pool?.status === "Cancelled"
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main,
              color: "#fff",
              boxShadow: "none",
            })}
          >
            {pool?.status || "--"}
          </Button>
        </Box>

        <Typography
          variant="h5"
          mb={2}
          sx={(theme) => ({ color: theme.palette.text.primary })}
        >
          {pool?.AirDrop_Tittle || "Untitled Airdrop"}
        </Typography>

        {[
          { label: "Token", value: pool?.Token_Name },
          { label: "Symbol", value: pool?.Symbol },
          {
            label: "Total Tokens",
            value: pool?.TotalAllocation
              ? ethers.formatEther(pool.TotalAllocation.toString())
              : "0",
          },
          { label: "Participants", value: pool?.ParticipantCount || 0 },
        ].map(({ label, value }, idx) => (
          <Box
            key={idx}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography
              variant="subtitle1"
              sx={(theme) => ({ color: theme.palette.text.secondary })}
            >
              {label}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                fontWeight: "bold",
              })}
            >
              {value}
            </Typography>
          </Box>
        ))}

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            onClick={() =>
              navigate(`/airdrops/myDrop/${pool?.Pool_Address}`, {
                state: { data: pool?.Pool_Address },
              })
            }
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              background: "transparent",
              padding: "8px 20px",
              fontSize: "14px",
              height: "auto",
              minWidth: "auto",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.05)",
              },
            })}
          >
            View
          </Button>
        </Box>
      </Box>
    </Grid>
  );

  const fetchAirdrops = async () => {
    if (!account) return;

    try {
      setLoading(true);
      const response = await getParticipantAirdropsHandler(account);
      setPoolInfo(response?.data);
      setTotalPages(Math.ceil(response?.data.length / limit));
    } catch (err) {
      console.error("Fetch failed", err);
      alert("Failed to fetch airdrop list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirdrops();
  }, [account]);

  // Paginate local list (optional)
  const paginatedData = poolInfo.slice((page - 1) * limit, page * limit);

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
        </Box>
      ) : poolInfo.length > 0 ? (
        <>
          <Grid container spacing={4} justifyContent="center">
            {paginatedData.map((pool, index) => renderCard(pool, index))}
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography variant="h6" textAlign="center" color="textSecondary">
          No Airdrops Available
        </Typography>
      )}
    </Box>
  );
};

export default CreatedByYou;
