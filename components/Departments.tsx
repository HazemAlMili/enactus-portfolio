"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Users, Star } from "lucide-react";
import DepartmentMiniGame from "./DepartmentMiniGame";

const departments = [
  { id: "it", name: "Information Technology", color: "bg-blue-600", desc: "Tech Wizards", heads: [{ name: "Hazem Al-Melli", image: null }], viceHeads: [], members: [] },
  { id: "hr", name: "Human Resource", color: "bg-red-500", desc: "People Power", heads: [{ name: "Mariam Abdelhafiz", image: null }], viceHeads: [], members: [] },
  { id: "pm", name: "Project Management", color: "bg-yellow-500", desc: "Project Masters", heads: [{ name: "Aiam Hatem", image: null }], viceHeads: [], members: [] },
  { id: "pr", name: "Public Relation", color: "bg-purple-500", desc: "Public Relations", heads: [{ name: "Mohap Saleh", image: null }], viceHeads: [], members: [] },
  { id: "fr", name: "Fundraising", color: "bg-green-500", desc: "Fundraising", heads: [{ name: "Rawan El-Sayed", image: null }], viceHeads: [{ name: "Khalid Selim" }], members: ["Wesam Hamdy", "Rawan Mahmoud", "Youssef Mohamed", "Mohamed Anas", "Rawan Essam", "Mohamed Ahmed", "Kareem Hamdy"] },
  { id: "logistics", name: "Logistics", color: "bg-orange-500", desc: "Operations", heads: [{ name: "Mariam Waleed", image: null }], viceHeads: [], members: [] },   
  { id: "er", name: "Organization", color: "bg-teal-500", desc: "Organization", heads: [{ name: "Rawan Mahmoud", image: null }], viceHeads: [], members: [] },
  { id: "mkt", name: "Marketing", color: "bg-pink-500", desc: "Marketing", heads: [{ name: "Malak Fahmy", image: null }], viceHeads: [], members: [] },
  { id: "mm", name: "Multi-media", color: "bg-indigo-500", desc: "Multi-media", heads: [{ name: "Malak Sherif", image: null }], viceHeads: [{ name: "Bavly Samy" }, { name: "Marwan Badran" }], members: ["Fares mohamed", "Ahmed Mohamed", "Hossam Eldien Mohamed", "Mohamed Ahmed", "Mohamed Maher", "Yahya Ayman", "Abdullah Hatem", "Gerges Michelle", "Omar Ahmed", "Malak Ali", "Rawan Fahd", "Nour Sherif", "Abdelrahman Sabry"] },
  { id: "pres", name: "Presentation", color: "bg-cyan-500", desc: "Presentation", heads: [{ name: "Mariam Shady", image: null }, { name: "Mariam Mahmoud", image: null }], viceHeads: [], members: ["Salsabeel Mohammed", "Kenzy Hesham", "Raneem Shawkat", "Aya Hany", "Jana Hamdy", "Lina Wael", "Maryam Salem", "Salma Mohammed", "Youssef Tarek"] },
];

// Helper to determine avatar characteristics based on name
const getAvatar = (name: string) => {
  const n = name.toLowerCase();
  let params = "";
  
  // Female names rule
  if (
    n.includes("rawan") || 
    n.includes("mariam") || 
    n.includes("malak") ||
    n.includes("nour") ||
    n.includes("jana") ||
    n.includes("salma") ||
    n.includes("wesam") || 
    n.includes("nada") ||
    n.includes("shahd") ||
    n.includes("menna") ||
    n.includes("habiba") ||
    n.includes("hana") ||
    n.includes("yasmin") ||
    n.includes("rokaya") ||
    n.includes("renad") ||
    n.includes("joudy") ||
    n.includes("basmala") ||
    n.includes("salsabeel") ||
    n.includes("kenzy") ||
    n.includes("raneem") ||
    n.includes("aya") ||
    n.includes("lina")
  ) {
     // Valid pixel-art values for females
     params = "&beardProbability=0&hatProbability=0&hair=long01,long02,long03,long04,long05"; 
  } 
  // Male names rule (Default)
  else {
     // Valid pixel-art values for males
     params = "&hatProbability=0&hair=short01,short02,short03,short04,short05";
  }

  // Use 7.x for stability
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}${params}`;
};

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
                        {/* Game replaces static description */}
                        <div className="mt-4">
                            <DepartmentMiniGame 
                                deptId={selectedDept?.id || 'it'} 
                                description={selectedDept?.desc || ''} 
                            />
                        </div>
                    </DialogHeader>
                    
                    <div className="py-6 overflow-y-auto max-h-[60vh]">
                        {/* Mock Team Data */}
                        <div className="space-y-6">
                            {/* Heads Section */}
                            <div className="bg-game-purple/20 p-4 rounded border border-game-primary">
                                <h4 className="font-pixel text-sm text-game-primary mb-4">
                                    HEAD{(selectedDept?.heads?.length || 0) > 1 ? 'S' : ''}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedDept?.heads?.map((head, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-white/10 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
                                                <img 
                                                     src={head.image || getAvatar(head.name)} 
                                                     alt={head.name} 
                                                     className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg leading-tight">{head.name}</p>
                                                <p className="text-xs text-game-accent">Level 99 Boss</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Vice Heads Section */}
                            {selectedDept?.viceHeads && selectedDept.viceHeads.length > 0 && (
                                <div className="bg-game-purple/10 p-4 rounded border border-white/10">
                                    <h4 className="font-pixel text-sm text-white mb-4">
                                        VICE HEAD{(selectedDept?.viceHeads?.length || 0) > 1 ? 'S' : ''}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedDept.viceHeads.map((vice, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/10 rounded-full overflow-hidden border border-white/30 shrink-0">
                                                    <img 
                                                         src={getAvatar(vice.name)} 
                                                         alt={vice.name}
                                                         className="w-full h-full object-cover"
                                                     />
                                                </div>
                                                <div>
                                                    <p className="font-bold">{vice.name}</p>
                                                    <p className="text-xs text-gray-400">Level 80 Admin</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Members Section */}
                            <div>
                                <h4 className="font-pixel text-sm text-gray-400 mb-3">MEMBERS (Players)</h4>
                                <div className="grid grid-cols-2 gap-4">
                                     {selectedDept?.members && selectedDept.members.length > 0 ? (
                                         selectedDept.members.map((member, i) => (
                                             <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-white/5">
                                                 <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20">
                                                     <img 
                                                         src={getAvatar(member)} 
                                                         alt={member}
                                                         className="w-full h-full object-cover"
                                                     />
                                                 </div>
                                                 <span className="text-sm">{member}</span>
                                             </div>
                                         ))
                                     ) : (
                                         <div className="col-span-2 text-center text-gray-500 italic py-4">No members loaded yet.</div>
                                     )}
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
