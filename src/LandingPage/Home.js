import React from "react";
import Box from "@mui/material/Box";
import { Typography, Grid2, Button } from "@mui/material";
import styles from "./Home.module.css";
import "../";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Container from "@mui/material/Container";
import { motion } from "framer-motion";

// Data-driven project cards
const FEATURED_PROJECTS = [
  {
    id: 1,
    name: "Convex Finance",
    symbol: "CVX",
    logo: "/images/Frame211.png",
    addedDate: "Sep 9",
  },
  {
    id: 2,
    name: "Ocean Protocol",
    symbol: "OCEAN",
    logo: "/images/image7.png",
    addedDate: "Sep 9",
  },
];

const Home = () => {
  const [network, setNetwork] = React.useState("Trendpad Mainnet");

  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
  };

  return (
    <main>
      <Box sx={{ flexGrow: 1 }}>
        <Container>
          <Grid2 container justifyContent={"space-between"}>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", md: "flex-start" },
                  textAlign: { xs: "center", md: "left" },
                }}
                mt={10}
              >
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 1 }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Right place to
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 1 }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    <span
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(34, 153, 183, 1) 0%, rgba(26, 28, 102, 1) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "normal",
                      }}
                    >
                      launch
                    </span>{" "}
                    your project
                  </Typography>
                </motion.div>
              </Box>

              <Box
                mt={5}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "20px",
                  width: "100%",
                }}
              >
                {/* Network Dropdown */}
                <Box
                  sx={{
                    flex: { xs: "1", sm: "auto" },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <FormControl fullWidth>
                    <Select
                      value={network}
                      onChange={handleNetworkChange}
                      aria-label="Select blockchain network"
                      inputProps={{
                        "aria-label": "Blockchain network selector",
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "17px",
                        boxShadow: "0px -2px 5px 0px rgba(0, 0, 0, 0.25) inset",
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "normal",
                        background: (theme) =>
                          theme.palette.mode === "light"
                            ? "#FFFFFF"
                            : "var(--bg,linear-gradient(226deg, #2299b7 -39.46%, #0a0b2a 94.74%))",
                        border: (theme) =>
                          theme.palette.mode === "light"
                            ? "1px solid #E0E0E0"
                            : "none",
                        color: (theme) =>
                          theme.palette.mode === "light" ? "#121212" : "#fff",
                        "& .MuiSelect-icon": {
                          color: (theme) =>
                            theme.palette.mode === "light" ? "#121212" : "#fff",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    >
                      <MenuItem value={"Trendpad Mainnet"}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <img
                            height="20px"
                            width="20px"
                            src="/images/Group.png"
                            alt="Trendpad Mainnet icon"
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              textTransform: "none",
                              fontStyle: "normal",
                              lineHeight: "normal",
                            }}
                          >
                            Trendpad Mainnet
                          </Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box
                mt={5}
                sx={{
                  textAlign: {
                    xs: "center",
                    md: "left",
                    sm: "left",
                    lg: "left",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "500",
                    lineHeight: "normal",
                    fontStyle: "normal",
                  }}
                >
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(34, 153, 183, 1) 0%, rgba(26, 28, 102, 1) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: "normal",
                      fontStyle: "normal",
                    }}
                  >
                    Newest
                  </span>{" "}
                  on Trendpad Mainnet{" "}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  flexWrap: "wrap",
                  gap: "30px",
                }}
                mt={4}
              >
                {FEATURED_PROJECTS.map((project) => (
                  <Box
                    key={project.id}
                    role="article"
                    aria-label={`${project.name} project card`}
                    sx={{
                      padding: "32px 40px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "16px",
                      border: (theme) =>
                        `2px solid ${
                          theme.palette.mode === "light" ? "#E0E0E0" : "#2b2b33"
                        }`,
                      background: (theme) =>
                        theme.palette.mode === "light" ? "#FFFFFF" : "#121212",
                      width: { xs: "100%", sm: "270px" }, // Full width on mobile, fixed on desktop
                      maxWidth: "270px", // Prevent growing too large
                      minHeight: "240px", // Consistent height
                      boxShadow: (theme) =>
                        theme.palette.mode === "light"
                          ? "0px 4px 20px rgba(0,0,0,0.05)"
                          : "none",
                    }}
                  >
                    <img
                      src={project.logo}
                      alt={`${project.name} project logo`}
                      style={{ maxWidth: "60px", maxHeight: "60px" }}
                    />
                    <Typography variant="h6" color="text.primary">
                      {project.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {project.symbol}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: "8px",
                        border: (theme) =>
                          `1px solid ${
                            theme.palette.mode === "light"
                              ? "#E0E0E0"
                              : "#F1F1F1"
                          }`,
                        color: "text.primary",
                        textTransform: "none",
                        pointerEvents: "none", // Static badge, not clickable
                      }}
                    >
                      Added {project.addedDate}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid2>
            <Grid2
              size={{ xs: 12, md: 4 }}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                className={styles.laptopImg}
                src="/images/laptopImg.png"
                alt="TrendPad platform interface displayed on laptop screen"
                style={{
                  marginLeft: "-80px",
                  marginTop: "250px",
                  maxWidth: "100%",
                }}
              />
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </main>
  );
};

export default Home;
