import { useNavigate, useParams } from "react-router-dom";
import { EditableHouseData, EditableRoomData, HouseDetailInfo, Room } from "../../types/house";
import { useRoomContext } from "../../context/RoomsContext";
import { useEffect, useState } from "react";
import API_CONFIG from "../../config/api";
import SpinnerIcon from "../../components/icons/SpinnerIcon";
import ArrowBackIcon from "../../components/icons/ArrowBackIcon";
import HouseForm from "../../components/HouseForm";
import RoomForm from "../../components/RoomForm";
import RenderImages from "../../components/RenderImages";
import Button from "../../components/common/buttons/Button";
import { MAX_HOUSE_HEIGHT_SIZE } from "../../constants/formDataMaxLength";
import ModalAlertMessage, { AlertType } from "../../components/modal/ModalAlertMessage";

export type HouseData = {
  house: HouseDetailInfo;
  rooms: Room[];
};

export default function HouseDetail() {
  const { houseId } = useParams<{ houseId: string }>();
  const { setRooms } = useRoomContext();

  const [houseData, setHouseData] = useState<HouseData | null>(null);
  const [editableData, setEditableData] = useState<EditableHouseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number | null>(null);
  const [isEditHouseInfo, setIsEditHouseInfo] = useState<boolean>(false);
  const [isEditRoomInfo, setIsEditRoomInfo] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(null);

  console.log("house data", houseData);
  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };

  const navigate = useNavigate();

  const houseDeleteHandler = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/houses/${houseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = "하우스를 삭제하는데 실패하였습니다.";

        try {
          const errorData = await response.json();
          errorMessage = `[ERROR CODE# ${errorData.code}]  ${errorData.message} ` || errorMessage;
        } catch (jsonError) {
          console.error("JSON 파싱 오류:", jsonError);
        }

        showAlert(errorMessage, "fail");
        return;
      }

      const result = await response.json();
      showAlert(`${result.message}`, "success");
      navigate("/houses");
    } catch (error) {
      console.error("네트워크 또는 서버 오류:", error);
      showAlert(`하우스 삭제하는 중 오류가 발생하였습니다. ${error}`, "fail");
    }
  };

  const houseDataSubmitHandler = async () => {
    if (!houseData || !editableData) return;

    const isTitleChanged = editableData.house.title !== houseData.house.title;
    const isAuthorChanged = editableData.house.author !== houseData.house.author;
    const isDescriptionChanged = editableData.house.description !== houseData.house.description;

    if (!isTitleChanged && !isAuthorChanged && !isDescriptionChanged) {
      showAlert("변경된 값이 없습니다.", "warning");
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/houses/${houseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editableData?.house.title,
          author: editableData?.house.author,
          description: editableData?.house.description,
        }),
      });

      if (!response.ok) {
        let errorMessage = "하우스 데이터를 업데이트하는데 실패했습니다.";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("JSON 파싱 오류:", jsonError);
        }

        showAlert(errorMessage, "fail");
        return;
      }
      const { message } = await response.json();
      showAlert(`${message}`, "success");

      setIsEditHouseInfo(false);
      setHouseData((prev) => (prev ? { ...prev, house: { ...prev.house, ...editableData?.house } } : null));
    } catch (error) {
      showAlert(`하우스 데이터를 업데이트 하는 중 에러가 발생하였습니다. error : ${error}`, "fail");
    }
  };

  const roomDataSubmitHandler = async () => {
    if (!editableData) return;

    const changedRooms = editableData.rooms
      .filter((room) => room.name !== room.originalName)
      .map((room) => ({
        roomId: room.roomId,
        newName: room.name,
      }));

    if (changedRooms.length === 0) {
      showAlert(`변경된 방 이름이 존재하지 않습니다.`, "warning");
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/houses/rooms`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changedRooms),
      });

      const status = response.status;
      if (!response.ok) {
        let errorMessage = "룸 데이터를 업데이트하는데 실패했습니다.";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("JSON 파싱 오류:", jsonError);
        }

        showAlert(errorMessage, "fail");
        return;
      }

      if (status === 200) {
        showAlert("룸 정보 업데이트가 완료되었습니다.", "success");
      }

      setIsEditRoomInfo(false);
      setHouseData((prev) => {
        if (!prev) return null;
        const updatedRooms = prev.rooms.map((room) => {
          const updatedRoom = changedRooms.find((r) => r.roomId === room.roomId);
          return updatedRoom ? { ...room, name: updatedRoom.newName } : room;
        });
        return { ...prev, rooms: updatedRooms };
      });
    } catch (error) {
      showAlert(`룸 데이터를 업데이트 하는데 에러가 발생하였습니다. error : ${error}`, "fail");
    }
  };

  const handleHouseChange = (field: keyof EditableHouseData["house"], value: string) => {
    setEditableData((prev) => (prev ? { ...prev, house: { ...prev.house, [field]: value } } : null));
  };

  const handleRoomChange = (index: number, field: keyof EditableRoomData, value: string) => {
    setEditableData((prev) => {
      if (!prev) return null;
      const updatedRooms = prev.rooms.map((room, idx) => (idx === index ? { ...room, [field]: value } : room));

      return { ...prev, rooms: updatedRooms };
    });
  };

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BACK_API}/houses/${houseId}`);

        const data = await response.json();
        const roomsEditableData = data.rooms.map((room: Room) => ({
          imageId: room.imageId,
          roomId: room.roomId,
          name: room.name,
          originalName: room.name,
        }));

        setHouseData(data);
        setEditableData({
          house: {
            title: data.house.title,
            author: data.house.author,
            description: data.house.description,
            createdDate: data.house.createdDate,
          },
          rooms: roomsEditableData,
        });
        const broswerHeight = window.innerHeight;
        setScale(broswerHeight / MAX_HOUSE_HEIGHT_SIZE);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseData();
  }, [houseId]);

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BACK_API}/houses/${houseId}`);
        const data = await response.json();

        setHouseData(data);
        setRooms(data.rooms);
      } catch (error) {
        showAlert(`하우스 데이터 조회하는데 실패하였습니다.. error : ${error}`, "fail");
      } finally {
        setLoading(false);
      }
    };

    if (houseId) fetchHouseData();
  }, [houseId, setRooms]);

  useEffect(() => {
    if (houseData?.rooms) {
      setRooms(houseData.rooms);
    }
  }, [houseData?.rooms, setRooms]);

  if (loading) {
    return <SpinnerIcon />;
  }
  return (
    <div className="w-full h-full flex items-center">
      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => setAlert(null)} />}
        />
      )}
      <section className="w-1/5 h-full flex flex-col gap-4 overflow-scroll">
        <div className="w-full pt-6  px-3 flex justify-between items-center">
          <ArrowBackIcon href="/houses" />
          <h1 className="font-bold">하우스 상세 </h1>
          <Button label="삭제" onClick={houseDeleteHandler} />
        </div>
        {houseData && editableData && (
          <>
            <HouseForm
              houseData={editableData.house}
              isEdit={isEditHouseInfo}
              onChange={handleHouseChange}
              onSubmit={houseDataSubmitHandler}
              onCancel={() => setIsEditHouseInfo(false)}
              toggleEdit={() => setIsEditHouseInfo(true)}
            />
            <RoomForm
              rooms={editableData.rooms}
              isEdit={isEditRoomInfo}
              onChange={handleRoomChange}
              onSubmit={roomDataSubmitHandler}
              onCancel={() => setIsEditRoomInfo(false)}
              toggleEdit={() => setIsEditRoomInfo(true)}
            />
          </>
        )}
      </section>
      {houseData && scale && <RenderImages houseData={houseData} scale={scale} />}
    </div>
  );
}
