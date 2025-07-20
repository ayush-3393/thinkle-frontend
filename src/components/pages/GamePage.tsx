// pages/GamePage.tsx
import React from "react";
import { Home } from "lucide-react";
import { CreateGameSessionResponse } from "../../types/interfaces";
import GuessesSection from "../GuessSection";
import HintsCorner from "../HintsCorner";
import LivesDisplay from "../LivesDisplay";
import "./GamePage.css";

interface GamePageProps {
  gameSession: CreateGameSessionResponse;
  onBackToHome: () => void;
  onGetHint: (hintType: string) => Promise<void>;
  onRefreshSession?: () => Promise<void>;
}

const GamePage: React.FC<GamePageProps> = ({
  gameSession,
  onBackToHome,
  onGetHint,
  onRefreshSession,
}) => {
  return (
    <div className="game-page">
      <div className="game-container">
        {/* Header */}
        <div className="game-header">
          <h1 className="game-title">Word Quest</h1>
          <button onClick={onBackToHome} className="home-button">
            <Home className="mr-2" size={20} />
            Home
          </button>
        </div>

        {/* Game Status */}
        <div className="game-status-section">
          <div className="game-status-content">
            <div className="game-status-text">
              Game Status:
              <span
                className={
                  gameSession.gameStatus === "IN_PROGRESS"
                    ? "status-in-progress"
                    : gameSession.gameStatus === "WON"
                    ? "status-won"
                    : "status-lost"
                }
              >
                {gameSession.gameStatus.replace("_", " ")}
              </span>
            </div>
          </div>

          <LivesDisplay remainingLives={gameSession.remainingLives} />
        </div>

        {/* Hints Corner */}
        <HintsCorner
          hintTypes={gameSession.allHintTypes}
          usedHints={gameSession.hintsInfo.usedHintDetails}
          onGetHint={onGetHint}
        />

        {/* Guesses Section */}
        <GuessesSection guesses={gameSession.guesses} />
      </div>
    </div>
  );
};

export default GamePage;
