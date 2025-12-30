"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Shield, Headphones, DollarSign, Compass, Zap, Database, Globe } from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const { user } = useAuth();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500 selection:text-black font-sans overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-sm font-semibold text-teal-400 backdrop-blur-md mb-8 inline-block shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            AI-Powered Travel Intelligence
          </span>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 tracking-tight">
            Travel Smarter, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">
              Not Harder.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Your personal AI guide. Real-time safety insights, immersive audio advisories, and smart budget predictions—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={user ? "/country" : "/login"}>
              <button className="px-8 py-4 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(45,212,191,0.4)]">
                Start Exploring
              </button>
            </Link>
            <Link href="#features">
              <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg transition-all backdrop-blur-md">
                See How It Works
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Stats/Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-mono">GLOBAL COVERAGE</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-mono">INSTANT ANALYSIS</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-mono">VERIFIED SAFETY</span>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for the Modern Traveler</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We combine multiple data sources to give you a complete picture of your destination before you even pack your bags.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              color: "text-emerald-400",
              title: "Safety First",
              desc: "Real-time safety scores and specific insights for Crime, Women Travelers, and LGBTQ+ safety."
            },
            {
              icon: Headphones,
              color: "text-purple-400",
              title: "Audio Guides",
              desc: "Listen to history and safety advisories on the go with our AI-generated voice guides."
            },
            {
              icon: DollarSign,
              color: "text-amber-400",
              title: "Smart Budget",
              desc: "Data-driven cost estimations for Budget, Medium, and Luxury travel styles."
            },
            {
              icon: Compass,
              color: "text-blue-400",
              title: "Tailored Recs",
              desc: "Get personalized country recommendations based on your current mood and vibe."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group cursor-default"
            >
              <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Efficiency Section */}
      <section ref={targetRef} className="relative z-10 container mx-auto px-6 py-32 border-t border-white/5">
        <motion.div style={{ opacity, y }} className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-4 h-4" /> Technical Architecture
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              High Performance, <br />
              <span className="text-gray-500">Low Cost.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              We've engineered Travellum to be as efficient as it is powerful. By leveraging smart caching, we deliver premium features without the premium price.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 h-fit">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Cost-Efficient AI Audio</h4>
                  <p className="text-gray-400 text-sm">
                    We utilize advanced Edge TTS technology to generate high-quality, natural-sounding audio guides at zero marginal cost.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 h-fit">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Intelligent Caching</h4>
                  <p className="text-gray-400 text-sm">
                    Once generated, content is cached globally. This reduces API load, speeds up delivery, and keeps our infrastructure lean.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            {/* Decorative Visual for Architecture */}
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative z-10 w-full h-full bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8 flex flex-col justify-between overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-mono text-sm text-gray-300">API Request</span>
                    </div>
                    <span className="font-mono text-xs text-green-400">0ms Latency</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="font-mono text-sm text-gray-300">Audio Cache</span>
                    </div>
                    <span className="font-mono text-xs text-purple-400">HIT</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 opacity-50">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-gray-500" />
                      <span className="font-mono text-sm text-gray-300">External Provider</span>
                    </div>
                    <span className="font-mono text-xs text-gray-500">SKIPPED</span>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Efficiency Rating</p>
                  <div className="text-5xl font-bold text-white">99.9<span className="text-teal-500">%</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Travellum. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition">Privacy</Link>
            <Link href="#" className="hover:text-white transition">Terms</Link>
            <Link href="#" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
