"use client";
import { AlertCircle, RefreshCw, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function PaymentFailed() {
  const contactSupport = () => {
    toast.info("Liên hệ hỗ trợ qua email:");

    // Animation variants
    const pulseAnimation = {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 2,
          ease: "easeInOut",
        },
      },
    };

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white p-4 dark:from-red-950 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Error animation */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-red-200 opacity-40 blur-xl dark:bg-red-700"
                // variants={pulseAnimation}
                initial="initial"
                animate="animate"
              />
              <div className="relative rounded-full bg-red-100 p-5 shadow-md dark:bg-red-900/50">
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                >
                  <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl"
            >
              Payment Failed
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-gray-600 dark:text-gray-300 max-w-xs mx-auto"
            >
              Your payment couldn't be processed. No charges were made.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <Badge
                variant="outline"
                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-3 py-1 text-xs font-medium"
              >
                Payment Declined
              </Badge>
            </motion.div>
          </div>

          {/* Simplified card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border border-red-100 dark:border-red-900/50 overflow-hidden shadow-lg bg-white dark:bg-gray-900">
              <CardContent className="pt-6 pb-0 px-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mb-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Would you like to try again with a different payment method?
                  </p>
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 h-11 text-base">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </motion.div>

                <div className="flex w-full space-x-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full" variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={contactSupport}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Help
                    </Button>
                  </motion.div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4"
          >
            Contact support if you continue to experience issues
          </motion.p>
        </motion.div>
      </div>
    );
  };
}
