"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { 
  Code, Users, Target, Megaphone, Coins, Truck, 
  Calendar, Lightbulb, Video, Mic, Trophy, Play, RefreshCw,
  Lock, Zap, Brain, Bug, ShieldCheck, Heart, Smartphone, Layout, Image as ImageIcon,
  MessageCircle, HelpCircle, Eye
} from "lucide-react";

// --- CONFIGURATION ---

type GameType = 'cipher' | 'memory' | 'whack' | 'catcher' | 'rhythm' | 'tech_challenge' | 'human_match' | 'pm_shuffle' | 'pr_spin' | 'fr_pitch' | 'logistics_shuffle' | 'org_chaos' | 'mkt_sellgame' | 'mm_visual' | 'pres_pitch';

interface GameConfig {
    type: GameType;
    hex: string;
    title: string;
    desc: string;
    icon: any;
    quote: string;
}

const DEPT_CONFIG: Record<string, GameConfig> = {
  it: { type: 'tech_challenge', hex: '#60a5fa', title: 'THINK LIKE A SYSTEM', desc: 'Analyze system logic', icon: Code, quote: '"The only way to go fast, is to go well."' },
  hr: { type: 'human_match', hex: '#f87171', title: 'HUMAN MATCH', desc: 'Ask questions to find your role', icon: Users, quote: '"Train people well enough so they can leave, treat them well enough so they don\'t want to."' },
  pm: { type: 'pm_shuffle', hex: '#facc15', title: 'TASK SHUFFLE', desc: 'Sequence the project phases', icon: Target, quote: '"Project management is the art of creating order from chaos."' },
  pr: { type: 'pr_spin', hex: '#c084fc', title: 'SPIN THE STORY', desc: 'Craft the perfect headline', icon: Megaphone, quote: '"Everything you do or say is public relations."' },
  fr: { type: 'fr_pitch', hex: '#4ade80', title: 'PITCH IT FAST', desc: 'Build the ultimate funding pitch', icon: Coins, quote: '"No one has ever become poor by giving."' },
  logistics: { type: 'logistics_shuffle', hex: '#fb923c', title: 'SUPPLY CHAIN SHUFFLE', desc: 'Optimize the delivery route', icon: Truck, quote: '"Amateurs talk strategy. Professionals talk logistics."' },
  er: { type: 'org_chaos', hex: '#2dd4bf', title: 'FIX THE CHAOS', desc: 'Organize the messy scenario', icon: Calendar, quote: '"Out of clutter, find simplicity. From discord, find harmony."' },
  mkt: { type: 'mkt_sellgame', hex: '#f472b6', title: 'SELL WITHOUT SAYING', desc: 'Creative marketing challenge', icon: Lightbulb, quote: '"People don\'t buy what you do; they buy why you do it."' },
  mm: { type: 'mm_visual', hex: '#818cf8', title: 'SPOT THE VISUAL', desc: 'Visual awareness challenge', icon: Video, quote: '"Design is the silent ambassador of your brand."' },
  pres: { type: 'pres_pitch', hex: '#22d3ee', title: 'ONE-MINUTE PITCH', desc: 'Quick Public Speaking Challenge', icon: Mic, quote: '"The art of communication is the language of leadership."' },
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
        <div className="relative w-full h-full flex items-center justify-center scale-[0.55] sm:scale-75 md:scale-100 transition-transform">
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
             
             {[150, 110, 70].map((r, i) => (
                 <CipherRing key={i} radius={r} index={i} isLocked={locks[i]} hex={config.hex} onAlign={() => handleAlign(i)} />
             ))}
             
             <div className="z-10 bg-gray-900 border border-white/20 p-3 md:p-4 rounded-full shadow-2xl">
                 <config.icon style={{ color: config.hex }} className="w-6 h-6 md:w-8 md:h-8" />
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
        <div className="grid grid-cols-2 gap-2 sm:gap-4 p-4 sm:p-8 max-w-[200px] sm:max-w-xs mx-auto">
            {icons.map((Icon, i) => (
                <button key={i} onClick={() => handleTap(i)}
                    className={`aspect-square rounded-lg sm:rounded-xl border-2 transition-all duration-150 flex items-center justify-center
                        ${showingIdx === i ? `bg-white scale-105 shadow-[0_0_30px_white]` : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    style={{ borderColor: showingIdx === i ? '#fff' : 'rgba(255,255,255,0.1)' }}
                >
                    <Icon className="w-5 h-5 sm:w-8 sm:h-8 transition-colors" style={{ color: showingIdx===i ? '#000' : 'rgba(255,255,255,0.3)' }} />
                </button>
            ))}
            <div className="col-span-2 text-center text-[10px] sm:text-xs text-gray-500 font-mono mt-2 sm:mt-4">
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
        <div className="h-full flex flex-col p-3 sm:p-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-1 max-h-[180px] sm:max-h-none">
                {[...Array(9)].map((_, i) => (
                    <button key={i} onPointerDown={() => hit(i)}
                        className={`relative rounded border transition-all duration-100 flex items-center justify-center overflow-hidden min-h-[40px] sm:min-h-0`}
                        style={{ 
                            backgroundColor: active.includes(i) ? config.hex + '33' : 'rgba(255,255,255,0.05)',
                            borderColor: active.includes(i) ? config.hex : 'rgba(255,255,255,0.1)'
                        }}
                    >
                        <AnimatePresence>
                            {active.includes(i) && (
                                <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>
                                    <config.icon size={16} className="sm:w-6 sm:h-6" style={{ color: config.hex }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                ))}
            </div>
            <div className="text-center mt-2 sm:mt-4">
                 <div className="w-full bg-gray-800 h-1.5 sm:h-2 rounded-full overflow-hidden">
                     <motion.div className="h-full" style={{ backgroundColor: config.hex }} animate={{ width: `${(score/10)*100}%` }} />
                 </div>
                 <span className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-widest">{score}/10</span>
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
// --- GAME ENGINE 5: ONE-MINUTE PITCH GAME ---
const RhythmGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => null;

function OneMinutePitchGame({ config, onWin }: { config: GameConfig, onWin: () => void }) {
    const [topic, setTopic] = useState<any>(null);
    const [structure, setStructure] = useState({ hook: '', point: '', cta: '' });
    const [timeLeft, setTimeLeft] = useState(60); // 60s prep, then 60s speak
    const [phase, setPhase] = useState<'prep' | 'speak' | 'finished'>('prep');

    // Randomized topics
    const topics = [
        "A reusable coffee cup exchange program for campus.",
        "A mobile app that connects students with study buddies.",
        "A campus-wide recycling reward system.",
        "A student-run mental health support hotline.",
        "A 'Skills Swap' workshop series for students.",
        "A vertical garden project for the university cafeteria.",
        "A digital textbook marketplace for affordable learning.",
        "A 'Zero Waste' challenge week for the community."
    ];

    useEffect(() => {
        setTopic(topics[Math.floor(Math.random() * topics.length)]);
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && (phase === 'prep' || phase === 'speak')) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && phase === 'prep') {
            setPhase('speak');
            setTimeLeft(60); // Reset for speaking phase
        } else if (timeLeft === 0 && phase === 'speak') {
            setPhase('finished');
        }
    }, [timeLeft, phase]);

    const handleStartSpeaking = () => {
        if (structure.hook && structure.point && structure.cta) {
            setPhase('speak');
            setTimeLeft(60);
        }
    };

    const handleFinish = () => {
        setPhase('finished');
        setTimeout(onWin, 1500);
    };
    
    // Auto-advance if finished speaking early
    const handleStopEarly = () => {
         setPhase('finished');
         setTimeout(onWin, 1500);
    }

    if (!topic) return <div className="text-white p-4">Loading topic...</div>;

    if (phase === 'finished') {
         return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <Mic className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 mb-4 animate-bounce" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">PITCH DELIVERED!</h3>
                <p className="text-sm sm:text-base text-gray-400 max-w-md">
                    Great job organizing your thoughts and sticking to the time limit.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-3 sm:p-4 bg-gradient-to-b from-black/20 to-cyan-500/5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-cyan-500/30 pb-2">
                <div className="flex items-center gap-2">
                    <Mic className="text-cyan-400 w-5 h-5" />
                    <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {phase === 'prep' ? 'PREPARE YOUR PITCH' : '🎤 ON AIR - SPEAK NOW!'}
                    </div>
                </div>
                <div className={`px-2 py-1 rounded font-mono text-xs font-bold ${
                    phase === 'speak' ? 'bg-red-500 animate-pulse text-white' : 'bg-cyan-500 text-black'
                }`}>
                    00:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Topic Card */}
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-3 mb-3 shrink-0">
                <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-1">TOPIC</div>
                <div className="text-sm sm:text-base font-bold text-white">"{topic}"</div>
            </div>

            {phase === 'prep' ? (
                <div className="flex-1 overflow-y-auto space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs text-cyan-200 font-bold">1. THE HOOK (Grab attention)</label>
                        <textarea 
                            value={structure.hook} 
                            onChange={e => setStructure({...structure, hook: e.target.value})}
                            placeholder="Start with a question or shocking fact..."
                            className="w-full h-16 bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-cyan-200 font-bold">2. CORE VALUE (The Solution)</label>
                         <textarea 
                            value={structure.point} 
                            onChange={e => setStructure({...structure, point: e.target.value})}
                            placeholder="Explain the solution and benefit..."
                            className="w-full h-16 bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                        />
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs text-cyan-200 font-bold">3. THE ASK (Call to Action)</label>
                         <textarea 
                            value={structure.cta} 
                            onChange={e => setStructure({...structure, cta: e.target.value})}
                            placeholder="What should they do next?"
                            className="w-full h-16 bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                        />
                    </div>
                    
                    <button 
                        onClick={handleStartSpeaking}
                        disabled={!structure.hook || !structure.point || !structure.cta}
                        className={`w-full py-3 rounded font-bold text-xs uppercase tracking-widest transition-all ${
                            structure.hook && structure.point && structure.cta 
                            ? 'bg-cyan-500 text-black hover:scale-105' 
                            : 'bg-gray-800 text-gray-500'
                        }`}
                    >
                        {structure.hook && structure.point && structure.cta ? 'READY TO PRESENT >' : 'FILL ALL SECTIONS'}
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-red-500 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_30px_red]">
                         <Mic className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase mb-2">YOU ARE LIVE!</h2>
                    <p className="text-white/60 text-xs sm:text-sm max-w-xs mb-8">
                        Follow your script. Speak clearly. Smile.
                    </p>
                    
                    <div className="w-full max-w-xs bg-black/40 rounded p-3 text-left space-y-2 mb-6 border border-white/10">
                        <div className="text-[10px] text-gray-400">YOUR SCRIPT:</div>
                        <div className="text-xs text-cyan-300">1. {structure.hook}</div>
                        <div className="text-xs text-white">2. {structure.point}</div>
                        <div className="text-xs text-cyan-300">3. {structure.cta}</div>
                    </div>

                    <button 
                        onClick={handleStopEarly}
                        className="px-6 py-2 bg-red-500/20 border border-red-500 text-red-100 rounded hover:bg-red-500 hover:text-white transition-colors text-xs font-bold uppercase"
                    >
                        Mark Complete
                    </button>
                </div>
            )}
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

const OldTechChallengeGame = ({ config, onWin }: { config: GameConfig, onWin: () => void }) => {
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
        <div className="h-full w-full p-3 sm:p-6 flex flex-col items-center justify-center overflow-y-auto">
             {stage === 1 && (
                 <div className="w-full max-w-sm space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-2 sm:gap-3 text-white mb-2">
                          <Code className="text-blue-400 w-4 h-4 sm:w-6 sm:h-6" />
                          <span className="font-bold tracking-wider sm:tracking-widest text-[10px] sm:text-xs">STAGE 1: KNOWLEDGE CHECK</span>
                      </div>
                      <div className="bg-white/10 p-3 sm:p-4 rounded-lg border border-white/20 text-xs sm:text-sm mb-3 sm:mb-4 min-h-[60px] sm:min-h-[80px] flex items-center">
                          "{riddle.q}"
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                          {riddle.options.map((opt, i) => (
                              <button key={i} id={`opt-${i}`} onClick={() => handleRiddle(i)} 
                                  className="p-2 sm:p-3 rounded bg-white/5 hover:bg-white/20 text-left text-[10px] sm:text-xs transition-colors border border-transparent hover:border-blue-400">
                                  {String.fromCharCode(65+i)}. {opt}
                              </button>
                          ))}
                      </div>
                 </div>
             )}

             {stage === 2 && (
                 <div className="w-full flex flex-col gap-3 sm:gap-4 h-full animate-in fade-in zoom-in overflow-hidden">
                      {/* Phone Preview */}
                      <div className="flex-1 bg-gray-900 border-2 sm:border-4 border-gray-700 rounded-xl sm:rounded-2xl relative overflow-hidden flex flex-col py-3 sm:py-4 px-2 shadow-xl min-h-[120px] sm:min-h-[200px]">
                          <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-10 sm:w-16 h-2.5 sm:h-4 bg-black rounded-full" />
                          <div className="mt-3 sm:mt-4 flex flex-col gap-1.5 sm:gap-2">
                              <AnimatePresence>
                                  {builderItems.map((item, i) => (
                                      <motion.div key={i} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="w-full">
                                          {item === 'header' && <div className="h-7 sm:h-10 bg-blue-500/30 rounded flex items-center justify-center border border-blue-500/50 mb-1 text-[10px] sm:text-xs"><Users size={12} className="mr-1 sm:mr-2"/>Header</div>}
                                          {item === 'input' && <div className="h-6 sm:h-8 bg-white/10 rounded border border-white/20 mb-1 px-2 flex items-center text-[8px] sm:text-[10px] text-gray-500">Input...</div>}
                                          {item === 'button' && <div className="h-6 sm:h-8 bg-green-500 rounded flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-black mt-1 sm:mt-2">SUBMIT</div>}
                                          {item === 'video' && <div className="h-10 sm:h-16 bg-red-500/20 rounded border border-red-500/40 flex items-center justify-center mb-1"><Video size={16} /></div>}
                                      </motion.div>
                                  ))}
                              </AnimatePresence>
                              {builderItems.length === 0 && (
                                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                      <Smartphone size={24} className="mb-1 sm:mb-2"/>
                                      <div className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400">Mission:</div>
                                      <div className="text-[10px] sm:text-xs text-blue-400 font-bold">{challenge.name}</div>
                                  </div>
                              )}
                          </div>
                      </div>
                      
                      {/* Toolbox */}
                      <div className="w-full h-16 sm:h-20 bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-2 flex gap-1.5 sm:gap-2 overflow-x-auto shrink-0 scrollbar-hide">
                          <button onClick={() => handleBuild('header')} className="p-1.5 sm:p-2 bg-blue-500/20 rounded hover:bg-blue-500/40 transition flex flex-col items-center gap-0.5 sm:gap-1 group min-w-[40px] sm:min-w-[50px]">
                              <Layout size={14} className="group-hover:scale-110 transition-transform"/> <span className="text-[7px] sm:text-[9px]">Header</span>
                          </button>
                          <button onClick={() => handleBuild('input')} className="p-1.5 sm:p-2 bg-white/10 rounded hover:bg-white/20 transition flex flex-col items-center gap-0.5 sm:gap-1 group min-w-[40px] sm:min-w-[50px]">
                              <Zap size={14} className="group-hover:scale-110 transition-transform"/> <span className="text-[7px] sm:text-[9px]">Input</span>
                          </button>
                          <button onClick={() => handleBuild('video')} className="p-1.5 sm:p-2 bg-purple-500/20 rounded hover:bg-purple-500/40 transition flex flex-col items-center gap-0.5 sm:gap-1 group min-w-[40px] sm:min-w-[50px]">
                              <ImageIcon size={14} className="group-hover:scale-110 transition-transform"/> <span className="text-[7px] sm:text-[9px]">Media</span>
                          </button>
                          <button onClick={() => handleBuild('button')} className="p-1.5 sm:p-2 bg-green-500/20 rounded hover:bg-green-500/40 transition flex flex-col items-center gap-0.5 sm:gap-1 group min-w-[40px] sm:min-w-[50px]">
                              <Play size={14} className="group-hover:scale-110 transition-transform"/> <span className="text-[7px] sm:text-[9px]">Button</span>
                          </button>
                          
                          <div className="ml-auto px-1 flex flex-col justify-center">
                              <div className="text-[6px] sm:text-[8px] text-gray-500 text-center mb-0.5">REQ:</div>
                              <div className="flex flex-wrap justify-center gap-0.5 sm:gap-1">
                                  {challenge.required.map((r,i) => (
                                      <div key={i} className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${builderItems.includes(r) ? 'bg-green-500' : 'bg-red-500'}`} />
                                  ))}
                              </div>
                          </div>

                          <button onClick={() => setBuilderItems([])} className="p-1 bg-red-500/10 hover:bg-red-500/30 rounded text-[7px] sm:text-[9px] text-red-300 transition-colors min-w-[30px] sm:min-w-[40px]">RST</button>
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
        <div className="w-full h-full flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 overflow-hidden">
            {/* Top: Player & Questions */}
            <div className="w-full flex flex-row items-center gap-2 sm:gap-4 border-b border-white/10 pb-2 sm:pb-4 shrink-0">
                 
                 {/* Player Avatar */}
                 <div className="relative shrink-0">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-800 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden">
                         <Users size={20} className="text-gray-500" />
                     </div>
                     {/* The Card on Head */}
                     <motion.div 
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold shadow-lg rotate-3 whitespace-nowrap"
                    >
                         ?????
                     </motion.div>
                 </div>

                 <div className="flex-1 flex flex-col gap-1 max-h-[70px] sm:max-h-[90px] overflow-y-auto">
                     {questions.slice(0, 3).map(q => (
                         <button key={q.id} onClick={() => ask(q.id, q.text)}
                             disabled={isGuessing}
                             className="px-1.5 sm:px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[8px] sm:text-[9px] text-left transition-colors flex items-center gap-1 truncate">
                             <HelpCircle size={8} className="shrink-0 text-blue-400" />
                             <span className="truncate">{q.text}</span>
                         </button>
                     ))}
                 </div>

                 <button onClick={() => setIsGuessing(true)} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-500 text-white font-bold text-[8px] sm:text-[10px] rounded hover:bg-blue-400 transition-colors whitespace-nowrap shrink-0">
                     GUESS
                 </button>
            </div>

            {/* Bottom: Chat Log & Guessing */}
            <div className="flex-1 flex flex-col relative overflow-hidden min-h-[100px]">
                 {!isGuessing ? (
                     <div id="chat-log" className="flex-1 overflow-y-auto space-y-2 p-1">
                         <div className="text-[8px] sm:text-[10px] text-gray-500 text-center italic">Ask questions to find your role!</div>
                         {history.map((h, i) => (
                             <motion.div key={i} initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} className="flex flex-col gap-0.5">
                                  <div className="self-end bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-t-lg rounded-bl-lg text-[10px] sm:text-xs max-w-[90%]">
                                      {h.q}
                                  </div>
                                  <div className="self-start bg-gray-800 text-white px-2 py-0.5 rounded-t-lg rounded-br-lg text-[10px] sm:text-xs font-bold flex items-center gap-1">
                                      <MessageCircle size={8} className="text-green-500" />
                                      {h.a ? "YES." : "NO."}
                                  </div>
                             </motion.div>
                         ))}
                     </div>
                 ) : (
                     <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in slide-in-from-right overflow-y-auto">
                         <h3 className="text-white font-bold mb-2 sm:mb-4 text-xs sm:text-sm">SELECT YOUR ROLE</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-3 w-full">
                             {HR_ROLES.map(role => (
                                 <button key={role.id} id={`guess-${role.id}`} onClick={() => handleGuess(role.id)}
                                     className="p-2 sm:p-3 bg-gray-800 border border-white/20 hover:border-white hover:bg-gray-700 rounded transition-all text-[9px] sm:text-xs font-bold text-center flex flex-col items-center gap-1">
                                     <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center">
                                         {role.id === 'leader' && <Trophy size={10} className="text-yellow-400 sm:w-3.5 sm:h-3.5"/>}
                                         {role.id === 'mediator' && <Heart size={10} className="text-pink-400 sm:w-3.5 sm:h-3.5"/>}
                                         {role.id === 'analyst' && <Brain size={10} className="text-blue-400 sm:w-3.5 sm:h-3.5"/>}
                                         {role.id === 'innovator' && <Lightbulb size={10} className="text-white sm:w-3.5 sm:h-3.5"/>}
                                         {role.id === 'strategist' && <Target size={10} className="text-red-400 sm:w-3.5 sm:h-3.5"/>}
                                         {role.id === 'creative' && <Zap size={10} className="text-purple-400 sm:w-3.5 sm:h-3.5"/>}
                                     </div>
                                     <span className="truncate w-full">{role.label}</span>
                                 </button>
                             ))}
                         </div>
                         <button onClick={() => setIsGuessing(false)} className="mt-3 sm:mt-6 text-[10px] sm:text-xs text-gray-400 hover:text-white underline">
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
        <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="text-center mb-3 sm:mb-6">
                <div className="text-[8px] sm:text-[10px] font-bold text-yellow-500 uppercase tracking-wider sm:tracking-widest mb-1">CURRENT MISSION</div>
                <h3 className="text-base sm:text-xl font-bold text-white">{scenario.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-400">Drag items to correct order</p>
            </div>

            <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full max-w-[280px] sm:max-w-sm flex flex-col gap-1.5 sm:gap-2">
                {items.map((item) => (
                    <Reorder.Item key={item.id} value={item}
                        className={`p-2 sm:p-3 rounded bg-white/10 border cursor-grab active:cursor-grabbing flex items-center gap-2 sm:gap-3 backdrop-blur-sm
                            ${status === 'wrong' ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 hover:bg-white/20'}
                            ${status === 'correct' ? '!border-green-500 !bg-green-500/20' : ''}
                        `}
                    >
                         <div className="flex flex-col gap-0.5">
                             <div className="w-3 sm:w-4 h-0.5 bg-gray-500 rounded-full" />
                             <div className="w-3 sm:w-4 h-0.5 bg-gray-500 rounded-full" />
                             <div className="w-3 sm:w-4 h-0.5 bg-gray-500 rounded-full" />
                         </div>
                         <span className="text-xs sm:text-sm font-medium">{item.text}</span>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button onClick={checkOrder} className="mt-4 sm:mt-6 px-6 sm:px-8 py-1.5 sm:py-2 bg-yellow-500 text-black font-bold text-xs sm:text-sm rounded hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                VERIFY
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
        <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 text-center overflow-y-auto">
            {phase === 'spin' && (
                <>
                    <Megaphone className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 mb-2 sm:mb-4 animate-bounce" />
                    <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">PR CHALLENGE</h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-3 sm:mb-6">Spin to get your topic!</p>
                    <button onClick={spin} disabled={isSpinning}
                        className="px-4 sm:px-8 py-2 sm:py-3 bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(192,132,252,0.5)]">
                        {isSpinning ? "SPINNING..." : "GENERATE"}
                    </button>
                    <div className="mt-2 sm:mt-4 h-6 sm:h-8 text-xs sm:text-sm font-mono text-purple-200">
                        {isSpinning || topic ? topic : "..."}
                    </div>
                </>
            )}

            {phase === 'write' && (
                <div className="w-full max-w-[280px] sm:max-w-sm animate-in zoom-in duration-300">
                     <div className="text-[8px] sm:text-[10px] uppercase font-bold text-purple-400 mb-1 sm:mb-2">TOPIC:</div>
                     <div className="bg-purple-900/30 border border-purple-500/30 p-2 sm:p-3 rounded mb-2 sm:mb-4 text-xs sm:text-sm font-bold text-white">
                         "{topic}"
                     </div>
                     <div className="text-left mb-1 text-[8px] sm:text-[10px] text-gray-400">YOUR HEADLINE:</div>
                     <textarea 
                        value={headline} onChange={e => setHeadline(e.target.value)}
                        placeholder="Write a catchy headline..."
                        className="w-full bg-black/50 border border-white/20 rounded p-2 sm:p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 resize-none h-16 sm:h-24 mb-2 sm:mb-4"
                     />
                     <button onClick={publish} className="w-full py-1.5 sm:py-2 bg-white text-purple-900 font-bold text-xs sm:text-sm rounded hover:bg-purple-100 transition-colors">
                         PUBLISH NOW
                     </button>
                </div>
            )}

            {phase === 'result' && (
                <div className="w-full max-w-[280px] sm:max-w-sm animate-in slide-in-from-bottom duration-500">
                    <div className="bg-white text-black rounded-lg p-3 sm:p-4 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-xs">PR</div>
                            <div className="text-left">
                                <div className="font-bold text-[10px] sm:text-xs">Public Relations</div>
                                <div className="text-[8px] sm:text-[10px] text-gray-500">Just now • 🌎</div>
                            </div>
                        </div>
                        <div className="text-xs sm:text-sm font-medium mb-2 sm:mb-4 text-left">
                            {headline}
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between text-[10px] sm:text-xs font-bold text-gray-600">
                             <span className="flex items-center gap-1 text-pink-500"><Heart size={10} fill="currentColor"/> {stats.likes}</span>
                             <span className="flex items-center gap-1 text-blue-500"><RefreshCw size={10} /> {stats.shares}</span>
                        </div>
                    </div>
                    <button onClick={next} className="mt-3 sm:mt-6 text-[10px] sm:text-xs text-gray-400 hover:text-white underline">
                        Create Another
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
        <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 text-center overflow-y-auto">
            {step === 0 && (
                <div className="animate-in zoom-in">
                    <Coins className="w-8 h-8 sm:w-12 sm:h-12 text-green-400 mb-2 sm:mb-4 mx-auto animate-bounce" />
                    <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">PITCH IT FAST!</h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-4">Fund this project:</p>
                    <div className="bg-green-500/20 border border-green-500 text-green-300 font-bold p-2 sm:p-3 rounded mb-3 sm:mb-6 text-xs sm:text-sm">
                        {project}
                    </div>
                    <button onClick={() => setStep(1)} className="px-4 sm:px-6 py-1.5 sm:py-2 bg-green-500 text-black font-bold text-xs sm:text-sm rounded hover:scale-105 transition-transform">
                        START PITCH
                    </button>
                </div>
            )}

            {[1, 2, 3].includes(step) && (
                <div className="w-full max-w-[280px] sm:max-w-sm animate-in slide-in-from-right">
                    <div className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wider sm:tracking-widest mb-2 sm:mb-4">
                        STEP {step}/3: {step === 1 ? 'HOOK' : step === 2 ? 'SOLUTION' : 'ASK'}
                    </div>
                    <div className="grid gap-1.5 sm:gap-3">
                        {(step === 1 ? PITCH_OPTIONS.hooks : step === 2 ? PITCH_OPTIONS.solutions : PITCH_OPTIONS.asks).map((opt, i) => (
                            <button key={i} onClick={() => handleSelect(opt)}
                                className="p-2 sm:p-4 bg-white/10 hover:bg-green-500/20 border border-white/20 hover:border-green-500 rounded text-left transition-all group">
                                <span className="text-xs sm:text-sm font-bold group-hover:text-green-400">{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="w-full max-w-[280px] sm:max-w-sm animate-in zoom-in text-left bg-white text-black p-3 sm:p-6 rounded-lg shadow-2xl">
                    <div className="font-bold text-sm sm:text-lg mb-1 sm:mb-2 border-b border-black/10 pb-1 sm:pb-2">{project}</div>
                    <div className="space-y-2 sm:space-y-4 text-[10px] sm:text-sm mb-3 sm:mb-6">
                        <p><span className="font-bold text-green-600">Hook:</span> {selections[0]}</p>
                        <p><span className="font-bold text-green-600">Sol:</span> {selections[1]}</p>
                        <p><span className="font-bold text-green-600">Ask:</span> {selections[2]}</p>
                    </div>
                    <div className="text-center">
                         <div className="text-lg sm:text-2xl font-black text-green-600 mb-0.5 sm:mb-1">$5,000 RAISED!</div>
                         <div className="text-[8px] sm:text-[10px] text-gray-500 uppercase">Pitch Successful</div>
                    </div>
                    <button onClick={reset} className="mt-3 sm:mt-6 w-full py-1.5 sm:py-2 bg-black text-white font-bold text-xs sm:text-sm rounded hover:bg-gray-800">
                        NEXT PROJECT
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
        <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
             <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                 <Truck className="text-orange-400 w-5 h-5 sm:w-8 sm:h-8" />
                 <h3 className="text-sm sm:text-xl font-bold text-white uppercase">{config.title}</h3>
             </div>
             
             <div className="bg-orange-900/20 border border-orange-500/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded mb-2 sm:mb-4 text-center">
                 <div className="text-[8px] sm:text-[10px] text-orange-300 uppercase font-bold text-center">MISSION:</div>
                 <div className="text-xs sm:text-sm font-bold text-white">{scenario.name}</div>
             </div>
             
             <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full max-w-[260px] sm:max-w-sm flex flex-col gap-1.5 sm:gap-2 overflow-y-auto max-h-[150px] sm:max-h-[250px] pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-orange-500/20">
                {items.map((item) => (
                    <Reorder.Item key={item.id} value={item}
                        className={`p-2 sm:p-3 rounded bg-white/5 border cursor-grab active:cursor-grabbing flex items-center gap-2 sm:gap-3 backdrop-blur-sm transition-colors
                            ${status === 'wrong' ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 hover:bg-white/10'}
                            ${status === 'correct' ? '!border-green-500 !bg-green-500/20' : ''}
                        `}
                    >
                         <div className="flex flex-col gap-0.5 shrink-0 px-0.5 sm:px-1">
                             <div className="w-2 sm:w-3 h-0.5 bg-gray-500 rounded-full" />
                             <div className="w-2 sm:w-3 h-0.5 bg-gray-500 rounded-full" />
                             <div className="w-2 sm:w-3 h-0.5 bg-gray-500 rounded-full" />
                         </div>
                         <span className="text-[10px] sm:text-sm font-medium text-gray-200">{item.text}</span>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button onClick={checkOrder} className="mt-3 sm:mt-4 px-5 sm:px-8 py-1.5 sm:py-2 bg-orange-500 text-black font-bold text-xs sm:text-sm rounded hover:scale-105 transition-transform">
                VERIFY
            </button>
        </div>
    )
}

// --- ORGANIZATION: FIX THE CHAOS GAME ---

function FixTheChaosGame({ config, onWin }: { config: GameConfig, onWin: () => void }) {
    const [scenario, setScenario] = useState<any>(null);
    const [solution, setSolution] = useState({ roles: '', timeline: '', tasks: '' });
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [status, setStatus] = useState<'playing' | 'submitted'>('playing');

    // Randomized scenarios
    const scenarios = [
        {
            type: "Event Planning",
            chaos: [
                "Team retreat next Friday - NO venue booked",
                "5 team members - roles NOT defined",
                "Budget $500 - NO breakdown",
                "Food, transport, activities - ALL pending"
            ],
            example: {
                roles: "Alex: Book venue, Sarah: Handle budget, Mike: Arrange transport",
                timeline: "Mon-Tue: Venue search, Wed: Book & confirm, Thu: Finalize details",
                tasks: "1. Find venues today, 2. Get budget approval, 3. Book by Wednesday"
            }
        },
        {
            type: "Campaign Launch",
            chaos: [
                "Campaign launches Monday - content NOT ready",
                "Designer needs it Friday - writer busy till Saturday",
                "Manager on leave till Sunday",
                "NO approval process defined"
            ],
            example: {
                roles: "Lisa: Graphics, Tom: Backup approver, Jen: Final review on Sunday",
                timeline: "Fri PM: Design, Sat: Writing, Sun: Review & approval",
                tasks: "1. Assign backup approver NOW, 2. Set Friday deadline, 3. Sunday review"
            }
        },
        {
            type: "Meeting Setup",
            chaos: [
                "10 people meeting - NO agenda",
                "Half team: Mon-Wed only",
                "Other half: Thu-Fri only",
                "3 urgent topics - NO time limits"
            ],
            example: {
                roles: "Group A Mon-Wed, Group B Thu-Fri, Sam runs both meetings",
                timeline: "Mon: Group A meeting, Thu: Group B meeting, Fri: Summary",
                tasks: "1. Split into 2 meetings, 2. Set 20min per topic, 3. Book rooms TODAY"
            }
        }
    ];

    useEffect(() => {
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        setScenario(randomScenario);
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && status === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, status]);

    const handleSubmit = () => {
        if (solution.roles && solution.timeline && solution.tasks) {
            setStatus('submitted');
            setTimeout(onWin, 1500);
        }
    };

    if (!scenario) return <div className="text-white p-4">Loading scenario...</div>;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (status === 'submitted') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-teal-400 mb-4 animate-bounce" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">CHAOS ORGANIZED!</h3>
                <p className="text-sm sm:text-base text-gray-400">
                    Excellent work! You've structured the scenario like a pro.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-y-auto bg-black/20">
            {/* Header with Timer */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-teal-500/30">
                <div className="flex items-center gap-2">
                    <Calendar className="text-teal-400 w-6 h-6 sm:w-7 sm:h-7" />
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">FIX THE CHAOS</h3>
                        <p className="text-xs text-gray-400">Organize the situation!</p>
                    </div>
                </div>
                <div className={`px-3 sm:px-4 py-2 rounded-lg font-pixel text-sm sm:text-base font-bold ${
                    timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-500 text-black'
                }`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Scenario Card */}
            <div className="bg-gradient-to-r from-teal-500/20 to-teal-500/5 border-2 border-teal-500/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-teal-300 font-bold mb-2">📋 SCENARIO:</div>
                <div className="text-lg sm:text-xl font-bold text-white mb-3">{scenario.type}</div>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded p-2 sm:p-3">
                    <div className="text-xs font-bold text-red-400 mb-2">⚠️ PROBLEMS:</div>
                    <ul className="space-y-1.5">
                        {scenario.chaos.map((item: string, i: number) => (
                            <li key={i} className="text-xs sm:text-sm text-white flex items-start gap-2">
                                <span className="text-red-500 font-bold shrink-0">×</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-3 mb-3">
                <div className="text-xs sm:text-sm font-bold text-yellow-400 mb-2">✏️ YOUR TASK:</div>
                <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                    <p>Fill in ALL THREE fields below to organize this chaos:</p>
                    <p className="text-teal-400">1️⃣ Who does what? 2️⃣ When does it happen? 3️⃣ What's most important?</p>
                </div>
            </div>

            {/* Solution Fields */}
            <div className="space-y-3 sm:space-y-4 flex-1">
                {/* Field 1 */}
                <div className="bg-white/5 border-2 border-white/20 rounded-lg p-3 hover:border-teal-500/50 transition-all">
                    <label className="block text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span className="bg-teal-500 text-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        Assign Roles - Who does what?
                    </label>
                    <textarea
                        value={solution.roles}
                        onChange={(e) => setSolution({ ...solution, roles: e.target.value })}
                        placeholder={`Example: ${scenario.example.roles}`}
                        className="w-full bg-black/60 border border-white/30 rounded px-3 py-2 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none h-16 sm:h-20"
                    />
                </div>

                {/* Field 2 */}
                <div className="bg-white/5 border-2 border-white/20 rounded-lg p-3 hover:border-teal-500/50 transition-all">
                    <label className="block text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span className="bg-teal-500 text-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        Create Timeline - When does each step happen?
                    </label>
                    <textarea
                        value={solution.timeline}
                        onChange={(e) => setSolution({ ...solution, timeline: e.target.value })}
                        placeholder={`Example: ${scenario.example.timeline}`}
                        className="w-full bg-black/60 border border-white/30 rounded px-3 py-2 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none h-16 sm:h-20"
                    />
                </div>

                {/* Field 3 */}
                <div className="bg-white/5 border-2 border-white/20 rounded-lg p-3 hover:border-teal-500/50 transition-all">
                    <label className="block text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span className="bg-teal-500 text-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        Priority Tasks - What needs to happen first?
                    </label>
                    <textarea
                        value={solution.tasks}
                        onChange={(e) => setSolution({ ...solution, tasks: e.target.value })}
                        placeholder={`Example: ${scenario.example.tasks}`}
                        className="w-full bg-black/60 border border-white/30 rounded px-3 py-2 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none h-16 sm:h-20"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!solution.roles || !solution.timeline || !solution.tasks}
                className={`mt-4 w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all ${
                    solution.roles && solution.timeline && solution.tasks
                        ? 'bg-teal-500 hover:bg-teal-400 text-black hover:scale-105 shadow-lg shadow-teal-500/50'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
                {solution.roles && solution.timeline && solution.tasks ? '✓ SUBMIT SOLUTION' : '⚠️ FILL ALL 3 FIELDS'}
            </button>
        </div>
    );
}

// --- MARKETING: SELL IT WITHOUT SAYING IT GAME ---

function SellItGame({ config, onWin }: { config: GameConfig, onWin: () => void }) {
    const [challenge, setChallenge] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(150); // 2.5 minutes
    const [status, setStatus] = useState<'playing' | 'submitted'>('playing');

    // Randomized challenges
    const products = [
        "Student networking event",
        "Mobile productivity app",
        "Social cause campaign",
        "Community workshop series",
        "Eco-friendly product line",
        "Online learning platform",
        "Volunteer program",
        "Campus initiative"
    ];

    const audiences = [
        "University students",
        "Young professionals",
        "Parents with children",
        "Small business owners",
        "NGO leaders",
        "High school students",
        "Social entrepreneurs",
        "Tech enthusiasts"
    ];

    const constraints = [
        { rule: "NO ADJECTIVES", desc: "Don't use describing words", example: "Join us → Learn. Connect. Grow." },
        { rule: "QUESTION ONLY", desc: "Must be a question", example: "What if learning was fun?" },
        { rule: "MAX 5 WORDS", desc: "Only 5 words total", example: "Events that change everything" },
        {rule: "USE EMOJIS", desc: "Include emojis in message", example: "📚 Your future starts here 🚀" },
        { rule: "NO VERBS", desc: "No action words", example: "Tomorrow. Together. Transformation." },
        { rule: "STORY FORMAT", desc: "Tell a mini story", example: "You're busy. We get it. Quick solutions." }
    ];

    useEffect(() => {
        const product = products[Math.floor(Math.random() * products.length)];
        const audience = audiences[Math.floor(Math.random() * audiences.length)];
        const constraint = constraints[Math.floor(Math.random() * constraints.length)];
        
        setChallenge({ product, audience, constraint });
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && status === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, status]);

    const handleSubmit = () => {
        if (message.trim()) {
            setStatus('submitted');
            setTimeout(onWin, 1500);
        }
    };

    if (!challenge) return <div className="text-white p-4">Loading challenge...</div>;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (status === 'submitted') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <Lightbulb className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400 mb-4 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">CREATIVE GENIUS!</h3>
                <p className="text-sm sm:text-base text-gray-400 max-w-md">
                    Your marketing message: <span className="text-pink-400 font-semibold">"{message}"</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">Great creativity within constraints!</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-y-auto bg-gradient-to-b from-black/20 to-pink-500/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-pink-500/30">
                <div className="flex items-center gap-2">
                    <Lightbulb className="text-pink-400 w-6 h-6 sm:w-7 sm:h-7" />
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">SELL WITHOUT SAYING</h3>
                        <p className="text-xs text-gray-400">Be creative with constraints!</p>
                    </div>
                </div>
                <div className={`px-3 sm:px-4 py-2 rounded-lg font-pixel text-sm sm:text-base font-bold ${
                    timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-pink-500 text-black'
                }`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Challenge Card */}
            <div className="bg-gradient-to-r from-pink-500/20 to-pink-500/5 border-2 border-pink-500/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-pink-300 font-bold mb-3">🎯 YOUR CHALLENGE:</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="bg-black/40 border border-white/20 rounded p-2 sm:p-3">
                        <div className="text-[10px] text-gray-400 mb-1">PRODUCT/SERVICE</div>
                        <div className="text-sm sm:text-base font-bold text-white">{challenge.product}</div>
                    </div>
                    <div className="bg-black/40 border border-white/20 rounded p-2 sm:p-3">
                        <div className="text-[10px] text-gray-400 mb-1">TARGET AUDIENCE</div>
                        <div className="text-sm sm:text-base font-bold text-white">{challenge.audience}</div>
                    </div>
                </div>

                <div className="bg-pink-500/20 border-2 border-pink-500/50 rounded-lg p-2 sm:p-3">
                    <div className="text-xs font-bold text-pink-400 mb-2">⚡ CONSTRAINT:</div>
                    <div className="text-sm sm:text-base font-bold text-white mb-1">{challenge.constraint.rule}</div>
                    <div className="text-xs text-gray-300">{challenge.constraint.desc}</div>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-3 mb-3">
                <div className="text-xs sm:text-sm font-bold text-yellow-400 mb-2">✏️ YOUR TASK:</div>
                <div className="text-xs sm:text-sm text-gray-300">
                    <p className="mb-1">Create a marketing message that:</p>
                    <ul className="space-y-0.5 ml-4">
                        <li>• Fits the <span className="text-pink-400 font-semibold">{challenge.constraint.rule}</span></li>
                        <li>• Appeals to <span className="text-white font-semibold">{challenge.audience}</span></li>
                        <li>• Promotes <span className="text-white font-semibold">{challenge.product}</span></li>
                    </ul>
                </div>
            </div>

            {/* Example */}
            <div className="bg-pink-500/10 border border-pink-500/30 rounded p-2 mb-3">
                <div className="text-[10px] text-pink-400 font-bold mb-1">💡 EXAMPLE:</div>
                <div className="text-xs text-gray-300 italic">"{challenge.constraint.example}"</div>
            </div>

            {/* Message Input */}
            <div className="flex-1 mb-3">
                <label className="block text-xs sm:text-sm font-bold text-white mb-2">
                    📝 YOUR MARKETING MESSAGE:
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your creative marketing message here..."
                    className="w-full bg-black/60 border-2 border-white/30 focus:border-pink-500 rounded-lg px-3 py-3 text-sm sm:text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none h-24 sm:h-32"
                />
                <div className="text-xs text-gray-400 mt-1">
                    Characters: {message.length} | Words: {message.trim().split(/\s+/).filter(w => w).length}
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className={`w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all ${
                    message.trim()
                        ? 'bg-pink-500 hover:bg-pink-400 text-black hover:scale-105 shadow-lg shadow-pink-500/50'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
                {message.trim() ? '✓ SUBMIT MESSAGE' : '⚠️ WRITE YOUR MESSAGE'}
            </button>
        </div>
    );
}

// --- MULTI-MEDIA: SPOT THE VISUAL GAME ---

function SpotTheVisualGame({ config, onWin }: { config: GameConfig, onWin: () => void }) {
    const [visual, setVisual] = useState<any>(null);
    const [answers, setAnswers] = useState({ message: '', audience: '', attention: '' });
    const [timeLeft, setTimeLeft] = useState(120); // 1-2 minutes target, giving 2 mins safe
    const [status, setStatus] = useState<'playing' | 'submitted'>('playing');

    // Randomized visual scenarios (Simulated)
    const visuals = [
        {
            type: "Social Media Ad",
            desc: "A bright orange background. Bold, centered white text: 'SUMMER SALE 50% OFF'. A photo of a laughing student holding a laptop in the bottom right corner.",
            context: "Posted on Instagram"
        },
        {
            type: "Event Poster",
            desc: "Dark blue 'starry night' theme. Large gold serif title: 'GALA NIGHT 2026'. Date (Dec 15) and time in small white text at bottom. A golden ticket icon floats in the center.",
            context: "Campus Notice Board"
        },
        {
            type: "Website Banner",
            desc: "Split screen layout. Left side: Close-up photo of hands planting a tree sapling. Right side: Solid green background with white sans-serif text 'JOIN THE MOVEMENT'. A pill-shaped button says 'Sign Up'.",
            context: "NGO Homepage"
        },
        {
            type: "Instagram Story",
            desc: "Vertical layout. Full screen photo of a messy desk with coffee cups. Text overlay in neon pink brush font: 'FROM CHAOS TO CALM'. A 'Swipe Up' arrow animation at the bottom.",
            context: "Productivity App Promo"
        },
        {
            type: "Product Flyer",
            desc: "Clean minimal white background. A sleek matte black reusable water bottle stands in the center. A dynamic blue water splash effect is behind it. Text: 'STAY HYDRATED' in bold blue condensed font at top.",
            context: "Eco-Store Handout"
        }
    ];

    useEffect(() => {
        setVisual(visuals[Math.floor(Math.random() * visuals.length)]);
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && status === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, status]);

    const handleSubmit = () => {
        if (answers.message && answers.audience && answers.attention) {
            setStatus('submitted');
            setTimeout(onWin, 1500);
        }
    };

    if (!visual) return <div className="text-white p-4">Loading visual...</div>;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (status === 'submitted') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <Eye className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-400 mb-4 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">SHARP EYE!</h3>
                <p className="text-sm sm:text-base text-gray-400 max-w-md">
                    You've analyzed the visual elements correctly. Great observation skills!
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-y-auto bg-gradient-to-b from-black/20 to-indigo-500/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-indigo-500/30">
                <div className="flex items-center gap-2">
                    <Eye className="text-indigo-400 w-6 h-6 sm:w-7 sm:h-7" />
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">SPOT THE VISUAL</h3>
                        <p className="text-xs text-gray-400">Visual awareness challenge</p>
                    </div>
                </div>
                <div className={`px-3 sm:px-4 py-2 rounded-lg font-pixel text-sm sm:text-base font-bold ${
                    timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-500 text-white'
                }`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Visual Example Card */}
            <div className="bg-white/5 border-2 border-white/10 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 relative overflow-hidden group">
                <div className="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {visual.type}
                </div>
                <div className="text-xs text-indigo-300 font-bold mb-2 uppercase tracking-widest">IMAGINE THIS IMAGE:</div>
                <p className="text-sm sm:text-base text-white font-medium italic leading-relaxed">
                    "{visual.desc}"
                </p>
                <div className="mt-3 text-xs text-gray-500">Context: {visual.context}</div>
            </div>

            {/* Analysis Questions */}
            <div className="space-y-3 flex-1">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-indigo-300">1. WHAT IS THE MAIN MESSAGE?</label>
                    <input
                        type="text"
                        value={answers.message}
                        onChange={(e) => setAnswers({ ...answers, message: e.target.value })}
                        placeholder="e.g. Buy now, Join us, Celebration..."
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                
                <div className="space-y-1">
                    <label className="text-xs font-bold text-indigo-300">2. WHO IS THE TARGET AUDIENCE?</label>
                    <input
                        type="text"
                        value={answers.audience}
                        onChange={(e) => setAnswers({ ...answers, audience: e.target.value })}
                        placeholder="e.g. Students, Donors, Parents..."
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-indigo-300">3. WHAT GRABS ATTENTION FIRST?</label>
                    <input
                        type="text"
                        value={answers.attention}
                        onChange={(e) => setAnswers({ ...answers, attention: e.target.value })}
                        placeholder="e.g. The red text, the photo, the button..."
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!answers.message || !answers.audience || !answers.attention}
                className={`w-full mt-4 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all ${
                    answers.message && answers.audience && answers.attention
                        ? 'bg-indigo-500 hover:bg-indigo-400 text-white hover:scale-105 shadow-lg shadow-indigo-500/50'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
                {answers.message && answers.audience && answers.attention ? '✓ SUBMIT ANALYSIS' : '⚠️ ANSWER ALL 3 QUESTIONS'}
            </button>
        </div>
    );
}

// --- GAME ENGINE 6B: THINK LIKE A SYSTEM (IT Logic Game) ---

function TechChallengeGame({ config, onWin }: { config: GameConfig, onWin: () => void }) {
    const [system, setSystem] = useState<any>(null);
    const [analysis, setAnalysis] = useState({ inputs: '', process: '', outputs: '', errors: '' });
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [status, setStatus] = useState<'playing' | 'submitted'>('playing');

    // Randomized system scenarios
    const systems = [
        {
            name: "Food Delivery App",
            desc: "A mobile app connecting hungry users, restaurants, and drivers.",
            example: {
                inputs: "User location, restaurant menu, order details, payment info",
                process: "Match driver, calculate ETA, process payment, notify restaurant",
                outputs: "Order confirmation, driver route, receipt, food delivery",
                errors: "Payment failed, no drivers available, restaurant closed"
            }
        },
        {
            name: "Library Checkout System",
            desc: "Digital kiosk for borrowing and returning books.",
            example: {
                inputs: "User ID card, book barcode, touchscreen selection",
                process: "Validate user status, check book availability, update database",
                outputs: "Due date receipt, updated account, door unlock",
                errors: "Book already checked out, user has fines, barcode unreadable"
            }
        },
        {
            name: "Smart Traffic Light",
            desc: "Intersection control system with vehicle sensors.",
            example: {
                inputs: "Vehicle presence sensors, pedestrian buttons, timer",
                process: "Analyze traffic flow, prioritize emergency vehicles, cycle lights",
                outputs: "Red/Yellow/Green lights, pedestrian walk signal",
                errors: "Sensor malfunction, power outage, conflicting signals"
            }
        },
        {
            name: "ATM Machine",
            desc: "Self-service banking terminal.",
            example: {
                inputs: "Card insertion, PIN entry, withdrawal amount",
                process: "Verify PIN, check balance, dispense cash, update ledger",
                outputs: "Cash, printed receipt, card return",
                errors: "Insufficient funds, wrong PIN, hardware jam"
            }
        },
        {
            name: "Online Course Platform",
            desc: "Website for students to watch videos and take quizzes.",
            example: {
                inputs: "Login credentials, video selection, quiz answers",
                process: "Authenticate user, stream content, grade quiz",
                outputs: "Video playback, quiz score, certificate",
                errors: "Server offline, invalid login, video buffering"
            }
        }
    ];

    useEffect(() => {
        const randomSystem = systems[Math.floor(Math.random() * systems.length)];
        setSystem(randomSystem);
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && status === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, status]);

    const handleSubmit = () => {
        if (analysis.inputs && analysis.process && analysis.outputs && analysis.errors) {
            setStatus('submitted');
            setTimeout(onWin, 1500);
        }
    };

    if (!system) return <div className="text-white p-4">Loading system...</div>;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (status === 'submitted') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <Code className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400 mb-4 animate-bounce" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">SYSTEM ANALYZED!</h3>
                <p className="text-sm sm:text-base text-gray-400 max-w-md">
                    Excellent logic! You've broken down the system components perfectly.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-y-auto bg-gradient-to-b from-black/20 to-blue-500/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-blue-500/30">
                <div className="flex items-center gap-2">
                    <Code className="text-blue-400 w-6 h-6 sm:w-7 sm:h-7" />
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">THINK LIKE A SYSTEM</h3>
                        <p className="text-xs text-gray-400">Analyze the logic!</p>
                    </div>
                </div>
                <div className={`px-3 sm:px-4 py-2 rounded-lg font-pixel text-sm sm:text-base font-bold ${
                    timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500 text-white'
                }`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>

            {/* System Scenario */}
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 border-2 border-blue-500/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-blue-300 font-bold mb-1">🖥️ SYSTEM TO ANALYZE:</div>
                <div className="text-lg sm:text-xl font-bold text-white mb-1">{system.name}</div>
                <div className="text-xs sm:text-sm text-gray-300">{system.desc}</div>
            </div>

            {/* Analysis Inputs */}
            <div className="space-y-3 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* INPUTS */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"/> INPUTS (Data In)
                        </label>
                        <textarea
                            value={analysis.inputs}
                            onChange={(e) => setAnalysis({ ...analysis, inputs: e.target.value })}
                            placeholder={`e.g. ${system.example.inputs}`}
                            className="w-full bg-black/40 border border-white/20 rounded p-2 text-xs text-white focus:border-blue-500 focus:outline-none resize-none h-20"
                        />
                    </div>
                    
                    {/* PROCESS */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"/> PROCESSES (The Logic)
                        </label>
                        <textarea
                            value={analysis.process}
                            onChange={(e) => setAnalysis({ ...analysis, process: e.target.value })}
                            placeholder={`e.g. ${system.example.process}`}
                            className="w-full bg-black/40 border border-white/20 rounded p-2 text-xs text-white focus:border-blue-500 focus:outline-none resize-none h-20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* OUTPUTS */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-blue-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"/> OUTPUTS (Data Out)
                        </label>
                        <textarea
                            value={analysis.outputs}
                            onChange={(e) => setAnalysis({ ...analysis, outputs: e.target.value })}
                            placeholder={`e.g. ${system.example.outputs}`}
                            className="w-full bg-black/40 border border-white/20 rounded p-2 text-xs text-white focus:border-blue-500 focus:outline-none resize-none h-20"
                        />
                    </div>
                    
                    {/* ERRORS */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-red-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"/> EDGE CASES (What can break?)
                        </label>
                        <textarea
                            value={analysis.errors}
                            onChange={(e) => setAnalysis({ ...analysis, errors: e.target.value })}
                            placeholder={`e.g. ${system.example.errors}`}
                            className="w-full bg-black/40 border border-white/20 rounded p-2 text-xs text-white focus:border-blue-500 focus:outline-none resize-none h-20"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!analysis.inputs || !analysis.process || !analysis.outputs || !analysis.errors}
                className={`w-full mt-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    analysis.inputs && analysis.process && analysis.outputs && analysis.errors
                        ? 'bg-blue-500 hover:bg-blue-400 text-white hover:scale-105 shadow-lg shadow-blue-500/50'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
                {analysis.inputs && analysis.process && analysis.outputs && analysis.errors ? '✓ SUBMIT ANALYSIS' : '⚠️ FILL ALL 4 SECTIONS'}
            </button>
        </div>
    );
}

// --- MAIN WRAPPER ---

export default function DepartmentMiniGame({ deptId, description }: { deptId: string, description: string }) {
  const [screen, setScreen] = useState<"intro" | "game" | "win">("intro");
  const config = DEPT_CONFIG[deptId as keyof typeof DEPT_CONFIG] || DEPT_CONFIG.it;
  
  return (
    <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[350px] bg-black rounded-lg sm:rounded-xl border border-white/10 overflow-hidden relative shadow-2xl font-sans group select-none">
       
       <div className="absolute inset-0 z-40 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1)_0px,transparent_1px,transparent_2px)] opacity-30" />
       
       {screen === 'intro' && (
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-4 sm:p-6 text-center">
               <motion.div initial={{scale:0.8}} animate={{scale:1}} className={`p-2.5 sm:p-4 rounded-full mb-3 sm:mb-4`} style={{ backgroundColor: config.hex + '20' }}>
                   <config.icon className="w-7 h-7 sm:w-10 sm:h-10" style={{ color: config.hex }} />
               </motion.div>
               <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wider mb-1 sm:mb-2">{config.title}</h2>
               <p className="text-gray-400 text-[10px] sm:text-xs mb-4 sm:mb-6">{config.desc}</p>
               <button onClick={() => setScreen('game')} 
                   className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-black font-bold text-[10px] sm:text-xs tracking-widest hover:scale-105 transition-transform">
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
                {config.type === 'org_chaos' && <FixTheChaosGame config={config} onWin={() => setScreen('win')} />}
                {config.type === 'mkt_sellgame' && <SellItGame config={config} onWin={() => setScreen('win')} />}
                {config.type === 'mm_visual' && <SpotTheVisualGame config={config} onWin={() => setScreen('win')} />}
                {config.type === 'pres_pitch' && <OneMinutePitchGame config={config} onWin={() => setScreen('win')} />}
                
               <button onClick={() => setScreen('intro')} className="absolute top-2 left-2 text-[10px] text-gray-500 hover:text-white z-50">ABORT</button>
           </div>
       )}
       
       {screen === 'win' && (
           <div className="absolute inset-0 z-30 bg-black flex flex-col p-3 sm:p-6 animate-in slide-in-from-bottom duration-500">
               <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6 border-b border-white/10 pb-2 sm:pb-4">
                   <ShieldCheck className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" />
                   <div>
                       <div className="text-green-500 font-bold text-xs sm:text-sm tracking-wider sm:tracking-widest">ACCESS GRANTED</div>
                       <div className="text-gray-600 text-[8px] sm:text-[10px]">Security Clearance: Lv. 5</div>
                   </div>
               </div>
                <div className="flex-1 overflow-y-auto text-gray-300 text-xs sm:text-sm leading-relaxed font-light italic flex items-center">
                    <div className="w-0.5 sm:w-1 h-full bg-white/20 mr-2 sm:mr-4 shrink-0" />
                    <div>
                        <Typewriter text={config.quote} />
                    </div>
                </div>
               <button onClick={() => setScreen('intro')} className="mt-2 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 hover:text-white transition-colors">
                   <RefreshCw size={10} className="sm:w-3 sm:h-3" /> RESTART
               </button>
           </div>
       )}
    </div>
  )
}
