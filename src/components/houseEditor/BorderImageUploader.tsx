import React, { useState } from "react";
import FileName from "./FileName";
import ContainerTitle from "../ContainerTitle";
import { IoAlertCircle } from "react-icons/io5";
import { useImageContext } from "../../context/ImageContext";
import FileUploadButton from "../common/buttons/FileUploadButton";

export default function BorderImageUploader() {
  const { handleFileChange, borderImage } = useImageContext();
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, "border");
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="rounded-2xl py-3 px-7 bg-[#F8EFE6] ">
      <ContainerTitle stepText="두번째" headingText="하우스의 테두리 이미지" />
      <div className="flex flex-col items-center gap-1">
        <input type="file" id="border-img" className="hidden" accept="image/*" onChange={handleFileUpload} />
        <FileUploadButton htmlFor="border-img" />
        {!borderImage && (
          <div className="flex items-start gap-1 ">
            <div className="flex-shrink-0 pt-[14px]">
              <IoAlertCircle color="#FF6347" />
            </div>

            <p className="text-red-500 text-sm mt-3">5000 x 5000 사이즈의 테두리 이미지를 업로드해주세요.</p>
          </div>
        )}

        <div className="w-full flex text-start pt-4">{fileName && <FileName fileName={fileName} />}</div>
      </div>
    </div>
  );
}
