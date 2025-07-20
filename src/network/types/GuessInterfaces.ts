export interface GuessResponse {
  guessedWord: string;
  correctPositions: number[];
  missedPositions: number[];
  aiResponse: string;
}
