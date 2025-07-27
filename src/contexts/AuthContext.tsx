import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  UserInfo,
  AuthResponse,
  SignUpRequest,
  LoginRequest,
} from "../types/interfaces";
import { ApiService } from "../services/api";
import { getUserFriendlyError } from "../utils/errorUtils";

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (loginRequest: LoginRequest) => Promise<void>;
  register: (signUpRequest: SignUpRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility function to clear all auth data
  const clearAuthData = () => {
    console.log("Clearing all auth data");
    ApiService.removeToken();
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const storedToken = ApiService.getToken();
    const storedUser = localStorage.getItem("user");

    console.log("AuthContext initialization:", {
      storedToken: storedToken ? "present" : "missing",
      storedUser: storedUser ? storedUser : "missing",
    });

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user from localStorage:", parsedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        clearAuthData();
      }
    } else {
      // Clear any invalid stored data
      if (storedUser === "undefined" || !storedUser) {
        localStorage.removeItem("user");
      }
      if (!storedToken) {
        ApiService.removeToken();
      }
      setToken(null);
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  const login = async (loginRequest: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const authResponse: AuthResponse = await ApiService.login(loginRequest);

      console.log(
        "Login successful, full authResponse:",
        JSON.stringify(authResponse, null, 2)
      );
      console.log("authResponse.userInfo:", authResponse.userInfo);
      console.log("authResponse.user:", (authResponse as any).user);

      // Handle different possible response structures
      const userInfo = authResponse.userInfo || (authResponse as any).user;

      if (!userInfo) {
        throw new Error("No user information received from server");
      }

      setToken(authResponse.token);
      setUser(userInfo);

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(userInfo));

      console.log("User data stored:", userInfo);
    } catch (err) {
      const errorMessage = getUserFriendlyError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (signUpRequest: SignUpRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const authResponse: AuthResponse = await ApiService.register(
        signUpRequest
      );

      console.log(
        "Registration successful, full authResponse:",
        JSON.stringify(authResponse, null, 2)
      );
      console.log("authResponse.userInfo:", authResponse.userInfo);
      console.log("authResponse.user:", (authResponse as any).user);

      // Handle different possible response structures
      const userInfo = authResponse.userInfo || (authResponse as any).user;

      if (!userInfo) {
        throw new Error("No user information received from server");
      }

      setToken(authResponse.token);
      setUser(userInfo);

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(userInfo));

      console.log("User data stored:", userInfo);
    } catch (err) {
      const errorMessage = getUserFriendlyError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    ApiService.logout();
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setError(null);
  };

  const clearError = (): void => {
    setError(null);
  };

  // More robust authentication check
  const isAuthenticated = Boolean(
    ApiService.isAuthenticated() &&
      user !== null &&
      user !== undefined &&
      token !== null &&
      token !== undefined
  );

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
