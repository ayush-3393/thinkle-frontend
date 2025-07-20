// components/GuessGrid.tsx
import React from "react";
import { BoardGuess } from "../types/gameBoard";
import "./GuessGrid.css";

interface GuessGridProps {
  guesses: BoardGuess[];
  currentAiResponse?: string | null;
  maxRows?: number;
}

const GuessGrid: React.FC<GuessGridProps> = ({
  guesses = [],
  currentAiResponse,
  maxRows = 6,
}) => {
  // Ensure guesses is always an array
  const safeGuesses = Array.isArray(guesses) ? guesses : [];

  const renderEmptyRow = (rowIndex: number) => {
    return (
      <div key={`empty-${rowIndex}`} className="guess-row">
        <div className="letter-tiles">
          {Array.from({ length: 5 }).map((_, letterIndex) => (
            <div key={letterIndex} className="letter-tile empty"></div>
          ))}
        </div>
      </div>
    );
  };

  const renderGuessRow = (guess: BoardGuess, index: number) => {
    const letters = guess.guessedWord.toUpperCase().split("");

    return (
      <div key={index} className="guess-row">
        <div className="letter-tiles">
          {letters.map((letter, letterIndex) => {
            let tileClass = "letter-tile";

            if (guess.isSubmitting) {
              tileClass += " submitting";
            } else if (guess.correctPositions.includes(letterIndex)) {
              tileClass += " correct";
            } else if (guess.missedPositions.includes(letterIndex)) {
              tileClass += " wrong-position";
            } else {
              tileClass += " not-in-word";
            }

            return (
              <div key={letterIndex} className={tileClass}>
                {letter}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="guess-grid-container">
      <div className="guess-grid">
        <h3 className="grid-title">Your Guesses</h3>

        <div className="guesses-container">
          {/* Render actual guesses */}
          {safeGuesses.map((guess, index) => renderGuessRow(guess, index))}

          {/* Render empty rows to fill up to maxRows */}
          {Array.from({
            length: Math.max(0, maxRows - safeGuesses.length),
          }).map((_, index) => renderEmptyRow(safeGuesses.length + index))}
        </div>
      </div>

      {/* Always show AI response panel */}
      <div
        className={`ai-response-panel ${!currentAiResponse ? "waiting" : ""}`}
      >
        <h4 className="ai-response-title">AI Oracle</h4>
        {currentAiResponse ? (
          <p className="ai-response-text">{currentAiResponse}</p>
        ) : (
          <div className="ai-waiting">
            <div className="waiting-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="waiting-text">Waiting for your guess...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessGrid;
