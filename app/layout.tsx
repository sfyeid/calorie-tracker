import type React from "react"
import "./globals.css"
import { MuiThemeProvider } from "../components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>
        <MuiThemeProvider>{children}</MuiThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
