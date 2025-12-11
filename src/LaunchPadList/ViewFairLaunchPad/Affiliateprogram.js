import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { FaReddit } from "react-icons/fa6";
import { FaSquareYoutube } from "react-icons/fa6";
import { InputAdornment } from "@mui/material";
import ReferralLinkField from "../../Components/ReferralLinkField";
import { FaGlobe } from "react-icons/fa"; // globe = general website icon
import { useCurrentAccountAddress } from "../../Hooks/AccountAddress";
import { toast } from "react-hot-toast";
import {
  getSponsorAddr,
  getSponserReferalAmountContract,
  claimSponsorRewardAction,
} from "../../ContractAction/FairLaunchPadAction";
import { useEffect } from "react";
import { MdLanguage } from "react-icons/md";
import { FairLaunchTheme } from "../../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const Affiliateprogram = ({
  affiliate,
  reward,
  rewardData = [],
  currencySymbol,
  media,
  poolAddr,
  setUpdate,
  getClaimStatus,
}) => {
  console.log("rewardAmount", rewardData);
  const account = useCurrentAccountAddress();
  const claimSponsorRewardActionClick = async () => {
    try {
      const txHash = await claimSponsorRewardAction(poolAddr);
      if (txHash) {
        toast.success(`Reward claimed! Tx Hash: ${txHash.substring(0, 10)}...`);
        setUpdate((prev) => !prev);
      } else {
        toast.error("Failed to claim reward. Please try again.");
      }
    } catch (error) {
      console.error("Error in claimSponsorRewardActionClick:", error);
      toast.error(error?.message || "An unexpected error occurred.");
    }
  };
  return (
    <Box
      sx={(theme) => ({
        ...FairLaunchTheme.cardStyle(theme),
        marginBottom: "20px",
      })}
    >
      <Typography
        variant="h5"
        sx={(theme) => ({
          ...FairLaunchTheme.gradientText(theme),
          marginBottom: "12px",
        })}
      >
        Affiliate Program
      </Typography>
      <Typography className="body2">
        Share this pool to earn more rewards
      </Typography>
      <div className="mt-16">
        <ReferralLinkField type={"FairLaunchpad"} walletAddress={account} />
      </div>
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
      <div className="mt-16">
        <div className="flex justify-between items-center owner-zone-text">
          <Typography>Your Rewards</Typography>
          <Typography>
            {reward} {currencySymbol}
            {!getClaimStatus && reward > 0 && (
              <Button
                variant="contained"
                onClick={claimSponsorRewardActionClick}
                sx={(theme) => FairLaunchTheme.neonButton(theme)}
              >
                Claim
              </Button>
            )}
          </Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography>Pool Referrer Count</Typography>
          <Typography>{affiliate?.poolReferalCount}</Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography>Real time Reward Percentage</Typography>
          <Typography>{affiliate?.realTimerewardPercentage}%</Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography>Current Rewards</Typography>
          <Typography>
            {affiliate?.currentReward} {currencySymbol}
          </Typography>
        </div>
        {/* <div className="flex justify-between items-center owner-zone-text">
          <Typography>Max Rewards</Typography>
          <Typography>{affiliate?.maxReward} {currencySymbol}</Typography>
        </div> */}

        <div className="flex justify-between items-center owner-zone-text">
          <Typography>Total Ref Amount</Typography>
          <Typography>
            {affiliate?.totalReferred} {currencySymbol}
          </Typography>
        </div>
        <div className="flex justify-between items-center owner-zone-text">
          <Typography>Total Rewards</Typography>
          <Typography>
            {affiliate?.totalRewardAmount} {currencySymbol}
          </Typography>
        </div>
      </div>
      <div className="mt-16">
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            marginBottom: "12px",
          })}
        >
          Top Rewards
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Rewards</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rewardData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.address} </TableCell>
                  <TableCell>
                    {row.referralAmount} {currencySymbol}
                  </TableCell>
                  <TableCell>
                    {row.rewardAmount} {currencySymbol}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default Affiliateprogram;
