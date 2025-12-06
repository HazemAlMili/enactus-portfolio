"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target } from "lucide-react";

const achievements = [
  {
    title: "National Champions",
    description: "Won the national cup in 2024 season.",
    icon: Trophy,
    color: "text-game-accent", 
  },
  {
    title: "Top Impact",
    description: "Highest impact score in regional projects.",
    icon: Target,
    color: "text-game-primary",
  },
  {
    title: "Best Team Spirit",
    description: "Recognized for outstanding collaboration.",
    icon: Star,
    color: "text-green-400",
  },
];

export default function AboutUs() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden z-10" id="about">
        <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-4xl font-pixel text-white mb-4">
                    <span className="text-game-accent">&gt;</span> PLAYER STATS
                </h2>
                <div className="h-1 w-24 bg-game-primary mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {achievements.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Card className="bg-game-purple/20 border-2 border-game-primary/50 hover:border-game-accent hover:-translate-y-2 transition-all duration-300 group">
                            <CardHeader className="text-center">
                                <item.icon className={`w-12 h-12 mx-auto mb-4 ${item.color} group-hover:scale-110 transition-transform`} />
                                <CardTitle className="font-pixel text-lg text-white tracking-widest">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardDescription className="font-body text-gray-300 text-base mb-6">
                                    {item.description}
                                </CardDescription>
                                <Button className="w-full font-pixel text-[10px] bg-transparent border border-game-primary text-game-primary hover:bg-game-primary hover:text-white group-hover:border-game-accent group-hover:bg-game-accent group-hover:text-game-dark">
                                    VIEW ACHIEVEMENT
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
}
