import {
  Geist,
  Geist_Mono,
  Bricolage_Grotesque,
  Manrope,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexus - AI-Powered Private Doubt Resolution System",
  description:
    "Ensuring seamless student support while safeguarding teacher privacy.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${manrope.variable} antialiased font-sans`}
        suppressHydrationWarning
        suppressContentEditableWarning
      >
        {children}
        <Toaster />
        <img
          id="background"
          src="/background.svg"
          alt=""
          className=" opacity-50 dark:opacity-90 "
        />{" "}
        <Toaster />
      </body>
    </html>
  );
}
