import React from "react";
import { Box, Typography, Grid2, Container } from "@mui/material";
import styles from "./TotalInfo.module.css"; // Ensure the file is .module.css
import AnimatedNumber from "../../Components/AnimatedNumber";
const TotalInfo = () => {
  const data = [
    { name: "Total Liquidity Raised", number: "$136.8M" },
    { name: "Total Projects", number: "2694" },
    { name: "Total Participants", number: "151.1K" },
    { name: "Total Value Locked", number: "$391.6M" },
  ];

  return (
    <Container>
      <Box className={styles.outerInfobox} sx={{ mt: "100px", mb: "100px" }}>
        <Grid2 container spacing={3} justifyContent="center">
          {data.map((item, index) => (
            <Grid2 item xs={12} sm={6} md={3} key={index}>
              <Box className={styles.infoBox} textAlign="center">
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: (theme) => theme.palette.text.primary,
                    lineHeight: "54.302px",
                  }}
                >
                  {/* {item.number} */}
                  <AnimatedNumber value={item.number} />
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 400,
                    color: (theme) => theme.palette.text.secondary,
                    lineHeight: "30.168px",
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Container>
  );
};

export default TotalInfo;
