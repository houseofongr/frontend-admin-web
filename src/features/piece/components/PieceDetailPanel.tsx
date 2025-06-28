import React, { useEffect, useState } from "react";
import SoundItem from "./SoundItem";
import Pagination from "../../../components/Pagination";
import {
  patchPieceInfoEdit,
} from "../../../service/pieceService";
import { IoIosClose } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import {
  RiDeleteBin6Line,
} from "react-icons/ri";
import { TbPencilCog } from "react-icons/tb";
import { PiGpsBold } from "react-icons/pi";
import ContextMenu from "../../../components/ContextMenu";
import InfoEditModal from "../../../components/modal/InfoEditModal";
import { usePieceStore } from "../../../context/usePieceStore";
import ModalAlertMessage, {
  AlertType,
} from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";
import SpaceCreateSetSizeModal from "../../space/components/SpaceCreateSetSizeModal";
import { useUniverseStore } from "../../../context/useUniverseStore";
import { CreateEditStep } from "../../../constants/ProcessSteps";

interface PieceType {
  pieceId: number;
  title: string;
  description: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  [key: string]: any;
}

interface SoundType {
  soundId: number;
  audioId: number;
  title: string;
  description: string;
  createdTime: number;
}

interface PieceDetailPanelProps {
  hidden: boolean;
  piece: PieceType | null;
  showCoordinatesEdit: boolean;
  setShowCoordinatesEdit: (type:string) => void;
  onClose: () => void;
  onCloseCoordinateModal: () => void;
  onResetSelection: () => void;
  onSaveCoordinates: () => void;
}

const PieceDetailPanel: React.FC<PieceDetailPanelProps> = ({
  hidden,
  piece,
  showCoordinatesEdit,
  setShowCoordinatesEdit,
  onClose,
  onCloseCoordinateModal,
  onResetSelection,
  onSaveCoordinates,
}) => {
  const { setPieceInfo } = usePieceStore();
  const { setEditStep } = useUniverseStore();

  const [sounds, setSounds] = useState<SoundType[]>([]);
  const [pagination, setPagination] = useState({
    size: 10,
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [showInfoEdit, setShowInfoEdit] = useState(false);
  const [alert, setAlert] = useState<{
    text: string;
    type: AlertType;
    subText: string | null;
  } | null>(null);

  const fetchPieceDetail = async (page: number) => {
    if (!piece) return;
    try {
      const data = dummyPieceData; // 실제 API 연결 시 교체
      setSounds(data.sounds);
      setPagination({
        size: data.pagination.size,
        currentPage: data.pagination.pageNumber,
        totalPages: data.pagination.totalPages,
        totalElements: data.pagination.totalElements,
      });
    } catch (error) {
      console.error("피스 상세 정보를 가져오지 못했습니다:", error);
    }
  };

  useEffect(() => {
    fetchPieceDetail(1);
  }, [piece?.pieceId]);
  // ⚙️ 이벤트 핸들러
  const handlePageChange = (newPage: number) => fetchPieceDetail(newPage);
  const handleSpaceDelete = () => console.log("피스 삭제");

  const handleInfoEdit = () => {
    setShowInfoEdit(true);
    setMenuOpen(false);
  };

  const handleCoordinatesEdit = () => {
    setEditStep(CreateEditStep.Piece_SetSizeOnEdit);
    setShowCoordinatesEdit("piece");
    setMenuOpen(false);
  };

  const handleSaveInfo = async (
    title: string,
    description: string,
    hidden: boolean
  ) => {
    if (!piece?.pieceId) return;
    const payload = { title, description, hidden };
    await patchPieceInfoEdit(piece.pieceId, payload);
    setPieceInfo(title, description, hidden);
    showAlert("변경사항이 저장되었습니다.", "success", null);
    setShowInfoEdit(false);
  };

  const showAlert = (text: string, type: AlertType, subText: string | null) =>
    setAlert({ text, type, subText });

  const menuItems = [
    // {
    //   label: "이미지 수정",
    //   icon: <RiImageEditFill size={20} />,
    //   onClick: () => handleInnerImgEdit("space"),
    // },
    // {
    //   label: "이미지 다운로드",
    //   icon: <RiFileDownloadLine size={20} />,
    //   onClick: handleDownloadImage,
    // },
    {
      label: "정보 수정",
      icon: <TbPencilCog size={20} />,
      onClick: handleInfoEdit,
    },
    {
      label: "좌표 수정",
      icon: <PiGpsBold size={20} />,
      onClick: handleCoordinatesEdit,
    },
    {
      label: "피스 삭제",
      icon: <RiDeleteBin6Line size={20} />,
      onClick: handleSpaceDelete,
    },
  ];

  if (!piece) return null;
  return (
    <>
      {!hidden && (
        <div className="absolute top-0 right-0 h-full w-80 bg-black/70 shadow-lg border-l z-20 pt-13 overflow-y-auto">
          {alert && (
            <ModalAlertMessage
              text={alert.text}
              type={alert.type}
              onClose={() => setAlert(null)}
              okButton={<Button label="확인" onClick={() => setAlert(null)} />}
              cancelButton={
                alert.type === "check" ? (
                  <Button
                    label="취소"
                    variant="gray"
                    onClick={() => setAlert(null)}
                  />
                ) : undefined
              }
              {...(alert.subText ? { subText: alert.subText } : {})}
            />
          )}

          {/* 상단 제목/설명 */}
          <div className="text-xl px-8 mb-4 text-white">
            {/* 수정 아이콘 버튼 (닫기 버튼 왼쪽) */}
            <button
              className="absolute top-4 right-12 text-white hover:text-gray-400 transition cursor-pointer"
              onClick={() => setMenuOpen(true)}
            >
              <BiDotsVerticalRounded size={21} />
            </button>
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white hover:text-rose-300 transition cursor-pointer"
            >
              <IoIosClose size={30} />
            </button>
            <div className="font-bold">{piece.title}</div>
            <div className="text-sm pr-10 pt-1">{piece.description}</div>
          </div>

          {/* ContextMenu 렌더링 */}
          {menuOpen && (
            <ContextMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              items={menuItems}
              position={{ right: 53, top: 37 }}
            />
          )}

          {/* 사운드 리스트 */}
          <div className="p-4 ">
            {sounds.length === 0 ? (
              <div className="text-sm text-gray-300">
                등록된 사운드가 없습니다.
              </div>
            ) : (
              sounds.map((s, i) => (
                <SoundItem
                  key={`${s.soundId}-${i}`}
                  index={i + (pagination.currentPage - 1) * pagination.size}
                  title={s.title}
                  description={s.description}
                  createdTime={s.createdTime}
                />
              ))
            )}
          </div>
          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
          {showInfoEdit && (
            <InfoEditModal
              modalTitle="세부정보 수정"
              modalDescription="피스의 세부 정보를 변경할 수 있습니다."
              initTitle={piece.title ?? ""}
              initDescription={piece.description ?? ""}
              initHidden
              onClose={() => setShowInfoEdit(false)}
              handleSaveInfo={handleSaveInfo}
            />
          )}
        </div>
      )}

      {showCoordinatesEdit && (
        <SpaceCreateSetSizeModal
          title="피스 수정"
          description="피스의 좌표를 수정합니다."
          handleModalClose={onCloseCoordinateModal}
          resetSelection={onResetSelection}
          onSubmit={onSaveCoordinates}
        />
      )}
    </>
  );
};

export default PieceDetailPanel;

const dummyPieceData = {
  pieceId: 1,
  title: "조각",
  description: "피스는 조각입니다.",
  hidden: false,
  createdTime: 1750749753,
  updatedTime: 1750749753,
  sounds: [
    {
      soundId: 11,
      audioId: 11,
      title: "기차역",
      description: "기차가 도착하고 출발하는 생동감 있는 역 소리입니다.",
      hidden: true,
      createdTime: 1749465600,
      updatedTime: 1749465600,
    },
    {
      soundId: 10,
      audioId: 10,
      title: "명상 종소리",
      description: "마음을 가라앉히는 명상용 종소리입니다.",
      hidden: true,
      createdTime: 1749465540,
      updatedTime: 1749465540,
    },
    {
      soundId: 9,
      audioId: 9,
      title: "바람 소리",
      description: "들판을 스치는 부드러운 바람 소리입니다.",
      hidden: true,
      createdTime: 1749465480,
      updatedTime: 1749465480,
    },
    {
      soundId: 8,
      audioId: 8,
      title: "도시의 아침",
      description:
        "도시에서 아침에 들리는 자동차 소리와 사람들의 움직임입니다.",
      hidden: true,
      createdTime: 1749465420,
      updatedTime: 1749465420,
    },
    {
      soundId: 11,
      audioId: 11,
      title: "기차역",
      description: "기차가 도착하고 출발하는 생동감 있는 역 소리입니다.",
      hidden: true,
      createdTime: 1749465600,
      updatedTime: 1749465600,
    },
  ],
  pagination: {
    size: 5,
    pageNumber: 1,
    totalPages: 5,
    totalElements: 30,
  },
};
