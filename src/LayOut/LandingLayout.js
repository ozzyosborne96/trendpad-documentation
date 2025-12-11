// LandingLayout.js
import React from "react";
import Navbar from "../Components/Navbar/Navbar";
const LandingLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default LandingLayout;
