import React, { useState } from "react";
import { Container, Grid, Box, Typography, Paper } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import { docsContent } from "./contentData";
import { useTheme } from "@mui/material/styles";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const theme = useTheme();

  const currentContent = docsContent[activeSection] || {
    title: "Not Found",
    content: "Content not found.",
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          pt: 4,
          pb: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Sidebar (Left) */}
            <Grid item xs={12} md={3} lg={2.5}>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Sidebar
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
              </Box>
              {/* Mobile Sidebar could be a drawer here, omitting for brevity/mvp */}
            </Grid>

            {/* Main Content (Right) */}
            <Grid item xs={12} md={9} lg={9.5}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 6 },
                  borderRadius: "16px",
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: "80vh",
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    mb: 4,
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  {currentContent.title}
                </Typography>

                <Box
                  sx={{
                    "& p": {
                      mb: 2,
                      fontSize: "1rem",
                      lineHeight: 1.7,
                      color: theme.palette.text.secondary,
                    },
                    "& h3": {
                      mt: 4,
                      mb: 2,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    },
                    "& ul, & ol": {
                      pl: 4,
                      mb: 2,
                      color: theme.palette.text.secondary,
                    },
                    "& li": {
                      mb: 1,
                      lineHeight: 1.6,
                    },
                    "& a": {
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    },
                  }}
                >
                  {currentContent.content}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Docs;
