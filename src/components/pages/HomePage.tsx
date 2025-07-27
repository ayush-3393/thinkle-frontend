// pages/HomePage.tsx
import React from "react";
import { Play, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Rules from "../Rules";
import "./HomePage.css";

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.username}!</span>
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={16} />
              Logout
            </button>
          </div>
          <h1 className="home-title">Thinkle</h1>
          <p className="home-subtitle">Test your word-guessing skills!</p>
        </div>

        <div className="home-content">
          <div className="home-icon">🎯</div>
          <p className="home-description">
            Guess the mystery word with limited lives. Use hints wisely to help
            you solve the puzzle!
          </p>
        </div>

        <Rules />

        <button onClick={onStartGame} className="start-game-button">
          <Play className="mr-2" size={20} />
          Start Game
        </button>
      </div>
    </div>
  );
};

export default HomePage;
