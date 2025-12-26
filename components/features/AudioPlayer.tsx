"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Loader2 } from "lucide-react";

interface AudioPlayerProps {
    text: string;
    className?: string;
    label?: string;
    slug?: string; // If provided, we save the audio
    audioKey?: 'history' | 'advisory'; // Which field to update
    initialAudioUrl?: string; // If already exists
}

export default function AudioPlayer({ text, className, label = "Listen", slug, audioKey, initialAudioUrl }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);

    useEffect(() => {
        if (initialAudioUrl) setAudioUrl(initialAudioUrl);
    }, [initialAudioUrl]);

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

        // If we have a URL (from props or previous fetch), use it
        if (audioUrl) {
            playAudio(audioUrl);
            return;
        }

        // Otherwise generate it
        setIsLoading(true);
        try {
            console.log("Generating audio...");
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    slug,
                    audioKey
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to generate audio");
            }

            // Get the audio URL from response header (if server uploaded it)
            const serverAudioUrl = res.headers.get('X-Audio-Url');
            if (serverAudioUrl) {
                console.log("Audio uploaded by server:", serverAudioUrl);
                setAudioUrl(serverAudioUrl);
            }

            const blob = await res.blob();
            const tempUrl = URL.createObjectURL(blob);
            playAudio(tempUrl);

        } catch (e: any) {
            console.error(e);
            alert("Could not play audio: " + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const playAudio = (url: string) => {
        try {
            // Clean up previous audio if exists
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            const audio = new Audio(url);

            // Add event listeners
            audio.onended = () => {
                console.log('Audio playback ended');
                setIsPlaying(false);
            };

            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                alert('Failed to play audio. Please try again.');
                setIsPlaying(false);
            };

            audio.onloadeddata = () => {
                console.log('Audio loaded successfully');
            };

            // Store reference before playing
            audioRef.current = audio;

            // Play the audio
            audio.play()
                .then(() => {
                    console.log('Audio playing...');
                    setIsPlaying(true);
                })
                .catch(e => {
                    console.error('Play error:', e);
                    alert('Could not play audio: ' + e.message);
                    setIsPlaying(false);
                });

        } catch (e: any) {
            console.error('playAudio error:', e);
            alert('Error setting up audio: ' + e.message);
            setIsPlaying(false);
        }
    };

    return (
        <button
            onClick={handlePlay}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-bold transition ${className}`}
        >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLoading ? "Generating..." : isPlaying ? "Pause" : label}
        </button>
    );
}
