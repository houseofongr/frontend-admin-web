import { useMemo, useState } from "react";
import { useImageContext } from "../../context/ImageContext";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../../config/api";
import ArrowBackIcon from "../../components/icons/ArrowBackIcon";
import HouseImageUploader from "../../components/houseEditor/HouseImageUploader";
import BorderImageUploader from "../../components/houseEditor/BorderImageUploader";
import RoomImagesUploader from "../../components/houseEditor/RoomImagesUploader";
import BorderImagePreview from "../../components/houseEditor/BorderImagePreview";
import DraggableItemWrapper from "../../components/houseEditor/DraggableItemWrapper";
import ModalAlertMessage, { AlertType } from "../../components/common/ModalAlertMessage";
import Button from "../../components/common/buttons/Button";

export default function HouseEditorPage() {
  const { houseImage, borderImage, roomImages } = useImageContext();
  const [scale, setScale] = useState<number>(1);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(null);
  const [newHouseId, setNewHouseId] = useState<number>();
  const navigate = useNavigate();

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

    if (roomImages.some((room) => room.title === "")) {
      showAlert("모든 룸 타이틀 값을 입력하세요.", "warning");
      return;
    }

    const titleCounts = roomImages.reduce((acc, room) => {
      acc[room.title] = (acc[room.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicateTitles = Object.entries(titleCounts)
      .filter(([_, count]) => count > 1)
      .map(([title]) => title);

    if (duplicateTitles.length > 0) {
      showAlert(`다음 룸 타이틀이 중복되었습니다. 중복되는 이름 [ ${duplicateTitles.join(", ")} ]`, "warning");
      return;
    }

    const formData = new FormData();

    const metadata = {
      house: {
        title: houseImage.title,
        author: houseImage.author,
        description: houseImage.description,
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

    // formdata 체크
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/houses`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "새로운 하우스 데이터를 생성하는데 실패하였습니다.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("JSON 파싱 오류:", jsonError);
        }

        showAlert(errorMessage, "fail");
        return;
      }

      const { houseId } = await response.json();

      if (houseId) {
        setNewHouseId(houseId);
        showAlert(`새로운 ${houseId}번 하우스가 성공적으로 저장되었습니다.`, "success");
      }
    } catch (error) {
      showAlert(`데이터 저장 중 오류가 발생하였습니다. error:${error}`, "fail");
    }
  };

  const borderImageURL = useMemo(() => borderImage && URL.createObjectURL(borderImage.file), [borderImage]);
  const roomImageURLs = useMemo(() => roomImages.map((room) => URL.createObjectURL(room.file)), [roomImages]);

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
      {/* house 생성 성공 시 모달창 -> 확인-> 상세페이지로 이동 */}
      {alert?.type === "success" && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => navigate(`/houses/${newHouseId}`)} />}
        />
      )}
      <section className="w-1/5 h-full flex flex-col gap-4 overflow-scroll">
        <div className="w-full pt-6 px-3 flex justify-between items-center">
          <ArrowBackIcon href="/houses" />
          <h1>뉴 하우스</h1>
          <Button label="저장" onClick={saveHandler} />
        </div>
        <div className="flex flex-col gap-5 m-3">
          <HouseImageUploader />
          <BorderImageUploader />
          <RoomImagesUploader />
        </div>
      </section>

      <section className="relative w-4/5 h-full flex justify-center bg-stone-800">
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
