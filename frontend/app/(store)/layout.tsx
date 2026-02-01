import { Providers } from "@/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartInitializer } from "@/components/cart/CartInitializer";
import { ToastContainer } from "@/components/ui/Toast";
import { ChatbotWidget } from "@/components/ai/ChatbotWidget";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <CartInitializer />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CartDrawer />
      <ChatbotWidget />
      <ToastContainer />
    </Providers>
  );
}
