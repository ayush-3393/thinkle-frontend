import React, { useState } from "react";
import { HintType } from "../../network/types/HintTypeInterfaces";
import { HintsInfoForSession } from "../../network/types/GameSessionInterfaces";
import HintModal from "./HintModal";
import { isHintTypeUsed } from "../helper";
import "./HintsDisplay.css";

interface HintsDisplayProps {
  allHintTypes?: HintType[];
  hintsInfo?: HintsInfoForSession;
  onHintReceived?: (hintData: any) => void;
}

const HintsDisplay: React.FC<HintsDisplayProps> = ({
  allHintTypes,
  hintsInfo,
  onHintReceived,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHintType, setSelectedHintType] = useState<HintType | null>(
    null
  );

  const handleHintButtonClick = (hintType: HintType) => () => {
    setSelectedHintType(hintType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHintType(null);
  };

  const handleGetHint = (hintType: string) => {
    console.log("Getting hint for:", hintType);
    // call your API here and optionally call onHintReceived(hintData);
  };

  return (
    <div>
      <div className="hints-grid">
        {allHintTypes?.map((hintType) => (
          <button
            key={hintType.type}
            onClick={handleHintButtonClick(hintType)}
            className={isHintTypeUsed(hintType.type, hintsInfo) ? "used" : ""}
          >
            <div className="hint-type">
              <h3>{hintType.displayName}</h3>
            </div>
          </button>
        ))}
      </div>

      {isModalOpen && (
        <HintModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          hintType={selectedHintType}
          onGetHint={handleGetHint}
          hintsInfo={hintsInfo}
        />
      )}
    </div>
  );
};

export default HintsDisplay;
