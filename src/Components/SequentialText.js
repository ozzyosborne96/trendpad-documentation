import { motion } from "framer-motion";
import { Typography } from "@mui/material";

const SequentialText = ({ text }) => {
  const words = text.split(" "); // Split the text into words

  return (
    <motion.div
      initial={{ opacity: 0 }} // Start with full transparency for the entire div
      whileInView={{ opacity: 1 }} // Fade in when the element is in view
      viewport={{ once: false, amount: 0.2 }} // Animation starts once the block is 20% visible
      transition={{ duration: 1 }} // Duration for the fade-in effect
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }} // Start with opacity 0 and slight Y-axis shift
          whileInView={{
            opacity: 1, // Animate to full opacity
            y: 0, // Reset Y-axis position
          }}
          viewport={{ once: false, amount: 0.2 }} // Animation starts when word is 20% visible
          transition={{
            delay: index * 0.5, // Sequential delay based on word index
            duration: 0.5, // Duration of each word appearing
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default SequentialText;
