"use client"

import { useState, useEffect } from "react"
import { StatusIndicator } from "./status-indicator"
import { Button } from "@/components/ui/button"
import { Sticker } from "./sticker"
import type { ServerStatusResponse } from "@/app/api/server/status/route"

export function ServerCard() {
  const [status, setStatus] = useState<"online" | "offline" | "starting">("offline")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [displayAddress, setDisplayAddress] = useState<string>("")
  const [playerCount, setPlayerCount] = useState<number>(0)

  // Fetch server status
  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/server/status")
      const data: ServerStatusResponse = await response.json()

      setStatus(data.overallStatus)
      setDisplayAddress(data.displayAddress || "")
      setPlayerCount(data.minecraft.playerCount)
      setError(null)
    } catch (err) {
      console.error("Error fetching status:", err)
      setError("Failed to connect to server")
    }
  }

  // Poll for status updates every 10 seconds
  useEffect(() => {
    // Fetch immediately on mount
    fetchStatus()

    // Set up polling interval
    const interval = setInterval(fetchStatus, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleStartup = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/container/start", {
        method: "POST",
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to start server")
      }

      setStatus("starting")

      // Poll more frequently while starting
      const startupPoll = setInterval(async () => {
        await fetchStatus()
      }, 3000)

      // Stop frequent polling after 2 minutes
      setTimeout(() => {
        clearInterval(startupPoll)
        setLoading(false)
      }, 120000)
    } catch (err) {
      console.error("Error starting server:", err)
      setError(err instanceof Error ? err.message : "Failed to start server")
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center p-4">
      {/* Floating Stickers */}
      <Sticker className="-top-12 -left-4 md:left-12 rotate-12 text-6xl">🗿</Sticker>
      <Sticker className="top-20 -right-8 md:right-0 -rotate-12 text-6xl" delay={0.2}>
        🔥
      </Sticker>
      <Sticker className="bottom-0 left-0 md:-left-12 rotate-6 text-6xl" delay={0.4}>
        💀
      </Sticker>
      <Sticker className="-bottom-8 right-12 -rotate-6 text-6xl" delay={0.6}>
        🧢
      </Sticker>

      {/* Main Content Box */}
      <div className="w-full bg-card border-4 border-primary p-2 md:p-8 relative z-20 shadow-[8px_8px_0px_0px_var(--primary)]">
        {/* Header */}
        <div className="mb-12 text-center relative">
          <h1 className="text-6xl md:text-9xl font-black text-primary drop-shadow-[4px_4px_0px_rgba(255,255,255,1)] animate-wiggle">
            KUMAFORCE
          </h1>
          <div className="absolute -top-6 right-1/4 bg-secondary text-white px-4 py-1 rotate-6 font-mono text-sm md:text-xl border-2 border-white">
            EST. 2024
          </div>
        </div>

        {/* Status Display */}
        <div className="mb-12">
          <StatusIndicator status={status} />
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center gap-6">
          {status === "offline" && (
            <Button
              onClick={handleStartup}
              disabled={loading}
              className="relative text-3xl md:text-5xl py-8 px-12 bg-primary text-black hover:bg-white hover:text-black border-4 border-black font-black uppercase transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              <span className="relative z-10 group-hover:animate-shake">
                {loading ? "WAKING UP..." : "🚀 WAKE UP SERVER"}
              </span>

              {/* Glitch effect overlay */}
              <div className="absolute inset-0 bg-red-500 mix-blend-multiply opacity-0 group-hover:opacity-20 animate-glitch" />
            </Button>
          )}

          {status === "online" && (
            <div className="bg-secondary text-white p-6 border-4 border-black -rotate-1 animate-bounce">
              <p className="text-2xl font-bold font-mono">IP: {displayAddress || "LOADING..."}</p>
              <p className="text-sm">(copy it rn fr)</p>
              {playerCount > 0 && (
                <p className="text-xs mt-2">👥 {playerCount} player{playerCount !== 1 ? "s" : ""} online</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500 text-white p-4 border-4 border-black">
              <p className="text-lg font-bold">ERROR 💀</p>
              <p className="text-sm font-mono">{error}</p>
            </div>
          )}

          <p className="text-muted-foreground font-mono text-xs md:text-sm text-center max-w-md mt-8">
            {status === "offline"
              ? "server sleeps -> you sad -> click button -> server wakes -> we happy"
              : status === "starting"
              ? "server cooking... this might take like 30-60 seconds ngl"
              : "server is awake. go play. stop reading this."}
          </p>
        </div>
      </div>
    </div>
  )
}
