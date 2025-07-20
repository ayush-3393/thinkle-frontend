import React, { useState } from "react";
import { useGameSession } from "../hooks/useGameSession";
import Navbar from "./NavBar";
import LivesDisplay from "./LivesDisplay";
import HintsDisplay from "./HintsDisplay";
import { HintType } from "../../network/types/HintTypeInterfaces";
import {
  HintDetails,
  HintsInfoForSession,
} from "../../network/types/GameSessionInterfaces";
import { GetHintResponse } from "../../network/types/HintsInterfaces";

const GamePage = () => {
  const { gameSession, isCreatingSession, sessionError, retryCreateSession } =
    useGameSession();

  const {
    gameStatus,
    guesses,
    hintsInfo: initialHintsInfo,
    remainingLives,
    allHintTypes,
  } = gameSession || {};

  // ⬇️ Add state for hintsInfo so it updates when new hint is fetched
  const [hintsInfo, setHintsInfo] = useState<HintsInfoForSession | undefined>(
    initialHintsInfo
  );

  // ✅ When a new hint is received, update the hintsInfo state
  const handleHintReceived = (
    hintData: GetHintResponse & { hintType: string }
  ) => {
    if (!hintData) return;

    const { hintType, hintText } = hintData;
    const newHint: HintDetails = { hintType, hintText };

    setHintsInfo((prev) => {
      if (!prev) return { numberOfHintsUsed: 1, usedHintDetails: [newHint] };

      const existingIndex = prev.usedHintDetails.findIndex(
        (hint) => hint.hintType === hintType
      );

      let updatedHints: HintDetails[];

      if (existingIndex !== -1) {
        updatedHints = [...prev.usedHintDetails];
        updatedHints[existingIndex] = newHint;
      } else {
        updatedHints = [...prev.usedHintDetails, newHint];
      }

      return {
        numberOfHintsUsed: updatedHints.length,
        usedHintDetails: updatedHints,
      };
    });
  };

  // ⏳ Loading state
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

  // ❌ Error state
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

  // ✅ Game loaded
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
