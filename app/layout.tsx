import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pyrrho | Skeptic Engine",
  description: "Behavioral Psych Interview Architect",
  icons: {
    icon: [], // This forces Next.js to stop looking for that default triangle icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}