import React, { useEffect } from "react";
import { backgroundMusic } from "../Utiils/soundManager"; // Adjust the import path as needed

const MusicProvider = ({ children }) => {
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!backgroundMusic.playing()) {
        backgroundMusic.play();
      }
      // Remove event listener after first interaction
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    // Add event listeners to start music on user interaction
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      backgroundMusic.stop(); // Stop music when component unmounts (optional)
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  return <>{children}</>;
};

export default MusicProvider;