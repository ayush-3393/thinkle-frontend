// components/LivesDisplay.tsx
import React from "react";
import "./LivesDisplay.css";

interface LivesDisplayProps {
  remainingLives: number;
  totalLives?: number;
}

const LivesDisplay: React.FC<LivesDisplayProps> = ({
  remainingLives,
  totalLives = 10,
}) => {
  const renderHearts = () => {
    const hearts = [];

    // Render remaining lives as bright red hearts
    for (let i = 0; i < remainingLives; i++) {
      hearts.push(
        <span key={`alive-${i}`} className="heart-alive">
          ♥
        </span>
      );
    }

    // Render lost lives as darker hearts
    for (let i = remainingLives; i < totalLives; i++) {
      hearts.push(
        <span key={`lost-${i}`} className="heart-lost">
          ♥
        </span>
      );
    }

    return hearts;
  };

  return (
    <div className="lives-display">
      <span className="lives-label">Lives:</span>
      <div className="lives-hearts">{renderHearts()}</div>
      <span className="lives-count">
        {remainingLives}/{totalLives}
      </span>
    </div>
  );
};

export default LivesDisplay;
