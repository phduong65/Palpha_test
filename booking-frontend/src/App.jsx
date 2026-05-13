import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { RoomProvider, useRoomContext } from "./context/RoomContext";
import { useBookingStore } from "./stores/bookingStore";
import "./App.css";

function formatDisplayDateTime(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

function BookingApp() {
  
  const { selectedRoomId, setSelectedRoomId } = useRoomContext();

  const {
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
  } = useBookingStore();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
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

  const onSubmit = async (values) => {
    if (new Date(values.startTime) >= new Date(values.endTime)) {
      setError("endTime", {
        type: "validate",
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      });
      return;
    }

    const result = await createBooking({
      roomId: selectedRoomId,
      userName: values.userName,
      startTime: values.startTime,
      endTime: values.endTime,
    });

    if (result.ok) {
      reset({
        userName: "",
        startTime: "",
        endTime: "",
      });
    }
  };

  const handleDelete = async (bookingId) => {
    await deleteBooking({ roomId: selectedRoomId, bookingId });
  };

  return (
    <div className="booking-page">
      <aside className="rooms-panel">
        <div className="panel-title-wrap">
          <p className="eyebrow">Available rooms</p>
          <h2>Danh Sách Phòng</h2>
        </div>

        {roomsLoading ? <p className="hint">Đang load phòng...</p> : null}

        <ul className="rooms-list">
          {rooms.map((room) => (
            <li key={room.id}>
              <button
                type="button"
                className={`room-item ${
                  room.id === selectedRoomId ? "active" : ""
                }`}
                onClick={() => {
                  clearError();
                  setSelectedRoomId(room.id);
                }}
              >
                <span>{room.name}</span>
                <small>Capacity: {room.capacity}</small>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="booking-panel">
        <header className="booking-header">
          <div>
            <p className="eyebrow">Phòng đang chọn</p>
            <h2>{selectedRoom?.name || "Không có phòng nào được chọn"}</h2>
          </div>
        </header>

        {errorMessage ? <div className="error-box">{errorMessage}</div> : null}

        <section className="section-block">
          <h3>Đặt phòng hiện tại</h3>

          {bookingsLoading ? (
            <p className="hint">Đang load đặt phòng...</p>
          ) : null}

          {!bookingsLoading && bookings.length === 0 ? (
            <p className="hint">Chưa có đặt phòng nào trong phòng này.</p>
          ) : null}

          <ul className="booking-list">
            {bookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                <div>
                  <strong>{booking.user_name}</strong>
                  <p>
                    {formatDisplayDateTime(booking.start_time)} đến{" "}
                    {formatDisplayDateTime(booking.end_time)}
                  </p>
                </div>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(booking.id)}
                  disabled={submitting}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="section-block">
          <h3>Tạo đặt phòng</h3>

          <form className="booking-form" onSubmit={handleSubmit(onSubmit)}>
            <label>
              Họ và tên
              <input
                type="text"
                placeholder="Họ và tên"
                {...register("userName", {
                  required: "Họ và tên là bắt buộc",
                  maxLength: {
                    value: 255,
                    message: "Họ và tên không thể vượt quá 255 ký tự",
                  },
                })}
              />
              {errors.userName ? (
                <span className="field-error">{errors.userName.message}</span>
              ) : null}
            </label>

            <label>
              Thời gian bắt đầu
              <input
                type="datetime-local"
                {...register("startTime", {
                  required: "Thời gian bắt đầu là bắt buộc",
                })}
              />
              {errors.startTime ? (
                <span className="field-error">{errors.startTime.message}</span>
              ) : null}
            </label>

            <label>
              Thời gian kết thúc
              <input
                type="datetime-local"
                {...register("endTime", {
                  required: "Thời gian kết thúc là bắt buộc",
                })}
              />
              {errors.endTime ? (
                <span className="field-error">{errors.endTime.message}</span>
              ) : null}
            </label>

            <button
              type="submit"
              className="submit-btn"
              disabled={!selectedRoomId || submitting}
            >
              {submitting ? "Đang lưu..." : "Tạo đặt phòng"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <RoomProvider>
      <BookingApp />
    </RoomProvider>
  );
}

export default App;
