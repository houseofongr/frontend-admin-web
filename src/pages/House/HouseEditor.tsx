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

export default function HouseEditorPage() {
  const { houseImage, borderImage, roomImages } = useImageContext();
  const [scale, setScale] = useState<number>(1);

  const navigate = useNavigate();

  const saveHandler = async () => {
    if (!houseImage) {
      alert("하우스 이미지를 업로드하세요.");
      return;
    }
    if (!houseImage.title || !houseImage.author || !houseImage.description) {
      alert("하우스의 모든 정보를 입력하세요 (타이틀, 작가명, 설명).");
      return;
    }
    if (roomImages.length === 0) {
      alert("최소 하나의 룸 이미지를 업로드하세요.");
      return;
    }

    const invalidRooms = roomImages.filter((room) => room.title === "");
    console.log("invaliedRooms", invalidRooms);
    if (invalidRooms.length > 0) {
      console.log("here");
      alert("모든 룸 이미지의 타이틀값을 중복없이 입력하세요.");
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
        console.log("Save success:", result);

        const { houseId } = result;
        if (houseId) {
          console.log("houseid", houseId);
          navigate(`/houses/${houseId}`);
        }
      } else {
        const error = await response.json();
        console.error("Save failed:", error);
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    }
  };

  const borderImageURL = useMemo(() => borderImage && URL.createObjectURL(borderImage.file), [borderImage]);
  const roomImageURLs = useMemo(() => roomImages.map((room) => URL.createObjectURL(room.file)), [roomImages]);

  return (
    <div className="w-full h-full flex items-center">
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
