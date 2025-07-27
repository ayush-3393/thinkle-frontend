// types/apiError.ts

export class ApiError extends Error {
  public statusCode: number;
  public apiMessage: string;

  constructor(message: string, statusCode: number = -1, apiMessage?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.apiMessage = apiMessage || message;
  }

  // Static method to create ApiError from API response
  static fromApiResponse(response: {
    statusCode?: number;
    message?: string;
    data?: any;
  }): ApiError {
    const statusCode = response.statusCode ?? -1;
    const apiMessage = response.message || "Unknown API error";
    return new ApiError(apiMessage, statusCode, apiMessage);
  }

  // Get user-friendly message
  getUserMessage(): string {
    return this.apiMessage;
  }
}

// Helper function to extract error message from various error types
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.getUserMessage();
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
};
