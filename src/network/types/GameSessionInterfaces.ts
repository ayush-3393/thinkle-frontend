import { GuessResponse } from "./GuessInterfaces";

export interface CreateGameSessionRequest {
  userId: number;
}

export interface CreateGameSessionResponse {
  remainingLives: number;
  gameStatus: GameStatus;
  hintsInfo: HintsInfoForSession;
  guesses: GuessResponse[];
}

export enum GameStatus {
  IN_PROGRESS = "IN_PROGRESS",
  WON = "WON",
  LOST = "LOST",
}

export interface HintsInfoForSession {
  numberOfHintsUsed: number;
  hintDetails: HintDetails[];
}

export interface HintDetails {
  hintType: string;
  hintText: string;
}
