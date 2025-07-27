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
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Mock user ID for demo - in real app, get from auth context
  const userId = TEST_CONFIG.DEMO_USER_ID;

  // Persist game state to sessionStorage
  useEffect(() => {
    // Don't clear sessionStorage during initial load - we might be trying to restore
    if (isInitialLoad && !gameSession) {
      return;
    }

    if (gameSession) {
      sessionStorage.setItem("gameSession", JSON.stringify(gameSession));
    } else {
      sessionStorage.removeItem("gameSession");
    }
  }, [gameSession, isInitialLoad]);

  useEffect(() => {
    // Don't clear sessionStorage during initial load - we might be trying to restore
    if (isInitialLoad && remainingLives === null) {
      return;
    }

    if (remainingLives !== null) {
      sessionStorage.setItem("remainingLives", remainingLives.toString());
    } else {
      sessionStorage.removeItem("remainingLives");
    }
  }, [remainingLives, isInitialLoad]);

  useEffect(() => {
    // Don't save empty board during initial load
    if (isInitialLoad && boardState.length === 0) {
      return;
    }

    sessionStorage.setItem("boardState", JSON.stringify(boardState));
  }, [boardState, isInitialLoad]);

  // Check for existing session on mount
  useEffect(() => {
    if (!sessionChecked && location.pathname === "/game") {
      setLoading(true);

      // First, try to restore from sessionStorage
      const storedSession = sessionStorage.getItem("gameSession");
      const storedLives = sessionStorage.getItem("remainingLives");
      const storedBoard = sessionStorage.getItem("boardState");

      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          const lives = storedLives ? parseInt(storedLives) : 10;
          const board = storedBoard ? JSON.parse(storedBoard) : [];

          setGameSession(session);
          setRemainingLives(lives);
          setBoardState(board);
          setSessionChecked(true);
          setIsInitialLoad(false);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to restore session from storage:", e);
        }
      }

      // If no stored session, try to fetch from API
      fetchGameSession().then((session) => {
        if (!session) {
          navigate("/home", { replace: true });
        }
        setSessionChecked(true);
        setIsInitialLoad(false);
        setLoading(false);
      });
    } else if (!sessionChecked) {
      setSessionChecked(true);
      setIsInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, sessionChecked]);

  // Refresh session periodically when on game page
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (location.pathname === "/game" && gameSession) {
      // Only refresh if game is still in progress to avoid resetting completed game state
      if (gameSession.gameStatus === "IN_PROGRESS") {
        intervalId = setInterval(() => {
          fetchGameSession();
        }, 30000);
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

      setGameSession(session);
      const livesToSet = session.remainingLives ?? 10;
      setRemainingLives(livesToSet);

      // Update board state from session
      setBoardState(boardFromSession(session.guesses || []));

      return session;
    } catch (err) {
      console.error("Error fetching game session:", err);
      // Don't set error state during initial session check
      if (sessionChecked) {
        setError(getUserFriendlyError(err));
      }
      return null;
    }
  };

  const createGameSession = async () => {
    setLoading(true);
    setError(null);
    setIsInitialLoad(false); // Mark that we're no longer in initial load

    try {
      const session = await ApiService.createGameSession(userId);

      setGameSession(session);
      const livesToSet = session.remainingLives ?? 10;
      setRemainingLives(livesToSet);

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
    try {
      // Add optimistic update - show guess with loading state
      const optimisticGuess: BoardGuess = {
        guessedWord,
        correctPositions: [],
        missedPositions: [],
        aiResponse: "",
        isSubmitting: true,
      };

      setBoardState((prev) => [...prev, optimisticGuess]);

      const response = await ApiService.submitGuess(userId, guessedWord);

      // Create the new guess from the response
      const newGuess: BoardGuess = {
        guessedWord: response.guessedWord || guessedWord,
        correctPositions: response.correctPositions || [],
        missedPositions: response.missedPositions || [],
        aiResponse: response.aiResponse || "",
      };

      // Update board state - replace the optimistic guess with the real one
      setBoardState((prev) => [...prev.slice(0, -1), newGuess]);

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
        setGameSession(updatedSession);
      }
    } catch (err) {
      // Remove optimistic guess on error
      setBoardState((prev) => prev.slice(0, -1));
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

    // Clear session storage
    sessionStorage.removeItem("gameSession");
    sessionStorage.removeItem("remainingLives");
    sessionStorage.removeItem("boardState");
  };

  const handleCloseError = () => {
    setError(null);
  };

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
            !sessionChecked || loading ? (
              <LoadingSpinner message="Loading game session..." />
            ) : gameSession ? (
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
