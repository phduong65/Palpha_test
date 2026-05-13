import { create } from "zustand";
import api from "../api/axios";

// Hàm kiểm tra và trích xuất dữ liệu từ response của API, đảm bảo luôn trả về mảng rỗng
// Nếu không có dữ liệu hoặc dữ liệu không đúng định dạng
function extractData(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

function formatToApiDateTime(value) {
  if (!value) {
    return "";
  }

  const normalized = value.trim().replace("T", " ");
  return normalized.length === 16 ? `${normalized}:00` : normalized;
}

function getErrorMessage(error, fallback = "Request failed") {
  const errors = error?.response?.data?.errors;

  if (errors && typeof errors === "object") {
    const firstField = Object.values(errors)[0];
    if (Array.isArray(firstField) && firstField.length > 0) {
      return firstField[0];
    }
  }

  return error?.response?.data?.message || error?.message || fallback;
}

export const useBookingStore = create((set, get) => ({
  rooms: [], // Tạo state để lưu danh sách phòng
  roomsLoading: false, // Tạo state để lưu trạng thái tải danh sách phòng
  bookingsByRoom: {}, // Tạo state để lưu danh sách đặt phòng theo phòng
  bookingsLoading: false, // Tạo state để lưu trạng thái tải danh sách đặt phòng
  submitting: false, // Tạo state để lưu trạng thái submit
  errorMessage: "", // Tạo state để lưu thông báo lỗi

  clearError: () => set({ errorMessage: "" }),

  // Hàm để gọi API lấy danh sách phòng
  fetchRooms: async () => {
    set({ roomsLoading: true, errorMessage: "" });
    try {
      const response = await api.get("/rooms"); // Gọi API lấy danh sách phòng
      set({ rooms: extractData(response), roomsLoading: false });
    } catch (error) {
      set({
        roomsLoading: false,
        errorMessage: getErrorMessage(error, "Không thể lấy danh sách phòng"),
      });
    }
  },

  fetchBookingsByRoom: async (roomId) => {
    // Nếu không có roomId, không cần gọi API
    if (!roomId) {
      return;
    }

    set({ bookingsLoading: true, errorMessage: "" });

    try {
      // Gọi API lấy danh sách đặt phòng theo phòng
      const response = await api.get(`/rooms/${roomId}/bookings`);
      const bookings = extractData(response);
      // Cập nhật state với danh sách đặt phòng mới cho phòng tương ứng
      set((state) => ({
        bookingsLoading: false,
        bookingsByRoom: {
          ...state.bookingsByRoom,
          [roomId]: bookings,
        },
      }));
    } catch (error) {
      set({
        bookingsLoading: false,
        errorMessage: getErrorMessage(
          error,
          "Không thể tải danh sách đặt phòng",
        ),
      });
    }
  },

  // Hàm để tạo đặt phòng mới
  createBooking: async ({ roomId, userName, startTime, endTime }) => {
    set({ submitting: true, errorMessage: "" });

    try {
      await api.post("/bookings", {
        room_id: roomId,
        user_name: userName,
        start_time: formatToApiDateTime(startTime),
        end_time: formatToApiDateTime(endTime),
      });
      // Gọi API lấy danh sách đặt phòng mới sau khi đặt phòng thành công
      await get().fetchBookingsByRoom(roomId);

      set({ submitting: false });
      return { ok: true };
    } catch (error) {
      set({
        submitting: false,
        errorMessage: getErrorMessage(error, "Không thể đặt phòng"),
      });
      return { ok: false };
    }
  },

  // Hàm để xóa đặt phòng
  deleteBooking: async ({ roomId, bookingId }) => {
    set({ submitting: true, errorMessage: "" });

    try {
      await api.delete(`/bookings/${bookingId}`);
      // Gọi API lấy danh sách đặt phòng mới sau khi xóa đặt phòng thành công
      await get().fetchBookingsByRoom(roomId);

      set({ submitting: false });

      return { ok: true };
    } catch (error) {
      set({
        submitting: false,
        errorMessage: getErrorMessage(error, "Không thể xóa đặt phòng"),
      });
      return { ok: false };
    }
  },
}));
