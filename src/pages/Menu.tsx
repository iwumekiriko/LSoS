import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AudioContext } from "../context/AudioContext";
import "./Menu.css";

function Menu() {
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);
    const { setTrack, toggle, isPlaying } = useContext(AudioContext);

    const handleStart = () => {
        setAnimate(true);

        setTrack("/audio/55.mp3");
        setTimeout(() => {
            navigate("/stars", { state: { continueScroll: true } });
        }, 2000);
    };

    return (
        <div className={`menu ${animate ? "slide-up" : ""}`}>
            <button className="music-toggle" onClick={toggle}>
                {isPlaying ? "🎵" : "🔇"}
            </button>

            <div className="smoke-layer"></div>

            <div className="particles">
                {Array.from({ length: 30 }).map((_, i) => (
                    <span key={i} className="particle"></span>
                ))}
            </div>

            <h1 className="title">
                {Array.from("LOVELY / STARS").map((letter, index) => (
                    <span
                        key={index} 
                        className="letter" 
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {letter}
                    </span>
                ))}
            </h1>
            <button onClick={handleStart}>Старт</button>
        </div>
    );
}

export default Menu;