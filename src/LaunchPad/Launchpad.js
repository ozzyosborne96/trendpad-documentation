import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CreateLaunchpad from "./CreateLaunchpad/CreateLaunchpad";
import { Container, Typography } from "@mui/material";
import CreateFairLaunch from "./CeateFairLaunch/CreateFairLaunch";
import LaunchPadList from "../LaunchPadList/LaunchPadList";
import Disclaimer from "../Components/Disclaimer";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box
        className="flex justify-center gap-32"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "#F4F6F8"
              : "rgba(52, 52, 52, 0.46)",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
          variant="scrollable" // Makes tabs scrollable on smaller screens
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
            },
            "& .MuiTab-root.Mui-selected": {
              background: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "#0A0A0A",
              color: (theme) => theme.palette.text.primary,
            },
          }}
        >
          <Tab label="Create Launchpad" {...a11yProps(0)} />
          <Tab label="Create fair launch" {...a11yProps(1)} />
          <Tab label="Create dutch auction" {...a11yProps(2)} />
          <Tab label="Create subscription pool" {...a11yProps(3)} />
          <Tab label="Create Token" {...a11yProps(4)} />
          <Tab label="Launchpad list" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} className="full-width">
        <CreateLaunchpad />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CreateFairLaunch />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three Content
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Item Four Content
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        Item Five Content
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <LaunchPadList />
      </CustomTabPanel>
      <Disclaimer />
    </Box>
  );
}
