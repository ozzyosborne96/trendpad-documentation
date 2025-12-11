import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, Button } from "@mui/material";
import { useParams } from "react-router-dom";

const ReferralLinkField = ({type, walletAddress }) => {
  const { launchpadAddress } = useParams(); // dynamic part from URL
  const [refLink, setRefLink] = useState("");

  useEffect(() => {
    if (launchpadAddress && walletAddress) {
      const link = `${window.location.origin}/${type}/View/${launchpadAddress}?refId=${walletAddress}`;
      setRefLink(link);
    }
  }, [launchpadAddress, walletAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
  };

  return (
    <div>
      <TextField
        fullWidth
        variant="outlined"
        value={refLink}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={handleCopy} size="small">
                Copy
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default ReferralLinkField;
