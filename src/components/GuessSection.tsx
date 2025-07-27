// components/GuessesSection.tsx
import React from "react";
import { GuessResponse } from "../types/interfaces";
import "./GuessSection.css";

interface GuessesSectionProps {
  guesses: GuessResponse[];
}

const GuessesSection: React.FC<GuessesSectionProps> = ({ guesses }) => {
  return (
    <div className="guesses-section">
      <h3 className="guesses-title">Previous Guesses ({guesses.length})</h3>

      {guesses.length === 0 ? (
        <p className="no-guesses">No guesses yet. Start guessing!</p>
      ) : (
        <div className="guesses-list">
          {guesses.map((guess, index) => (
            <div key={index} className="guess-item">
              <div className="guess-header">
                <span className="guess-word">{guess.guessedWord}</span>
                <span className="guess-number">Guess #{index + 1}</span>
              </div>
              <div className="guess-details">
                <p>
                  <strong>Correct positions:</strong>{" "}
                  {guess.correctPositions.join(", ") || "None"}
                </p>
                <p>
                  <strong>Missed positions:</strong>{" "}
                  {guess.missedPositions.join(", ") || "None"}
                </p>
                <p>
                  <strong>AI Response:</strong> {guess.aiResponse}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuessesSection;
