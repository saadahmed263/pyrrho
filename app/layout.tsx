import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pyrrho Engine",
  description: "UX Context Extractor",
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