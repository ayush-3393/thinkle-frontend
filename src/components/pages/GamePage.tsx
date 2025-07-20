// pages/GamePage.tsx
import React, { useState } from "react";
import { Home } from "lucide-react";
import { CreateGameSessionResponse } from "../../types/interfaces";
import { BoardGuess } from "../../types/gameBoard";
import GuessGrid from "../GuessGrid";
import WordBoard from "../WordBoard";
import HintsCorner from "../HintsCorner";
import LivesDisplay from "../LivesDisplay";
import "./GamePage.css";

interface GamePageProps {
  gameSession: CreateGameSessionResponse;
  remainingLives: number;
  boardState: BoardGuess[];
  onBackToHome: () => void;
  onGetHint: (hintType: string) => Promise<void>;
  onRefreshSession?: () => Promise<void>;
  onSubmitGuess: (guessedWord: string) => Promise<void>;
}

const GamePage: React.FC<GamePageProps> = ({
  gameSession,
  remainingLives,
  boardState,
  onBackToHome,
  onGetHint,
  onRefreshSession,
  onSubmitGuess,
}) => {
  const [currentAiResponse, setCurrentAiResponse] = useState<string | null>(
    null
  );

  const handleGuessSubmit = async (word: string) => {
    try {
      await onSubmitGuess(word);
      // The AI response will be updated by the useEffect when boardState updates
    } catch (error) {
      // Error is already handled in the parent component
      throw error;
    }
  };

  // Update current AI response when boardState changes
  React.useEffect(() => {
    if (boardState.length > 0) {
      const latestGuess = boardState[boardState.length - 1];
      if (!latestGuess.isSubmitting && latestGuess.aiResponse) {
        setCurrentAiResponse(latestGuess.aiResponse);
      }
    } else {
      setCurrentAiResponse(null);
    }
  }, [boardState]);

  const isGameOver =
    gameSession.gameStatus === "WON" || gameSession.gameStatus === "LOST";

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

          <LivesDisplay remainingLives={remainingLives} />
        </div>

        {/* Hints Corner */}
        <HintsCorner
          hintTypes={gameSession.allHintTypes || []}
          usedHints={gameSession.hintsInfo?.usedHintDetails || []}
          onGetHint={onGetHint}
        />

        {/* Word Input Board */}
        {!isGameOver && (
          <WordBoard onSubmitGuess={handleGuessSubmit} disabled={isGameOver} />
        )}

        {/* Game Over Message */}
        {isGameOver && (
          <div
            className={`game-over-message ${gameSession.gameStatus.toLowerCase()}`}
          >
            {gameSession.gameStatus === "WON"
              ? "🎉 Congratulations! You won!"
              : "😞 Game over! Better luck next time!"}
          </div>
        )}

        {/* Guess Grid with AI Response */}
        <GuessGrid
          guesses={boardState}
          currentAiResponse={currentAiResponse}
          maxRows={6}
        />
      </div>
    </div>
  );
};

export default GamePage;
