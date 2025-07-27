// components/HintsCorner.tsx
import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import { HintType, HintDetails } from "../types/interfaces";
import HintModal from "./HintModal";
import "./HintsCorner.css";

interface HintsCornerProps {
  hintTypes: HintType[];
  usedHints: HintDetails[];
  onGetHint: (hintType: string) => Promise<void>;
}

const HintsCorner: React.FC<HintsCornerProps> = ({
  hintTypes,
  usedHints,
  onGetHint,
}) => {
  const [selectedHint, setSelectedHint] = useState<HintType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleHintClick = (hintType: HintType) => {
    setSelectedHint(hintType);
    setIsModalOpen(true);
  };

  const handleGetHint = async (hintTypeString: string) => {
    setLoading(true);
    try {
      await onGetHint(hintTypeString);
      // Success - keep modal open to show the hint
    } catch (error) {
      // On error, close the modal so user can see the error toast
      console.log("Error caught in HintsCorner, closing modal");
      handleCloseModal();
      // Don't re-throw - error is already handled by App component
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHint(null);
  };

  return (
    <div className="hints-corner">
      <div className="hints-header">
        <Lightbulb className="hints-icon" size={24} />
        <h3 className="hints-title">Hints</h3>
      </div>

      <div className="hints-grid">
        {hintTypes.map((hintType) => {
          const isUsed = usedHints.some(
            (hint) => hint.hintType === hintType.type
          );
          return (
            <button
              key={hintType.type}
              onClick={() => handleHintClick(hintType)}
              className={`hint-button ${
                isUsed ? "hint-button-used" : "hint-button-unused"
              }`}
            >
              <div className="hint-button-name">{hintType.displayName}</div>
              {isUsed && <div className="hint-button-status">✓ Used</div>}
            </button>
          );
        })}
      </div>

      {selectedHint && (
        <HintModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          hintType={selectedHint}
          usedHints={usedHints}
          onGetHint={handleGetHint}
          loading={loading}
        />
      )}
    </div>
  );
};

export default HintsCorner;
