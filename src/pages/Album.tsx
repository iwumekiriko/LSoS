import { useLocation } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { useContext } from "react";
import "./Album.css";

export default function Album() {
  const location = useLocation();
  const image = location.state?.image;
  const { toggle, isPlaying } = useContext(AudioContext);

  if (!image) {
    return <p>Ошибка: картинка не найдена</p>;
  }

const saveImage = () => {
  const img = new Image();
  img.src = image;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height + 60;

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, img.width, img.height)
    ctx.drawImage(img, 0, 0);

    ctx.fillStyle = "#ff1818";
    ctx.font = "10px Trebuchet MS";
    ctx.textAlign = "left"
    ctx.fillText("05.10.2025", 30, 30)
    ctx.textAlign = "right";
    ctx.fillText("С любовью от: iwumekiriko ❤️", canvas.width - 20, img.height - 20);

    const finalImage = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = finalImage;
    a.download = "constellation.png";
    a.click();
  };
};

  return (
    <div className="sketchbook-container">
      <div className="sketchbook">
        <div className="page left-page">
            <p className="note">
                05 октября 2025. <br/>
                Тёплая ночь, под небом. <br/>
                Мы сидели рядом и смотрели на звёзды — <br/>
                и этот момент не забудется никогда. <br/>
            </p>
        </div>
        <div className="page right-page">
          <div className="drawing-frame">
            <img src={image} alt="Созвездие" />
          </div>
          <button className="save-btn" onClick={saveImage}>
            Сохранить рисунок
          </button>
        </div>
      </div>

      <button className="album-music-toggle" onClick={toggle}>
            {isPlaying ? "🎵" : "🔇"}
        </button>
    </div>
  );
}