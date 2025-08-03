import React, { useEffect, useState } from "react";
import SoundItem from "../../sound/components/SoundItem";
import Pagination from "../../../components/Pagination";
import {
  deletePiece,
  getPieceDetail,
  patchPieceInfoEdit,
} from "../../../service/pieceService";
import { IoIosClose } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbMusic, TbMusicPlus, TbPencilCog } from "react-icons/tb";
import { PiGpsBold } from "react-icons/pi";
import ContextMenu from "../../../components/ContextMenu";
import InfoEditModal from "../../../components/modal/InfoEditModal";
import { PieceType, usePieceStore } from "../../../context/usePieceStore";
import ModalAlertMessage, {
  AlertType,
} from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";
import SpaceCreateSetSizeModal from "../../space/components/SpaceCreateSetSizeModal";
import { useUniverseStore } from "../../../context/useUniverseStore";
import {
  SoundCreateStep,
  SpacePiece_CreateEditStep,
} from "../../../constants/ProcessSteps";
import AudioUploadModal from "../../../components/modal/AudioUploadModal";
import IconTitleModal from "../../../components/modal/IconTitleModal";
import { IoPlanetOutline } from "react-icons/io5";
import DetailInfoStep from "../../space/create/DetailInfoStep";
import { createSound } from "../../../service/soundService";
import { SoundType } from "../../../context/useSoundStore";

// interface PieceType {
//   pieceId: number;
//   title: string;
//   description: string;
//   startX: number;
//   startY: number;
//   endX: number;
//   endY: number;
//   [key: string]: any;
// }

// interface SoundType {
//   soundId: number;
//   audioId: number;
//   title: string;
//   description: string;
//   createdTime: number;
// }

interface PieceDetailPanelProps {
  hidden: boolean;
  piece: PieceType | null;
  showCoordinatesEdit: boolean;
  isSelectedComplete: boolean;
  setShowCoordinatesEdit: (type: string) => void;
  onClose: () => void;
  onCloseCoordinateModal: () => void;
  onResetSelection: () => void;
  onSaveCoordinates: () => void;
}

const PieceDetailPanel: React.FC<PieceDetailPanelProps> = ({
  hidden,
  piece,
  showCoordinatesEdit,
  isSelectedComplete,
  setShowCoordinatesEdit,
  onClose,
  onCloseCoordinateModal,
  onResetSelection,
  onSaveCoordinates,
}) => {
  const { setPieceInfo } = usePieceStore();
  const { setEditStep, refreshUniverseData } = useUniverseStore();

  const [sounds, setSounds] = useState<SoundType[]>([]);
  const [pagination, setPagination] = useState({
    size: 10,
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [showInfoEdit, setShowInfoEdit] = useState(false);
  const [showAudioCreate, setShowAudioCreate] =
    useState<SoundCreateStep | null>(null);
  const [createSoundData, setCreateSoundData] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    text: string;
    type: AlertType;
    subText: string | null;
  } | null>(null);

  const fetchPieceDetail = async (page: number) => {
    if (!piece) return;
    try {
      const data = await getPieceDetail(piece.pieceId, page, pagination.size);
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
  const handlePieceDelete = () =>
    showAlert(
      "정말로 피스를 삭제하시겠습니까?",
      "check",
      "* 관련된 이미지와 음원이 모두 삭제됩니다."
    );

  const handleInfoEdit = () => {
    setShowInfoEdit(true);
    setMenuOpen(false);
  };

  const handleCoordinatesEdit = () => {
    setEditStep(SpacePiece_CreateEditStep.Piece_SetSizeOnEdit);
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
      onClick: handlePieceDelete,
    },
  ];
  const handelAlertOkBtn = async (type: string) => {
    setAlert(null);
    if (type == "check" && piece != null) {
      try {
        await deletePiece(piece.pieceId);
        showAlert("삭제가 완료되었습니다.", "success", null);
        refreshUniverseData();
      } catch (error) {
        console.error("삭제 실패:", error);
        showAlert("삭제에 실패했습니다.", "fail", "잠시 후 다시 시도해주세요.");
      }
    }
  };

  const fetchCreateSound = async (
    title: string,
    description: string,
    hidden: boolean
  ): Promise<void> => {
    if (createSoundData == null) return;

    const currentPiece = piece?.pieceId;
    const metadata = {
      pieceId: currentPiece,
      title,
      description,
      hidden,
    };
    try {
      var res = await createSound(metadata, createSoundData);

      const newSound: SoundType = {
        soundId: res.soundId,
        audioId: res.audioFileId,
        title: res.title,
        description: res.description,
        hidden: res.hidden,
        createdTime: Math.floor(Date.now() / 1000),
        updatedTime: Math.floor(Date.now() / 1000),
      };

      setSounds((prev) => [newSound, ...prev]);

      showAlert("사운드가 생성되었습니다.", "success", null);
      setShowAudioCreate(null);
    } catch (error: any) {
      showAlert(
        error?.message || "사운드 생성 중 오류가 발생했습니다.",
        "fail",
        null
      );
    }
  };

  const handleSoundStepSubmit = (file: File) => {
    setCreateSoundData(file);
    setShowAudioCreate(SoundCreateStep.DetailInfo);
  };

  const handleInfoStepSubmit = (
    title: string,
    description: string,
    hidden: boolean
  ) => {
    fetchCreateSound(title, description, hidden);
  };

  const updateSound = (soundId: number, newAudioId: number) => {
    setSounds((prev) =>
      prev.map((sound) =>
        sound.soundId === soundId
          ? {
              ...sound,
              audioId: newAudioId,
            }
          : sound
      )
    );
  };

  const updateSoundInfo = (
    soundId: number,
    title: string,
    description: string,
    hidden: boolean
  ) => {
    setSounds((prev) =>
      prev.map((sound) =>
        sound.soundId === soundId
          ? {
              ...sound,
              title,
              description,
              hidden,
            }
          : sound
      )
    );
  };

  const deleteSound = (soundId: number) => {
    setSounds((prev) => prev.filter((sound) => sound.soundId !== soundId));
  };

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
              okButton={
                <Button
                  label="확인"
                  onClick={() => handelAlertOkBtn(alert.type)}
                />
              }
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
          <div className="relative p-4 pt-5">
            <button
              className="absolute top-0 right-5 text-white cursor-pointer hover:opacity-70 overflow-visible"
              onClick={() => setShowAudioCreate(SoundCreateStep.Sound)}
            >
              <TbMusicPlus size={20} />
            </button>
            {sounds.length === 0 ? (
              <div className="text-sm text-gray-300">
                등록된 사운드가 없습니다.
              </div>
            ) : (
              sounds.map((s, i) => (
                <SoundItem
                  key={`${s.soundId}-${i}`}
                  index={i + (pagination.currentPage - 1) * pagination.size}
                  soundData={s}
                  onUpdateSound={updateSound}
                  onUpdateSoundInfo={updateSoundInfo}
                  onDeleteSound={deleteSound}
                />
              ))
            )}
          </div>
          {/* 페이지네이션 */}
          {pagination.totalPages >= 1 && (
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

          {showAudioCreate == SoundCreateStep.Sound && (
            <AudioUploadModal
              onClose={() => setShowAudioCreate(null)}
              onConfirm={handleSoundStepSubmit}
              title="오디오 업로드"
              description="선택한 피스에 오디오를 입력합니다."
              labelText="선택한 피스에 추가할 오디오를"
              subLabelText="사운드는 50MB 이하의 MP3, WAV 파일만 가능합니다."
              confirmText="다음"
              maxFileSizeMB={50}
            />
          )}

          {showAudioCreate == SoundCreateStep.DetailInfo && (
            <IconTitleModal
              onClose={() => setShowAudioCreate(null)}
              title="사운드 생성"
              description="새로운 사운드를 생성합니다."
              icon={<TbMusic size={20} />}
              bgColor="white"
            >
              <DetailInfoStep
                sound={createSoundData}
                onSubmit={handleInfoStepSubmit}
              />
            </IconTitleModal>
          )}
        </div>
      )}

      {showCoordinatesEdit && (
        <SpaceCreateSetSizeModal
          title="피스 수정"
          description="피스의 좌표를 수정합니다."
          showSaveModal={!isSelectedComplete}
          handleModalClose={onCloseCoordinateModal}
          resetSelection={onResetSelection}
          onSubmit={onSaveCoordinates}
        />
      )}
    </>
  );
};

export default PieceDetailPanel;
