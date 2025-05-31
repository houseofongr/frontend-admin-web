import React, { ChangeEvent, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { BiSave } from "react-icons/bi";
import UniverseModal from "../../../modal/UniverseModal";
import ThumbMusicStep from "../universeCreate/ThumbMusicStep";
import { checkFileSize } from "../../../../utils/fileValidator";

interface InnerImageEditModalProps {
  onClose: () => void;
  handleSaveThumbMusicImage: (file: File) => void;
}

export default function ThumbMusicEditModal({
  onClose,
  handleSaveThumbMusicImage,
}: InnerImageEditModalProps) {

  const [thumbMusic, setThumbMusic] = useState<File | null>(null);
  const [previewThumMusic, setPreviewThumbMusic] = useState<string | null>(null);

  const [warning, setWarning] = useState("");

  const [dragOver, setDragOver] = useState(false);

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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setData(file);
  };

  const setData = (file: File) => {
    const urlsToRevoke: string[] = [];

    if (!checkFileSize(file, 2)) {
      setWarning("2MB 이하 음원만 업로드할 수 있습니다.");
      setThumbMusic(null);
    } else {
      setThumbMusic(file);
      setWarning("");

      const url = URL.createObjectURL(file);
      setPreviewThumbMusic(url);
      urlsToRevoke.push(url);
    }
  }

  const saveThumbMusic = () => {
    if (thumbMusic)
      handleSaveThumbMusicImage(thumbMusic);
  }


  return (
    <UniverseModal
      onClose={onClose}
      title="유니버스 썸뮤직 수정"
      description="유니버스의 썸뮤직를 변경할 수 있습니다."
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
        <ThumbMusicStep
          thumbMusic={thumbMusic}
          previewMusic={previewThumMusic}
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

