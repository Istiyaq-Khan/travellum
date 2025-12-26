"use client";

import { useEffect, useState } from "react";
import AudioPlayer from "@/components/features/AudioPlayer";
import Link from "next/link";
import { ArrowLeft, Shield, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

interface CountryDetailsProps {
    initialData: any;
    slug: string;
}

export default function CountryDetails({ initialData, slug }: CountryDetailsProps) {
    const { user } = useAuth();
    const [data] = useState<any>(initialData);

    useEffect(() => {
        const saveHistory = async () => {
            if (typeof window === 'undefined') return;
            const searchParams = new URLSearchParams(window.location.search);
            const isNewSearch = searchParams.get('fromSearch') === 'true';

            if (user && isNewSearch && data) {
                await fetch("/api/user/search-history", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uid: user.uid,
                        countryName: data.name,
                        slug: data.slug,
                    }),
                }).catch((err) => console.error("Error saving search history:", err));
            }
        };
        saveHistory();
    }, [user, data]);

    if (!data) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Are you sure that exists?</h1>
                <Link href="/dashboard" className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition">Go Back</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans pb-20">
            <Navbar />
            {/* Header Image Area (Placeholder) */}
            <div className="relative h-[40vh] w-full bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                <div className="absolute bottom-0 left-0 p-8 md:p-16 z-10 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">{data.name}</h1>
                            <p className="text-xl text-teal-400 max-w-2xl">{data.overview}</p>
                        </div>
                        {/* Audio Controls */}
                        <div className="flex gap-3">
                            <AudioPlayer
                                text={data.historyText}
                                label="History"
                                className="bg-purple-500 hover:bg-purple-400"
                                slug={data.slug}
                                audioKey="history"
                                initialAudioUrl={data.audioUrls?.history}
                            />
                            <AudioPlayer
                                text={data.advisoryText}
                                label="Safety Advisory"
                                slug={data.slug}
                                audioKey="advisory"
                                initialAudioUrl={data.audioUrls?.advisory}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">

                    {/* Safety Section */}
                    <section className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-8 h-8 text-teal-400" />
                            <h2 className="text-2xl font-bold">Safety Analysis</h2>
                            <span className={`ml-auto px-4 py-1 rounded-full text-sm font-bold ${data.safety.score > 80 ? 'bg-green-500/20 text-green-400' :
                                data.safety.score > 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                Score: {data.safety.score}/100
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                            <div className="space-y-4">
                                <p><strong className="text-white">Crime:</strong> {data.safety.details.crime}</p>
                                <p><strong className="text-white">Transport:</strong> {data.safety.details.transport}</p>
                                <p><strong className="text-white">Healthcare:</strong> {data.safety.details.health}</p>
                            </div>
                            <div className="space-y-4">
                                <p><strong className="text-white">Women Travelers:</strong> {data.safety.details.women}</p>
                                <p><strong className="text-white">LGBTQ+:</strong> {data.safety.details.lgbtq}</p>
                                <p><strong className="text-white">Political:</strong> {data.safety.details.political}</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
                            <h3 className="text-teal-400 font-bold mb-2 text-sm uppercase tracking-wide">AI Travel Advisory</h3>
                            <p className="italic text-gray-300">"{data.advisoryText}"</p>
                        </div>
                    </section>

                    {/* History Section */}
                    <section className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-4">📜 Historical & Cultural Context</h2>
                        <p className="leading-relaxed text-gray-300">{data.historyText}</p>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-900 rounded-xl">
                                <h4 className="font-bold mb-2">Warnings</h4>
                                <ul className="list-disc pl-4 text-sm text-gray-400 space-y-1">
                                    {data.culturalWarnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                            <div className="p-4 bg-gray-900 rounded-xl">
                                <h4 className="font-bold mb-2">Local Laws</h4>
                                <ul className="list-disc pl-4 text-sm text-gray-400 space-y-1">
                                    {data.localLaws.map((l: string, i: number) => <li key={i}>{l}</li>)}
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Cost Card */}
                    <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800">
                        <div className="flex items-center gap-2 mb-4 text-emerald-400">
                            <DollarSign className="w-6 h-6" />
                            <h3 className="text-xl font-bold">Estimated Costs</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                <span className="text-gray-400">Budget</span>
                                <span className="font-mono text-xl">{data.estimatedCost.budget}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                                <span className="text-gray-400">Medium</span>
                                <span className="font-mono text-xl">{data.estimatedCost.medium}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Luxury</span>
                                <span className="font-mono text-xl">{data.estimatedCost.luxury}</span>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-2">Currency: {data.estimatedCost.currency}</p>
                        </div>
                    </div>

                    {/* Essentials */}
                    <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800">
                        <h3 className="text-xl font-bold mb-4">Essentials</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <span className="block text-gray-500 text-xs uppercase">Best Season</span>
                                {data.bestSeason}
                            </li>
                            <li>
                                <span className="block text-gray-500 text-xs uppercase">Visa Info</span>
                                {data.visaRequirements}
                            </li>
                            <li>
                                <span className="block text-gray-500 text-xs uppercase">Internet</span>
                                {data.internetAvailability}
                            </li>
                            <li>
                                <span className="block text-gray-500 text-xs uppercase">Emergency</span>
                                Police: {data.emergencyNumbers.police} <br /> Ambulance: {data.emergencyNumbers.ambulance}
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
