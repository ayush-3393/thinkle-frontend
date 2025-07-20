import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    // Navigate to game page immediately
    navigate("/game");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Thinkle!</h1>
        <p>Get ready to challenge your mind with our exciting word game.</p>

        <button
          onClick={handleStartGame}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Start Game
        </button>
      </header>
    </div>
  );
};

export default HomePage;
