import cn from "classnames";
import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Limbus",
  description: "Web Synth",
};

const libreFranklin = Libre_Franklin({
  weight: "variable",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(libreFranklin.className)}>{children}</body>
    </html>
  );
}
