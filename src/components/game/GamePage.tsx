import React from "react";
import { useGameSession } from "../hooks/useGameSession";
import Navbar from "./NavBar";
import LivesDisplay from "./LivesDisplay";
import HintsDisplay from "./HintsDisplay";
import { HintType } from "../../network/types/HintTypeInterfaces";
import { HintsInfoForSession } from "../../network/types/GameSessionInterfaces";

const GamePage = () => {
  const { gameSession, isCreatingSession, sessionError, retryCreateSession } =
    useGameSession();

  const { gameStatus, guesses, hintsInfo, remainingLives, allHintTypes } =
    gameSession || {};

  // Optional: Handle hint received callback if you need to update other parts of the game
  const handleHintReceived = (hintData: any) => {
    console.log("Hint received:", hintData);
    // You can update other game state here if needed
    // For example, update remaining lives if the API returns it
  };

  // Loading state
  if (isCreatingSession) {
    return (
      <div className="App">
        <Navbar title="Loading Game..." />
        <header className="App-header">
          <h1>Loading Game...</h1>
          <p>Please wait while we set up your game session.</p>
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #007bff",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
          </div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </header>
      </div>
    );
  }

  // Error state
  if (sessionError) {
    return (
      <div className="App">
        <Navbar title="Game Error" />
        <header className="App-header">
          <h1>Error Loading Game</h1>
          <p style={{ color: "red" }}>
            Failed to create game session: {sessionError}
          </p>
          <button
            onClick={retryCreateSession}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Retry
          </button>
        </header>
      </div>
    );
  }

  // Game loaded successfully
  return (
    <div className="App">
      <Navbar title="Thinkle Game" />
      <header className="App-header">
        <h1>Welcome to the Game!</h1>
        {remainingLives !== undefined && (
          <LivesDisplay remainingLives={remainingLives} />
        )}
        <HintsDisplay
          allHintTypes={allHintTypes}
          hintsInfo={hintsInfo}
          onHintReceived={handleHintReceived}
        />
      </header>
    </div>
  );
};

export default GamePage;
