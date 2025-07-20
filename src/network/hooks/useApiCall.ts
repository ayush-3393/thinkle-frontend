import { useState } from "react";
import { BaseResponse } from "../types/BaseType";
import { getErrorMessage, isApiCallSuccess } from "../helpers";

interface UseApiCallResult<TRequest, TResponse> {
  data: TResponse | null;
  loading: boolean;
  error: string;
  execute: (request: TRequest) => Promise<void>;
  reset: () => void;
}

export const useApiCall = <TRequest, TResponse>(
  apiFunction: (request: TRequest) => Promise<BaseResponse<TResponse>>
): UseApiCallResult<TRequest, TResponse> => {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const execute = async (request: TRequest) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFunction(request);

      if (isApiCallSuccess(response)) {
        setData(response.data);
        setError("");
      } else {
        setData(null);
        setError(getErrorMessage(response));
      }
    } catch (error) {
      setData(null);
      setError(
        "Unexpected error: " +
          (error instanceof Error ? error.message : "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError("");
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
};
