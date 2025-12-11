import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { FairLaunchTheme } from "../../LaunchPad/CeateFairLaunch/FairLaunchTheme";
const BuyBackInfo = ({
  buyBackInfo,
  buybackremainamount,
  fairbuybackAndBurnHan,
  currencySymbol,
}) => {
  return (
    <Box
      sx={(theme) => ({
        ...FairLaunchTheme.cardStyle(theme),
        marginBottom: "20px",
      })}
    >
      <div className="flex-col gap-4 mt-16">
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            marginBottom: "12px",
          })}
        >
          Buyback Info
        </Typography>
        <div className="flex justify-between items-center owner-zone-text mt-8">
          <Typography variant="body1">Total Buyback Amount</Typography>
          <Typography variant="body1">
            {" "}
            {buyBackInfo?.totalBuyBackAmount} {currencySymbol}
          </Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Bought-back Amount</Typography>
          <Typography variant="body1">
            {buyBackInfo?.boughtBackAmount} {currencySymbol}
          </Typography>
        </div>
        {buybackremainamount !== 0 && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">Bought-back Remains Amount</Typography>
            <Typography variant="body1">
              {buybackremainamount} {currencySymbol}
            </Typography>
          </div>
        )}
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Amount Per Buyback</Typography>
          <Typography variant="body1">
            {buyBackInfo?.AmountPerBuyBack} {currencySymbol}
          </Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Min Buyback Delay</Typography>
          <Typography variant="body1">
            {buyBackInfo?.minBuyBackDeley} minutes
          </Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Max Buyback Delay</Typography>
          <Typography variant="body1">
            {buyBackInfo?.maxBuyBackDeley} minutes
          </Typography>
        </div>
        {buyBackInfo?.nextbuyBackTime !== 0 &&
          buyBackInfo?.lastbuyBackTime !== 0 && (
            <>
              <div className="flex justify-between items-center owner-zone-text">
                <Typography variant="body1">Next Buyback</Typography>
                <Typography variant="body1">
                  {buyBackInfo?.nextbuyBackTime}
                </Typography>
              </div>
              <div className="flex justify-between items-center owner-zone-text">
                <Typography variant="body1">Last Buyback Time</Typography>
                <Typography variant="body1">
                  {buyBackInfo?.lastbuyBackTime}
                </Typography>
              </div>
            </>
          )}
        {Number(buybackremainamount) > 0 && (
          <div className="mt-8">
            <Button
              variant="contained"
              fullWidth
              onClick={fairbuybackAndBurnHan}
              sx={(theme) => FairLaunchTheme.neonButton(theme)}
            >
              Buy-back
            </Button>
          </div>
        )}
      </div>
    </Box>
  );
};

export default BuyBackInfo;
