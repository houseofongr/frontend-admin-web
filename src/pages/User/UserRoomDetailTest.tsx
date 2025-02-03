import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Konva from "konva";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { CircleData, EllipseData, RectangleData, ShapeData } from "../../types/items";
import { generateUniqueId } from "../../utils/generateUniqueId";
import { getRandomColor } from "../../utils/getRandomColor";
import API_CONFIG from "../../config/api";
import ShapeSelectorTool from "../../components/itemEditor/ShapeSelectorTool";
import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { FaSave } from "react-icons/fa";
import clsx from "clsx";
import ColorTag from "../../components/itemEditor/ColorTag";
import EllipseShape from "../../components/Ellipse";
import RectangleShape from "../../components/Rectangle";
import CircleShape from "../../components/Circle";
import { BsTrash3 } from "react-icons/bs";
import CircleButton from "../../components/common/buttons/CircleButton";

const initialShapes: ShapeData[] = [];

// 생성만 되는 테스트 페이지

export default function UserRoomDetailTest() {
  const { userId, homeId, roomId } = useParams<{ userId: string; homeId: string; roomId: string }>();

  const [shapes, setShapes] = useState<ShapeData[]>(initialShapes);
  const [selectedId, selectShape] = useState<number | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, scaleX: 1, scaleY: 1 });
  const [imageId, setImageId] = useState(null);
  const [isItemListVisible, setIsItemListVisible] = useState(true);

  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  const checkedSelect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
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

  const itemListViewToggleHandler = () => {
    setIsItemListVisible((prev) => !prev);
  };

  const deleteShape = (id: number) => {
    setShapes((prev) => prev.filter((shape) => shape.id !== id));
    selectShape(null);
  };

  const saveHandler = async () => {
    const hasEmptyName = shapes.some((shape) => shape.name.trim() === "");

    if (hasEmptyName) {
      alert("아이템의 이름을 빠짐없이 입력해주세요.");
      return;
    }

    const savedData = shapes.map((shape) => {
      const baseData = {
        name: shape.name,
        itemType: shape.itemType.toUpperCase(),
      };

      if (shape.itemType === "circle") {
        return {
          ...baseData,
          circleData: {
            x: Number(shape.circleData.x.toFixed(2)),
            y: Number(shape.circleData.y.toFixed(2)),
            radius: Number(shape.circleData.radius.toFixed(2)),
          },
        };
      } else if (shape.itemType === "rectangle") {
        return {
          ...baseData,
          rectangleData: {
            x: Number(shape.rectangleData.x.toFixed(2)),
            y: Number(shape.rectangleData.y.toFixed(2)),
            width: Number(shape.rectangleData.width.toFixed(2)),
            height: Number(shape.rectangleData.height.toFixed(2)),
            rotation: Number(shape.rectangleData.rotation.toFixed(2)),
          },
        };
      } else if (shape.itemType === "ellipse") {
        return {
          ...baseData,
          ellipseData: {
            x: Number(shape.ellipseData.x.toFixed(2)),
            y: Number(shape.ellipseData.y.toFixed(2)),
            radiusX: Number(shape.ellipseData.radiusX.toFixed(2)),
            radiusY: Number(shape.ellipseData.radiusY.toFixed(2)),
            rotation: Number(shape.ellipseData.rotation.toFixed(2)),
          },
        };
      }

      return baseData;
    });

    console.log({ items: savedData });

    const apiUrl = `${API_CONFIG.BACK_API}/users/${userId}/homes/${homeId}/rooms/${roomId}/items`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: savedData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save items (status: ${response.status})`);
      }

      const result = await response.json();
      console.log("저장 성공:", result);

      alert("아이템이 성공적으로 저장되었습니다.");
    } catch (error) {
      alert("아이템 저장 중 오류가 발생했습니다.");
    }
  };

  const handleNameChange = (id: number, value: string) => {
    setShapes((prev) => prev.map((shape) => (shape.id === id ? { ...shape, itemName: value } : shape)));
  };

  const handleInputRef = (id: number, element: HTMLInputElement | null) => {
    if (element) {
      inputRefs.current.set(id, element);
    } else {
      inputRefs.current.delete(id);
    }
  };

  useEffect(() => {
    if (selectedId && inputRefs.current.has(selectedId)) {
      const input = inputRefs.current.get(selectedId);
      input?.focus();
    }
  }, [selectedId]);

  useEffect(() => {
    const fetchUserRoom = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BACK_API}/homes/${homeId}/rooms/${roomId}/items`);
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
        const data = await response.json();
        console.log(" get room data", data);

        setImageId(data.room.imageId);
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
  }, [imageId]);

  if (!userId || !homeId || !roomId) return <div>해당 룸 정보를 찾을 수 없습니다.</div>;
  return (
    <div className="relative w-full h-full">
      <ShapeSelectorTool addRect={addRect} addCircle={addCircle} addEllipse={addEllipse} />
      {!isItemListVisible && (
        <div className="absolute right-0 p-5 z-10">
          <CircleButton label={<TbLayoutSidebarLeftCollapseFilled size={25} />} onClick={itemListViewToggleHandler} />
        </div>
      )}
      {/*  아이템 생성 */}
      {isItemListVisible && (
        <aside className="w-1/5 h-full fixed top-0 right-0 z-10 bg-stone-800/90 text-white py-5 px-2 overflow-auto">
          <div className="flex justify-between items-center px-3 border-b pb-5">
            <CircleButton label={<FaSave size={20} onClick={saveHandler} />} />
            <h1>아이템 생성 목록</h1>
            <CircleButton label={<TbLayoutSidebarLeftExpandFilled size={25} />} onClick={itemListViewToggleHandler} />
          </div>

          <ul className="w-full py-4 flex flex-col gap-2">
            {shapes.map((shape) => {
              return (
                <li
                  key={shape.id}
                  className={clsx(
                    "w-[90%] flex items-center gap-1 rounded p-2",
                    shape.id === selectedId ? "border-stone-400" : "border-transparent"
                  )}
                  onClick={() => selectShape(shape.id)}
                >
                  <div className="flex flex-col items-center w-1/5 relative ">
                    <ColorTag fill={shape.fill as string} />
                    <span>{shape.itemType === "rectangle" ? "rect" : shape.itemType}</span>
                  </div>

                  <input
                    ref={(element) => handleInputRef(shape.id, element)}
                    value={shape.name}
                    onChange={(e) => handleNameChange(shape.id, e.target.value)}
                    placeholder="Item title"
                    className="px-2 py-1 bg-transparent border outline-none text-sm border-stone-400"
                  />
                </li>
              );
            })}
          </ul>
        </aside>
      )}

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkedSelect}
        onTouchStart={checkedSelect}
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
            if (shape.itemType === "rectangle") {
              return (
                <RectangleShape
                  key={shape.id}
                  shapeProps={shape.rectangleData}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = { ...shape, rectangleData: newAttrs };
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if (shape.itemType === "circle") {
              return (
                <CircleShape
                  key={shape.id}
                  shapeProps={shape.circleData}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = { ...shape, circleData: newAttrs };
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if (shape.itemType === "ellipse") {
              return (
                <EllipseShape
                  key={shape.id}
                  shapeProps={shape.ellipseData}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
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
        <div className="fixed bottom-5 left-10 w-20 h-20 border-4 border-stone-500 rounded-full flex-center cursor-pointer">
          <span onClick={() => deleteShape(selectedId)}>
            <BsTrash3 size={50} />
          </span>
        </div>
      )}
    </div>
  );
}
