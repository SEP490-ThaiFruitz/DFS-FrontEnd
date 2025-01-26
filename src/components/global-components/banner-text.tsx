"use client";
import { motion } from "framer-motion";
import { ColourfulText } from "./colorful-text";

export const BannerText = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -80,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{ duration: 0.6 }}
      className="z-50 flex items-center justify-center"
    >
      <motion.h1 className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
        <ColourfulText text="Thai Fruitz" /> sản phẩm cho bạn <br /> cho{" "}
        <ColourfulText text="mọi nhà" /> !
      </motion.h1>
    </motion.div>
  );
};
