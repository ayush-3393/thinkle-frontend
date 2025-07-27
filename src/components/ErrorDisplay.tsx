// components/ErrorDisplay.tsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import "./ErrorDisplay.css";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="error-display">
      <div className="error-container">
        <div className="error-content">
          <AlertTriangle className="error-icon" size={20} />
          <div className="error-text">
            <p className="error-message">{error}</p>
            <button onClick={onRetry} className="error-close">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
