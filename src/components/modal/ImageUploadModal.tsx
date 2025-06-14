import React, { ChangeEvent, ReactNode, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { BiSave } from "react-icons/bi";
import IconTitleModal from "./IconTitleModal";
import { checkFileSize, checkImageIsSquare } from "../../utils/fileValidator";
import { PiImagesThin } from "react-icons/pi";

interface ImageUploadModalProps {
  onClose: () => void;
  onConfirm: (file: File) => void;

  title: string;
  description: string;
  labelText: string;
  confirmText: string;
  maxFileSizeMB: number;
  requireSquare: boolean;
  customFooter?: ReactNode;
}

export default function ImageUploadModal({
  onClose,
  onConfirm,
  title,
  description,
  labelText,
  confirmText,
  maxFileSizeMB,
  requireSquare,
  customFooter,
}: ImageUploadModalProps) {
  const [innerImg, setInnerImg] = useState<File | null>(null);
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);
  const [warning, setWarning] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const setData = async (file: File) => {
    if (!checkFileSize(file, maxFileSizeMB)) {
      setWarning(`${maxFileSizeMB}MB 이하만 업로드 가능합니다.`);
      setInnerImg(null);
      return;
    }

    if (requireSquare) {
      const isSquare = await checkImageIsSquare(file);
      if (!isSquare) {
        setWarning("이미지가 정방형이 아닙니다.");
        setInnerImg(null);
        return;
      }
    }
    setWarning("");
    setInnerImg(file);
    setPreviewInnerImg(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setData(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setData(file);
  };

  const handleConfirm = () => {
    // 지원
    if (innerImg) onConfirm(innerImg);
  };

  return (
    <IconTitleModal
      onClose={onClose}
      title={title}
      description={description}
      icon={<IoCloudUploadOutline size={24} />}
      bgColor="white"
    >
      <div
        className={`w-130 h-100 flex justify-center items-center border-2 border-dashed rounded-md p-10 text-center transition-all duration-200 ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="innerImgUpload"
            onChange={handleFileChange}
          />

          <label
            htmlFor="innerImgUpload"
            className="flex flex-col justify-center items-center cursor-pointer"
          >
            {previewInnerImg ? (
              <img
                src={previewInnerImg}
                alt="미리보기"
                className="w-30 h-30 rounded-md mb-4"
              />
            ) : (
              <PiImagesThin
                className="inline-flex mb-5 text-gray-500"
                size={50}
              />
            )}
            <p>
              {labelText}로 사용할 이미지를
              <br />
              이곳에 드래그하거나 클릭해서 업로드하세요.
            </p>
            <p className="mt-3 mb-6 text-gray-400 text-sm">
              이미지는 {requireSquare ? "정방형 크기에 " : ""}
              {maxFileSizeMB}MB 이하만 가능합니다.
            </p>
          </label>

          {innerImg && (
            <div className="mt-2 text-green-700 text-sm font-medium">
              {innerImg.name} 업로드됨
            </div>
          )}
          {warning && (
            <div className="mt-1 text-sm text-warning font-normal">
              {warning}
            </div>
          )}
        </div>
      </div>

      {/* ✅ 하단 버튼 영역: 커스텀 없으면 기본 버튼 보여줌 */}
      <div className="flex justify-end mt-3 mr-1">
        {customFooter ? (
          customFooter
        ) : (
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary text-primary hover:opacity-70 transition cursor-pointer"
          >
            <BiSave size={18} />
            저장
          </button>
        )}
      </div>
    </IconTitleModal>
  );
}