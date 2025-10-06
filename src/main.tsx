import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Menu from "./pages/Menu";
import Stars from "./pages/Stars";
import Drawing from "./pages/Drawing";
import Album from "./pages/Album";
import { AudioProvider } from "./context/AudioContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AudioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Menu />} />
          </Route>
          <Route path="/stars" element={<Stars />} />
          <Route path="/drawing" element={<Drawing />} />
          <Route path="/album" element={<Album />} />
        </Routes>
      </BrowserRouter>
    </AudioProvider>
  </React.StrictMode>
);