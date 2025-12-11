import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import TokenAddressLink from "../../Components/TokenAddressLink";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { FaReddit } from "react-icons/fa6";
import { FaSquareYoutube } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa"; // globe = general website icon
import { MdLanguage } from "react-icons/md";
import { FairLaunchTheme } from "../../LaunchPad/CeateFairLaunch/FairLaunchTheme";
const About = ({
  poolDetails,
  tokenDetails,
  poolAddr,
  timeDetails,
  saleStatus,
  currencySymbol,
  media,
}) => {
  console.log("media123", media?.StepThree);
  return (
    <Box
      sx={(theme) => ({
        ...FairLaunchTheme.cardStyle(theme),
        marginBottom: "20px",
      })}
    >
      <div sx={{ width: "100%" }}>
        <Button sx={{ marginRight: 0 }} variant="outlined" color="warning">
          {saleStatus}
        </Button>
      </div>
      <div className="flex-col justify-center items-center">
        <Avatar alt="Remy Sharp" src={media?.StepThree?.Logo} />
        <div className="flex gap-8 mt-16">
          {media?.StepThree?.Facebook_Page !== "" && (
            <a
              href={media?.StepThree?.Facebook_Page}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <FaFacebookSquare fontSize="20px" />
            </a>
          )}

          {media?.StepThree?.Twitter !== "" && (
            <a
              href={media?.StepThree?.Twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <FaTwitterSquare fontSize="20px" />
            </a>
          )}

          {media?.StepThree?.Github !== "" && (
            <a
              href={media?.StepThree?.Github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <FaGithub fontSize="20px" />
            </a>
          )}

          {media?.StepThree?.Website !== "" && (
            <a
              href={media?.StepThree?.Website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <FaGlobe fontSize="20px" />
            </a>
          )}

          {media?.StepThree?.Instagram !== "" && (
            <a
              href={media?.StepThree?.Instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <FaInstagram fontSize="20px" />
            </a>
          )}

          {media?.StepThree?.Discord !== "" && (
            <a
              href={media?.StepThree?.Discord}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <FaDiscord fontSize="20px" />
            </a>
          )}

          {media?.StepThree?.Reddit !== "" && (
            <a
              href={media?.StepThree?.Reddit}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <FaReddit fontSize="20px" />
            </a>
          )}
          {media?.StepThree?.Youtube !== "" && (
            <a
              href={media?.StepThree?.Youtube}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <FaSquareYoutube fontSize="20px" />
            </a>
          )}
          {media?.StepThree?.Banner !== "" && (
            <a
              href={media?.StepThree?.Youtube}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <MdLanguage fontSize="20px" />
            </a>
          )}
        </div>
      </div>
      <div className="flex-col gap-4 mt-16">
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            marginBottom: "12px",
          })}
        >
          About
        </Typography>
        <Typography variant="body1">
          {media?.StepThree?.Pool_Description}
        </Typography>
      </div>
      <div className="flex-col gap-4 mt-16">
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            marginBottom: "12px",
          })}
        >
          Token
        </Typography>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Address</Typography>
          <Typography variant="body1">
            {/* {poolDetails?.tokenAddress} */}
            <TokenAddressLink
              address={poolDetails?.tokenAddress}
              color="#1D64FA"
              truncate={true}
              showCopyIcon={true}
            />
          </Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Name</Typography>
          <Typography variant="body1">{tokenDetails?.name}</Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Symbol</Typography>
          <Typography variant="body1">{tokenDetails?.symbol}</Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Decimal</Typography>
          <Typography variant="body1">{tokenDetails?.decimals}</Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Total Supply</Typography>
          <Typography variant="body1">{tokenDetails?.totalSupply}</Typography>
        </div>
      </div>
      <div className="flex-col gap-4 mt-16">
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            marginBottom: "12px",
          })}
        >
          Pool Info
        </Typography>
        {!poolDetails?.liquidityPercentage && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">Manual Listing</Typography>
            <Typography variant="body1">
              Liquidity will not be added automatically
            </Typography>
          </div>
        )}
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Address</Typography>
          <Typography variant="body1">
            <TokenAddressLink
              address={poolAddr}
              color={undefined}
              truncate={true}
              showCopyIcon={true}
            />
          </Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Tokens for presale</Typography>
          <Typography variant="body1">
            {poolDetails?.tokenSellingAmount} {tokenDetails?.symbol}
          </Typography>
        </div>
        {poolDetails?.liquidityPercentage !== 0 && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">Tokens for Liquidity</Typography>
            <Typography variant="body1">
              {Number(poolDetails?.liquidityTokenAmount).toFixed(2)}{" "}
              {tokenDetails?.symbol}
            </Typography>
          </div>
        )}
        {/*Change the Native Token Comparison */}

        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">SoftCap</Typography>
          <Typography variant="body1">
            {poolDetails?.softCap} {currencySymbol}
          </Typography>
        </div>
        {/*Change the Native Token Comparison */}
        {poolDetails?.maxBuy > 0 && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">Max Buy</Typography>
            <Typography variant="body1">
              {poolDetails?.maxBuy} {currencySymbol}
            </Typography>
          </div>
        )}
        {/*Change the Native Token Comparison */}

        {/*Change the Native Token Comparison */}

        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Start Time</Typography>
          <Typography variant="body1">{timeDetails?.startTime}</Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">End Time</Typography>
          <Typography variant="body1">{timeDetails?.endTime}</Typography>
        </div>

        {poolDetails?.liquidityPercentage !== 0 && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">Listing On</Typography>
            <Typography variant="body1">{media?.StepOne?.Outer}</Typography>
          </div>
        )}
        <div className="flex justify-between items-center owner-zone-text">
          <Typography variant="body1">Liquidity Percent</Typography>
          <Typography variant="body1">
            {poolDetails?.liquidityPercentage
              ? `${poolDetails?.liquidityPercentage}%`
              : "Manual Listing"}{" "}
          </Typography>
        </div>
        {poolDetails?.isBuyBackEnabled && media?.Buy_back_percentage > 0 && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">BuyBack Percent</Typography>
            <Typography variant="body1">
              {media?.Buy_back_percentage}
            </Typography>
          </div>
        )}
        {poolDetails?.liquidityPercentage !== 0 && (
          <div className="flex justify-between items-center owner-zone-text">
            <Typography variant="body1">Liquidity Unlock</Typography>
            <Typography variant="body1">
              {timeDetails?.unlockTime} minutes
            </Typography>
          </div>
        )}
      </div>
    </Box>
  );
};

export default About;
