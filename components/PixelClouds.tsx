"use client";

import { motion } from "framer-motion";

import Image from "next/image";

export default function PixelClouds() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-full w-full">
      {/* Cloud 1 - Top Left */}
      <motion.div 
         initial={{ x: "-10%" }}
         animate={{ x: "110%" }}
         transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
         className="absolute top-[10%] left-0 opacity-80"
      >
        <Image src="/cloude.svg" alt="Cloud" width={128} height={48} className="w-32 h-auto" />
      </motion.div>
      
      {/* Cloud 2 - Top Right, Slower */}
      <motion.div 
         initial={{ x: "110%" }}
         animate={{ x: "-10%" }}
         transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
         className="absolute top-[25%] right-0 opacity-60"
      >
          <Image src="/cloude.svg" alt="Cloud" width={192} height={64} className="w-48 h-auto" />
      </motion.div>

      {/* Cloud 3 - Mid/Bottom Left */}
      <motion.div 
         initial={{ x: "-20%" }}
         animate={{ x: "120%" }}
         transition={{ repeat: Infinity, duration: 50, ease: "linear", delay: 5 }}
         className="absolute top-[60%] left-0 opacity-70"
      >
         <Image src="/cloude.svg" alt="Cloud" width={96} height={32} className="w-24 h-auto" />
      </motion.div>

       {/* Cloud 4 - Bottom Right */}
       <motion.div 
         initial={{ x: "110%" }}
         animate={{ x: "-10%" }}
         transition={{ repeat: Infinity, duration: 35, ease: "linear", delay: 2 }}
         className="absolute top-[85%] right-0 opacity-50"
      >
         <Image src="/cloude.svg" alt="Cloud" width={160} height={56} className="w-40 h-auto" />
      </motion.div>

      {/* Cloud 5 - Middle center ish */}
      <motion.div 
         initial={{ x: "-15%" }}
         animate={{ x: "115%" }}
         transition={{ repeat: Infinity, duration: 60, ease: "linear", delay: 10 }}
         className="absolute top-[45%] left-0 opacity-40"
      >
         <Image src="/cloude.svg" alt="Cloud" width={128} height={48} className="w-32 h-auto" />
      </motion.div>
    </div>
  );
}
