import "./globals.css";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import { CartProvider } from "./context/cartcontext";
import { WishlistProvider } from "./context/wishlistcontext";
import { OrdersProvider } from "./context/ordercontext";
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
              <Footer />
            </OrdersProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}