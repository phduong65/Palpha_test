import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { RoomProvider, useRoomContext } from "./context/RoomContext";
import { useAuthStore } from "./stores/authStore";
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
  const [authMode, setAuthMode] = useState("login");
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const { selectedRoomId, setSelectedRoomId } = useRoomContext();

  const {
    user,
    authLoading,
    authError,
    clearAuthError,
    isAuthenticated,
    login,
    logout,
    registerUser,
  } = useAuthStore();

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

  const {
    register: registerAuth,
    handleSubmit: handleAuthSubmit,
    reset: resetAuth,
    formState: { errors: authErrors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
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
  const authenticated = isAuthenticated();

  const openAuthPopup = (mode = "login") => {
    clearAuthError();
    setAuthMode(mode);
    setAuthPopupOpen(true);
  };

  const closeAuthPopup = () => {
    clearAuthError();
    setAuthPopupOpen(false);
  };

  const onAuthSubmit = async (values) => {
    const result =
      authMode === "login"
        ? await login(values)
        : await registerUser(values);

    if (result.ok) {
      resetAuth({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      });
      setAuthPopupOpen(false);
    }
  };

  const onSubmit = async (values) => {
    if (!authenticated) {
      return;
    }

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
    if (!authenticated) {
      return;
    }

    await deleteBooking({ roomId: selectedRoomId, bookingId });
  };

  return (
    <div className="booking-page">
      <nav className="top-navigation">
        <div className="brand-mark">
          <span>Booking</span>
          <small>Quản lý phòng</small>
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="auth-summary">
              <span>{user.name}</span>
              <button type="button" className="text-btn" onClick={logout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="nav-login-btn"
              onClick={() => openAuthPopup("login")}
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </nav>

      <div className="app-shell">
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
                    disabled={submitting || !authenticated}
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

              {authenticated ? (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={!selectedRoomId || submitting}
                >
                  {submitting ? "Lưu đặt phòng..." : "Tạo đặt phòng"}
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-btn"
                  onClick={() => openAuthPopup("login")}
                >
                  Đăng nhập để đặt phòng
                </button>
              )}
            </form>
          </section>
        </main>
      </div>

      {authPopupOpen ? (
        <div
          className="auth-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAuthPopup();
            }
          }}
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Đóng popup đăng nhập"
              onClick={closeAuthPopup}
            >
              x
            </button>

            <div className="auth-modal-head">
              <p className="eyebrow">Quản lý phòng</p>
              <h2 id="auth-modal-title">
                {authMode === "login" ? "Đăng nhập" : "Đăng ký"}
              </h2>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => {
                  clearAuthError();
                  setAuthMode("login");
                }}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => {
                  clearAuthError();
                  setAuthMode("register");
                }}
              >
                Đăng ký
              </button>
            </div>

            {authError ? <div className="error-box">{authError}</div> : null}

            <form className="auth-form" onSubmit={handleAuthSubmit(onAuthSubmit)}>
              {authMode === "register" ? (
                <label>
                  Họ và tên
                  <input
                    type="text"
                    {...registerAuth("name", {
                      required: authMode === "register" ? "Họ và tên là bắt buộc" : false,
                    })}
                  />
                  {authErrors.name ? (
                    <span className="field-error">{authErrors.name.message}</span>
                  ) : null}
                </label>
              ) : null}

              <label>
                Email
                <input
                  type="email"
                  {...registerAuth("email", {
                    required: "Email là bắt buộc",
                  })}
                />
                {authErrors.email ? (
                  <span className="field-error">{authErrors.email.message}</span>
                ) : null}
              </label>

              <label>
                Mật khẩu
                <input
                  type="password"
                  {...registerAuth("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength:
                      authMode === "register"
                        ? {
                            value: 8,
                            message: "Mật khẩu phải có ít nhất 8 ký tự",
                          }
                        : undefined,
                  })}
                />
                {authErrors.password ? (
                  <span className="field-error">{authErrors.password.message}</span>
                ) : null}
              </label>

              {authMode === "register" ? (
                <label>
                  Xác nhận mật khẩu
                  <input
                    type="password"
                    {...registerAuth("passwordConfirmation", {
                      required: "Xác nhận mật khẩu là bắt buộc",
                    })}
                  />
                  {authErrors.passwordConfirmation ? (
                    <span className="field-error">
                      {authErrors.passwordConfirmation.message}
                    </span>
                  ) : null}
                </label>
              ) : null}

              <button type="submit" className="submit-btn" disabled={authLoading}>
                {authLoading
                  ? "Vui lòng chờ..."
                  : authMode === "login"
                    ? "Đăng nhập"
                    : "Đăng ký"}
              </button>
            </form>
          </section>
        </div>
      ) : null}
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
