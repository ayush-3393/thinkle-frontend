// types/gameBoard.ts
export interface BoardGuess {
  guessedWord: string;
  correctPositions: number[];
  missedPositions: number[];
  aiResponse: string;
  isSubmitting?: boolean; // For loading state
}

export interface GameBoardState {
  guesses: BoardGuess[];
  maxRows: number;
  maxCols: number;
}

export const createEmptyBoard = (): GameBoardState => ({
  guesses: [],
  maxRows: 6,
  maxCols: 5,
});

export const boardFromSession = (sessionGuesses: any[]): BoardGuess[] => {
  if (!Array.isArray(sessionGuesses)) {
    console.warn("sessionGuesses is not an array:", sessionGuesses);
    return [];
  }

  return sessionGuesses.map((guess, index) => {
    const boardGuess: BoardGuess = {
      guessedWord: guess.guessedWord || "",
      correctPositions: Array.isArray(guess.correctPositions)
        ? guess.correctPositions
        : [],
      missedPositions: Array.isArray(guess.missedPositions)
        ? guess.missedPositions
        : [],
      aiResponse: guess.aiResponse || "",
    };

    return boardGuess;
  });
};
