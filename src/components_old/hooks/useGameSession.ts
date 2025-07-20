import { useEffect } from "react";
import { createGameSession } from "../../network/api/GameSessionApiCalls";
import { useApiCall } from "../../network/hooks/useApiCall";
import {
  CreateGameSessionRequest,
  CreateGameSessionResponse,
} from "../../network/types/GameSessionInterfaces";

export const useGameSession = () => {
  const {
    data: gameSession,
    loading: isCreatingSession,
    error: sessionError,
    execute: createSession,
  } = useApiCall<CreateGameSessionRequest, CreateGameSessionResponse | null>(
    createGameSession
  );

  useEffect(() => {
    createSession({ userId: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Safe in custom hook

  return {
    gameSession,
    isCreatingSession,
    sessionError,
    retryCreateSession: () => createSession({ userId: 1 }),
  };
};
