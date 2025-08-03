import { useState, useRef, useEffect } from "react";
import {
  RiImageEditFill,
  RiFileDownloadLine,
  RiFunctionAddLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { MdOutlineFullscreen } from "react-icons/md";
import {
  PiGpsBold,
  PiPuzzlePiece,
} from "react-icons/pi";
import { IoPlanetOutline } from "react-icons/io5";
import { TbPencilCog } from "react-icons/tb";
import { BiDotsVerticalRounded } from "react-icons/bi";

import API_CONFIG from "../../../config/api";
import {
  patchSpaceInnerImageEdit,
  patchSpaceInfoEdit,
  deleteSpace,
  postSpaceCreateV2,
  patchSpacePositionEditV2,
} from "../../../service/spaceService";
import {
  getUniverseTree,
  patchUniverseInnerImageEdit,
} from "../../../service/universeService";

import ContextMenu from "../../../components/ContextMenu";
import ImageUploadModal from "../../../components/modal/ImageUploadModal";
import IconTitleModal from "../../../components/modal/IconTitleModal";
import ModalAlertMessage, {
  AlertType,
} from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";

import DetailInfoStep from "../../space/create/DetailInfoStep";

import { SpacePiece_CreateEditStep } from "../../../constants/ProcessSteps";
import { PercentPoint } from "../../../constants/image";
import {
  SaveTargetType,
  UniverseType,
  useUniverseStore,
} from "../../../context/useUniverseStore";

import SpaceCreateSetSizeModal from "../../space/components/SpaceCreateSetSizeModal";
import InfoEditModal from "../../../components/modal/InfoEditModal";
import { useSpaceStore } from "../../../context/useSpaceStore";
import {
  CreatePieceMethod,
  usePieceStore,
} from "../../../context/usePieceStore";
import {
  patchPieceCoordinatesEditV2,
  postPieceCreateByCoordinateV2,
} from "../../../service/pieceService";
import PieceDetailPanel from "../../piece/components/PieceDetailPanel";
import SpaceSelector_MultiSelect from "../../space/components/SpaceSelector_multiSelect";

export default function UniverseEditInnerImg() {
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    universeId,
    activeInnerImageId,
    rootUniverse,
    editStep,
    setEditStep,
    setRootUniverse,
    setUniverseData,
    setRootUniverseInnerImageId,
    setActiveInnerImageId,
    refreshUniverseData,
  } = useUniverseStore();

  const {
    currentSpaceId,
    currentSpace,
    getSpaceById,
    setCurrentSpaceId,
    setCurrentSpace,
    setParentSpaceId,
    getParentSpaceInnerImageId,
  } = useSpaceStore();

  const { currentPiece, setCurrentPiece } = usePieceStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedPoints, setSelectedPoints] = useState<PercentPoint[]>([]);
  const [isSelectedComplete, setIsSelectedComplete] = useState(false);

  const [innerImg, setInnerImg] = useState<File | null>(null);
  const [pieceInnerImg, setPieceInnerImg] = useState<File | null>(null);

  const [alert, setAlert] = useState<{
    text: string;
    type: AlertType;
  } | null>(null);
  
  const [showInnerImgEdit, setShowInnerImgEdit] = useState<{
    show: boolean;
    type: SaveTargetType;
    id: number;
  }>({ show: false, type: null, id: -1 });

  const [showInfoEdit, setShowInfoEdit] = useState<boolean>(false);
  const [showCoordinatesEdit, setShowCoordinatesEdit] = useState<string | null>(
    null
  );

  const [createPieceData, setCreatePieceData] = useState<{
    method: CreatePieceMethod;
    title: string;
    description: string;
  }>({
    method: "coordination",
    title: "string",
    description: "string",
  });

  // currentSpaceId 변경 시마다 화면 데이터 설정
  useEffect(() => {
    if (rootUniverse == null) {
      loadInitialData(null);
      return;
    }

    if (currentSpaceId === -1) {
      setUniverseData(
        rootUniverse.innerImageId,
        rootUniverse.spaces,
        rootUniverse.pieces
      );
      return;
    }

    if (currentSpaceId != null) {
      const space = getSpaceById(currentSpaceId);
      if (space) {
        setUniverseData(space.innerImageId, space.spaces, space.pieces);
      } else {
        // 공간을 못 찾으면 루트로 복귀
        setUniverseData(
          rootUniverse.innerImageId,
          rootUniverse.spaces,
          rootUniverse.pieces
        );
        setCurrentSpaceId(-1);
        setCurrentSpace(null);
      }
    }
  }, [currentSpaceId, rootUniverse, universeId]);

  // 초기 데이터 로딩 함수
  const loadInitialData = async (spaceID: number | null) => {
    try {
      if (universeId == null) return;

      const data: UniverseType = await getUniverseTree(universeId); // 0 또는 특정 유니버스 ID
      if (spaceID == null) {
        setRootUniverse(data);
        setUniverseData(data.innerImageId, data.spaces, data.pieces);
        setCurrentSpaceId(-1);
        setCurrentSpace(null);
        setParentSpaceId(-1);
      } else {
        setRootUniverse(data);
        const space = getSpaceById(spaceID);
        if (space != null) {
          setUniverseData(space.innerImageId, space.spaces, space.pieces);
        }
      }
    } catch (error: any) {
      showAlert(
        error?.message || "유니버스 조회 중 오류가 발생했습니다.",
        "fail"
      );
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadImage = () => {
    if (activeInnerImageId !== -1) {
      const imageUrl = `${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/attachment/${activeInnerImageId}`;
      window.location.href = imageUrl;
    }
  };

  const handleInnerImgEdit = (type: SaveTargetType) => {
    if (type == "universe" && rootUniverse != null) {
      const universeId = rootUniverse.universeId;
      setShowInnerImgEdit({ show: true, type, id: universeId });
    } else if (type == "space" && currentSpaceId != null) {
      setShowInnerImgEdit({ show: true, type, id: currentSpaceId });
    }
  };

  const handleSpaceDelete = () => {
    setEditStep(SpacePiece_CreateEditStep.Space_Delete);
  };

  const handleEditInnerImage = (file: File) => {
    EditInnerImgSave(file, showInnerImgEdit.type, showInnerImgEdit.id);
    setShowInnerImgEdit({ show: false, type: null, id: -1 });
  };

  const EditInnerImgSave = async (
    file: File,
    targetType: SaveTargetType,
    targetId: number
  ) => {
    try {
      if (targetType === "universe") {
        const response = await patchUniverseInnerImageEdit(targetId, file);
        setRootUniverseInnerImageId(response.newInnerImageId);
        setActiveInnerImageId(response.newInnerImageId);
      } else if (targetType === "space") {
        const response = await patchSpaceInnerImageEdit(targetId, file);
        setActiveInnerImageId(response.newInnerImageId);
      } else {
        throw new Error("잘못된 대상 유형입니다.");
      }
      showAlert("변경사항이 저장되었습니다.", "success");
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail");
    }
  };

  const handleSpaceCreateSubmit = (
    title: string,
    description: string,
    hidden: boolean
  ) => {
    if (isSelectedComplete && innerImg)
      createSpace(title, description, hidden);
  };

  const handlePieceCreateSubmit = (
    title: string,
    description: string,
    hidden: boolean
  ) => {
    if (
      isSelectedComplete &&
      createPieceData.title != "" &&
      createPieceData.description != ""
    )

      createPiece(title, description, hidden);
  };

  const createSpace = async (
    title: string,
    description: string,
    hidden: boolean
  ): Promise<void> => {
    if (!isSelectedComplete || !innerImg) {
      showAlert("스페이스 정보를 모두 입력해주세요.", "fail");
      return;
    }
    const currentId =
      currentSpaceId === rootUniverse?.universeId ? -1 : currentSpaceId;
    const metadata = {
      universeId: rootUniverse?.universeId,
      parentSpaceId: currentId,
      title,
      description,
      points: selectedPoints,
      hidden: hidden,
    };

    try {
      await postSpaceCreateV2(metadata, innerImg);
      showAlert("스페이스가 생성되었습니다.", "success");
      loadInitialData(currentId);
    } catch (error: any) {
      showAlert(
        error?.message || "스페이스 생성 중 오류가 발생했습니다.",
        "fail"
      );
    }
  };

  const createPiece = async (
    title: string,
    description: string,
    hidden: boolean
  ): Promise<void> => {
    const currentId =
      currentSpaceId === rootUniverse?.universeId ? -1 : currentSpaceId;
    const metadata = {
      universeId: rootUniverse?.universeId,
      parentSpaceId: currentId,
      title,
      description,
      points: selectedPoints,
      hidden: hidden,
    };
    try {
      await postPieceCreateByCoordinateV2(metadata);
      showAlert("피스가 생성되었습니다.", "success");
      loadInitialData(currentId);
    } catch (error: any) {
      showAlert(error?.message || "피스 생성 중 오류가 발생했습니다.", "fail");
    }
  };

  const handleCreateInnerImage = (file: File) => {
    setInnerImg(file);
    setEditStep(SpacePiece_CreateEditStep.Space_FillDetails);
  };

  const handleCreateModalClose = () => {
    setEditStep(null);
    resetSelection();
    setInnerImg(null);
  };

  const handleSpaceEditModalClose = () => {
    setEditStep(null);
    resetSelection();
    setShowCoordinatesEdit(null);
    setActiveInnerImageId(currentSpace?.innerImageId!);
  };

  const handlePieceEditModalClose = () => {
    setShowCoordinatesEdit(null);
    setEditStep(null);
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedPoints([]);
    setIsSelectedComplete(false);

  };

  const handleSaveInfo = async (
    title: string,
    description: string,
    hidden: boolean
  ) => {
    if (currentSpaceId == null) {
      console.log("currentSpaceId가 null임");
      return;
    }

    const payload = {
      title: title,
      description: description,
      hidden: hidden,
    };

    await patchSpaceInfoEdit(currentSpaceId, payload);
    refreshUniverseData();

    showAlert("변경사항이 저장되었습니다.", "success");
    setShowInfoEdit(false);
  };

  const handleCoordinatesEdit = () => {
    // var start = {
    //   xPercent: currentSpace?.startX!,
    //   yPercent: currentSpace?.startY!,
    // };
    // var end = {
    //   xPercent: currentSpace?.endX!,
    //   yPercent: currentSpace?.endY!,
    // };

    // setStartPoint(start);
    // setEndPoint(end);
    setShowCoordinatesEdit("space");
    setEditStep(SpacePiece_CreateEditStep.Space_SetSizeOnEdit);
    const parentImgId = useSpaceStore.getState().getParentSpaceInnerImageId();
    if (parentImgId != null) setActiveInnerImageId(parentImgId);
  };

  const handleSaveCoordinates = async (type: string) => {
    const payload = {
      points: selectedPoints
    };

    if (type == "space" && currentSpaceId != null) {
      await patchSpacePositionEditV2(currentSpaceId, payload);
      refreshUniverseData();
      showAlert("스페이스 좌표가 수정되었습니다.", "success");
    } else if (type == "piece" && currentPiece != null) {
      await patchPieceCoordinatesEditV2(currentPiece.pieceId, payload);
      refreshUniverseData();
      showAlert("피스 좌표가 수정되었습니다.", "success");
    }

    setShowCoordinatesEdit(null);
    setEditStep(null);
    resetSelection();
  };

  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };

  const menuItems =
    currentSpaceId == -1
      ? [
        {
          label: "이미지 수정",
          icon: <RiImageEditFill size={20} />,
          onClick: () => handleInnerImgEdit("universe"),
        },
        {
          label: "이미지 다운로드",
          icon: <RiFileDownloadLine size={20} />,
          onClick: handleDownloadImage,
        },
      ]
      : [
        {
          label: "이미지 수정",
          icon: <RiImageEditFill size={20} />,
          onClick: () => handleInnerImgEdit("space"),
        },
        {
          label: "이미지 다운로드",
          icon: <RiFileDownloadLine size={20} />,
          onClick: handleDownloadImage,
        },
        {
          label: "정보 수정",
          icon: <TbPencilCog size={20} />,
          onClick: () => setShowInfoEdit(true),
        },
        {
          label: "좌표 수정",
          icon: <PiGpsBold size={20} />,
          onClick: handleCoordinatesEdit,
        },
        {
          label: "스페이스 삭제",
          icon: <RiDeleteBin6Line size={20} />,
          onClick: handleSpaceDelete,
        },
      ];

  const handlePieceMethod = () => {
    setEditStep(SpacePiece_CreateEditStep.Piece_FillDetails);
  };

  const closePiecePanel = () => {
    setCurrentPiece(null);
    setEditStep(null);
  };

  const handleDeleteSpace = async () => {
    currentSpaceId;
    if (currentSpaceId == null) {
      showAlert("삭제 중 문제가 발생했습니다. ", "warning");
      return;
    }

    await deleteSpace(currentSpaceId);
    refreshUniverseData();
    setEditStep(null);
  };

  return (
    <div
      ref={menuRef}
      className="h-full relative text-left group flex justify-center"
      onMouseLeave={() => setMenuOpen(false)}
    >
      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => setAlert(null)} />}
          cancelButton={
            <Button
              label="취소"
              variant="gray"
              onClick={() => setAlert(null)}
            />
          }
        />
      )}
      {currentPiece == null && (
        <>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="z-10 absolute cursor-pointer top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <BiDotsVerticalRounded size={20} />
          </button>

          <ContextMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            items={menuItems}
          />

          <button
            onClick={() =>
              setEditStep(SpacePiece_CreateEditStep.Piece_SetSizeOnCreate)
            }
            className="z-10 absolute cursor-pointer bottom-3 right-3 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <PiPuzzlePiece size={20} />
          </button>
          <button
            onClick={() =>
              setEditStep(SpacePiece_CreateEditStep.Space_SetSizeOnCreate)
            }
            className="z-10 absolute cursor-pointer bottom-3 right-12 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <RiFunctionAddLine size={20} />
          </button>
          <button
            onClick={() => {}}
            className="z-10 absolute cursor-pointer bottom-3 right-22 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <MdOutlineFullscreen size={25} />
          </button>
        </>
      )}
      {/* <SpaceSelector
        innerImageId={activeInnerImageId}
        startPoint={startPoint}
        endPoint={endPoint}
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
      /> */}

      <SpaceSelector_MultiSelect
        innerImageId={activeInnerImageId}
        selectedPoints={selectedPoints}
        isSelectedComplete={isSelectedComplete}
        setSelectedPoints={setSelectedPoints}
        setIsSelectedComplete={() => setIsSelectedComplete(true)}
      />
      <PieceDetailPanel
        hidden={editStep == SpacePiece_CreateEditStep.Piece_SetSizeOnEdit}
        piece={currentPiece}
        showCoordinatesEdit={showCoordinatesEdit == "piece"}
        isSelectedComplete={isSelectedComplete}
        setShowCoordinatesEdit={setShowCoordinatesEdit}
        onClose={closePiecePanel}
        onCloseCoordinateModal={handlePieceEditModalClose}
        onResetSelection={resetSelection}
        onSaveCoordinates={() => handleSaveCoordinates("piece")}
      />
      {editStep === SpacePiece_CreateEditStep.Space_SetSizeOnCreate && (
        <SpaceCreateSetSizeModal
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          handleModalClose={handleCreateModalClose}
          resetSelection={resetSelection}
          onSubmit={() =>
            setEditStep(SpacePiece_CreateEditStep.Space_UploadImage)
          }
          showSaveModal={!isSelectedComplete}
        />
      )}
      {editStep === SpacePiece_CreateEditStep.Space_UploadImage && (
        <ImageUploadModal
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          labelText="스페이스 내부 이미지"
          maxFileSizeMB={100}
          onClose={handleCreateModalClose}
          onConfirm={handleCreateInnerImage}
          confirmText="다음"
          requireSquare
        />
      )}
      {editStep === SpacePiece_CreateEditStep.Space_FillDetails && (
        <IconTitleModal
          onClose={handleCreateModalClose}
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          icon={<IoPlanetOutline size={20} />}
          bgColor="white"
        >
          <DetailInfoStep
            innerImg={innerImg}
            onSubmit={handleSpaceCreateSubmit}
          />
        </IconTitleModal>
      )}
      {showInnerImgEdit.show && (
        <ImageUploadModal
          title="이미지 수정"
          description="내부 이미지를 변경할 수 있습니다."
          labelText="내부이미지"
          maxFileSizeMB={100}
          onClose={() =>
            setShowInnerImgEdit({ show: false, type: null, id: -1 })
          }
          onConfirm={(file) => handleEditInnerImage(file)}
          confirmText="저장"
          requireSquare
        />
      )}
      {showInfoEdit && (
        <InfoEditModal
          modalTitle="세부정보 수정"
          modalDescription="스페이스의 세부 정보를 변경할 수 있습니다."
          initTitle={currentSpace?.title ?? ""}
          initDescription={currentSpace?.description ?? ""}
          initHidden
          onClose={() => setShowInfoEdit(false)}
          handleSaveInfo={handleSaveInfo}
        />
      )}
      {showCoordinatesEdit && showCoordinatesEdit == "space" && (
        <SpaceCreateSetSizeModal
          title="스페이스 수정"
          description="스페이스의 좌표를 수정합니다."
          handleModalClose={handleSpaceEditModalClose}
          resetSelection={resetSelection}
          onSubmit={() => {
            handleSaveCoordinates("space");
            setIsSelectedComplete(false);
          }}
          showSaveModal={!isSelectedComplete}
        />
      )}

      {editStep === SpacePiece_CreateEditStep.Space_Delete && (
        <ModalAlertMessage
          text="정말로 스페이스를 삭제하시겠습니까?"
          type="check"
          subText="* 관련된 이미지와 음원, 내부 스페이스 및 요소가 모두 삭제됩니다."
          onClose={() => setEditStep(null)}
          okButton={<Button label="확인" onClick={handleDeleteSpace} />}
          cancelButton={
            <Button
              label="취소"
              variant="gray"
              onClick={() => setEditStep(null)}
            />
          }
        />
      )}

      {editStep === SpacePiece_CreateEditStep.Piece_UploadImage && (
        <ImageUploadModal
          title="피스 생성"
          description="새로운 피스를 생성합니다."
          labelText="피스 이미지"
          maxFileSizeMB={5}
          onClose={handleCreateModalClose}
          onConfirm={(file) => {
            setCreatePieceData((prev) => ({
              ...prev,
              image: file,
            }));
            setEditStep(SpacePiece_CreateEditStep.Piece_SetSizeOnCreate);
          }}
          confirmText="다음"
          requireSquare={false}
        />
      )}
      {editStep === SpacePiece_CreateEditStep.Piece_SetSizeOnCreate && (
        <SpaceCreateSetSizeModal
          title="피스 생성"
          description="새로운 피스를 생성합니다."
          showSaveModal={!isSelectedComplete}
          handleModalClose={handleCreateModalClose}
          resetSelection={resetSelection}
          onSubmit={handlePieceMethod}
        />
      )}
      {editStep === SpacePiece_CreateEditStep.Piece_FillDetails && (
        <IconTitleModal
          onClose={handleCreateModalClose}
          title="피스 생성"
          description="새로운 피스를 생성합니다."
          icon={<IoPlanetOutline size={20} />}
          bgColor="white"
        >
          <DetailInfoStep
            innerImg={pieceInnerImg}
            onSubmit={handlePieceCreateSubmit}
          />
        </IconTitleModal>
      )}
    </div>
  );
}
