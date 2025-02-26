import React from "react";
import './index.css'
import UIDesign from "./components/UIDesign";

const App = () => {
  return (
    <>
    <div className="absolute inset-0 bg-cover bg-center h-screen"  style={{
        backgroundImage:"url('https://img.freepik.com/free-vector/desert-pyramids-clear-sky_1308-163411.jpg?uid=R154664640&semt=ais_hybrid')",
        overflow: "hidden",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
    </div>
    <div className="relative z-10 p-10">    
        <UIDesign />
    </div>
    </>
    
  );
};

export default App;
