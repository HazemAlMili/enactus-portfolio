"use client";

import { motion } from "framer-motion";

const StructureNode = ({ role, name, level }: { role: string; name?: string; level: number }) => (
    <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        className={`relative flex flex-col items-center justify-center p-4 border-4 border-game-accent bg-game-purple text-center w-full max-w-[200px] shadow-[4px_4px_0_0_#000] z-10`}
    >
        <div className="font-pixel text-[10px] text-game-accent uppercase mb-1">{role}</div>
        <div className="font-body font-bold text-white text-sm">{name || "LOCKED"}</div>
        {/* Pixel corners */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-game-dark" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-game-dark" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-game-dark" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-game-dark" />
    </motion.div>
);

const Connection = ({ vertical = false, height = 40, width = 4 }) => (
    <div 
        className={`bg-game-primary opacity-50 ${vertical ? `w-[${width}px]` : `h-[${width}px] w-full`}`} 
        style={{ [vertical ? 'height' : 'width']: vertical ? height : '100%' }}
    />
);

export default function Structure() {
  return (
    <section className="py-24 bg-transparent relative bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] z-10" id="structure">
        <div className="container mx-auto px-4">
            <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
            >
                <h2 className="text-3xl md:text-4xl font-pixel text-white">
                    <span className="text-game-primary">#</span> WORLD MAP
                </h2>
            </motion.div>

            <div className="flex flex-col items-center space-y-8 relative w-full">
                {/* Level 1: President */}
                <div className="relative z-20">
                    <StructureNode role="President" name="Aiam Hatem" level={1} />
                </div>
                
                {/* Connector 1-2*/}
                <div className="h-8 w-1 bg-game-primary"></div>

                {/* Level 2: Vices - Horizontal Layout */}
                <div className="relative w-full max-w-2xl">
                    <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-game-primary -translate-y-[24px]"></div> {/* Horizontal bar for VPs */}
                    <div className="absolute top-0 left-1/4 h-6 w-1 bg-game-primary -translate-y-[24px]"></div>
                    <div className="absolute top-0 right-1/4 h-6 w-1 bg-game-primary -translate-y-[24px]"></div>
                    
                    <div className="grid grid-cols-2 gap-8 md:gap-32 justify-items-center relative z-20">
                        <StructureNode role="Vice President" name="Jana Moustafa" level={2} />
                        <StructureNode role="Vice President" name="Saif Ahmed" level={2} />
                    </div>
                </div>

                {/* Connector 2-3 */}
                <div className="h-8 w-1 bg-game-primary"></div>

                {/* Level 3: Directors */}
                 <div className="relative w-full max-w-2xl">
                    <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-game-primary -translate-y-[24px]"></div> {/* Horizontal bar for Directors */}
                    <div className="absolute top-0 left-1/4 h-6 w-1 bg-game-primary -translate-y-[24px]"></div>
                    <div className="absolute top-0 right-1/4 h-6 w-1 bg-game-primary -translate-y-[24px]"></div>
                    
                    <div className="grid grid-cols-2 gap-8 md:gap-32 justify-items-center relative z-20">
                        <StructureNode role="Creative Director" name="Habiba El-Sayed" level={2.5} />
                        <StructureNode role="Operations Director" name="Maram Ashraf" level={2.5} />
                    </div>
                </div>

                {/* Connector 3-4 */}
                <div className="h-8 w-1 bg-game-primary"></div>

                {/* Level 4: Heads - Grid Layout */}
                <div className="relative w-full max-w-6xl">
                     <div className="absolute top-0 left-[5%] right-[5%] h-1 bg-game-primary -translate-y-[24px]"></div> {/* Horizontal bar for Heads */}
                     
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-x-4 md:gap-y-8 pt-4 justify-items-center relative z-20">
                        {/* 10 Heads */}
                        <StructureNode role="Head IT" name="Hazem Al-Melli" level={3} />
                        <StructureNode role="Head HR" name="Mariam Abdelhafiz" level={3} />
                        <StructureNode role="Head PM" name="Aiam Hatem" level={3} />
                        <StructureNode role="Head PR" name="Mohap Saleh" level={3} />
                        <StructureNode role="Head FR" name="Rawan El-Sayed" level={3} />
                        <StructureNode role="Head LOG" name="Mariam Waleed" level={3} />
                        <StructureNode role="Head ORG" name="Rawan Mahmoud" level={3} />
                        <StructureNode role="Head MKT" name="Malak Fahmy" level={3} />
                        <StructureNode role="Head MM" name="Malak Sherif" level={3} />
                        <StructureNode role="Head PRES" name="Mariam Shady, Mariam Mahmoud" level={3} />
                     </div>
                </div>
            </div>
        </div>
    </section>
  );
}
