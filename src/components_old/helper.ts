import { HintsInfoForSession } from "../network/types/GameSessionInterfaces";

/**
 * Check if a specific hint type has been used in the current session
 * @param hintType - The type of hint to check
 * @param hintsInfo - The hints information for the current session
 * @returns boolean - true if the hint type has been used, false otherwise
 */
export const isHintTypeUsed = (
  hintType: string,
  hintsInfo?: HintsInfoForSession
): boolean => {
  if (!hintsInfo?.usedHintDetails) return false;

  return hintsInfo.usedHintDetails.some((hint) => hint.hintType === hintType);
};

/**
 * Get the hint text for a specific hint type if it has been used
 * @param hintType - The type of hint to get text for
 * @param hintsInfo - The hints information for the current session
 * @returns string | null - The hint text if found, null if not used or not found
 */
export const getHintText = (
  hintType: string,
  hintsInfo?: HintsInfoForSession
): string | null => {
  if (!hintsInfo?.usedHintDetails) return null;

  const hintDetail = hintsInfo.usedHintDetails.find(
    (hint) => hint.hintType === hintType
  );

  return hintDetail ? hintDetail.hintText : null;
};
