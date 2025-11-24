import type React from "react"
import type { Metadata } from "next"
import { Bangers, Press_Start_2P } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
})

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
})

export const metadata: Metadata = {
  title: "KumaForce Status",
  description: "Server status check for KumaForce",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${bangers.variable} ${pressStart.variable} font-sans antialiased overflow-x-hidden bg-background text-foreground`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
