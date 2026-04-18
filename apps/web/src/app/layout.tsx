import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuxeCommerce | Luxury Digital Flagship",
  description:
    "A luxury e-commerce experience for premium fashion, high-end electronics, and curated digital retail.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
