import React, { useRef, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import "./Drawing.css";

function wait(ms: number) { return new Promise(res => setTimeout(res, ms)); }

export default function Drawing() {
    const { toggle, isPlaying } = useContext(AudioContext);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sampleRef = useRef<HTMLImageElement>(null);
    const [drawing, setDrawing] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const [continueAnim, setContinueAnim] = useState(false);

    const dialogue = [
        { speaker: "left", text: "Посмотри, какое красивое созвездие!" },
        { speaker: "right", text: "Мм.. Не мог бы ты его зарисовать нам на память?" },
        { speaker: "left", text: "Хорошо, но тебе придётся мне помочь.." }
    ];

    const [index, setIndex] = useState(0);
    const [bubblesVisible, setBubblesVisible] = useState(false);
    const [bubbleAnimating, setBubbleAnimating] = useState(false);

    const [cameraMoving, setCameraMoving] = useState(false);
    const [settled, setSettled] = useState(false);

    const current = dialogue[index];

    useEffect(() => {
        if (location.state?.continueScroll) {
          setTimeout(() => setContinueAnim(true), 100);
        }
        const timer = setTimeout(() => setBubblesVisible(true), 3000);
        return () => clearTimeout(timer);
      }, [location]);

    const handleClick = async () => {
        if (settled) return;

        if (index < dialogue.length - 1) {
            setBubbleAnimating(true);
            await wait(800);
            setIndex((prev) => prev + 1);
            setBubbleAnimating(false);
            return;
        }

        setBubblesVisible(false);
        await wait(400);

        setContinueAnim(false);
        setCameraMoving(true);
        await wait(2000);

        setSettled(true);

        await wait(400);
        setCameraMoving(false);
    };

    const startDrawing = () => setDrawing(true);
    const stopDrawing = () => setDrawing(false);

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    };

    const clearCanvas = () => {
        canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const finishDrawing = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const imageData = canvas.toDataURL("image/png");
        navigate("/album", {state: { image: imageData }});
    }

    return (
        <div className={`drawing`} onClick={handleClick}>
            <div
                className={`drawing-initial-layer ${continueAnim ? "settle" : ""} ${cameraMoving ? "move-up" : ""} ${!cameraMoving && !settled ? "idle" : ""}`}
                aria-hidden={settled}
            />

            <div 
                className={`drawing-final-layer ${settled ? "visible" : ""}`} 
                aria-hidden={!settled}
            >
                <div style={{ position: "absolute", bottom: 75, left: 200}}>
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={600}
                        style={{ background: "#000", border: "thick double white" }}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseMove={draw}
                    />
                    <br />
                    <br />
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button onClick={clearCanvas}>Очистить</button>
                        <button onClick={finishDrawing}>Готово</button>
                    </div>
                </div>

                <div style={{ position: "absolute", top: 75, right: 200, border: "thick double white" }}>
                    <img
                        ref={sampleRef}
                        src="/images/constellation.png"
                        alt="Созвездие"
                        width={600}
                    />
                </div>
            </div>

            {bubblesVisible && (
                <>
                {current.speaker === "left" && (
                    <div className={`drawing-speech-bubble left ${bubbleAnimating ? "drawing-fade-out" : "drawing-fade-in"}`}>
                    <p>{current.text}</p>
                    </div>
                )}

                {current.speaker === "right" && (
                    <div className={`drawing-speech-bubble right ${bubbleAnimating ? "drawing-fade-out" : "drawing-fade-in"}`}>
                    <p>{current.text}</p>
                    </div>
                )}
                </>
            )}

            <button className="music-toggle" onClick={toggle}>
                {isPlaying ? "🎵" : "🔇"}
            </button>
        </div>
    );
};