"use client";

import { Logo } from "@/components/global-components/logo";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { motion } from "framer-motion";

export default function ImprovedLoadingPage() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50
        to-pink-50"
    >
      <motion.div
        className="flex flex-col items-center justify-center space-y-8 rounded-2xl bg-white p-12
          shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Logo className="mb-4" />
        </motion.div>

        <motion.div
          className="flex items-center justify-center space-x-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <WaitingSpinner
            // outerSize="h-10 w-10"
            // childSize="h-8 w-8"

            label="Đang tải..."
            variant="pinwheel"
            className="bg-gradient-to-bl from-pink-500 to-blue-600"
          />
          <span className="text-xl font-semibold text-gray-700">
            Loading...
          </span>
        </motion.div>

        <motion.div
          className="mt-4 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Hãy chờ trong giây lát!
        </motion.div>
      </motion.div>
    </div>
  );
}
