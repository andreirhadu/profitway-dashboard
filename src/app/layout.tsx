import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ProfitWay Academy",
  description: "Dashboard Profitway",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
