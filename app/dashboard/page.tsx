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

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto text-center mt-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Where to next, <span className="text-gray-500">Traveler?</span>
                    </h2>

                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-16 group">
                        <div className="absolute inset-0 bg-teal-500/20 blur-xl group-hover:bg-teal-500/30 transition duration-500 rounded-full" />
                        <input
                            type="text"
                            className="relative w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-4 pl-8 pr-32 text-lg focus:outline-none focus:border-teal-500 transition shadow-xl"
                            placeholder="Search for a country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-teal-500 text-black px-6 rounded-full font-bold hover:bg-teal-400 transition"
                        >
                            Go
                        </button>
                    </form>

                    <div className="mb-16">
                        <button onClick={() => router.push('/recommend')} className="text-teal-400 hover:text-white underline underline-offset-4 decoration-teal-500/30 hover:decoration-teal-400 transition">
                            ✨ Or ask AI to recommend a place based on your mood
                        </button>
                    </div>
                </motion.div>

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
