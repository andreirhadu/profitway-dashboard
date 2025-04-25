import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CozyStay",
  description: "Dashboard CozyStay",
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
