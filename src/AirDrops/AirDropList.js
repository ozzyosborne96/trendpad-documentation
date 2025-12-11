import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
} from "@mui/material";
import AllDrops from "./AllDrops";
import Disclaimer from "../Components/Disclaimer";
import CreatedByYou from "../AirDrops/CreatedByYou";
import MyAirDropList from "../AirDrops/MyAirDropList";
import SearchIcon from "@mui/icons-material/Search";
import { fetchParticipantCount } from "../AirDrops/ApiAirdropHandler";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const AirDropList = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState();
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchParticipantCount(); // your async function
      setData(data);
    };
    fetchData(); // invoke the async function
  }, []);

  return (
    <Container>
      <Box>
        {/* Search Field */}
        <TextField
          variant="outlined"
          placeholder="Type token symbol, address to find your launchpad"
          fullWidth
          sx={(theme) => ({
            ...FairLaunchTheme.inputStyle(theme),
            mb: 3,
          })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                />
              </InputAdornment>
            ),
          }}
        />

        {/* Airdrop Statistics */}
        <Box
          sx={(theme) => ({
            ...FairLaunchTheme.cardStyle(theme),
            padding: "20px 32px",
            borderRadius: "10px",
          })}
        >
          <Typography
            variant="h6"
            sx={(theme) => ({
              ...FairLaunchTheme.gradientText(theme),
              fontWeight: "bold",
            })}
          >
            Airdrops
          </Typography>

          <Box display="flex" alignItems="center" gap={4} mt={2}>
            {[
              { label: "Airdrop launched", value: data?.AirDropLaunched || 0 },
              {
                label: "Participants in all time",
                value: data?.participantCount || 0,
              },
            ].map(({ label, value }, index) => (
              <Box key={index}>
                <Typography
                  variant="h6"
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#0AE7FE", fontWeight: "bold", mt: 0.5 }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box mt={4}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="primary"
              variant="fullWidth"
              sx={{
                width: "100%",
                maxWidth: "400px",
                "& .MuiTabs-indicator": {
                  backgroundColor: "#00FFFF",
                },
              }}
            >
              <Tab
                label="All"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                  fontWeight: "700",
                  "&.Mui-selected": {
                    color: "#00FFFF",
                  },
                })}
              />
              <Tab
                label="My Airdrops"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                  fontWeight: "700",
                  "&.Mui-selected": {
                    color: "#00FFFF",
                  },
                })}
              />
              <Tab
                label="Created By You"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                  fontWeight: "700",
                  "&.Mui-selected": {
                    color: "#00FFFF",
                  },
                })}
              />
            </Tabs>
          </Box>
        </Box>
        <Box mt={2} p={2}>
          {activeTab === 0 && <AllDrops />}
          {activeTab === 1 && <MyAirDropList />}
          {activeTab === 2 && <CreatedByYou />}
        </Box>
      </Box>
      <Disclaimer />
    </Container>
  );
};

export default AirDropList;
