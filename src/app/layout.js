import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "Nexus - AI-Powered Private Doubt Resolution System",
  description:
    "Ensuring seamless student support while safeguarding teacher privacy.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${bricolageGrotesque.variable} antialiased`}
        suppressHydrationWarning
        suppressContentEditableWarning
      >
        {children}
        <img
          id="background"
          src="/background.svg"
          alt=""
          fetchpriority="high"
          className=" opacity-50 invert"
        />
      </body>
    </html>
  );
}
