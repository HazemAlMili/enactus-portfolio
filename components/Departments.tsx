"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Users, Star } from "lucide-react";

const departments = [
  { id: "it", name: "Information Technology", color: "bg-blue-600", desc: "Tech Wizards" },
  { id: "hr", name: "Human Resource", color: "bg-red-500", desc: "People Power" },
  { id: "pm", name: "Project Management", color: "bg-yellow-500", desc: "Project Masters" },
  { id: "pr", name: "Public Relation", color: "bg-purple-500", desc: "Public Relations" },
  { id: "fr", name: "Fundraising", color: "bg-green-500", desc: "Fundraising" },
  { id: "logistics", name: "Logistics", color: "bg-orange-500", desc: "Operations" },
  { id: "er", name: "Organization", color: "bg-teal-500", desc: "Organization" },
  { id: "mkt", name: "Marketing", color: "bg-pink-500", desc: "Marketing" },
  { id: "mm", name: "Multi-media", color: "bg-indigo-500", desc: "Multi-media" },
  { id: "pres", name: "Presentation", color: "bg-cyan-500", desc: "Presentation" },
];

export default function Departments() {
  const [selectedDept, setSelectedDept] = useState<typeof departments[0] | null>(null);

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
                {departments.map((dept, index) => (
                    <motion.div
                        key={dept.id}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: index * 0.05, type: "spring" }}
                        whileHover={{ y: -10 }}
                        onClick={() => setSelectedDept(dept)}
                        className="cursor-pointer group"
                    >
                        <div className={`aspect-square relative ${dept.color} border-b-[8px] border-r-[8px] border-black/30 rounded-lg flex flex-col items-center justify-center p-4 transition-transform active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2`}>
                            {/* Question Mark Block Style */}
                            <div className="absolute inset-2 border-2 border-dashed border-white/30 rounded-lg"></div>
                            <h3 className="font-pixel text-white drop-shadow-md z-10 w-full text-center px-0.5 text-[10px] md:text-xs tracking-tighter uppercase">
                                {dept.id === 'mkt' ? 'MARKETING' : dept.name}
                            </h3>
                            {/* Coins particles (hidden by default, could animate on click) */}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Department Modal */}
            <Dialog open={!!selectedDept} onOpenChange={(open) => !open && setSelectedDept(null)}>
                <DialogContent className="bg-game-dark border-4 border-game-primary text-white max-w-2xl font-body">
                    <DialogHeader className="border-b border-game-purple pb-4">
                        <DialogTitle className="font-pixel text-2xl text-game-accent flex items-center gap-2">
                            <Star className="fill-game-accent" />
                            {selectedDept?.name} DEPARTMENT
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                           {selectedDept?.desc}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6 overflow-y-auto max-h-[60vh]">
                        {/* Mock Team Data */}
                        <div className="space-y-6">
                            <div className="bg-game-purple/20 p-4 rounded border border-game-primary">
                                <h4 className="font-pixel text-sm text-game-primary mb-2">HEAD</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                                    <div>
                                        <p className="font-bold">Team Leader Name</p>
                                        <p className="text-xs text-gray-400">Level 99 Boss</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-game-purple/10 p-4 rounded border border-white/10">
                                <h4 className="font-pixel text-sm text-white mb-2">VICE HEAD</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                                    <div>
                                        <p className="font-bold">Vice Leader Name</p>
                                        <p className="text-xs text-gray-400">Level 80 Admin</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-pixel text-sm text-gray-400 mb-3">MEMBERS (Players)</h4>
                                <div className="grid grid-cols-2 gap-4">
                                     {[1,2,3,4].map(i => (
                                         <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-white/5">
                                             <div className="w-8 h-8 bg-game-accent/20 rounded-full"></div>
                                             <span className="text-sm">Player {i}</span>
                                         </div>
                                     ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </section>
  );
}
