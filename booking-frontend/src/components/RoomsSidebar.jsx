import { useBooking } from "../context/BookingContext";
import { useRoomContext } from "../context/RoomContext";

export default function RoomsSidebar() {
  const { selectedRoomId, setSelectedRoomId } = useRoomContext();
  const { rooms, roomsLoading, clearError } = useBooking();

  return (
    <aside className="rooms-panel">
      <div className="panel-title-wrap">
        <h2>Danh sách phòng</h2>
      </div>

      {roomsLoading ? <p className="hint">Đang tải phòng...</p> : null}

      <ul className="rooms-list">
        {rooms.map((room) => (
          <li key={room.id}>
            <button
              type="button"
              className={`room-item ${room.id === selectedRoomId ? "active" : ""}`}
              onClick={() => {
                clearError();
                setSelectedRoomId(room.id);
              }}
            >
              <span>{room.name}</span>
              <small>Sức chứa: {room.capacity}</small>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
