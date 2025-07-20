import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  title?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  title = "Thinkle Game",
  showBackButton = true,
  backButtonText = "← Back to Home",
  onBackClick,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate("/home");
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "#f8f9fa",
        padding: "10px 20px",
        borderBottom: "1px solid #dee2e6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {showBackButton ? (
        <button
          onClick={handleBackClick}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {backButtonText}
        </button>
      ) : (
        <div style={{ width: "100px" }}></div>
      )}
      <h2 style={{ margin: 0, color: "#495057" }}>{title}</h2>
      <div style={{ width: "100px" }}></div> {/* Spacer for centering */}
    </nav>
  );
};

export default Navbar;
