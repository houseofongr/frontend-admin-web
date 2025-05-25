import { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { PiImagesThin } from "react-icons/pi";
import { AOO_COLOR } from "../../../constants/color";
import API_CONFIG from "../../../config/api";
import { FaRegSave } from "react-icons/fa";


interface ThumbnailEditProps {
  universeId: number;
}

export default function UniverseThumbnailEdit({universeId}: ThumbnailEditProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [warning, setWarning] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    console.log(selected);

    if (selected) handleFile(selected);
  };

  const handleFile = (selected: File) => {
    if (selected.size > 2 * 1024 * 1024) {
      setFile(null);
      setWarning(
        "이미지 크기가 2MB를 초과했습니다. 2MB 이하 이미지를 업로드하세요."
      );
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(selected);
    img.src = objectUrl;

    if (img.width > img.height) {
      setFile(null);
      setWarning("이미지가 정방향이 아닙니다.");
      return;
    }

    img.onload = () => {
      setFile(selected);
      setWarning(""); // 정방향이면 경고 메시지 없음

      URL.revokeObjectURL(objectUrl);
    };
  };

  const saveThumbnailHandler = async () => {
    console.log("universeId ", universeId, "fileName ", file?.name);
    
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
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url); // 메모리 해제
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  return (
    <div className="flex flex-col">
      <div
        className={`border-2 border-dashed rounded-md p-10 text-center transition-all duration-200 ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileUpload"
          onChange={handleFileChange}
        />

        <label htmlFor="fileUpload" className="cursor-pointer block">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="미리보기"
              className="mx-auto max-h-60 rounded-md mb-4"
            />
          ) : (
            <PiImagesThin
              className="inline-flex mb-5 text-gray-500"
              size={50}
            />
          )}

          <p>이미지 파일을 이곳에 드래그하거나 클릭해서 업로드하세요.</p>
          <p className="mb-6 text-gray-400 text-sm">
            이미지는 정방향 크기에 2MB 이하만 가능합니다.
          </p>
        </label>

        {/* 업로드 메시지 */}
        {file && (
          <div className={`mt-2 text-green-700 text-sm font-medium`}>
            {file.name} 업로드됨
          </div>
        )}
        {warning && (
          <div className={`mt-1 text-sm text-warning font-normal`}>
            {warning}
          </div>
        )}
      </div>

      {/* 저장 버튼 (우측 하단 고정) */}
      {file && (
        <div className="flex justify-end mt-4 px-5">
          <button
            className={`flex bg-primary flex-row items-center hover:opacity-90 cursor-pointer text-white px-4 py-2 rounded-lg shadow-sm gap-2`}
            onClick={saveThumbnailHandler}
          >
            <FaRegSave /> 저장
          </button>
        </div>
      )}
    </div>
  );
}