import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./global.css";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/dm-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import { base, mainnet, optimism } from "wagmi/chains";
import { chains } from "./wagmiConfig";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
const queryClient = new QueryClient();

import ErrorBoundary from "./Components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider chains={chains}>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
