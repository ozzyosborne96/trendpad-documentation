import React, { useEffect, useState } from "react";
import { AdvancedChart } from "react-tradingview-embed";

const TradingChart = ({ symbol }) => {
  const [formattedSymbol, setFormattedSymbol] = useState("");

  useEffect(() => {
    // Ensure the symbol is in uppercase and format it accordingly.
    if (symbol && symbol.trim()) {
      // Dynamically generate the symbol: BINANCE:{SYMBOL}USDT or just SYMBOL if no USDT is needed.
      const symbolUpperCase = symbol.toUpperCase();
      const fullSymbol = `${symbolUpperCase}USDT`; // Try with USDT pairing.

      setFormattedSymbol(fullSymbol);
      console.log("Formatted Symbol:", fullSymbol);
    }
  }, [symbol]);

  // Fallback if no valid symbol or pair
  if (!formattedSymbol || !symbol) {
    return <div>Invalid symbol or pair, please provide a valid symbol like 'BTC' or 'ETH'.</div>;
  }

  return (
    <div style={{ width: "100%", height: "500px", overflow: "hidden" }}>
      <AdvancedChart
        widgetProps={{
          theme: "dark",
          symbol: formattedSymbol, // Pass the dynamically formatted symbol
          interval: "30",
          timezone: "Etc/UTC",
          style: "1",
          allow_symbol_change: true,
          hide_side_toolbar: false,
          save_image: false,
          width: "100%",
          height: 500,
        }}
      />
    </div>
  );
};

export default TradingChart;
