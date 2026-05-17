import { useState } from "react";
import BookingApp from "./BookingApp";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { RoomProvider } from "./context/RoomContext";

function AuthGate() {
  const [authMode, setAuthMode] = useState("login");

  const { isAuthenticated, sessionChecking, clearAuthError } = useAuth();

  const switchAuthMode = (mode) => {
    clearAuthError();
    setAuthMode(mode);
  };
  
  if (sessionChecking) {
    return (
      <div className="booking-page auth-gate-page">
        <div className="auth-status">Đang kiểm tra đăng nhập...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="booking-page auth-gate-page">
        <AuthModal mode={authMode} onModeChange={switchAuthMode} locked />
      </div>
    );
  }

  return (
    <BookingProvider>
      <RoomProvider>
        <BookingApp />
      </RoomProvider>
    </BookingProvider>
  );
}

export default AuthGate;
