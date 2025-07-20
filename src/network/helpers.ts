import { BaseResponse } from "./types/BaseType";

export const isApiCallSuccess = <T>(response: BaseResponse<T>): boolean => {
  return response.statusCode === 0;
};

export const isNetworkError = <T>(response: BaseResponse<T>): boolean => {
  return response.statusCode === -1;
};

export const getErrorMessage = <T>(response: BaseResponse<T>): string => {
  if (isNetworkError(response)) {
    return "Network error: Please check your internet connection and try again.";
  }
  return response.message || "An unknown error occurred";
};
