"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { 
  Code, Users, Target, Megaphone, Coins, Truck, 
  Calendar, Lightbulb, Video, Mic, Trophy, Play, RefreshCw,
  Lock, Zap, Brain, Bug, ShieldCheck, Heart, Smartphone, Layout, Image as ImageIcon,
  MessageCircle, HelpCircle
} from "lucide-react";

// --- CONFIGURATION ---

type GameType = 'cipher' | 'memory' | 'whack' | 'catcher' | 'rhythm' | 'tech_challenge' | 'human_match' | 'pm_shuffle' | 'pr_spin' | 'fr_pitch' | 'logistics_shuffle';

interface GameConfig {
    type: GameType;
    hex: string;
    title: string;
    desc: string;
    icon: any;
    quote: string;
}

const DEPT_CONFIG: Record<string, GameConfig> = {
  it: { type: 'tech_challenge', hex: '#60a5fa', title: 'TECH CHALLENGE', desc: 'Riddle & Quick Build', icon: Code, quote: '"Computers are fast, accurate, and stupid. Humans are slow, inaccurate, and brilliant. Together they are powerful."' },
  hr: { type: 'human_match', hex: '#f87171', title: 'HUMAN MATCH', desc: 'Ask questions to find your role', icon: Users, quote: '"Train people well enough so they can leave, treat them well enough so they don\'t want to."' },
  pm: { type: 'pm_shuffle', hex: '#facc15', title: 'TASK SHUFFLE', desc: 'Sequence the project phases', icon: Target, quote: '"Project management is the art of creating order from chaos."' },
  pr: { type: 'pr_spin', hex: '#c084fc', title: 'SPIN THE STORY', desc: 'Craft the perfect headline', icon: Megaphone, quote: '"Everything you do or say is public relations."' },
  fr: { type: 'fr_pitch', hex: '#4ade80', title: 'PITCH IT FAST', desc: 'Build the ultimate funding pitch', icon: Coins, quote: '"No one has ever become poor by giving."' },
  logistics: { type: 'logistics_shuffle', hex: '#fb923c', title: 'SUPPLY CHAIN SHUFFLE', desc: 'Optimize the delivery route', icon: Truck, quote: '"Amateurs talk strategy. Professionals talk logistics."' },
  er: { type: 'cipher', hex: '#2dd4bf', title: 'PARTNER LINK', desc: 'Align the external nodes', icon: Calendar, quote: '"Coming together is a beginning, working together is success."' },
  mkt: { type: 'whack', hex: '#f472b6', title: 'TREND SPOTTER', desc: 'Capture emerging trends', icon: Lightbulb, quote: '"Marketing is no longer about the stuff that you make, but about the stories you tell."' },
  mm: { type: 'rhythm', hex: '#818cf8', title: 'FRAME SYNC', desc: 'Align the render buffer', icon: Video, quote: '"Design is not just what it looks like and feels like. Design is how it works."' },
  pres: { type: 'rhythm', hex: '#22d3ee', title: 'VOICE FLOW', desc: 'Match the speech frequency', icon: Mic, quote: '"The art of communication is the language of leadership."' },
};

// --- SHARED COMPONENTS ---

const Typewriter = ({ text }: { text: string }) => {
    const [display, setDisplay] = useState("");
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) { setDisplay(prev => prev + text.charAt(i)); i++; }
            else clearInterval(timer);
        }, 20);
        return () => clearInterval(timer);
    }, [text]);
    return <span>{display}</span>;
}

// --- GAME ENGINE 1: CIPHER (Ring Lock) ---
const CipherGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [locks, setLocks] = useState([false, false, false]);
    
    useEffect(() => {
        if (locks.every(Boolean)) setTimeout(onWin, 500);
    }, [locks, onWin]);

    const handleAlign = (index: number) => {
        const newLocks = [...locks];
        newLocks[index] = true;
        setLocks(newLocks);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center scale-75 md:scale-100 transition-transform">
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
             
             {[150, 110, 70].map((r, i) => (
                 <CipherRing key={i} radius={r} index={i} isLocked={locks[i]} hex={config.hex} onAlign={() => handleAlign(i)} />
             ))}
             
             <div className="z-10 bg-gray-900 border border-white/20 p-4 rounded-full shadow-2xl">
                 <config.icon style={{ color: config.hex }} className="w-8 h-8" />
             </div>
             
             <div className="absolute top-0 w-1 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none mix-blend-overlay" />
        </div>
    );
};

const CipherRing = ({ radius, index, onAlign, isLocked, hex }: any) => {
    const rotation = useMotionValue(Math.floor(Math.random() * 360));
    
    return (
        <motion.div
            style={{ width: radius * 2, height: radius * 2, rotate: rotation, borderColor: isLocked ? '#fff' : 'rgba(255,255,255,0.1)' }}
            className={`absolute rounded-full border-2 border-dashed flex items-center justify-center cursor-touch transition-colors duration-500`}
        >
             <motion.div className="absolute inset-0 rounded-full" 
                 drag={!isLocked} dragConstraints={{left:0,right:0,top:0,bottom:0}} dragElastic={0} dragMomentum={false}
                 onDrag={(_, info) => rotation.set(rotation.get() + info.delta.x * 0.5)}
                 onDragEnd={() => {
                     const r = rotation.get() % 360;
                     const norm = (r < 0 ? 360 + r : r);
                     if (norm < 15 || norm > 345) {
                         animate(rotation, Math.round(rotation.get() / 360) * 360, { type:"spring" });
                         onAlign();
                     }
                 }}
            />
            {/* The Notch */}
            <div className="absolute top-0 w-2 h-4 -translate-y-1/2 bg-black border transition-colors duration-300" 
                 style={{ borderColor: isLocked ? '#fff' : 'rgba(255,255,255,0.5)', backgroundColor: isLocked ? '#fff' : '#000' }} />
        </motion.div>
    )
}

// --- GAME ENGINE 2: MEMORY (Grid Pattern) ---
const MemoryGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [started, setStarted] = useState(false);
    const [showingIdx, setShowingIdx] = useState<number | null>(null);
    const [userTurn, setUserTurn] = useState(false);
    const [userStep, setUserStep] = useState(0);

    useEffect(() => {
        if (!started) {
            setStarted(true);
            setTimeout(addStep, 1000);
        }
    }, [started]);

    const addStep = () => {
        const newSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(newSeq);
        playSeq(newSeq);
    };

    const playSeq = (seq: number[]) => {
        setUserTurn(false);
        setUserStep(0);
        let i = 0;
        const int = setInterval(() => {
            if (i >= seq.length) {
                clearInterval(int);
                setShowingIdx(null);
                setUserTurn(true);
            } else {
                setShowingIdx(seq[i]);
                setTimeout(() => setShowingIdx(null), 400);
                i++;
            }
        }, 800);
    };

    const handleTap = (idx: number) => {
        if (!userTurn) return;
        setShowingIdx(idx); 
        setTimeout(() => setShowingIdx(null), 200);

        if (sequence[userStep] === idx) {
            if (userStep + 1 === sequence.length) {
                if (sequence.length >= 4) onWin();
                else setTimeout(addStep, 1000);
            } else {
                setUserStep(s => s + 1);
            }
        } else {
             setUserTurn(false);
             setTimeout(() => playSeq(sequence), 1000);
        }
    };

    const icons = [Users, Brain, ShieldCheck, Heart];

    return (
        <div className="grid grid-cols-2 gap-4 p-8 max-w-xs mx-auto">
            {icons.map((Icon, i) => (
                <button key={i} onClick={() => handleTap(i)}
                    className={`aspect-square rounded-xl border-2 transition-all duration-150 flex items-center justify-center
                        ${showingIdx === i ? `bg-white scale-105 shadow-[0_0_30px_white]` : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    style={{ borderColor: showingIdx === i ? '#fff' : 'rgba(255,255,255,0.1)' }}
                >
                    <Icon className="w-8 h-8 transition-colors" style={{ color: showingIdx===i ? '#000' : 'rgba(255,255,255,0.3)' }} />
                </button>
            ))}
            <div className="col-span-2 text-center text-xs text-gray-500 font-mono mt-4">
                SEQUENCE LENGTH: {sequence.length}/4
            </div>
        </div>
    )
}

// --- GAME ENGINE 3: WHACK (Grid Reflex) ---
const WhackGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [score, setScore] = useState(0);
    const [active, setActive] = useState<number[]>([]);
    
    useEffect(() => {
        const int = setInterval(() => {
            setActive(prev => {
                if (prev.length > 5) { setScore(0); return []; }
                const next = Math.floor(Math.random() * 9);
                return prev.includes(next) ? prev : [...prev, next];
            });
        }, Math.max(500, 1000 - score * 60));
        return () => clearInterval(int);
    }, [score]);

    const hit = (i: number) => {
        if (active.includes(i)) {
            setActive(prev => prev.filter(x => x !== i));
            const newS = score + 1;
            setScore(newS);
            if (newS >= 10) onWin();
        }
    };

    return (
        <div className="h-full flex flex-col p-6">
            <div className="grid grid-cols-3 gap-3 flex-1">
                {[...Array(9)].map((_, i) => (
                    <button key={i} onPointerDown={() => hit(i)}
                        className={`relative rounded border transition-all duration-100 flex items-center justify-center overflow-hidden`}
                        style={{ 
                            backgroundColor: active.includes(i) ? config.hex + '33' : 'rgba(255,255,255,0.05)',
                            borderColor: active.includes(i) ? config.hex : 'rgba(255,255,255,0.1)'
                        }}
                    >
                        <AnimatePresence>
                            {active.includes(i) && (
                                <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>
                                    <config.icon style={{ color: config.hex }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                ))}
            </div>
            <div className="text-center mt-4">
                 <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                     <motion.div className="h-full" style={{ backgroundColor: config.hex }} animate={{ width: `${(score/10)*100}%` }} />
                 </div>
                 <span className="text-xs text-gray-400 font-bold tracking-widest">{score}/10</span>
            </div>
        </div>
    )
}

// --- GAME ENGINE 4: CATCHER (Falling items) ---
const CatcherGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [playerX, setPlayerX] = useState(50);
    const playerRef = useRef(50);
    const [score, setScore] = useState(0);
    const [items, setItems] = useState<{id:number, x:number, y:number, bad:boolean}[]>([]);
    const request = useRef<number>(0);
    
    useEffect(() => {
        let lastTime = 0;
        const loop = (time: number) => {
            if (time - lastTime > 800) { 
                setItems(prev => [...prev, { id: Math.random(), x: Math.random() * 90 + 5, y: -10, bad: Math.random() > 0.7 }]);
                lastTime = time;
            }
            
            setItems(prev => {
                const nextItems: typeof items = [];
                prev.forEach(item => {
                    const nextY = item.y + 0.6; 
                    if (nextY > 85 && nextY < 95 && Math.abs(item.x - playerRef.current) < 15) {
                        if (!item.bad) {
                             setScore(s => {
                                 const ns = s + 1;
                                 if (ns >= 10) onWin();
                                 return ns;
                             });
                        } else {
                            setScore(s => Math.max(0, s - 2));
                        }
                    } else if (nextY < 100) {
                        nextItems.push({ ...item, y: nextY });
                    }
                });
                return nextItems;
            });
            request.current = requestAnimationFrame(loop);
        }
        request.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(request.current!);
    }, [onWin]);

    return (
        <div className="h-full relative overflow-hidden cursor-none touch-none" 
             onPointerMove={e => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const val = ((e.clientX - rect.left) / rect.width) * 100;
                 setPlayerX(Math.max(0, Math.min(100, val)));
                 playerRef.current = val;
             }}>
             {items.map( item => (
                 <div key={item.id} className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform`}
                      style={{ left: `${item.x}%`, top: `${item.y}%`, backgroundColor: item.bad ? '#ef4444' : config.hex }}>
                      {!item.bad && <config.icon size={12} className="text-black" />}
                 </div>
             ))}
            
            <div className="absolute bottom-5 h-2 w-16 bg-white rounded-full -translate-x-1/2 shadow-[0_0_15px_white] pointer-events-none" style={{ left: `${playerX}%` }} />
            <div className="absolute top-2 right-2 text-2xl font-black text-white/50">{score}/10</div>
        </div>
    )
}

// --- GAME ENGINE 5: RHYTHM (Timing Lock) ---
const RhythmGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [target, setTarget] = useState(50);
    const [pos, setPos] = useState(0);
    const [score, setScore] = useState(0);
    const [dir, setDir] = useState(1);
    const request = useRef<number>(0);
    
    useEffect(() => {
        const loop = () => {
             setPos(p => {
                 let next = p + dir * (0.5 + score * 0.1); 
                 if (next > 100 || next < 0) {
                     setDir(d => -d);
                     next = Math.max(0, Math.min(100, next));
                 }
                 return next;
             });
             request.current = requestAnimationFrame(loop);
        }
        request.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(request.current!);
    }, [dir, score]);
    
    const hit = () => {
        if (Math.abs(pos - target) < 10) {
            setScore(s => {
                const ns = s + 1;
                if (ns >= 5) onWin();
                return ns;
            });
            setTarget(Math.random() * 80 + 10);
        } else {
            setScore(0);
        }
    };
    
    return (
        <div className="h-full flex flex-col justify-center p-8 text-center" onPointerDown={hit}>
            <div className="text-xs text-gray-500 mb-8 tracking-[0.5em]">TAP TO LOCK</div>
            
            <div className="relative h-12 bg-gray-900 rounded-full border border-white/10 mb-4 overflow-hidden">
                <div className={`absolute top-0 bottom-0 border-x`}
                     style={{ left: `${target - 10}%`, width: '20%', backgroundColor: config.hex + '40', borderColor: config.hex }} />
                <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_white]"
                     style={{ left: `${pos}%` }} />
            </div>
            
            <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-colors`} style={{ backgroundColor: i < score ? '#fff' : '#333' }} />
                ))}
            </div>
        </div>
    )
}

// --- GAME ENGINE 6: TECH CHALLENGE (Riddle + Build) ---

const IT_RIDDLES = [
    { q: "I have keys but no locks. I have a space but no room. You can enter, but never go outside.", options: ["Cloud Server", "Keyboard", "Database"], correct: 1 },
    { q: "I run all day but never move. I have a port but no ship.", options: ["Server", "Internet", "Cable"], correct: 0 },
    { q: "I have a lot of memories, but I forget everything when the power cuts.", options: ["Hard Drive", "RAM", "Flash Drive"], correct: 1 },
    { q: "I am the brain of the computer, but I have no thoughts of my own.", options: ["Motherboard", "CPU", "Transistor"], correct: 1 },
    { q: "I catch bugs but have no net. I interrupt you when I find a mistake.", options: ["Compiler", "Firewall", "Router"], correct: 0 }
];

const IT_CHALLENGES = [
    { name: "LOGIN PAGE", required: ['header', 'input', 'button'] },
    { name: "VIDEO PORTAL", required: ['header', 'video', 'button'] },
    { name: "SEARCH APP", required: ['header', 'input', 'button'] },
    { name: "CHAT INTERFACE", required: ['header', 'input', 'input'] }
];

const TechChallengeGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [stage, setStage] = useState(1);
    const [builderItems, setBuilderItems] = useState<string[]>([]);
    const [riddle, setRiddle] = useState(IT_RIDDLES[0]);
    const [challenge, setChallenge] = useState(IT_CHALLENGES[0]);

    useEffect(() => {
        // Randomize on mount
        setRiddle(IT_RIDDLES[Math.floor(Math.random() * IT_RIDDLES.length)]);
        setChallenge(IT_CHALLENGES[Math.floor(Math.random() * IT_CHALLENGES.length)]);
    }, []);
    
    // Stage 1: Riddle
    const handleRiddle = (idx: number) => {
        if (idx === riddle.correct) {
             setStage(2);
        } else {
             // Shake or error effect could go here
             const btn = document.getElementById(`opt-${idx}`);
             if(btn) {
                 btn.classList.add('bg-red-500/20', 'border-red-500');
                 setTimeout(() => btn.classList.remove('bg-red-500/20', 'border-red-500'), 500);
             }
        }
    };

    // Stage 2: UI Builder
    const handleBuild = (item: string) => {
        if (builderItems.length < 5) {
             const newItems = [...builderItems, item];
             setBuilderItems(newItems);
             
             // Check win condition
             // We check if all required items are present. Order doesn't strictly matter for this mini-game depth.
             const requiredCounts = challenge.required.reduce((acc, curr) => { acc[curr] = (acc[curr] || 0) + 1; return acc; }, {} as Record<string, number>);
             const currentCounts = newItems.reduce((acc, curr) => { acc[curr] = (acc[curr] || 0) + 1; return acc; }, {} as Record<string, number>);
             
             const isComplete = Object.keys(requiredCounts).every(key => (currentCounts[key] || 0) >= requiredCounts[key]);

             if (isComplete) {
                 setTimeout(onWin, 600);
             }
        }
    };

    return (
        <div className="h-full w-full p-6 flex flex-col items-center justify-center">
             {stage === 1 && (
                 <div className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-3 text-white mb-2">
                          <Code className="text-blue-400" />
                          <span className="font-bold tracking-widest text-xs">STAGE 1: KNOWLEDGE CHECK</span>
                      </div>
                      <div className="bg-white/10 p-4 rounded-lg border border-white/20 text-sm mb-4 min-h-[80px] flex items-center">
                          "{riddle.q}"
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                          {riddle.options.map((opt, i) => (
                              <button key={i} id={`opt-${i}`} onClick={() => handleRiddle(i)} 
                                  className="p-3 rounded bg-white/5 hover:bg-white/20 text-left text-xs transition-colors border border-transparent hover:border-blue-400">
                                  {String.fromCharCode(65+i)}. {opt}
                              </button>
                          ))}
                      </div>
                 </div>
             )}

             {stage === 2 && (
                 <div className="w-full flex flex-col md:flex-row gap-4 h-full animate-in fade-in zoom-in overflow-hidden">
                      {/* Phone Preview */}
                      <div className="flex-[2] bg-gray-900 border-4 border-gray-700 rounded-2xl relative overflow-hidden flex flex-col py-4 px-2 shadow-xl min-h-[200px]">
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full" />
                          <div className="mt-4 flex flex-col gap-2">
                              <AnimatePresence>
                                  {builderItems.map((item, i) => (
                                      <motion.div key={i} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="w-full">
                                          {item === 'header' && <div className="h-10 bg-blue-500/30 rounded flex items-center justify-center border border-blue-500/50 mb-1"><Users size={14} className="mr-2"/>App Header</div>}
                                          {item === 'input' && <div className="h-8 bg-white/10 rounded border border-white/20 mb-1 px-2 flex items-center text-[10px] text-gray-500"> Input Field...</div>}
                                          {item === 'button' && <div className="h-8 bg-green-500 rounded flex items-center justify-center text-[10px] font-bold text-black mt-2">SUBMIT ACTION</div>}
                                          {item === 'video' && <div className="h-16 bg-red-500/20 rounded border border-red-500/40 flex items-center justify-center mb-1"><Video size={20} /></div>}
                                      </motion.div>
                                  ))}
                              </AnimatePresence>
                              {builderItems.length === 0 && (
                                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                      <Smartphone size={32} className="mb-2"/>
                                      <div className="text-[10px] uppercase font-bold text-gray-400">Mission:</div>
                                      <div className="text-xs text-blue-400 font-bold">{challenge.name}</div>
                                  </div>
                              )}
                          </div>
                      </div>
                      
                      {/* Toolbox */}
                      <div className="w-full md:w-24 h-24 md:h-auto bg-white/5 rounded-xl p-2 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-hide">
                          <div className="text-[10px] text-center text-gray-400 font-bold mb-1 w-full md:w-auto hidden md:block">TOOLBOX</div>
                          <button onClick={() => handleBuild('header')} className="p-2 bg-blue-500/20 rounded hover:bg-blue-500/40 transition flex flex-col items-center gap-1 group min-w-[50px]">
                              <Layout size={16} className="group-hover:scale-110 transition-transform"/> <span className="text-[9px]">Header</span>
                          </button>
                          <button onClick={() => handleBuild('input')} className="p-2 bg-white/10 rounded hover:bg-white/20 transition flex flex-col items-center gap-1 group min-w-[50px]">
                              <Zap size={16} className="group-hover:scale-110 transition-transform"/> <span className="text-[9px]">Input</span>
                          </button>
                          <button onClick={() => handleBuild('video')} className="p-2 bg-purple-500/20 rounded hover:bg-purple-500/40 transition flex flex-col items-center gap-1 group min-w-[50px]">
                              <ImageIcon size={16} className="group-hover:scale-110 transition-transform"/> <span className="text-[9px]">Media</span>
                          </button>
                          <button onClick={() => handleBuild('button')} className="p-2 bg-green-500/20 rounded hover:bg-green-500/40 transition flex flex-col items-center gap-1 group min-w-[50px]">
                              <Play size={16} className="group-hover:scale-110 transition-transform"/> <span className="text-[9px]">Button</span>
                          </button>
                          
                          <div className="ml-auto md:mt-auto px-1 flex flex-col justify-center">
                              <div className="text-[8px] text-gray-500 text-center mb-1">REQ:</div>
                              <div className="flex md:flex-wrap justify-center gap-1">
                                  {challenge.required.map((r,i) => (
                                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${builderItems.includes(r) ? 'bg-green-500' : 'bg-red-500'}`} />
                                  ))}
                              </div>
                          </div>

                          <button onClick={() => setBuilderItems([])} className="ml-2 md:mt-2 p-1 bg-red-500/10 hover:bg-red-500/30 rounded text-[9px] text-red-300 transition-colors min-w-[40px]">RST</button>
                      </div>
                 </div>
             )}
        </div>
    )
}

// --- GAME ENGINE 7: HUMAN MATCH (HR Identity Game) ---

const HR_ROLES = [
    { id: 'leader', label: 'The Team Leader', traits: { people: true, charge: true, detail: false, creative: false } },
    { id: 'mediator', label: 'The Mediator', traits: { people: true, charge: false, detail: false, creative: false } },
    { id: 'analyst', label: 'The Analyst', traits: { people: false, charge: false, detail: true, creative: false } },
    { id: 'innovator', label: 'The Innovator', traits: { people: false, charge: true, detail: false, creative: true } },
    { id: 'strategist', label: 'The Strategist', traits: { people: false, charge: true, detail: true, creative: false } },
    { id: 'creative', label: 'The Creative', traits: { people: true, charge: false, detail: false, creative: true } }
];

const HR_QUESTIONS = [
    { id: 'people', text: "Do I enjoy working closely with people?" },
    { id: 'charge', text: "Do I naturally take charge of situations?" },
    { id: 'detail', text: "Do I prefer working with data and details?" },
    { id: 'creative', text: "Do I often come up with wild new ideas?" },
    { id: '!people', text: "Do I prefer working alone in quiet?" },
    { id: '!charge', text: "Am I comfortable following someone else?" },
    { id: '!detail', text: "Do I focus on the big picture over specs?" },
    { id: '!creative', text: "Do I prefer proven methods over risks?" }
];

const HumanMatchGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [hiddenRole, setHiddenRole] = useState(HR_ROLES[0]);
    const [questions, setQuestions] = useState<typeof HR_QUESTIONS>([]);
    const [history, setHistory] = useState<{q: string, a: boolean}[]>([]);
    const [isGuessing, setIsGuessing] = useState(false);
    
    useEffect(() => {
        // Randomize Role
        setHiddenRole(HR_ROLES[Math.floor(Math.random() * HR_ROLES.length)]);
        
        // Randomize Questions (Pick 5)
        const shuffled = [...HR_QUESTIONS].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 5));
    }, []);

    const ask = (qId: string, text: string) => {
        let val = false;
        // Handle negation logic (starts with !)
        if (qId.startsWith('!')) {
            const key = qId.substring(1) as keyof typeof hiddenRole.traits;
            val = !hiddenRole.traits[key];
        } else {
            val = hiddenRole.traits[qId as keyof typeof hiddenRole.traits];
        }
        
        setHistory(prev => [...prev, { q: text, a: val }]);
        
        // Auto scroll
        setTimeout(() => {
            const el = document.getElementById('chat-log');
            if(el) el.scrollTop = el.scrollHeight;
        }, 100);
    };

    const handleGuess = (roleId: string) => {
        if(roleId === hiddenRole.id) {
            onWin();
        } else {
             // Wrong guess feedback
             const btn = document.getElementById(`guess-${roleId}`);
             if(btn) {
                 btn.classList.add('bg-red-500', 'border-red-500');
                 setTimeout(() => btn.classList.remove('bg-red-500', 'border-red-500'), 500);
             }
        }
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
            {/* Left: Player & Interaction */}
            <div className="w-full md:w-1/3 flex flex-row md:flex-col items-center justify-center gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4 shrink-0">
                 
                 {/* Player Avatar */}
                 <div className="relative shrink-0">
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden">
                         <Users size={32} className="text-gray-500 md:hidden" />
                         <Users size={40} className="text-gray-500 hidden md:block" />
                     </div>
                     {/* The Card on Head */}
                     <motion.div 
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold shadow-lg rotate-3 whitespace-nowrap"
                    >
                         ?????
                     </motion.div>
                 </div>

                 <div className="text-center flex-1 md:flex-none w-full">
                     <div className="text-[10px] md:text-xs text-gray-500 mb-2 hidden md:block">ASK THE TEAM (Pick 5)</div>
                     <div className="flex flex-col gap-1 md:gap-2 w-full max-h-[100px] md:max-h-none overflow-y-auto">
                         {questions.map(q => (
                             <button key={q.id} onClick={() => ask(q.id, q.text)}
                                 disabled={isGuessing}
                                 className="px-2 py-1.5 md:px-3 md:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[9px] md:text-[10px] text-left transition-colors flex items-center gap-2 truncate">
                                 <HelpCircle size={10} className="shrink-0 text-blue-400" />
                                 <span className="truncate">{q.text}</span>
                             </button>
                         ))}
                     </div>
                 </div>

                 <button onClick={() => setIsGuessing(true)} className="md:mt-auto w-auto md:w-full px-4 py-2 bg-blue-500 text-white font-bold text-[10px] md:text-xs rounded hover:bg-blue-400 transition-colors whitespace-nowrap">
                     GUESS ROLE
                 </button>
            </div>

            {/* Right: Chat Log & Guessing */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                 {!isGuessing ? (
                     <div id="chat-log" className="flex-1 overflow-y-auto space-y-3 p-2">
                         <div className="text-[10px] text-gray-500 text-center italic">Game Started. You have a hidden role card on your forehead. Ask questions to figure it out!</div>
                         {history.map((h, i) => (
                             <motion.div key={i} initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} className="flex flex-col gap-1">
                                  <div className="self-end bg-blue-500/20 text-blue-200 px-3 py-1 rounded-t-lg rounded-bl-lg text-xs max-w-[90%]">
                                      {h.q}
                                  </div>
                                  <div className="self-start bg-gray-800 text-white px-3 py-1 rounded-t-lg rounded-br-lg text-xs font-bold flex items-center gap-2">
                                      <MessageCircle size={10} className="text-green-500" />
                                      {h.a ? "YES." : "NO."}
                                  </div>
                             </motion.div>
                         ))}
                     </div>
                 ) : (
                     <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center p-4 animate-in fade-in slide-in-from-right">
                         <h3 className="text-white font-bold mb-4 text-sm">SELECT YOUR ROLE</h3>
                         <div className="grid grid-cols-2 gap-3 w-full">
                             {HR_ROLES.map(role => (
                                 <button key={role.id} id={`guess-${role.id}`} onClick={() => handleGuess(role.id)}
                                     className="p-4 bg-gray-800 border border-white/20 hover:border-white hover:bg-gray-700 rounded transition-all text-xs font-bold text-center flex flex-col items-center gap-2">
                                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                         {role.id === 'leader' && <Trophy size={14} className="text-yellow-400"/>}
                                         {role.id === 'mediator' && <Heart size={14} className="text-pink-400"/>}
                                         {role.id === 'analyst' && <Brain size={14} className="text-blue-400"/>}
                                         {role.id === 'innovator' && <Lightbulb size={14} className="text-white"/>}
                                         {role.id === 'strategist' && <Target size={14} className="text-red-400"/>}
                                         {role.id === 'creative' && <Zap size={14} className="text-purple-400"/>}
                                     </div>
                                     {role.label}
                                 </button>
                             ))}
                         </div>
                         <button onClick={() => setIsGuessing(false)} className="mt-6 text-xs text-gray-400 hover:text-white underline">
                             Back to questions
                         </button>
                     </div>
                 )}
            </div>
        </div>
    )
}

// --- GAME ENGINE 8: PM SHUFFLE (Sequence Ordering) ---

const PM_SCENARIOS = [
    {
        name: "Quick Event",
        steps: [
            { id: '1', text: "Set the Date" },
            { id: '2', text: "Send Invites" },
            { id: '3', text: "Buy Supplies" },
            { id: '4', text: "Host Party" }
        ]
    },
    {
        name: "New Product",
        steps: [
            { id: '1', text: "Brainstorm Idea" },
            { id: '2', text: "Build Prototype" },
            { id: '3', text: "Test It" },
            { id: '4', text: "Launch It" }
        ]
    },
    {
        name: "Hiring Process",
        steps: [
            { id: '1', text: "Post Job Ad" },
            { id: '2', text: "Interview" },
            { id: '3', text: "Hire Candidate" },
            { id: '4', text: "Train Team" }
        ]
    }
];

import { Reorder } from "framer-motion";

const PMShuffleGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [items, setItems] = useState<{id: string, text: string}[]>([]);
    const [scenario, setScenario] = useState(PM_SCENARIOS[0]);
    const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');

    useEffect(() => {
        // Pick random scenario
        const sc = PM_SCENARIOS[Math.floor(Math.random() * PM_SCENARIOS.length)];
        setScenario(sc);
        // Shuffle items
        const shuffled = [...sc.steps].sort(() => 0.5 - Math.random());
        setItems(shuffled);
    }, []);

    const checkOrder = () => {
        const currentIds = items.map(i => i.id).join(',');
        const correctIds = scenario.steps.map(i => i.id).join(',');
        
        if (currentIds === correctIds) {
            setStatus('correct');
            setTimeout(onWin, 800);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus('idle'), 1000);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="text-center mb-6">
                <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-1">CURRENT MISSION</div>
                <h3 className="text-xl font-bold text-white">{scenario.name}</h3>
                <p className="text-xs text-gray-400">Drag items to chronological order</p>
            </div>

            <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full max-w-sm flex flex-col gap-2">
                {items.map((item) => (
                    <Reorder.Item key={item.id} value={item}
                        className={`p-3 rounded bg-white/10 border cursor-grab active:cursor-grabbing flex items-center gap-3 backdrop-blur-sm
                            ${status === 'wrong' ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 hover:bg-white/20'}
                            ${status === 'correct' ? '!border-green-500 !bg-green-500/20' : ''}
                        `}
                    >
                         <div className="flex flex-col gap-0.5">
                             <div className="w-4 h-0.5 bg-gray-500 rounded-full" />
                             <div className="w-4 h-0.5 bg-gray-500 rounded-full" />
                             <div className="w-4 h-0.5 bg-gray-500 rounded-full" />
                         </div>
                         <span className="text-sm font-medium">{item.text}</span>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button onClick={checkOrder} className="mt-6 px-8 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                VERIFY SEQUENCE
            </button>
        </div>
    )
}

// --- GAME ENGINE 9: SPIN THE STORY (PR Creative Challenge) ---

const PR_TOPICS = [
    "New Ice Cream Flavor", "School Talent Show", "Found a Lost Puppy", 
    "Big Sports Match Win", "Library Book Sale", "Video Game Tournament",
    "Free Pizza Party", "School Holiday News"
];

const SpinStoryGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [topic, setTopic] = useState("");
    const [headline, setHeadline] = useState("");
    const [isSpinning, setIsSpinning] = useState(false);
    const [phase, setPhase] = useState<'spin' | 'write' | 'result'>('spin');
    const [stats, setStats] = useState({ likes: 0, shares: 0 });

    const spin = () => {
        setIsSpinning(true);
        let i = 0;
        const interval = setInterval(() => {
            setTopic(PR_TOPICS[Math.floor(Math.random() * PR_TOPICS.length)]);
            i++;
            if (i > 15) {
                clearInterval(interval);
                setIsSpinning(false);
                setPhase('write');
            }
        }, 100);
    };

    const publish = () => {
        if (headline.length < 5) return;
        setPhase('result');
        // Fake stats based on length logic just for fun
        const score = Math.floor(Math.random() * 500) + (headline.length * 10) + 100;
        setStats({ likes: score, shares: Math.floor(score / 4) });
    };

    const next = () => {
        setHeadline("");
        setPhase('spin');
        setTopic("");
        setStats({ likes: 0, shares: 0 });
        if (Math.random() > 0.5) onWin(); // Chance to win after a good post to show success screen
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            {phase === 'spin' && (
                <>
                    <Megaphone className="w-12 h-12 text-purple-400 mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-white mb-2">PR CHALLENGE</h3>
                    <p className="text-xs text-gray-400 mb-6">Spin the wheel to get your campaign topic!</p>
                    <button onClick={spin} disabled={isSpinning}
                        className="px-8 py-3 bg-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(192,132,252,0.5)]">
                        {isSpinning ? "SPINNING..." : "GENERATE TOPIC"}
                    </button>
                    <div className="mt-4 h-8 text-sm font-mono text-purple-200">
                        {isSpinning || topic ? topic : "..."}
                    </div>
                </>
            )}

            {phase === 'write' && (
                <div className="w-full max-w-sm animate-in zoom-in duration-300">
                     <div className="text-[10px] uppercase font-bold text-purple-400 mb-2">TOPIC:</div>
                     <div className="bg-purple-900/30 border border-purple-500/30 p-3 rounded mb-4 text-sm font-bold text-white">
                         "{topic}"
                     </div>
                     <div className="text-left mb-1 text-[10px] text-gray-400">YOUR HEADLINE:</div>
                     <textarea 
                        value={headline} onChange={e => setHeadline(e.target.value)}
                        placeholder="Write a catchy headline..."
                        className="w-full bg-black/50 border border-white/20 rounded p-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none h-24 mb-4"
                     />
                     <button onClick={publish} className="w-full py-2 bg-white text-purple-900 font-bold rounded hover:bg-purple-100 transition-colors">
                         PUBLISH NOW
                     </button>
                </div>
            )}

            {phase === 'result' && (
                <div className="w-full max-w-sm animate-in slide-in-from-bottom duration-500">
                    <div className="bg-white text-black rounded-lg p-4 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">PR</div>
                            <div className="text-left">
                                <div className="font-bold text-xs">Public Relations Dept</div>
                                <div className="text-[10px] text-gray-500">Just now • 🌎</div>
                            </div>
                        </div>
                        <div className="text-sm font-medium mb-4 text-left">
                            {headline}
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between text-xs font-bold text-gray-600">
                             <span className="flex items-center gap-1 text-pink-500"><Heart size={12} fill="currentColor"/> {stats.likes}</span>
                             <span className="flex items-center gap-1 text-blue-500"><RefreshCw size={12} /> {stats.shares}</span>
                        </div>
                    </div>
                    <button onClick={next} className="mt-6 text-xs text-gray-400 hover:text-white underline">
                        Create Another Post
                    </button>
                </div>
            )}
        </div>
    )
}

// --- GAME ENGINE 10: PITCH IT FAST (Fundraising Builder) ---

const FR_PROJECTS = ["Community Garden", "Student Library", "Local Food Drive", "Tech for Seniors", "Youth Art Festival"];
const PITCH_OPTIONS = {
    hooks: ["Did you know?", "Imagine a world...", "We have a crisis..."],
    solutions: ["Our proven method...", "A new technology...", "Community power..."],
    asks: ["Donate $10 today", "Join our team", "Spread the word"]
};

const PitchGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [project, setProject] = useState("");
    const [step, setStep] = useState(0); // 0: Intro, 1: Hook, 2: Solution, 3: Ask, 4: Result
    const [selections, setSelections] = useState<string[]>([]);

    useEffect(() => {
        setProject(FR_PROJECTS[Math.floor(Math.random() * FR_PROJECTS.length)]);
    }, []);

    const handleSelect = (text: string) => {
        setSelections(prev => [...prev, text]);
        setStep(s => s + 1);
    };

    const reset = () => {
        setStep(0);
        setSelections([]);
        setProject(FR_PROJECTS[Math.floor(Math.random() * FR_PROJECTS.length)]);
        if (selections.length === 3) onWin(); // Simple win condition for completion
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            {step === 0 && (
                <div className="animate-in zoom-in">
                    <Coins className="w-12 h-12 text-green-400 mb-4 mx-auto animate-bounce" />
                    <h3 className="text-xl font-bold text-white mb-2">PITCH IT FAST!</h3>
                    <p className="text-xs text-gray-400 mb-4">You have 1 minute to fund this project:</p>
                    <div className="bg-green-500/20 border border-green-500 text-green-300 font-bold p-3 rounded mb-6">
                        {project}
                    </div>
                    <button onClick={() => setStep(1)} className="px-6 py-2 bg-green-500 text-black font-bold rounded hover:scale-105 transition-transform">
                        START PITCH BOOTH
                    </button>
                </div>
            )}

            {[1, 2, 3].includes(step) && (
                <div className="w-full max-w-sm animate-in slide-in-from-right">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                        STEP {step}/3: CHOOSE YOUR {step === 1 ? 'HOOK' : step === 2 ? 'SOLUTION' : 'ASK'}
                    </div>
                    <div className="grid gap-3">
                        {(step === 1 ? PITCH_OPTIONS.hooks : step === 2 ? PITCH_OPTIONS.solutions : PITCH_OPTIONS.asks).map((opt, i) => (
                            <button key={i} onClick={() => handleSelect(opt)}
                                className="p-4 bg-white/10 hover:bg-green-500/20 border border-white/20 hover:border-green-500 rounded text-left transition-all group">
                                <span className="text-sm font-bold group-hover:text-green-400">{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="w-full max-w-sm animate-in zoom-in text-left bg-white text-black p-6 rounded-lg shadow-2xl">
                    <div className="font-bold text-lg mb-2 border-b border-black/10 pb-2">{project}</div>
                    <div className="space-y-4 text-sm mb-6">
                        <p><span className="font-bold text-green-600">Hook:</span> {selections[0]}</p>
                        <p><span className="font-bold text-green-600">Sol:</span> {selections[1]}</p>
                        <p><span className="font-bold text-green-600">Ask:</span> {selections[2]}</p>
                    </div>
                    <div className="text-center">
                         <div className="text-2xl font-black text-green-600 mb-1">$5,000 RAISED!</div>
                         <div className="text-[10px] text-gray-500 uppercase">Pitch Successful</div>
                    </div>
                    <button onClick={reset} className="mt-6 w-full py-2 bg-black text-white font-bold rounded hover:bg-gray-800">
                        FUND NEXT PROJECT
                    </button>
                </div>
            )}
        </div>
    )
}

// --- GAME ENGINE 11: LOGISTICS SHUFFLE (Supply Chain) ---

const LOGISTICS_SCENARIOS = [
    {
        name: "Simple Delivery",
        steps: [
            { id: '1', text: "Pack Box" },
            { id: '2', text: "Label Box" },
            { id: '3', text: "Load Truck" },
            { id: '4', text: "Drive to House" }
        ]
    },
    {
        name: "Morning Routine",
        steps: [
            { id: '1', text: "Wake Up" },
            { id: '2', text: "Eat Breakfast" },
            { id: '3', text: "Pack Bag" },
            { id: '4', text: "Go to School" }
        ]
    },
    {
        name: "Pizza Order",
        steps: [
            { id: '1', text: "Make Dough" },
            { id: '2', text: "Add Toppings" },
            { id: '3', text: "Bake in Oven" },
            { id: '4', text: "Deliver Pizza" }
        ]
    }
];

const LogisticsShuffleGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
    const [items, setItems] = useState<{id: string, text: string}[]>([]);
    const [scenario, setScenario] = useState(LOGISTICS_SCENARIOS[0]);
    const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');

    useEffect(() => {
        const sc = LOGISTICS_SCENARIOS[Math.floor(Math.random() * LOGISTICS_SCENARIOS.length)];
        setScenario(sc);
        const shuffled = [...sc.steps].sort(() => 0.5 - Math.random());
        setItems(shuffled);
    }, []);

    const checkOrder = () => {
        const currentIds = items.map(i => i.id).join(',');
        const correctIds = scenario.steps.map(i => i.id).join(',');
        
        if (currentIds === correctIds) {
            setStatus('correct');
            setTimeout(onWin, 800);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus('idle'), 1000);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
             <div className="flex items-center gap-2 mb-4">
                 <Truck className="text-orange-400 w-8 h-8" />
                 <h3 className="text-xl font-bold text-white uppercase">{config.title}</h3>
             </div>
             
             <div className="bg-orange-900/20 border border-orange-500/30 px-4 py-2 rounded mb-4 text-center">
                 <div className="text-[10px] text-orange-300 uppercase font-bold text-center">MISSION:</div>
                 <div className="text-sm font-bold text-white">{scenario.name}</div>
             </div>
             
             <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full max-w-sm flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-2 scrollbar-thin scrollbar-thumb-orange-500/20">
                {items.map((item) => (
                    <Reorder.Item key={item.id} value={item}
                        className={`p-3 rounded bg-white/5 border cursor-grab active:cursor-grabbing flex items-center gap-3 backdrop-blur-sm transition-colors
                            ${status === 'wrong' ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 hover:bg-white/10'}
                            ${status === 'correct' ? '!border-green-500 !bg-green-500/20' : ''}
                        `}
                    >
                         <div className="flex flex-col gap-0.5 shrink-0 px-1">
                             <div className="w-3 h-0.5 bg-gray-500 rounded-full" />
                             <div className="w-3 h-0.5 bg-gray-500 rounded-full" />
                             <div className="w-3 h-0.5 bg-gray-500 rounded-full" />
                         </div>
                         <span className="text-xs md:text-sm font-medium text-gray-200">{item.text}</span>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button onClick={checkOrder} className="mt-4 px-8 py-2 bg-orange-500 text-black font-bold rounded hover:scale-105 transition-transform">
                VERIFY CHAIN
            </button>
        </div>
    )
}

// --- MAIN WRAPPER ---

export default function DepartmentMiniGame({ deptId, description }: { deptId: string, description: string }) {
  const [screen, setScreen] = useState<"intro" | "game" | "win">("intro");
  const config = DEPT_CONFIG[deptId as keyof typeof DEPT_CONFIG] || DEPT_CONFIG.it;
  
  return (
    <div className="w-full h-full min-h-[400px] bg-black rounded-xl border border-white/10 overflow-hidden relative shadow-2xl font-sans group select-none">
       
       <div className="absolute inset-0 z-40 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1)_0px,transparent_1px,transparent_2px)] opacity-30" />
       
       {screen === 'intro' && (
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
               <motion.div initial={{scale:0.8}} animate={{scale:1}} className={`p-4 rounded-full mb-4`} style={{ backgroundColor: config.hex + '20' }}>
                   <config.icon className="w-10 h-10" style={{ color: config.hex }} />
               </motion.div>
               <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">{config.title}</h2>
               <p className="text-gray-400 text-xs mb-6">{config.desc}</p>
               <button onClick={() => setScreen('game')} 
                   className="px-6 py-2 bg-white text-black font-bold text-xs tracking-widest hover:scale-105 transition-transform">
                   INITIALIZE
               </button>
           </div>
       )}

       {screen === 'game' && (
           <div className="absolute inset-0 z-10">
               {config.type === 'cipher' && <CipherGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'memory' && <MemoryGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'whack' && <WhackGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'catcher' && <CatcherGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'rhythm' && <RhythmGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'tech_challenge' && <TechChallengeGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'human_match' && <HumanMatchGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'pm_shuffle' && <PMShuffleGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'pr_spin' && <SpinStoryGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'fr_pitch' && <PitchGame config={config} onWin={() => setScreen('win')} />}
               {config.type === 'logistics_shuffle' && <LogisticsShuffleGame config={config} onWin={() => setScreen('win')} />}
               
               <button onClick={() => setScreen('intro')} className="absolute top-2 left-2 text-[10px] text-gray-500 hover:text-white z-50">ABORT</button>
           </div>
       )}
       
       {screen === 'win' && (
           <div className="absolute inset-0 z-30 bg-black flex flex-col p-6 animate-in slide-in-from-bottom duration-500">
               <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                   <ShieldCheck className="text-green-500 w-8 h-8" />
                   <div>
                       <div className="text-green-500 font-bold text-sm tracking-widest">ACCESS GRANTED</div>
                       <div className="text-gray-600 text-[10px]">Security Clearance: Lv. 5</div>
                   </div>
               </div>
                <div className="flex-1 overflow-y-auto text-gray-300 text-sm leading-relaxed font-light italic flex items-center">
                    <div className="w-1 h-full bg-white/20 mr-4 shrink-0" />
                    <div>
                        <Typewriter text={config.quote} />
                    </div>
                </div>
               <button onClick={() => setScreen('intro')} className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
                   <RefreshCw size={12} /> RESTART SYSTEM
               </button>
           </div>
       )}
    </div>
  )
}
