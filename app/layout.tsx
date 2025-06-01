import type React from "react"
import ClientLayout from "./ClientLayout"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
