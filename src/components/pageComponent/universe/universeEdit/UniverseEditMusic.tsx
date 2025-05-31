import { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import API_CONFIG from "../../../../config/api";
import { RiImageEditFill, RiFileDownloadLine } from "react-icons/ri";
import WaveformWithAudioLightRow from "../../../Sound/WaveformWithAudioLightRow";

interface UniverseEditMusicProps {
  thumbMusicId: number;
  onEdit: () => void;
}

export default function UniverseEditMusic({
  thumbMusicId,
  onEdit,
}: UniverseEditMusicProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDownloadMusic = async () => {
    try {


      const imageUrl = `${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/${thumbMusicId}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url); // 메모리 해제
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
    }
  };
  // 외부 클릭 감지 후 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="h-full relative text-left group flex justify-center"
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="absolute cursor-pointer top-1 right-1 w-7 h-7 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <BiDotsVerticalRounded size={20} />
      </button>

      {open && (
        <div
          className="absolute right-2 top-6 z-10 mt-2 w-48 bg-white shadow-lg rounded-md "
          onMouseLeave={() => setOpen(false)}
        >
          <ul className="py-1 text-sm text-gray-700">
            <li
              onClick={onEdit}
              className="flex flex-row px-4 py-2 hover:bg-gray-100 cursor-pointer "
            >
              <RiImageEditFill size={20} className="text-gray-500 mr-5" />
              <p>오디오 수정</p>
            </li>
            <li
              onClick={handleDownloadMusic}
              className="flex flex-row px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <RiFileDownloadLine size={20} className="text-gray-500 mr-5" />
              <p>오디오 다운로드</p>
            </li>
          </ul>
        </div>
      )}

      <WaveformWithAudioLightRow
        audioUrl={`${API_CONFIG.PUBLIC_AUDIO_LOAD_API}/${thumbMusicId}`}
        audioTitle={thumbMusicId == null ? "" : ""}
      />
    </div>
  );
}
