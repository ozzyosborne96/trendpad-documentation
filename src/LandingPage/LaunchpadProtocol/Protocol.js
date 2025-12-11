import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import styles from "./Protocol.module.css";
import SequentialText from "../../Components/SequentialText";
import { useNavigate } from "react-router-dom";
const Protocol = () => {
  const navigate = useNavigate();
  return (
    <Container mt={10} className={styles.mainBox}>
      <Box className={styles.ouetrBox}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "700",
            background: (theme) =>
              theme.palette.mode === "light"
                ? "none"
                : "linear-gradient(104deg, #FFF 16.52%, rgba(154, 224, 241, 0.80) 42.51%, #8C8ED2 62.41%, #FFF 84.95%)",
            color: (theme) => theme.palette.text.primary,
            backgroundClip: (theme) =>
              theme.palette.mode === "light" ? "none" : "text",
            WebkitBackgroundClip: (theme) =>
              theme.palette.mode === "light" ? "none" : "text",
            WebkitTextFillColor: (theme) =>
              theme.palette.mode === "light" ? "inherit" : "transparent",
          }}
        >
          {/* The Launchpad Protocol for Everyone! */}
          <SequentialText text="The Launchpad Protocol for Everyone!" />
        </Typography>
        <Typography
          variant="h4"
          mt={3}
          sx={{
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Our Launchpad offers a{" "}
          <span
            style={{
              background:
                "var(--text-gradient, linear-gradient(194deg, #2299B7 62.83%, #1A1C66 86.78%))",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            decentralized
          </span>{" "}
          space. Pre- selling your projects is{" "}
          <span
            style={{
              background:
                "var(--text-gradient, linear-gradient(194deg, #2299B7 62.83%, #1A1C66 86.78%))",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            easy
          </span>
          .
        </Typography>
      </Box>
      <Box className={styles.btnbox} mt={4}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: "21.453px",
            background: (theme) =>
              theme.palette.mode === "light"
                ? "#2299b7"
                : "var(--bg, linear-gradient(226deg, #2299b7 -39.46%, #0a0b2a 94.74%))",
            border: "none",
            padding: "10px 20px",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "#1a7a92"
                  : "var(--bg, linear-gradient(226deg, #2299b7 -39.46%, #0a0b2a 94.74%))",
            },
          }}
          onClick={() => navigate("/Launchpad")}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#fff",
              cursor: "pointer",
              textTransform: "none",
            }}
          >
            Create Now
          </Typography>
        </Button>
        {/* <button variant="outlined" className={styles.learnMorebtn}>
          <Typography variant="body1" sx={{ color: "#fff" }}>
            Learn more
          </Typography>
        </button> */}
      </Box>
    </Container>
  );
};

export default Protocol;
