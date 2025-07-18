"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface ThankYouScreenProps {
  title: string
  subtitle?: string
}

export function ThankYouScreen({ title, subtitle }: ThankYouScreenProps) {
  return (
    <motion.div
      className="text-center text-white"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>

      <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
      {subtitle && <p className="text-xl md:text-2xl text-white/80">{subtitle}</p>}
    </motion.div>
  )
}
