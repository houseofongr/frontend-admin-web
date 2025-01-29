import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Room } from "../types/house";

type RoomContextType = {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem("rooms", JSON.stringify(rooms));
    }
  }, [rooms]);

  return <RoomContext.Provider value={{ rooms, setRooms }}>{children}</RoomContext.Provider>;
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};
