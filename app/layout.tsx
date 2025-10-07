import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Noto_Sans_Bengali } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "লগইন ইউজার",
  description: "Land Service Automation Login Portal",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
  },
}

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="preload" href="/_next/static/media/8ddf16529f784cc9-s.p.woff2" as="font" crossOrigin="" type="font/woff2" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${notoBengali.className}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
