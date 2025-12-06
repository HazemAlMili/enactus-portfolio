"use client";

import { Facebook, Instagram, Linkedin, Twitter, Gamepad2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[#000000] to-game-dark border-t-4 border-game-primary pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
             <div className="flex items-center gap-2 mb-4">
                <Gamepad2 className="w-8 h-8 text-game-accent" />
                <h3 className="font-pixel text-xl text-white">ENACTUS CIC</h3>
             </div>
             <p className="font-body text-gray-400 text-sm max-w-xs">
                "We Are Change The World"
             </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h4 className="font-pixel text-game-primary mb-2">QUICK SAVE</h4>
            <a href="#" className="font-body text-gray-300 hover:text-game-accent hover:translate-x-1 transition-transform">Home</a>
            <a href="#about" className="font-body text-gray-300 hover:text-game-accent hover:translate-x-1 transition-transform">Stats</a>
            <a href="#departments" className="font-body text-gray-300 hover:text-game-accent hover:translate-x-1 transition-transform">Levels</a>
          </div>

          {/* Socials */}
          <div className="flex flex-col items-center md:items-start">
             <h4 className="font-pixel text-game-primary mb-4">MULTIPLAYER</h4>
             <div className="flex gap-4">
                {[
                    { Icon: Facebook, href: "https://www.facebook.com/cic.enactus.zayed" },
                    { Icon: Instagram, href: "https://www.instagram.com/cic.enactus/" },
                    { Icon: Linkedin, href: "https://www.linkedin.com/company/cic-enactus/posts/?feedView=all" }
                ].map(({ Icon, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="p-2 bg-game-purple rounded hover:bg-game-accent hover:text-black transition-colors text-white">
                        <Icon className="w-5 h-5" />
                    </a>
                ))}
             </div>
          </div>
        </div>

        <div className="text-center border-t border-game-purple/30 pt-8">
            <p className="font-pixel text-[10px] text-gray-500">
                © 2024 ENACTUS CIC. GAME OVER. INSERT COIN.
            </p>
        </div>
      </div>
    </footer>
  );
}
