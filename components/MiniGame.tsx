"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const requestRef = useRef<number>(0);
  
  // Game Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -10;
  const SPEED = 5;
  const SPAWN_RATE = 100; // Frames
  const WIN_SCORE = 2; // Score needed to win

  // Game State Refs (for loop)
  const gameState = useRef({
    playerY: 200,
    velocity: 0,
    isJumping: false,
    obstacles: [] as { x: number; h: number; w: number }[],
    frame: 0,
    score: 0
  });

  const jump = () => {
    if ((!gameState.current.isJumping && isPlaying && !gameOver && !gameWon)) {
      gameState.current.velocity = JUMP_FORCE;
      gameState.current.isJumping = true;
    } else if (gameOver || gameWon) {
       resetGame();
    }
  };

  const resetGame = () => {
    gameState.current = {
        playerY: 200,
        velocity: 0,
        isJumping: false,
        obstacles: [],
        frame: 0,
        score: 0
    };
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
  };

  const update = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!isPlaying || gameOver || gameWon) {
        // Just render static if not playing
        if (gameOver || gameWon) render(ctx);
        return;
    }

    // Win Condition
    if (gameState.current.score >= WIN_SCORE) {
        setGameWon(true);
        setIsPlaying(false);
        if (gameState.current.score > highScore) {
            setHighScore(gameState.current.score);
        }
        return;
    }

    // Update Player
    gameState.current.velocity += GRAVITY;
    gameState.current.playerY += gameState.current.velocity;

    // Ground Collision
    if (gameState.current.playerY > canvas.height - 60) {
        gameState.current.playerY = canvas.height - 60;
        gameState.current.velocity = 0;
        gameState.current.isJumping = false;
    }

    // Spawn Obstacles
    gameState.current.frame++;
    if (gameState.current.frame % SPAWN_RATE === 0) {
        // Random height variation
        const height = Math.random() > 0.5 ? 40 : 60;
        gameState.current.obstacles.push({ x: canvas.width, h: height, w: 20 });
    }

    // Update Obstacles
    gameState.current.obstacles.forEach(obs => {
        obs.x -= SPEED;
    });

    // Remove off-screen obstacles
    if (gameState.current.obstacles.length > 0 && gameState.current.obstacles[0].x < -20) {
        gameState.current.obstacles.shift();
        gameState.current.score++;
        setScore(gameState.current.score);
    }

    // Collision Detection
    const playerRect = { x: 50, y: gameState.current.playerY, w: 30, h: 50 };
    
    gameState.current.obstacles.forEach(obs => {
        const obsRect = { x: obs.x, y: canvas.height - obs.h, w: obs.w, h: obs.h };
        
        if (
            playerRect.x < obsRect.x + obsRect.w &&
            playerRect.x + playerRect.w > obsRect.x &&
            playerRect.y < obsRect.y + obsRect.h &&
            playerRect.y + playerRect.h > obsRect.y
        ) {
            setGameOver(true);
            setIsPlaying(false);
            if (gameState.current.score > highScore) {
                setHighScore(gameState.current.score);
            }
        }
    });

    render(ctx);
    requestRef.current = requestAnimationFrame(update);
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Clear
    ctx.fillStyle = "#090040"; // Game Dark
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Floor
    ctx.fillStyle = "#471396";
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

    // Player (Stickman)
    const px = 50;
    const py = gameState.current.playerY;
    const pw = 30;
    
    ctx.strokeStyle = "#B13BFF";
    ctx.fillStyle = "#B13BFF";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.shadowColor = "#B13BFF";
    ctx.shadowBlur = 5;

    // Animation factor
    const anim = gameState.current.isJumping ? 0 : Math.sin(gameState.current.frame * 0.3) * 5;

    // Head
    ctx.beginPath();
    ctx.arc(px + pw/2, py + 8, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.beginPath();
    ctx.moveTo(px + pw/2, py + 16);
    ctx.lineTo(px + pw/2, py + 35);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(px + pw/2, py + 18);
    ctx.lineTo(px + pw/2 - 12 - anim, py + 28); // Left Arm
    ctx.moveTo(px + pw/2, py + 18);
    ctx.lineTo(px + pw/2 + 12 + anim, py + 28); // Right Arm
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(px + pw/2, py + 35);
    ctx.lineTo(px + pw/2 - 10 + anim, py + 50); // Left Leg
    ctx.moveTo(px + pw/2, py + 35);
    ctx.lineTo(px + pw/2 + 10 - anim, py + 50); // Right Leg
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Obstacles (Yellow Spikes height)
    ctx.fillStyle = "#FFBF10";
    gameState.current.obstacles.forEach(obs => {
        ctx.fillRect(obs.x, canvas.height - obs.h, obs.w, obs.h);
    });
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  });

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" || e.code === "ArrowUp") {
            e.preventDefault(); // Prevent scrolling
            jump();
        }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, gameWon]);

  return (
    <section id="game" className="py-24 bg-transparent relative z-10 flex flex-col items-center">
        <div className="container mx-auto px-4 text-center mb-8">
             <h2 className="text-3xl md:text-4xl font-pixel text-white mb-4">
                <span className="text-game-accent">PIXEL</span> RUNNER
            </h2>
            <p className="font-body text-gray-400">Reach a score of {WIN_SCORE} to Join the Team!</p>
        </div>

        <div className="relative flex flex-col items-center w-full max-w-2xl">
            <canvas 
                ref={canvasRef} 
                width={600} 
                height={300} 
                className="border-4 border-game-primary bg-game-dark w-full rounded-lg shadow-[0_0_20px_#B13BFF] cursor-pointer"
                onClick={jump}
            />
            
            {/* Score Overlay */}
            <div className="absolute top-4 right-4 font-pixel text-white text-2xl drop-shadow-md">
                {score} / {WIN_SCORE}
            </div>

            {(!isPlaying && !gameOver && !gameWon) && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                    <Button onClick={resetGame} className="font-pixel text-xl px-8 py-6 bg-game-primary hover:bg-game-accent hover:scale-105 transition-all text-white border-b-4 border-game-purple active:border-b-0 active:translate-y-1">
                        START GAME
                    </Button>
                 </div>
            )}

            {/* LOSS SCREEN */}
            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-6 rounded-lg p-6 text-center">
                    <h3 className="font-pixel text-red-500 text-3xl mb-2">GAME OVER</h3>
                    <p className="font-body text-white text-lg mb-4">You hit a glitch!</p>
                    <p className="font-pixel text-game-accent text-sm mb-2">Score: {score}</p>
                    <Button onClick={resetGame} className="font-pixel bg-transparent border-2 border-white hover:bg-white hover:text-game-dark">
                        TRY AGAIN
                    </Button>
                </div>
            )}

            {/* WIN SCREEN */}
            {gameWon && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-6 rounded-lg p-6 text-center">
                    <h3 className="font-pixel text-game-accent text-3xl mb-2">MISSION ACCOMPLISHED</h3>
                    <p className="font-body text-white text-lg max-w-sm mb-4 leading-relaxed">
                        Congratulations! If you want to playing in real life, <br/>
                        <span className="text-game-primary font-bold">Join to Our Family</span>
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={resetGame} className="font-pixel bg-transparent border-2 border-white hover:bg-white hover:text-game-dark">
                            PLAY AGAIN
                        </Button>
                         <Button className="font-pixel bg-game-primary hover:bg-game-accent text-white">
                            APPLY NOW
                        </Button>
                    </div>
                </div>
            )}
        </div>
    </section>
  );
}
