import { useParams } from "react-router-dom";
import Konva from "konva";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { CircleData, EllipseData, RectangleData, ShapeData } from "../../types/items";
import { useEffect, useRef, useState } from "react";
import { generateUniqueId } from "../../utils/generateUniqueId";
import { getRandomColor } from "../../utils/getRandomColor";
import API_CONFIG from "../../config/api";
import ShapeSelectorTool from "../../components/itemEditor/ShapeSelectorTool";
import CircleButton from "../../components/buttons/CircleButton";
import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { FaSave } from "react-icons/fa";
import clsx from "clsx";
import ColorTag from "../../components/itemEditor/ColorTag";
import EllipseShape from "../../components/Ellipse";
import RectangleShape from "../../components/Rectangle";
import CircleShape from "../../components/Circle";
import { BsTrash3 } from "react-icons/bs";

const initialShapes: ShapeData[] = [];

export default function UserRoomDetail() {
  const { userId, homeId, roomId } = useParams<{ userId: string; homeId: string; roomId: string }>();
  console.log("userId:", userId, "homeId:", homeId, "roomId:", roomId);
  const [shapes, setShapes] = useState<ShapeData[]>(initialShapes);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, scaleX: 1, scaleY: 1 });
  const [imageId, setImageId] = useState(null);
  const [isItemListVisible, setIsItemListVisible] = useState(true);

  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const checkedSelect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const addRect = () => {
    setShapes((prev) => [
      ...prev,
      {
        id: generateUniqueId().toString(),
        x: 10,
        y: 200,
        width: 100,
        height: 100,
        rotation: 0,
        fill: getRandomColor(),
        type: "rectangle",
        itemName: "",
      },
    ]);
  };

  const addCircle = () => {
    setShapes((prev) => [
      ...prev,
      {
        id: generateUniqueId(),
        x: 100,
        y: 200,
        radius: 50,
        fill: getRandomColor(),
        type: "circle",
        itemName: "",
      },
    ]);
  };

  const addEllipse = () => {
    setShapes((prev) => [
      ...prev,
      {
        id: generateUniqueId().toString(),
        x: 200,
        y: 200,
        radiusX: 70,
        radiusY: 50,
        rotation: 0,
        fill: getRandomColor(),
        type: "ellipse",
        itemName: "",
      },
    ]);
  };

  // * 버튼 클릭 시 aside를 토글하는 핸들러
  const itemListViewToggleHandler = () => {
    setIsItemListVisible((prev) => !prev);
  };

  const deleteShape = (id: string) => {
    setShapes((prev) => prev.filter((shape) => shape.id !== id));
    selectShape(null);
  };

  const saveHandler = async () => {
    const hasEmptyName = shapes.some((shape) => shape.itemName.trim() === "");

    if (hasEmptyName) {
      alert("아이템의 이름을 빠짐없이 입력해주세요.");
      return;
    }

    const savedData = shapes.map((shape) => {
      const baseData = {
        name: shape.itemName,
        itemType: shape.type.toUpperCase(),
      };

      if (shape.type === "circle") {
        return {
          ...baseData,
          circleData: {
            x: Number(shape.x.toFixed(2)),
            y: Number(shape.y.toFixed(2)),
            radius: Number(shape.radius.toFixed(2)),
          },
        };
      } else if (shape.type === "rectangle") {
        return {
          ...baseData,
          rectangleData: {
            x: Number(shape.x.toFixed(2)),
            y: Number(shape.y.toFixed(2)),
            width: Number(shape.width.toFixed(2)),
            height: Number(shape.height.toFixed(2)),
            rotation: Number(shape.rotation.toFixed(2)),
          },
        };
      } else if (shape.type === "ellipse") {
        return {
          ...baseData,
          ellipseData: {
            x: Number(shape.x.toFixed(2)),
            y: Number(shape.y.toFixed(2)),
            radiusX: Number(shape.radiusX.toFixed(2)),
            radiusY: Number(shape.radiusY.toFixed(2)),
            rotation: Number(shape.rotation.toFixed(2)),
          },
        };
      }
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

  const handleNameChange = (id: string, value: string) => {
    setShapes((prev) => prev.map((shape) => (shape.id === id ? { ...shape, itemName: value } : shape)));
  };

  const handleInputRef = (id: string, element: HTMLInputElement | null) => {
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
        const response = await fetch(`${API_CONFIG.BACK_API}/houses/rooms/${roomId}/items`);
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
        const data = await response.json();
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
                    <span>{shape.type === "rectangle" ? "rect" : shape.type}</span>
                  </div>

                  <input
                    ref={(element) => handleInputRef(shape.id, element)}
                    value={shape.itemName}
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
        // ReferenceError : window is not defined
        width={window.innerWidth}
        height={window.innerHeight}
        // width={stageSize.width}
        // height={stageSize.height}
        onMouseDown={checkedSelect}
        onTouchStart={checkedSelect}
      >
        <Layer>
          {/* {backgroundImage && <KonvaImage image={backgroundImage} x={0} y={0} />} */}
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
            if (shape.type === "rectangle") {
              return (
                <RectangleShape
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = {
                      ...newAttrs,
                      id: shape.id,
                      type: "rectangle",
                    } as RectangleData;
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if (shape.type === "circle") {
              return (
                <CircleShape
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = {
                      ...newAttrs,
                      id: shape.id,
                      type: "circle",
                    } as CircleData;
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if (shape.type === "ellipse") {
              return (
                <EllipseShape
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = {
                      ...newAttrs,
                      id: shape.id,
                      type: "ellipse",
                    } as EllipseData;
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
