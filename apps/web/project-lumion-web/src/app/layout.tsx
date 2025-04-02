import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "@/components/SideBar"


export const metadata: Metadata = {
  title: "Dashboard de Energia",
  description: "Dashboard para visualização de consumo de energia e faturas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}

