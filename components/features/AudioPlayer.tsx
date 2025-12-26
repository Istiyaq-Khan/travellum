"use client";

import { useState, useRef } from "react";
import { Play, Pause, Loader2 } from "lucide-react";

interface AudioPlayerProps {
    text: string;
    className?: string;
    label?: string;
}

export default function AudioPlayer({ text, className, label = "Listen to Advisory" }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = async () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
            return;
        }

        // If no audio yet, fetch it
        setIsLoading(true);
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) throw new Error("Failed to generate audio");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            audio.onended = () => setIsPlaying(false);
            audio.play();

            audioRef.current = audio;
            setIsPlaying(true);
        } catch (e) {
            console.error(e);
            alert("Could not play audio");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePlay}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-bold transition ${className}`}
        >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLoading ? "Loading Audio..." : isPlaying ? "Pause" : label}
        </button>
    );
}
