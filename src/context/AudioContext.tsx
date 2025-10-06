import { createContext, useRef, useState, type ReactNode } from "react";

type AudioContextType = {
    play: () => void;
    pause: () => void;
    toggle: () => void;
    setTrack: (src: string) => void;
    isPlaying: boolean;
    currentTrack: string | null;
};

export const AudioContext = createContext<AudioContextType>({
    play: () => {},
    pause: () => {},
    toggle: () => {},
    setTrack: () => {},
    isPlaying: false,
    currentTrack: null,
});

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<string | null>(null);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggle = () => {
        if (isPlaying) pause();
        else play();
    };

    const setTrack = (src: string) => {
        if (!audioRef.current) {
            audioRef.current = new Audio(src);
            audioRef.current.loop = true;
        } else {
            audioRef.current.src = src;
            audioRef.current.loop = true;
        }
        setCurrentTrack(src);
        audioRef.current.volume = 0.07;
        audioRef.current.play();
        setIsPlaying(true);
  };

    return (
        <AudioContext.Provider value={{ play, pause, toggle, setTrack, isPlaying, currentTrack }}>
            {children}
        </AudioContext.Provider>
    );
}