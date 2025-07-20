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
 * Custom hook for getting hints in the game.
 * Only triggers when `retryGetHint()` is called.
 */
export const useGetHint = (props: UseGetHintProps) => {
  const { userId, hintType } = props;

  const {
    data: hintData,
    loading: isLoading,
    error,
    execute: executeGetHint,
  } = useApiCall<GetHintRequest, GetHintResponse | null>(getHintApiCall);

  return {
    hintData,
    isLoading,
    error,
    retryGetHint: () => executeGetHint({ hintType, userId }),
  };
};
