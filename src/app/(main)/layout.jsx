import CartAnimationWrapper from "@/components/CartAnimationWrapper";
import { Footer } from "./_components/Footer";
import Header from "./_components/Header";
import { Toaster } from "sonner";
import { Noto_Serif_Bengali } from "next/font/google";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-serif-bengali",
});


export default function Layout({ children }) {
  return (
   <div className={`min-h-screen bg-white ${notoSerifBengali.variable}`}>
      <div className=" mx-auto">
        <Header />
        <Toaster position="top-center" richColors={true} />
        {children}
        <CartAnimationWrapper />
        <Footer />
      </div>
    </div>
  );
}
