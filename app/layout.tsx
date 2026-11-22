import type { Metadata } from "next";
import { Poppins, Baloo_Thambi_2 } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "600", "800"], variable: "--font-body" });
const baloo = Baloo_Thambi_2({ subsets: ["tamil", "latin"], weight: ["500", "700", "800"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Raja's Collections — இசைஞானி இளையராஜா",
  description: "A fan's complete collection of Isaignani Ilaiyaraaja's Tamil film music — by year, mood, singer and film.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${baloo.variable}`}>{children}</body>
    </html>
  );
}
