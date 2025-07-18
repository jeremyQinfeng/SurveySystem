"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  title: string
  subtitle?: string
  onNext: () => void
}

export function WelcomeScreen({ title, subtitle, onNext }: WelcomeScreenProps) {
  return (
    <motion.div
      className="text-center text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
      {subtitle && <p className="text-xl md:text-2xl mb-12 text-white/80">{subtitle}</p>}
      <Button
        size="lg"
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full"
        onClick={onNext}
      >
        Get Started
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
      <p className="text-white/60 mt-4">Press Enter ↵</p>
    </motion.div>
  )
}
