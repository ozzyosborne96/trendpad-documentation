import { Typography, Box, Button, Container } from "@mui/material";
import React from "react";
import styles from "./TrendProduct.module.css";
import AnimatedCard from "../../Components/AnimatedCard";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

const TrendProduct = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      image: "/images/Rectangle.png",
      title: "Standard",
      description: "Develop multi-chain custom token for any project.",
      path: "https://trendifytokens.io/",
    },
    {
      id: 2,
      image: "/images/Rectangle1.png",
      title: "Watch Ads and Earn",
      description:
        "Swap your any Coin with your favourite one now with Trenddx.",
      path: "https://trenddx.io/",
    },
    {
      id: 3,
      image: "/images/Rectangle2.png",
      title: "Customization",
      description:
        "Watch Ads & earn rewards or be an Advertisers on Trendads..",
      path: "https://trendads.ai/",
    },
    {
      id: 4,
      image: "/images/Rectangle3.png",
      title: "Launchpad",
      description:
        "Create AI-powered websites in minutes, including specialized meme token sites.",
      path: "https://trendifyweb.ai/",
    },
  ];

  const handleRedirect = (path) => {
    if (!path) return; // Do nothing if path is empty
    if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  return (
    <Container className={styles.title}>
      <Box mt={10}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: (theme) =>
              theme.palette.mode === "light"
                ? "none"
                : "linear-gradient(117deg, #FFF -11.63%, rgba(154, 224, 241, 0.80) 30.14%, #8C8ED2 62.13%, #FFF 98.35%)",
            color: (theme) => theme.palette.text.primary,
            backgroundClip: (theme) =>
              theme.palette.mode === "light" ? "none" : "text",
            WebkitBackgroundClip: (theme) =>
              theme.palette.mode === "light" ? "none" : "text",
            WebkitTextFillColor: (theme) =>
              theme.palette.mode === "light" ? "inherit" : "transparent",
          }}
        >
          Get Trend Products
        </Typography>
      </Box>

      <Box mt={4}>
        <Grid container spacing={3} justifyContent="center">
          {products?.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={index}
              display="flex"
              justifyContent="center"
            >
              <AnimatedCard
                opacity={0.7}
                duration={0.3}
                transitionEase="easeInOut"
              >
                <Box
                  textAlign="center"
                  sx={{
                    maxWidth: "270px",
                    height: "290px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: { xs: "16px", md: "20px" },
                    borderRadius: "16px",
                    border: (theme) =>
                      `2px solid ${
                        theme.palette.mode === "light" ? "#E0E0E0" : "#272727"
                      }`,
                    background: (theme) =>
                      theme.palette.mode === "light" ? "#FFFFFF" : "#0C0C0F",
                    boxShadow: (theme) =>
                      theme.palette.mode === "light"
                        ? "0px 4px 20px rgba(0,0,0,0.05)"
                        : `
                      0px 32px 42px rgba(0, 0, 0, 0.02),
                      0px 21px 32px rgba(0, 0, 0, 0.02),
                      0px 5px 10px rgba(0, 0, 0, 0.02),
                      0px 0px 1px rgba(0, 0, 0, 0.02)
                    `,
                  }}
                >
                  <img src={item.image} alt={item.text} width={230} />

                  <Box mt={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: 1.4,
                        mt: 1,
                        display: "-webkit-box",
                        // WebkitLineClamp: 2,
                        // WebkitBoxOrient: "vertical",
                        // overflow: "hidden",
                        // textOverflow: "ellipsis",
                        minHeight: "40px", // ensures space for 2 lines
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>

                  <Button
                    sx={{
                      mt: 1,
                      borderRadius: "8px",
                      border: "none",
                      display: "flex",
                      height: "50px",
                      padding: "10px 20px",
                      justifyContent: "center",
                      alignItems: "center",
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "#2299b7"
                          : "var(--bg, linear-gradient(226deg, #2299b7 -39.46%, #0a0b2a 94.74%))",
                      color: "#fff",
                      "&:hover": {
                        background: (theme) =>
                          theme.palette.mode === "light"
                            ? "#1a7a92"
                            : "var(--bg, linear-gradient(226deg, #2299b7 -39.46%, #0a0b2a 94.74%))",
                      },
                    }}
                    onClick={() => handleRedirect(item.path)}
                    disabled={!item.path}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        color: "#fff",
                        textTransform: "none",
                      }}
                    >
                      {item.path ? "Checkout Now" : "Coming Soon"}
                    </Typography>
                  </Button>
                </Box>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={4} display="flex" justifyContent="center">
        <img
          src="/images/trendaiimg.png"
          alt="Trend AI"
          style={{ width: "100%", maxWidth: "350px" }}
        />
      </Box>
    </Container>
  );
};

export default TrendProduct;
