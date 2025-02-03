import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Konva from "konva";
import clsx from "clsx";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import API_CONFIG from "../../config/api";
import RectItem from "../../components/itemEditor/RectangleItem";
import CircleItem from "../../components/itemEditor/CircleItem";
import EllipseItem from "../../components/itemEditor/EllipseItem";
import ColorTag from "../../components/itemEditor/ColorTag";
import ShapeSelectorTool from "../../components/itemEditor/ShapeSelectorTool";
import { formatShapeData } from "../../utils/formatShapeData";
import { ShapeData } from "../../types/items";
import {
  FaSave,
  FaRegEdit,
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
  BsTrash3,
  RiPlayListFill,
  FcAudioFile,
  MdArrowForwardIos,
  MdArrowBackIos,
} from "../../components/icons";
import CardLabel from "../../components/label/CardLabel";

import FileName from "../../components/houseEditor/FileName";
import { formatDate } from "../../utils/formatDate";
import { RectangleShape, CircleShape, EllipseShape } from "../../constants/initialShapeData";
import { ItemSoundsData, SoundData } from "../../types/sound";
import CircleButton from "../../components/common/buttons/CircleButton";
import FileUploadButton from "../../components/common/buttons/FileUploadButton";

export default function UserRoomDetail() {
  const { userId, homeId, roomId } = useParams<{ userId: string; homeId: string; roomId: string }>();

  // 유저 룸 관련 state
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, scaleX: 1, scaleY: 1 });
  // 아이템(shape)관련 state
  const [originData, setOriginData] = useState<ShapeData[]>([]);
  const [shapes, setShapes] = useState<ShapeData[]>([]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [imageId, setImageId] = useState(null);
  const [isItemListVisible, setIsItemListVisible] = useState(true);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 음원 관련 state
  const [itemSounds, setItemSounds] = useState<ItemSoundsData | null>(null);
  const [newSound, setNewSound] = useState<SoundData | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  const checkedSelectShape = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const toggleEditableShpaes = () => {
    setIsEditable((prev) => !prev);
    setIsExpanded(false);
  };

  const toggleAsideWidth = () => {
    setIsExpanded((prev) => !prev);
    setItemSounds(null);
  };

  // * 버튼 클릭 시 aside를 토글하는 핸들러
  const itemListViewToggleHandler = () => {
    setIsItemListVisible((prev) => !prev);
  };

  const addRect = () => {
    setShapes((prev) => [...prev, new RectangleShape()]);
  };

  const addCircle = () => {
    setShapes((prev) => [...prev, new CircleShape()]);
  };

  const addEllipse = () => {
    setShapes((prev) => [...prev, new EllipseShape()]);
  };

  const deleteShape = async (id: number) => {
    const isExistingItem = originData.some((shape) => shape.id === id);
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

  const handleItemNameChange = (id: number, value: string) => {
    setShapes((prev) => prev.map((shape) => (shape.id === id ? { ...shape, name: value } : shape)));
  };

  const handleInputRef = (id: number, element: HTMLInputElement | null) => {
    if (element) {
      inputRefs.current.set(id, element);
    } else {
      inputRefs.current.delete(id);
    }
  };

  const getItemSounds = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/items/${selectedId}/sound-sources`);
      if (!response.ok) {
        throw new Error("Failed to fetch room data");
      }
      const data = await response.json();
      // setItemSounds(ITEM_DATA);
      setItemSounds(data);
      setIsExpanded(true);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    setFileName(newFiles[0].name);
    setNewSound({ file: newFiles[0], name: "골골송", description: "2025 설이의 골골송", isActive: true });
  };

  const deleteSoundSourceHandler = async (soundSourceId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/sound-sources/${soundSourceId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Failed to delete item (status: ${response.status})`);
      alert("아이템이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("아이템 삭제 중 오류가 발생했습니다.");
      return;
    }
  };
  const saveSoundSourceHandler = async () => {
    if (!selectedId) {
      alert("아이템을 선택해주세요.");
      return;
    }

    const formData = new FormData();

    if (newSound?.file) {
      console.log("file 있음!");
      formData.append("soundFile", newSound.file);
    }

    const metadata = {
      name: "올해 나의 다짐 v2",
      description:
        "2025년 1월 1일에 세운 나의 다짐은 '하루 첫 시간 루틴을 만들자'이다.2025 1월 1일에 세운 나의 다짐은 '하루 첫 시간 루틴을 만들자'이다.2025 1월 1일에 세운 나의 다짐은 '하루 첫 시간 루틴을 만들자'이다.",
      isActive: true,
    };
    formData.append("metadata", JSON.stringify(metadata));

    // formdata 콘솔 확인
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      //  backapi / items/{itemId}/ sound-sources
      const response = await fetch(`${API_CONFIG.BACK_API}/items/${selectedId}/sound-sources`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to save items (status: ${response.status})`);
      }
      const result = await response.json();
      console.log("Save success for sound souceId :", result.soundSourceId);
      alert("음원이 아이템에 성공적으로 저장되었습니다.");
      console.log();
    } catch (error) {
      console.error("Error saving items:", error);
      alert("음원을 아이템에 저장 중 오류가 발생했습니다.");
    }
  };

  const saveItemsHandler = async () => {
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
    if (createdItems.length === 0 && updatedItems.length === 0) {
      alert("변경되거나 생성된 아이템이 존재하지않습니다.");
      return;
    }

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
        console.log(" get room data", typeof data);

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
    <div className={clsx("relative w-full h-fll", { "bg-stone-700": isEditable }, { "bg-neutral-300": !isEditable })}>
      {isEditable && <ShapeSelectorTool addRect={addRect} addCircle={addCircle} addEllipse={addEllipse} />}

      {isItemListVisible ? (
        <aside
          className={clsx(
            "h-full fixed top-0 right-0 z-10 bg-stone-800/90 text-white overflow-auto transition-all duration-300",
            isExpanded ? "w-2/5" : "w-1/5"
          )}
        >
          <div className="flex justify-between items-center p-4 bg-black/30">
            <CircleButton
              label={<FaRegEdit size={20} />}
              onClick={toggleEditableShpaes}
              hasBorder={false}
              text="EDIT MODE"
            />

            {isEditable && (
              <CircleButton
                disabled={shapes.length === 0}
                label={<FaSave size={20} onClick={saveItemsHandler} />}
                hasBorder={false}
                text="SAVE"
              />
            )}

            <CircleButton
              label={<TbLayoutSidebarLeftExpandFilled size={25} />}
              onClick={itemListViewToggleHandler}
              hasBorder={false}
              text="HIDE"
            />
          </div>

          <div className="flex gap-2 py-2 px-3 ">
            <ul className={clsx("flex flex-col gap-1", isExpanded ? "w-[50%]" : "w-full")}>
              <h1 className="text-center py-4">아이템 생성 목록</h1>
              {shapes.map((shape) => {
                return (
                  <li
                    key={shape.id}
                    className={clsx(
                      "w-full flex items-center gap-2 rounded p-2",
                      shape.id === selectedId ? "border-stone-400" : "border-transparent"
                    )}
                    onClick={() => setSelectedId(shape.id)}
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
                      onChange={(e) => handleItemNameChange(shape.id, e.target.value)}
                      disabled={!isEditable}
                      placeholder="Item title"
                      className="px-2 py-1 bg-transparent border  text-sm border-stone-400  overflow-hidden line-clamp-2"
                    />
                    {!isEditable && (
                      <button onClick={getItemSounds}>
                        {/* 아이템이 가지고 있는 음원 리스트 조회 */}
                        <RiPlayListFill size={20} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* 음원 리스트 */}
            {isExpanded && (
              <div className="flex flex-col w-[50%] ">
                <h1 className="text-center py-4">음원 파일 목록</h1>

                <div className="flex flex-col w-full ">
                  {itemSounds && (
                    <span className="py-4 border-[#F5946D]">'{itemSounds.itemName}' 에 등록된 소리 모음</span>
                  )}

                  <ul className="">
                    {itemSounds?.soundSource.length === 0 && <div>음원이 존재하지 않습니다.</div>}
                    {itemSounds?.soundSource?.map((sound) => (
                      <li className="flex flex-col p-1">
                        {/* 수정 불가  */}
                        <div className="flex items-center ">
                          <audio controls src={`${API_CONFIG.PRIVATE_AUDIO_LOAD_API}/${sound.audioFileId}`}></audio>
                        </div>
                        <button onClick={() => deleteSoundSourceHandler(sound.id)}>삭제</button>
                        <CardLabel text={`AUDIO ID#${sound.id}`} hasBorder={false} />

                        <div className="flex flex-col gap-1">
                          <div className="flex">
                            <FcAudioFile size={40} />
                            <div>
                              <p className="text-[14px]">{sound.name}</p>
                              <p className="text-xs text-gray-400">
                                {formatDate(sound.createdDate)} / {formatDate(sound.updatedDate)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-300">{sound.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <input id="sound-file" type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                  <div className="w-full flex text-start pt-4">{fileName && <FileName fileName={fileName} />}</div>
                  <div className="flex flex-col">
                    <FileUploadButton htmlFor="sound-file" />
                    <button className="py-2" onClick={saveSoundSourceHandler}>
                      등록
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isEditable && (
            <div className="relative h-[80%]  flex justify-end items-center ">
              {isExpanded ? (
                <div className="fixed top-[500px]  hover:text-orange-400 cursor-pointer">
                  <MdArrowBackIos onClick={toggleAsideWidth} size={30} />
                </div>
              ) : (
                <div className="fixed top-[500px] hover:text-orange-400 cursor-pointer">
                  <MdArrowForwardIos onClick={toggleAsideWidth} size={30} />
                </div>
              )}
            </div>
          )}
        </aside>
      ) : (
        <div className="absolute right-0 p-5 z-10">
          <CircleButton
            label={<TbLayoutSidebarLeftCollapseFilled size={25} color="white" />}
            onClick={itemListViewToggleHandler}
          />
        </div>
      )}

      {/* konva.stage > layer > konva.shapes */}
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
                  onSelect={() => setSelectedId(shape.id)}
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
                  onSelect={() => setSelectedId(shape.id)}
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
                  onSelect={() => setSelectedId(shape.id)}
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
