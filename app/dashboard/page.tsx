"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState<any[]>([]);

    // Recommendation State
    const [budget, setBudget] = useState("Medium");
    const [documents, setDocuments] = useState("");
    const [age, setAge] = useState("");
    const [mood, setMood] = useState("");
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
        else if (user) {
            fetchSearchHistory();
        }
    }, [user, loading, router]);

    const fetchSearchHistory = async () => {
        try {
            const response = await fetch(`/api/user/search-history?uid=${user?.uid}`);
            const data = await response.json();
            if (data.searchHistory) {
                setSearchHistory(data.searchHistory);
            }
        } catch (error) {
            console.error("Error fetching search history:", error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const slug = searchQuery.trim().toLowerCase().replace(/ /g, "-");
            router.push(`/country/${slug}?fromSearch=true`);
        }
    };

    const handleFilter = async () => {
        if (!user) return;
        setIsGenerating(true);
        setRecommendations([]);

        try {
            const res = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    budget,
                    documents,
                    age,
                    mood
                })
            });
            const data = await res.json();
            if (data.recommendations) {
                setRecommendations(data.recommendations);
            }
        } catch (error) {
            console.error("Error generating recommendations:", error);
            alert("Failed to get recommendations. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-teal-500 selection:text-black">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Plan Your Next <span className="text-teal-400">Adventure</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
                        Tell us a bit about yourself, and our AI will find the perfect destinations for you.
                    </p>

                    {/* Filter Form */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto backdrop-blur-md shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="text-left">
                                <label className="block text-sm font-bold text-gray-400 mb-2">My Budget</label>
                                <select
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition appearance-none"
                                >
                                    <option value="Budget">💰 Budget (Low)</option>
                                    <option value="Medium">⚖️ Standard (Medium)</option>
                                    <option value="Luxury">💎 Luxury (High)</option>
                                </select>
                            </div>
                            <div className="text-left">
                                <label className="block text-sm font-bold text-gray-400 mb-2">Travel Documents</label>
                                <input
                                    type="text"
                                    value={documents}
                                    onChange={(e) => setDocuments(e.target.value)}
                                    placeholder="e.g. Passport, Schengen Visa"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition"
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-sm font-bold text-gray-400 mb-2">My Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="e.g. 25"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition"
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-sm font-bold text-gray-400 mb-2">Current Mood</label>
                                <input
                                    type="text"
                                    value={mood}
                                    onChange={(e) => setMood(e.target.value)}
                                    placeholder="e.g. Relaxed, Adventurous"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleFilter}
                            disabled={isGenerating}
                            className="w-full md:w-auto px-8 py-4 rounded-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-500/50 text-black font-bold text-lg transition shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center justify-center gap-2 mx-auto"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Analyzing Options...
                                </>
                            ) : (
                                "Find My Destination"
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Recommendations Results */}
                {recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-20"
                    >
                        <h3 className="text-3xl font-bold mb-8 text-left border-l-4 border-teal-500 pl-4">
                            Top 5 Recommendations For You
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.map((rec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => router.push(`/country/${rec.name.toLowerCase().replace(/ /g, "-")}`)}
                                    className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-teal-500/50 hover:bg-gray-800 transition cursor-pointer group text-left relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                        <span className="text-6xl font-bold text-teal-500">{i + 1}</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-2xl font-bold group-hover:text-teal-400 transition">{rec.name}</h4>
                                            <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/20">
                                                {rec.matchScore}% Match
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4 min-h-[60px]">
                                            {rec.reason}
                                        </p>
                                        <div className="flex items-center text-teal-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition transform translate-x-[-10px] group-hover:translate-x-0">
                                            Explore Guide <span className="ml-2">→</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Legacy Search Area (Optional/Secondary) */}
                <div className="opacity-50 hover:opacity-100 transition duration-500">
                    <p className="text-sm text-gray-500 mb-4">Or search directly</p>
                    <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-16">
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-6 pr-20 text-white focus:outline-none focus:border-teal-500 transition"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-1 top-1 bottom-1 bg-white/10 hover:bg-white/20 text-white px-4 rounded-full text-sm font-bold transition"
                        >
                            Go
                        </button>
                    </form>
                </div>

                {/* Search History Section */}
                {searchHistory.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto"
                    >
                        <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                            <Clock className="w-6 h-6 text-teal-400" />
                            Recently Searched
                        </h3>
                        <div className="grid gap-4">
                            {searchHistory.slice(0, 5).map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                >
                                    <Link
                                        href={`/country/${item.slug}`}
                                        className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/50 hover:bg-white/10 transition group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-teal-400" />
                                                <div className="text-left">
                                                    <h4 className="font-bold group-hover:text-teal-400 transition">
                                                        {item.countryName}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(item.searchedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-gray-400 group-hover:text-teal-400 transition">→</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Link
                                href="/country"
                                className="text-teal-400 hover:text-white text-sm underline underline-offset-4"
                            >
                                View all searches
                            </Link>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
