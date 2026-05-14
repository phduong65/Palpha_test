import { useEffect, useMemo, useRef, useState } from "react";
import AuthModal from "./components/AuthModal";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import RoomsSidebar from "./components/RoomsSidebar";
import TopNavigation from "./components/TopNavigation";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookingProvider, useBooking } from "./context/BookingContext";
import { RoomProvider, useRoomContext } from "./context/RoomContext";
import "./App.css";

function BookingApp() {
  const roomsFetchedRef = useRef(false);
  const { selectedRoomId, setSelectedRoomId } = useRoomContext();
  const { isAuthenticated } = useAuth(); // giữ lại nếu TopNavigation cần
  const {
    rooms,
    bookingsByRoom,
    bookingsLoading,
    submitting,
    errorMessage,
    fetchRooms,
    fetchBookingsByRoom,
    createBooking,
    deleteBooking,
  } = useBooking();

  useEffect(() => {
    if (roomsFetchedRef.current) return;
    roomsFetchedRef.current = true;
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId, setSelectedRoomId]);

  useEffect(() => {
    if (selectedRoomId) {
      fetchBookingsByRoom(selectedRoomId);
    }
  }, [selectedRoomId, fetchBookingsByRoom]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId),
    [rooms, selectedRoomId],
  );
  const bookings = selectedRoomId ? bookingsByRoom[selectedRoomId] || [] : [];

  const handleCreateBooking = (values) =>
    createBooking({
      roomId: selectedRoomId,
      userName: values.userName,
      startTime: values.startTime,
      endTime: values.endTime,
    });

  const handleDeleteBooking = (bookingId) =>
    deleteBooking({ roomId: selectedRoomId, bookingId });
  return (
    <div className="booking-page">
      <TopNavigation />

      <div className="app-shell">
        <RoomsSidebar />

        <main className="booking-panel">
          <header className="booking-header">
            <div>
              <p className="eyebrow">Phòng đang chọn</p>
              <h2>{selectedRoom?.name || "Không có phòng nào được chọn"}</h2>
            </div>
          </header>

          {errorMessage && <div className="error-box">{errorMessage}</div>}

          <BookingList
            bookings={bookings}
            bookingsLoading={bookingsLoading}
            canManage={true}
            submitting={submitting}
            onDelete={handleDeleteBooking}
          />

          <BookingForm
            selectedRoomId={selectedRoomId}
            submitting={submitting}
            onCreateBooking={handleCreateBooking}
          />
        </main>
      </div>
    </div>
  );
}

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

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

export default App;
