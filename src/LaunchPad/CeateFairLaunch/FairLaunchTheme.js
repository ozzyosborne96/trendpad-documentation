import { alpha } from "@mui/material/styles";

export const FairLaunchTheme = {
  colors: {
    bgDark: "#0B0E13",
    cardBg: "#1A1F2B",
    accentCyan: "#00FFFF",
    accentPurple: "#A855F7",
    accentBlue: "#3B82F6",
    borderGradient: "linear-gradient(135deg, #00FFFF 0%, #A855F7 100%)",
  },

  // Main Card Style for Form Containers
  cardStyle: (theme) => ({
    background:
      theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.9)" : "#1A1F2B",
    borderRadius: "16px",
    border:
      theme.palette.mode === "light"
        ? "1px solid rgba(0, 0, 0, 0.05)"
        : "1px solid rgba(0, 255, 255, 0.15)",
    padding: { xs: "24px", md: "40px" },
    // Soft outer glow in accent color (low opacity)
    boxShadow:
      theme.palette.mode === "light"
        ? "0 4px 20px rgba(0, 0, 0, 0.05)"
        : "0 0 20px rgba(0, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(0, 255, 255, 0.5)",
      boxShadow:
        theme.palette.mode === "light"
          ? "0 8px 25px rgba(0, 0, 0, 0.1)"
          : "0 0 30px rgba(0, 255, 255, 0.15)",
      transform: "scale(1.002)", // Slight scale-up (1.02x might be too much for full forms)
    },
  }),

  // Gradient Heading Text
  gradientText: (theme) => ({
    fontFamily: "'Orbitron', 'Inter', sans-serif", // Ensure these fonts are loaded generally or fallback to sans-serif
    background:
      theme.palette.mode === "light"
        ? "linear-gradient(90deg, #2299b7 0%, #1A1C66 100%)"
        : "linear-gradient(90deg, #00FFFF 0%, #A855F7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    textShadow:
      theme.palette.mode === "light"
        ? "none"
        : "0 0 20px rgba(0, 255, 255, 0.3)",
  }),

  // Neon Input Field Override
  inputStyle: (theme) => ({
    "& .MuiOutlinedInput-root": {
      background: theme.palette.mode === "light" ? "#F5F7FA" : "#0B0E13",
      borderRadius: "8px",
      color: theme.palette.mode === "light" ? "#1F2937" : "#E5E7EB",
      "& fieldset": {
        borderColor:
          theme.palette.mode === "light" ? "#E5E7EB" : "rgba(0, 255, 255, 0.2)",
      },
      "&:hover fieldset": {
        borderColor: theme.palette.mode === "light" ? "#2299b7" : "#00FFFF",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 0 10px rgba(34, 153, 183, 0.1)"
            : "0 0 10px rgba(0, 255, 255, 0.2)",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.mode === "light" ? "#2299b7" : "#00FFFF",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 0 15px rgba(34, 153, 183, 0.2)"
            : "0 0 15px rgba(0, 255, 255, 0.4)",
      },
      // Ensure input text color and placeholder are correct
      "& input": {
        color: theme.palette.mode === "light" ? "#1F2937" : "#E5E7EB",
      },
      "& input::placeholder": {
        color: theme.palette.mode === "light" ? "#6B7280" : "#9CA3AF",
        opacity: 1,
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.mode === "light" ? "#6B7280" : "#9CA3AF",
      "&.Mui-focused": {
        color: theme.palette.mode === "light" ? "#2299b7" : "#00FFFF",
      },
    },
  }),

  // Glowing Button
  neonButton: (theme) => ({
    background: "transparent",
    border:
      theme.palette.mode === "light"
        ? "1px solid #2299b7"
        : "1px solid #00FFFF",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 4px 10px rgba(34, 153, 183, 0.1)"
        : "0 0 15px rgba(0, 255, 255, 0.2)",
    color: theme.palette.mode === "light" ? "#2299b7" : "#00FFFF",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    padding: "12px 30px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      background:
        theme.palette.mode === "light"
          ? "rgba(34, 153, 183, 0.1)"
          : "rgba(0, 255, 255, 0.1)",
      boxShadow:
        theme.palette.mode === "light"
          ? "0 8px 20px rgba(34, 153, 183, 0.2)"
          : "0 0 30px rgba(0, 255, 255, 0.5)",
      transform: "translateY(-2px)",
    },
    "&:disabled": {
      borderColor: theme.palette.mode === "light" ? "#B0B0B0" : "#4A5568", // Visible but distinct border
      color: theme.palette.mode === "light" ? "#9E9E9E" : "#A0AEC0", // Readable gray text
      boxShadow: "none",
      background:
        theme.palette.mode === "light"
          ? "rgba(0,0,0,0.05)"
          : "rgba(255,255,255,0.05)", // Subtle fill to show existence
      cursor: "not-allowed",
    },
  }),

  // Warning Box Style
  warningBox: (theme) => ({
    background:
      theme.palette.mode === "light"
        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)"
        : "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    borderRadius: "16px",
    padding: { xs: "20px", sm: "24px" },
    boxShadow: "0 8px 32px rgba(239, 68, 68, 0.1)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    textAlign: "center",
  }),
};
