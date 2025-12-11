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
  Avatar,
  Button,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Dropdown Icon
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import style from "./Navbar.module.css"; // Import external CSS
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ConnectButtonCustom from "../ConnectButtonCustom";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import GoogleTranslate from "../GoogleTranslate";

const pages = [
  {
    name: "Launchpad",
    path: "/Launchpad",
    submenu: [
      { name: "Create Presale", path: "/Launchpad" },
      { name: "Create Fair-launch", path: "/Fairlaunchpad" },
      { name: "Launchpad List", path: "/LaunchpadList" },
    ],
  },
  {
    name: "Trendlock",
    path: "/trendlock",
    submenu: [
      { name: "Create Token Lock", path: "/trendlock/create" },
      { name: "Token", path: "/trendlock/token" },
      { name: "Liquidity", path: "/trendlock/liquidity" },
    ],
  },
  {
    name: "Token",
    path: "/token",
    submenu: [
      {
        name: "Create Evm Token",
        path: "https://trendifytokens.io/createtoken",
        target: "_blank",
      },
      {
        name: "Create Solana Token",
        path: "https://solana.trendifytokens.io/",
        target: "_blank",
      },
      {
        name: "Create Ton Token",
        path: "https://ton.trendifytokens.io/",
        target: "_blank",
      },
    ],
  },
  {
    name: "Airdrops",
    path: "/airdrops",
    submenu: [
      { name: "Create Airdrop", path: "/airdrops/create" },
      { name: "Airdrop List", path: "/airdrops/List" },
    ],
  },
  {
    name: "Others",
    path: "/others",
    submenu: [
      { name: "Multisender", path: "/others/Multisender" },
      // { name: "Community", path: "/others/community" },
      // { name: "Whitepaper", path: "/others/whitepaper" },
    ],
  },
  {
    name: "Docs",
    path: "/docs",
    // No submenu needed for now unless we want to link directly to sections
  },
];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElDropdown, setAnchorElDropdown] = React.useState(null);
  const [selectedSubmenu, setSelectedSubmenu] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { mode, toggleTheme } = React.useContext(ThemeContext);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleOpenDropdown = (event, page) => {
    setAnchorElDropdown(event.currentTarget);
    setSelectedSubmenu(page);
  };

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleCloseDropdown = () => {
    setAnchorElDropdown(null);
    setSelectedSubmenu(null);
  };

  const handleNavigate = (path, target = null) => {
    if (target === "_blank") {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      navigate(path);
    }
    handleCloseNavMenu();
    handleCloseDropdown();
    setMobileOpen(false); // Close mobile drawer
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
        paddingTop: "20px",
        boxShadow: "none",
        borderBottom: mode === "light" ? "1px solid #E0E0E0" : "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" } }} /> */}
          <Link to="/">
            <img
              src="/images/LogoTrendPad.png"
              alt="Logo"
              style={{
                height: "40px",
                cursor: "pointer",
                filter: mode === "light" ? "invert(1)" : "none",
              }}
            />
          </Link>{" "}
          {/* <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              fontSize: "20px",
              fontWeight: "400",
              color: "white",
              textDecoration: "none",
              display: { xs: "none", md: "flex" },
            }}
          >
            Trendpad
          </Typography> */}
          {/* Mobile Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              size="large"
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{ color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 5 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={
                  page.submenu
                    ? (e) => handleOpenDropdown(e, page)
                    : () => handleNavigate(page.path)
                }
                sx={{
                  color: "text.primary",
                  fontSize: "18px",
                  fontWeight: "500",
                  textTransform: "none",
                }}
                endIcon={page.submenu ? <KeyboardArrowDownIcon /> : null}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <Menu
            anchorEl={anchorElDropdown}
            open={Boolean(anchorElDropdown)}
            onClose={handleCloseDropdown}
          >
            {selectedSubmenu?.submenu?.map((subItem) => (
              <MenuItem
                key={subItem.name}
                onClick={() => handleNavigate(subItem.path, subItem.target)}
              >
                {subItem.name}
              </MenuItem>
            ))}
          </Menu>
          {/* Setting and Icons */}
          <Box
            className="flex items-center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {/* Username and Settings Icon */}
            <Box sx={{ ml: 1 }}>
              <ConnectButtonCustom />
            </Box>

            {/* Google Translate */}
            <Box sx={{ ml: 1 }}>
              <GoogleTranslate />
            </Box>

            <Box>
              <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </Container>
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#0D0D0E" : "#FFFFFF",
            width: "280px",
            color: (theme) => theme.palette.text.primary,
            borderLeft: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid #E0E0E0"
                : "1px solid #2b2b33",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ color: "text.primary" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* List of Menu Items */}
            <List>
              {pages.map((page) => (
                <ListItem key={page.name} disablePadding sx={{ mb: 0.5 }}>
                  {page.submenu ? (
                    <Accordion
                      elevation={0}
                      sx={{
                        background: "transparent",
                        color: "text.primary",
                        width: "100%",
                        "&:before": { display: "none" },
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.08)",
                        overflow: "hidden",
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.02)"
                            : "rgba(0, 0, 0, 0.02)",
                        "& .MuiAccordionSummary-root": {
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.08)"
                                : "rgba(0, 0, 0, 0.06)",
                          },
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "text.primary" }} />
                        }
                        sx={{
                          px: 2,
                          py: 0.5,
                          minHeight: 36,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.05rem",
                            color: "text.primary",
                          }}
                        >
                          {page.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0, px: 2, pb: 1 }}>
                        <List disablePadding>
                          {page.submenu.map((subItem) => (
                            <ListItemButton
                              key={subItem.name || subItem}
                              onClick={() =>
                                handleNavigate(subItem.path, subItem.target)
                              }
                              sx={{
                                py: 0.5,
                                px: 1.5,
                                mb: 0,
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "rgba(255, 255, 255, 0.08)"
                                      : "rgba(0, 0, 0, 0.06)",
                                },
                                "&:last-child": {
                                  mb: 0,
                                },
                              }}
                            >
                              <ListItemText
                                primary={subItem.name || subItem}
                                primaryTypographyProps={{
                                  sx: {
                                    color: "text.secondary",
                                    fontSize: "0.95rem",
                                  },
                                }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <ListItemButton
                      onClick={() => handleNavigate(page.path)}
                      sx={{
                        p: 0,
                        py: 0.5,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <ListItemText
                        primary={page.name}
                        primaryTypographyProps={{
                          sx: {
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          },
                        }}
                      />
                    </ListItemButton>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Mobile Settings & Icons */}
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              borderTop: "1px solid",
              borderColor: "divider",
              pt: 2,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <ConnectButtonCustom />
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "text.primary" }}>Language</Typography>
              <GoogleTranslate />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ color: "text.primary" }}>
                {mode === "dark" ? "Light Mode" : "Dark Mode"}
              </Typography>
              <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
