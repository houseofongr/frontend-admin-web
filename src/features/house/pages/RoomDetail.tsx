import { useNavigate, useParams } from "react-router-dom";
import { useRoomContext } from "../../../context/RoomsContext";
import { useEffect, useState } from "react";
import { BaseRoom } from "../../../types/house";
import API_CONFIG from "../../../config/api";
import CardLabel from "../../../components/label/CardLabel";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import Button from "../../../components/buttons/Button";
import ModalAlertMessage, { AlertType } from "../../../components/modal/ModalAlertMessage";

export default function RoomDetail() {
  const { rooms } = useRoomContext();
  const { houseId, roomId } = useParams<{ houseId: string; roomId: string }>();

  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<BaseRoom | null>(null);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(null);

  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };
  const navigateOtherRoomDetailPage = () => {
    const currentIndex = rooms.findIndex((room) => room.roomId === Number(roomId));
    const nextIndex = (currentIndex + 1) % rooms.length;
    const nextRoom = rooms[nextIndex];

    if (nextIndex === currentIndex) {
      // 방이 하나일때
      showAlert("더이상 방이 존재하지 않습니다!", "info");
    }

    if (nextRoom) {
      navigate(`/houses/${houseId}/rooms/${nextRoom.roomId}`);
    }
  };

  const navigateHouseListPage = () => {
    navigate("/houses", { replace: true });
  };

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

  if (!roomData) return <SpinnerIcon />;

  return (
    <div className="relative w-full h-screen flex flex-col bg-stone-800">
      <div className="w-full px-10 py-5 flex justify-between items-center absolute">
        <div className="pt-2">
          <CardLabel size="large" hasPadding hasBorder text={`ROOM ID# ${roomId}`} />
          <p className="pt-2 text-gray-200 "> Room Name: {roomData.name}</p>
          <p className="text-gray-200">
            Room Dimensions: W {roomData.width} x H {roomData.height}
          </p>
        </div>

        <div className="flex gap-3">
          <Button label="NEXT" onClick={navigateOtherRoomDetailPage} />
          <Button label="EXIT" onClick={navigateHouseListPage} />
        </div>
      </div>

      <div className="w-full h-full flex-center bg-stone-800 ">
        <img
          src={`${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${roomData.imageId}`}
          alt={roomData.name}
          className="max-w-full max-h-full "
        />
      </div>

      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => setAlert(null)} />}
        />
      )}
    </div>
  );
}
