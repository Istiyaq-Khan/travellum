"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (user) {
            handleRedirect(user.uid);
        }
    }, [user]);

    const handleRedirect = async (uid: string) => {
        setRedirecting(true);
        try {
            // Check if user profile exists and is complete
            const response = await fetch(`/api/user/profile?uid=${uid}`);
            const data = await response.json();

            if (data.success && data.data.isProfileComplete) {
                // Returning user with complete profile -> go to recommend
                router.push("/recommend");
            } else {
                // New user or incomplete profile -> go to setup
                router.push("/setup");
            }
        } catch (err) {
            console.error("Error checking profile:", err);
            // Default to setup on error
            router.push("/setup");
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            // Redirect will be handled by useEffect when user state updates
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // Redirect will be handled by useEffect when user state updates
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (user || redirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-teal-400">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">
                    {isLogin ? "Welcome Back" : "Start Your Journey"}
                </h2>

                {error && <p className="text-red-500 mb-4 text-sm bg-red-900/20 p-2 rounded">{error}</p>}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 text-gray-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-teal-400 focus:outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 text-gray-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-teal-400 focus:outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded transition duration-200"
                    >
                        {isLogin ? "Log In" : "Sign Up"}
                    </button>
                </form>

                <div className="mt-4 flex items-center justify-between">
                    <span className="h-px w-full bg-gray-600"></span>
                    <span className="px-3 text-gray-400 text-sm">OR</span>
                    <span className="h-px w-full bg-gray-600"></span>
                </div>

                <button
                    onClick={handleGoogle}
                    className="w-full mt-4 bg-white text-gray-900 font-bold py-3 rounded hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
                >
                    {/* Google Icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-teal-400 hover:text-teal-300 font-bold"
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </button>
                </p>
            </div>
        </div>
    );
}
