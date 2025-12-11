import { React, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FairLaunchTheme } from "../CeateFairLaunch/FairLaunchTheme";

const AdditionalInfo = ({
  handleNext,
  activeStep,
  steps,
  handleBack,
  stepData,
  setStepData,
}) => {
  const neonInputStyle = FairLaunchTheme.inputStyle;

  const formik = useFormik({
    initialValues: {
      logoUrl: stepData.logoUrl || "",
      websiteUrl: stepData.websiteUrl || "",
      facebookUrl: stepData.facebookUrl || "",
      twitterUrl: stepData.twitterUrl || "",
      githubUrl: stepData.githubUrl || "",
      telegramUrl: stepData.telegramUrl || "",
      instagramUrl: stepData.instagramUrl || "",
      discordUrl: stepData.discordUrl || "",
      redditUrl: stepData.redditUrl || "",
      youtubeUrl: stepData.youtubeUrl || "",
      description: stepData.description || "",
    },
    validationSchema: Yup.object({
      logoUrl: Yup.string().url("Invalid URL").required("Logo URL is required"),
      websiteUrl: Yup.string().url("Invalid URL"),
      facebookUrl: Yup.string().url("Invalid URL"),
      twitterUrl: Yup.string().url("Invalid URL"),
      githubUrl: Yup.string().url("Invalid URL"),
      telegramUrl: Yup.string().url("Invalid URL"),
      instagramUrl: Yup.string().url("Invalid URL"),
      discordUrl: Yup.string().url("Invalid URL"),
      redditUrl: Yup.string().url("Invalid URL"),
      youtubeUrl: Yup.string().url("Invalid URL"),
      // websiteUrl: Yup.string().url("Invalid URL").required("Website URL is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      setStepData((prev) => ({ ...prev, ...values }));
      handleNext(values);
    },
  });

  return (
    <Box sx={(theme) => FairLaunchTheme.cardStyle(theme)}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
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
                mb: 1.5,
              })}
            >
              Logo URL*
            </Typography>
            <TextField
              name="logoUrl"
              variant="outlined"
              placeholder="Ex: https://..."
              value={formik.values.logoUrl}
              onChange={formik.handleChange}
              error={formik.touched.logoUrl && Boolean(formik.errors.logoUrl)}
              helperText={formik.touched.logoUrl && formik.errors.logoUrl}
              fullWidth
              sx={neonInputStyle}
            />
            <Typography
              variant="body2"
              sx={(theme) => ({ mt: 1, color: theme.palette.info.main })}
            >
              URL must end with a supported image extension png, jpg, jpeg or
              gif. You can upload on{" "}
              <a
                href="https://postimages.org/"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#00FFFF", textDecoration: "none" }}
              >
                https://postimages.org/
              </a>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Website*
            </Typography>
            <TextField
              name="websiteUrl"
              variant="outlined"
              placeholder="Ex: https://..."
              value={formik.values.websiteUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)
              }
              helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Facebook
            </Typography>
            <TextField
              name="facebookUrl"
              variant="outlined"
              placeholder="Ex: https://facebook.com/..."
              value={formik.values.facebookUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.facebookUrl && Boolean(formik.errors.facebookUrl)
              }
              helperText={
                formik.touched.facebookUrl && formik.errors.facebookUrl
              }
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Twitter
            </Typography>
            <TextField
              name="twitterUrl"
              variant="outlined"
              placeholder="Ex: https://twitter.com/..."
              value={formik.values.twitterUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.twitterUrl && Boolean(formik.errors.twitterUrl)
              }
              helperText={formik.touched.twitterUrl && formik.errors.twitterUrl}
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Github
            </Typography>
            <TextField
              name="githubUrl"
              variant="outlined"
              placeholder="Ex: https://github.com/..."
              value={formik.values.githubUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.githubUrl && Boolean(formik.errors.githubUrl)
              }
              helperText={formik.touched.githubUrl && formik.errors.githubUrl}
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Telegram
            </Typography>
            <TextField
              name="telegramUrl"
              variant="outlined"
              placeholder="Ex: https://t.me/..."
              value={formik.values.telegramUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.telegramUrl && Boolean(formik.errors.telegramUrl)
              }
              helperText={
                formik.touched.telegramUrl && formik.errors.telegramUrl
              }
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Instagram
            </Typography>
            <TextField
              name="instagramUrl"
              variant="outlined"
              placeholder="Ex: https://instagram.com/..."
              value={formik.values.instagramUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.instagramUrl &&
                Boolean(formik.errors.instagramUrl)
              }
              helperText={
                formik.touched.instagramUrl && formik.errors.instagramUrl
              }
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Discord
            </Typography>
            <TextField
              name="discordUrl"
              variant="outlined"
              placeholder="Ex: https://discord.gg/..."
              value={formik.values.discordUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.discordUrl && Boolean(formik.errors.discordUrl)
              }
              helperText={formik.touched.discordUrl && formik.errors.discordUrl}
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Reddit
            </Typography>
            <TextField
              name="redditUrl"
              variant="outlined"
              placeholder="Ex: https://reddit.com/r/..."
              value={formik.values.redditUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.redditUrl && Boolean(formik.errors.redditUrl)
              }
              helperText={formik.touched.redditUrl && formik.errors.redditUrl}
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Youtube Video
            </Typography>
            <TextField
              name="youtubeUrl"
              variant="outlined"
              placeholder="Ex: https://youtube.com/watch?v=..."
              value={formik.values.youtubeUrl}
              onChange={formik.handleChange}
              error={
                formik.touched.youtubeUrl && Boolean(formik.errors.youtubeUrl)
              }
              helperText={formik.touched.youtubeUrl && formik.errors.youtubeUrl}
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={(theme) => ({
                ...FairLaunchTheme.gradientText(theme),
                mb: 1.5,
              })}
            >
              Description*
            </Typography>
            <TextField
              name="description"
              variant="outlined"
              placeholder="Ex: This is the best project..."
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
              sx={neonInputStyle}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
          >
            <Button
              onClick={handleBack}
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                  color: theme.palette.text.primary,
                  background: "rgba(255, 255, 255, 0.05)",
                },
              })}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={(theme) => ({
                ...FairLaunchTheme.neonButton(theme),
                minWidth: "200px",
              })}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default AdditionalInfo;
