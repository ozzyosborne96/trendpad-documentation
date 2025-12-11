import { useEffect, useState, useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
const AnimatedNumber = ({ value }) => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isInView, setIsInView] = useState(false);

  // Memoize the `value` to avoid unnecessary re-renders
  const memoizedValue = useMemo(() => value, [value]);

  // Use useCallback for the animation logic to prevent recreation on each render
  const startCounting = useCallback(() => {
    if (!isInView || !memoizedValue) return;

    // Extract the numeric part
    const numericValue = parseFloat(memoizedValue.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue)) return;

    let start = 0;
    const duration = 2; // Duration in seconds
    const framesPerSecond = 60; // 60 FPS
    const totalFrames = duration * framesPerSecond;
    const increment = numericValue / totalFrames; // Increment per frame

    // Reset the displayNumber to 0 every time
    setDisplayNumber(0);

    const updateNumber = () => {
      start += increment;
      if (start >= numericValue) {
        setDisplayNumber(numericValue); // End at the target value
      } else {
        setDisplayNumber(start);
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [isInView, memoizedValue]);

  // Extract non-numeric characters (e.g., "$", "M", "K")
  const prefix = memoizedValue.match(/^\D+/)?.[0] || ""; // Symbols at the start (e.g., "$")
  const suffix = memoizedValue.match(/\D+$/)?.[0] || ""; // Symbols at the end (e.g., "M")

  // Only trigger the animation when the component enters the viewport
  useEffect(() => {
    if (isInView) {
      startCounting();
    }
  }, [isInView, startCounting]); // Only run when `isInView` changes
  console.log("Start");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }} // Animation triggers when in view
      onViewportEnter={() => setIsInView(true)} // Starts the counting animation when in view
      onViewportLeave={() => setIsInView(false)} // Reset isInView when leaving the viewport
      viewport={{ once: false, amount: 0.2 }} // Animation triggers when 20% of the component is visible
      transition={{ duration: 1 }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: (theme) => theme.palette.text.primary,
          lineHeight: "54.302px",
        }}
      >
        {prefix}
        {displayNumber.toFixed(1)} {/* Display up to 1 decimal */}
        {suffix}
      </Typography>
    </motion.div>
  );
};

export default AnimatedNumber;
