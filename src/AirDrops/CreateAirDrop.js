import React, { useState, useEffect } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import useGetTokenDetails from "../Hooks/GetTokenDetails";
import CustomTokenTable from "../Components/CustomTokenTable";
import * as Yup from "yup";
import {
  getNetworkConfig,
  getChainInfo,
} from "../ContractAction/ContractDependency";
import { currencyData } from "../utils/currency";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

// Yup Validation Schema
const validationSchema = Yup.object({
  tokenAddress: Yup.string()
    .required("Token address is required")
    .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid token address format"),
});

const CreateAirDrop = () => {
  const [tokenAddress, setTokenAddress] = useState(""); // State for token address
  const [tokenDetails, setTokenDetails] = useState(null); // Fetched token details
  const [nativeToken, setNativeToken] = useState();
  const [currencyDetails, setCurrencyDetails] = useState();

  const fetchTokenDetails = useGetTokenDetails(); // Hook to fetch token details
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenDetails(tokenAddress).then(setTokenDetails);
    } else {
      setTokenDetails(null);
    }
  }, [tokenAddress]);

  useEffect(() => {
    const fetchConfig = async () => {
      const { chainId } = await getChainInfo();
      const config = await getNetworkConfig(chainId);
      setNativeToken(config?.nativeToken);
      if (chainId) {
        if (currencyData.hasOwnProperty(chainId)) {
          setCurrencyDetails(currencyData[chainId]);
        } else {
          setCurrencyDetails(null);
        }
      }
    };
    fetchConfig();
    // Listen to chain change event
    if (window.ethereum) {
      window.ethereum.on("chainChanged", fetchConfig);
      return () => {
        window.ethereum.removeListener("chainChanged", fetchConfig);
      };
    }
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...FairLaunchTheme.gradientText(theme),
            fontWeight: "bold",
            mb: 2,
          })}
        >
          Create New Airdrop
        </Typography>
      </Box>
      <Box sx={(theme) => FairLaunchTheme.cardStyle(theme)}>
        <Typography
          className="commom-gradiant"
          variant="h6"
          sx={(theme) => ({ mb: 2, color: theme.palette.text.secondary })}
        >
          Creation Fee {currencyDetails?.airdropFee} {nativeToken}{" "}
        </Typography>
        <Formik
          initialValues={{
            tokenAddress: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form Submitted", values);
            navigate("/airdrops/createInfo", {
              state: { tokenAddress: values.tokenAddress, tokenDetails },
            }); // Navigate to next step
          }}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 1, color: (theme) => theme.palette.text.primary }}
                >
                  Token address*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  variant="outlined"
                  placeholder="Ex: 0x1234..."
                  name="tokenAddress"
                  value={tokenAddress} // Bind the value to the tokenAddress state
                  onChange={(e) => {
                    setTokenAddress(e.target.value); // Update tokenAddress state
                    setFieldValue("tokenAddress", e.target.value); // Sync Formik state
                  }}
                  sx={(theme) => FairLaunchTheme.inputStyle(theme)}
                  error={touched.tokenAddress && Boolean(errors.tokenAddress)}
                  helperText={<ErrorMessage name="tokenAddress" />}
                />
              </Box>
              <CustomTokenTable
                tokenDetails={tokenDetails}
                tokenAddress={tokenAddress}
              />

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  sx={(theme) => ({
                    ...FairLaunchTheme.neonButton(theme),
                    width: "100%",
                    maxWidth: "250px",
                  })}
                  type="submit"
                >
                  Next
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default CreateAirDrop;
