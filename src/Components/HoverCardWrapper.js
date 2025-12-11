import { motion } from "framer-motion";

const HoverCardWrapper = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};

export default HoverCardWrapper;
