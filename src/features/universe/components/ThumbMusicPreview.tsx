import AudioLight from "../../../components/Sound/AudioLight";
import API_CONFIG from "../../../config/api";

interface ThumbnailEditProps {
  thumbMusicId: number;
  onClose: () => void;
}

export default function ThumbMusicPreview({ thumbMusicId, onClose }: ThumbnailEditProps) {

  return (
    <div>
      <AudioLight
        audioUrl={`${API_CONFIG.PUBLIC_AUDIO_LOAD_API}/${thumbMusicId}`}
        audioTitle={"썸네일 음악 미리듣기"}
      />
    </div>
  );
}
