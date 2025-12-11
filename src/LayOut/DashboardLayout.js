// DashboardLayout.js
import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const DashboardLayout = ({ children }) => {
  const account = useCurrentAccountAddress();
  console.log("useCurrentAccountAddress", account);
  return (
    <>
      {/* <Appbar /> */}
      <Navbar />
      <main>
        {account === "Not Connected" ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
            <DotLottieReact
              src="https://lottie.host/3d4adab9-9880-4148-bb42-d008cf5fd6a0/jHj78bvbQ3.lottie"
              loop
              autoplay
              style={{
                width: "300px",
                height: "300px",
                margin: "0 auto",
              }}
            />
            <h2>🔐 Please connect your wallet to access the dashboard</h2>
          </div>
        ) : (
          children
        )}
      </main>
    </>
  );
};

export default DashboardLayout;
