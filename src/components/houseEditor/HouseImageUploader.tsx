import React, { useState } from "react";
import ContainerTitle from "../ContainerTitle";
import HouseImageInfoForm from "./HouseInfoForm";
import { useImageContext } from "../../context/ImageContext";
import AlertMessage, { AlertType } from "../common/ModalAlertMessage";
import FileUploadButton from "../common/buttons/FileUploadButton";
import Button from "../common/buttons/Button";
import FileName from "./FileName";
import { HOUSE_NAME_MAX_LENGTH } from "../../constants/formDataMaxLength";

export default function HouseImageUploader() {
  const { houseImage, setHouseImage, handleFileChange } = useImageContext();
  const [fileName, setFileName] = useState<string>("");
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, "house");
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleHouseInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (houseImage) {
      if (value.length > HOUSE_NAME_MAX_LENGTH) {
        setAlert({ text: `하우스 ${name}의 길이는 ${HOUSE_NAME_MAX_LENGTH}까지 가능합니다.`, type: "warning" });
      }
      setHouseImage((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const fields = [
    {
      id: "house-title",
      name: "title",
      label: "House Title",
      isSingleLine: true,
      value: houseImage?.title || "",
    },
    {
      id: "house-author",
      name: "author",
      label: "Author",
      isSingleLine: true,
      value: houseImage?.author || "",
    },
    {
      id: "house-description",
      name: "description",
      label: "Description",
      isSingleLine: false,
      value: houseImage?.description || "",
    },
  ];
  return (
    <>
      {alert && (
        <AlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => setAlert(null)} />}
        />
      )}
      <div className="rounded-2xl py-3 px-7 bg-[#F8EFE6] border border-neutral-200 min-h-fit ">
        <ContainerTitle stepText="첫번째" headingText="하우스 프로필 이미지" />

        <div className="flex flex-col items-center gap-6 ">
          <input type="file" id="house-img" className="hidden" accept="image/*" onChange={handleFileUpload} />
          <FileUploadButton htmlFor="house-img" />
          <div className="w-full flex text-start">{fileName && <FileName fileName={fileName} />}</div>
        </div>

        {houseImage && <HouseImageInfoForm fields={fields} onChange={handleHouseInfoChange} />}
      </div>
    </>
  );
}
