// utils/errorUtils.ts

import { getErrorMessage } from "../types/apiError";

// Simple function to get error message from API response
// If no message from backend, show default message
export const getUserFriendlyError = (error: unknown): string => {
  const message = getErrorMessage(error);

  // Return the exact API message if it exists and is meaningful
  if (
    message &&
    message.trim().length > 0 &&
    !message.includes("undefined") &&
    !message.includes("null")
  ) {
    return message;
  }

  // Default fallback message
  return "Something went wrong. Please try again.";
};
