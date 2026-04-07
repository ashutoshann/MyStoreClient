import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "./components/layout/ProductContext.jsx"; // पाथ तपासा

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jain E-Store | Standard Quality Gear",
  description: "आशुतोष जैन साम्राज्याचे अधिकृत दालन",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* १. पूर्ण ॲपला कॉन्टेक्स्ट प्रोव्हायडरमध्ये गुंडाळणे */}
        <ProductProvider>
            {children}
        </ProductProvider>
      </body>
    </html>
  );
}