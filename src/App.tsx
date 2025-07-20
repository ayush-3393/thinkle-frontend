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
import TEST_CONFIG from "./config/testConfig";
import { getUserFriendlyError } from "./utils/errorUtils";
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
  const [remainingLives, setRemainingLives] = useState<number | null>(null); // Start with null instead of 10
  const [boardState, setBoardState] = useState<BoardGuess[]>([]); // Add board state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID for demo - in real app, get from auth context
  const userId = TEST_CONFIG.DEMO_USER_ID;

  // Debug remainingLives changes
  useEffect(() => {
    console.log("remainingLives state changed to:", remainingLives);
  }, [remainingLives]);

  // Refresh session periodically when on game page
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (location.pathname === "/game" && gameSession) {
      // Only refresh if game is still in progress to avoid resetting completed game state
      if (gameSession.gameStatus === "IN_PROGRESS") {
        console.log("Setting up periodic refresh for active game");
        intervalId = setInterval(() => {
          console.log("Periodic refresh triggered");
          fetchGameSession();
        }, 30000);
      } else {
        console.log("Game is completed, skipping periodic refresh");
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, gameSession]);

  const fetchGameSession = async () => {
    try {
      const session = await ApiService.getGameSession(userId);
      console.log("Fetched game session:", session);
      console.log("Session remaining lives:", session.remainingLives);

      setGameSession(session);
      const livesToSet = session.remainingLives ?? 10;
      console.log("Setting remaining lives to:", livesToSet);
      setRemainingLives(livesToSet); // Update remainingLives from session

      // Update board state from session
      setBoardState(boardFromSession(session.guesses || []));

      return session;
    } catch (err) {
      console.error("Error fetching game session:", err);
      setError(getUserFriendlyError(err));
      return null;
    }
  };

  const createGameSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await ApiService.createGameSession(userId);
      console.log("Created game session:", session);
      console.log("New session remaining lives:", session.remainingLives);

      setGameSession(session);
      const livesToSet = session.remainingLives ?? 10;
      console.log("Setting initial remaining lives to:", livesToSet);
      setRemainingLives(livesToSet); // Update remainingLives from new session

      // Initialize board state from new session
      setBoardState(boardFromSession(session.guesses || []));

      navigate("/game");
    } catch (err) {
      setError(getUserFriendlyError(err));
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
      setError(getUserFriendlyError(err));
      console.error("Error getting hint:", err);
      // Re-throw the error so HintsCorner can handle modal closing
      throw err;
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
        console.log(
          "Updating remaining lives from response:",
          response.remainingLives
        );
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
        console.log("Final remaining lives state:", response.remainingLives);
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
      setError(getUserFriendlyError(err));
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
    setRemainingLives(null); // Reset to null
    setBoardState([]); // Reset board state
    setError(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading game session..." />;
  }

  return (
    <>
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
                remainingLives={remainingLives ?? 10}
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

      {/* Show error as overlay toast */}
      {error && <ErrorDisplay error={error} onRetry={handleCloseError} />}
    </>
  );
};
export default App;
