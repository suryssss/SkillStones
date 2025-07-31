import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import CallToActionBanner from "./components/CallToActionBanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans transition-all duration-300 ease-in-out">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CallToActionBanner />
      </main>
      <Footer />
    </div>
  );
}
