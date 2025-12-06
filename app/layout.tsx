import type { Metadata } from "next";
import { Press_Start_2P, Outfit } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enactus CIC - Level Up",
  description: "Enactus CIC El Sheikh Zayed Portfolio - Game On!",
  icons: {
    icon: "/favicon-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${outfit.variable} antialiased bg-[#090040] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
