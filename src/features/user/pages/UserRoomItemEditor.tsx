import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API_CONFIG from "../../../config/api";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import { ShapeData } from "../../../types/items";
import KonvaContainer from "../../../components/itemEditor/KonvaContainer";
import SlideBar from "../../../components/itemEditor/SlideBar";
import { formatShapeData } from "../../../utils/formatShapeData";
import RoomDetailLayout from "../../../components/layout/RoomDetailLayout";
import ModalAlertMessage, { AlertType } from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";

type UpdateItemsPayload = {
  createdItems: object[];
  updatedItems: object[];
};

export default function UserRoomItemEditorPage() {
  const { userId, homeId, roomId } = useParams<{ userId: string; homeId: string; roomId: string }>();
  const [originData, setOriginData] = useState<ShapeData[]>([]);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, scale: 1, scaleAxis: "" });
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const queryClient = useQueryClient();

  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userRoom", homeId, roomId, userId],
    queryFn: async ({ queryKey }) => {
      const homeId = queryKey[1];
      const roomId = queryKey[2];
      const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/homes/${homeId}/rooms/${roomId}/items`);
      const result = await response.json();
      return result;
    },
  });

  const deleteShape = async (id: number) => {
    const isExistingItem = originData.some((shape) => shape.id === id);
    const targetItem = originData.find((shape) => shape.id === id);
    if (isExistingItem) {
      try {
        const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/items/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Failed to delete item (status: ${response.status})`);
        showAlert(` [${targetItem?.name}] 아이템이 성공적으로 삭제되었습니다.`, "success");
      } catch (error) {
        console.error("Error deleting item:", error);
        showAlert("아이템 삭제 중 오류가 발생했습니다.", "fail");
        return;
      }
    }
    setShapes((prev) => prev.filter((shape) => shape.id !== id));
    setSelectedId(null);
  };

  const updateItemData = async ({ createdItems, updatedItems }: UpdateItemsPayload) => {
    const apiUrl = `${API_CONFIG.BACK_ADMIN_API}/users/${userId}/homes/${homeId}/rooms/${roomId}/items/v2`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        createItems: createdItems,
        updateItems: updatedItems,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save items (status: ${response.status})`);
    }
    return response.json();
  };

  const saveItemsHandler = () => {
    if (shapes.some((shape) => shape.name.trim() === "")) {
      showAlert("아이템의 이름을 빠짐없이 입력해주세요.", "warning");
      return;
    }

    // originData에 없는 아이템들
    const newItems = shapes.filter((shape) => !originData.some((origin) => origin.id === shape.id));

    // originData에 존재하지만 내용이 변경된 아이템들
    const modifiedItems = shapes.filter((shape) => {
      const originalShape = originData.find((origin) => origin.id === shape.id);
      return originalShape && JSON.stringify(originalShape) !== JSON.stringify(shape);
    });

    const createdItems = newItems.map((shape) => formatShapeData(shape, imageSize));

    const updatedItems = modifiedItems.map((shape) => formatShapeData(shape, imageSize, { includeId: true }));

    if (createdItems.length === 0 && updatedItems.length === 0) {
      showAlert("변경되거나 생성된 아이템이 존재하지않습니다.", "info");
      return;
    }
    setIsEditable(false);
    setSelectedId(null);
    showAlert("아이템 업데이트에 성공하였습니다.", "success");

    mutation.mutate({ createdItems, updatedItems });
  };

  const mutation = useMutation({
    mutationFn: updateItemData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoom", homeId, roomId, userId] });
    },
  });

  // 배경 이미지 크기 및 아이템(도형) 위치를 화면 크기에 맞게 조정하는 코드
  useEffect(() => {
    if (!data) return;

    const image = new window.Image();

    image.src = `${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${data.room.imageId}`;
    image.onload = () => {
      // 브라우저 화면 크기 및 이미지 크기 계산
      const stageWidth = window.innerWidth;
      const stageHeight = window.innerHeight;

      const imgWidth = image.width;
      const imgHeight = image.height;

      //이미지 비율에 맞춰 화면에 최적화된 크기 계산
      const scaleX = stageWidth / imgWidth;
      const scaleY = stageHeight / imgHeight;

      //이미지를 화면에 맞게 축소할 때 유지할 비율 (최소값을 선택하여 비율 유지)
      const scale = Math.min(scaleX, scaleY);
      //어느 축을 기준으로 크기를 조정할지 결정
      const scaleAxis = scaleX > scaleY ? "Y" : "X";
      //이미지 중앙 정렬을 위한 오프셋 계산
      const offsetWay = scaleAxis;
      const offsetX = (window.innerWidth - imgWidth * scale) / 2;
      const offsetY = (window.innerHeight - imgHeight * scale) / 2;
      //도형 데이터(아이템) 크기 및 위치 조정
      //3가지 도형이 공통적으로 x, y 좌표를 scale 비율만큼 조정
      data.items.forEach((item: ShapeData, i: number) => {
        if ("circleData" in item && item.circleData) {
          data.items[i].circleData.x =
            Number((item.circleData.x * scale).toFixed(2)) + (offsetWay === "X" ? 0 : offsetX);
          data.items[i].circleData.y =
            Number((item.circleData.y * scale).toFixed(2)) + (offsetWay === "Y" ? 0 : offsetY);
          data.items[i].circleData.radius = Number((item.circleData.radius * scale).toFixed(2));
        } else if ("rectangleData" in item && item.rectangleData) {
          data.items[i].rectangleData.x =
            Number((item.rectangleData.x * scale).toFixed(2)) + (scaleAxis === "X" ? 0 : offsetX);
          data.items[i].rectangleData.y =
            Number((item.rectangleData.y * scale).toFixed(2)) + (scaleAxis === "Y" ? 0 : offsetY);
          data.items[i].rectangleData.width = Number((item.rectangleData.width * scale).toFixed(2));
          data.items[i].rectangleData.height = Number((item.rectangleData.height * scale).toFixed(2));
          data.items[i].rectangleData.rotation = Number(item.rectangleData.rotation.toFixed(2));
        } else if ("ellipseData" in item && item.ellipseData) {
          data.items[i].ellipseData.x =
            Number((item.ellipseData.x * scale).toFixed(2)) + (scaleAxis === "X" ? 0 : offsetX);
          data.items[i].ellipseData.y =
            Number((item.ellipseData.y * scale).toFixed(2)) + (scaleAxis === "Y" ? 0 : offsetY);
          data.items[i].ellipseData.radiusX = Number((item.ellipseData.radiusX * scale).toFixed(2));
          data.items[i].ellipseData.radiusY = Number((item.ellipseData.radiusY * scale).toFixed(2));
          data.items[i].ellipseData.rotation = Number(item.ellipseData.rotation.toFixed(2));
        }
      });

      setImageSize({
        width: imgWidth,
        height: imgHeight,
        scale: scale,
        scaleAxis: scaleAxis,
      }); // 배경 이미지 정보 상태 저장
      setBackgroundImage(image); // 이미지 객체 상태 저장
      setOriginData(data.items); // 비교용 원본 데이터 상태
      setShapes(data.items); //  화면에 표시할 도형 데이터 업데이트
    };
  }, [data]);

  if (!data && isLoading) return <SpinnerIcon />;
  return (
    <RoomDetailLayout isEditable={isEditable}>
      {/* Konva 관련 컴포넌트 */}
      <KonvaContainer
        shapes={shapes}
        setShapes={setShapes}
        isEditable={isEditable}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        deleteShape={deleteShape}
        backgroundImage={backgroundImage}
        imageSize={imageSize}
      />
      {/* 아이템 목록 + 아이템의 음원 목록 + 음원 추가 양식*/}
      <SlideBar
        shapes={shapes}
        setShapes={setShapes}
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        saveItemsHandler={saveItemsHandler}
      />

      {/* 모달 메세지 */}
      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => setAlert(null)} />}
        />
      )}
    </RoomDetailLayout>
  );
}
