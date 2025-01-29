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

//  path =   "/users/:userId/:homeId/:roomId"

export default function UserRoomDetail() {
  const { userId, homeId, roomId } = useParams<{ userId: string; homeId: string; roomId: string }>();
  console.log("userId:", userId, "homeId:", homeId, "roomId:", roomId);
  const [shapes, setShapes] = useState<ShapeData[]>(initialShapes);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  // const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, scaleX: 1, scaleY: 1 });
  const [imageId, setImageId] = useState(null);
  const [isItemListVisible, setIsItemListVisible] = useState(true);
  console.log("isItemListVisible", isItemListVisible);

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

  const saveHandler = () => {
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
          cicleData: {
            x: shape.x,
            y: shape.y,
            radius: shape.radius,
          },
        };
      } else if (shape.type === "rectangle") {
        return {
          ...baseData,
          rectangleData: {
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
            rotation: shape.rotation,
          },
        };
      } else if (shape.type === "ellipse") {
        return {
          ...baseData,
          rectangleData: {
            x: shape.x,
            y: shape.y,
            radiusX: shape.radiusX,
            radiusY: shape.radiusY,
            rotation: shape.rotation,
          },
        };
      }
    });

    console.log(savedData);
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

  // useEffect(() => {
  //   // 브라우저 환경에서만 실행
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setStageSize({ width: window.innerWidth, height: window.innerHeight });
  //     };

  //     handleResize();

  //     window.addEventListener("resize", handleResize);

  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   }
  // }, []);

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
      // 가로 & 세로 비율을 유지하면서 stage에 맞추기
      const scaleX = stageWidth / imgWidth;
      const scaleY = stageHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY); // 최소 스케일값을 적용 (contain 방식)

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
