import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ShapeData } from "../../types/items";
import ColorTag from "./ColorTag";
import { useQuery } from "@tanstack/react-query";
import CircleButton from "../common/buttons/CircleButton";
import { fetchItemSounds } from "../../service /soundService";
import SlideRightSection from "./SlideRightSection";
import {
  FaSave,
  FaRegEdit,
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarLeftCollapseFilled,
  MdArrowBackIos,
  MdArrowForwardIos,
  RiPlayListFill,
} from "../../components/icons";
import NoDataNotice from "./NoDataNotice";

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
  const [targetItemId, setTargetItemId] = useState<number | null>(null);

  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  const { data } = useQuery({
    queryKey: ["itemSounds", targetItemId],
    queryFn: () => fetchItemSounds(targetItemId!),
    enabled: !!targetItemId, // selectedId가 있을 때만 쿼리 실행
    retry: 1, // 실패 시 한 번만 재시도
    refetchOnWindowFocus: false,
  });

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev);
    setIsExpanded(false);
    setSelectedId(null);
  };

  const toggleAsideWidth = () => {
    setIsExpanded((prev) => !prev);
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

  const getItemSounds = (itemId: number) => {
    setIsExpanded(true);
    setTargetItemId(itemId);
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
            isExpanded ? "w-3/5" : "w-1/5"
          )}
        >
          {/*  top section - action buttons */}
          <div className="flex justify-between items-center p-4 bg-black/30">
            <CircleButton label={<FaRegEdit size={20} />} onClick={toggleEditMode} hasBorder={false} text="EDIT MODE" />

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

          {/* 아이템 생성 목록 - 컴포넌트화 X  */}
          <div className="flex px-4 gap-4 mr-5">
            <ul className={clsx("flex flex-col gap-1 ", isExpanded ? "w-[40%]" : "w-full")}>
              <div className="text-center py-4">아이템 생성 목록</div>
              {shapes.map((shape) => {
                return (
                  <li key={shape.id} className="flex">
                    <div className={clsx("w-full flex items-center gap-2 p-2")} onClick={() => setSelectedId(shape.id)}>
                      <div className="flex items-center min-w-16 relative gap-1">
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
                          "px-2 py-1  border text-sm  overflow-hidden line-clamp-2 rounded-xs",
                          !isEditable && "border-transparent",
                          isEditable && shape.id === selectedId ? "border-[#F5946D] " : "border-[#ffff]"
                        )}
                      />
                    </div>

                    {!isEditable && (
                      <button onClick={() => getItemSounds(shape.id)} className="cursor-pointer">
                        <RiPlayListFill size={17} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            {/* right section - 음원 목록 + 음원 추가 양식*/}
            {isExpanded && data && <SlideRightSection sounds={data} itemId={targetItemId} />}
            {isExpanded && !data && <NoDataNotice />}
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
        // aside element (슬라이드바) 전체 숨기기
        <div className="absolute top-0 right-0 p-2 z-10">
          <CircleButton
            label={<TbLayoutSidebarLeftCollapseFilled size={25} color="white" />}
            onClick={toggleSlidePanel}
          />
        </div>
      )}
    </>
  );
}
