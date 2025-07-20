import React, { useEffect, useState } from "react";
import { HintType } from "../../network/types/HintTypeInterfaces";
import "./HintModal.css";
import { HintsInfoForSession } from "../../network/types/GameSessionInterfaces";
import { isHintTypeUsed, getHintText } from "../helper";
import { useGetHint } from "../hooks/useGetHint";
import { GetHintResponse } from "../../network/types/HintsInterfaces";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintType: HintType | null;
  onGetHint?: (hintData: GetHintResponse) => void;
  hintsInfo?: HintsInfoForSession;
}

const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hintType,
  onGetHint,
  hintsInfo,
}) => {
  const [hasRequested, setHasRequested] = useState(false);
  const [hasNotifiedParent, setHasNotifiedParent] = useState(false);

  const isUsed = isHintTypeUsed(hintType?.type || "", hintsInfo);
  const rawHintText = getHintText(hintType?.type || "", hintsInfo);

  const { hintData, isLoading, error, retryGetHint } = useGetHint({
    hintType: hintType?.type || "",
    userId: 1, // Replace with actual user ID
  });

  const handleGetHint = () => {
    if (!hintType || isUsed || hasRequested) return;
    setHasRequested(true);
    retryGetHint();
  };

  // Notify parent once only when new hint is fetched
  useEffect(() => {
    if (
      !isUsed && // Only for new hints
      hintData?.hintText &&
      onGetHint &&
      !hasNotifiedParent
    ) {
      onGetHint(hintData);
      setHasNotifiedParent(true);
    }
  }, [hintData, onGetHint, isUsed, hasNotifiedParent]);

  if (!isOpen || !hintType) return null;

  const renderHintText = (text: string) => {
    return (
      <div className="hint-text">
        {text.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  const renderHintContent = () => {
    // Already used: display stored hint text
    if (isUsed && rawHintText) {
      return renderHintText(rawHintText);
    }

    // New hint: handle loading, error, fetched text
    if (hasRequested) {
      if (isLoading) return <p>Loading hint...</p>;
      if (error) return <p className="hint-error">Error: {error}</p>;
      if (hintData?.hintText) return renderHintText(hintData.hintText);
    }

    return (
      <p style={{ color: "#555" }}>
        You haven’t used this hint yet. Click below to get it.
      </p>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💡 {hintType.displayName}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{renderHintContent()}</div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          {!isUsed && !hintData?.hintText && (
            <button
              className="btn-primary"
              onClick={handleGetHint}
              disabled={isLoading || hasRequested}
            >
              {isLoading ? "Fetching..." : "Get Hint"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HintModal;
