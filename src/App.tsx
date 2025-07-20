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
import { boardFromSession, BoardGuess } from "./types/gameBoard";
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
  const [remainingLives, setRemainingLives] = useState<number>(10); // Add remainingLives state
  const [boardState, setBoardState] = useState<BoardGuess[]>([]); // Add board state
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
      setRemainingLives(session.remainingLives || 10); // Update remainingLives from session

      // Update board state from session
      setBoardState(boardFromSession(session.guesses || []));

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
      setRemainingLives(session.remainingLives || 10); // Update remainingLives from new session

      // Initialize board state from new session
      setBoardState(boardFromSession(session.guesses || []));

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
      const hintResponse = await ApiService.getHint(userId, hintType);

      // Update remainingLives from hint response
      setRemainingLives(hintResponse.remainingLives);

      // Update the session with the new hint information
      if (gameSession) {
        const currentHintsInfo = gameSession.hintsInfo || {
          numberOfHintsUsed: 0,
          usedHintDetails: [],
        };
        const updatedSession: CreateGameSessionResponse = {
          ...gameSession,
          remainingLives: hintResponse.remainingLives, // Update remainingLives in session
          hintsInfo: {
            numberOfHintsUsed: currentHintsInfo.numberOfHintsUsed + 1,
            usedHintDetails: [
              ...currentHintsInfo.usedHintDetails,
              { hintType, hintText: hintResponse.hintText },
            ],
          },
        };
        setGameSession(updatedSession);
      }
    } catch (err) {
      setError("Failed to get hint. Please try again.");
      console.error("Error getting hint:", err);
    }
  };

  const submitGuess = async (guessedWord: string) => {
    console.log("submitGuess called with:", guessedWord);
    console.log("Current board state before submit:", boardState);

    try {
      // Add optimistic update - show guess with loading state
      const optimisticGuess: BoardGuess = {
        guessedWord,
        correctPositions: [],
        missedPositions: [],
        aiResponse: "",
        isSubmitting: true,
      };

      console.log("Adding optimistic guess:", optimisticGuess);
      setBoardState((prev) => {
        const newState = [...prev, optimisticGuess];
        console.log("Board state after optimistic update:", newState);
        return newState;
      });

      const response = await ApiService.submitGuess(userId, guessedWord);
      console.log("Response from API:", response);

      // Create the new guess from the response
      const newGuess: BoardGuess = {
        guessedWord: response.guessedWord || guessedWord,
        correctPositions: response.correctPositions || [],
        missedPositions: response.missedPositions || [],
        aiResponse: response.aiResponse || "",
      };

      console.log("Created new guess from response:", newGuess);

      // Update board state - replace the optimistic guess with the real one
      setBoardState((prev) => {
        const newState = [...prev.slice(0, -1), newGuess]; // Remove optimistic, add real
        console.log("Setting final board state:", newState);
        return newState;
      });

      // Update remaining lives if provided
      if (response.remainingLives !== undefined) {
        setRemainingLives(response.remainingLives);
      }

      // Update game session if we have the response fields
      if (gameSession) {
        const updatedSession = {
          ...gameSession,
          remainingLives: response.remainingLives || gameSession.remainingLives,
          gameStatus: response.gameStatus || gameSession.gameStatus,
        };
        console.log("Updating game session:", updatedSession);
        setGameSession(updatedSession);
      }
    } catch (err) {
      console.log("Error occurred, rolling back optimistic update");
      // Remove optimistic guess on error
      setBoardState((prev) => {
        const newState = prev.slice(0, -1);
        console.log("Board state after error rollback:", newState);
        return newState;
      });
      setError("Failed to submit guess. Please try again.");
      console.error("Error submitting guess:", err);
      throw err; // Re-throw to handle in component
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
    setBoardState([]); // Reset board state
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
              remainingLives={remainingLives}
              boardState={boardState}
              onGetHint={getHint}
              onBackToHome={handleBackToHome}
              onRefreshSession={refreshSession}
              onSubmitGuess={submitGuess}
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
