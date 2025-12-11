import React from "react";
import { Box, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    labels: ["Presale", "Liquidity", "Unlock token "],
    datasets: [
      {
        label: "Contributions",
        data: [40, 30, 30],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "60%", // controls the "donut hole" size
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

const Tokennomics = () => {
  return (
    <Box
      sx={{
        p: 2,
        background: (theme) => theme.palette.background.paper,
        padding: "20px 32px",
        marginBottom: "20px",
      }}
    >
      <Typography variant="h5">Tokenomics</Typography>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        {" "}
        <DoughnutChart />
      </div>
    </Box>
  );
};

export default Tokennomics;
