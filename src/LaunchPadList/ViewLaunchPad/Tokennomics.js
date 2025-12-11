import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Modern, vibrant color palette that works in both modes
  const colors = {
    presale: {
      bg: isDark ? "rgba(34, 153, 183, 0.8)" : "rgba(34, 153, 183, 0.9)",
      border: isDark ? "rgba(34, 153, 183, 1)" : "rgba(34, 153, 183, 1)",
    },
    liquidity: {
      bg: isDark ? "rgba(140, 142, 210, 0.8)" : "rgba(140, 142, 210, 0.9)",
      border: isDark ? "rgba(140, 142, 210, 1)" : "rgba(140, 142, 210, 1)",
    },
    unlock: {
      bg: isDark ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 193, 7, 0.9)",
      border: isDark ? "rgba(255, 215, 0, 1)" : "rgba(255, 193, 7, 1)",
    },
  };

  const data = {
    labels: ["Presale", "Liquidity", "Unlocked Tokens"],
    datasets: [
      {
        label: "Token Distribution",
        data: [40, 30, 30],
        backgroundColor: [
          colors.presale.bg,
          colors.liquidity.bg,
          colors.unlock.bg,
        ],
        borderColor: [
          colors.presale.border,
          colors.liquidity.border,
          colors.unlock.border,
        ],
        borderWidth: 3,
        hoverOffset: 15,
        spacing: 2,
      },
    ],
  };

  const options = {
    cutout: "65%",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 13,
            weight: "600",
            family: "'DM Sans', sans-serif",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(23, 23, 27, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += context.parsed + "%";
            }
            return label;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: 350,
        margin: "0 auto",
        padding: 3,
      }}
    >
      <Doughnut data={data} options={options} />
      {/* Center text overlay */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          marginTop: "-20px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            lineHeight: 1,
          }}
        >
          100%
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          Total Supply
        </Typography>
      </Box>
    </Box>
  );
};

const Tokennomics = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        background: theme.palette.background.paper,
        borderRadius: "16px",
        marginBottom: "20px",
        border: theme.palette.mode === "light" ? "1px solid #E0E0E0" : "none",
        boxShadow:
          theme.palette.mode === "light"
            ? "0px 4px 20px rgba(0,0,0,0.05)"
            : "0px 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 3,
          textAlign: "center",
        }}
      >
        Token Distribution
      </Typography>
      <DoughnutChart />
    </Box>
  );
};

export default Tokennomics;
