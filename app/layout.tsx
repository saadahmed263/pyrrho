import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pyrrho",
  description: "Behavioral Psych Engine",
  icons: {
    icon: '/pyrrho-logo.svg?v=999', // This forces the browser to download a fresh file
    apple: '/pyrrho-logo.svg?v=999',
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