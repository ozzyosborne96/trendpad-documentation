import { Typography, Box, Grid2, Container } from "@mui/material";
import React from "react";
import styles from "./TokenSale.module.css";
import HoverCardWrapper from "../../Components/HoverCardWrapper";
const TokenSale = () => {
  const data = [
    {
      img: "/images/iconamoon_certificate-badge-fill.svg",
      name: "Standard",
      subName: "Mint standard tokens on ETH, BSC, AVAX, Fantom, Polygon.",
    },
    {
      img: "/images/solar_graph-down-broken.svg",
      name: "Deflationary",
      subName:
        "Generate deflationary tokens with tax and/or charity functions.",
    },
    {
      img: "/images/carbon_area-custom.png",
      name: "Customization",
      subName: "Create a token sale for your own custom token easily.",
    },
    {
      img: "/images/clarity_launchpad-line.svg",
      name: "Launchpad",
      subName:
        "Use the token you mint to create a launchpad with just a few clicks",
    },
    {
      img: "/images/tabler_brand-react.svg",
      name: "Branding",
      subName:
        "Adding logo, social links, Adding logo, social links, TrendSale.",
    },
    {
      img: "/images/carbon_gui-management.svg",
      name: "Management",
      subName:
        "The portal to help you easily update content for your launchpad.",
    },
    {
      img: "/images/fluent_people-community-24-filled.svg",
      name: "Community",
      subName: "Promote your launchpad to thousands of buyers on TrendSale.",
    },
    {
      img: "/images/icon-park-outline_data-lock.svg",
      name: "Locking",
      subName: "Lock your liquidity to TrendSwap, PancakeSwap after presale.",
    },
  ];

  return (
    <Container className={styles.mainBox}>
      <Box mt={10}>
        <Typography
          variant="h4"
          sx={{
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "64.358px",
            background: (theme) =>
              theme.palette.mode === "light"
                ? "none"
                : "linear-gradient(103deg, #FFF 12.71%, rgba(154, 224, 241, 0.80) 43.44%, #8C8ED2 66.97%, #FFF 96.59%)",
            color: (theme) => theme.palette.text.primary,
            backgroundClip: (theme) =>
              theme.palette.mode === "light" ? "none" : "text",
            WebkitBackgroundClip: (theme) =>
              theme.palette.mode === "light" ? "none" : "text",
            WebkitTextFillColor: (theme) =>
              theme.palette.mode === "light" ? "inherit" : "transparent",
          }}
        >
          A Suite of Tools for Token Sales.
        </Typography>
        <div>
          <Typography
            variant="h5"
            sx={{
              color: (theme) => theme.palette.text.secondary,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "36.201px",
            }}
          >
            A suite of tools were built to help you create your own tokens and
            launchpads in a fast, simple
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: (theme) => theme.palette.text.secondary,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "36.201px",
            }}
          >
            and cheap way, with no prior code knowledge required and 100%
            decentralized!
          </Typography>
        </div>
      </Box>
      <Box mt={6}>
        <Grid2 container spacing={3} justifyContent="center">
          {data?.map((item, index) => (
            <Grid2 item xs={12} sm={3} md={3} lg={3} key={index}>
              <HoverCardWrapper>
                <Box
                  role="article"
                  aria-label={`${item?.name}: ${item?.subName}`}
                  textAlign="center"
                  sx={{
                    width: { xs: "100%", sm: "270px" }, // Responsive: full width on mobile, fixed on desktop
                    maxWidth: "270px", // Prevent growing too large
                    minHeight: { xs: "240px", sm: "270px" }, // Flexible on mobile, fixed on desktop
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "24px 16px", // Added padding for better spacing
                    border: (theme) =>
                      `2px solid ${
                        theme.palette.mode === "light" ? "#E0E0E0" : "#292929"
                      }`,
                    borderRadius: "16px",
                    background: (theme) =>
                      theme.palette.mode === "light" ? "#FFFFFF" : "#0D0D0F",
                    gap: "16px", // Reduced from 20px
                    boxShadow: (theme) =>
                      theme.palette.mode === "light"
                        ? "0px 4px 20px rgba(0,0,0,0.05)"
                        : "0px 32.179px 42.905px 0px rgba(0, 0, 0, 0.02), 0px 21.453px 32.179px 0px rgba(0, 0, 0, 0.02), 0px 5.363px 10.726px 0px rgba(0, 0, 0, 0.02), 0px 0px 1.341px 0px rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <img
                    src={item?.img}
                    alt={`${item?.name} feature icon`}
                    style={{ maxWidth: "48px", maxHeight: "48px" }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "1.3",
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {item?.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "1.5",
                      color: (theme) => theme.palette.text.secondary,
                      width: "230px",
                    }}
                  >
                    {item?.subName}
                  </Typography>
                </Box>
              </HoverCardWrapper>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Container>
  );
};

export default TokenSale;
