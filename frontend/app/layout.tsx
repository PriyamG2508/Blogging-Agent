import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "BloggerAI - Generate SEO-Ready Blog Posts in Minutes",
  description:
    "Our autonomous AI agent discovers trending topics, analyzes content gaps, writes compelling drafts, and optimizes for search engines.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
