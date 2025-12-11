import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { useGlobalState } from "../Context/GlobalStateContext";

export default function LauncnchpadTimer({ LockDate }) {
  const [key, setKey] = useState(Date.now()); // Used to reset the timer
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  console.log("LockDate", LockDate);
  const { setTimeUp } = useGlobalState();

  // Convert LockDate string to a valid Date object
  const lockDateObj = new Date(LockDate);

  useEffect(() => {
    console.log("LockDate Object:", lockDateObj);
    if (isNaN(lockDateObj)) {
      console.error("Invalid LockDate provided:", LockDate);
    }
  }, [LockDate]);

  // Sync global state when countdown is completed or not
  useEffect(() => {
    setTimeUp(isCompleted);
  }, [isCompleted, setTimeUp]);
  useEffect(() => {
    setKey(Date.now()); // Resets countdown when LockDate changes
  }, [LockDate]);

  // Box styles
  const boxStyle = {
    width: "27px",
    height: "27px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "8px",
    margin: "0 5px",
  };

  const boxStyle1 = {
    ...boxStyle,
    backgroundColor: "red",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        color: "white",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      {isNaN(lockDateObj) ? (
        <p style={{ fontSize: "14px", color: "white" }}>Loading....</p>
      ) : (
        <Countdown
          key={key}
          date={lockDateObj.getTime()}
          autoStart={!isPaused}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            // Update internal completed state safely
            if (completed && !isCompleted) setIsCompleted(true);
            if (!completed && isCompleted) setIsCompleted(false);

            const style = completed ? boxStyle1 : boxStyle;

            return (
              <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                {String(days).padStart(2, "0")}d :{" "}
                {String(hours).padStart(2, "0")}h :{" "}
                {String(minutes).padStart(2, "0")}m :{" "}
                {String(seconds).padStart(2, "0")}s
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
