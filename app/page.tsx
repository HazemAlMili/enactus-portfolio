import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import Structure from "@/components/Structure";
import Departments from "@/components/Departments";
import Footer from "@/components/Footer";
import PixelClouds from "@/components/PixelClouds";
import NavBar from "@/components/NavBar";
import MiniGame from "@/components/MiniGame";

export default function Home() {
  return (
    <main className="min-h-screen bg-game-dark relative">
      <NavBar />
      <PixelClouds />
      <Hero />
      <AboutUs />
      <Structure />
      <Departments />
      <MiniGame />
      <Footer />
    </main>
  );
}
