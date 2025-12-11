import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"; // You can change this icon

const NewsletterAccordion = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    // Replace with your actual subscription logic
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <Accordion
      sx={{
        p: 2,
        background: (theme) => theme.palette.background.paper,
        padding: "20px 32px",
        marginBottom: "20px",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        aria-controls="newsletter-content"
        id="newsletter-header"
      >
        <MarkEmailReadIcon sx={{ color: "#fff", mr: 1 }} />
        <Typography sx={{ color: "#fff", fontWeight: 500 }}>
          Subscribe to our Newsletter
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography sx={{ color: "#ccc", mb: 2 }}>
          Get the latest updates and announcements straight to your inbox.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubscribe}
            sx={{ whiteSpace: "nowrap" }}
          >
            Subscribe
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default NewsletterAccordion;
