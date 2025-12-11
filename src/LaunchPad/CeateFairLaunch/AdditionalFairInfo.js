import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Grid, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  logoUrl: Yup.string()
    .trim()
    .matches(/\.(jpeg|jpg|gif|png|svg)$/, "Must be a valid image URL")
    .required("Logo URL is required"),
  website: Yup.string()
    .trim()
    .url("Invalid URL")
    .required("Website is required"),
  twitter: Yup.string()
    .trim()
    .url("Invalid URL")
    .required("Twitter is required"),
  facebook: Yup.string().trim().url("Invalid URL").nullable(),
  github: Yup.string().trim().url("Invalid URL").nullable(),
  telegram: Yup.string().trim().url("Invalid URL").nullable(),
  instagram: Yup.string().trim().url("Invalid URL").nullable(),
  discord: Yup.string().trim().url("Invalid URL").nullable(),
  reddit: Yup.string().trim().url("Invalid URL").nullable(),
  youtube: Yup.string().trim().url("Invalid URL").nullable(),
  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(128, "Description must be at least 128 characters")
    .max(500, "Description must be at most 500 characters")
    .nullable(),
});

import { FairLaunchTheme } from "./FairLaunchTheme";

const AdditionalFairInfo = ({
  handleNext,
  activeStep,
  steps,
  handleBack,
  stepData,
  setStepData,
}) => {
  const [logoPreview, setLogoPreview] = useState("");
  const [logoError, setLogoError] = useState(false);
  // ... formik initialization ...
  const formik = useFormik({
    initialValues: {
      logoUrl: stepData?.logoUrl,
      website: stepData?.website,
      facebook: stepData?.facebook,
      twitter: stepData?.twitter,
      github: stepData?.github,
      telegram: stepData?.telegram,
      instagram: stepData?.instagram,
      discord: stepData?.discord,
      reddit: stepData?.reddit,
      youtube: stepData?.youtube,
      description: stepData?.description,
    },
    validationSchema,
    onSubmit: (values) => {
      handleNextClick(values); // proceed to the next step
    },
  });
  const handleNextClick = (values) => {
    const newStepData = {
      additionalInfo: {
        logoUrl: values?.logoUrl,
        website: values?.website,
        facebook: values?.facebook,
        twitter: values?.twitter,
        github: values?.github,
        telegram: values?.telegram,
        instagram: values?.instagram,
        discord: values?.discord,
        reddit: values?.reddit,
        youtube: values?.youtube,
        description: values?.description,
      },
    };
    setStepData((prev) => ({
      ...prev,
      ...newStepData,
    }));
    handleNext(newStepData);
  };
  useEffect(() => {
    const url = formik.values.logoUrl;
    if (url && /\.(jpg|jpeg|png|gif|svg)$/i.test(url)) {
      setLogoPreview(url);
      setLogoError(false);
    } else {
      setLogoPreview("");
    }
  }, [formik.values.logoUrl]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        className="flex flex-col gap-16"
        sx={(theme) => FairLaunchTheme.cardStyle(theme)}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              sx={(theme) => ({ color: theme.palette.text.secondary, mb: 1 })}
            >
              (*) is required field
            </Typography>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1,
              })}
            >
              Logo URL*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Logo URL"
              name="logoUrl"
              value={formik.values.logoUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={(theme) => FairLaunchTheme.inputStyle(theme)}
              error={formik.touched.logoUrl && Boolean(formik.errors.logoUrl)}
              helperText={
                logoError ? (
                  <span style={{ color: "#FF4444" }}>
                    Image could not be loaded. Please check the URL.
                  </span>
                ) : (
                  formik.touched.logoUrl && formik.errors.logoUrl
                )
              }
            />
            {/* Preview */}
            {logoPreview && !logoError && (
              <Box
                mt={2}
                sx={{
                  p: 1,
                  border: "1px solid #333",
                  borderRadius: "8px",
                  display: "inline-block",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "#DDD", mb: 1 }}>
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
                  }}
                  onError={() => {
                    setLogoError(true);
                    setLogoPreview(""); // hide broken image
                  }}
                  onLoad={() => setLogoError(false)}
                />
              </Box>
            )}
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: "#9CA3AF" }}
            >
              URL must end with a supported image extension png, jpg, jpeg or
              gif. You can upload your image at{" "}
              <a
                href="http://upload.trendsale.finance/"
                style={{ color: "#00FFFF" }}
                target="_blank"
                rel="noreferrer"
              >
                upload.trendsale.finance
              </a>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1,
              })}
            >
              Website*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://"
              name="website"
              value={formik.values.website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={formik.touched.website && Boolean(formik.errors.website)}
              helperText={formik.touched.website && formik.errors.website}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({ color: theme.palette.text.primary, mb: 1 })}
            >
              Facebook
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://facebook.com/..."
              name="facebook"
              value={formik.values.facebook}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={formik.touched.facebook && Boolean(formik.errors.facebook)}
              helperText={formik.touched.facebook && formik.errors.facebook}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{ ...FairLaunchTheme.gradientText, mb: 1 }}
            >
              Twitter*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://twitter.com/..."
              name="twitter"
              value={formik.values.twitter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={formik.touched.twitter && Boolean(formik.errors.twitter)}
              helperText={formik.touched.twitter && formik.errors.twitter}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: "#E5E7EB", mb: 1 }}>
              GitHub
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://github.com/..."
              name="github"
              value={formik.values.github}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={formik.touched.github && Boolean(formik.errors.github)}
              helperText={formik.touched.github && formik.errors.github}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: "#E5E7EB", mb: 1 }}>
              Telegram
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://telegram.com/..."
              name="telegram"
              value={formik.values.telegram}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={formik.touched.telegram && Boolean(formik.errors.telegram)}
              helperText={formik.touched.telegram && formik.errors.telegram}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: "#E5E7EB", mb: 1 }}>
              Instagram
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://instagram.com/..."
              name="instagram"
              value={formik.values.instagram}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={
                formik.touched.instagram && Boolean(formik.errors.instagram)
              }
              helperText={formik.touched.instagram && formik.errors.instagram}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: "#E5E7EB", mb: 1 }}>
              Discord
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://discord.com/..."
              name="discord"
              value={formik.values.discord}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={formik.touched.discord && Boolean(formik.errors.discord)}
              helperText={formik.touched.discord && formik.errors.discord}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: "#E5E7EB", mb: 1 }}>
              Reddit
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://reddit.com/..."
              name="reddit"
              value={formik.values.reddit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={formik.touched.reddit && Boolean(formik.errors.reddit)}
              helperText={formik.touched.reddit && formik.errors.reddit}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: "#E5E7EB", mb: 1 }}>
              Youtube Video
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ex: http://youtube.com/..."
              name="youtube"
              value={formik.values.youtube}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={formik.touched.youtube && Boolean(formik.errors.youtube)}
              helperText={formik.touched.youtube && formik.errors.youtube}
            />
            <Typography
              variant="caption"
              sx={{ color: "#9CA3AF", mt: 1, display: "block" }}
            >
              Input your youtube URL or youtube Video ID
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ ...FairLaunchTheme.gradientText, mb: 1 }}
            >
              Description*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              placeholder="Ex: This is the best project"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={FairLaunchTheme.inputStyle}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
        </Grid>

        <Box className="flex items-center justify-center gap-2" sx={{ pt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              width: "300px",
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                color: theme.palette.text.primary,
              },
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
              width: "300px",
            })}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default AdditionalFairInfo;
