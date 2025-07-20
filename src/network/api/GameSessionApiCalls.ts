import { BaseResponse } from "../types/BaseType";
import { CreateGameSessionRequest, CreateGameSessionResponse } from "../types/GameSessionInterfaces";
import { CREATE_GAME_SESSION_URL } from "../url";

export const createGameSession = async (
  request: CreateGameSessionRequest
): Promise<BaseResponse<CreateGameSessionResponse | null>> => {
  try {
    const response = await fetch(CREATE_GAME_SESSION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Always parse the response, even for error status codes
    const data = await response.json();

    // Don't throw for 4xx/5xx - let the component handle the BaseResponse
    return data;
  } catch (error) {
    // Only handle network/JSON parsing errors
    return {
      statusCode: -1,
      message:
        error instanceof Error ? error.message : "Network error occurred",
      data: null,
    };
  }
};