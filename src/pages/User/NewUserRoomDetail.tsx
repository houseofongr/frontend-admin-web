import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API_CONFIG from "../../config/api";
import SpinnerIcon from "../../components/icons/SpinnerIcon";
import { ShapeData } from "../../types/items";
import KonvaContainer from "../../components/itemEditor/KonvaContainer";
import SlideBar from "../../components/itemEditor/SlideBar";
import { formatShapeData } from "../../utils/formatShapeData";
import { BsTrash3 } from "react-icons/bs";
import RoomDetailLayout from "../../components/itemEditor/RoomDetailLayout";
import ModalAlertMessage, { AlertType } from "../../components/common/ModalAlertMessage";
import Button from "../../components/common/buttons/Button";
import CircleButton from "../../components/common/buttons/CircleButton";

type UpdateItemsPayload = {
  createdItems: object[];
  updatedItems: object[];
};

export default function NewUserRoomDetail() {
  // params
  const { userId, homeId, roomId } = useParams<{ userId: string; homeId: string; roomId: string }>();
  //  konva
  const [imageId, setImageId] = useState(null);
  //  global
  const [originData, setOriginData] = useState<ShapeData[]>([]);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(null);

  const queryClient = useQueryClient();

  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };
  // 초기 아이템 데이터 로드
  const { data, isLoading } = useQuery({
    queryKey: ["userRoom", homeId, roomId, userId],
    queryFn: async ({ queryKey }) => {
      const homeId = queryKey[1];
      const roomId = queryKey[2];
      const response = await fetch(`${API_CONFIG.BACK_API}/homes/${homeId}/rooms/${roomId}/items`);
      const result = await response.json();
      return result;
    },
  });

  const deleteShape = async (id: number) => {
    const isExistingItem = originData.some((shape) => shape.id === id);
    const targetItem = originData.find((shape) => shape.id === id); // 기존 아이템이면 데이터가 있고 없으면 undefined
    console.log("isExistingItem", isExistingItem);

    console.log("deleteToItemName", targetItem);
    if (isExistingItem) {
      try {
        const response = await fetch(`${API_CONFIG.BACK_API}/items/${id}`, {
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
  };

  // shape items data fetch -  기존의 아이템 update + 새로운 아이템 create
  const updateItemData = async ({ createdItems, updatedItems }: UpdateItemsPayload) => {
    const apiUrl = `${API_CONFIG.BACK_API}/users/${userId}/homes/${homeId}/rooms/${roomId}/items/v2`;

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

    const createdItems = newItems.map((shape) => formatShapeData(shape));
    const updatedItems = modifiedItems.map((shape) => formatShapeData(shape, { includeId: true }));
    console.log("new", createdItems);
    console.log("updated", updatedItems);

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

  useEffect(() => {
    if (!data) return;
    setOriginData(data.items); // 비교용 원본 데이터 상태
    setShapes(data.items); // 페이지에 보여줄 상태
    setImageId(data.room.imageId); // 페이지에 보여줄 룸 이미지값
  }, [data]);

  if (!data && isLoading) return <SpinnerIcon />;
  return (
    <RoomDetailLayout isEditable={isEditable}>
      {/* konvaContainer - konva.stage / konva.layer / konva.shapes */}
      <KonvaContainer
        shapes={shapes}
        setShapes={setShapes}
        isEditable={isEditable}
        imageId={imageId}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
      {/* 아이템 */}
      <SlideBar
        shapes={shapes}
        setShapes={setShapes}
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        saveItemsHandler={saveItemsHandler}
      />

      {/* 휴지통 */}
      {selectedId && (
        <div className="fixed bottom-5 left-5 text-white ">
          <CircleButton label={<BsTrash3 size={30} onClick={() => deleteShape(selectedId)} />} />
        </div>
      )}
      {/* 모달 alertMessage */}
      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => setAlert(null)} />}
        />
      )}
      {/* </div> */}
    </RoomDetailLayout>
  );
}
