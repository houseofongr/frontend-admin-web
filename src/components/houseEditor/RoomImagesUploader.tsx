import React from "react";
import ContainerTitle from "../ContainerTitle";
import FileName from "./FileName";
import { IoAlertCircle } from "react-icons/io5";
import { useImageContext } from "../../context/ImageContext";
import FileUploadButton from "../common/buttons/FileUploadButton";
import { ROOM_NAME_MAX_LENGTH } from "../../constants/formDataMaxLength";

export default function RoomImagesUploader() {
  const { borderImage, roomImages, updateRoomZIndex, handleFileChange, updateRoomTitle } = useImageContext();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, "room");
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    if (newTitle.length > ROOM_NAME_MAX_LENGTH) {
      alert(`하우스 룸 타이틀은 최대 ${ROOM_NAME_MAX_LENGTH}자까지 입력 가능합니다.`);
      return;
    }
    updateRoomTitle(index, newTitle);
  };

  const handleZIndexChange = (index: number, zIndex: number) => {
    updateRoomZIndex(index, zIndex);
  };

  return (
    <div className="rounded-2xl py-3 px-7 bg-[#F8EFE6] ">
      <ContainerTitle stepText="세번째" headingText="하우스의 룸 이미지" />

      <div className="flex flex-col items-center">
        <input
          type="file"
          id="rooms-img"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={!borderImage}
        />
        <FileUploadButton htmlFor="rooms-img" />
        {!borderImage && (
          <div className="flex items-start gap-1 ">
            <div className="flex-shrink-0 pt-[14px]">
              <IoAlertCircle color="#FF6347" />
            </div>

            <p className="text-red-500 text-sm mt-3">테두리 이미지를 먼저 업로드해주세요.</p>
          </div>
        )}
      </div>

      {roomImages.map((room, index) => (
        <div key={index} className="mt-2 mb-4">
          <div className="flex items-center mb-2">
            <FileName fileName={room.file.name} />
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              id={`room-title-${index + 1}`}
              className="p-2 w-full rounded text-sm bg-white"
              placeholder={`룸${index + 1} 타이틀 입력하세요`}
              value={room.title}
              onChange={(e) => handleTitleChange(index, e.target.value)}
            />

            <div className="flex-center my-3 w-full gap-1 ">
              <span className="text-xs font-medium ">{room.z || 5}</span>

              <input
                type="range"
                min="1"
                max="10"
                value={room.z || 5}
                className="w-3/4 h-[6px] bg-gray-400 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                style={{
                  background: "#727070",
                }}
                onChange={(e) => handleZIndexChange(index, parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
