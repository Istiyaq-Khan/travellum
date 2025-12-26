"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, User as UserIcon, Mail, MapPin, Users, FileText, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        location: "",
        age: "",
        groupType: "Solo" as "Solo" | "Friends" | "Family" | "Couple",
        travelDocuments: [] as string[],
        health: [] as string[],
    });
    const [documentInput, setDocumentInput] = useState("");
    const [healthInput, setHealthInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            fetchUserData();
        }
    }, [user, loading, router]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`/api/user/profile?uid=${user?.uid}`);
            const data = await response.json();
            if (data.success) {
                setUserData(data.data);
                setFormData({
                    location: data.data.profile?.location || "",
                    age: data.data.profile?.age?.toString() || "",
                    groupType: data.data.profile?.groupType || "Solo",
                    travelDocuments: data.data.profile?.travelDocuments || [],
                    health: data.data.profile?.health || [],
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });

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
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
                setIsEditing(false);
                fetchUserData();
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update profile" });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "An error occurred" });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
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

    if (loading || !user || !userData) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white p-9 font-sans">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-4xl font-bold">Your Profile</h1>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-medium transition"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* User Info Card */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 text-3xl font-bold">
                                    {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{user.displayName || "Traveler"}</h2>
                                    <p className="text-gray-400">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <div
                                className={`mb-6 p-4 rounded-lg ${message.type === "success"
                                    ? "bg-green-500/10 border border-green-500/50 text-green-400"
                                    : "bg-red-500/10 border border-red-500/50 text-red-400"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        {/* Profile Details */}
                        <div className="space-y-6">
                            {isEditing ? (
                                <>
                                    {/* Edit Mode */}
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <h3 className="text-xl font-bold mb-4">Edit Profile Information</h3>

                                        <div className="space-y-4">
                                            {/* Location */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                                    <MapPin className="w-4 h-4 inline mr-2" />
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, location: e.target.value })
                                                    }
                                                    className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-teal-500 focus:outline-none transition"
                                                    placeholder="e.g., New York, USA"
                                                />
                                            </div>

                                            {/* Age */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                                    <UserIcon className="w-4 h-4 inline mr-2" />
                                                    Age
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.age}
                                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                    className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-teal-500 focus:outline-none transition"
                                                    min="1"
                                                    max="120"
                                                />
                                            </div>

                                            {/* Group Type */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                                    <Users className="w-4 h-4 inline mr-2" />
                                                    Travel Style
                                                </label>
                                                <select
                                                    value={formData.groupType}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            groupType: e.target.value as
                                                                | "Solo"
                                                                | "Friends"
                                                                | "Family"
                                                                | "Couple",
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
                                                    <FileText className="w-4 h-4 inline mr-2" />
                                                    Travel Documents
                                                </label>
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={documentInput}
                                                        onChange={(e) => setDocumentInput(e.target.value)}
                                                        onKeyPress={(e) =>
                                                            e.key === "Enter" && (e.preventDefault(), addDocument())
                                                        }
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
                                                    <Heart className="w-4 h-4 inline mr-2" />
                                                    Health Considerations
                                                </label>
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={healthInput}
                                                        onChange={(e) => setHealthInput(e.target.value)}
                                                        onKeyPress={(e) =>
                                                            e.key === "Enter" && (e.preventDefault(), addHealth())
                                                        }
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
                                        </div>

                                        <div className="flex gap-4 mt-6">
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-medium transition disabled:opacity-50"
                                            >
                                                {saving ? "Saving..." : "Save Changes"}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        location: userData.profile?.location || "",
                                                        age: userData.profile?.age?.toString() || "",
                                                        groupType: userData.profile?.groupType || "Solo",
                                                        travelDocuments: userData.profile?.travelDocuments || [],
                                                        health: userData.profile?.health || [],
                                                    });
                                                }}
                                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* View Mode */}
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">
                                                    <MapPin className="w-4 h-4 inline mr-2" />
                                                    Location
                                                </p>
                                                <p className="text-lg">{userData.profile?.location || "Not set"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">
                                                    <UserIcon className="w-4 h-4 inline mr-2" />
                                                    Age
                                                </p>
                                                <p className="text-lg">{userData.profile?.age || "Not set"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">
                                                    <Users className="w-4 h-4 inline mr-2" />
                                                    Travel Style
                                                </p>
                                                <p className="text-lg">{userData.profile?.groupType || "Not set"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">
                                                    <FileText className="w-4 h-4 inline mr-2" />
                                                    Travel Documents
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {userData.profile?.travelDocuments?.length > 0 ? (
                                                        userData.profile.travelDocuments.map((doc: string) => (
                                                            <span
                                                                key={doc}
                                                                className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm"
                                                            >
                                                                {doc}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500">None</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-gray-400 text-sm mb-1">
                                                    <Heart className="w-4 h-4 inline mr-2" />
                                                    Health Considerations
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {userData.profile?.health?.length > 0 ? (
                                                        userData.profile.health.map((h: string) => (
                                                            <span
                                                                key={h}
                                                                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                                                            >
                                                                {h}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500">None</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Logout Button */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold mb-4">Account Actions</h3>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
