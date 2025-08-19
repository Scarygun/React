import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Voice Agent - 24/7 Ovozli Yordamchi",
  description: "O'zbekiston bozoridagi restoranlar, call-centerlar va xizmat ko'rsatuvchi tashkilotlar uchun AI asosida ishlaydigan ovozli yordamchi tizim",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
