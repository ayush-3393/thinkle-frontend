// components/HintModal.tsx
import React from "react";
import ReactDOM from "react-dom";
import { HintType, HintDetails } from "../types/interfaces";
import { X } from "lucide-react";
import "./HintModal.css";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintType: HintType;
  usedHints: HintDetails[];
  onGetHint: (hintType: string) => Promise<void>;
  loading: boolean;
}

const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hintType,
  usedHints,
  onGetHint,
  loading,
}) => {
  const usedHint = usedHints.find((hint) => hint.hintType === hintType.type);

  if (!isOpen) return null;

  const modalContent = (
    <div className="hint-modal-overlay">
      <div className="hint-modal">
        <div className="hint-modal-header">
          <h3 className="hint-modal-title">{hintType.displayName}</h3>
          <button onClick={onClose} className="hint-modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="hint-modal-content">
          {usedHint ? (
            <div>
              <p className="hint-label">Hint:</p>
              <div className="hint-text-container">
                <p className="hint-text">{usedHint.hintText}</p>
              </div>
            </div>
          ) : (
            <div className="hint-get-section">
              <p className="hint-get-description">
                You haven't used this hint yet. Would you like to get it?
              </p>
              <button
                onClick={() => onGetHint(hintType.type)}
                disabled={loading}
                className="hint-get-button"
              >
                {loading ? "Getting Hint..." : "Get Hint"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal using portal to document.body to escape parent constraints
  return ReactDOM.createPortal(modalContent, document.body);
};

export default HintModal;
