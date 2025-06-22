import type { AppProps } from "next/app";
import "../styles/globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
}
