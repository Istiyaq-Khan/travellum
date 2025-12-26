"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function RecommendPage() {
    const { user, loading } = useAuth();
    const [recs, setRecs] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.push("/login");

        if (user && !recs.length) {
            fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: user.uid })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.recommendations) setRecs(data.recommendations);
                    setFetching(false);
                })
                .catch(err => {
                    console.error(err);
                    setFetching(false);
                });
        }
    }, [user, loading, router, recs.length]);

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <div className="p-6">

                <header className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
                        Curated For You
                    </h1>
                    <p className="text-gray-400 text-lg">Based on your mood and travel style.</p>
                </header>

                {fetching ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="animate-pulse text-purple-400">Analyzing your profile...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {recs.map((rec, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-3xl bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition cursor-pointer group"
                                onClick={() => router.push(`/country/${rec.name.toLowerCase().replace(/ /g, "-")}`)}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-4xl font-bold text-gray-800 group-hover:text-purple-500/20 transition">0{i + 1}</span>
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-bold">
                                        {rec.matchScore}% Match
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold mb-3 group-hover:text-purple-400 transition">{rec.name}</h2>
                                <p className="text-gray-400 leading-relaxed">{rec.reason}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
