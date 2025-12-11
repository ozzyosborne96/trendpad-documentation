import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { useGlobalState } from "../Context/GlobalStateContext";

export default function Timer({ LockDate }) {
  const [key, setKey] = useState(Date.now()); // Used to reset the timer
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  console.log("LockDate", LockDate);
  const { setTimeUp } = useGlobalState();

  // Convert LockDate string to a valid Date object
  const lockDateObj = new Date(LockDate);

  useEffect(() => {
    // Only log if date is valid to avoid console spam
    if (!isNaN(lockDateObj.getTime())) {
      console.log("Timer Debug:", {
        lockDate: lockDateObj.toLocaleString(),
        lockTimestamp: lockDateObj.getTime(),
        currentDate: new Date().toLocaleString(),
        currentTimestamp: Date.now(),
        isExpired: lockDateObj.getTime() <= Date.now(),
      });
    }
  }, [lockDateObj]);

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
    fontSize: "12px",
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
        padding: "12px",
        backgroundColor: "#1a1a1a",
        color: "white",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      {isNaN(lockDateObj.getTime()) ? (
        <p style={{ fontSize: "14px", color: "white" }}>
          Loading or Invalid Date...
        </p>
      ) : isCompleted || lockDateObj.getTime() <= Date.now() ? (
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "16px",
              color: "#4caf50",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            Unlocked
          </p>
          <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>
            {lockDateObj.toLocaleString()}
          </p>
        </div>
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
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={style}>{String(days).padStart(2, "0")}</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Days</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={style}>{String(hours).padStart(2, "0")}</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Hrs</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={style}>{String(minutes).padStart(2, "0")}</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Mins</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={style}>{String(seconds).padStart(2, "0")}</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Secs</div>
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
