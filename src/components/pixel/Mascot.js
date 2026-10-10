import React from "react";
import { motion } from "framer-motion";
import PixelSprite from "./PixelSprite";
import { ghost } from "./sprites";

// The ghost that guides you through the app. It stays mounted across screens
// and glides between places ("hero", "header", "hidden") with a layout animation.
export default function Mascot({ place, onClick }) {
  return (
    <motion.button
      type="button"
      layout
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`mascot mascot--${place}`}
      onClick={onClick}
      tabIndex={onClick ? 0 : -1}
      aria-label="Fantasmita"
    >
      <div className="mascot__float">
        <PixelSprite sprite={ghost} scale={6} />
      </div>
    </motion.button>
  );
}
