import React, { ChangeEvent, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { BiSave } from "react-icons/bi";
import UniverseModal from "../../../modal/UniverseModal";
import InnerImgStep from "../universeCreate/InnerImgStep";
import { checkFileSize, checkImageIsSquare } from "../../../../utils/fileValidator";

interface InnerImageEditModalProps {
  onClose: () => void;
  handleSaveInnerImage: (file: File) => void;
}

export default function InnerImageEditModal({
  onClose,
  handleSaveInnerImage,
}: InnerImageEditModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [warning, setWarning] = useState("");
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);

  const [innerImg, setInnerImg] = useState<File | null>(null);

  // 드래그 업로드
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setData(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  // 이미지 업로드 및 검증
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData(file);
  };

  const setData = async (file: File) => {
    if (!checkFileSize(file, 5)) {
      setWarning("5MB 이하만 업로드 가능합니다.");
      setInnerImg(null);
      return;
    }

    const isSquare = await checkImageIsSquare(file);
    if (!isSquare) {
      setWarning("이미지가 정방형이 아닙니다.");
      setInnerImg(null);
      return;
    }

    setWarning("");
    setInnerImg(file);
    setPreviewInnerImg(URL.createObjectURL(file));

  }

  const saveThumbMusic = () => {
    if (innerImg)
      handleSaveInnerImage(innerImg);
  }


  return (
    <UniverseModal
      onClose={onClose}
      title="유니버스 이미지 수정"
      description="내부 이미지를 변경할 수 있습니다."
      icon={<IoCloudUploadOutline size={20} />}
      bgColor="white"
    >
      <div
        className={`w-130 h-100 flex justify-center items-center border-2 border-dashed rounded-md p-10 text-center transition-all duration-200 ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <InnerImgStep
          innerImg={innerImg}
          previewInnerImg={previewInnerImg}
          warning={warning}
          onFileChange={handleFileChange}
        />
      </div>

      <div className="flex justify-end mt-3 mr-1">
        <button
          onClick={saveThumbMusic}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary text-primary hover:opacity-70 transition"
        >
          <BiSave size={18} />
          저장
        </button>
      </div>
    </UniverseModal>
  );
}
