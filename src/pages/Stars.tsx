import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import "./Stars.css"

function wait(ms: number) { return new Promise(res => setTimeout(res, ms)); }
type Star = { id: number; x: number; y: number; isConstellation?: boolean };

export default function Stars() {
  const location = useLocation();
  const { toggle, isPlaying } = useContext(AudioContext);
  const [continueAnim, setContinueAnim] = useState(false);

  const dialogue = [
    { speaker: "left", text: "Смотри, как много звёзд сегодня!" },
    { speaker: "right", text: "Правда... Они будто сияют только для нас." },
    { speaker: "left", text: "Иногда кажется, что мы часть этого неба..." }
  ];

  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [bubblesVisible, setBubblesVisible] = useState(false);
  const [bubbleAnimating, setBubbleAnimating] = useState(false);

  const [cameraMoving, setCameraMoving] = useState(false);
  const [settled, setSettled] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const constellationCoords = [
    { x: 50, y: 35 },
    { x: 60, y: 30 },
    { x: 65, y: 45 },
    { x: 50, y: 80 },
    { x: 35, y: 45 },
    { x: 40, y: 30 },
  ];

  const [stars] = useState<Star[]>(() => {
    let arr: Star[] = [];
    for (let i = 0; i < 50; i++) {
      arr.push({
        id: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 80 + 10,
        isConstellation: false,
      });
    }
    constellationCoords.forEach((c, idx) =>
      arr.push({ id: 100 + idx, x: c.x, y: c.y, isConstellation: true })
    );
    return arr;
  });

  const [activeStars, setActiveStars] = useState<number[]>([]);
  const [wrongClick, setWrongClick] = useState<number | null>(null);
  const [showLines, setShowLines] = useState(false);

  const handleStarClick = (star: Star) => {
    if (star.isConstellation) {
      if (!activeStars.includes(star.id)) {
        setActiveStars([...activeStars, star.id]);
      }

      const allCorrect = stars.filter(s => s.isConstellation).map(s => s.id);
      if (allCorrect.every(id => activeStars.includes(id) || id === star.id)) {
        setTimeout(() => setShowLines(true), 500);
      }
    } else {
      setWrongClick(star.id);
      setTimeout(() => setWrongClick(null), 400);
    }
  };

  useEffect(() => {
    if (location.state?.continueScroll) {
      setTimeout(() => setContinueAnim(true), 100);
    }
    const timer = setTimeout(() => setBubblesVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [location]);

  const handleClick = async () => {
    if (showLines) {
      setGameFinished(true);
      await wait(2000);
      navigate("/drawing", { state: { continueScroll: true } });
    }
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

  const current = dialogue[index];

  return (
    <div className={`stars ${gameFinished ? "zoom" : ""}`} onClick={handleClick}>
  
      <div
        className={`stars-initial-layer ${continueAnim ? "settle" : ""} ${cameraMoving ? "move-up" : ""} ${!cameraMoving && !settled ? "idle" : ""}`}
        aria-hidden={settled}
      />

      <div className={`stars-final-layer ${settled ? "visible" : ""}`} aria-hidden={!settled} />

      {bubblesVisible && (
        <>
          {current.speaker === "left" && (
            <div className={`stars-speech-bubble left ${bubbleAnimating ? "stars-fade-out" : "stars-fade-in"}`}>
              <p>{current.text}</p>
            </div>
          )}

          {current.speaker === "right" && (
            <div className={`stars-speech-bubble right ${bubbleAnimating ? "stars-fade-out" : "stars-fade-in"}`}>
              <p>{current.text}</p>
            </div>
          )}
        </>
      )}

      <button className="music-toggle" onClick={toggle}>
          {isPlaying ? "🎵" : "🔇"}
      </button>

      {settled && (
        <div className="star-field">
          {showLines && (
            <svg className="lines">
              {stars
                .filter(s => s.isConstellation)
                .map((s, i, arr) => {
                  if (i < arr.length - 1) {
                    return (
                      <line
                        key={s.id}
                        x1={`${s.x}%`}
                        y1={`${s.y}%`}
                        x2={`${arr[i + 1].x}%`}
                        y2={`${arr[i + 1].y}%`}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  }
                  if (i === arr.length - 1) {
                    return (
                      <line
                        key={s.id + "-last"}
                        x1={`${s.x}%`}
                        y1={`${s.y}%`}
                        x2={`${arr[0].x}%`}
                        y2={`${arr[0].y}%`}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  }
                  return null;
                })}
            </svg>
          )}

          {stars.map((star) => (
            <div
              key={star.id}
              className={`star 
                ${activeStars.includes(star.id) ? "active" : ""} 
                ${wrongClick === star.id ? "shake" : ""}`}
              style={{ top: `${star.y}%`, left: `${star.x}%` }}
              onClick={(e) => { e.stopPropagation(); handleStarClick(star); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}