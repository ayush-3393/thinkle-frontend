// types/interfaces.ts

export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export enum ResponseStatus {
  SUCCESS = 0,
  FAILURE = 1,
}

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

export interface GuessResponse {
  guessedWord: string;
  correctPositions: number[];
  missedPositions: number[];
  aiResponse: string;
  remainingLives: number;
  gameStatus: GameStatus;
}

export interface GuessRequest {
  userId: number;
  guessedWord: string;
}

export interface GetHintRequest {
  userId: number;
  hintType: string;
}

export interface GetHintResponse {
  hintText: string;
  remainingLives: number;
}

export interface HintType {
  type: string;
  displayName: string;
}

export interface CreateHintTypeRequest {
  type: string;
  displayName: string;
}

export interface UpdateHintTypeRequest {
  currentType: string;
  updatedType: string;
  updatedDisplayName: string;
}

export interface DeleteHintTypeRequest {
  type: string;
}

export interface ReactivateHintTypeRequest {
  type: string;
}

export interface CreateHintTypeResponse {
  type: string;
  displayName: string;
}

export interface UpdateHintTypeResponse {
  oldHintType: HintType;
  updatedHintType: HintType;
}

export interface DeleteHintTypeResponse {
  type: string;
  displayName: string;
}

export interface ReactivateHintTypeResponse {
  type: string;
  displayName: string;
}

// Authentication interfaces
export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  message: string;
  userInfo: UserInfo;
}
