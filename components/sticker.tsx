"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StickerProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function Sticker({ children, className, delay = 0 }: StickerProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 0 }}
      animate={{ scale: 1, rotate: Math.random() * 20 - 10 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
      whileHover={{ scale: 1.2, rotate: Math.random() * 20 - 10 }}
      className={cn("absolute pointer-events-auto cursor-help select-none z-10", className)}
    >
      {children}
    </motion.div>
  )
}
