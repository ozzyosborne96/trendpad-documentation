import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light mode palette
            background: {
              default: "#F4F6F8",
              paper: "rgba(255, 255, 255, 0.9)",
            },
            text: {
              primary: "#121212",
              secondary: "#666666",
            },
            primary: {
              main: "#2299b7",
            },
          }
        : {
            // Dark mode palette
            background: {
              default: "#0C0C0F",
              paper: "#1E1E1E",
            },
            text: {
              primary: "#FFFFFF",
              secondary: "#9F9F9F",
            },
          }),
    },
    typography: {
      allVariants: {
        color: mode === "light" ? "#121212" : "#FFFFFF",
      },
      fontFamily: "'DM Sans', sans-serif",
      h1: {
        fontSize: "94px",
        fontWeight: 300,
        lineHeight: 1.167,
        letterSpacing: "-0.02em",
        "@media (max-width:1200px)": { fontSize: "70px" },
        "@media (max-width:768px)": { fontSize: "54px" },
      },
      h2: {
        fontSize: "58px",
        fontWeight: 300,
        lineHeight: 1.2,
        letterSpacing: "-0.015em",
        "@media (max-width:1200px)": { fontSize: "46px" },
        "@media (max-width:768px)": { fontSize: "38px" },
      },
      h3: {
        fontSize: "46px",
        fontWeight: 400,
        lineHeight: 1.167,
        letterSpacing: "-0.01em",
        "@media (max-width:1200px)": { fontSize: "38px" },
        "@media (max-width:768px)": { fontSize: "30px" },
      },
      h4: {
        fontSize: "32px",
        fontWeight: 400,
        lineHeight: 1.235,
        "@media (max-width:1200px)": { fontSize: "26px" },
        "@media (max-width:768px)": { fontSize: "22px" },
      },
      h5: {
        fontSize: "22px",
        fontWeight: 400,
        lineHeight: 1.334,
        "@media (max-width:1200px)": { fontSize: "18px" },
        "@media (max-width:768px)": { fontSize: "16px" },
      },
      h6: {
        fontSize: "18px",
        fontWeight: 500,
        lineHeight: 1.6,
        "@media (max-width:1200px)": { fontSize: "16px" },
        "@media (max-width:768px)": { fontSize: "14px" },
      },
      subtitle1: {
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: 1.75,
      },
      subtitle2: {
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1.57,
      },
      body1: {
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: 1.5,
        color: mode === "light" ? "#666666" : "#9F9F9F",
      },
      body2: {
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: 1.43,
      },
      button: {
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1.75,
        textTransform: "uppercase",
      },
      caption: {
        fontSize: "10px",
        fontWeight: 400,
        lineHeight: 1.66,
      },
      overline: {
        fontSize: "8px",
        fontWeight: 400,
        lineHeight: 2.66,
        textTransform: "uppercase",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            ...(mode === "light" && {
              backgroundImage: `
                linear-gradient(rgba(244, 246, 248, 0.4), rgba(244, 246, 248, 0.4)),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.2'/%3E%3C/svg%3E"),
                radial-gradient(circle at 0% 0%, rgba(34, 153, 183, 0.3) 0%, transparent 40%),
                radial-gradient(circle at 100% 100%, rgba(26, 28, 102, 0.25) 0%, transparent 40%)
              `,
              backgroundAttachment: "fixed",
              backgroundSize: "auto, auto, 100% 100%, 100% 100%",
              backgroundRepeat: "repeat, repeat, no-repeat, no-repeat",
            }),
          },
          // Global focus-visible styles for accessibility
          "*:focus-visible": {
            outline: `2px solid ${mode === "light" ? "#2299b7" : "#2299b7"}`,
            outlineOffset: "2px",
            borderRadius: "4px",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            width: "100%",
            displayEmpty: "true",
            "& .MuiInputBase-input::placeholder": {
              color: mode === "light" ? "#666" : "#BBB",
              opacity: 1,
              fontSize: "14px",
            },
            "& .MuiInputBase-input": {
              padding: "13px 10px",
            },
            "& .MuiOutlinedInput-root": {
              display: "flex",
              displayEmpty: "true",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              alignSelf: "stretch",
              borderRadius: "4px",
              border: `1px solid ${mode === "light" ? "#E0E0E0" : "#3A3A3A"}`,
              backgroundColor: mode === "light" ? "#FFFFFF" : "#1E1E1E",
              color: mode === "light" ? "#121212" : "#FFF",

              "& fieldset": {
                borderColor: mode === "light" ? "#E0E0E0" : "#3A3A3A",
              },
              "&:hover fieldset": {
                borderColor: mode === "light" ? "#BDBDBD" : "#3A3A3A",
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "light" ? "#1976D2" : "#3A3A3A",
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            borderRadius: "4px",
            border: `1px solid ${mode === "light" ? "#E0E0E0" : "#3A3A3A"}`,
            background: mode === "light" ? "#FFFFFF" : "#1E1E1E",
            color: mode === "light" ? "#121212" : "#fff",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${mode === "light" ? "#BDBDBD" : "#3A3A3A"}`,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${mode === "light" ? "#1976D2" : "#3A3A3A"}`,
            },
            "& .MuiSelect-icon": {
              color: mode === "light" ? "#121212" : "#fff",
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            background: mode === "light" ? "#FFFFFF" : "#17171B",
            border: `1px solid ${mode === "light" ? "#E0E0E0" : "#3A3A3A"}`,
            color: mode === "light" ? "#121212" : "#fff",
          },
        },
      },
    },
  });

export default getTheme;
