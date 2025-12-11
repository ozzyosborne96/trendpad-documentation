import React from "react";

export default function AnnouncementBanner() {
  return (
    <div
      style={{
        position: "relative",
        top: 0,
        zIndex: 1,
        background: "linear-gradient(90deg, #2299B7 0%, #1A1C66 100%)",
        color: "#FFFFFF",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: 600,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      🚀 Live on EVM! Coming soon on Solana 🌟
    </div>
  );
}
