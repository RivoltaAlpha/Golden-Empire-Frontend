import React from "react";
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import Game from "./Pages/Game";
import MusicProvider from "./components/MusicProvider";

const App = () => {
  return (
    <MusicProvider>
          <Router>
              <div className="absolute inset-0 bg-cover bg-center max-h-screen"  style={{
                backgroundImage:"url('/images/bgimage.jpg')",
                overflow: "hidden",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/game" element={<Game />} />
               </Routes>
            </div>
        </Router>
    </MusicProvider>
    
  );
};

export default App;
