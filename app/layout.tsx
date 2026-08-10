import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import DevConsoleFilter from "@/components/DevConsoleFilter";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/preloader/Preloader";
import Navbar from "@/components/navigation/Navbar";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.name + " — " + SITE.tagline,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.name + " — " + SITE.tagline,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} antialiased`}
    >
      <body className="bg-ink text-ivory font-body">
        <DevConsoleFilter />
        <SmoothScroll>
          <Preloader />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
