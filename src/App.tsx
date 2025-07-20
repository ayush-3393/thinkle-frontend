// App.tsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CreateGameSessionResponse } from "./types/interfaces";
import { ApiService } from "./services/api";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import HomePage from "./components/pages/HomePage";
import GamePage from "./components/pages/GamePage";

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameSession, setGameSession] =
    useState<CreateGameSessionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID for demo - in real app, get from auth context
  const userId = 1;

  // Refresh session periodically when on game page
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (location.pathname === "/game" && gameSession) {
      // Refresh session every 30 seconds when on game page
      intervalId = setInterval(() => {
        fetchGameSession();
      }, 30000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [location.pathname, gameSession]);

  const fetchGameSession = async () => {
    try {
      const session = await ApiService.getGameSession(userId);
      setGameSession(session);
      return session;
    } catch (err) {
      console.error("Error fetching game session:", err);
      setError("Failed to fetch game session.");
      return null;
    }
  };

  const createGameSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await ApiService.createGameSession(userId);
      setGameSession(session);
      navigate("/game");
    } catch (err) {
      setError("Failed to create game session. Please try again.");
      console.error("Error creating game session:", err);
    } finally {
      setLoading(false);
    }
  };

  const getHint = async (hintType: string) => {
    try {
      const hintText = await ApiService.getHint(userId, hintType);

      // Fetch fresh session data after getting hint to ensure UI is up to date
      const updatedSession = await fetchGameSession();

      if (!updatedSession) {
        // If fetching session failed, fall back to manual update
        if (gameSession) {
          const fallbackSession: CreateGameSessionResponse = {
            ...gameSession,
            hintsInfo: {
              numberOfHintsUsed: gameSession.hintsInfo.numberOfHintsUsed + 1,
              usedHintDetails: [
                ...gameSession.hintsInfo.usedHintDetails,
                { hintType, hintText },
              ],
            },
          };
          setGameSession(fallbackSession);
        }
      }
    } catch (err) {
      setError("Failed to get hint. Please try again.");
      console.error("Error getting hint:", err);
    }
  };

  const refreshSession = async () => {
    await fetchGameSession();
  };

  const handleStartGame = () => {
    createGameSession();
  };

  const handleBackToHome = () => {
    navigate("/home");
    setGameSession(null);
    setError(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading game session..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={handleCloseError} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/home"
        element={<HomePage onStartGame={handleStartGame} />}
      />
      <Route
        path="/game"
        element={
          gameSession ? (
            <GamePage
              gameSession={gameSession}
              onGetHint={getHint}
              onBackToHome={handleBackToHome}
              onRefreshSession={refreshSession}
            />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />
    </Routes>
  );
};
export default App;
