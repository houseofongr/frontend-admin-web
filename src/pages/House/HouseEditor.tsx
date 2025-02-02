import { useMemo, useState } from "react";
import { useImageContext } from "../../context/ImageContext";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../../config/api";
import ArrowBackIcon from "../../components/icons/ArrowBackIcon";
import Button from "../../components/buttons/Button";
import HouseImageUploader from "../../components/houseEditor/HouseImageUploader";
import BorderImageUploader from "../../components/houseEditor/BorderImageUploader";
import RoomImagesUploader from "../../components/houseEditor/RoomImagesUploader";
import BorderImagePreview from "../../components/houseEditor/BorderImagePreview";
import DraggableItemWrapper from "../../components/houseEditor/DraggableItemWrapper";
import AlertMessage, { AlertType } from "../../components/common/AlertMessage";

export default function HouseEditorPage() {
  const { houseImage, borderImage, roomImages } = useImageContext();
  const [scale, setScale] = useState<number>(1);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(null);
  const [newHouseId, setNewHouseId] = useState<number>();
  const navigate = useNavigate();

  console.log("borderImage", borderImage);

  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };
  const saveHandler = async () => {
    if (!houseImage) {
      showAlert("하우스 이미지를 업로드하세요.", "warning");
      return;
    }
    if (!houseImage.title || !houseImage.author || !houseImage.description) {
      showAlert("하우스의 모든 정보를 입력하세요. (타이틀, 작가명, 설명)", "warning");
      return;
    }
    if (roomImages.length === 0) {
      showAlert("최소한 하나의 룸 이미지를 업로드하세요.", "warning");
      return;
    }

    // const invalidRooms = roomImages.filter((room) => room.title === "");
    // if (invalidRooms.length > 0) {
    //   showAlert("모든 룸 타이틀 값을 중복없이 입력하세요.", "warning");
    //   return;
    // }

    const titleCounts = roomImages.reduce((acc, room) => {
      acc[room.title] = (acc[room.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 중복된 타이틀만 필터링
    const duplicateTitles = Object.entries(titleCounts)
      .filter(([_, count]) => count > 1)
      .map(([title]) => title);

    if (duplicateTitles.length > 0) {
      showAlert(`다음 룸 타이틀이 중복되었습니다. 중복되는 이름 [ ${duplicateTitles.join(", ")} ]`, "warning");
      return;
    }

    if (roomImages.some((room) => room.title === "")) {
      showAlert("모든 룸 타이틀 값을 입력하세요.", "warning");
      return;
    }

    const formData = new FormData();

    const metadata = {
      house: {
        title: houseImage?.title,
        author: houseImage?.author,
        description: houseImage?.description,
        width: houseImage?.width,
        height: houseImage?.height,
        houseForm: "houseImage",
        borderForm: "borderImage",
      },
      rooms: roomImages.map((room) => ({
        form: `${room.id}`,
        name: room.title,
        width: room.width!.toFixed(2),
        height: room.height!.toFixed(2),
        x: (room.x! / scale).toFixed(2),
        y: (room.y! / scale).toFixed(2),
        z: room.z,
      })),
    };

    formData.append("houseImage", houseImage!.file);
    formData.append("borderImage", borderImage!.file);
    roomImages.map((room) => {
      formData.append(`${room.id}`, room.file);
    });

    formData.append("metadata", JSON.stringify(metadata));

    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/houses`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        const { houseId } = result;
        if (houseId) {
          setNewHouseId(houseId);
          showAlert(`새로운 ${houseId}번 하우스가 성공적으로 저장되었습니다.`, "success");
          // navigate(`/houses/${houseId}`);
        }
      } else {
        const error = await response.json();
        showAlert(`새로운 하우스 데이터 저장에 실패하였습니다. error: ${error}`, "fail");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      showAlert(`데이터 저장 중 오류가 발생했습니다. error:${error}`, "fail");
    }
  };

  const borderImageURL = useMemo(() => borderImage && URL.createObjectURL(borderImage.file), [borderImage]);
  const roomImageURLs = useMemo(() => roomImages.map((room) => URL.createObjectURL(room.file)), [roomImages]);

  return (
    <div className="w-full h-full flex items-center">
      {alert && (
        <AlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => setAlert(null)} />}
        />
      )}

      {alert?.type === "success" && (
        <AlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => navigate(`/houses/${newHouseId}`)} />}
        />
      )}
      <section className="w-1/5 h-full flex flex-col gap-4  overflow-scroll ">
        <div className="w-full pt-6  px-3 flex justify-between items-center">
          <ArrowBackIcon href="/houses" />
          <h1 className="">뉴 하우스</h1>
          <Button label="저장" onClick={saveHandler} />
        </div>
        <div className="flex flex-col gap-5 m-3">
          <HouseImageUploader />
          <BorderImageUploader />
          <RoomImagesUploader />
        </div>
      </section>

      <section className="relative w-4/5 h-full flex justify-center bg-black/10 ">
        <div className="relative">
          {borderImage && <BorderImagePreview setScale={setScale} imageUrl={borderImageURL} />}
          {roomImages.length > 0 &&
            scale &&
            roomImages.map((room, index) => (
              <DraggableItemWrapper
                key={index}
                index={index}
                width={room.width!}
                height={room.height!}
                scale={scale}
                imageUrl={roomImageURLs[index]}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
