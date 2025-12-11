import React, { useEffect, useState } from "react";

const ProgressBar = ({ start, end, current }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (end > start) {
      const percentage = ((current - start) / (end - start)) * 100;
      setProgress(Math.max(0, Math.min(100, percentage))); // Ensure progress stays between 0% - 100%
    }
  }, [start, end, current]);

  return (
    <div style={{ width: "100%", padding: "10px" }}>
      {/* Start, Current, and End Points */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#fff",
          marginBottom: "5px",
        }}
      >
        {/* <span>{start}</span> */}
        <span>{current}</span>
        <span>{end}</span>
       
      </div>

      {/* Progress Bar */}
      <div
        style={{
          backgroundColor: "#444", // Default gray background
          borderRadius: "8px",
          width: "100%",
          height: "12px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: progress > 0 ? "#4A90E2" : "#888", // Default gray when no progress
            height: "100%",
            borderRadius: "8px",
            transition: "width 0.3s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
