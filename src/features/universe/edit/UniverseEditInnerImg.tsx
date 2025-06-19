import { useState, useRef, useEffect } from "react";
import {
  RiImageEditFill,
  RiFileDownloadLine,
  RiFunctionAddLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { MdOutlineFullscreen } from "react-icons/md";
import { PiDownloadSimpleBold, PiGpsBold } from "react-icons/pi";
import { IoPlanetOutline } from "react-icons/io5";
import { TbPencilCog } from "react-icons/tb";
import { BiDotsVerticalRounded } from "react-icons/bi";

import API_CONFIG from "../../../config/api";
import {
  postSpaceCreate,
  patchSpaceInnerImageEdit,
  patchSpaceInfoEdit,
  patchSpacePositionEdit,
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

import SpaceSelector from "../../space/components/SpaceSelector";
import SpaceDetailInfoStep from "../../space/create/SpaceDetailInfoStep";

import { SpaceCreateEditStep } from "../../../constants/ProcessSteps";
import { PercentPoint } from "../../../constants/image";
import {
  SaveTargetType,
  UniverseType,
  useUniverseStore,
} from "../../../context/useUniverseStore";
import SpaceCreateSetSizeModal from "../../space/components/SpaceCreateSetSizeModal";
import SpaceInfoEditModal from "../../space/components/SpaceInfoEditModal";

export default function UniverseEditInnerImg() {
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    universeId,
    existingSpaces,
    existingPieces,
    activeInnerImageId,
    rootUniverse,
    currentSpaceId,
    parentSpaceId,
    currentSpace,
    getSpaceById,
    setCurrentSpaceId,
    setCurrentSpace,
    setRootUniverse,
    setUniverseData,
    setParentSpaceId,
    setRootUniverseInnerImageId,
    setActiveInnerImageId,
    refreshUniverseData,
    getParentSpaceInnerImageId,
  } = useUniverseStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [createStep, setStep] = useState<SpaceCreateEditStep | null>(null);
  const [startPoint, setStartPoint] = useState<PercentPoint | null>(null);
  const [endPoint, setEndPoint] = useState<PercentPoint | null>(null);
  const [innerImg, setInnerImg] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    text: string;
    type: AlertType;
    subText: string | null;
  } | null>(null);
  const [showInnerImgEdit, setShowInnerImgEdit] = useState<{
    show: boolean;
    type: SaveTargetType;
    id: number;
  }>({ show: false, type: null, id: -1 });

  const [showInfoEdit, setShowInfoEdit] = useState<boolean>(false);
  const [showCoordinatesEdit, setShowCoordinatesEdit] =
    useState<boolean>(false);

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
        "fail",
        null
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
    showAlert(
      "정말로 스페이스를 삭제하시겠습니까?",
      "check",
      "* 관련된 이미지와 음원, 내부 스페이스 및 요소가 모두 삭제됩니다."
    );
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
      showAlert("변경사항이 저장되었습니다.", "success", null);
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail", null);
    }
  };

  const handleCreateSubmit = (title: string, description: string) => {
    if (startPoint && endPoint && innerImg) createSpace(title, description);
  };

  const createSpace = async (
    title: string,
    description: string
  ): Promise<void> => {
    if (!startPoint || !endPoint || !innerImg) {
      showAlert("스페이스 정보를 모두 입력해주세요.", "fail", null);
      return;
    }
    const currentId =
      currentSpaceId === rootUniverse?.universeId ? -1 : currentSpaceId;
    const metadata = {
      universeId: rootUniverse?.universeId,
      parentSpaceId: currentId,
      title,
      description,
      startX: startPoint.xPercent,
      startY: startPoint.yPercent,
      endX: endPoint.xPercent,
      endY: endPoint.yPercent,
      hidden: true,
    };
    try {
      await postSpaceCreate(metadata, innerImg);
      showAlert("스페이스가 생성되었습니다.", "success", null);
      loadInitialData(currentId);
    } catch (error: any) {
      showAlert(
        error?.message || "스페이스 생성 중 오류가 발생했습니다.",
        "fail",
        null
      );
    }
  };

  const handleCreateInnerImage = (file: File) => {
    setInnerImg(file);
    setStep(SpaceCreateEditStep.FillDetails);
  };

  const handleCreateModalClose = () => {
    setStep(null);
    resetSelection();
    setInnerImg(null);
    setStartPoint(null);
    setEndPoint(null);
  };

  const handleEditModalClose = () => {
    setStep(null);
    resetSelection();
    setShowCoordinatesEdit(false);
    setActiveInnerImageId(currentSpace?.innerImageId!);
  };

  const resetSelection = () => {
    setStartPoint(null);
    setEndPoint(null);
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

    showAlert("변경사항이 저장되었습니다.", "success", null);
    setShowInfoEdit(false);
  };

  const handleCoordinatesEdit = () => {
    var start = {
      xPercent: currentSpace?.startX!,
      yPercent: currentSpace?.startY!,
    };
    var end = {
      xPercent: currentSpace?.endX!,
      yPercent: currentSpace?.endY!,
    };

    setStartPoint(start);
    setEndPoint(end);
    setShowCoordinatesEdit(true);
    setStep(SpaceCreateEditStep.SetSizeOnEdit);
    const parentImgId = useUniverseStore
      .getState()
      .getParentSpaceInnerImageId();
    if (parentImgId != null) setActiveInnerImageId(parentImgId);
  };

  const handleSaveCoordinates = async () => {
    if (
      startPoint == null ||
      startPoint.xPercent == null ||
      startPoint.yPercent == null ||
      endPoint == null ||
      endPoint.xPercent == null ||
      endPoint.yPercent == null ||
      currentSpaceId == null
    ) {
      return;
    }

    const payload = {
      startX: startPoint.xPercent,
      startY: startPoint.yPercent,
      endX: endPoint.xPercent,
      endY: endPoint.yPercent,
    };

    await patchSpacePositionEdit(currentSpaceId, payload);
    refreshUniverseData();

    showAlert("스페이스 좌표가 수정되었습니다.", "success", null);
    setShowCoordinatesEdit(false);
    setStep(null);
    resetSelection();
  };

  const showAlert = (text: string, type: AlertType, subText: string | null) => {
    setAlert({ text, type, subText });
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
        onClick={() => {}}
        className="z-10 absolute cursor-pointer bottom-3 right-3 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <PiDownloadSimpleBold size={20} />
      </button>
      <button
        onClick={() => setStep(SpaceCreateEditStep.SetSizeOnCreate)}
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

      <SpaceSelector
        step={createStep}
        innerImageId={activeInnerImageId}
        startPoint={startPoint}
        endPoint={endPoint}
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
      />

      {createStep === SpaceCreateEditStep.SetSizeOnCreate && (
        <SpaceCreateSetSizeModal
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          handleModalClose={handleCreateModalClose}
          resetSelection={resetSelection}
          onSubmit={() => setStep(SpaceCreateEditStep.UploadImage)}
          // setCreateStep={() => setCreateStep(SpaceCreateStep.UploadImage)}
        />
      )}

      {createStep === SpaceCreateEditStep.UploadImage && (
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

      {createStep === SpaceCreateEditStep.FillDetails && (
        <IconTitleModal
          onClose={handleCreateModalClose}
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          icon={<IoPlanetOutline size={20} />}
          bgColor="white"
        >
          <SpaceDetailInfoStep
            innerImg={innerImg}
            onSubmit={handleCreateSubmit}
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
        <SpaceInfoEditModal
          initTitle={currentSpace?.title ?? ""}
          initDescription={currentSpace?.description ?? ""}
          initHidden
          onClose={() => setShowInfoEdit(false)}
          handleSaveInfo={handleSaveInfo}
        />
      )}

      {showCoordinatesEdit && (
        <SpaceCreateSetSizeModal
          title="스페이스 수정"
          description="스페이스의 좌표를 수정합니다."
          handleModalClose={handleEditModalClose}
          resetSelection={resetSelection}
          onSubmit={handleSaveCoordinates}
        />
      )}
    </div>
  );
}
