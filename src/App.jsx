import React from "react";
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
// import Game from './Pages/Game';
import GameGrid from "./components/GameGrid";

const App = () => {
  return (
    <>
          <Router>
              <div className="absolute inset-0 bg-cover bg-center max-h-screen"  style={{
                backgroundImage:"url('/images/bgimage.jpg')",
                overflow: "hidden",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/game" element={<GameGrid />} />
               </Routes>
            </div>
        </Router>
    </>
    
  );
};

export default App;
