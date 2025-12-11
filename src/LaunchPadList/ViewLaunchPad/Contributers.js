import React from "react";
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
} from "@mui/material";
import { FairLaunchTheme } from "../../LaunchPad/CeateFairLaunch/FairLaunchTheme";
const Contributers = ({
  particip,
  contributerDetails = [],
  isNative,
  currencySymbol,
}) => {
  return (
    <Box
      sx={(theme) => ({
        ...FairLaunchTheme.cardStyle(theme),
        marginBottom: "20px",
      })}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={(theme) => ({
          ...FairLaunchTheme.gradientText(theme),
          marginBottom: "20px",
        })}
      >
        Contributors({particip})
      </Typography>

      {particip > 0 && (
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
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#000" : "#fff",
                  }}
                >
                  Address
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#000" : "#fff",
                  }}
                >
                  Amount
                </TableCell>
                {isNative && (
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: (theme) =>
                        theme.palette.mode === "light" ? "#000" : "#fff",
                    }}
                  >
                    Market Value
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {contributerDetails?.length > 0 ? (
                contributerDetails?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{ color: (theme) => theme.palette.text.primary }}
                    >
                      {row.address}
                    </TableCell>
                    <TableCell
                      sx={{ color: (theme) => theme.palette.text.primary }}
                    >
                      {row.amount} {currencySymbol}
                    </TableCell>
                    {isNative && (
                      <TableCell
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        {row.marketValue} {currencySymbol}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isNative ? 3 : 2}
                    sx={{ textAlign: "center", color: "#999" }}
                  >
                    No contributors yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Contributers;
