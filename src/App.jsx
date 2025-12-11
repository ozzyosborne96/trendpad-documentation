import { React, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import "@fontsource/dm-sans"; // Import DM Sans
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Launchpad from "./LaunchPad/Launchpad";
import getTheme from "./theme";
import LandingLayout from "./LayOut/LandingLayout";
import DashboardLayout from "./LayOut/DashboardLayout";
import TrendLock from "./TrendLock/TrendLock";
import Token from "./TrendLock/Token";
import TokenInfo from "./TrendLock/TokenInfo";
import Liquidity from "./TrendLock/Liquidity";
import CreateAirDrop from "./AirDrops/CreateAirDrop";
import CreateAirDopInfo from "./AirDrops/CreateAirDopInfo";
import MyDrop from "./AirDrops/MyDrop";
import AirDropList from "./AirDrops/AirDropList";
import MultiSender from "./Others/MultiSender";
import TimerLock from "./TrendLock/TimerLock";
import { toast, Toaster } from "react-hot-toast";
import TimerLockLP from "./TrendLock/TimerLockLP";
import EditLock from "./TrendLock/EditLock";
import { GlobalStateProvider } from "./Context/GlobalStateContext";
import { ThemeContextProvider, ThemeContext } from "./Context/ThemeContext";
import ViewLaunchPad from "./LaunchPadList/ViewLaunchPad/ViewLaunchPad";
import ViewFairLaunchPad from "./LaunchPadList/ViewFairLaunchPad/ViewFairLaunchPad";
import CreateLaunchpad from "./LaunchPad/CreateLaunchpad/CreateLaunchpad";
import CreateFairLaunch from "./LaunchPad/CeateFairLaunch/CreateFairLaunch";
import LaunchPadList from "./LaunchPadList/LaunchPadList";
import MultiSenderSuccess from "./Others/MultiSenderSuccess";
import AnnouncementBanner from "./Components/AnnouncementBanner";
import Docs from "./Docs/Docs";

const AppContent = () => {
  const { mode } = useContext(ThemeContext);
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStateProvider>
        <CssBaseline />
        <AnnouncementBanner />
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route
              path="/"
              element={
                <LandingLayout>
                  <LandingPage />
                </LandingLayout>
              }
            />
            <Route
              path="/Launchpad"
              element={
                <DashboardLayout>
                  <CreateLaunchpad />
                </DashboardLayout>
              }
            />
            <Route
              path="/Fairlaunchpad"
              element={
                <DashboardLayout>
                  <CreateFairLaunch />
                </DashboardLayout>
              }
            />
            <Route
              path="/LaunchpadList"
              element={
                <DashboardLayout>
                  <LaunchPadList />
                </DashboardLayout>
              }
            />

            <Route
              path="/trendlock/create"
              element={
                <DashboardLayout>
                  <TrendLock />
                </DashboardLayout>
              }
            />
            <Route
              path="/trendlock/token"
              element={
                <DashboardLayout>
                  <Token />
                </DashboardLayout>
              }
            />
            <Route
              path="/trendlock/tokenInfo"
              element={
                <DashboardLayout>
                  <TokenInfo />
                </DashboardLayout>
              }
            />
            <Route
              path="/trendlock/liquidity"
              element={
                <DashboardLayout>
                  <Liquidity />
                </DashboardLayout>
              }
            />
            <Route
              path="/trendlock/timer-lock"
              element={
                <DashboardLayout>
                  <TimerLock />
                </DashboardLayout>
              }
            />
            <Route
              path="/trendlock/timer-lock-lp"
              element={
                <DashboardLayout>
                  <TimerLockLP />
                </DashboardLayout>
              }
            />
            <Route
              path="/airdrops/create"
              element={
                <DashboardLayout>
                  <CreateAirDrop />
                </DashboardLayout>
              }
            />
            <Route
              path="/airdrops/createInfo"
              element={
                <DashboardLayout>
                  <CreateAirDopInfo />
                </DashboardLayout>
              }
            />
            <Route
              path="/airdrops/myDrop/:airDropAddress"
              element={
                <DashboardLayout>
                  <MyDrop />
                </DashboardLayout>
              }
            />
            <Route
              path="/airdrops/List"
              element={
                <DashboardLayout>
                  <AirDropList />
                </DashboardLayout>
              }
            />
            <Route
              path="/others/Multisender"
              element={
                <DashboardLayout>
                  <MultiSender />
                </DashboardLayout>
              }
            />
            <Route
              path="/trendlock/edit-lock-lp"
              element={
                <DashboardLayout>
                  <EditLock />
                </DashboardLayout>
              }
            />
            <Route
              path="/Launchpad/View/:launchpadAddress"
              element={
                <DashboardLayout>
                  <ViewLaunchPad />
                </DashboardLayout>
              }
            />
            <Route
              path="/FairLaunchpad/View/:launchpadAddress"
              element={
                <DashboardLayout>
                  <ViewFairLaunchPad />
                </DashboardLayout>
              }
            />
            <Route
              path="/Multisender/MultiSenderSuccess"
              element={
                <DashboardLayout>
                  <MultiSenderSuccess />
                </DashboardLayout>
              }
            />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </Router>
      </GlobalStateProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
};

export default App;
