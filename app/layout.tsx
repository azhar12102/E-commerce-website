import type { Metadata } from "next";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import { CartProvider } from "./context/cartcontext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <CartProvider>
        {children}
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}