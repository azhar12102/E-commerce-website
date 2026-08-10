import "./globals.css";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

import { CartProvider } from "./context/cartcontext";
import { WishlistProvider } from "./context/wishlistcontext";
import { OrdersProvider } from "./context/ordercontext";
import WhatsAppButton from "./whatsapp/whatsappbutton";
import ToastProvider from "./components/toastprovider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <OrdersProvider>
              <Navbar />
              {children}
              <WhatsAppButton />
              <Footer />
            </OrdersProvider>
          </WishlistProvider>
        </CartProvider>

        <ToastProvider />
      </body>
    </html>
  );
}