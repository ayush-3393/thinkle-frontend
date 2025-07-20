// components/ErrorDisplay.tsx
import React from "react";
import "./ErrorDisplay.css";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="error-display">
      <div className="error-container">
        <div className="error-icon">❌</div>
        <p className="error-message">{error}</p>
        <button onClick={onRetry} className="error-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
