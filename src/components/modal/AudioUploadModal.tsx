import React, { ChangeEvent, ReactNode, useState } from "react";
import { PiMusicNotesPlusLight } from "react-icons/pi";
import { BiSave } from "react-icons/bi";
import IconTitleModal from "./IconTitleModal";
import AudioLight from "../Sound/AudioLight";

interface AudioUploadModalProps {
  onClose: () => void;
  onConfirm: (file: File) => void;

  title: string;
  description: string;
  labelText: string;
  subLabelText: string;
  confirmText: string;
  maxFileSizeMB: number;
  customFooter?: ReactNode;
}

export default function AudioUploadModal({
  onClose,
  onConfirm,
  title,
  description,
  labelText,
  subLabelText,
  confirmText,
  maxFileSizeMB,
  customFooter,
}: AudioUploadModalProps) {
  const [thumbMusic, setThumbMusic] = useState<File | null>(null);
  const [previewMusic, setPreviewMusic] = useState<string | null>(null);
  const [warning, setWarning] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const setData = (file: File) => {
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setWarning(`${maxFileSizeMB}MB 이하만 업로드 가능합니다.`);
      setThumbMusic(null);
      setPreviewMusic(null);
      return;
    }

    setWarning("");
    setThumbMusic(file);
    setPreviewMusic(URL.createObjectURL(file));
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
    if (thumbMusic) onConfirm(thumbMusic);
    else{
      setWarning(`데이터를 업로드 해주세요.`);
    }
  };

  return (
    <IconTitleModal
      onClose={onClose}
      title={title}
      description={description}
      icon={<PiMusicNotesPlusLight size={24} />}
      bgColor="white"
    >
      <div
        className={`w-130 h-100 flex justify-center items-center border-2 border-dashed rounded-md p-10 text-center transition-all duration-200 ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center w-full">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="thumbMusicUpload"
            onChange={handleFileChange}
          />
          <label htmlFor="thumbMusicUpload" className="cursor-pointer">
            <PiMusicNotesPlusLight
              className="inline-flex mb-7.5 text-gray-500"
              size={40}
            />

            {thumbMusic == null && (
              <>
                <p>
                  {labelText}
                  <br />
                  이곳에 드래그하거나 클릭해서 업로드하세요.
                </p>
                <p className="mt-3 mb-6 text-gray-400 text-sm">
                  {subLabelText}
                </p>
              </>
            )}
          </label>

          {thumbMusic && (
            <div className="mt-2 text-green-700 text-sm font-medium">
              {thumbMusic.name} 업로드됨
            </div>
          )}

          {previewMusic && (
            <div className="w-[80%] min-w-[300px] mt-4">
              <AudioLight
                audioUrl={previewMusic}
                audioTitle={thumbMusic?.name || "썸네일 음악 미리듣기"}
              />
            </div>
          )}

          {warning && (
            <div className="mt-1 text-sm text-warning font-normal">
              {warning}
            </div>
          )}
        </div>
      </div>

      {/* ✅ 하단 버튼 */}
      <div className="flex justify-end mt-3 mr-1">
        {customFooter ? (
          customFooter
        ) : (
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary text-primary hover:opacity-70 transition cursor-pointer"
          >
            <BiSave size={18} />
            {confirmText}
          </button>
        )}
      </div>
    </IconTitleModal>
  );
}
