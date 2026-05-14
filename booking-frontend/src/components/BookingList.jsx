import { formatDisplayDateTime } from "../utils/booking";

export default function BookingList({
  bookings,
  bookingsLoading,
  canManage,
  submitting,
  onDelete,
}) {
  return (
    <section className="section-block">
      <h3>Đặt phòng hiện tại</h3>

      {bookingsLoading ? <p className="hint">Đang tải đặt phòng...</p> : null}

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
              onClick={() => onDelete(booking.id)}
              disabled={submitting || !canManage}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
