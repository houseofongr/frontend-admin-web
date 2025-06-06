import { useState, useEffect } from "react";
import {
  IoArrowForwardCircleOutline,
  IoArrowBackCircleOutline,
} from "react-icons/io5";
import { BiSave } from "react-icons/bi";

import ThumbnailStep from "../create/ThumbnailStep";
import ThumbMusicStep from "../create/ThumbMusicStep";
import InnerImgStep from "../create/InnerImgStep";
import DetailInfoStep from "../create/DetailInfoStep";

import API_CONFIG from "../../../config/api";
import ModalAlertMessage, { AlertType } from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";
import { checkFileSize, checkImageIsSquare } from "../../../utils/fileValidator";
import { UserV2 } from "../../../types/user";
import { UniverseCreateStep } from "../../../constants/ProcessSteps";

interface ThumbnailEditProps {
  onClose: () => void;
}

export default function UniverseCreate({ onClose }: ThumbnailEditProps) {
  // 상태 관리
  const [dragOver, setDragOver] = useState(false);
  const [warning, setWarning] = useState("");
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(
    null
  );
  const [step, setStep] = useState<UniverseCreateStep>(UniverseCreateStep.Thumbnail);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbMusic, setThumbMusic] = useState<File | null>(null);
  const [innerImg, setInnerImg] = useState<File | null>(null);

  const [detailInfo, setDetailInfo] = useState<{
    title: string;
    description: string;
    authorId: UserV2 | null;
    category: string;
    publicStatus: string;
    hashtags: string[];
  }>({
    title: "",
    description: "",
    authorId: null,
    category: "",
    publicStatus: "",
    hashtags: [],
  });

  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewMusic, setPreviewMusic] = useState<string | null>(null);
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);

  // 필수 데이터 체크 함수
  const hasRequiredData = () => {
    if (!thumbnail || !thumbMusic || !innerImg) return false;

    const { title, description, authorId, category, publicStatus } = detailInfo;

    if (
      !title.trim() ||
      !description.trim() ||
      !authorId ||
      !category.trim() ||
      !publicStatus.trim()
    ) {
      return false;
    }

    return true;
  };

  // 파일 처리 함수
  const handleFileProcess = async (file: File, step: UniverseCreateStep) => {
    switch (step) {
      case UniverseCreateStep.Thumbnail:
        if (!checkFileSize(file, 2)) {
          setWarning("이미지 크기가 2MB를 초과했습니다.");
          setThumbnail(null);
          return;
        }
        try {
          const isSquare = await checkImageIsSquare(file);
          if (!isSquare) {
            setWarning("이미지가 정방형이 아닙니다.");
            setThumbnail(null);
            return;
          }
          setThumbnail(file);
          setWarning("");
        } catch {
          setWarning("이미지를 확인하는 중 오류가 발생했습니다.");
          setThumbnail(null);
        }
        break;

      case UniverseCreateStep.ThumbMusic:
        if (!checkFileSize(file, 2)) {
          setWarning("2MB 이하 음원만 업로드할 수 있습니다.");
          setThumbMusic(null);
        } else {
          setThumbMusic(file);
          setWarning("");
        }
        break;

      case UniverseCreateStep.InnerImg:
        if (!checkFileSize(file, 100)) {
          setWarning("이미지 크기가 100MB를 초과했습니다.");
          setInnerImg(null);
          return;
        }
        try {
          const isSquare = await checkImageIsSquare(file);
          if (!isSquare) {
            setWarning("이미지가 정방형이 아닙니다.");
            setInnerImg(null);
            return;
          }
          setInnerImg(file);
          setWarning("");
        } catch {
          setWarning("이미지를 확인하는 중 오류가 발생했습니다.");
          setInnerImg(null);
        }
        break;

      default:
        break;
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file, step);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  // input[type="file"] 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file, step);
  };

  // detailInfo 변경 핸들러
  const handleDetailChange = (data: {
    title: string;
    description: string;
    authorId: UserV2;
    category: string;
    publicStatus: string;
    hashtags: string[];
  }) => {
    setDetailInfo(data);
  };

  // 다음 단계 버튼
  const onNextClick = () => {
    switch (step) {
      case UniverseCreateStep.Thumbnail:
        setStep(UniverseCreateStep.ThumbMusic);
        break;
      case UniverseCreateStep.ThumbMusic:
        setStep(UniverseCreateStep.InnerImg);
        break;
      case UniverseCreateStep.InnerImg:
        setStep(UniverseCreateStep.DetailInfo);
        break;
    }
  };

  // 이전 단계 버튼
  const onBackClick = () => {
    switch (step) {
      case UniverseCreateStep.ThumbMusic:
        setStep(UniverseCreateStep.Thumbnail);
        break;
      case UniverseCreateStep.InnerImg:
        setStep(UniverseCreateStep.ThumbMusic);
        break;
      case UniverseCreateStep.DetailInfo:
        setStep(UniverseCreateStep.InnerImg);
        break;
    }
  };

  // 미리보기 URL 생성 및 정리
  useEffect(() => {
    const urlsToRevoke: string[] = [];

    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setPreviewThumbnail(url);
      urlsToRevoke.push(url);
    } else setPreviewThumbnail(null);

    if (thumbMusic) {
      const url = URL.createObjectURL(thumbMusic);
      setPreviewMusic(url);
      urlsToRevoke.push(url);
    } else setPreviewMusic(null);

    if (innerImg) {
      const url = URL.createObjectURL(innerImg);
      setPreviewInnerImg(url);
      urlsToRevoke.push(url);
    } else setPreviewInnerImg(null);

    return () => {
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbnail, thumbMusic, innerImg]);

  // 제출 함수
  const handleSubmit = async () => {
    if (!hasRequiredData()) {
      showAlert("모든 필수 항목을 입력해주세요.", "fail");
      return;
    }

    if (!thumbnail || !thumbMusic || !innerImg) return;

    const formData = new FormData();

    const metadata = {
      title: detailInfo.title,
      description: detailInfo.description,
      authorId: detailInfo.authorId?.id,
      category: detailInfo.category,
      publicStatus: detailInfo.publicStatus,
      hashtags: detailInfo.hashtags,
    };

    formData.append("innerImage", innerImg);
    formData.append("thumbnail", thumbnail);
    formData.append("thumbMusic", thumbMusic);
    formData.append("metadata", JSON.stringify(metadata));


    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/universes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage =
          "새로운 유니버스 데이터를 생성하는데 실패하였습니다.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("JSON 파싱 오류:", jsonError);
        }
        showAlert(errorMessage, "fail");
        return;
      }

      showAlert("새로운 유니버스가 성공적으로 저장되었습니다.", "success");
    } catch (error) {
      showAlert(
        `데이터 저장 중 오류가 발생하였습니다. error: ${error}`,
        "fail"
      );
    }
  };

  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };

  return (
    <div className="flex flex-col">
      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => { setAlert(null); onClose(); }} />}
        />
      )}

      {step !== UniverseCreateStep.DetailInfo && (
        <div
          className={`w-130 h-100 flex justify-center items-center border-2 border-dashed rounded-md p-10 text-center transition-all duration-200 ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {step === UniverseCreateStep.Thumbnail && (
            <ThumbnailStep
              thumbnail={thumbnail}
              previewUrl={previewThumbnail}
              warning={warning}
              onFileChange={handleFileChange}
            />
          )}

          {step === UniverseCreateStep.ThumbMusic && (
            <>
              <ThumbMusicStep
                thumbMusic={thumbMusic}
                previewMusic={previewMusic}
                warning={warning}
                onFileChange={handleFileChange}
              />
            </>
          )}

          {step === UniverseCreateStep.InnerImg && (
            <>
              <InnerImgStep
                innerImg={innerImg}
                previewInnerImg={previewInnerImg}
                warning={warning}
                onFileChange={handleFileChange}
              />
            </>
          )}
        </div>
      )}

      {step === UniverseCreateStep.DetailInfo && (
        <>
          <DetailInfoStep
            innerImg={innerImg}
            thumbMusic={thumbMusic}
            detailInfo={detailInfo}
            onChange={handleDetailChange}
          />
        </>
      )}

      {/* 저장 버튼 (우측 하단 고정) */}
      <div
        className={`flex mt-4 px-5 ${step !== UniverseCreateStep.Thumbnail ? "justify-between" : "justify-end"
          }`}
      >
        {step !== UniverseCreateStep.Thumbnail && (
          <button
            className="hover:opacity-80 cursor-pointer text-primary"
            onClick={onBackClick}
          >
            <IoArrowBackCircleOutline size={30} />
          </button>
        )}

        {((step === UniverseCreateStep.Thumbnail && thumbnail) ||
          (step === UniverseCreateStep.ThumbMusic && thumbMusic) ||
          (step === UniverseCreateStep.InnerImg && innerImg)) && (
            <button
              className="hover:opacity-80 cursor-pointer text-primary"
              onClick={onNextClick}
            >
              <IoArrowForwardCircleOutline size={30} />
            </button>
          )}

        {step === UniverseCreateStep.DetailInfo && hasRequiredData() && (
          <button
            className="border-2 rounded-full p-1 hover:opacity-80 cursor-pointer text-primary"
            onClick={handleSubmit}
          >
            <BiSave size={30} />
          </button>
        )}
      </div>
    </div>
  );
}
