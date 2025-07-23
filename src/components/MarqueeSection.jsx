import React from "react";
import { motion } from "framer-motion";

const MarqueeSection = ({ items, from, to }) => {
  return (
    <div className="flex whitespace-nowrap MyGradient text-white py-2 text-md font-medium">
      <motion.div
        initial={{ x: `${from}` }}
        animate={{ x: `${to}` }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="flex flex-shrink-0 gap-16"
      >
        {items.map((text, index) => (
          <span key={index}>{text}</span>
        ))}
      </motion.div>

      <motion.div
        initial={{ x: `${from}` }}
        animate={{ x: `${to}` }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="flex flex-shrink-0 gap-16"
      >
        {items.map((text, index) => (
          <span key={index}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeSection;
