import React from "react";
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import MusicProvider from "./components/MusicProvider";
import GameOver from "./Pages/GameOver";
import GameGrid from "./components/GameGrid";

const App = () => {
  return (
    <MusicProvider>
          <Router>
              <div className="absolute inset-0 bg-cover bg-center min-h-screen overflow-y"  style={{
                backgroundImage:"url('/images/bgimage.jpg')",
                overflow: "hidden",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/game" element={<GameGrid />} />
                  <Route path="/game-over" element={<GameOver />} />
               </Routes>
            </div>
        </Router>
    </MusicProvider>
    
  );
};

export default App;
