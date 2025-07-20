// components/WordBoard.tsx
import React, { useState, useEffect, useRef } from "react";
import "./WordBoard.css";

interface WordBoardProps {
  onSubmitGuess: (word: string) => Promise<void>;
  disabled?: boolean;
}

const WordBoard: React.FC<WordBoardProps> = ({
  onSubmitGuess,
  disabled = false,
}) => {
  const [letters, setLetters] = useState<string[]>(["", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus on first empty input on component mount
  useEffect(() => {
    if (!disabled) {
      const firstEmptyIndex = letters.findIndex((letter) => letter === "");
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      } else if (letters.every((letter) => letter !== "")) {
        // All letters filled, no focus needed
      }
    }
  }, [letters, disabled]);

  const handleLetterChange = (index: number, value: string) => {
    if (disabled || isSubmitting) return;

    // Only allow single letters
    const letter = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    if (letter.length > 1) return;

    const newLetters = [...letters];
    newLetters[index] = letter;
    setLetters(newLetters);

    // Auto-focus next input if letter was entered
    if (letter && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (disabled || isSubmitting) return;

    if (event.key === "Backspace") {
      if (letters[index] === "" && index > 0) {
        // If current input is empty, move to previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newLetters = [...letters];
        newLetters[index] = "";
        setLetters(newLetters);
      }
    } else if (event.key === "Enter") {
      handleSubmit();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (disabled || isSubmitting) return;

    const word = letters.join("");
    if (word.length !== 5) {
      alert("Please enter a 5-letter word");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitGuess(word);
      // Clear the board after successful submission
      setLetters(["", "", "", "", ""]);
      // Focus on first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error("Error submitting guess:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = letters.every((letter) => letter !== "");

  return (
    <div className="word-board">
      <div className="letter-inputs">
        {letters.map((letter, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            value={letter}
            onChange={(e) => handleLetterChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="letter-input"
            maxLength={1}
            disabled={disabled || isSubmitting}
          />
        ))}
      </div>

      {isComplete && (
        <button
          onClick={handleSubmit}
          disabled={disabled || isSubmitting}
          className={`submit-button ${isSubmitting ? "submitting" : ""}`}
        >
          {isSubmitting ? "Submitting..." : "Submit Guess"}
        </button>
      )}
    </div>
  );
};

export default WordBoard;
