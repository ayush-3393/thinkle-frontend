import React from "react";
import { Lightbulb, Heart, Trophy, Target } from "lucide-react";
import "./Rules.css";

const Rules: React.FC = () => {
  return (
    <div className="game-rules">
      <h2 className="rules-title">Game Rules</h2>
      <div className="rules-grid">
        <div className="rule-item">
          <div className="rule-icon">
            <Lightbulb size={20} />
          </div>
          <div className="rule-text">
            <strong>2 Hints Maximum</strong>
            <span>Use them strategically</span>
          </div>
        </div>

        <div className="rule-item">
          <div className="rule-icon">
            <Heart size={20} />
          </div>
          <div className="rule-text">
            <strong>3 Lives per Hint</strong>
            <span>Each hint costs 3 lives</span>
          </div>
        </div>

        <div className="rule-item">
          <div className="rule-icon">
            <Target size={20} />
          </div>
          <div className="rule-text">
            <strong>1 Life per Wrong Guess</strong>
            <span>Choose carefully</span>
          </div>
        </div>

        <div className="rule-item">
          <div className="rule-icon">
            <Trophy size={20} />
          </div>
          <div className="rule-text">
            <strong>Win by Guessing Correctly</strong>
            <span>Find the word to win!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
