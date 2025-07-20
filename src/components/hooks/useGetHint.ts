import { useEffect } from "react";
import { useApiCall } from "../../network/hooks/useApiCall";
import { getHintApiCall } from "../../network/api/HintApiCalls";
import {
  GetHintRequest,
  GetHintResponse,
} from "../../network/types/HintsInterfaces";

interface UseGetHintProps {
  userId: number;
  hintType: string;
}

/**
 * Custom hook for getting hints in the game
 * @param props - Object containing userId
 * @returns Object with hint data, loading state, error, and getHint function
 */
export const useGetHint = (props: UseGetHintProps) => {
  const { userId, hintType } = props;

  const {
    data: hintData,
    loading: isLoading,
    error,
    execute: executeGetHint,
  } = useApiCall<GetHintRequest, GetHintResponse | null>(getHintApiCall);

  useEffect(() => {
    executeGetHint({ hintType, userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Safe in custom hook

  return {
    hintData,
    isLoading,
    error,
    retryGetHint: () => executeGetHint({ hintType, userId }),
  };
};
