export interface GuessResponse {
  guessedWord: string;
  correctPositions: number[];
  missedPositions: number[];
  aiResponse: string;
}

export interface GuessRequest {
  userId: number;
  guessedWord: string;
}
