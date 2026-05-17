import { createContext, useContext, useMemo, useState } from "react";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const value = useMemo(
    () => ({ selectedRoomId, setSelectedRoomId }),
    [selectedRoomId],
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
}
