import { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import API_CONFIG from "../../../config/api";
import { RiImageEditFill, RiFileDownloadLine } from "react-icons/ri";
import WaveformWithAudioLightRow from "../../../components/Sound/WaveformWithAudioLightRow";
import ContextMenu from "../../../components/ContextMenu";

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
      if (thumbMusicId != -1) {
        const soundUrl = `${API_CONFIG.PUBLIC_AUDIO_LOAD_API}/attachment/${thumbMusicId}`;
        window.location.href = soundUrl;
      }
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

  const menuItems = [
    {
      label: "오디오 수정",
      icon: <RiImageEditFill size={20} />,
      onClick: onEdit,
    },
    {
      label: "오디오 다운로드",
      icon: <RiFileDownloadLine size={20} />,
      onClick: handleDownloadMusic,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="h-full w-full relative text-left group flex justify-center"
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="z-50 absolute cursor-pointer top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity  duration-300"
      >
        <BiDotsVerticalRounded size={20} />
      </button>

      <ContextMenu
        open={open}
        onClose={() => setOpen(false)}
        items={menuItems}
      />

      <div className="w-full">
        {thumbMusicId != -1 && (
          <WaveformWithAudioLightRow
            audioUrl={`${API_CONFIG.PUBLIC_AUDIO_LOAD_API}/${thumbMusicId}`}
            audioTitle={thumbMusicId == null ? "" : ""}
          />
        )}
      </div>
    </div>
  );
}
