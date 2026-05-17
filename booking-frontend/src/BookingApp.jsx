import { useEffect, useMemo, useRef } from "react";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import RoomsSidebar from "./components/RoomsSidebar";
import TopNavigation from "./components/TopNavigation";
import { useBooking } from "./context/BookingContext";
import { useAuth } from "./context/AuthContext";
import { useRoomContext } from "./context/RoomContext";

function BookingApp() {
  const roomsFetchedRef = useRef(false);
  const { selectedRoomId, setSelectedRoomId } = useRoomContext();
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
  const { isAuthenticated } = useAuth();

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

  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.id === selectedRoomId);
  }, [rooms, selectedRoomId]);

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
            authenticated={isAuthenticated}
            selectedRoomId={selectedRoomId}
            submitting={submitting}
            onCreateBooking={handleCreateBooking}
          />
        </main>
      </div>
    </div>
  );
}

export default BookingApp;
