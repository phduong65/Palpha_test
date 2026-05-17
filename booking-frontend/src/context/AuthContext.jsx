import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api/axios";
import { getErrorMessage } from "../utils/booking";

const TOKEN_KEY = "booking_auth_token";
const USER_KEY = "booking_auth_user";

const AuthContext = createContext(null);

function readStoredUser() {
  const value = localStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || "",
  );
  const [user, setUser] = useState(() => readStoredUser());
  const [sessionChecking, setSessionChecking] = useState(Boolean(token));
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const clearAuthError = useCallback(() => setAuthError(""), []);

  const saveSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (!token) {
        setSessionChecking(false);
        return;
      }

      setSessionChecking(true);

      try {
        const response = await api.get("/user");

        if (!cancelled) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data));
          setUser(response.data);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setSessionChecking(false);
        }
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [clearSession, token]);

  const login = useCallback(
    async ({ email, password }) => {
      setAuthLoading(true);
      setAuthError("");

      try {
        const response = await api.post("/login", { email, password });
        saveSession(response.data.token, response.data.user);
        setAuthLoading(false);
        return { ok: true };
      } catch (error) {
        setAuthLoading(false);
        setAuthError(getErrorMessage(error, "Đăng nhập thất bại"));
        return { ok: false };
      }
    },
    [saveSession],
  );

  const registerUser = useCallback(
    async ({ name, email, password, passwordConfirmation }) => {
      setAuthLoading(true);
      setAuthError("");

      try {
        const response = await api.post("/register", {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        saveSession(response.data.token, response.data.user);
        setAuthLoading(false);
        return { ok: true };
      } catch (error) {
        setAuthLoading(false);
        setAuthError(getErrorMessage(error, "Đăng ký thất bại"));
        return { ok: false };
      }
    },
    [saveSession],
  );

  const logout = useCallback(async () => {
    setAuthLoading(true);
    setAuthError("");

    try {
      if (token) {
        await api.post("/logout");
      }
    } catch {
      // Vẫn xóa phiên ở client nếu token trên server đã hết hạn.
    }

    clearSession();
    setAuthLoading(false);
  }, [clearSession, token]);

  const value = useMemo(
    () => ({
      token,
      user,
      sessionChecking,
      authLoading,
      authError,
      isAuthenticated: Boolean(token),
      clearAuthError,
      login,
      logout,
      registerUser,
    }),
    [
      token,
      user,
      sessionChecking,
      authLoading,
      authError,
      clearAuthError,
      login,
      logout,
      registerUser,
    ],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
