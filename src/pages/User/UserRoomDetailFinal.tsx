import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Konva from "konva";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import API_CONFIG from "../../config/api";
import RectItem from "../../components/user/RectangleItem";
import CircleItem from "../../components/user/CircleItem";
import EllipseItem from "../../components/user/EllipseItem";
import CircleButton from "../../components/buttons/CircleButton";
import { FaSave } from "react-icons/fa";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import clsx from "clsx";
import ColorTag from "../../components/itemEditor/ColorTag";
import { generateUniqueId } from "../../utils/generateUniqueId";
import { getRandomColor } from "../../utils/getRandomColor";
import ShapeSelectorTool from "../../components/itemEditor/ShapeSelectorTool";
import { BsTrash3 } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { formatShapeData } from "../../utils/formatShapeData";
import { CircleData, EllipseData, RectangleData, ShapeData } from "../../types/items";

export default function UserRoomDetailFinal() {
  const { userId, homeId, roomId } = useParams<{ userId: string; homeId: string; roomId: string }>();

  const [originData, setOriginData] = useState<ShapeData[]>([]);
  const [shapes, setShapes] = useState<ShapeData[]>([]);

  const [selectedId, selectShapeId] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, scaleX: 1, scaleY: 1 });
  const [imageId, setImageId] = useState(null);
  const [isItemListVisible, setIsItemListVisible] = useState(true);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);

  console.log("이미지 사이즈", imageSize);

  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const checkedSelectShape = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShapeId(null);
    }
  };

  const toggleEditableShpaes = () => {
    setIsEditable((prev) => !prev);
  };

  const toggleAsideWidth = () => {
    setIsExpanded((prev) => !prev);
  };

  // * 버튼 클릭 시 aside를 토글하는 핸들러
  const itemListViewToggleHandler = () => {
    setIsItemListVisible((prev) => !prev);
  };

  const addRect = () => {
    const newRect: RectangleData = {
      id: generateUniqueId(),
      itemType: "rectangle",
      name: "",
      rectangleData: { x: 100, y: 200, width: 150, height: 100, rotation: 0 },
      fill: getRandomColor(),
    };

    setShapes((prev) => [...prev, newRect]);
  };

  const addCircle = () => {
    const newCircle: CircleData = {
      id: generateUniqueId(),
      itemType: "circle",
      name: "",
      circleData: { x: 100, y: 200, radius: 50 },
      fill: getRandomColor(),
    };

    setShapes((prev) => [...prev, newCircle]);
  };

  const addEllipse = () => {
    const newEllipse: EllipseData = {
      id: generateUniqueId(),
      itemType: "ellipse",
      name: "",
      ellipseData: { x: 200, y: 200, radiusX: 70, radiusY: 50, rotation: 0 },
      fill: getRandomColor(),
    };

    setShapes((prev) => [...prev, newEllipse]);
  };

  const deleteShape = async (id: string) => {
    console.log("itemId", id);

    const isExistingItem = originData.some((shape) => shape.id === id);
    console.log(isExistingItem);
    if (isExistingItem) {
      try {
        const response = await fetch(`${API_CONFIG.BACK_API}/items/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Failed to delete item (status: ${response.status})`);
        alert("아이템이 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("아이템 삭제 중 오류가 발생했습니다.");
        return;
      }
    }

    setShapes((prev) => prev.filter((shape) => shape.id !== id));
  };

  const handleNameChange = (id: string, value: string) => {
    setShapes((prev) => prev.map((shape) => (shape.id === id ? { ...shape, name: value } : shape)));
  };

  const handleInputRef = (id: string, element: HTMLInputElement | null) => {
    if (element) {
      inputRefs.current.set(id, element);
    } else {
      inputRefs.current.delete(id);
    }
  };

  const saveHandler = async () => {
    if (shapes.some((shape) => shape.name.trim() === "")) {
      alert("아이템의 이름을 빠짐없이 입력해주세요.");
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

    console.log({ createItems: createdItems, updateItems: updatedItems });

    const apiUrl = `${API_CONFIG.BACK_API}/users/${userId}/homes/${homeId}/rooms/${roomId}/items/v2`;
    try {
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
      setOriginData(shapes);
      alert("아이템이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("Error saving items:", error);

      alert("아이템 저장 중 오류가 발생했습니다.");
    }
  };

  // 아이템 이름 input과 도형 연동 (도형 클릭 시 input에 포커싱)
  useEffect(() => {
    if (selectedId && inputRefs.current.has(selectedId)) {
      const input = inputRefs.current.get(selectedId);
      input?.focus();
    }
  }, [selectedId]);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchUserRoom = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BACK_API}/homes/${homeId}/rooms/${roomId}/items`);
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
        const data = await response.json();
        console.log(" get room data", data);

        setOriginData(data.items); // 비교용 원본 데이터 상태
        setShapes(data.items); // 페이지에 보여줄 상태
        setImageId(data.room.imageId); // 페이지에 보여줄 룸 이미지값
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchUserRoom();
    const image = new window.Image();
    image.src = `${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${imageId}`;
    image.onload = () => {
      const stageWidth = window.innerWidth;
      const stageHeight = window.innerHeight;

      const imgWidth = image.width;
      const imgHeight = image.height;

      const scaleX = stageWidth / imgWidth;
      const scaleY = stageHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY);

      setImageSize({
        width: imgWidth * scale,
        height: imgHeight * scale,
        scaleX: scale,
        scaleY: scale,
      });
      setBackgroundImage(image);
    };
  }, [homeId, imageId]);

  return (
    <div className={clsx("relative w-full h-fll", { "bg-gray-500": isEditable })}>
      {isEditable && <ShapeSelectorTool addRect={addRect} addCircle={addCircle} addEllipse={addEllipse} />}

      {isItemListVisible ? (
        <aside
          className={clsx(
            "h-full fixed top-0 right-0 z-10 bg-stone-800/90 text-white py-5 px-2 overflow-auto transition-all duration-300",
            isExpanded ? "w-2/5" : "w-1/5"
          )}
        >
          <div className="flex justify-between items-center px-3 border-b pb-5">
            <CircleButton disabled={shapes.length === 0} label={<FaSave size={20} onClick={saveHandler} />} />
            <CircleButton label={<FaRegEdit size={20} />} onClick={toggleEditableShpaes} />
            <CircleButton label={<TbLayoutSidebarLeftExpandFilled size={25} />} onClick={itemListViewToggleHandler} />
          </div>
          <div className="flex gap-2">
            <ul className={clsx("flex flex-col gap-2 border", isExpanded ? "w-[50%]" : "w-full")}>
              <h1 className="text-center py-4">아이템 생성 목록</h1>
              {shapes.map((shape) => {
                return (
                  <li
                    key={shape.id}
                    className={clsx(
                      "w-[90%] flex items-center gap-2 rounded p-2",
                      shape.id === selectedId ? "border-stone-400" : "border-transparent"
                    )}
                    onClick={() => selectShapeId(shape.id)}
                  >
                    <div className="flex items-center w-1/5 relative gap-1">
                      <ColorTag fill={shape.fill || "#ffff"} />
                      <span className="text-sm font-semibold">
                        {shape.itemType.toLowerCase() === "rectangle" ? "rect" : shape.itemType.toLowerCase()}
                      </span>
                    </div>
                    <input
                      ref={(element) => handleInputRef(shape.id, element)}
                      value={shape.name}
                      onChange={(e) => handleNameChange(shape.id, e.target.value)}
                      disabled={!isEditable}
                      placeholder="Item title"
                      className="px-2 py-1 bg-transparent border outline-none text-sm border-stone-400"
                    />
                    <input id="sound-file" type="file" accept="audio/*" className="hidden" />
                    <label htmlFor="sound-file">+</label>
                  </li>
                );
              })}
            </ul>
            {isExpanded && (
              <div className="flex flex-col border w-[50%]">
                <h1 className="text-center py-4">음원 파일 목록</h1>
              </div>
            )}
          </div>
          {shapes.length > 0 && isEditable && (
            <div className="text-end">
              <CircleButton label={">"} onClick={toggleAsideWidth} />
            </div>
          )}
        </aside>
      ) : (
        <div className="absolute right-0 p-5 z-10">
          <CircleButton label={<TbLayoutSidebarLeftCollapseFilled size={25} />} onClick={itemListViewToggleHandler} />
        </div>
      )}

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkedSelectShape}
        onTouchStart={checkedSelectShape}
      >
        <Layer>
          {backgroundImage && (
            <KonvaImage
              image={backgroundImage}
              x={(window.innerWidth - imageSize.width) / 2}
              y={(window.innerHeight - imageSize.height) / 2}
              width={imageSize.width}
              height={imageSize.height}
            />
          )}

          {shapes.map((shape, i) => {
            if ("rectangleData" in shape && shape.rectangleData) {
              return (
                <RectItem
                  key={shape.id}
                  fill={shape.fill ? shape.fill : "#ffff"}
                  shapeProps={shape.rectangleData}
                  isSelected={shape.id === selectedId}
                  isEditable={isEditable}
                  onSelect={() => selectShapeId(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = { ...shape, rectangleData: newAttrs };
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if ("circleData" in shape && shape.circleData) {
              return (
                <CircleItem
                  key={shape.id}
                  fill={shape.fill ? shape.fill : "#ffff"}
                  shapeProps={shape.circleData}
                  isSelected={shape.id === selectedId}
                  isEditable={isEditable}
                  onSelect={() => selectShapeId(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = { ...shape, circleData: newAttrs };
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if ("ellipseData" in shape && shape.ellipseData) {
              return (
                <EllipseItem
                  key={shape.id}
                  fill={shape.fill ? shape.fill : "#ffff"}
                  shapeProps={shape.ellipseData}
                  isSelected={shape.id === selectedId}
                  isEditable={isEditable}
                  onSelect={() => selectShapeId(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = { ...shape, ellipseData: newAttrs };
                    setShapes(updatedShapes);
                  }}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>

      {selectedId && (
        <div className="fixed bottom-5 left-5 text-white ">
          <CircleButton label={<BsTrash3 size={30} onClick={() => deleteShape(selectedId)} />} />
        </div>
      )}
    </div>
  );
}
