"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Copy,
  Download,
  Home,
  ShoppingBag,
  CreditCard,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock payment data - this would come from your API in a real application
  const paymentData = {
    orderId: "ORD-7829-3426",
    date: "March 7, 2025",
    time: "07:18 AM",
    amount: "$149.99",
    paymentMethod: "Visa •••• 4242",
    email: "customer@example.com",
    items: [
      {
        name: "Premium Subscription (Annual)",
        price: "$129.99",
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=80&h=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      {
        name: "Setup Fee",
        price: "$20.00",
        image:
          "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=80&h=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
    ],
    subtotal: "$149.99",
    tax: "$0.00",
    total: "$149.99",
  };

  useEffect(() => {
    // Animate progress bar on load
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText(paymentData.orderId);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 dark:from-green-950 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Success animation */}
        <div className="flex flex-col items-center text-center mb-6">
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
            <div className="absolute inset-0 rounded-full bg-green-200 opacity-30 blur-xl dark:bg-green-700"></div>
            <div className="relative rounded-full bg-green-100 p-4 shadow-md dark:bg-green-900/50">
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-gray-600 dark:text-gray-300"
          >
            Thank you for your purchase.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-3"
          >
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1"
            >
              Order Confirmed
            </Badge>
          </motion.div>
        </div>

        {/* Order details card */}
        <motion.div variants={container} initial="hidden" animate="show">
          <Card className="border-2 border-green-100 dark:border-green-900/50 overflow-hidden shadow-lg">
            <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-green-800 dark:text-green-300">
                  Order Summary
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyOrderId}
                  className="h-8 w-8 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy order ID</span>
                </Button>
              </div>
              <CardDescription className="text-green-700 dark:text-green-400 flex items-center">
                <span>Order ID: {paymentData.orderId}</span>
              </CardDescription>
            </CardHeader>

            <div className="px-6 py-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Processing</span>
                <span>Complete</span>
              </div>
              <Progress
                value={progress}
                className="h-1.5 w-full bg-gray-200 dark:bg-gray-700"
              />
            </div>

            <CardContent className="space-y-5 pt-4">
              <motion.div variants={item} className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-1 h-3 w-3" />
                    Date
                  </div>
                  <div className="text-sm font-medium">{paymentData.date}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <CreditCard className="mr-1 h-3 w-3" />
                    Payment
                  </div>
                  <div className="text-sm font-medium">
                    {paymentData.paymentMethod}
                  </div>
                </div>
              </motion.div>

              <Separator />

              <motion.div variants={item}>
                <h3 className="mb-3 text-sm font-medium">Items</h3>
                <div className="space-y-3">
                  {paymentData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={item}
                className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
              >
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{paymentData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{paymentData.tax}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-green-700 dark:text-green-400">
                    {paymentData.total}
                  </span>
                </div>
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2 bg-gray-50 p-4 dark:bg-gray-800/30">
              <motion.div variants={item} className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </motion.div>
              <motion.div variants={item} className="flex w-full space-x-2">
                <Button className="flex-1" variant="outline">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View Order
                </Button>
                <Button className="flex-1" variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Continue
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4"
        >
          A confirmation email has been sent to {paymentData.email}
        </motion.p>
      </motion.div>
    </div>
  );
}
