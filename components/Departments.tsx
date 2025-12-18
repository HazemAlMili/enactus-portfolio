"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Users, Star } from "lucide-react";
import DepartmentMiniGame from "./DepartmentMiniGame";
import { DEPARTMENTS } from "@/lib/departments-data";
import { getAvatar, preloadAvatars } from "@/lib/avatar-utils";

export default function Departments() {
  const [selectedDept, setSelectedDept] = useState<typeof DEPARTMENTS[number] | null>(null);

  // Preload all avatars on component mount for better UX
  useEffect(() => {
    const allNames: string[] = [];
    DEPARTMENTS.forEach(dept => {
      dept.heads.forEach(h => allNames.push(h.name));
      dept.viceHeads?.forEach((v: { name: string }) => allNames.push(v.name));
      
      // Handle standard members
      if ('members' in dept && dept.members) {
        allNames.push(...(dept.members as readonly string[]));
      }
      
      // Handle sections (like in HR)
      if ('sections' in dept && dept.sections) {
        dept.sections.forEach(section => {
          allNames.push(...(section.members as readonly string[]));
        });
      }
    });
    // Preload in next tick to not block initial render
    setTimeout(() => preloadAvatars(allNames), 100);
  }, []);

  return (
    <section className="py-24 bg-transparent relative z-10" id="departments">
        <div className="container mx-auto px-4">
             <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
            >
                <h2 className="text-3xl md:text-4xl font-pixel text-white mb-4">
                    SELECT A LEVEL
                </h2>
                <p className="font-body text-gray-400">Choose a department to view team members</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {DEPARTMENTS.map((dept, index) => (
                    <motion.div
                        key={dept.id}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ 
                            delay: index * 0.03,
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            mass: 0.8
                        }}
                        whileHover={{ 
                            y: -12, 
                            scale: 1.05,
                            transition: { 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 10 
                            }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDept(dept)}
                        className="cursor-pointer group"
                    >
                        <div className={`aspect-square relative ${dept.color} border-b-[8px] border-r-[8px] border-black/30 rounded-lg flex flex-col items-center justify-center p-4 transition-all duration-200 active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]`}>
                            {/* Question Mark Block Style */}
                            <div className="absolute inset-2 border-2 border-dashed border-white/30 rounded-lg transition-all duration-300 group-hover:border-white/60"></div>
                            <h3 className="font-pixel text-white drop-shadow-md z-10 w-full text-center px-0.5 text-[10px] md:text-xs tracking-tighter uppercase transition-all duration-200 group-hover:scale-110">
                                {dept.id === 'mkt' ? 'MARKETING' : dept.name}
                            </h3>
                            {/* Coins particles (hidden by default, could animate on click) */}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Department Modal */}
            <Dialog open={!!selectedDept} onOpenChange={(open) => !open && setSelectedDept(null)}>
                <DialogContent className="bg-game-dark border-2 sm:border-4 border-game-primary text-white max-w-[95vw] sm:max-w-2xl font-body p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b border-game-purple pb-2 sm:pb-4">
                        <DialogTitle className="font-pixel text-lg sm:text-2xl text-game-accent flex items-center gap-1.5 sm:gap-2">
                            <Star className="fill-game-accent w-4 h-4 sm:w-6 sm:h-6" />
                            <span className="truncate">{selectedDept?.name}</span>
                        </DialogTitle>
                        {/* Game replaces static description */}
                        <div className="mt-2 sm:mt-4">
                            <DepartmentMiniGame 
                                deptId={selectedDept?.id || 'it'} 
                                description={selectedDept?.desc || ''} 
                            />
                        </div>
                    </DialogHeader>
                    
                    <div className="py-3 sm:py-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
                        {/* Mock Team Data */}
                        <div className="space-y-3 sm:space-y-6">
                            {/* Heads Section */}
                            <div className="bg-game-purple/20 p-2 sm:p-4 rounded border border-game-primary">
                                <h4 className="font-pixel text-xs sm:text-sm text-game-primary mb-2 sm:mb-4">
                                    HEAD{(selectedDept?.heads?.length || 0) > 1 ? 'S' : ''}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                                    {selectedDept?.heads?.map((head, index) => (
                                        <div key={index} className="flex items-center gap-2 sm:gap-4">
                                            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white/10 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-lg shrink-0">
                                                <img 
                                                     src={head.image || getAvatar(head.name)} 
                                                     alt={head.name} 
                                                     className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm sm:text-lg leading-tight">{head.name}</p>
                                                <p className="text-[10px] sm:text-xs text-game-accent">Level 99 Boss</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Vice Heads Section */}
                            {selectedDept?.viceHeads && selectedDept.viceHeads.length > 0 && (
                                <div className="bg-game-purple/10 p-2 sm:p-4 rounded border border-white/10">
                                    <h4 className="font-pixel text-xs sm:text-sm text-white mb-2 sm:mb-4">
                                        VICE HEAD{(selectedDept?.viceHeads?.length || 0) > 1 ? 'S' : ''}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                        {selectedDept.viceHeads.map((vice, index) => (
                                            <div key={index} className="flex items-center gap-2 sm:gap-4">
                                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 rounded-full overflow-hidden border border-white/30 shrink-0">
                                                    <img 
                                                         src={getAvatar(vice.name)} 
                                                         alt={vice.name}
                                                         className="w-full h-full object-cover"
                                                     />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-xs sm:text-base truncate max-w-[80px] sm:max-w-none">{vice.name}</p>
                                                    <p className="text-[9px] sm:text-xs text-gray-400">Level 80</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {/* Members Section */}
                             <div className="mt-4">
                                 {selectedDept && 'sections' in selectedDept ? (
                                     <div className="space-y-6">
                                         {selectedDept.sections.map((section: any, idx: number) => (
                                             <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                                 <h4 className="font-pixel text-[10px] sm:text-xs text-game-accent mb-3 uppercase tracking-widest flex items-center gap-2">
                                                     <Users className="w-3 h-3" />
                                                     {section.title}
                                                 </h4>
                                                 <div className="grid grid-cols-2 gap-1.5 sm:gap-4">
                                                     {section.members.map((member: string, i: number) => (
                                                         <div key={i} className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-2 rounded hover:bg-white/10 transition-colors">
                                                             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
                                                                 <img 
                                                                     src={getAvatar(member)} 
                                                                     alt={member}
                                                                     className="w-full h-full object-cover"
                                                                 />
                                                             </div>
                                                             <span className="text-[10px] sm:text-sm truncate">{member}</span>
                                                         </div>
                                                     ))}
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 ) : (
                                     <>
                                         <h4 className="font-pixel text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">MEMBERS</h4>
                                         <div className="grid grid-cols-2 gap-1.5 sm:gap-4 max-h-[150px] sm:max-h-none overflow-y-auto">
                                              {selectedDept && 'members' in selectedDept && selectedDept.members && selectedDept.members.length > 0 ? (
                                                  (selectedDept.members as readonly string[]).map((member, i) => (
                                                      <div key={i} className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-2 rounded hover:bg-white/5">
                                                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
                                                              <img 
                                                                  src={getAvatar(member)} 
                                                                  alt={member}
                                                                  className="w-full h-full object-cover"
                                                              />
                                                          </div>
                                                          <span className="text-[10px] sm:text-sm truncate">{member}</span>
                                                      </div>
                                                  ))
                                              ) : (
                                                  <div className="col-span-2 text-center text-gray-500 italic py-2 sm:py-4 text-xs sm:text-sm">No members loaded yet.</div>
                                              )}
                                         </div>
                                     </>
                                 )}
                             </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </section>
  );
}
