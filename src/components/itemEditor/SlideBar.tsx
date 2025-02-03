import {
  FaSave,
  FaRegEdit,
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarLeftCollapseFilled,
  MdArrowBackIos,
  MdArrowForwardIos,
  FcAudioFile,
} from "../../components/icons";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ShapeData } from "../../types/items";
import { ItemSoundsData } from "../../types/sound";
import ColorTag from "./ColorTag";
// import { useQueryClient } from "@tanstack/react-query";
import API_CONFIG from "../../config/api";

import FileName from "../houseEditor/FileName";
import { formatDate } from "../../utils/formatDate";
import CardLabel from "../label/CardLabel";
import CircleButton from "../common/buttons/CircleButton";
import FileUploadButton from "../common/buttons/FileUploadButton";

type SlideBarProps = {
  shapes: ShapeData[];
  setShapes: Dispatch<SetStateAction<ShapeData[]>>;
  isEditable: boolean;
  setIsEditable: Dispatch<SetStateAction<boolean>>;
  saveItemsHandler: () => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
};

export default function SlideBar({
  shapes,
  setShapes,
  isEditable,
  setIsEditable,
  selectedId,
  setSelectedId,
  saveItemsHandler,
}: SlideBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSlidePanelVisible, setIsSlidePanelVisible] = useState(true);
  // 음원 관련 state
  const [itemSounds] = useState<ItemSoundsData | null>(null);
  // const [newSound,setNewSound] = useState<SoundData | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
  console.log("inputRefs", inputRefs);

  // const queryClient = useQueryClient();

  // 초기 음원 데이터 로드
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["item", selectedId],
  //   queryFn: async ({ queryKey }) => {
  //     const itemId = queryKey[1];

  //     const response = await fetch(`${API_CONFIG.BACK_API}/items/${selectedId}/sound-sources`);
  //     const result = await response.json();
  //     return result;
  //   },
  // });

  // const saveSound = async () => {
  //   const formData = new FormData();

  //   const response = await fetch(`${API_CONFIG.BACK_API}/items/${selectedId}/sound-sources`, {
  //     method: "POST",
  //     body: formData,
  //   });
  // };

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev);
    setIsExpanded(false);
    setSelectedId(null); // editmode=false 일때 선택된 아이템의 stroke(사이즈 조절/위치) 표시 x
  };

  const toggleAsideWidth = () => {
    setIsExpanded((prev) => !prev);
    //  setItemSounds(null);
  };

  const toggleSlidePanel = () => {
    setIsSlidePanelVisible((prev) => !prev);
  };

  const handleInputRef = (id: number, element: HTMLInputElement | null) => {
    if (element) {
      inputRefs.current.set(id, element);
    } else {
      inputRefs.current.delete(id);
    }
  };

  const handleItemNameChange = (id: number, value: string) => {
    setShapes((prev) => prev.map((shape) => (shape.id === id ? { ...shape, name: value } : shape)));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    setFileName(newFiles[0].name);
    // setNewSound({ file: newFiles[0], name: "골골송", description: "2025 설이의 골골송", isActive: true });
  };

  // const getItemSounds = () => {
  //   console.log("icon clicked");
  // };
  const deleteSoundSourceHandler = async (soundSourceId: string) => {
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

  useEffect(() => {
    if (selectedId && inputRefs.current.has(selectedId)) {
      const input = inputRefs.current.get(selectedId);
      input?.focus();
    }
  }, [selectedId]);

  return (
    <>
      {isSlidePanelVisible ? (
        <aside
          className={clsx(
            "h-full fixed top-0 right-0 z-10 bg-stone-800/90 text-white transition-all duration-300",
            isExpanded ? "w-2/5" : "w-1/5"
          )}
        >
          <div className="flex justify-between items-center p-4 bg-black/30">
            <CircleButton
              label={<FaRegEdit size={20} />}
              onClick={toggleEditMode}
              hasBorder={false}
              // text={clsx(isEditable ? "SOUND" : "SHAPE")}
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
              onClick={toggleSlidePanel}
              hasBorder={false}
              text="HIDE"
            />
          </div>

          <div className="flex px-4">
            <ul className={clsx("flex flex-col gap-1", isExpanded ? "w-[50%]" : "w-full")}>
              <div className="text-center py-4">아이템 생성 목록</div>
              {shapes.map((shape) => {
                return (
                  <li key={shape.id} className="flex">
                    <div className={clsx("w-full flex items-center gap-2 p-2")} onClick={() => setSelectedId(shape.id)}>
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
                        className={clsx(
                          "px-2 py-1 bg-transparent border outline-none text-sm  overflow-hidden line-clamp-2 rounded-xs",
                          !isEditable && "border-transparent",
                          isEditable && shape.id === selectedId ? "border-[#F5946D] " : "border-gray-400"
                        )}
                      />
                    </div>

                    {/* {!isEditable && (
                      <button onClick={getItemSounds} className="">
                        <RiPlayListFill size={20} />
                      </button>
                    )} */}
                  </li>
                );
              })}
            </ul>

            {/* 음원 리스트 */}
            {isExpanded && (
              <div className="flex flex-col w-[50%] ">
                <div className="text-center py-4">음원 파일 목록</div>

                <div className="flex flex-col w-full ">
                  {itemSounds && (
                    <span className="py-4 border-[#F5946D]">'{itemSounds.itemName}' 에 등록된 소리 모음</span>
                  )}

                  <ul className="">
                    {itemSounds?.soundSource.length === 0 && <div>음원이 존재하지 않습니다.</div>}
                    {itemSounds?.soundSource?.map((sound) => (
                      <li className="flex flex-col p-1">
                        {/* 음원 수정 불가  */}
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
                    {/* <button className="py-2" onClick={() => {}}>
                      등록
                    </button> */}
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isEditable && (
            <div className="relative h-[80%]  flex justify-end items-center">
              {isExpanded ? (
                <div className="fixed top-[500px] hover:text-[#F5946D]  cursor-pointer">
                  <MdArrowBackIos onClick={toggleAsideWidth} size={30} />
                </div>
              ) : (
                <div className="fixed top-[500px] hover:text-[#F5946D] cursor-pointer">
                  <MdArrowForwardIos onClick={toggleAsideWidth} size={30} />
                </div>
              )}
            </div>
          )}
        </aside>
      ) : (
        <div className="absolute top-0 right-0 p-2 z-10 ">
          <CircleButton
            label={<TbLayoutSidebarLeftCollapseFilled size={25} color="white" />}
            onClick={toggleSlidePanel}
          />
        </div>
      )}
    </>
  );
}
