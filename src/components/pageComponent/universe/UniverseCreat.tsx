import { useState, useEffect } from "react";
import { PiImagesThin } from "react-icons/pi";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { PiMusicNotesPlusDuotone } from "react-icons/pi";
import { PiMusicNotesPlusThin } from "react-icons/pi";
import { PiMusicNotesPlusLight } from "react-icons/pi";

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
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  const [thumbMusic, setThumbMusic] = useState<File | null>(null);
  const [previewMusic, setPreviewMusic] = useState<string | null>(null);

  const [innerImg, setInnerImg] = useState<File | null>(null);
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      handleImgFile(droppedFiles[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    console.log(selected);

    if (selected) handleImgFile(selected);
  };
  const handleThumbMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    console.log(selected);

    if (selected) handleImgFile(selected);
  };

  const handleImgFile = (selected: File) => {
    if (selected.size > 2 * 1024 * 1024) {
      setThumbnail(null);
      setWarning(
        "이미지 크기가 2MB를 초과했습니다. 2MB 이하 이미지를 업로드하세요."
      );
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(selected);
    img.src = objectUrl;

    if (img.width > img.height) {
      setThumbnail(null);
      setWarning("이미지가 정방향이 아닙니다.");
      return;
    }

    img.onload = () => {
      setThumbnail(selected);
      setWarning(""); // 정방향이면 경고 메시지 없음

      URL.revokeObjectURL(objectUrl);
    };
  };

  const saveThumbnailHandler = async () => {
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

  // 미리보기 URL 생성
  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setPreviewThumbnail(url);

      return () => {
        URL.revokeObjectURL(url); // 메모리 해제
      };
    } else {
      setPreviewThumbnail(null);
    }
  }, [thumbnail]);

  return (
    <div className="flex flex-col">
      {step !== CreateStep.DetailInfo && (
        <div
          className={`border-2 border-dashed rounded-md p-10 text-center transition-all duration-200 ${
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
              onFileChange={handleThumbnailChange}
            />
          )}

          {step === CreateStep.ThumbMusic && (
            <>
              <ThumbMusicStep
                thumbMusic={thumbMusic}
                warning={warning}
                onFileChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected && selected.size <= 2 * 1024 * 1024) {
                    setThumbMusic(selected);
                    setWarning("");
                  } else {
                    setThumbMusic(null);
                    setWarning("2MB 이하 음원만 업로드할 수 있습니다.");
                  }
                }}
              />
            </>
          )}

          {step === CreateStep.InnerImg && (
            <>
              <InnerImgStep
                innerImg={innerImg}
                previewInnerImg={previewInnerImg}
                warning={warning}
                onFileChange={(e) => {}}
              />
            </>
          )}
        </div>
      )}
      {step === CreateStep.DetailInfo && (
        <>
          <DetailInfoStep />
        </>
      )}

      {/* 저장 버튼 (우측 하단 고정) */}
      <div className="flex justify-end mt-4 px-5">
        <button
          className={`hover:opacity-80 cursor-pointer text-primary`}
          onClick={saveThumbnailHandler}
        >
          <IoArrowForwardCircleOutline size={30} />
        </button>
      </div>
    </div>
  );
}
