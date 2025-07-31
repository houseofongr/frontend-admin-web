import { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import API_CONFIG from "../../../config/api";
import { RiImageEditFill, RiFileDownloadLine } from "react-icons/ri";
// import WaveformWithAudioDarkRow from "../../../components/Sound/WaveformWithAudioDarkRow";
import ContextMenu from "../../../components/ContextMenu";
import ThumbMusicEditModal from "./ThumbMusicEditModal";
import { patchUniverseThumbMusicEdit } from "../../../service/universeService";
import { useUniverseStore } from "../../../context/useUniverseStore";
import { AlertType } from "../../../components/modal/ModalAlertMessage";
import AudioWaveform from "../../../components/Sound/V2/AudioWaveform";
import WaveformWithAudioDarkRow from "../../../components/Sound/WaveformWithAudioDarkRow";

interface UniverseEditMusicProps {
  showAlert: (
    text: string,
    alertType: AlertType,
    subText: string | null
  ) => void;
  thumbMusicId: number;
  setThumbMusicId: (newMusicId: number) => void;
}

export default function UniverseEditMusic({
  showAlert,
  thumbMusicId,
  setThumbMusicId,
}: UniverseEditMusicProps) {
  const { universeId } = useUniverseStore();

  const [open, setOpen] = useState(false);
  const [showThumbMusicEdit, setShowThumbMusicEdit] = useState(false);

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

  const handleSaveThumbMusic = (file: File) => {
    setShowThumbMusicEdit(false);
    saveThumbMusic(file);
  };

  // 썸네일 뮤직 저장
  const saveThumbMusic = async (file: File) => {
    try {
      var response = await patchUniverseThumbMusicEdit(universeId!, file);
      setThumbMusicId(response.newThumbMusicId);
      showAlert("변경사항이 저장되었습니다.", "success", null);
    } catch {
      showAlert("저장 중 오류가 발생했습니다.", "fail", null);
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
      onClick: () => setShowThumbMusicEdit(true),
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
        className="z-10 absolute cursor-pointer top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity  duration-300 hover:opacity-70"
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
          <>
            {/* <WaveformWithAudioDarkRow
              audioUrl={`${API_CONFIG.PUBLIC_AUDIO_LOAD_API}/${thumbMusicId}`}
              audioTitle={thumbMusicId == null ? "" : ""}
            /> */}
            <AudioWaveform
              audioUrl={`${API_CONFIG.PUBLIC_AUDIO_LOAD_API}/${thumbMusicId}`}
              mode="dark"
              layoutDirection="row"
            />
          </>
        )}
      </div>

      {showThumbMusicEdit && (
        <ThumbMusicEditModal
          onClose={() => setShowThumbMusicEdit(false)}
          handleSaveThumbMusic={handleSaveThumbMusic}
        />
      )}
    </div>
  );
}
