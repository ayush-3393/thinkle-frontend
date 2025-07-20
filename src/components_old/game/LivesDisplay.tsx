import React from "react";

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
        <span
          key={`alive-${i}`}
          style={{
            color: "#e74c3c",
            fontSize: "24px",
            margin: "0 2px",
          }}
        >
          ♥
        </span>
      );
    }

    // Render lost lives as darker hearts
    for (let i = remainingLives; i < totalLives; i++) {
      hearts.push(
        <span
          key={`lost-${i}`}
          style={{
            color: "#7f8c8d",
            fontSize: "24px",
            margin: "0 2px",
            opacity: 0.5,
          }}
        >
          ♥
        </span>
      );
    }

    return hearts;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        margin: "10px 0",
      }}
    >
      <span
        style={{
          marginRight: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#2c3e50",
        }}
      >
        Lives:
      </span>
      <div style={{ display: "flex", alignItems: "center" }}>
        {renderHearts()}
      </div>
      <span
        style={{
          marginLeft: "10px",
          fontSize: "14px",
          color: "#7f8c8d",
        }}
      >
        {remainingLives}/{totalLives}
      </span>
    </div>
  );
};

export default LivesDisplay;
