import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LoginRequest, SignUpRequest } from "../../types/interfaces";
import LoadingSpinner from "../LoadingSpinner";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    // Sign up specific validations
    if (isSignUp) {
      if (!formData.username) {
        errors.username = "Username is required";
      } else if (formData.username.length < 3) {
        errors.username = "Username must be at least 3 characters long";
      } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
        errors.username =
          "Username can only contain letters, numbers, dots, hyphens and underscores";
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      // Strong password validation for sign up
      if (
        formData.password &&
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(
          formData.password
        )
      ) {
        errors.password =
          "Password must contain at least one uppercase letter, one lowercase letter, and one digit";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      if (isSignUp) {
        const signUpRequest: SignUpRequest = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };
        await register(signUpRequest);
      } else {
        const loginRequest: LoginRequest = {
          email: formData.email,
          password: formData.password,
        };
        await login(loginRequest);
      }
    } catch (err) {
      // Error is handled by the auth context
      console.error("Authentication error:", err);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });
    setValidationErrors({});
    clearError();
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message={isSignUp ? "Creating your account..." : "Signing you in..."}
      />
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="app-title">Thinkle</h1>
          <p className="app-subtitle">Test your word guessing skills!</p>
        </div>

        <div className="auth-form-container">
          <div className="auth-toggle">
            <button
              type="button"
              className={`toggle-btn ${!isSignUp ? "active" : ""}`}
              onClick={() => !isSignUp || toggleMode()}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`toggle-btn ${isSignUp ? "active" : ""}`}
              onClick={() => isSignUp || toggleMode()}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={validationErrors.username ? "error" : ""}
                  placeholder="Enter your username"
                />
                {validationErrors.username && (
                  <span className="error-message">
                    {validationErrors.username}
                  </span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={validationErrors.email ? "error" : ""}
                placeholder="Enter your email"
              />
              {validationErrors.email && (
                <span className="error-message">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={validationErrors.password ? "error" : ""}
                placeholder="Enter your password"
              />
              {validationErrors.password && (
                <span className="error-message">
                  {validationErrors.password}
                </span>
              )}
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={validationErrors.confirmPassword ? "error" : ""}
                  placeholder="Confirm your password"
                />
                {validationErrors.confirmPassword && (
                  <span className="error-message">
                    {validationErrors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" className="link-btn" onClick={toggleMode}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
