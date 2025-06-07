import { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import API_CONFIG from "../../../config/api";
import { RiImageEditFill, RiFileDownloadLine, RiFunctionAddLine } from "react-icons/ri";
import ContextMenu from "../../../components/ContextMenu";
import { MdOutlineFullscreen } from "react-icons/md";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { IoPlanetOutline } from "react-icons/io5";
import DraggableIconTitleModal from "../../../components/modal/DraggableIconTitleModal";
import SpaceSelector from "../components/SpaceSelector";
import { LuPaintbrush } from "react-icons/lu";
import { SpaceCreateStep } from "../../../constants/ProcessSteps";
import ImageUploadModal from "../../../components/modal/ImageUploadModal";
import IconTitleModal from "../../../components/modal/IconTitleModal";
import { PercentPoint } from "../../../constants/image";
import SpaceDetailInfoStep from "../../space/create/SpaceDetailInfoStep";

interface UniverseEditInnerImgProps {
  innerImageId: number;
  onEdit: () => void;
}

interface CreateSpaceParams {
  startPoint: PercentPoint;
  endPoint: PercentPoint;
  title: string;
  description: string;
  parentSpaceId: number;
  universeId: number;
  innerImg: File;
}

export default function UniverseEditInnerImg({
  innerImageId,
  onEdit,
}: UniverseEditInnerImgProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [createStep, setCreateStep] = useState<SpaceCreateStep | null>(null);

  const [startPoint, setStartPoint] = useState<PercentPoint | null>(null);
  const [endPoint, setEndPoint] = useState<PercentPoint | null>(null);
  const [innerImg, setInnerImg] = useState<File | null>(null);

  const [universeId, setUniverseId] = useState<number>(-1);
  const [parentSpaceId, setParentSpaceId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const resetSelection = () => {
    setStartPoint(null);
    setEndPoint(null);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  async function createSpace({
    startPoint,
    endPoint,
    title,
    description,
    parentSpaceId,
    universeId,
    innerImg,
  }: CreateSpaceParams): Promise<void> {
    if (!startPoint || !endPoint) {
      throw new Error("좌표 정보가 없습니다.");
    }

    const dx = Math.min(startPoint.xPercent, endPoint.xPercent);
    const dy = Math.min(startPoint.yPercent, endPoint.yPercent);
    const scaleX = Math.abs(endPoint.xPercent - startPoint.xPercent);
    const scaleY = Math.abs(endPoint.yPercent - startPoint.yPercent);

    const formData = new FormData();

    const metadata = {
      universeId: universeId,
      parentSpaceId: parentSpaceId,
      title: title,
      description: description,
      dx: dx,
      dy: dy,
      scaleX: scaleX,
      scaleY: scaleY,
    };

    formData.append("metadata", JSON.stringify(metadata));
    formData.append("image", innerImg);

    // try {
    const response = await fetch(`${API_CONFIG.BACK_API}/spaces`, {
      method: "POST",
      body: formData,
    });

    // if (!response.ok) {
    //   let errorMessage =
    //     "새로운 스페이스 데이터를 생성하는데 실패하였습니다.";
    //   try {
    //     const errorData = await response.json();
    //     errorMessage = errorData.message || errorMessage;
    //   } catch (jsonError) {
    //     console.error("JSON 파싱 오류:", jsonError);
    //   }
    //   // alert(errorMessage, "fail");
    //   return;
    // }

    if (!response.ok) alert("스페이슷 생성 실패");
    else alert("스페이스 생성 완료");

    // showAlert("새로운 스페이스가 성공적으로 저장되었습니다.", "success");
    // } catch (error) {
    // showAlert(
    //   `데이터 저장 중 오류가 발생하였습니다. error: ${error}`,
    //   "fail"
    // );
    // }
  };


  const handleDownloadImage = async () => {
    try {
      if (innerImageId != -1) {
        const imageUrl = `${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/attachment/${innerImageId}`;
        window.location.href = imageUrl;
      }
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
    }
  };
  // 외부 클릭 감지 후 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: "이미지 수정",
      icon: <RiImageEditFill size={20} />,
      onClick: onEdit,
    },
    {
      label: "이미지 다운로드",
      icon: <RiFileDownloadLine size={20} />,
      onClick: handleDownloadImage,
    },
  ];

  const onCreateSpaceModalClose = () => {
    setCreateStep(null);
    setStartPoint(null);
    setEndPoint(null);
    setInnerImg(null);
  }

  const onCreateSpaceModalSubmit = () => {
    setCreateStep(SpaceCreateStep.UploadImage);

  }

  function handleSaveInnerImage(file: File): void {
    setCreateStep(SpaceCreateStep.FillDetails);
    setInnerImg(file);
  }

  return (
    <div
      ref={menuRef}
      className="h-full relative text-left group flex justify-center"
      onMouseLeave={() => setMenuOpen(false)}
    >
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
        onClick={() => { }}
        className="z-10 absolute cursor-pointer bottom-3 right-3 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <PiDownloadSimpleBold size={20} />
      </button>
      <button
        onClick={() => { }}
        className="z-10 absolute cursor-pointer bottom-3 right-12 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <RiFunctionAddLine size={20} />
      </button>
      <button
        onClick={() => {
          setCreateStep(SpaceCreateStep.SetSize);
        }}
        className="z-10 absolute cursor-pointer bottom-3 right-22 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <MdOutlineFullscreen size={25} />
      </button>

      <SpaceSelector
        step={createStep}
        innerImageId={innerImageId}
        startPoint={startPoint}
        endPoint={endPoint}
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
      />

      {createStep !== null && createStep === SpaceCreateStep.SetSize && (
        <DraggableIconTitleModal
          onClose={onCreateSpaceModalClose}
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          icon={<IoPlanetOutline className="text-blue-950" size={20} />}
          bgColor="white"
        >
          <div className="flex flex-col items-center justify-center text-center p-4 gap-4">
            <div>
              <p>원하는 크기로 조절을 완료하세요.</p>
              <p className="mt-1 text-sm text-neutral-500">
                {"(안내창은 드래그해서 이동할 수 있습니다.)"}
              </p>
            </div>

            <button
              onClick={resetSelection}
              className="px-10 py-2 border-2 border-neutral-600 text-neutral-600 font-bold rounded-lg hover:bg-neutral-200 transition cursor-pointer"
            >
              <div className="flex flex-row justify-center gap-3">
                <LuPaintbrush size={20} />
                <p>다시 그리기</p>
              </div>
            </button>
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition cursor-pointer"
                onClick={onCreateSpaceModalSubmit}>
                완료
              </button>
              <button className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                onClick={onCreateSpaceModalClose}>
                취소
              </button>
            </div>
          </div>
        </DraggableIconTitleModal>
      )}

      {createStep !== null && createStep === SpaceCreateStep.UploadImage && (
        <ImageUploadModal
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          labelText="스페이스 내부 이미지"
          maxFileSizeMB={5}
          onClose={onCreateSpaceModalClose}
          onConfirm={(file) => handleSaveInnerImage(file)}
          confirmText="다음"
          requireSquare={true}
        />
      )}

      {createStep !== null && createStep === SpaceCreateStep.FillDetails && (
        <IconTitleModal
          onClose={onCreateSpaceModalClose}
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          icon={<IoPlanetOutline size={20} />}
          bgColor="white"
        >
          <SpaceDetailInfoStep
            innerImg={innerImg}
            detailInfo={{
              title: title,
              description: description
            }}
            onSubmit={(newTitle, newDescription) => {
              setTitle(newTitle);
              setDescription(newDescription);
            }}
          />
        </IconTitleModal>
      )}
    </div>
  );
}
