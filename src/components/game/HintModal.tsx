import React from "react";
import { HintType } from "../../network/types/HintTypeInterfaces";
import "./HintModal.css";
import { HintsInfoForSession } from "../../network/types/GameSessionInterfaces";
import { isHintTypeUsed, getHintText } from "../helper";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintType: HintType | null;
  onGetHint?: (hintType: string) => void;
  hintsInfo?: HintsInfoForSession;
}

const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hintType,
  onGetHint,
  hintsInfo,
}) => {
  if (!isOpen || !hintType) return null;

  const isUsed = isHintTypeUsed(hintType.type, hintsInfo);
  const rawHintText = getHintText(hintType.type, hintsInfo);

  const handleGetHint = () => {
    if (hintType && onGetHint) {
      onGetHint(hintType.type);
    }
  };

  console.log("HINT_TEXT", rawHintText);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{hintType.displayName}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>{hintType.displayName || "Hint information"}</p>

          {isUsed && rawHintText && (
            <div className="hint-text">
              {rawHintText.split("\n").map((line, index) => (
                <p key={index} style={{ marginBottom: "8px" }}>
                  {line}
                </p>
              ))}
            </div>
          )}

          {!isUsed && (
            <p style={{ color: "#555" }}>
              You haven’t used this hint yet. Click below to get it.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          {!isUsed && (
            <button className="btn-primary" onClick={handleGetHint}>
              Get Hint
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HintModal;
