import "../globals.css";
import { Suspense } from 'react';
import { ProductProvider } from "@/app/components/layout/ProductContext";
import Header from "@/app/components/layout/Header";
import { Geist, Geist_Mono } from "next/font/google";

// १. Standard Fonts लोड करणे
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// २. SEO साठी Metadata (तुझ्या साम्राज्याचं नाव!)
export const metadata = {
  title: "Jain E-Store | Premium Quality",
  description: "आशुतोष जैन साम्राज्याचे अधिकृत आणि सुरक्षित दालन",
};

export default function RootLayout({ children }) {
    return (
        // ३. suppressHydrationWarning इथे लावल्यामुळे एक्स्टेंशनचे एरर थांबतात
        <html lang="en" suppressHydrationWarning>
            <body 
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <ProductProvider>
                    {/* ४. Header ला Suspense मध्ये ठेवणे नेहमी चांगले असते */}
                    <Suspense fallback={<div className="h-20 bg-gray-50 animate-pulse border-b" />}>
                        <Header />
                    </Suspense>

                    {/* ५. मुख्य मजकूर */}
                    <main className="min-h-screen">
                        {children}
                    </main>

                    {/* इथे तू भविष्यात Footer जोडू शकतोस */}
                </ProductProvider>
            </body>
        </html>
    );
}