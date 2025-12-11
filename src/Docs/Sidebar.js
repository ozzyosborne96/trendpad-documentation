import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { docsNavigation } from "./contentData";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "sticky",
        top: 20,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
        borderRight: `1px solid ${theme.palette.divider}`,
        pr: 2,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: isDarkMode ? "#333" : "#ddd",
          borderRadius: "3px",
        },
      }}
    >
      <List component="nav">
        {docsNavigation.map((section, index) => (
          <React.Fragment key={index}>
            {section.category && (
              <Typography
                variant="subtitle2"
                sx={{
                  px: 2,
                  mt: 2,
                  mb: 1,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                }}
              >
                {section.category}
              </Typography>
            )}

            {section.items.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                  sx={{
                    borderRadius: "8px",
                    mb: 0.5,
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main + "20",
                      color: theme.palette.primary.main,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main + "30",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "0.9rem",
                      fontWeight: activeSection === item.id ? 600 : 400,
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            {section.items.length > 0 && index < docsNavigation.length - 1 && (
              <Divider sx={{ my: 1, opacity: 0.5 }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
