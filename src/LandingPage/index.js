import React from "react";
import Box from "@mui/material/Box";
import Home from "./Home";
import TotalInfo from "./TotalInfo/TotalInfo";
import Protocol from "./LaunchpadProtocol/Protocol";
import TokenSale from "./TokenSales/TokenSale";
import TrendProduct from "./TrendProducts/TrendProduct";
import Faq from "./FAQ/Faq";
import Footer from "./Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";
import FeeComparison from "./FeeComparison/FeeComparison";
const index = () => {
  return (
    <Box
      sx={{
        background: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
        minHeight: "100vh",
      }}
    >
      {/* <Navbar /> */}
      <Home />
      <TotalInfo />
      <FeeComparison />
      <Protocol />
      <TokenSale />
      <TrendProduct />
      <Faq />
      <Footer />
    </Box>
  );
};

export default index;
