"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function SetupPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        location: "",
        age: "",
        groupType: "Solo" as "Solo" | "Friends" | "Family" | "Couple",
        travelDocuments: [] as string[],
        health: [] as string[],
        mood: "",
    });
    const [documentInput, setDocumentInput] = useState("");
    const [healthInput, setHealthInput] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user?.uid,
                    email: user?.email,
                    displayName: user?.displayName,
                    photoURL: user?.photoURL,
                    profile: {
                        location: formData.location,
                        age: parseInt(formData.age),
                        groupType: formData.groupType,
                        travelDocuments: formData.travelDocuments,
                        health: formData.health,
                    },
                    mood: formData.mood,
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push("/dashboard");
            } else {
                setError(data.error || "Failed to save profile");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const addDocument = () => {
        if (documentInput.trim() && !formData.travelDocuments.includes(documentInput.trim())) {
            setFormData({
                ...formData,
                travelDocuments: [...formData.travelDocuments, documentInput.trim()],
            });
            setDocumentInput("");
        }
    };

    const removeDocument = (doc: string) => {
        setFormData({
            ...formData,
            travelDocuments: formData.travelDocuments.filter((d) => d !== doc),
        });
    };

    const addHealth = () => {
        if (healthInput.trim() && !formData.health.includes(healthInput.trim())) {
            setFormData({
                ...formData,
                health: [...formData.health, healthInput.trim()],
            });
            setHealthInput("");
        }
    };

    const removeHealth = (h: string) => {
        setFormData({
            ...formData,
            health: formData.health.filter((item) => item !== h),
        });
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            <Navbar />
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                        Welcome to Travellum
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Let's set up your profile to get personalized travel recommendations
                    </p>
                </motion.div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Where are you from?
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-teal-500 focus:outline-none transition"
                            placeholder="e.g., New York, USA"
                            required
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Your Age
                        </label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-teal-500 focus:outline-none transition"
                            placeholder="25"
                            min="1"
                            max="120"
                            required
                        />
                    </div>

                    {/* Group Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            How do you usually travel?
                        </label>
                        <select
                            value={formData.groupType}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    groupType: e.target.value as "Solo" | "Friends" | "Family" | "Couple",
                                })
                            }
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-teal-500 focus:outline-none transition"
                        >
                            <option value="Solo">Solo</option>
                            <option value="Friends">With Friends</option>
                            <option value="Family">With Family</option>
                            <option value="Couple">As a Couple</option>
                        </select>
                    </div>

                    {/* Travel Documents */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Travel Documents (e.g., Passport, Visa-USA)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={documentInput}
                                onChange={(e) => setDocumentInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDocument())}
                                className="flex-1 p-3 rounded-lg bg-white/10 border border-white/10 focus:border-teal-500 focus:outline-none transition"
                                placeholder="Add a document"
                            />
                            <button
                                type="button"
                                onClick={addDocument}
                                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-medium transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.travelDocuments.map((doc) => (
                                <span
                                    key={doc}
                                    className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm flex items-center gap-2"
                                >
                                    {doc}
                                    <button
                                        type="button"
                                        onClick={() => removeDocument(doc)}
                                        className="hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Health Information */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Health Considerations (e.g., Allergies, Medications)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={healthInput}
                                onChange={(e) => setHealthInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHealth())}
                                className="flex-1 p-3 rounded-lg bg-white/10 border border-white/10 focus:border-teal-500 focus:outline-none transition"
                                placeholder="Add health info"
                            />
                            <button
                                type="button"
                                onClick={addHealth}
                                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.health.map((h) => (
                                <span
                                    key={h}
                                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                                >
                                    {h}
                                    <button
                                        type="button"
                                        onClick={() => removeHealth(h)}
                                        className="hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Current Mood */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            How are you feeling today?
                        </label>
                        <input
                            type="text"
                            value={formData.mood}
                            onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-teal-500 focus:outline-none transition"
                            placeholder="e.g., Adventurous, Relaxed, Curious"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Setting up..." : "Complete Setup"}
                    </button>
                </form>
            </div>
        </div>
    );
}
