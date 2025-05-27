import { useState, useEffect } from "react";
import {
  IoArrowForwardCircleOutline,
  IoArrowBackCircleOutline,
} from "react-icons/io5";
import { BiSave } from "react-icons/bi";
import ThumbnailStep from "./universeCreate/ThumbnailStep";
import ThumbMusicStep from "./universeCreate/ThumbMusicStep";
import InnerImgStep from "./universeCreate/InnerImgStep";
import DetailInfoStep from "./universeCreate/DetailInfoStep";

interface ThumbnailEditProps {
  universeId: number;
}

enum CreateStep {
  Thumbnail,
  ThumbMusic,
  InnerImg,
  DetailInfo,
}

export default function UniverseCreat({ universeId }: ThumbnailEditProps) {
  const [dragOver, setDragOver] = useState(false);
  const [warning, setWarning] = useState("");
  const [step, setStep] = useState<CreateStep>(CreateStep.Thumbnail);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbMusic, setThumbMusic] = useState<File | null>(null);
  const [innerImg, setInnerImg] = useState<File | null>(null);
  const [detailInfo, setDetailInfo] = useState<{
    title: string;
    description: string;
    isPublic: boolean;
    tags: string[];
  }>({
    title: "",
    description: "",
    isPublic: true,
    tags: [],
  });

  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewMusic, setPreviewMusic] = useState<string | null>(null);
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);

  const handleFileProcess = async (file: File, step: CreateStep) => {
    switch (step) {
      // 썸네일 추가
      case CreateStep.Thumbnail:
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

      // 썸뮤직 추가
      case CreateStep.ThumbMusic:
        if (!checkFileSize(file, 2)) {
          setWarning("2MB 이하 음원만 업로드할 수 있습니다.");
          setThumbMusic(null);
        } else {
          setThumbMusic(file);
          setWarning("");
        }
        break;

      // 내부 이미지 추가
      case CreateStep.InnerImg:
        if (!checkFileSize(file, 5)) {
          setWarning("이미지 크기가 5MB를 초과했습니다.");
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

  // ✅ 드래그 앤 드롭 핸들러
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

  // ✅ input[type="file"] 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file, step);
  };

  // 파일 사이즈 체크
  const checkFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  const checkImageIsSquare = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img.width === img.height);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("이미지 로드 실패"));
      };

      img.src = objectUrl;
    });
  };

  const onNextClick = async () => {
    if (step === CreateStep.Thumbnail) setStep(CreateStep.ThumbMusic);
    else if (step === CreateStep.ThumbMusic) setStep(CreateStep.InnerImg);
    else if (step === CreateStep.InnerImg) setStep(CreateStep.DetailInfo);
    else if (step === CreateStep.DetailInfo) console.log("저장!");

    // console.log("universeId ", universeId, "fileName ", file?.name);

    // if (!file) {
    //   console.log("업로드할 이미지 파일을 선택해주세요.", "fail");
    //   return;
    // }
    // try {
    //   const formData = new FormData();
    //   formData.append("thumbnail", file);

    //   const response = await fetch(
    //     `${API_CONFIG.BACK_API}/admin/universes/thumbnail/${universeId}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
  };
  const onBackClick = () => {
    if (step === CreateStep.ThumbMusic) setStep(CreateStep.Thumbnail);
    else if (step === CreateStep.InnerImg) setStep(CreateStep.ThumbMusic);
    else if (step === CreateStep.DetailInfo) setStep(CreateStep.InnerImg);
  };

  // 미리보기 URL 생성
  useEffect(() => {
    const urlsToRevoke: string[] = [];

    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setPreviewThumbnail(url);
      urlsToRevoke.push(url);
    } else {
      setPreviewThumbnail(null);
    }

    if (thumbMusic) {
      const url = URL.createObjectURL(thumbMusic);
      setPreviewMusic(url);
      urlsToRevoke.push(url);
    } else {
      setPreviewMusic(null);
    }

    if (innerImg) {
      const url = URL.createObjectURL(innerImg);
      setPreviewInnerImg(url);
      urlsToRevoke.push(url);
    } else {
      setPreviewInnerImg(null);
    }

    return () => {
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbnail, thumbMusic, innerImg]);

  const handleDetailChange = (data: {
    title: string;
    description: string;
    isPublic: boolean;
    tags: string[];
  }) => {
    setDetailInfo(data);
  };

  const handleSubmit = () => {
    console.log("저장 데이터:", detailInfo);
    console.log("썸네일 ", thumbnail);
    console.log("썸뮤직 ", thumbMusic);
    console.log("내부 이미지", innerImg);

  };

  return (
    <div className="flex flex-col">
      {step !== CreateStep.DetailInfo && (
        <div
          className={`w-130 h-100 flex justify-center items-center border-2 border-dashed rounded-md p-10 text-center transition-all duration-200 ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {step === CreateStep.Thumbnail && (
            <ThumbnailStep
              thumbnail={thumbnail}
              previewUrl={previewThumbnail}
              warning={warning}
              onFileChange={handleFileChange}
            />
          )}

          {step === CreateStep.ThumbMusic && (
            <>
              <ThumbMusicStep
                thumbMusic={thumbMusic}
                previewMusic={previewMusic}
                warning={warning}
                onFileChange={handleFileChange}
              />
            </>
          )}

          {step === CreateStep.InnerImg && (
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
      {step === CreateStep.DetailInfo && (
        <>
          <DetailInfoStep
            innerImg={innerImg}
            thumbMusic={thumbMusic}
            thumbnail={thumbnail}
            onChange={handleDetailChange}
          />
        </>
      )}

      {/* 저장 버튼 (우측 하단 고정) */}
      <div
        className={`flex mt-4 px-5 ${
          step !== CreateStep.Thumbnail ? "justify-between" : "justify-end"
        }`}
      >
        {step !== CreateStep.Thumbnail && (
          <button
            className="hover:opacity-80 cursor-pointer text-primary"
            onClick={onBackClick}
          >
            <IoArrowBackCircleOutline size={30} />
          </button>
        )}
        {((step === CreateStep.Thumbnail && thumbnail) ||
          (step === CreateStep.ThumbMusic && thumbMusic) ||
          (step === CreateStep.InnerImg && innerImg)) && (
          <button
            className="hover:opacity-80 cursor-pointer text-primary"
            onClick={onNextClick}
          >
            <IoArrowForwardCircleOutline size={30} />
          </button>
        )}

        {thumbnail && thumbMusic && innerImg && detailInfo.title != "" && (
          <button
            className="border-2 rounded-full p-1 hover:opacity-80 cursor-pointer text-primary"
            onClick={handleSubmit}
          >
            <BiSave size={30} />
          </button>

          // <button
          // className="flex flex-row items-center gap-2"
          // // className="border-2 rounded-full p-1 bg-primary hover:opacity-80 cursor-pointer text-white"
          // onClick={handleSubmit}
          // >
          // <BiSave
          //   size={30}
          //   className="border-2 rounded-full p-1 hover:opacity-80 cursor-pointer text-primary"
          // />
          // <p className="text-lg text-primary">SAVE</p>
          // </button>
        )}
      </div>
    </div>
  );
}

