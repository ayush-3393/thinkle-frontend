import { GuessResponse } from "./GuessInterfaces";
import { HintType } from "./HintTypeInterfaces";

export interface CreateGameSessionRequest {
  userId: number;
}

export interface CreateGameSessionResponse {
  remainingLives: number;
  gameStatus: GameStatus;
  hintsInfo: HintsInfoForSession;
  guesses: GuessResponse[];
  allHintTypes: HintType[];
}

export enum GameStatus {
  IN_PROGRESS = "IN_PROGRESS",
  WON = "WON",
  LOST = "LOST",
}

export interface HintsInfoForSession {
  numberOfHintsUsed: number;
  usedHintDetails: HintDetails[];
}

export interface HintDetails {
  hintType: string;
  hintText: string;
}
