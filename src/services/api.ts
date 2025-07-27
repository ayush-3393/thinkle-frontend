// services/api.ts
import {
  BaseResponse,
  CreateGameSessionRequest,
  CreateGameSessionResponse,
  GetHintRequest,
  GetHintResponse,
  GuessRequest,
  SignUpRequest,
  LoginRequest,
  AuthResponse,
} from "../types/interfaces";
import {
  CREATE_GAME_SESSION_URL,
  GET_HINT_URL,
  SUBMIT_GUESS_URL,
  REGISTER_URL,
  LOGIN_URL,
} from "../constants/apiUrls";
import { ApiError } from "../types/apiError";

export class ApiService {
  // Token management
  static getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  static setToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  static removeToken(): void {
    localStorage.removeItem("authToken");
  }

  static getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    console.log("getAuthHeaders called", {
      token: token ? "present" : "missing",
    });

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Authorization header added");
    } else {
      console.log("No token available for Authorization header");
    }

    return headers;
  }

  // Authentication methods
  static async register(signUpRequest: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpRequest),
      });

      const result: BaseResponse<AuthResponse> = await response.json();

      if (result.statusCode !== 0) {
        throw ApiError.fromApiResponse(result);
      }

      // Store the token
      this.setToken(result.data.token);

      return result.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  static async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });

      const result: BaseResponse<AuthResponse> = await response.json();

      console.log("Raw login API result:", JSON.stringify(result, null, 2));

      if (result.statusCode !== 0) {
        throw ApiError.fromApiResponse(result);
      }

      // Store the token
      this.setToken(result.data.token);

      console.log("Login API returning:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  static logout(): void {
    this.removeToken();
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== "";
  }

  static async createGameSession(
    userId: number
  ): Promise<CreateGameSessionResponse> {
    try {
      const request: CreateGameSessionRequest = { userId };
      console.log("createGameSession request:", request);
      console.log("CREATE_GAME_SESSION_URL:", CREATE_GAME_SESSION_URL);

      // Uncomment this for real API call
      const response = await fetch(CREATE_GAME_SESSION_URL, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log("createGameSession response status:", response.status);

      const result: BaseResponse<CreateGameSessionResponse> =
        await response.json();

      console.log("createGameSession result:", result);

      if (result.statusCode !== 0) {
        throw ApiError.fromApiResponse(result);
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

  static async getHint(
    userId: number,
    hintType: string
  ): Promise<GetHintResponse> {
    try {
      const request: GetHintRequest = { userId, hintType };

      // Uncomment this for real API call
      const response = await fetch(GET_HINT_URL, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const result: BaseResponse<GetHintResponse> = await response.json();

      if (result.statusCode !== 0) {
        throw ApiError.fromApiResponse(result);
      }

      return result.data;

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
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const result: BaseResponse<CreateGameSessionResponse> =
        await response.json();

      if (result.statusCode !== 0) {
        throw ApiError.fromApiResponse(result);
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching game session:", error);
      throw error;
    }
  }

  static async submitGuess(userId: number, guessedWord: string): Promise<any> {
    // Changed to any to see what we actually get
    try {
      const request: GuessRequest = { userId, guessedWord };

      const response = await fetch(SUBMIT_GUESS_URL, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const result: BaseResponse<any> = await response.json();

      if (result.statusCode !== 0) {
        throw ApiError.fromApiResponse(result);
      }

      console.log("Raw API response for submitGuess:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error submitting guess:", error);
      throw error;
    }
  }
}
