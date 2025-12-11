import React, { useState } from "react";
import { Container, Box, Button, ButtonGroup } from "@mui/material";
import AllLaunchPad from "./AllLaunchPad";
import ContributionTable from "./ContributionTable";
// import AdvancedSection from "./AdvancedSection";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const LaunchPadList = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  const getButtonStyle = (tabName) => (theme) => {
    const baseStyle = FairLaunchTheme.neonButton(theme);
    const isLight = theme.palette.mode === "light";
    const accentColor = isLight ? "#2299b7" : "#00FFFF";

    return {
      ...baseStyle,
      padding: "10px 20px",
      borderRadius: "0",
      borderRight: isLight
        ? "1px solid rgba(34, 153, 183, 0.2)"
        : "1px solid rgba(0, 255, 255, 0.2)",
      background:
        selectedTab === tabName
          ? isLight
            ? "rgba(34, 153, 183, 0.1)"
            : "rgba(0, 255, 255, 0.1)"
          : "transparent",
      color:
        selectedTab === tabName
          ? accentColor
          : isLight
          ? "rgba(0, 0, 0, 0.6)"
          : "rgba(255, 255, 255, 0.7)",
      boxShadow:
        selectedTab === tabName
          ? isLight
            ? "0 4px 15px rgba(34, 153, 183, 0.2)"
            : "0 0 15px rgba(0, 255, 255, 0.2)"
          : "none",
      "&:hover": {
        background: isLight
          ? "rgba(34, 153, 183, 0.15)"
          : "rgba(0, 255, 255, 0.15)",
        color: accentColor,
        boxShadow: isLight
          ? "0 6px 20px rgba(34, 153, 183, 0.3)"
          : "0 0 20px rgba(0, 255, 255, 0.3)",
      },
      // Fix first and last border radius for group look
      "&:first-of-type": {
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
      },
      "&:last-of-type": {
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        borderRight: `1px solid ${accentColor}`,
      },
    };
  };

  return (
    <Container>
      {/* Button Group */}
      <Box className="flex justify-center" sx={{ mb: 4, px: { xs: 1, sm: 0 } }}>
        <ButtonGroup
          aria-label="Launchpad Navigation"
          sx={(theme) => ({
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 20px rgba(34, 153, 183, 0.1)"
                : "0 0 20px rgba(0, 255, 255, 0.1)",
            borderRadius: "8px",
            maxWidth: "100%",
            width: { xs: "100%", sm: "auto" },
            overflow: "hidden",
            "& .MuiButton-root": {
              fontSize: { xs: "0.65rem", sm: "0.875rem", md: "1rem" },
              padding: { xs: "8px 4px", sm: "10px 20px" },
              whiteSpace: { xs: "nowrap", sm: "normal" },
              minWidth: { xs: "0", sm: "64px" },
              flex: { xs: "1 1 0", sm: "0 1 auto" },
              textOverflow: "ellipsis",
              overflow: "hidden",
            },
          })}
        >
          <Button
            onClick={() => setSelectedTab("all")}
            sx={getButtonStyle("all")}
          >
            All Launchpad
          </Button>
          <Button
            onClick={() => setSelectedTab("advanced")}
            sx={getButtonStyle("advanced")}
          >
            Advanced Mode
          </Button>
          <Button
            onClick={() => setSelectedTab("contributions")}
            sx={getButtonStyle("contributions")}
          >
            My Contributions
          </Button>
        </ButtonGroup>
      </Box>

      <Box mt={4}>
        {selectedTab === "all" && <AllLaunchPad />}
        {selectedTab === "advanced" && <span>{/* <AdvancedSection/> */}</span>}
        {selectedTab === "contributions" && <ContributionTable />}
      </Box>
    </Container>
  );
};

export default LaunchPadList;
