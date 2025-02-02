import { useNavigate, useParams } from "react-router-dom";
import { useRoomContext } from "../../context/RoomsContext";
import { useEffect, useState } from "react";
import { BaseRoom } from "../../types/house";
import API_CONFIG from "../../config/api";
import CardLabel from "../../components/label/CardLabel";
import SpinnerIcon from "../../components/icons/SpinnerIcon";
import Button from "../../components/buttons/Button";

export default function RoomDetail() {
  const { rooms, setRooms } = useRoomContext();
  const { houseId, roomId } = useParams<{ houseId: string; roomId: string }>();

  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<BaseRoom | null>(null);

  const navigateOtherRoomDetailPage = () => {
    const currentIndex = rooms.findIndex((room) => room.roomId === Number(roomId));
    const nextIndex = (currentIndex + 1) % rooms.length;
    const nextRoom = rooms[nextIndex];
    console.log("nextRoom", nextIndex, nextRoom);
    console.log("curIndex", currentIndex);

    if (nextIndex === currentIndex) {
      // 방이 하나만 존재하는 경우
      alert("더이상 방이 존재하지 않습니다!");
    }

    if (nextRoom) {
      navigate(`/houses/${houseId}/rooms/${nextRoom.roomId}`);
    }
  };

  const navigateHouseListPage = () => {
    // 뒤로 가기 불가능
    navigate("/houses", { replace: true });
  };

  // useEffect(() => {
  //   if (rooms.length == 0) {
  //     const roomlist = localStorage.getItem("rooms");
  //     if (roomlist) {
  //       setRooms(JSON.parse(roomlist));
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (!roomId) return;
    if (rooms.length == 0) return;

    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BACK_API}/houses/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [roomId, rooms]);

  if (!roomData)
    return (
      <div className="w-full h-full flex-center">
        <SpinnerIcon />
      </div>
    );

  return (
    <div className="relative w-full h-screen flex flex-col bg-gray-100">
      <div className="w-full px-10 py-3 flex justify-between items-center  border-b-2 bg-stone-800">
        <div className="py-1 ">
          <CardLabel size="large" hasPadding hasBorder text={`ROOM ID# ${roomId}`} />
          <p className="pt-2 text-white"> Room Name: {roomData.name}</p>
          <p className="text-white">
            Room Dimensions: W {roomData.width} x H {roomData.height}
          </p>
        </div>

        <div className="flex gap-3">
          <Button label="NEXT" onClick={navigateOtherRoomDetailPage} />
          <Button label="EXIT" onClick={navigateHouseListPage} />
        </div>
      </div>

      <div className="relative w-full h-full flex-center ">
        <img
          src={`${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${roomData.imageId}`}
          alt={roomData.name}
          className="max-w-full max-h-ful object-contain"
        />
      </div>
    </div>
  );
}
