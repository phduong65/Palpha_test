import { create } from "zustand";
import api from "../api/axios";

const TOKEN_KEY = "booking_auth_token";
const USER_KEY = "booking_auth_user";

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

function getErrorMessage(error, fallback = "Authentication failed") {
  const errors = error?.response?.data?.errors;

  if (errors && typeof errors === "object") {
    const firstField = Object.values(errors)[0];
    if (Array.isArray(firstField) && firstField.length > 0) {
      return firstField[0];
    }
  }

  return error?.response?.data?.message || error?.message || fallback;
}

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY) || "",
  user: readStoredUser(),
  authLoading: false,
  authError: "",

  isAuthenticated: () => Boolean(get().token),
  clearAuthError: () => set({ authError: "" }),

  login: async ({ email, password }) => {
    set({ authLoading: true, authError: "" });

    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, authLoading: false });

      return { ok: true };
    } catch (error) {
      set({
        authLoading: false,
        authError: getErrorMessage(error, "Login failed"),
      });
      return { ok: false };
    }
  },

  registerUser: async ({ name, email, password, passwordConfirmation }) => {
    set({ authLoading: true, authError: "" });

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      const { token, user } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, authLoading: false });

      return { ok: true };
    } catch (error) {
      set({
        authLoading: false,
        authError: getErrorMessage(error, "Register failed"),
      });
      return { ok: false };
    }
  },

  logout: async () => {
    const token = get().token;
    set({ authLoading: true, authError: "" });

    try {
      if (token) {
        await api.post("/logout");
      }
    } catch {
      // The local token should be cleared even if the server token is gone.
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: "", user: null, authLoading: false });
  },
}));
