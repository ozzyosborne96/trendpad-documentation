import { motion } from "framer-motion";
import { Card, CardContent, Typography } from "@mui/material";

// Reusable Animated Card Component with Fade Effect
const AnimatedCard = ({
  children,
  opacity = 0.7, // Default opacity change on hover
  duration = 0.3, // Duration of the fade transition
  scale = 1, // Optional scaling on hover (default: no scaling)
  boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.2)", // Optional shadow effect
  transitionType = "tween", // Transition type
  transitionEase = "easeInOut", // Correct easing function without quotes
  initialX = 0, // Initial horizontal position (for slide-in effects)
  whileHover = {}, // Custom hover animation overrides
}) => {
    console.log("first slide")
  return (
    <motion.div
      whileHover={{
        opacity: opacity,
        scale: scale,
        boxShadow: boxShadow,
        ...whileHover, // Allows custom hover animation overrides
      }}
      transition={{
        duration: duration,
        ease: transitionEase, // Use the correct easing function
        type: transitionType,
      }}
      initial={{ x: initialX }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
