"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500 selection:text-black font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          TRAVELLUM
        </h1>
        <div className="space-x-4">
          {!loading && user ? (
            <Link href="/profile" className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition backdrop-blur-md">
              Dashboard
            </Link>
          ) : (
            !loading && <Link href="/login" className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition backdrop-blur-md">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-teal-300 backdrop-blur-sm mb-6 inline-block">
            AI-Powered Travel Intelligence
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Travel Smarter, <br />
            <span className="text-gray-500">Not Harder.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your personal AI guide. Real-time safety insights, voice advisories, and personalized itineraries based on your mood and budget.
          </p>

          <Link href={user ? "/profile" : "/login"}>
            <button className="px-8 py-4 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-bold text-lg transition transform hover:scale-105 shadow-[0_0_20px_rgba(45,212,191,0.3)]">
              Start Your Journey
            </button>
          </Link>
        </motion.div>

        {/* Floating Cards (Decorative) */}
        <div className="mt-20 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
          {[
            { title: "Smart Safety", icon: "🛡️", desc: "Real-time safety scores & warnings." },
            { title: "Voice Guide", icon: "🎧", desc: "ElevenLabs powered audio advisories." },
            { title: "Budget AI", icon: "💰", desc: "Cost estimation tailored to you." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition text-left"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
