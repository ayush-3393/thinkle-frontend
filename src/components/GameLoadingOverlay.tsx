import React from "react";
import { Loader2 } from "lucide-react";
import "./GameLoadingOverlay.css";

interface GameLoadingOverlayProps {
  message?: string;
}

const GameLoadingOverlay: React.FC<GameLoadingOverlayProps> = ({
  message = "Starting your game...",
}) => {
  return (
    <div className="game-loading-overlay">
      <div className="game-loading-content">
        <div className="game-loading-spinner">
          <Loader2 className="animate-spin" size={48} />
        </div>
        <div className="game-loading-message">{message}</div>
        <div className="game-loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default GameLoadingOverlay;
