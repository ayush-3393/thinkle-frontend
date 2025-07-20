// services/api.ts
import {
  BaseResponse,
  CreateGameSessionRequest,
  CreateGameSessionResponse,
  GetHintRequest,
  GetHintResponse,
  GuessRequest,
} from "../types/interfaces";
import {
  CREATE_GAME_SESSION_URL,
  GET_HINT_URL,
  SUBMIT_GUESS_URL,
} from "../constants/apiUrls";

export class ApiService {
  static async createGameSession(
    userId: number
  ): Promise<CreateGameSessionResponse> {
    try {
      const request: CreateGameSessionRequest = { userId };

      // Uncomment this for real API call
      const response = await fetch(CREATE_GAME_SESSION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to create game session");
      }

      const result: BaseResponse<CreateGameSessionResponse> =
        await response.json();

      if (result.statusCode !== 0) {
        throw new Error(result.message || "Failed to create game session");
      }

      return result.data;

      // Mock implementation for demo
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      // return {
      //   remainingLives: 8,
      //   gameStatus: GameStatus.IN_PROGRESS,
      //   hintsInfo: {
      //     numberOfHintsUsed: 1,
      //     usedHintDetails: [
      //       {
      //         hintType: "category",
      //         hintText: "This word belongs to the category of animals.",
      //       },
      //     ],
      //   },
      //   guesses: [
      //     {
      //       guessedWord: "elephant",
      //       correctPositions: [0, 2],
      //       missedPositions: [1, 3, 4, 5, 6, 7],
      //       aiResponse:
      //         "Good guess! You got the first and third letters right.",
      //     },
      //   ],
      //   allHintTypes: [
      //     { type: "category", displayName: "Category" },
      //     { type: "length", displayName: "Word Length" },
      //     { type: "first_letter", displayName: "First Letter" },
      //     { type: "definition", displayName: "Definition" },
      //     { type: "rhyme", displayName: "Rhyming Word" },
      //     { type: "synonym", displayName: "Synonym" },
      //   ],
      // };
    } catch (error) {
      console.error("Error creating game session:", error);
      throw error;
    }
  }

  static async getHint(userId: number, hintType: string): Promise<string> {
    try {
      const request: GetHintRequest = { userId, hintType };

      // Uncomment this for real API call
      const response = await fetch(GET_HINT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to get hint");
      }

      const result: BaseResponse<GetHintResponse> = await response.json();

      if (result.statusCode !== 0) {
        throw new Error(result.message || "Failed to get hint");
      }

      return result.data.hintText;

      // Mock implementation for demo
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      // const mockHintTexts: { [key: string]: string } = {
      //   length: "The word has 5 letters.",
      //   first_letter: "The word starts with 'T'.",
      //   definition: "A large, slow-moving mammal with a shell.",
      //   rhyme: "It rhymes with 'hurdle'.",
      //   synonym: "Another word for this could be 'chelonian'.",
      // };

      // return (
      //   mockHintTexts[hintType] || "This is a helpful hint about the word."
      // );
    } catch (error) {
      console.error("Error getting hint:", error);
      throw error;
    }
  }

  static async getGameSession(
    userId: number
  ): Promise<CreateGameSessionResponse> {
    try {
      // For now, we'll use the create session endpoint to get fresh session data
      // In a real API, you might have a separate GET endpoint like /game/session/{userId}
      const request: CreateGameSessionRequest = { userId };

      const response = await fetch(CREATE_GAME_SESSION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch game session");
      }

      const result: BaseResponse<CreateGameSessionResponse> =
        await response.json();

      if (result.statusCode !== 0) {
        throw new Error(result.message || "Failed to fetch game session");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching game session:", error);
      throw error;
    }
  }

  static async submitGuess(
    userId: number,
    guessedWord: string
  ): Promise<CreateGameSessionResponse> {
    try {
      const request: GuessRequest = { userId, guessedWord };

      const response = await fetch(SUBMIT_GUESS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to submit guess");
      }

      const result: BaseResponse<CreateGameSessionResponse> =
        await response.json();

      if (result.statusCode !== 0) {
        throw new Error(result.message || "Failed to submit guess");
      }

      return result.data;
    } catch (error) {
      console.error("Error submitting guess:", error);
      throw error;
    }
  }
}
