"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";

interface CountryRecommendation {
    _id: string;
    name: string;
    slug: string;
}

export default function CountrySearchPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState<any[]>([]);
    const [countryRecommendations, setCountryRecommendations] = useState<CountryRecommendation[]>([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            fetchSearchHistory();
        }
    }, [user, loading, router]);

    // Debounced search for country recommendations
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                fetchCountryRecommendations(searchQuery);
            }, 300); // 300ms debounce

            return () => clearTimeout(timer);
        } else {
            setCountryRecommendations([]);
            setShowAutocomplete(false);
            setIsSearching(false);
        }
    }, [searchQuery]);

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

    const fetchCountryRecommendations = async (query: string) => {
        try {
            const response = await fetch(`/api/country/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (data.countries) {
                setCountryRecommendations(data.countries);
                setShowAutocomplete(data.countries.length > 0);
            }
        } catch (error) {
            console.error("Error fetching country recommendations:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = async (countryName?: string) => {
        const query = countryName || searchQuery.trim();
        if (!query) return;

        const slug = query.toLowerCase().replace(/ /g, "-");

        // Navigate to country page with fromSearch=true to save search history
        router.push(`/country/${slug}?fromSearch=true`);
    };

    const handleAutocompleteClick = (slug: string) => {
        setSearchQuery("");
        setShowAutocomplete(false);
        setCountryRecommendations([]);
        // Navigate with fromSearch=true to save search history
        router.push(`/country/${slug}?fromSearch=true`);
    };

    if (loading || !user) return null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white p-6 font-sans">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                            Explore Countries
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Search for any country to get AI-powered travel insights
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-16">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-teal-500/20 blur-xl group-hover:bg-teal-500/30 transition duration-500 rounded-full" />
                            <div className="relative flex items-center">
                                <Search className="absolute left-6 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="relative w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-4 pl-14 pr-32 text-lg focus:outline-none focus:border-teal-500 transition shadow-xl"
                                    placeholder="Search for a country..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery && setShowAutocomplete(true)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 bg-teal-500 text-black px-6 py-2 rounded-full font-bold hover:bg-teal-400 transition"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Autocomplete Dropdown */}
                        <AnimatePresence>
                            {showAutocomplete && countryRecommendations.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full mt-2 w-full bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                                >
                                    <div className="p-2">
                                        <p className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">
                                            {isSearching ? "Searching..." : "Recommended Locations"}
                                        </p>
                                        {countryRecommendations.map((country, index) => (
                                            <button
                                                key={country._id}
                                                onClick={() => handleAutocompleteClick(country.slug)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition text-left group"
                                            >
                                                <MapPin className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
                                                <div className="flex-1">
                                                    <p className="font-medium group-hover:text-teal-400 transition">{country.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Click to explore
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Recent Searches Display */}
                    {searchHistory.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-2xl mx-auto"
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-teal-400" />
                                Recent Searches
                            </h2>
                            <div className="grid gap-4">
                                {searchHistory.slice(0, 10).map((item, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => router.push(`/country/${item.slug}`)}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/50 hover:bg-white/10 transition text-left group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold group-hover:text-teal-400 transition">
                                                    {item.countryName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Searched on {new Date(item.searchedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-teal-400 rotate-180 transition" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {searchHistory.length === 0 && (
                        <div className="text-center text-gray-500 mt-12">
                            <p>No search history yet. Start exploring countries!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
