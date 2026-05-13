import { createContext, useContext, useMemo, useState } from "react";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  // const value = ({ selectedRoomId, setSelectedRoomId });
  // useMemo để tránh tạo lại đối tượng value nếu selectedRoomId không thay đổi (re-render)
  const value = useMemo(
    () => ({ selectedRoomId, setSelectedRoomId }),
    [selectedRoomId],
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("Lỗi: useRoomContext phải được sử dụng bên trong RoomProvider");
  }
  return context;
}
