import React from 'react'
import {Box,Typography} from "@mui/material";
const Disclaimer = () => {
  return (
    <Box className="flex justify-center items-center" sx={{ mt: 8, mb: 8 }}>
    <Typography
    className='text-center'
      variant="h6"
      sx={{ width: "100%", color: "var(--grey-text, #9B9797)" }}
    >
      Disclaimer: Trendpad will never endorse or encourage that you invest
      in any of the projects listed and therefore, accept no liability for
      any loss occasioned. It is the user(s) responsibility to do their own
      research and seek financial advice from a professional. 
      {/* More
      information about (DYOR) can be found via{" "}
      <span style={{ color: "var(--primary-button, #1D64FA" }}>
        Binance Academy
      </span> */}
    </Typography>
  </Box>
  )
}

export default Disclaimer