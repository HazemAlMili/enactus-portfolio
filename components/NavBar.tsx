"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

const navItems = [
  { name: "HOME", href: "#" },
  { name: "STATS", href: "#about" },
  { name: "MAP", href: "#structure" },
  { name: "LEVELS", href: "#departments" },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-game-dark/80 backdrop-blur-md border-b-4 border-game-primary py-2" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-game-accent overflow-hidden shadow-[0_0_10px_#B13BFF]">
               <Image src="/Enactus-logo.png" alt="Enactus Logo" width={64} height={64} className="w-16 h-16 object-contain scale-125" />
            </div>
            <span className="font-pixel text-white text-lg tracking-widest hidden md:block">
              ENACTUS
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="font-pixel text-xs text-gray-300 hover:text-game-accent hover:-translate-y-1 transition-all"
              >
                {item.name}
              </a>
            ))}
            <a href="#game">
                <Button 
                    className="font-pixel text-[10px] bg-game-primary hover:bg-game-accent hover:text-game-dark text-white border-b-4 border-game-purple active:border-b-0 active:translate-y-1 transition-all"
                >
                    JOIN GAME
                </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                className="fixed inset-0 z-40 bg-game-dark/95 flex flex-col items-center justify-center gap-8 md:hidden"
            >
                {navItems.map((item) => (
                <a 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-pixel text-xl text-white hover:text-game-accent"
                >
                    {item.name}
                </a>
                ))}
                 <a href="#game" onClick={() => setMobileMenuOpen(false)}>
                     <Button 
                        className="font-pixel text-xs bg-game-primary text-white border-b-4 border-game-purple w-full"
                    >
                        JOIN GAME
                    </Button>
                 </a>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
