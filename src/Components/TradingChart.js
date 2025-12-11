import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, TimeScale, LinearScale, Tooltip } from "chart.js";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import { Chart } from "react-chartjs-2";
import 'chartjs-adapter-date-fns'; // Import the time adapter for date handling

// Register the necessary chart.js components and the financial chart plugin
ChartJS.register(TimeScale, LinearScale, Tooltip, CandlestickController, CandlestickElement);

const data = {
  labels: ["12:00", "12:30", "1:00", "1:30", "2:00"], // Time labels
  datasets: [
    {
      label: "Token Price",
      data: [
        { x: "2025-03-10T12:00:00", o: 0.67, h: 0.69, l: 0.65, c: 0.68 },
        { x: "2025-03-10T12:30:00", o: 0.68, h: 0.70, l: 0.66, c: 0.69 },
        { x: "2025-03-10T13:00:00", o: 0.69, h: 0.72, l: 0.68, c: 0.71 },
      ],
      borderColor: "#00c0ff",
      borderWidth: 2,
    },
  ],
};

export default function TradingChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    // Destroy the previous chart instance when the component re-renders
    let chartInstance;
    if (chartRef.current) {
      chartInstance = new ChartJS(chartRef.current, {
        type: "candlestick",
        data: data,
        options: {
          responsive: true,
          scales: {
            x: {
              type: "time",  // Using "time" scale
            },
          },
        },
      });
    }

    // Cleanup chart instance when the component is unmounted or re-rendered
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []); // Empty dependency array to run this effect only once

  return (
    <div style={{ width: "100%", height: "500px", background: "#000" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
