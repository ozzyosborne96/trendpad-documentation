import React from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        background: theme.palette.background.paper,
        padding: "20px 32px",
        marginBottom: "20px",
        borderRadius: "16px",
        border: theme.palette.mode === "light" ? "1px solid #E0E0E0" : "none",
        boxShadow:
          theme.palette.mode === "light"
            ? "0px 4px 20px rgba(0,0,0,0.05)"
            : "none",
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: theme.palette.text.primary, mb: 2, fontWeight: 700 }}
      >
        FAQ
      </Typography>
      <Accordion
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          borderBottom: `1px solid ${
            theme.palette.mode === "light" ? "#E0E0E0" : "#333"
          }`,
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />
          }
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography
            sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
          >
            What is Auto Listing and Manual Listing in a Launchpad?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Auto Listing automatically adds your token to a DEX (like Uniswap or
            PancakeSwap) after the presale/fair launch ends.
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Manual Listing gives project owners control over when and how to
            list their token manually after launch ends{" "}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          borderBottom: `1px solid ${
            theme.palette.mode === "light" ? "#E0E0E0" : "#333"
          }`,
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />
          }
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography
            sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
          >
            What is the Affiliate System in your Launchpad?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Our Affiliate System allows users to share referral links. When
            someone participates in a token sale via your link, you earn a
            commission in native currency — encouraging community-driven growth.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          borderBottom: `1px solid ${
            theme.palette.mode === "light" ? "#E0E0E0" : "#333"
          }`,
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />
          }
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography
            sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
          >
            What is BuyBack and how does it benefit Fair Launch projects?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            BuyBack is a mechanism where a portion of raised funds is used to
            purchase tokens from the open market, creating price support. This
            feature is only available in Fair Launches on our platform —
            offering extra protection for early investors.{" "}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          borderBottom: `1px solid ${
            theme.palette.mode === "light" ? "#E0E0E0" : "#333"
          }`,
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />
          }
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <Typography
            sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
          >
            What happens if a project fails to reach the soft cap?{" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            If a project does not reach the soft cap by the end of the Fair
            Launch or Presale, the sale is considered unsuccessful. In this
            case:
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            • A "Cancel Sale" button becomes available on the project dashboard.{" "}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            • Once the project owner clicks "Cancel Sale", the sale is
            officially marked as canceled.{" "}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            • All contributors can withdraw their full contributions from the
            platform — no tokens are distributed.
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            • The project owner can reclaim their unsold tokens back to their
            wallet.{" "}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
