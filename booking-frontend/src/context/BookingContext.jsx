import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api from "../api/axios";
import {
  extractData,
  formatToApiDateTime,
  getErrorMessage,
} from "../utils/booking";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [bookingsByRoom, setBookingsByRoom] = useState({});
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = useCallback(() => setErrorMessage(""), []);

  const fetchRooms = useCallback(async () => {
    setRoomsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.get("/rooms");
      setRooms(extractData(response));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Không thể lấy danh sách phòng"));
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  const fetchBookingsByRoom = useCallback(async (roomId) => {
    if (!roomId) {
      return;
    }

    setBookingsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.get(`/rooms/${roomId}/bookings`);
      setBookingsByRoom((current) => ({
        ...current,
        [roomId]: extractData(response),
      }));
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Không thể tải danh sách đặt phòng"),
      );
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  const createBooking = useCallback(
    async ({ roomId, userName, startTime, endTime }) => {
      setSubmitting(true);
      setErrorMessage("");

      try {
        await api.post("/bookings", {
          room_id: roomId,
          user_name: userName,
          start_time: formatToApiDateTime(startTime),
          end_time: formatToApiDateTime(endTime),
        });
        await fetchBookingsByRoom(roomId);
        return { ok: true };
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Không thể đặt phòng"));
        return { ok: false };
      } finally {
        setSubmitting(false);
      }
    },
    [fetchBookingsByRoom],
  );

  const deleteBooking = useCallback(
    async ({ roomId, bookingId }) => {
      setSubmitting(true);
      setErrorMessage("");

      try {
        await api.delete(`/bookings/${bookingId}`);
        await fetchBookingsByRoom(roomId);
        return { ok: true };
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Không thể xóa đặt phòng"));
        return { ok: false };
      } finally {
        setSubmitting(false);
      }
    },
    [fetchBookingsByRoom],
  );

  const value = useMemo(
    () => ({
      rooms,
      roomsLoading,
      bookingsByRoom,
      bookingsLoading,
      submitting,
      errorMessage,
      clearError,
      fetchRooms,
      fetchBookingsByRoom,
      createBooking,
      deleteBooking,
    }),
    [
      rooms,
      roomsLoading,
      bookingsByRoom,
      bookingsLoading,
      submitting,
      errorMessage,
      clearError,
      fetchRooms,
      fetchBookingsByRoom,
      createBooking,
      deleteBooking,
    ],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
