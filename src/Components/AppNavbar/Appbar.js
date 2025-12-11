import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Drawer,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeContext } from "../../Context/ThemeContext";

const languages = ["EN", "Spanish", "French", "German", "Chinese"];

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElLang, setAnchorElLang] = React.useState(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState("EN");
  const { mode, toggleTheme } = React.useContext(ThemeContext);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenLangMenu = (event) => setAnchorElLang(event.currentTarget);
  const handleCloseLangMenu = () => setAnchorElLang(null);
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    handleCloseLangMenu();
  };

  return (
    <AppBar
      position="static"
      className="navbar"
      sx={{
        background:
          mode === "dark"
            ? "radial-gradient(50% 50% at 50% 50%, #0D0D0E 0%, #0C0C0F 100%)"
            : "#FFFFFF",
        boxShadow: "none",
        borderBottom: mode === "light" ? "1px solid #E0E0E0" : "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "30px 0px 12px 0px",
          }}
        >
          {/* Mobile Menu Icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "flex", md: "none" }, color: "text.primary" }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              fontSize: "20px",
              fontWeight: "400",
              color: "text.primary",
              textDecoration: "none",
            }}
          >
            Trendpad
          </Typography>

          {/* Desktop Menu */}
          <Box
            className="flex items-center gap-16"
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              ml: 6,
              alignItems: "center",
            }}
          >
            <img src="/images/Union.png" alt="Logo" />
            <Typography variant="h5" color="text.primary">
              Launchpad
            </Typography>
          </Box>

          {/* Connect Button */}
          <Box sx={{ mr: 2 }}>
            <ConnectButton showBalance={false} chainStatus="icon" />
          </Box>

          {/* User Info */}
          <Box
            sx={{
              display: { md: "flex", xs: "none" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                borderRadius: "12px",
                background: mode === "dark" ? "#1B1B1C" : "#F5F5F5",
                padding: "12px 16px",
                color: "text.primary",
              }}
            >
              dexview.com
            </Typography>
            <SettingsIcon sx={{ color: "text.primary" }} />
            <img src="/images/notification.png" alt="Notification" />
            <Button
              onClick={handleOpenLangMenu}
              sx={{
                color: "text.primary",
                fontSize: "16px",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              {selectedLanguage}
              <KeyboardArrowDownIcon sx={{ ml: 1 }} />
            </Button>
            <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Language Menu */}
      <Menu
        anchorEl={anchorElLang}
        open={Boolean(anchorElLang)}
        onClose={handleCloseLangMenu}
      >
        {languages.map((lang) => (
          <MenuItem key={lang} onClick={() => handleLanguageChange(lang)}>
            {lang}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{
            width: 250,
            p: 2,
            background: mode === "dark" ? "#0D0D0E" : "#FFFFFF",
            height: "100%",
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ mb: 2, color: "text.primary" }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 2,
            }}
          >
            <Typography
              sx={{
                borderRadius: "12px",
                background: mode === "dark" ? "#1B1B1C" : "#F5F5F5",
                padding: "12px 16px",
                color: "text.primary",
              }}
            >
              dexview.com
            </Typography>
            <SettingsIcon sx={{ color: "text.primary" }} />
            <img src="/images/notification.png" alt="Notification" />
            <Button
              onClick={handleOpenLangMenu}
              sx={{
                color: "text.primary",
                fontSize: "16px",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              {selectedLanguage}
              <KeyboardArrowDownIcon sx={{ ml: 1 }} />
            </Button>
            <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
