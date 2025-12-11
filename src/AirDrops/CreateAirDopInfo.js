import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress, Container } from "@mui/material";
import Disclaimer from "../Components/Disclaimer";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createAirDropHandler } from "../ContractAction/AirDropContractAction";
import { useLocation } from "react-router-dom";
import { useCurrentAccountAddress } from "../Hooks/AccountAddress";
import { FairLaunchTheme } from "../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const validationSchema = Yup.object({
  airdropTitle: Yup.string()
    .transform((value) => value.trim())
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not be more than 100 characters")
    .matches(/^[a-zA-Z0-9 ]*$/, "Title must not contain special characters")
    .required("Airdrop Title is required"),

  logoURL: Yup.string()
    .url("Invalid URL format")
    .required("Logo URL is required")
    .matches(
      /\.(jpg|jpeg|png|gif|svg)$/i,
      "URL must end with a supported image extension (jpg, jpeg, png, gif)"
    ),
  website: Yup.string()
    .url("Invalid URL format")
    .required("Website URL is required"),
  twitter: Yup.string()
    .url("Invalid URL format")
    .required("Twitter URL is required"),
  facebook: Yup.string().url("Invalid URL format"),
  github: Yup.string().url("Invalid URL format"),
  telegram: Yup.string().url("Invalid URL format"),
  instagram: Yup.string().url("Invalid URL format"),
  discord: Yup.string().url("Invalid URL format"),
  reddit: Yup.string().url("Invalid URL format"),
  youtube: Yup.string().url("Invalid URL format"),
  description: Yup.string().test(
    "maxNonSpaceChars",
    "Description must not be more than 500 non-space characters",
    (value) => {
      if (!value) return true; // allow empty value
      const nonSpaceLength = value.replace(/\s/g, "").length;
      return nonSpaceLength <= 500;
    }
  ),
});

const CreateAirDopInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tokenAddress = location?.state?.tokenAddress;
  const tokenDetails = location?.state?.tokenDetails;
  const account = useCurrentAccountAddress();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoError, setLogoError] = useState(false);
  const getYouTubeId = (urlOrId) => {
    try {
      // If user directly entered a YouTube video ID (11 characters)
      if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
        return urlOrId;
      }
      const url = new URL(urlOrId);
      if (url.searchParams.get("v")) {
        return url.searchParams.get("v");
      }
      if (url.hostname === "youtu.be") {
        return url.pathname.slice(1); // remove leading "/"
      }
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/embed/")[1];
      }
      return null;
    } catch (err) {
      return null; // Invalid input
    }
  };

  const textFieldStyle = (theme) => FairLaunchTheme.inputStyle(theme);
  const labelStyle = (theme) => ({
    color: theme.palette.text.primary,
    fontWeight: "bold",
    mb: 1,
  });

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
      <Formik
        initialValues={{
          airdropTitle: "",
          logoURL: "",
          website: "",
          twitter: "",
          facebook: "",
          github: "",
          telegram: "",
          instagram: "",
          discord: "",
          reddit: "",
          youtube: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log(
            "Airdrop Data in JSON Format:",
            JSON.stringify(values, null, 2)
          );
          setLoading(true);
          const cretedrop = await createAirDropHandler(
            tokenAddress,
            account,
            values,
            tokenDetails
          );
          console.log("cretedrop", cretedrop);
          if (cretedrop) {
            navigate(`/airdrops/myDrop/${cretedrop}`, {
              state: {
                data: cretedrop,
              },
            });
          }
          setLoading(false);
        }}
      >
        {({ touched, errors, values }) => (
          <Form>
            <Box
              className="flex flex-col gap-16"
              sx={(theme) => ({
                ...FairLaunchTheme.cardStyle(theme),
                padding: "20px 32px",
                marginTop: "40px",
              })}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div>
                    <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                      Airdrop Title*
                    </Typography>
                    <Field
                      as={TextField}
                      variant="outlined"
                      placeholder="Ex: Eggy"
                      name="airdropTitle"
                      fullWidth
                      error={
                        touched.airdropTitle && Boolean(errors.airdropTitle)
                      }
                      helperText={<ErrorMessage name="airdropTitle" />}
                      sx={textFieldStyle}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <div>
                    <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                      Logo image URL*
                    </Typography>
                    <Field name="logoURL">
                      {({ field, form }) => (
                        <TextField
                          {...field}
                          variant="outlined"
                          placeholder="Enter Logo URL"
                          fullWidth
                          error={
                            (form.touched.logoURL &&
                              Boolean(form.errors.logoURL)) ||
                            logoError
                          }
                          helperText={
                            logoError ? (
                              "Image could not be loaded. Please enter a valid image URL."
                            ) : (
                              <ErrorMessage name="logoURL" />
                            )
                          }
                          onChange={(e) => {
                            field.onChange(e); // Update Formik state
                            const url = e.target.value;
                            if (url && /\.(jpg|jpeg|png|gif|svg)$/i.test(url)) {
                              setLogoPreview(url);
                              setLogoError(false); // Reset error when URL changes
                            } else {
                              setLogoPreview("");
                              setLogoError(false);
                            }
                          }}
                          sx={textFieldStyle}
                        />
                      )}
                    </Field>
                    {logoPreview && (
                      <Box
                        mt={2}
                        sx={{
                          border: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                          padding: "8px",
                          borderRadius: "8px",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: (theme) => theme.palette.text.primary }}
                        >
                          Logo Preview:
                        </Typography>
                        <Box
                          component="img"
                          src={logoPreview}
                          alt="Logo Preview"
                          sx={{
                            maxWidth: "120px",
                            maxHeight: "120px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            mt: 1,
                            display: logoError ? "none" : "block",
                          }}
                          onError={() => {
                            setLogoError(true);
                            setLogoPreview(""); // Hide preview
                          }}
                          onLoad={() => setLogoError(false)}
                        />
                      </Box>
                    )}

                    <Typography
                      variant="h6"
                      className="commom-gradiant"
                      sx={(theme) => ({
                        fontSize: "12px !important",
                        marginTop: "4px",
                        color: theme.palette.text.secondary,
                      })}
                    >
                      URL must end with a supported image extension png, jpg,
                      jpeg, or gif.
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div style={{ marginTop: "0px" }}>
                    {" "}
                    {/* Fixed alignment issue */}
                    <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                      Website*
                    </Typography>
                    <Field
                      as={TextField}
                      variant="outlined"
                      placeholder="Ex: http://example.com"
                      name="website"
                      fullWidth
                      error={touched.website && Boolean(errors.website)}
                      helperText={<ErrorMessage name="website" />}
                      sx={textFieldStyle}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    Facebook
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: http://facebook.com/..."
                    name="facebook"
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    Twitter*
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: http://twitter.com/..."
                    name="twitter"
                    fullWidth
                    error={touched.twitter && Boolean(errors.twitter)}
                    helperText={<ErrorMessage name="twitter" />}
                    sx={textFieldStyle}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    GitHub
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: http://github.com/..."
                    name="github"
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    Telegram
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: http://telegram.com/..."
                    name="telegram"
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    Instagram
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: http://instagram.com/..."
                    name="instagram"
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    Discord
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: http://discord.com/..."
                    name="discord"
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    Reddit
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: http://reddit.com/..."
                    name="reddit"
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    Youtube Video
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: http://youtube.com/..."
                    name="youtube"
                    fullWidth
                    error={touched.youtube && Boolean(errors.youtube)}
                    helperText={<ErrorMessage name="youtube" />}
                    sx={textFieldStyle}
                  />
                  {values.youtube && (
                    <Box mt={2}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        YouTube Preview:
                      </Typography>
                      {getYouTubeId(values.youtube) ? (
                        <Box
                          component="iframe"
                          width="100%"
                          height="315"
                          src={`https://www.youtube.com/embed/${getYouTubeId(
                            values.youtube
                          )}`}
                          title="YouTube video preview"
                          frameBorder="0"
                          allowFullScreen
                          sx={{ mt: 1, borderRadius: "8px" }}
                        />
                      ) : (
                        <Typography color="error" variant="body2">
                          Invalid YouTube URL or ID
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Typography
                    variant="h6"
                    className="commom-gradiant"
                    sx={(theme) => ({
                      fontSize: "12px !important",
                      marginTop: "4px",
                      color: theme.palette.text.secondary,
                    })}
                  >
                    Input your youtube URL or youtube Video ID
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={(theme) => labelStyle(theme)}>
                    Description
                  </Typography>
                  <Field
                    as={TextField}
                    variant="outlined"
                    placeholder="Ex: This is the best project"
                    name="description"
                    fullWidth
                    multiline
                    error={touched.description && Boolean(errors.description)}
                    helperText={<ErrorMessage name="description" />}
                    sx={textFieldStyle}
                  />
                </Grid>
              </Grid>

              <Box
                className="flex items-center justify-center gap-2"
                sx={{ pt: 2 }}
              >
                <Button
                  onClick={() => navigate(-1)}
                  sx={(theme) => ({
                    ...FairLaunchTheme.neonButton(theme),
                    mr: 1,
                    padding: "10px 20px",
                    width: "364px",
                    height: "50px",
                    background: "rgba(155, 151, 151, 0.1)", // Transparent grey for "Back"
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                  })}
                  variant="outlined"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={(theme) => ({
                    ...FairLaunchTheme.neonButton(theme),
                    padding: "10px 20px",
                    width: "364px",
                    height: "50px",
                  })}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Create New Airdrop"
                  )}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <Disclaimer />
    </Container>
  );
};

export default CreateAirDopInfo;
