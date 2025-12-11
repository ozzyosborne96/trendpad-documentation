import React, { useEffect, useState } from "react";
import { Typography, Tooltip, Box } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getNetworkConfig } from "../ContractAction/ContractDependency";

const shortenAddress = (address, start = 6, end = 4) => {
  return address ? `${address.slice(0, start)}...${address.slice(-end)}` : "";
};

const TokenAddressLink = ({
  address,
  color = "#1D64FA",
  fontSize = "1rem",
  fontWeight = 700,
  truncate = true,
  showCopyIcon = false,
  tooltip = "View on Explorer",
}) => {
  const [explorer, setExplorer] = useState("");
  console.log("address", address);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
  };

  useEffect(() => {
    const fetchExplorer = async () => {
      try {
        const { explorer } = await getNetworkConfig(); // make sure this returns { explorer: "..." }
        setExplorer(explorer);
      } catch (error) {
        console.error("Failed to fetch explorer URL:", error);
      }
    };
    fetchExplorer();
  }, []);

  if (!explorer || !address) return null;

  return (
    <Tooltip title={tooltip}>
      <Box
        component="a"
        href={`${explorer}/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color,
            fontWeight,
            fontSize,
            whiteSpace: "nowrap",
            // overflow: "hidden",
            // textOverflow: "ellipsis",
            // maxWidth: truncate ? "160px" : "unset",
          }}
        >
          {truncate ? shortenAddress(address) : address}
        </Typography>

        {showCopyIcon && (
          <ContentCopyIcon
            fontSize="small"
            sx={{ color, cursor: "pointer" }}
            onClick={handleCopy}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default TokenAddressLink;
