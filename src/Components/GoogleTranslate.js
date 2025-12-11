import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

// List of languages to support
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "zh-CN", label: "Chinese", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "tr", label: "Turkish", flag: "🇹🇷" },
  { code: "vi", label: "Vietnamese", flag: "🇻🇳" },
  { code: "id", label: "Indonesian", flag: "🇮🇩" },
  { code: "ne", label: "Nepali", flag: "🇳🇵" },
];

const GoogleTranslate = () => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [isReady, setIsReady] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    // 1. Check/Set Cookie on Load
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };
    const currentCookie = getCookie("googtrans");
    if (currentCookie) {
      const langCode = currentCookie.split("/")[2];
      if (langCode) setSelectedLang(langCode);
    }

    // 2. Inject Styles to Hide Google Widget
    const style = document.createElement("style");
    style.id = "google-translate-hiding-style";
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-combo { display: none !important; }
      .skiptranslate { display: none !important; }
      #google_translate_element { display: none !important; } 
      body { top: 0 !important; }
    `;
    if (!document.getElementById("google-translate-hiding-style")) {
      document.head.appendChild(style);
    }

    // 3. Define the Global Callback
    window.googleTranslateElementInit = () => {
      console.log("Google Translate: Init function called.");
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          // CRITICAL: VERTICAL layout guarantees a <select> element is rendered.
          layout:
            window.google.translate.TranslateElement.InlineLayout.VERTICAL,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // 4. Inject the Script if not present
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      console.log("Google Translate: Script injected.");
    }

    // 5. Observer to Detect when the <select> is actually added to the DOM
    const targetNode = document.getElementById("google_translate_element");
    if (targetNode) {
      observerRef.current = new MutationObserver((mutations) => {
        const select = targetNode.querySelector("select.goog-te-combo");
        if (select) {
          console.log("Google Translate: Hidden widget detected!");
          setIsReady(true);
          observerRef.current.disconnect(); // Stop observing once found
        }
      });
      observerRef.current.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setSelectedLang(newLang);

    // 1. Update the hidden Google Select
    const googleSelect = document.querySelector(".goog-te-combo");
    if (googleSelect) {
      console.log(`Google Translate: Switching to ${newLang}`);
      googleSelect.value = newLang;
      googleSelect.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      console.warn("Google Translate widget not found yet.");
    }

    // 2. Manually set the cookie to ensure persistence without reload issues
    // The format is usually /auto/target_lang or /source_lang/target_lang
    document.cookie = `googtrans=/auto/${newLang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/auto/${newLang}; path=/;`; // Fallback for localhost
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, width: 140 }}>
      {/* 
        We don't really need a visual label if the select itself
        shows the flag/language clearly, but we keep accessible markup.
      */}
      <Select
        value={selectedLang}
        onChange={handleLanguageChange}
        disableUnderline
        sx={{
          color: "white",
          fontSize: "0.875rem",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            gap: 1,
            paddingTop: "4px",
            paddingBottom: "4px",
          },
          "& .MuiSvgIcon-root": { color: "white" },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "rgba(18, 18, 18, 0.95)", // Match dark theme
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              "& .MuiMenuItem-root": {
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
                "&.Mui-selected": {
                  bgcolor: "rgba(99, 102, 241, 0.2)", // Primary color hint
                  "&:hover": {
                    bgcolor: "rgba(99, 102, 241, 0.3)",
                  },
                },
              },
            },
          },
        }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <span
              style={{ fontSize: "1.2rem", marginRight: "8px" }}
              role="img"
              aria-label={lang.label}
            >
              {lang.flag}
            </span>
            <Typography variant="body2" noWrap>
              {lang.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GoogleTranslate;
