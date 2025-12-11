import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import style from "./Faq.module.css";
import { Typography, InputAdornment } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
const Faq = () => {
  return (
    <Box mt={10} className={style.outerBox}>
      <Container className={style.containerbox}>
        <div className={style.innerbox}>
          <Typography
            variant="h4"
            sx={{
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "none"
                  : "var(--gradient-4, linear-gradient(117deg, #FFF -11.63%, rgba(154, 224, 241, 0.80) 30.14%, #8C8ED2 62.13%, #FFF 98.35%))",
              color: (theme) => theme.palette.text.primary,
              backgroundClip: (theme) =>
                theme.palette.mode === "light" ? "none" : "text",
              WebkitBackgroundClip: (theme) =>
                theme.palette.mode === "light" ? "none" : "text",
              WebkitTextFillColor: (theme) =>
                theme.palette.mode === "light" ? "inherit" : "transparent",
              fontWeight: "700",
            }}
          >
            FAQ
          </Typography>
          {/* <div className={style.arrowBox}>
            <Typography>See More</Typography>
            <EastIcon />
          </div> */}
        </div>
        <div>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: "12px",
              border: (theme) =>
                `2px solid ${
                  theme.palette.mode === "light" ? "#E0E0E0" : "#121216"
                }`,
              background: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "#121216",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent", // Handled by parent border
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "light" ? "#666" : "white",
                    }}
                  />{" "}
                  {/* Customize icon color */}
                </InputAdornment>
              ),
              sx: {
                color: (theme) => theme.palette.text.primary, // Customize text color
              },
            }}
          />
        </div>
        <div>
          {[
            {
              question: "What is TrendPad Launchpad?",
              answer:
                "TrendPad is a decentralized platform that helps blockchain projects raise funds and launch their tokens through secure and transparent token sale events.",
            },
            {
              question: "Can I launch my own token sale on TrendPad?",
              answer:
                "Yes! You can create and configure your Presale or Fair Launch directly from the platform. Set tokenomics, sale parameters, and go live in minutes",
            },
            {
              question: "What networks does TrendPad support?",
              answer:
                "TrendPad currently supports major EVM-compatible chains like Ethereum, BNB Chain, Polygon, and others. More networks",
            },
            {
              question:
                "How will I receive the tokens after participating in a sale?",
              answer:
                'After the sale ends, the token owner must first finalize the sale. Once finalized, a "Claim" button will appear on the sale dashboard. You can then claim your purchased tokens using your connected wallet.',
            },
          ].map((item, index) => (
            <Accordion
              key={index}
              sx={{
                backgroundColor: "transparent",
                color: (theme) => theme.palette.text.primary,
                borderBottom: (theme) =>
                  `2px solid ${
                    theme.palette.mode === "light" ? "#E0E0E0" : "#363636"
                  }`,
                boxShadow: "none",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                    }}
                  />
                }
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
              >
                <Typography
                  className={style.title}
                  sx={{
                    fontWeight: 600,
                    color: (theme) => theme.palette.text.primary,
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ color: (theme) => theme.palette.text.secondary }}
              >
                {item.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default Faq;
