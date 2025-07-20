// pages/HomePage.tsx
import React from "react";
import { Play } from "lucide-react";
import "./HomePage.css";

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">Word Quest</h1>
          <p className="home-subtitle">Test your word-guessing skills!</p>
        </div>

        <div className="home-content">
          <div className="home-icon">🎯</div>
          <p className="home-description">
            Guess the mystery word with limited lives. Use hints wisely to help
            you solve the puzzle!
          </p>
        </div>

        <button onClick={onStartGame} className="start-game-button">
          <Play className="mr-2" size={20} />
          Start Game
        </button>
      </div>
    </div>
  );
};

export default HomePage;
