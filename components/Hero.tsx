"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent z-10">
      {/* Pixel Art Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20"
           style={{
               backgroundImage: "radial-gradient(#471396 2px, transparent 2px)",
               backgroundSize: "32px 32px"
           }}
      />
      
      {/* Content */}
      <div className="z-10 container mx-auto px-4 text-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="mb-8">
                {/* Logo removed and moved to Navbar */}
            </div>

            <h1 className="text-4xl md:text-6xl font-pixel text-game-primary mb-6 leading-relaxed uppercase tracking-widest drop-shadow-[4px_4px_0_rgba(177,59,255,0.4)]">
                Enactus CIC
                <br />
                <span className="text-game-accent text-3xl md:text-5xl mt-2 block">Level Up</span>
            </h1>
            
            <p className="text-lg md:text-xl font-body text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Who We Are: A community of leaders committed to using the power of entrepreneurial action to transform lives.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
                <a href="#departments">
                    <Button className="bg-game-primary hover:bg-game-primary/80 text-white font-pixel text-xs px-8 py-6 rounded-none border-b-4 border-game-purple active:border-b-0 active:translate-y-1 transition-all">
                        START GAME
                    </Button>
                </a>
                <a href="#structure">
                    <Button variant="outline" className="text-game-accent border-4 border-game-accent bg-transparent hover:bg-game-accent/10 font-pixel text-xs px-8 py-6 rounded-none border-b-4 active:border-b-0 active:translate-y-1 transition-all">
                        VIEW MAP
                    </Button>
                </a>
            </div>

            {/* Socials */}
            <div className="flex justify-center gap-6">
                {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.2, rotate: 12 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-game-purple/50 rounded-none border-2 border-game-primary hover:bg-game-primary hover:text-white cursor-pointer transition-colors"
                    >
                        <Icon className="w-5 h-5 text-game-accent" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </div>

      {/* Floating Elements (Game inspired) */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-game-purple/20 to-transparent pointer-events-none" />
    </section>
  );
}
